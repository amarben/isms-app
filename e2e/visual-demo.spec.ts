import { test, expect } from '@playwright/test'

test.describe('Visual Demo - ISMS Application', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('should demonstrate SOA percentage update workflow', async ({ page }) => {
    // Step 1: Visit Dashboard
    console.log('📊 Step 1: Opening Dashboard...')
    await page.goto('/')
    await expect(page.getByText('ISMS Dashboard')).toBeVisible()

    // Wait to see dashboard
    await page.waitForTimeout(2000)

    // Step 2: Click on quick action to go to SOA
    console.log('📝 Step 2: Navigating to Statement of Applicability...')
    await page.getByRole('button', { name: /Review SOA Controls/i }).click()
    await page.waitForTimeout(2000)

    // Wait for SOA page to load
    await expect(page.getByText('Total Controls')).toBeVisible()
    await page.waitForTimeout(1000)

    // Step 3: Find the first control row and click it
    console.log('🔍 Step 3: Opening first control...')
    // Look for control buttons - they should have the control ID format
    const controlCards = page.locator('[class*="border"]').filter({ hasText: /A\.\d+\.\d+:/})
    const firstControl = controlCards.first()
    await firstControl.scrollIntoViewIfNeeded()
    await firstControl.click()
    await page.waitForTimeout(1500)

    // Step 4: Select "applicable" status
    console.log('✓ Step 4: Setting control as applicable...')
    const selects = page.locator('select')
    const statusSelect = selects.first()
    await statusSelect.scrollIntoViewIfNeeded()
    await statusSelect.selectOption('applicable')
    await page.waitForTimeout(1000)

    // Step 5: Fill in justification
    console.log('✍️ Step 5: Adding justification...')
    const justificationField = page.getByPlaceholder(/explain why/i).first()
    await justificationField.scrollIntoViewIfNeeded()
    await justificationField.fill('This control is required to protect our information assets and ensure compliance with ISO 27001')
    await page.waitForTimeout(1500)

    // Step 6: Set implementation status
    console.log('⚙️ Step 6: Setting implementation status...')
    // Find implementation status select (should be the second select)
    const implSelect = selects.nth(1)
    await implSelect.scrollIntoViewIfNeeded()
    await implSelect.selectOption('planned')
    await page.waitForTimeout(1000)

    // Step 7: Add responsible party
    console.log('👤 Step 7: Adding responsible party...')
    const responsibleField = page.getByPlaceholder(/responsible/i).first()
    if (await responsibleField.isVisible()) {
      await responsibleField.scrollIntoViewIfNeeded()
      await responsibleField.fill('Information Security Team')
      await page.waitForTimeout(1000)
    }

    // Wait for auto-save
    console.log('💾 Waiting for auto-save...')
    await page.waitForTimeout(2000)

    // Step 8: Navigate back to Dashboard
    console.log('🏠 Step 8: Returning to Dashboard...')
    await page.getByText('Dashboard').first().click()
    await page.waitForTimeout(2000)

    // Verify Dashboard loaded
    await expect(page.getByText('ISMS Dashboard')).toBeVisible()

    // Wait for calculations
    console.log('🧮 Waiting for Dashboard calculations...')
    await page.waitForTimeout(3000)

    // Step 9: Check the SOA step progress
    console.log('📈 Step 9: Checking SOA completion...')
    const soaSection = page.locator('text=SOA').locator('..')
    await expect(soaSection).toBeVisible()

    // Log the localStorage data for verification
    const soaData = await page.evaluate(() => {
      const data = localStorage.getItem('statementOfApplicability')
      if (!data) return null

      const parsed = JSON.parse(data)
      const documented = parsed.filter((c: any) => {
        const hasJustification = c.justification && c.justification.trim().length > 0
        if (!hasJustification) return false

        if (c.status === 'applicable' || c.status === 'partially-applicable') {
          const hasImplementationInfo =
            (c.implementationStatus && c.implementationStatus !== 'not-implemented') ||
            (c.implementationDescription && c.implementationDescription.trim().length > 0) ||
            (c.responsibleParty && c.responsibleParty.trim().length > 0)
          return hasImplementationInfo
        }

        return c.status === 'not-applicable'
      })

      return {
        total: parsed.length,
        documented: documented.length,
        percentage: Math.round((documented.length / parsed.length) * 100)
      }
    })

    console.log('✅ Results:', JSON.stringify(soaData, null, 2))

    if (soaData) {
      console.log(`✨ SOA Completion: ${soaData.documented}/${soaData.total} controls = ${soaData.percentage}%`)
      expect(soaData.documented).toBeGreaterThan(0)
      expect(soaData.percentage).toBeGreaterThan(0)
    }

    // Final wait to see the result
    await page.waitForTimeout(3000)
  })

  test('should navigate through all main sections', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('ISMS Dashboard')).toBeVisible()

    const sections = [
      { name: 'Continue Risk Assessment', wait: 2000 },
      { name: 'Manage Risk Treatment', wait: 2000 },
      { name: 'Review SOA Controls', wait: 2000 },
      { name: 'Plan Internal Audit', wait: 2000 }
    ]

    for (const section of sections) {
      console.log(`Navigating to: ${section.name}`)

      // Go to section
      const sectionButton = page.getByRole('button', { name: new RegExp(section.name, 'i') })
      await sectionButton.scrollIntoViewIfNeeded()
      await sectionButton.click()
      await page.waitForTimeout(section.wait)

      // Return to dashboard
      const dashboardLink = page.getByText('Dashboard').first()
      await dashboardLink.scrollIntoViewIfNeeded()
      await dashboardLink.click()
      await page.waitForTimeout(1500)
    }

    console.log('✅ Navigation tour complete!')
  })
})
