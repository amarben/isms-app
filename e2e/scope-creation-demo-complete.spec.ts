import { test, expect } from '@playwright/test'

/**
 * Complete Visual Demo for Scope Creation Process
 *
 * This test demonstrates the complete scope creation workflow with:
 * - Visible mouse movements
 * - Typing animations
 * - Slow motion for better visibility
 * - Video recording enabled
 *
 * To run this demo:
 * npm run demo:scope
 * or
 * npx playwright test e2e/scope-creation-demo-complete.spec.ts --headed --project=chromium
 */

// Configure for visual demonstration with video recording
test.use({
  launchOptions: {
    slowMo: 500, // Slow down all actions by 500ms
  },
  video: 'on', // Enable video recording
})

test.describe('Visual Demo - Complete Scope Creation', () => {
  // Set long timeout for visual demos - 5 minutes
  test.setTimeout(300000)

  test.beforeEach(async ({ page }) => {
    // Clear localStorage for fresh start
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.waitForTimeout(1000)
  })

  test('Complete Scope Creation Demo with Visual Feedback', async ({ page }) => {
    console.log('\n🎬 Starting Visual Demo: ISMS Scope Creation\n')

    // ============================================
    // STEP 1: Navigate to Scope Definition
    // ============================================
    console.log('📍 Step 1: Opening ISMS Dashboard...')
    await page.goto('/')
    await expect(page.getByText('ISMS Dashboard')).toBeVisible()
    await page.waitForTimeout(2000)

    console.log('🎯 Step 2: Clicking "Define ISMS Scope" in sidebar...')
    // Click on "Define ISMS Scope" in the left sidebar navigation
    const scopeMenuItem = page.locator('text=Define ISMS Scope').first()
    await scopeMenuItem.scrollIntoViewIfNeeded()
    await scopeMenuItem.hover()
    await page.waitForTimeout(500)
    await scopeMenuItem.click()

    // Wait for navigation to complete - look for unique content on the scope page
    await page.waitForSelector('text=Step-by-step guide to defining your ISMS boundaries', { timeout: 10000 })
    await page.waitForTimeout(2000)

    // ============================================
    // STEP 2: Fill Organization Details
    // ============================================
    console.log('\n📝 Step 3: Filling Organization Details...')

    // Organization Name
    console.log('   ✍️ Typing Organization Name...')
    const orgNameInput = page.getByPlaceholder(/e.g., Acme Corporation/i)
    await orgNameInput.scrollIntoViewIfNeeded()
    await orgNameInput.hover()
    await page.waitForTimeout(300)
    await orgNameInput.click()
    await orgNameInput.clear()
    await orgNameInput.pressSequentially('Innovative Tech Solutions Inc.', { delay: 100 })
    await page.waitForTimeout(1000)

    // Industry
    console.log('   ✍️ Typing Industry...')
    const industryInput = page.getByPlaceholder(/e.g., Technology Services/i)
    await industryInput.scrollIntoViewIfNeeded()
    await industryInput.hover()
    await page.waitForTimeout(300)
    await industryInput.click()
    await industryInput.clear()
    await industryInput.pressSequentially('Software Development & Cloud Services', { delay: 100 })
    await page.waitForTimeout(1000)

    // CEO Name
    console.log('   ✍️ Typing CEO Name...')
    const ceoInput = page.getByPlaceholder(/e.g., John Smith/i)
    await ceoInput.scrollIntoViewIfNeeded()
    await ceoInput.hover()
    await page.waitForTimeout(300)
    await ceoInput.click()
    await ceoInput.clear()
    await ceoInput.pressSequentially('Alexandra Rodriguez', { delay: 100 })
    await page.waitForTimeout(1000)

    // CISO Name
    console.log('   ✍️ Typing CISO Name...')
    const cisoInput = page.getByPlaceholder(/e.g., Sarah Johnson/i)
    await cisoInput.scrollIntoViewIfNeeded()
    await cisoInput.hover()
    await page.waitForTimeout(300)
    await cisoInput.click()
    await cisoInput.clear()
    await cisoInput.pressSequentially('Michael Chen', { delay: 100 })
    await page.waitForTimeout(1500)

    // ============================================
    // STEP 3: Select Internal Issues
    // ============================================
    console.log('\n📋 Step 4: Selecting Internal Issues...')
    await page.evaluate(() => window.scrollTo(0, 600))
    await page.waitForTimeout(1000)

    const internalIssues = [
      'Sensitive R&D data requires high protection',
      'Financial data processing and reporting',
      'Customer data and privacy requirements',
      'IT infrastructure and system vulnerabilities'
    ]

    for (const issue of internalIssues) {
      console.log(`   ☑️ Selecting: ${issue.substring(0, 40)}...`)
      const issueButton = page.getByRole('button', { name: issue })
      await issueButton.scrollIntoViewIfNeeded()
      await issueButton.hover()
      await page.waitForTimeout(400)
      await issueButton.click()
      await page.waitForTimeout(800)
    }

    // Add custom internal issue
    console.log('   ✍️ Adding custom internal issue...')
    await page.evaluate(() => window.scrollTo(0, 1200))
    await page.waitForTimeout(500)

    const customInternalInput = page.getByPlaceholder(/Enter your custom internal issue/i)
    await customInternalInput.scrollIntoViewIfNeeded()
    await customInternalInput.hover()
    await page.waitForTimeout(300)
    await customInternalInput.click()
    await customInternalInput.pressSequentially('Cloud infrastructure security and reliability', { delay: 80 })
    await page.waitForTimeout(500)

    const addInternalButton = customInternalInput.locator('..').getByRole('button', { name: /Add/i })
    await addInternalButton.hover()
    await page.waitForTimeout(300)
    await addInternalButton.click()
    await page.waitForTimeout(1000)

    // ============================================
    // STEP 4: Select External Issues
    // ============================================
    console.log('\n🌍 Step 5: Selecting External Issues...')
    await page.evaluate(() => window.scrollTo(0, 1800))
    await page.waitForTimeout(1000)

    const externalIssues = [
      'Industry regulations (GDPR, HIPAA, SOX, etc.)',
      'Cybersecurity threats and attack vectors',
      'Customer security requirements',
      'International standards compliance (ISO 27001)'
    ]

    for (const issue of externalIssues) {
      console.log(`   ☑️ Selecting: ${issue.substring(0, 40)}...`)
      const issueButton = page.getByRole('button', { name: issue })
      await issueButton.scrollIntoViewIfNeeded()
      await issueButton.hover()
      await page.waitForTimeout(400)
      await issueButton.click()
      await page.waitForTimeout(800)
    }

    // ============================================
    // STEP 5: Proceed to Next Step
    // ============================================
    console.log('\n▶️ Step 6: Moving to Interested Parties...')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)

    const nextButton = page.getByRole('button', { name: /Next Step/i })
    await nextButton.hover()
    await page.waitForTimeout(500)
    await nextButton.click()
    await page.waitForTimeout(2000)

    // ============================================
    // STEP 6: Select Interested Parties
    // ============================================
    console.log('\n👥 Step 7: Selecting Interested Parties...')
    await page.evaluate(() => window.scrollTo(0, 400))
    await page.waitForTimeout(1000)

    const interestedParties = [
      'Customers',
      'Employees',
      'Regulatory Bodies (GDPR/DPA)',
      'Business Partners',
      'IT Security Teams'
    ]

    for (const party of interestedParties) {
      console.log(`   ☑️ Selecting: ${party}`)
      // Find the card containing this party name
      const partyCard = page.locator(`text="${party}"`).locator('..')
      await partyCard.scrollIntoViewIfNeeded()
      await partyCard.hover()
      await page.waitForTimeout(400)
      await partyCard.click()
      await page.waitForTimeout(800)
    }

    // ============================================
    // STEP 7: Add Interface
    // ============================================
    console.log('\n▶️ Step 8: Moving to Interfaces & Dependencies...')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)

    await page.getByRole('button', { name: /Next Step/i }).click()
    await page.waitForTimeout(2000)

    console.log('\n🔗 Step 9: Adding System Interfaces...')
    await page.evaluate(() => window.scrollTo(0, 400))
    await page.waitForTimeout(1000)

    const addInterfaceButton = page.getByRole('button', { name: /Add Interface/i })
    await addInterfaceButton.hover()
    await page.waitForTimeout(500)
    await addInterfaceButton.click()
    await page.waitForTimeout(1000)

    // Fill interface details
    console.log('   ✍️ Filling interface details...')
    const systemInput = page.getByPlaceholder(/System\/Department/i).first()
    await systemInput.scrollIntoViewIfNeeded()
    await systemInput.hover()
    await page.waitForTimeout(300)
    await systemInput.click()
    await systemInput.pressSequentially('Customer Management System (CRM)', { delay: 80 })
    await page.waitForTimeout(800)

    const dependencyInput = page.getByPlaceholder(/Dependency/i).first()
    await dependencyInput.hover()
    await page.waitForTimeout(300)
    await dependencyInput.click()
    await dependencyInput.pressSequentially('AWS Cloud Infrastructure', { delay: 80 })
    await page.waitForTimeout(800)

    const impactInput = page.getByPlaceholder(/Impact on scope/i).first()
    await impactInput.hover()
    await page.waitForTimeout(300)
    await impactInput.click()
    await impactInput.pressSequentially('Critical - All customer data processing must be secured', { delay: 80 })
    await page.waitForTimeout(1500)

    // ============================================
    // STEP 8: Add Exclusions
    // ============================================
    console.log('\n▶️ Step 10: Moving to Exclusions...')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)

    await page.getByRole('button', { name: /Next Step/i }).click()
    await page.waitForTimeout(2000)

    console.log('\n🚫 Step 11: Selecting Exclusions...')
    await page.evaluate(() => window.scrollTo(0, 400))
    await page.waitForTimeout(1000)

    const exclusions = [
      'Personal employee devices (BYOD)',
      'Guest Wi-Fi networks'
    ]

    for (const exclusion of exclusions) {
      console.log(`   ☑️ Selecting: ${exclusion}`)
      const exclusionCard = page.locator(`text="${exclusion}"`).first().locator('..')
      await exclusionCard.scrollIntoViewIfNeeded()
      await exclusionCard.hover()
      await page.waitForTimeout(400)
      await exclusionCard.click()
      await page.waitForTimeout(800)
    }

    // ============================================
    // STEP 9: Define Scope Document
    // ============================================
    console.log('\n▶️ Step 12: Moving to Scope Document...')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)

    await page.getByRole('button', { name: /Next Step/i }).click()
    await page.waitForTimeout(2000)

    console.log('\n📄 Step 13: Selecting Processes and Services...')
    await page.evaluate(() => window.scrollTo(0, 600))
    await page.waitForTimeout(1000)

    const processes = [
      'Customer data processing',
      'Software development and deployment',
      'Email and communication services',
      'Data backup and recovery',
      'Network and infrastructure management'
    ]

    for (const process of processes) {
      console.log(`   ☑️ Selecting: ${process}`)
      const processButton = page.getByRole('button', { name: process })
      await processButton.scrollIntoViewIfNeeded()
      await processButton.hover()
      await page.waitForTimeout(400)
      await processButton.click()
      await page.waitForTimeout(600)
    }

    // ============================================
    // STEP 10: Select Departments
    // ============================================
    console.log('\n🏢 Step 14: Selecting Departments...')
    await page.evaluate(() => window.scrollTo(0, 1400))
    await page.waitForTimeout(1000)

    const departments = [
      'IT Department',
      'Research & Development (R&D)',
      'Customer Service',
      'Security Team'
    ]

    for (const dept of departments) {
      console.log(`   ☑️ Selecting: ${dept}`)
      const deptButton = page.getByRole('button', { name: dept })
      await deptButton.scrollIntoViewIfNeeded()
      await deptButton.hover()
      await page.waitForTimeout(400)
      await deptButton.click()
      await page.waitForTimeout(600)
    }

    // ============================================
    // STEP 11: Select Physical Locations
    // ============================================
    console.log('\n📍 Step 15: Selecting Physical Locations...')
    await page.evaluate(() => window.scrollTo(0, 2200))
    await page.waitForTimeout(1000)

    const locations = [
      'Main office building',
      'Data center facility',
      'Cloud infrastructure (AWS/Azure/GCP)',
      'Remote work locations'
    ]

    for (const location of locations) {
      console.log(`   ☑️ Selecting: ${location}`)
      const locationButton = page.getByRole('button', { name: location })
      await locationButton.scrollIntoViewIfNeeded()
      await locationButton.hover()
      await page.waitForTimeout(400)
      await locationButton.click()
      await page.waitForTimeout(600)
    }

    // ============================================
    // STEP 12: Add Additional Notes
    // ============================================
    console.log('\n📝 Step 16: Adding Additional Notes...')
    await page.evaluate(() => window.scrollTo(0, 3400))
    await page.waitForTimeout(1000)

    const notesTextarea = page.getByPlaceholder(/Add any additional context/i)
    await notesTextarea.scrollIntoViewIfNeeded()
    await notesTextarea.hover()
    await page.waitForTimeout(500)
    await notesTextarea.click()
    await notesTextarea.pressSequentially(
      'This ISMS scope covers all critical business operations, customer-facing services, and infrastructure components. Special attention is given to cloud security and data protection requirements.',
      { delay: 60 }
    )
    await page.waitForTimeout(2000)

    // ============================================
    // STEP 13: View Summary
    // ============================================
    console.log('\n📊 Step 17: Reviewing Scope Document Summary...')
    await page.evaluate(() => window.scrollTo(0, 3800))
    await page.waitForTimeout(2000)

    // Verify summary is visible
    await expect(page.getByText('Scope Document Summary')).toBeVisible()
    await page.waitForTimeout(2000)

    // ============================================
    // FINAL STEP: Complete
    // ============================================
    console.log('\n✅ Step 18: Completing Scope Definition...')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)

    const completeButton = page.getByRole('button', { name: /Continue Without AI/i })
    await completeButton.hover()
    await page.waitForTimeout(1000)

    console.log('\n🎉 Scope Creation Demo Complete!\n')
    console.log('📋 Summary of Actions:')
    console.log('   ✓ Organization details filled')
    console.log('   ✓ Internal issues selected')
    console.log('   ✓ External issues selected')
    console.log('   ✓ Interested parties identified')
    console.log('   ✓ Interfaces and dependencies defined')
    console.log('   ✓ Exclusions specified')
    console.log('   ✓ Processes and services selected')
    console.log('   ✓ Departments included')
    console.log('   ✓ Physical locations defined')
    console.log('   ✓ Additional notes added\n')

    // Final wait to show completed form
    await page.waitForTimeout(3000)
  })
})
