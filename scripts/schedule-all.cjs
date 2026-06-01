/**
 * Gooodsky Cron 调度器
 * 注册所有定时任务，保持进程运行
 *
 * 用法: node scripts/schedule-all.cjs
 *
 * 注册任务:
 *   - 每 5 分钟:  检查 Fiverr 订单
 *   - 每天 9:00:   CEO 日报
 *   - 每 30 分钟:  服务健康检查
 */
const cron = require('node-cron');
const { exec } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const SCRIPTS = path.join(__dirname);
const LOG_DIR = path.join(ROOT, 'logs');

fs.mkdirSync(LOG_DIR, { recursive: true });

// ====================== 工具 ======================

function now() {
  return new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
}

function log(msg) {
  const line = `[${now()}] ${msg}`;
  console.log(line);
  // 同时写日志文件
  const date = new Date().toISOString().slice(0, 10);
  fs.appendFileSync(path.join(LOG_DIR, `cron-${date}.log`), line + '\n');
}

function runScript(scriptName, args = '') {
  return new Promise((resolve) => {
    const cmd = `node "${path.join(SCRIPTS, scriptName)}" ${args}`;
    log(`执行: ${scriptName}`);

    exec(cmd, { cwd: ROOT, timeout: 120000 }, (err, stdout, stderr) => {
      if (stdout) {
        stdout.split('\n').filter(Boolean).forEach(l => log(`  [${scriptName}] ${l}`));
      }
      if (stderr) {
        stderr.split('\n').filter(Boolean).forEach(l => log(`  [${scriptName} ERR] ${l}`));
      }
      if (err) {
        log(`  [${scriptName}] 退出码: ${err.code}`);
      }
      resolve({ scriptName, code: err?.code || 0 });
    });
  });
}

// ====================== 健康检查 ======================

function pingService(name, url) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: 5000 }, (res) => {
      resolve({ name, url, online: true, status: res.statusCode });
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

async function runHealthCheck() {
  log('🏥 执行健康检查...');
  const services = [
    { name: 'ToolClub 主站', url: 'http://localhost:3000' },
    { name: 'ToolClubOne',  url: 'http://localhost:3001' },
    { name: 'ToolClubTwo',  url: 'http://localhost:3002' },
  ];

  const results = await Promise.all(services.map(s => pingService(s.name, s.url)));
  const online = results.filter(r => r.online).length;
  const offline = results.filter(r => !r.online);

  results.forEach(r => {
    const icon = r.online ? '🟢' : '🔴';
    log(`  ${icon} ${r.name}: ${r.online ? `HTTP ${r.status}` : r.error}`);
  });

  if (offline.length > 0) {
    log(`⚠️ ${offline.length} 个服务离线: ${offline.map(r => r.name).join(', ')}`);
  }

  log(`健康检查完成: ${online}/${services.length} 在线`);
}

// ====================== 注册定时任务 ======================

// 任务 1: 每 5 分钟检查 Fiverr 订单
// 避开整点和半点（减少峰值）: 第 3 分钟执行
cron.schedule('3,8,13,18,23,28,33,38,43,48,53,58 * * * *', async () => {
  await runScript('check-fiverr-orders.cjs');
}, { timezone: 'Asia/Shanghai' });

// 任务 2: 每天 9:00 CEO 日报
cron.schedule('7 9 * * *', async () => {
  log('📋 CEO 日报生成中...');
  await runScript('ceo-wakeup.mjs');
}, { timezone: 'Asia/Shanghai' });

// 任务 3: 每 30 分钟健康检查
// 第 17 分钟执行（错开峰值）
cron.schedule('17,47 * * * *', async () => {
  await runHealthCheck();
}, { timezone: 'Asia/Shanghai' });

// ====================== 启动 ======================

log('═══════════════════════════════════════');
log('Gooodsky Cron 调度器已启动');
log('───────────────────────────────────────');
log('  每 5 分钟  → 检查 Fiverr 订单');
log('  每天 9:00  → CEO 日报');
log('  每 30 分钟 → 服务健康检查');
log('═══════════════════════════════════════');
log('按 Ctrl+C 停止');

// 启动时立即执行一次健康检查
runHealthCheck();

// 保持进程运行
process.on('SIGINT', () => {
  log('调度器已停止');
  process.exit(0);
});
