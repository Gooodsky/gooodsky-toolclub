/**
 * Gig 1 Gallery 完整素材生成脚本
 * 生成 image2.png（首页全屏截图 1280x769）
 * 生成 image3.png（CTA 卡片区域截图）
 * 生成 portfolio.pdf（项目介绍 PDF）
 *
 * 用法: node scripts/gig1-generate-gallery.mjs
 * 前提: localhost:3000 已运行（cd apps/ToolClubone && npm run dev -p 3000）
 */

import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = 'C:/Users/Administrator/Desktop/Gooodsky/gig1-gallery';
const SERVER_URL = 'http://localhost:3000';
const VIEWPORT = { width: 1280, height: 769 };

// 确保输出目录存在
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ============================================================
// Portfolio PDF HTML 内容
// ============================================================
const PORTFOLIO_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1a1a2e;
    line-height: 1.7;
    padding: 48px 56px;
    max-width: 800px;
    margin: 0 auto;
  }
  .header {
    border-bottom: 3px solid #4D6BFE;
    padding-bottom: 24px;
    margin-bottom: 32px;
  }
  .logo {
    font-size: 28px;
    font-weight: 800;
    color: #4D6BFE;
    letter-spacing: -0.5px;
  }
  .subtitle {
    font-size: 14px;
    color: #666;
    margin-top: 8px;
  }
  h1 {
    font-size: 22px;
    font-weight: 700;
    margin: 28px 0 12px;
    color: #1a1a2e;
  }
  h2 {
    font-size: 16px;
    font-weight: 600;
    margin: 24px 0 8px;
    color: #4D6BFE;
  }
  p, li {
    font-size: 13px;
    color: #444;
    margin-bottom: 8px;
  }
  ul { padding-left: 20px; margin-bottom: 12px; }
  li { margin-bottom: 4px; }
  .tech-badge {
    display: inline-block;
    background: #4D6BFE10;
    color: #4D6BFE;
    border: 1px solid #4D6BFE30;
    border-radius: 6px;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 600;
    margin: 0 6px 8px 0;
  }
  .flow-step {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 16px;
  }
  .step-num {
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 50%;
    background: #4D6BFE;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
  }
  .divider {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 24px 0;
  }
  .footer {
    margin-top: 36px;
    padding-top: 16px;
    border-top: 1px solid #eee;
    font-size: 11px;
    color: #999;
    text-align: center;
  }
</style>
</head>
<body>

<div class="header">
  <div class="logo">ToolClub</div>
  <div class="subtitle">AI-Powered Website Clone &amp; Redesign Service</div>
</div>

<h1>Project Overview</h1>
<p>
  ToolClub is a comprehensive AI toolkit platform built for e-commerce professionals.
  The project demonstrates our website cloning and redesign capabilities — taking a
  reference design and rebuilding it with modern, production-grade technology.
  The resulting codebase is clean, type-safe, responsive, and ready for deployment
  on Vercel or any Node.js hosting platform.
</p>

<h2>Technology Stack</h2>
<div>
  <span class="tech-badge">Next.js 16</span>
  <span class="tech-badge">React 19</span>
  <span class="tech-badge">TypeScript</span>
  <span class="tech-badge">Tailwind CSS 4</span>
  <span class="tech-badge">shadcn/ui</span>
  <span class="tech-badge">Prisma ORM</span>
  <span class="tech-badge">SQLite</span>
  <span class="tech-badge">NextAuth.js</span>
  <span class="tech-badge">Lucide Icons</span>
  <span class="tech-badge">Vercel</span>
</div>

<h2>Clone &amp; Redesign Workflow</h2>

<div class="flow-step">
  <div class="step-num">1</div>
  <div>
    <strong>Visual Audit &amp; Analysis</strong>
    <p>We capture the target website's design tokens — colors, typography scale,
    spacing system, border radius, shadows — and document every interactive
    state (hover, active, focus, loading, error). Screenshots are taken at
    desktop, tablet, and mobile breakpoints.</p>
  </div>
</div>

<div class="flow-step">
  <div class="step-num">2</div>
  <div>
    <strong>Component Extraction</strong>
    <p>Each UI element is identified, categorized, and rebuilt as a React
    component. We match the original pixel-for-pixel: button variants, card
    layouts, form inputs, navigation patterns, modals, and micro-interactions.
    All components receive TypeScript prop types.</p>
  </div>
</div>

<div class="flow-step">
  <div class="step-num">3</div>
  <div>
    <strong>CSS Translation</strong>
    <p>The original styling is translated to Tailwind CSS 4 utility classes,
    utilizing the oklch color space for accurate color reproduction and
    consistent theming. Custom CSS is used only when Tailwind cannot express
    a specific visual behavior.</p>
  </div>
</div>

<div class="flow-step">
  <div class="step-num">4</div>
  <div>
    <strong>Responsive Implementation</strong>
    <p>Using a mobile-first approach, we implement breakpoints that match the
    original site's responsive behavior. Every component is tested across
    desktop (1280px), tablet (768px), and mobile (375px) viewports.</p>
  </div>
</div>

