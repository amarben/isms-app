import { test } from '@playwright/test'

/**
 * Quick Visual Demo for Scope Creation Process
 *
 * This test demonstrates a shortened version of the scope creation workflow:
 * - Basic organization details
 * - Minimal issue selection
 * - Quick interested parties selection
 * - Video recording enabled
 *
 * To run this demo:
 * npm run demo:scope-quick
 * or
 * npx playwright test e2e/scope-creation-demo-quick.spec.ts --headed --project=chromium
 */

// Configure for visual demonstration with video recording
test.use({
  launchOptions: {
    slowMo: 500, // Slow down all actions by 500ms
  },
  video: 'on', // Enable video recording
})

test.describe('Visual Demo - Quick Scope Creation', () => {
  // Set timeout for quick demo - 2 minutes
  test.setTimeout(120000)

  test.beforeEach(async ({ page }) => {
    // Clear localStorage for fresh start
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.waitForTimeout(1000)
  })

  test('Quick Scope Creation Demo (Shortened Version)', async ({ page }) => {
    console.log('\n🎬 Starting Quick Demo: Scope Creation Overview\n')

    await page.goto('/')
    await page.waitForTimeout(1000)

    // Navigate to Scope via sidebar
    console.log('📍 Clicking "Define ISMS Scope" in sidebar...')
    const scopeMenuItem = page.locator('text=Define ISMS Scope').first()
    await scopeMenuItem.click()

    // Wait for navigation to complete - look for unique content on the scope page
    await page.waitForSelector('text=Step-by-step guide to defining your ISMS boundaries', { timeout: 10000 })
    await page.waitForTimeout(1500)

    // Quick fill org name
    console.log('✍️ Filling organization name...')
    const orgInput = page.getByPlaceholder(/e.g., Acme Corporation/i)
    await orgInput.click()
    await orgInput.clear()
    await orgInput.pressSequentially('Demo Company Ltd.', { delay: 80 })
    await page.waitForTimeout(1000)

    // Select 2 internal issues
    console.log('☑️ Selecting issues...')
    await page.evaluate(() => window.scrollTo(0, 800))
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: 'Sensitive R&D data requires high protection' }).click()
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: 'Customer data and privacy requirements' }).click()
    await page.waitForTimeout(1000)

    // Select 2 external issues
    await page.getByRole('button', { name: /Industry regulations/ }).first().click()
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: /Cybersecurity threats/ }).first().click()
    await page.waitForTimeout(1000)

    // Next step
    console.log('▶️ Moving to next step...')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: /Next Step/i }).click()
    await page.waitForTimeout(1500)

    // Select interested parties
    console.log('👥 Selecting interested parties...')
    await page.evaluate(() => window.scrollTo(0, 400))
    await page.waitForTimeout(500)
    await page.locator('text="Customers"').first().locator('..').click()
    await page.waitForTimeout(600)
    await page.locator('text="Employees"').first().locator('..').click()
    await page.waitForTimeout(1000)

    console.log('\n✅ Quick Demo Complete!\n')
    await page.waitForTimeout(2000)
  })
})
