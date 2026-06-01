import { chromium } from 'playwright-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

chromium.use(StealthPlugin())

const GIG = {
  title: 'I will clone and redesign any website into modern Next.js + Tailwind CSS code',
  category: 'Programming & Tech',
  subCategory: 'Web Development',
  tags: ['website clone', 'next js developer', 'tailwind css', 'website redesign', 'react frontend'],
}

async function main() {
  const browser = await chromium.connectOverCDP('http://localhost:9222')
  const page = browser.contexts()[0].pages().find(p => p.url().includes('manage_gigs/new'))
  if (!page) { console.log('Gig creation page not found!'); return }
  await page.bringToFront()

  // 自动关闭所有弹窗
  page.on('dialog', async dialog => {
    console.log('Dialog:', dialog.message())
    await dialog.accept()
  })

  // === Step 1: Fill Title ===
  console.log('Filling gig title...')
  const titleArea = page.locator('textarea[placeholder*="really good at"]').first()
  await titleArea.waitFor({ state: 'visible', timeout: 5000 })
  await titleArea.click()
  await titleArea.fill(GIG.title)
  console.log('Title filled')

  // === Step 2: Select Category ===
  console.log('Selecting category...')
  // Click the category dropdown (first react-select)
  const categorySelect = page.locator('#react-select-3491-input')
  await categorySelect.click()
  await page.waitForTimeout(500)
  // Type category name
  await categorySelect.fill(GIG.category)
  await page.waitForTimeout(1000)
  // Press Enter to select first option
  await page.keyboard.press('Enter')
  console.log('Category selected')
  await page.waitForTimeout(1000)

  // === Step 3: Select Sub-Category ===
  console.log('Selecting sub-category...')
  const subSelect = page.locator('#react-select-3492-input')
  await subSelect.click()
  await page.waitForTimeout(500)
  await subSelect.fill(GIG.subCategory)
  await page.waitForTimeout(1000)
  await page.keyboard.press('Enter')
  console.log('Sub-category selected')
  await page.waitForTimeout(1000)

  // === Step 4: Add Search Tags ===
  console.log('Adding search tags...')
  // Find the tag input
  const tagInput = page.locator('input[placeholder*="search tag"]').first()
  if (await tagInput.isVisible({timeout:3000})) {
    for (const tag of GIG.tags) {
      await tagInput.fill(tag)
      await page.waitForTimeout(500)
      await page.keyboard.press('Enter')
      console.log('Tag added:', tag)
      await page.waitForTimeout(300)
    }
  } else {
    console.log('Tag input not found, might need to scroll')
  }

  // Screenshot
  await page.screenshot({path:'C:/Users/Administrator/Desktop/Gooodsky/fiverr-gig1-filled.png'})
  console.log('General tab filled. Screenshot saved.')

  console.log('\nDone! Check Edge browser - the form should be filled.')
  console.log('Next: manually review and click "Save & Continue"')
}

main().catch(e => {
  console.error('Error:', e.message)
  process.exit(1)
})