<div class="flow-step">
  <div class="step-num">5</div>
  <div>
    <strong>Quality Assurance</strong>
    <p>We run TypeScript strict-mode checks, ESLint analysis, and visual
    comparison against the original. Lighthouse audits ensure 90+ scores
    on Performance, Accessibility, Best Practices, and SEO.</p>
  </div>
</div>

<hr class="divider">

<h2>Deliverables</h2>
<ul>
  <li>Complete source code with TypeScript strict types</li>
  <li>Responsive design: Desktop + Tablet + Mobile</li>
  <li>SEO meta tags, Open Graph, and sitemap</li>
  <li>README with deployment instructions (Vercel one-click)</li>
  <li>Component documentation and code comments</li>
</ul>

<div class="footer">
  ToolClub &copy; 2026 &mdash; Built by Gooodsky Engineering
</div>

</body>
</html>`;

// ============================================================
// 辅助函数
// ============================================================
async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const resp = await fetch(url);
      if (resp.ok || resp.status === 304) {
        console.log(`  [OK] 服务器就绪 (${resp.status})`);
        return true;
      }
    } catch (e) { /* 等待 */ }
    await new Promise(r => setTimeout(r, 1000));
    process.stdout.write('.');
  }
  console.log(`\n  [ERROR] 服务器未在 ${timeoutMs}ms 内就绪`);
  return false;
}

async function takeScreenshots(browser) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log('  访问首页...');
  await page.goto(SERVER_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  // --- image2.png: 全屏截图 ---
  console.log('  截图 image2.png (1280x769 全屏)...');
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'image2.png'),
    fullPage: false,
  });
  const stat2 = fs.statSync(path.join(OUTPUT_DIR, 'image2.png'));
  console.log(`  [OK] image2.png (${(stat2.size / 1024).toFixed(0)} KB)`);

  // --- image3.png: CTA 卡片区域 ---
  console.log('  截图 image3.png (CTA 卡片区域)...');
  const cardSelectors = [
    '.grid.w-full.max-w-2xl',
    'main .grid',
    'main > div',
    '.grid',
    'main > div:first-of-type',
  ];

  let cardEl = null;
  for (const sel of cardSelectors) {
    cardEl = await page.$(sel);
    if (cardEl) {
      const box = await cardEl.boundingBox();
      if (box && box.height > 200) {
        console.log(`  使用选择器: "${sel}" (${box.width}x${box.height})`);
        break;
      }
      cardEl = null; // 太小，忽略
    }
  }

  if (cardEl) {
    await cardEl.screenshot({
      path: path.join(OUTPUT_DIR, 'image3.png'),
    });
  } else {
    // 回退: 截取中间区域
    console.log('  [WARN] 未找到卡片元素，使用裁剪回退');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'image3.png'),
      clip: { x: 0, y: 80, width: 1280, height: 500 },
    });
  }

  const stat3 = fs.statSync(path.join(OUTPUT_DIR, 'image3.png'));
  console.log(`  [OK] image3.png (${(stat3.size / 1024).toFixed(0)} KB)`);

  await context.close();
}

async function generatePDF(browser) {
  console.log('  生成 portfolio.pdf...');

  const context = await browser.newContext({ viewport: { width: 800, height: 1100 } });
  const page = await context.newPage();

  // 使用 data URI 加载 HTML
  const htmlBase64 = Buffer.from(PORTFOLIO_HTML, 'utf-8').toString('base64');
  await page.goto(`data:text/html;base64,${htmlBase64}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  await page.pdf({
    path: path.join(OUTPUT_DIR, 'portfolio.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
  });

  const stat = fs.statSync(path.join(OUTPUT_DIR, 'portfolio.pdf'));
  console.log(`  [OK] portfolio.pdf (${(stat.size / 1024).toFixed(0)} KB)`);

  await context.close();
}

// ============================================================
// 主流程
// ============================================================
async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║  Gig 1 Gallery 素材生成器            ║');
  console.log('╚══════════════════════════════════════╝\n');

  // 1. 检查服务器
  console.log('[1/3] 检查服务器连接...');
  const ready = await waitForServer(SERVER_URL);
  if (!ready) {
    console.log('\n请先启动开发服务器:');
    console.log('  cd C:/Users/Administrator/ToolClub/apps/ToolClubone');
    console.log('  npm run dev -p 3000');
    console.log('\n然后在另一个终端执行:');
    console.log('  node C:/Users/Administrator/ToolClub/scripts/gig1-generate-gallery.mjs');
    process.exit(1);
  }

  // 2. 启动浏览器
  console.log('\n[2/3] 启动 Playwright...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // 截图
    await takeScreenshots(browser);

    // PDF
    console.log('');
    await generatePDF(browser);

    // 完成
    console.log('\n[3/3] === 全部完成! ===');
    console.log(`  ${OUTPUT_DIR}/image2.png     - 首页全屏截图`);
    console.log(`  ${OUTPUT_DIR}/image3.png     - CTA 卡片区域截图`);
    console.log(`  ${OUTPUT_DIR}/portfolio.pdf  - 项目介绍 PDF`);

  } catch (err) {
    console.error('  [ERROR]', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
