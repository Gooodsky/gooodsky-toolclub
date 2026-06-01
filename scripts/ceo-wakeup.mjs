/**
 * Gooodsky CEO 自主唤醒循环
 * 读取 inbox + 查询数据库 + 检查服务健康 = CEO 早报
 *
 * 用法: node scripts/ceo-wakeup.mjs
 */
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

dotenv.config({ path: path.join(ROOT, '.env') });

const sql = neon(process.env.DATABASE_URL);
const INBOX = path.join(ROOT, 'inbox');

// ====================== 服务配置 ======================

const SERVICES = [
  { name: 'ToolClub 主站', port: 3000, url: 'http://localhost:3000' },
  { name: 'ToolClubOne',  port: 3001, url: 'http://localhost:3001' },
  { name: 'ToolClubTwo',  port: 3002, url: 'http://localhost:3002' },
];

// ====================== 工具 ======================

function now() {
  return new Date().toISOString();
}

function divider(char = '─', len = 60) {
  return char.repeat(len);
}

function pad(str, len) {
  return (str || '').padEnd(len);
}

// ====================== Step 1: 检查 inbox ======================

function checkInbox() {
  if (!fs.existsSync(INBOX)) {
    return { count: 0, files: [], message: 'inbox 目录不存在' };
  }

  const files = fs.readdirSync(INBOX)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const fullPath = path.join(INBOX, f);
      const stat = fs.statSync(fullPath);
      return { name: f, path: fullPath, mtime: stat.mtime, size: stat.size };
    })
    .sort((a, b) => b.mtime - a.mtime); // 最新在前

  // 分类
  const newOrders = files.filter(f => f.name.startsWith('new-order'));
  const errors = files.filter(f => f.name.includes('error'));
  const stripe = files.filter(f => f.name.startsWith('stripe'));
  const others = files.filter(f => !newOrders.includes(f) && !errors.includes(f) && !stripe.includes(f));

  return {
    count: files.length,
    newOrderCount: newOrders.length,
    errorCount: errors.length,
    stripeCount: stripe.length,
    recent: files.slice(0, 10),
    newOrders,
    errors,
    stripe,
    others,
  };
}

// ====================== Step 2: 数据库概览 ======================

async function checkDatabase() {
  const [orderStats] = await sql`
    SELECT
      COUNT(*)::int AS total_orders,
      COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_orders,
      COUNT(*) FILTER (WHERE status = 'in_progress')::int AS in_progress_orders,
      COUNT(*) FILTER (WHERE status = 'delivered')::int AS delivered_orders,
      COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours')::int AS orders_24h
    FROM orders
  `;

  const [revenueStats] = await sql`
    SELECT
      COALESCE(SUM(amount), 0) AS total_revenue,
      COALESCE(SUM(net_amount), 0) AS total_net,
      COUNT(*)::int AS revenue_records
    FROM revenue
  `;

  const [taskStats] = await sql`
    SELECT
      COUNT(*)::int AS total_tasks,
      COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
      COUNT(*) FILTER (WHERE status = 'failed')::int AS failed,
      COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours')::int AS tasks_24h
    FROM agent_tasks
  `;

  // 最新订单
  const recentOrders = await sql`
    SELECT id, gig_type, package, amount, status, created_at
    FROM orders
    ORDER BY created_at DESC
    LIMIT 5
  `;

  return { orderStats, revenueStats, taskStats, recentOrders };
}

// ====================== Step 3: 服务健康检查 ======================

function pingService(name, url) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: 5000 }, (res) => {
      // 任何响应（包括 404）都算在线
      resolve({ name, url, online: true, status: res.statusCode, time: 0 });
    });
    req.on('error', (err) => {
      resolve({ name, url, online: false, error: err.code || err.message });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ name, url, online: false, error: 'timeout' });
    });
  });
}

async function checkServices() {
  const results = await Promise.all(SERVICES.map(s => pingService(s.name, s.url)));
  return results;
}

// ====================== Step 4: 生成早报 ======================

