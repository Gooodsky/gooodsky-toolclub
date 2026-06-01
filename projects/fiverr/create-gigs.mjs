import { chromium } from 'playwright-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { readFileSync } from 'fs'

chromium.use(StealthPlugin())

async function getPage() {
  const browser = await chromium.connectOverCDP('http://localhost:9222')
  const contexts = browser.contexts()
  const pages = contexts[0].pages()
  // 使用第一个页面或创建新页面
  const page = pages.length > 0 ? pages[0] : await contexts[0].newPage()
  await page.bringToFront()
  return { browser, page }
}

async function main() {
  const { page } = await getPage()

  // Step 1: 检查是否已是卖家
  console.log('Step 1: Checking seller status...')
  await page.goto('https://www.fiverr.com/users/gooodsky/manage_gigs', {
    waitUntil: 'domcontentloaded',
    timeout: 15000
  })

  const url = page.url()
  console.log('Current URL:', url)

  if (url.includes('seller_onboarding')) {
    console.log('Seller profile not set up yet. Please complete onboarding in Edge first.')
    console.log('Go to: https://www.fiverr.com/seller_onboarding/0')
    console.log('Complete the steps, then run this script again.')
    return
  }

  if (url.includes('manage_gigs')) {
    console.log('Seller dashboard loaded!')

    // Check existing gigs count
    const gigCount = await page.locator('[data-testid="gig-card"]').count()
    console.log('Existing gigs:', gigCount)

    // Take screenshot
    await page.screenshot({
      path: 'C:/Users/Administrator/Desktop/Gooodsky/fiverr-dashboard.png'
    })
    console.log('Dashboard screenshot saved.')

    // Step 2: Click "Create a New Gig" button
    console.log('\nStep 2: Looking for "Create a New Gig" button...')
    const createBtn = page.locator('a[href*="new_gig"], button:has-text("Create"), a:has-text("New Gig")').first()

    if (await createBtn.isVisible()) {
      console.log('Found create button, clicking...')
      await createBtn.click()
      await page.waitForLoadState('domcontentloaded')
      console.log('Gig creation page loaded:', page.url())
      await page.screenshot({
        path: 'C:/Users/Administrator/Desktop/Gooodsky/fiverr-create-gig.png'
      })
    } else {
      console.log('Create button not visible. Manual check needed.')
    }
  }

  console.log('\nDone! Check screenshots on desktop.')
}

main().catch(e => {
  console.error('Error:', e.message)
  process.exit(1)
})
