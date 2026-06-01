import { launch, getDefaultStealthArgs } from 'cloakbrowser'

async function test() {
  console.log('Launching CloakBrowser...')

  const browser = await launch({
    headless: false,
    args: getDefaultStealthArgs(),
  })

  const page = await browser.newPage()

  // 测试：打开 Fiverr
  console.log('Opening Fiverr...')
  await page.goto('https://www.fiverr.com/', { waitUntil: 'networkidle', timeout: 30000 })

  const title = await page.title()
  console.log('Title:', title)

  // 截图
  await page.screenshot({ path: 'C:/Users/Administrator/Desktop/Gooodsky/fiverr-test.png' })
  console.log('Screenshot saved')

  await browser.close()
  console.log('Done!')
}

test().catch(e => {
  console.error('Error:', e.message)
  process.exit(1)
})
