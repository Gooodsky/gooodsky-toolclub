/**
 * Gig 1 Gallery 截图脚本
 * 生成 image2.png（首页全屏）和 image3.png（CTA 卡片区域）
 *
 * 用法: node scripts/gig1-screenshots.mjs
 * 前提: localhost:3000 已运行（cd apps/ToolClubone && npm run dev -p 3000）
 */

import { chromium } from 'playwright-core';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = 'C:/Users/Administrator/Desktop/Gooodsky/gig1-gallery';
const SERVER_URL = 'http://localhost:3000';
const VIEWPORT = { width: 1280, height: 769 };

// 确保输出目录存在
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const resp = await fetch(url);
      if (resp.ok || resp.status === 304) {
        console.log(`  [OK] 服务器就绪: ${url} (${resp.status})`);
        return true;
      }
    } catch (e) {
      // 服务器尚未就绪
    }
    await new Promise(r => setTimeout(r, 1000));
    process.stdout.write('.');
  }
  console.log(`\n  [ERROR] 服务器 ${url} 在 ${timeoutMs}ms 内未就绪`);
  return false;
}

async function main() {
  console.log('=== Gig 1 Gallery 截图 ===\n');

  // 1. 等待服务器就绪
  console.log('[1/3] 等待服务器就绪...');
  const serverReady = await waitForServer(SERVER_URL);
  if (!serverReady) {
    console.log('\n请先启动服务器:');
    console.log('  cd C:/Users/Administrator/ToolClub/apps/ToolClubone');
    console.log('  npm run dev -p 3000');
    process.exit(1);
  }

  // 2. 启动浏览器并截图
  console.log('\n[2/3] 启动 Playwright 浏览器...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,  // 2x 高清截图
  });
  const page = await context.newPage();

  try {
    // 访问首页
    console.log('  访问首页...');
    await page.goto(SERVER_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000); // 等待动画完成

    // 截图1: 首页全屏
    console.log('  截图 image2.png (全屏)...');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'image2.png'),
      fullPage: false, // 只截取视口范围 1280x769
    });
    console.log('  [OK] image2.png 已保存');

    // 截图2: CTA 卡片区域（两个产品卡片的网格容器）
    console.log('  截图 image3.png (CTA 卡片区域)...');

    // 多种选择器尝试定位卡片网格区域
    const selectors = [
      '.grid.w-full.max-w-2xl',           // 卡片网格容器
      'main .grid',                        // main 下的 grid
      '.grid.gap-4',                       // gap-4 的 grid
      'main > div:first-of-type',          // main 下的第一个 div (假设是内容区)
    ];

    let cardElement = null;
    for (const sel of selectors) {
      cardElement = await page.$(sel);
      if (cardElement) {
        console.log(`  使用选择器: ${sel}`);
        break;
      }
    }

    if (cardElement) {
      await cardElement.screenshot({
        path: path.join(OUTPUT_DIR, 'image3.png'),
      });
      console.log('  [OK] image3.png 已保存');
    } else {
      // 回退方案: 截取页面中间部分 (CTA 通常在首屏中间)
      console.log('  [WARN] 未找到卡片元素，使用视口裁剪作为回退');
      const clipHeight = 500;
      await page.screenshot({
        path: path.join(OUTPUT_DIR, 'image3.png'),
        clip: { x: 0, y: 100, width: 1280, height: clipHeight },
      });
      console.log('  [OK] image3.png 已保存 (视口裁剪回退)');
    }

    console.log('\n[3/3] 完成!');
    console.log(`  image2.png → ${OUTPUT_DIR}/image2.png`);
    console.log(`  image3.png → ${OUTPUT_DIR}/image3.png`);

  } catch (err) {
    console.error('  [ERROR] 截图失败:', err.message);
    // 尝试保存错误截图
    try {
      await page.screenshot({
        path: path.join(OUTPUT_DIR, 'image2-error.png'),
      });
      console.log('  已保存错误状态截图');
    } catch (_) {}
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
