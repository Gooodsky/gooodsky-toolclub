import { removeBackground } from '@imgly/background-removal-node';
import { writeFileSync } from 'fs';
import { pathToFileURL } from 'url';

const input = 'D:/Xiazai/banner_img.png';
const output = 'public/images/banner_img_new.png';

const fileUrl = pathToFileURL(input).href;
console.log('正在去除背景...');
const blob = await removeBackground(fileUrl);
const outBuffer = Buffer.from(await blob.arrayBuffer());
writeFileSync(output, outBuffer);
console.log(`完成: ${output} (${(outBuffer.length / 1024).toFixed(1)}KB)`);
