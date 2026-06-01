import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const sql = neon(process.env.DATABASE_URL);

async function init() {
  console.log('开始建表...\n');

  // 客户表
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255),
      name VARCHAR(255),
      platform VARCHAR(50) DEFAULT 'fiverr',
      platform_user_id VARCHAR(255),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('✓ customers 表已就绪');

  // 订单表
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER REFERENCES customers(id),
      gig_type VARCHAR(100),
      package VARCHAR(50),
      amount DECIMAL(10,2),
      status VARCHAR(50) DEFAULT 'pending',
      requirements TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      delivered_at TIMESTAMPTZ
    );
  `;
  console.log('✓ orders 表已就绪');

  // 项目/交付物表
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id),
      repo_url VARCHAR(500),
      deploy_url VARCHAR(500),
      status VARCHAR(50) DEFAULT 'in_progress',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('✓ projects 表已就绪');

  // 财务表
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id),
      amount DECIMAL(10,2),
      platform_fee DECIMAL(10,2),
      net_amount DECIMAL(10,2),
      recorded_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('✓ revenue 表已就绪');

  // Agent 任务日志
  await sql`
    CREATE TABLE IF NOT EXISTS agent_tasks (
      id SERIAL PRIMARY KEY,
      department VARCHAR(100),
      task_type VARCHAR(200),
      status VARCHAR(50),
      input JSONB,
      output JSONB,
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('✓ agent_tasks 表已就绪');

  console.log('\n全部 5 张表创建完成。');
  process.exit(0);
}

init().catch(err => {
  console.error('建表失败:', err);
  process.exit(1);
});
