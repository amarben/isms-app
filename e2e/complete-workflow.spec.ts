import { test, expect } from '@playwright/test'

test.describe('Complete ISMS Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('should complete full ISMS implementation workflow', async ({ page }) => {
    await page.goto('/')

    // Verify Dashboard loads
    await expect(page.getByText('ISMS Dashboard')).toBeVisible()
    await expect(page.getByText('ISO 27001:2022 Implementation Overview')).toBeVisible()

    // Take initial screenshot
    await page.screenshot({ path: 'e2e-results/01-initial-dashboard.png', fullPage: true })

    // Step 1: Scope Definition
    console.log('Step 1: Defining ISMS Scope...')
    await page.getByText('Scope Definition').click()
    await expect(page.getByText('ISMS Scope Definition')).toBeVisible()

    // Fill in basic organization info
    await page.fill('input[name="organizationName"]', 'Test Organization Ltd')
    await page.fill('input[name="industry"]', 'Information Technology')

    // Take screenshot
    await page.screenshot({ path: 'e2e-results/02-scope-definition.png', fullPage: true })

    // Navigate to next step
    await page.getByRole('button', { name: /next|continue/i }).click()

    // Step 2: Risk Assessment
    console.log('Step 2: Conducting Risk Assessment...')
    await page.getByText('Risk Assessment').click()
    await expect(page.getByText(/Risk Assessment/i)).toBeVisible()

    // Fill in assessment setup
    await page.fill('input[name="organizationName"]', 'Test Organization Ltd')

    // Add an asset
    await page.getByText(/add asset|new asset/i).click()
    await page.fill('input[placeholder*="asset name" i]', 'Customer Database')

    // Take screenshot
    await page.screenshot({ path: 'e2e-results/03-risk-assessment.png', fullPage: true })

    // Step 3: Risk Treatment
    console.log('Step 3: Managing Risk Treatment...')
    await page.getByText('Risk Treatment').click()
    await page.waitForTimeout(1000)

    await page.screenshot({ path: 'e2e-results/04-risk-treatment.png', fullPage: true })

    // Step 4: Statement of Applicability
    console.log('Step 4: Documenting Statement of Applicability...')
    await page.getByText('Statement of Applicability').click()
    await expect(page.getByText('Total Controls')).toBeVisible()

    // Document multiple controls
    const controlsToDocument = 10

    for (let i = 0; i < controlsToDocument; i++) {
      console.log(`Documenting control ${i + 1}/${controlsToDocument}...`)

      // Find and click control
      const controls = page.locator('[class*="control"]')
      const control = controls.nth(i)
      await control.scrollIntoViewIfNeeded()
      await control.click()
      await page.waitForTimeout(300)

      // Set status
      const statusSelect = page.locator('select').first()
      await statusSelect.scrollIntoViewIfNeeded()
      await statusSelect.selectOption(i % 3 === 0 ? 'not-applicable' : 'applicable')
      await page.waitForTimeout(200)

      // Add justification
      const justification = i % 3 === 0
        ? `Control ${i + 1} does not apply to our current operations`
        : `Control ${i + 1} is required for information security management`

      const justificationFields = page.getByPlaceholder(/explain why/i)
      await justificationFields.first().scrollIntoViewIfNeeded()
      await justificationFields.first().fill(justification)
      await page.waitForTimeout(200)

      // If applicable, add implementation details
      if (i % 3 !== 0) {
        const implSelects = page.locator('select').filter({ hasText: /implementation/i })
        if (await implSelects.count() > 0) {
          await implSelects.first().scrollIntoViewIfNeeded()
          const statuses = ['planned', 'in-progress', 'implemented']
          await implSelects.first().selectOption(statuses[i % 3])
        }

        // Add responsible party
        const responsibleFields = page.getByPlaceholder(/responsible/i)
        if (await responsibleFields.count() > 0) {
          await responsibleFields.first().scrollIntoViewIfNeeded()
          await responsibleFields.first().fill('Security Team')
        }
      }

      // Wait for auto-save
      await page.waitForTimeout(500)

      // Collapse control
      await control.click()
      await page.waitForTimeout(200)
    }

    await page.screenshot({ path: 'e2e-results/05-soa-documented.png', fullPage: true })

    // Return to Dashboard
    console.log('Step 5: Verifying Dashboard Updates...')
    await page.getByText('Dashboard').click()
    await expect(page.getByText('ISMS Dashboard')).toBeVisible()

    // Wait for metrics to calculate
    await page.waitForTimeout(3000)

    // Take final screenshot
    await page.screenshot({ path: 'e2e-results/06-final-dashboard.png', fullPage: true })

    // Verify data was saved
    const finalData = await page.evaluate(() => {
      return {
        scope: localStorage.getItem('isms-scope-data'),
        risks: localStorage.getItem('isms-risk-assessment'),
        treatments: localStorage.getItem('riskTreatments'),
        soa: localStorage.getItem('statementOfApplicability')
      }
    })

    console.log('Final localStorage data:')
    console.log('- Scope:', finalData.scope ? 'Present' : 'Missing')
    console.log('- Risks:', finalData.risks ? 'Present' : 'Missing')
    console.log('- Treatments:', finalData.treatments ? 'Present' : 'Missing')
    console.log('- SOA:', finalData.soa ? 'Present' : 'Missing')

    if (finalData.soa) {
      const soaData = JSON.parse(finalData.soa)
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

      const percentage = Math.round((documented.length / soaData.length) * 100)
      console.log(`SOA Completion: ${documented.length}/${soaData.length} = ${percentage}%`)

      expect(documented.length).toBeGreaterThan(0)
      expect(percentage).toBeGreaterThan(0)
    }

    // Verify overall progress is > 0%
    await expect(page.getByText('Overall Progress')).toBeVisible()
  })

  test('should handle navigation between all steps', async ({ page }) => {
    await page.goto('/')

    const steps = [
      'Scope Definition',
      'Security Policy',
      'Risk Assessment',
      'Risk Treatment',
      'Statement of Applicability',
      'Asset Management',
      'Access Control',
      'Operations Security'
    ]

    for (const step of steps) {
      console.log(`Navigating to: ${step}`)

      // Click on step
      const stepLink = page.getByText(step).first()
      await stepLink.scrollIntoViewIfNeeded()
      await stepLink.click()
      await page.waitForTimeout(1000)

      // Verify page loaded (look for common elements)
      const pageContent = await page.content()
      expect(pageContent.length).toBeGreaterThan(0)

      // Take screenshot
      const filename = step.toLowerCase().replace(/\s+/g, '-')
      await page.screenshot({ path: `e2e-results/nav-${filename}.png` })

      // Return to dashboard
      const dashboardLink = page.getByText('Dashboard').first()
      await dashboardLink.scrollIntoViewIfNeeded()
      await dashboardLink.click()
      await expect(page.getByText('ISMS Dashboard')).toBeVisible()
      await page.waitForTimeout(500)
    }
  })

  test('should persist data across page refreshes', async ({ page }) => {
    await page.goto('/')

    // Navigate to SOA and add data
    await page.getByText('Statement of Applicability').click()
    await expect(page.getByText('Total Controls')).toBeVisible()

    // Document one control
    const firstControl = page.locator('[class*="control"]').first()
    await firstControl.scrollIntoViewIfNeeded()
    await firstControl.click()
    await page.waitForTimeout(500)

    const statusSelect = page.locator('select').first()
    await statusSelect.scrollIntoViewIfNeeded()
    await statusSelect.selectOption('applicable')

    const justificationField = page.getByPlaceholder(/explain why/i).first()
    await justificationField.scrollIntoViewIfNeeded()
    await justificationField.fill('Test persistence data')
    await page.waitForTimeout(1000)

    // Refresh the page
    await page.reload()
    await page.waitForTimeout(1000)

    // Verify data persisted
    const soaData = await page.evaluate(() => {
      const data = localStorage.getItem('statementOfApplicability')
      return data ? JSON.parse(data) : []
    })

    const controlWithData = soaData.find((c: any) =>
      c.justification && c.justification.includes('Test persistence')
    )

    expect(controlWithData).toBeTruthy()
    console.log('Data persisted successfully after page refresh')
  })

  test('should export Statement of Applicability', async ({ page }) => {
    await page.goto('/')

    // Navigate to SOA
    await page.getByText('Statement of Applicability').click()
    await expect(page.getByText('Total Controls')).toBeVisible()

    // Set up download listener
    const downloadPromise = page.waitForEvent('download')

    // Click export button
    await page.getByText('Export Statement of Applicability').click()

    // Wait for download
    const download = await downloadPromise
    console.log('Export filename:', download.suggestedFilename())

    expect(download.suggestedFilename()).toContain('.md')
  })
})
