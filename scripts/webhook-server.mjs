/**
 * Gooodsky Webhook 服务器
 * 监听 3456 端口，接收 Fiverr/Stripe 回调，写数据库 + inbox
 * 同时启动 ngrok 隧道暴露公网地址
 */
import express from 'express';
import { neon } from '@neondatabase/serverless';
import ngrok from 'ngrok';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

dotenv.config({ path: path.join(ROOT, '.env') });

const sql = neon(process.env.DATABASE_URL);
const INBOX = path.join(ROOT, 'inbox');
const PORT = 3456;

// 确保 inbox 存在
fs.mkdirSync(INBOX, { recursive: true });

const app = express();
app.use(express.json());

// ---------- 通用工具 ----------

function timestamp() {
  return new Date().toISOString();
}

function writeInbox(filename, data) {
  const p = path.join(INBOX, filename);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`[inbox] 已写入 ${filename}`);
}

// ---------- 端点 ----------

// 健康检查
app.get('/webhook/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), ts: timestamp() });
});

// Fiverr 订单通知
app.post('/webhook/fiverr', async (req, res) => {
  console.log('[fiverr] 收到回调:', JSON.stringify(req.body).slice(0, 500));
  try {
    const body = req.body;
    const orderId = body.order_id || body.id || `fvr_${Date.now()}`;
    const amount = parseFloat(body.amount || body.price || 0);
    const buyer = body.buyer || body.customer_name || 'unknown';
    const gig = body.gig || body.gig_type || 'unknown';

    // 写入 Neon
    const [customer] = await sql`
      INSERT INTO customers (name, platform, platform_user_id)
      VALUES (${buyer}, 'fiverr', ${String(body.buyer_id || '')})
      ON CONFLICT DO NOTHING
      RETURNING id;
    `;
    const customerId = customer?.id || null;

    const [order] = await sql`
      INSERT INTO orders (customer_id, gig_type, package, amount, status, requirements)
      VALUES (${customerId}, ${gig}, ${body.package || 'basic'}, ${amount}, 'pending', ${JSON.stringify(body)})
      RETURNING *;
    `;
    console.log('[fiverr] 订单已写入 DB, order_id=', order.id);

    // 写入 inbox（CEO 醒来检查）
    const inboxFile = `new-order-fiverr-${order.id}.json`;
    writeInbox(inboxFile, {
      source: 'fiverr_webhook',
      received_at: timestamp(),
      db_order_id: order.id,
      raw: body,
    });

    res.json({ ok: true, order_id: order.id });
  } catch (err) {
    console.error('[fiverr] 处理失败:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Stripe 支付通知
app.post('/webhook/stripe', async (req, res) => {
  console.log('[stripe] 收到回调:', JSON.stringify(req.body).slice(0, 500));
  try {
    const body = req.body;
    const eventType = body.type || 'unknown';
    const obj = body.data?.object || {};

    // 写入 inbox
    const inboxFile = `stripe-event-${Date.now()}.json`;
    writeInbox(inboxFile, {
      source: 'stripe_webhook',
      received_at: timestamp(),
      event_type: eventType,
      amount: obj.amount_total ? obj.amount_total / 100 : 0,
      raw: body,
    });

    // 如果是支付成功，记录到 revenue 表
    if (eventType === 'checkout.session.completed' || eventType === 'payment_intent.succeeded') {
      const amount = (obj.amount_total || obj.amount || 0) / 100;
      await sql`
        INSERT INTO revenue (order_id, amount, net_amount)
        VALUES (NULL, ${amount}, ${amount})
      `;
      console.log('[stripe] 收入已记录: ¥', amount);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('[stripe] 处理失败:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ---------- 启动 ----------

async function start() {
  // 1. 启动 Express
  app.listen(PORT, () => {
    console.log(`[webhook] 服务器已启动 http://localhost:${PORT}`);
    console.log(`[webhook] 端点:`);
    console.log(`  GET  /webhook/health`);
    console.log(`  POST /webhook/fiverr`);
    console.log(`  POST /webhook/stripe`);
  });

  // 2. 启动 ngrok 隧道
  try {
    const url = await ngrok.connect({
      addr: PORT,
      authtoken: process.env.NGROK_AUTHTOKEN,
    });
    console.log(`[ngrok] 公网隧道已建立: ${url}`);
    console.log(`[ngrok] Fiverr webhook URL: ${url}/webhook/fiverr`);
    console.log(`[ngrok] Stripe webhook URL: ${url}/webhook/stripe`);
  } catch (err) {
    console.warn('[ngrok] 隧道启动失败（若未配置 authtoken 属正常）:', err.message);
    console.warn('[ngrok] 服务器仍在本地运行，公网不可达');
  }
}

start().catch(err => {
  console.error('启动失败:', err);
  process.exit(1);
});