function printReport(inbox, db, services) {
  const lines = [];
  const line = (s = '') => lines.push(s);

  line();
  line('╔══════════════════════════════════════════════════════════╗');
  line('║           Gooodsky CEO 日报 — Daily Briefing             ║');
  line('╚══════════════════════════════════════════════════════════╝');
  line();
  line(`  生成时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
  line(divider());

  // ---- Inbox ----
  line();
  line('📬 INBOX 状态');
  line(divider('─'));
  if (inbox.count === 0) {
    line('  ✅ 收件箱为空，无待处理事项');
  } else {
    line(`  ⚠️  共 ${inbox.count} 个待处理文件:`);
    if (inbox.newOrderCount > 0) line(`  🛒 新订单通知: ${inbox.newOrderCount} 个`);
    if (inbox.stripeCount > 0)    line(`  💰 Stripe 支付通知: ${inbox.stripeCount} 个`);
    if (inbox.errorCount > 0)     line(`  ❌ 错误日志: ${inbox.errorCount} 个`);
    line();
    line('  最近 5 个文件:');
    inbox.recent.slice(0, 5).forEach(f => {
      const age = Math.round((Date.now() - f.mtime.getTime()) / 60000);
      line(`    - ${f.name} (${age} 分钟前)`);
    });
  }

  // ---- 数据库 ----
  line();
  line('🗄️  数据库概览');
  line(divider('─'));
  const os = db.orderStats;
  line(`  订单总数: ${os.total_orders}  |  待处理: ${os.pending_orders}  |  进行中: ${os.in_progress_orders}  |  已交付: ${os.delivered_orders}`);
  line(`  24h 新订单: ${os.orders_24h}`);
  line();
  const rs = db.revenueStats;
  line(`  总收入: ¥${Number(rs.total_revenue).toFixed(2)}  |  净收入: ¥${Number(rs.total_net).toFixed(2)}`);
  line();

  if (db.recentOrders.length > 0) {
    line('  最新订单:');
    db.recentOrders.forEach(o => {
      const dt = o.created_at ? new Date(o.created_at).toLocaleDateString('zh-CN') : '?';
      line(`    #${o.id} ${o.gig_type} | ${o.package} | ¥${o.amount} | ${o.status} | ${dt}`);
    });
  }

  // ---- Agent Tasks ----
  const ts = db.taskStats;
  line();
  line(`🤖 Agent 任务: 总计 ${ts.total_tasks}  |  已完成 ${ts.completed}  |  失败 ${ts.failed}  |  24h ${ts.tasks_24h}`);

  // ---- 服务状态 ----
  line();
  line('🌐 服务健康检查');
  line(divider('─'));
  const allOnline = services.every(s => s.online);
  services.forEach(s => {
    const icon = s.online ? '🟢' : '🔴';
    const info = s.online ? `HTTP ${s.status}` : s.error;
    line(`  ${icon} ${pad(s.name, 20)} ${info}`);
  });
  line();
  if (allOnline) {
    line('  ✅ 所有服务正常运行');
  } else {
    const down = services.filter(s => !s.online).map(s => s.name).join(', ');
    line(`  🚨 以下服务离线: ${down}`);
  }

  line();
  line(divider());
  line();

  return lines.join('\n');
}

// ====================== 主入口 ======================

async function wakeup() {
  console.log('[CEO] Gooodsky 自主唤醒中...\n');

  // Step 1: Inbox
  const inbox = checkInbox();
  console.log(`[inbox] ${inbox.count} 个文件`);

  // Step 2: 数据库
  const db = await checkDatabase();
  console.log(`[db] ${db.orderStats.total_orders} 个订单, ¥${db.revenueStats.total_revenue} 收入`);

  // Step 3: 服务健康
  const services = await checkServices();
  const online = services.filter(s => s.online).length;
  console.log(`[health] ${online}/${services.length} 服务在线`);

  // Step 4: CEO 早报
  const report = printReport(inbox, db, services);
  console.log(report);

  // 如果有待处理事项，输出显眼提示
  if (inbox.count > 0) {
    const msg = `\n🔔 CEO WAKEUP: ${inbox.count} new items need attention 🔔\n`;
    console.log('\x1b[33m%s\x1b[0m', msg);
  }

  return { inbox, db, services };
}

wakeup()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[CEO] 唤醒失败:', err.message);
    process.exit(1);
  });
