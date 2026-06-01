import { chromium } from 'playwright-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

// 加载隐身插件
chromium.use(StealthPlugin())

async function test() {
  // 连接到用户已有的 Edge 浏览器（已登录 Fiverr）
  const browser = await chromium.connectOverCDP('http://localhost:9222')

  console.log('Connected to Edge browser')
  const contexts = browser.contexts()
  console.log('Browser contexts:', contexts.length)

  const page = contexts[0].pages()[0] || await contexts[0].newPage()
  await page.bringToFront()

  // 导航到 Fiverr
  console.log('Going to Fiverr...')
  await page.goto('https://www.fiverr.com/', { waitUntil: 'domcontentloaded', timeout: 20000 })

  const title = await page.title()
  console.log('Title:', title)

  // 截图
  await page.screenshot({ path: 'C:/Users/Administrator/Desktop/Gooodsky/fiverr-stealth.png' })
  console.log('Screenshot saved to desktop')

  await browser.close()
  console.log('Done!')
}

test().catch(e => {
  console.error('Error:', e.message)
  process.exit(1)
})
