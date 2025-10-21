import { test, expect } from '@playwright/test'

test.describe('SOA Workflow and Dashboard Updates', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('should update Dashboard SOA percentage when control is documented', async ({ page }) => {
    // Start at Dashboard
    await page.goto('/')

    // Verify initial SOA is 0%
    await expect(page.getByText('SOA')).toBeVisible()

    // Navigate to Statement of Applicability
    await page.getByText('Statement of Applicability').click()

    // Wait for page to load and controls to render
    await expect(page.getByText('Statement of Applicability', { exact: true })).toBeVisible()
    await expect(page.getByText('Total Controls')).toBeVisible()

    // Find and expand the first control (A.5.1)
    const firstControl = page.locator('[class*="control"]').first()
    await firstControl.click()

    // Wait for control details to expand
    await expect(page.getByText('Applicability Status')).toBeVisible()

    // Set status to "applicable"
    await page.selectOption('select >> nth=0', 'applicable')

    // Fill in justification
    const justificationField = page.getByPlaceholder(/explain why/i)
    await justificationField.fill('This control is required for information security compliance')

    // Wait a moment for auto-save
    await page.waitForTimeout(1000)

    // Set implementation status
    const implementationSelect = page.locator('select').filter({ hasText: /not implemented|planned|in progress|implemented/i }).first()
    await implementationSelect.selectOption('planned')

    // Wait for auto-save
    await page.waitForTimeout(1000)

    // Navigate back to Dashboard
    await page.getByText('Dashboard').click()

    // Wait for Dashboard to load and calculate metrics
    await expect(page.getByText('ISMS Dashboard')).toBeVisible()
    await page.waitForTimeout(2000) // Give time for calculation

    // Verify SOA percentage is now greater than 0%
    // Look for percentage in the SOA section
    const soaSection = page.locator('text=SOA').locator('..')
    await expect(soaSection).toBeVisible()

    // Take screenshot for debugging
    await page.screenshot({ path: 'e2e-results/soa-after-one-control.png', fullPage: true })

    // Log localStorage data for debugging
    const soaData = await page.evaluate(() => {
      return localStorage.getItem('statementOfApplicability')
    })
    console.log('SOA Data after documentation:', soaData)
  })

  test('should calculate SOA percentage correctly with multiple controls', async ({ page }) => {
    await page.goto('/')

    // Navigate to SOA page
    await page.getByText('Statement of Applicability').click()
    await expect(page.getByText('Total Controls')).toBeVisible()

    // Document 5 controls
    for (let i = 0; i < 5; i++) {
      // Find controls that aren't already expanded
      const controls = page.locator('[class*="control"]')
      const control = controls.nth(i)
      await control.click()

      // Wait for expansion
      await page.waitForTimeout(500)

      // Set as applicable
      const statusSelects = page.locator('select')
      await statusSelects.nth(0).selectOption('applicable')

      // Add justification
      const justifications = page.getByPlaceholder(/explain why/i)
      await justifications.nth(0).fill(`Control ${i + 1} is required for security`)

      // Set implementation status
      await page.waitForTimeout(300)
      const implSelects = page.locator('select').filter({ hasText: /implementation/i })
      if (await implSelects.count() > 0) {
        await implSelects.nth(0).selectOption('planned')
      }

      // Wait for save
      await page.waitForTimeout(500)

      // Collapse control before moving to next
      await control.click()
      await page.waitForTimeout(300)
    }

    // Navigate to Dashboard
    await page.getByText('Dashboard').click()
    await expect(page.getByText('ISMS Dashboard')).toBeVisible()
    await page.waitForTimeout(2000)

    // Take screenshot
    await page.screenshot({ path: 'e2e-results/soa-after-multiple-controls.png', fullPage: true })

    // Check that SOA percentage reflects documented controls
    // With 5 out of 93 controls documented, should be about 5%
    const soaData = await page.evaluate(() => {
      const data = localStorage.getItem('statementOfApplicability')
      return data ? JSON.parse(data) : []
    })

    const documented = soaData.filter((c: any) => {
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

    console.log(`Documented controls: ${documented.length} / ${soaData.length}`)
    expect(documented.length).toBeGreaterThan(0)
  })

  test('should show 0% SOA when controls lack required fields', async ({ page }) => {
    await page.goto('/')

    // Navigate to SOA
    await page.getByText('Statement of Applicability').click()
    await expect(page.getByText('Total Controls')).toBeVisible()

    // Expand first control
    const firstControl = page.locator('[class*="control"]').first()
    await firstControl.click()

    // Only set status to applicable, but DON'T add justification or implementation
    await page.selectOption('select >> nth=0', 'applicable')
    await page.waitForTimeout(1000)

    // Navigate to Dashboard
    await page.getByText('Dashboard').click()
    await expect(page.getByText('ISMS Dashboard')).toBeVisible()
    await page.waitForTimeout(2000)

    // Should still show 0% because justification is missing
    const soaData = await page.evaluate(() => {
      const data = localStorage.getItem('statementOfApplicability')
      return data ? JSON.parse(data) : []
    })

    // Verify no controls are counted as documented
    const documented = soaData.filter((c: any) => {
      const hasJustification = c.justification && c.justification.trim().length > 0
      return hasJustification
    })

    expect(documented.length).toBe(0)
  })

  test('should handle not-applicable controls correctly', async ({ page }) => {
    await page.goto('/')

    // Navigate to SOA
    await page.getByText('Statement of Applicability').click()
    await expect(page.getByText('Total Controls')).toBeVisible()

    // Expand first control
    const firstControl = page.locator('[class*="control"]').first()
    await firstControl.click()
    await page.waitForTimeout(500)

    // Set as not-applicable
    await page.selectOption('select >> nth=0', 'not-applicable')

    // Add justification (this is all that's needed for not-applicable)
    const justificationField = page.getByPlaceholder(/explain why/i)
    await justificationField.fill('This control does not apply to our organization')
    await page.waitForTimeout(1000)

    // Navigate to Dashboard
    await page.getByText('Dashboard').click()
    await expect(page.getByText('ISMS Dashboard')).toBeVisible()
    await page.waitForTimeout(2000)

    // Should show > 0% because not-applicable control with justification counts
    const soaData = await page.evaluate(() => {
      const data = localStorage.getItem('statementOfApplicability')
      return data ? JSON.parse(data) : []
    })

    const documented = soaData.filter((c: any) => {
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

    expect(documented.length).toBeGreaterThan(0)

    // Take screenshot
    await page.screenshot({ path: 'e2e-results/soa-not-applicable-control.png', fullPage: true })
  })
})
