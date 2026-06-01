import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const sql = neon(process.env.DATABASE_URL);

async function verify() {
  console.log('=== 数据库验证测试 ===\n');

  // 1. 插入测试客户
  const [customer] = await sql`
    INSERT INTO customers (email, name, platform, platform_user_id)
    VALUES ('test@gooodsky.com', '测试客户', 'fiverr', 'fiverr_12345')
    RETURNING *;
  `;
  console.log('✓ 插入客户:', customer.name, `(id=${customer.id})`);

  // 2. 插入测试订单
  const [order] = await sql`
    INSERT INTO orders (customer_id, gig_type, package, amount, status, requirements)
    VALUES (${customer.id}, 'landing-page', 'premium', 299.00, 'pending', '需要一个高端落地页，含 Three.js 粒子背景')
    RETURNING *;
  `;
  console.log('✓ 插入订单:', order.gig_type, `(id=${order.id}, ¥${order.amount})`);

  // 3. 插入测试项目
  const [project] = await sql`
    INSERT INTO projects (order_id, repo_url, deploy_url, status)
    VALUES (${order.id}, 'https://github.com/gooodsky/demo-landing', 'https://demo.gooodsky.com', 'in_progress')
    RETURNING *;
  `;
  console.log('✓ 插入项目:', project.status, `(id=${project.id})`);

  // 4. 插入测试财务记录
  const [rev] = await sql`
    INSERT INTO revenue (order_id, amount, platform_fee, net_amount)
    VALUES (${order.id}, 299.00, 59.80, 239.20)
    RETURNING *;
  `;
  console.log('✓ 插入财务记录: 净收入 ¥', rev.net_amount);

  // 5. 插入 Agent 任务日志
  const [task] = await sql`
    INSERT INTO agent_tasks (department, task_type, status, input, started_at)
    VALUES (
      'engineering',
      'db-init',
      'completed',
      '{"task": "初始化运营数据库"}',
      NOW()
    )
    RETURNING *;
  `;
  console.log('✓ 插入 Agent 任务:', task.task_type, `(id=${task.id})`);

  // 6. 查询验证所有表
  console.log('\n--- 数据汇总 ---');
  const customers = await sql`SELECT count(*) as cnt FROM customers`;
  const orders = await sql`SELECT count(*) as cnt FROM orders`;
  const projects = await sql`SELECT count(*) as cnt FROM projects`;
  const revenues = await sql`SELECT count(*) as cnt FROM revenue`;
  const tasks = await sql`SELECT count(*) as cnt FROM agent_tasks`;

  console.log(`customers:  ${customers[0].cnt} 行`);
  console.log(`orders:     ${orders[0].cnt} 行`);
  console.log(`projects:   ${projects[0].cnt} 行`);
  console.log(`revenue:    ${revenues[0].cnt} 行`);
  console.log(`agent_tasks: ${tasks[0].cnt} 行`);

  console.log('\n=== 验证通过，数据库连接正常 ===');
  process.exit(0);
}

verify().catch(err => {
  console.error('验证失败:', err);
  process.exit(1);
});
