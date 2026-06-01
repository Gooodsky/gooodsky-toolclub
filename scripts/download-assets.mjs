// Download all 视频魔方 product page assets
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = 'https://tcloud.marketingforce.com';
const OUT = join(__dirname, '..', 'public', 'images');

// Product page images (sorted by section)
const images = [
  // Hero / Banner
  'cn/product/tcloud/mod/spmf/images/banner_bg.png',
  'cn/product/tcloud/mod/spmf/images/banner_img.png',
  'cn/product/tcloud/mod/spmf/images/m_banner_bg.png',
  'cn/product/tcloud/mod/spmf/images/m_banner_img.png',

  // 五大痛点 carousel
  'cn/product/tcloud/mod/spmf/images/manage_01.png',
  'cn/product/tcloud/mod/spmf/images/manage_02.png',
  'cn/product/tcloud/mod/spmf/images/manage_03.png',
  'cn/product/tcloud/mod/spmf/images/manage_04.png',
  'cn/product/tcloud/mod/spmf/images/manage_05.png',

  // 六步运营方案
  'cn/product/tcloud/mod/spmf/images/bg_02.png',
  'cn/product/tcloud/mod/spmf/images/solution_img.png',
  'cn/product/tcloud/mod/spmf/images/solution_bg_01.png',
  'cn/product/tcloud/mod/spmf/images/solution_bg_02.png',

  // 短视频营销获客系统
  'cn/product/tcloud/mod/spmf/images/bg_03.png',
  'cn/product/tcloud/mod/spmf/images/syst_01.png',
  'cn/product/tcloud/mod/spmf/images/syst_02.png',
  'cn/product/tcloud/mod/spmf/images/syst_03.png',
  'cn/product/tcloud/mod/spmf/images/syst_04.png',

  // AI赋能
  'cn/product/tcloud/mod/spmf/images/bg_04.png',
  'cn/product/tcloud/mod/spmf/images/tisheng_01.png',
  'cn/product/tcloud/mod/spmf/images/tisheng_02.png',
  'cn/product/tcloud/mod/spmf/images/tisheng_03.png',
  'cn/product/tcloud/mod/spmf/images/tisheng_04.png',

  // 视频曝光
  'cn/product/tcloud/mod/spmf/images/bg_05.png',
  'cn/product/tcloud/mod/spmf/images/bg_06.png',
  'cn/product/tcloud/mod/spmf/images/sbox_01.png',
  'cn/product/tcloud/mod/spmf/images/sbox_02.png',
  'cn/product/tcloud/mod/spmf/images/sbox_03.png',
  'cn/product/tcloud/mod/spmf/images/sbox_04.png',

  // 子功能卡片
  'cn/product/tcloud/mod/spmf/images/tbox_01.png',
  'cn/product/tcloud/mod/spmf/images/tbox_02.png',
  'cn/product/tcloud/mod/spmf/images/tbox_03.png',
  'cn/product/tcloud/mod/spmf/images/tbox_icon_01.png',
  'cn/product/tcloud/mod/spmf/images/tbox_icon_02.png',
  'cn/product/tcloud/mod/spmf/images/tbox_icon_03.png',
  'cn/product/tcloud/mod/spmf/images/tbox_hover.png',

  // 人物剪影
  'cn/product/tcloud/mod/spmf/images/man_l.png',
  'cn/product/tcloud/mod/spmf/images/man_r.png',
  'cn/product/tcloud/mod/spmf/images/man_active_l.png',
  'cn/product/tcloud/mod/spmf/images/man_active_r.png',

  // Global nav/footer
  'cn/images/logo.png',
  'cn/images/min-logo.png',
  'cn/images/login.svg',
  'cn/images/login_hover.svg',
  'cn/images/login_min.svg',
  'cn/images/lang/l_en.svg',
  'cn/images/mfs.jpg',
  'cn/images/trueland.jpg',
  'enresource/images/logo_bom.png',
];

let count = 0;

async function download(url, outPath) {
  const fullUrl = url.startsWith('http') ? url : `${BASE}/${url}`;
  const dest = join(OUT, outPath);
  const dir = dirname(dest);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  try {
    const res = await fetch(fullUrl);
    if (!res.ok) { console.log(`  FAIL [${res.status}] ${outPath}`); return; }
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(dest, buf);
    count++;
    console.log(`  OK ${outPath} (${(buf.length / 1024).toFixed(1)}KB)`);
  } catch (e) {
    console.log(`  ERR ${outPath}: ${e.message}`);
  }
}

console.log('Downloading assets...\n');

// Download in batches of 4
const batchSize = 4;
for (let i = 0; i < images.length; i += batchSize) {
  const batch = images.slice(i, i + batchSize);
  await Promise.all(batch.map(url => download(url, url)));
}

console.log(`\nDone. ${count}/${images.length} images downloaded.`);
