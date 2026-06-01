/**
 * Gooodsky Fiverr 订单监控
 * 使用 CloakBrowser + 持久化 session，无头模式检查新订单
 * 由 schedule-all.cjs 每 5 分钟调用一次
 */
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const INBOX = path.join(ROOT, 'inbox');
const PROFILE_DIR = path.join(ROOT, 'clk-profile');
const SESSION_FILE = path.join(ROOT, 'clk-session.json');

fs.mkdirSync(INBOX, { recursive: true });
fs.mkdirSync(PROFILE_DIR, { recursive: true });

// ====================== 数据库 ======================

let _sql = null;
async function getSql() {
  if (_sql) return _sql;
  // neon 是 ESM，dynamic import
  const dotenv = require('dotenv');
  dotenv.config({ path: path.join(ROOT, '.env') });
  const { neon } = await import('@neondatabase/serverless');
  _sql = neon(process.env.DATABASE_URL);
  return _sql;
}

// ====================== 辅助函数 ======================

function timestamp() {
  return new Date().toISOString();
}

function writeInbox(filename, data) {
  fs.writeFileSync(
    path.join(INBOX, filename),
    JSON.stringify(data, null, 2),
    'utf-8'
  );
  console.log(`[inbox] 已写入 ${filename}`);
}

/**
 * 检查订单是否已存在于数据库（按平台订单 ID 去重）
 */
async function orderExists(sql, platformOrderId) {
  const rows = await sql`
    SELECT id FROM orders
    WHERE requirements->>'platform_order_id' = ${platformOrderId}
    LIMIT 1
  `;
  return rows.length > 0;
}

// ====================== Fiverr 页面解析 ======================

/**
 * 尝试从 Fiverr 卖家后台提取订单列表
 * Fiverr 前端变化频繁，这里是通用的解析策略
 */
async function extractOrders(page) {
  // Fiverr 卖家订单页 URL
  const ordersUrl = 'https://www.fiverr.com/users/me/manage_orders';
  await page.goto(ordersUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000); // 等待动态渲染

  const orders = await page.evaluate(() => {
    const results = [];

    // 策略 1: 查找订单卡片/行（选择器随 Fiverr 更新调整）
    const selectors = [
      '.order-row',
      '.order-card',
      '[data-testid="order-row"]',
      '.manage-orders-list .order-item',
      'tr.order-row',
      '[class*="order"][class*="row"]',
    ];

    for (const sel of selectors) {
      const items = document.querySelectorAll(sel);
      if (items.length > 0) {
        items.forEach((el, idx) => {
          const text = el.innerText || '';
          const link = el.querySelector('a')?.href || '';
          // 尝试提取订单号
          const orderIdMatch = text.match(/#?FO\d{8,}/) || text.match(/Order\s*#?\s*(\w+)/i);
          const priceMatch = text.match(/\$\s*(\d+(?:\.\d{2})?)/);

          results.push({
            index: idx,
            platform_order_id: orderIdMatch ? orderIdMatch[1] || orderIdMatch[0] : `parsed_${idx}`,
            snippet: text.slice(0, 300),
            link,
            price_text: priceMatch ? priceMatch[0] : '',
          });
        });
        break; // 命中一种策略就停止
      }
    }

    // 策略 2: 如果常规选择器没命中，尝试全局扫描
    if (results.length === 0) {
      const bodyText = document.body?.innerText || '';
      const orderBlocks = bodyText.split(/order|ORDER/i);
      // 取前 20 个块
      for (let i = 1; i < Math.min(orderBlocks.length, 20); i++) {
        if (orderBlocks[i].trim().length > 10) {
          results.push({
            index: i,
            platform_order_id: `scan_${i}`,
            snippet: orderBlocks[i].trim().slice(0, 300),
            link: '',
            price_text: '',
          });
        }
      }
    }

    return results;
  });

  // 同时获取页面标题判断登录状态
  const title = await page.title();
  return { title, orders, url: await page.url() };
}

// ====================== 主逻辑 ======================

async function checkOrders() {
  console.log(`\n[${timestamp()}] 开始检查 Fiverr 订单...`);

  // 动态导入 CloakBrowser (ESM)
  const { launchPersistentContext, getDefaultStealthArgs } = await import('cloakbrowser');

  let browser;
  try {
    // 使用持久化上下文保存 cookies / session
    browser = await launchPersistentContext(PROFILE_DIR, {
      headless: true,
      args: getDefaultStealthArgs(),
    });
    const page = await browser.newPage();

    // ---------- 1. 先访问 Fiverr 首页检查登录状态 ----------
    await page.goto('https://www.fiverr.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const loggedIn = await page.evaluate(() => {
      // 检查是否有登录用户标识
      const signInBtn = document.querySelector('[data-login-link]');
      const userMenu = document.querySelector('[data-user-menu], .user-menu, [aria-label="User menu"]');
      const joinBtn = document.querySelector('a[href*="join"]');
      // 如果页面有 "Sign In" 按钮且没有用户菜单，则未登录
      const bodyText = document.body?.innerText?.slice(0, 500) || '';
      return !!(userMenu || bodyText.includes('Dashboard') || bodyText.includes('Switch to'));
    });

    if (!loggedIn) {
      console.warn('[fiverr] 未检测到登录状态！请在 CloakBrowser 中手动登录一次 Fiverr。');
      console.warn('[fiverr] 提示：运行 test-cloak.mjs (headless:false) 手动登录后，session 将保存到 clk-profile/');

      // 写入状态文件
      writeInbox('fiverr-login-needed.json', {
        ts: timestamp(),
        message: 'Fiverr 未登录，无法检查订单。请手动登录一次以保存 session。',
      });
      return;
    }

    console.log('[fiverr] 登录状态: OK');

    // ---------- 2. 提取订单 ----------
    const { title, orders, url } = await extractOrders(page);
    console.log(`[fiverr] 页面: ${title} (${url})`);
    console.log(`[fiverr] 发现 ${orders.length} 个潜在订单条目`);

    if (orders.length === 0) {
      console.log('[fiverr] 未发现订单条目（可能页面结构已变更）');
      return;
    }

    // ---------- 3. 去重 & 入库 ----------
    const sql = await getSql();
    let newCount = 0;

    for (const o of orders) {
      const exists = await orderExists(sql, o.platform_order_id);
      if (exists) continue;

      newCount++;
      console.log(`[fiverr] 新订单: ${o.platform_order_id}`);

      // 写入 Neon
      await sql`
        INSERT INTO orders (gig_type, package, amount, status, requirements)
        VALUES ('unknown', 'basic', 0, 'pending', ${JSON.stringify(o)})
      `;

      // 写入 inbox
      writeInbox(`new-order-fiverr-${o.platform_order_id}.json`, {
        source: 'fiverr_scraper',
        detected_at: timestamp(),
        platform_order_id: o.platform_order_id,
        snippet: o.snippet,
        link: o.link,
        raw: o,
      });
    }

    console.log(`[fiverr] 完成: 新订单 ${newCount} 个，总计扫描 ${orders.length} 个条目`);

  } catch (err) {
    console.error('[fiverr] 检查失败:', err.message);
    // 写入错误日志
    writeInbox('fiverr-check-error.json', {
      ts: timestamp(),
      error: err.message,
    });
  } finally {
    if (browser) {
      await browser.close();
      console.log('[fiverr] 浏览器已关闭');
    }
  }
}

// ====================== 入口 ======================

checkOrders()
  .then(() => {
    console.log('[fiverr] 检查完成');
    process.exit(0);
  })
  .catch((err) => {
    console.error('[fiverr] 致命错误:', err.message);
    process.exit(1);
  });
