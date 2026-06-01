// Screenshot all 3 gig cover HTML files to PNG using Playwright
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const gigs = [
  {
    name: 'gig1-clone',
    html: path.join(__dirname, 'gig1-clone', 'images', 'cover.html'),
    png: path.join(__dirname, 'gig1-clone', 'images', 'cover.png'),
  },
  {
    name: 'gig2-content',
    html: path.join(__dirname, 'gig2-content', 'images', 'cover.html'),
    png: path.join(__dirname, 'gig2-content', 'images', 'cover.png'),
  },
  {
    name: 'gig3-chatbot',
    html: path.join(__dirname, 'gig3-chatbot', 'images', 'cover.html'),
    png: path.join(__dirname, 'gig3-chatbot', 'images', 'cover.png'),
  },
];

async function screenshot(htmlPath, pngPath, name) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 769 });

  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
  console.log(`[${name}] Loading: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Small delay to ensure any fonts / images render
  await page.waitForTimeout(500);

  await page.screenshot({ path: pngPath, type: 'png' });
  console.log(`[${name}] Saved: ${pngPath}`);

  await browser.close();
}

async function main() {
  for (const gig of gigs) {
    try {
      await screenshot(gig.html, gig.png, gig.name);
    } catch (err) {
      console.error(`[${gig.name}] Failed:`, err.message);
    }
  }
  console.log('Done.');
}

main();
