import { test, expect } from '@playwright/test'

/**
 * Simplified Scope Creation Demo
 *
 * Watch this demo run - DO NOT CLOSE THE BROWSER!
 * The browser will close automatically when complete.
 *
 * To run: npm run demo:scope-simple
 */

// Configure for visual demonstration
test.use({
  launchOptions: {
    slowMo: 800, // Slowed down for better visibility
  },
})

test('Scope Creation Visual Demo', async ({ page }) => {
  // Set a long timeout for the demo - 5 minutes
  test.setTimeout(300000)
  console.log('\n🎬 ========================================')
  console.log('   ISMS SCOPE CREATION VISUAL DEMO')
  console.log('   Please WATCH - Do NOT close the browser!')
  console.log('========================================\n')

  // Clear localStorage to start fresh
  console.log('🧹 Clearing previous data...')
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.waitForTimeout(200)
  console.log('✅ Data cleared\n')

  // Navigate to dashboard
  console.log('📍 Step 1: Opening ISMS Dashboard...')
  await page.goto('/')
  await page.waitForTimeout(500)

  // Verify dashboard loaded
  await expect(page.getByText('ISMS Dashboard')).toBeVisible()
  console.log('✅ Dashboard loaded\n')

  // Navigate to Scope Definition via sidebar
  console.log('📍 Step 2: Clicking "Define ISMS Scope" in sidebar...')
  const scopeMenuItem = page.locator('text=Define ISMS Scope').first()
  await scopeMenuItem.click()

  // Wait for navigation to complete by checking for unique content on the page
  await page.waitForSelector('text=Step-by-step guide to defining your ISMS boundaries', { timeout: 10000 })
  await page.waitForTimeout(400)
  console.log('✅ Scope Definition page opened\n')

  // Fill Organization Name
  console.log('✍️  Step 3: Entering Organization Details...')
  const orgNameInput = page.getByPlaceholder(/e.g., Acme Corporation/i)
  await orgNameInput.scrollIntoViewIfNeeded()
  await orgNameInput.click()
  await orgNameInput.pressSequentially('TechCorp Solutions Ltd.', { delay: 30 })
  await page.waitForTimeout(250)
  console.log('   ✅ Organization name entered')

  // Fill Industry
  const industryInput = page.getByPlaceholder(/e.g., Technology Services/i)
  await industryInput.click()
  await industryInput.pressSequentially('Cloud Services & Software Development', { delay: 30 })
  await page.waitForTimeout(250)
  console.log('   ✅ Industry entered')

  // Fill Policy Version
  const policyVersionInput = page.getByPlaceholder(/e.g., 1.0/i)
  await policyVersionInput.click()
  await policyVersionInput.pressSequentially('2.0', { delay: 30 })
  await page.waitForTimeout(250)
  console.log('   ✅ Policy version entered')

  // Fill CEO Name
  const ceoNameInput = page.getByPlaceholder(/e.g., John Smith/i)
  await ceoNameInput.click()
  await ceoNameInput.pressSequentially('Michael Anderson', { delay: 30 })
  await page.waitForTimeout(250)
  console.log('   ✅ CEO name entered')

  // Fill CISO Name
  const cisoNameInput = page.getByPlaceholder(/e.g., Sarah Johnson/i)
  await cisoNameInput.click()
  await cisoNameInput.pressSequentially('Jennifer Martinez', { delay: 30 })
  await page.waitForTimeout(250)
  console.log('   ✅ CISO name entered')

  // Fill Effective Date
  const effectiveDateInput = page.locator('input[type="date"]').first()
  await effectiveDateInput.click()
  await effectiveDateInput.fill('2025-10-18')
  await page.waitForTimeout(250)
  console.log('   ✅ Effective date entered')

  // Fill Next Review Date
  const reviewDateInput = page.locator('input[type="date"]').nth(1)
  await reviewDateInput.click()
  await reviewDateInput.fill('2026-10-18')
  await page.waitForTimeout(250)
  console.log('   ✅ Next review date entered\n')

  // Select internal issues
  console.log('📋 Step 4: Selecting Internal Issues...')

  const internalIssues = [
    'Sensitive R&D data requires high protection',
    'Customer data and privacy requirements',
    'Financial data processing and reporting'
  ]

  for (const issue of internalIssues) {
    console.log(`   ☑️  ${issue.substring(0, 40)}...`)
    const issueButton = page.getByRole('button', { name: issue })
    await issueButton.scrollIntoViewIfNeeded()

    // Only click if button is enabled (not already selected)
    if (await issueButton.isEnabled()) {
      await issueButton.click()
      await page.waitForTimeout(200)
    } else {
      console.log(`   ⏭️  Already selected, skipping`)
      await page.waitForTimeout(100)
    }
  }
  console.log('   ✅ Internal issues selected\n')

  // Select external issues
  console.log('🌍 Step 5: Selecting External Issues...')

  const externalIssues = [
    'Industry regulations (GDPR, HIPAA, SOX, etc.)',
    'Cybersecurity threats and attack vectors'
  ]

  for (const issue of externalIssues) {
    console.log(`   ☑️  ${issue.substring(0, 40)}...`)
    const issueButton = page.getByRole('button', { name: issue }).first()
    await issueButton.scrollIntoViewIfNeeded()

    // Only click if button is enabled (not already selected)
    if (await issueButton.isEnabled()) {
      await issueButton.click()
      await page.waitForTimeout(200)
    } else {
      console.log(`   ⏭️  Already selected, skipping`)
      await page.waitForTimeout(100)
    }
  }
  console.log('   ✅ External issues selected\n')

  // Move to next step
  console.log('▶️  Step 6: Proceeding to Interested Parties...')

  const nextButton = page.getByRole('button', { name: /Next Step/i })
  await nextButton.scrollIntoViewIfNeeded()
  await nextButton.click()
  await page.waitForTimeout(600)
  console.log('   ✅ Moved to Interested Parties step\n')

  // Select interested parties
  console.log('👥 Step 7: Selecting Interested Parties...')

  const parties = ['Customers', 'Employees', 'Regulatory Bodies (GDPR/DPA)']

  for (const party of parties) {
    console.log(`   ☑️  ${party}`)
    const partyCard = page.locator(`text="${party}"`).first().locator('..')
    await partyCard.scrollIntoViewIfNeeded()

    // Only click if not already selected
    if (await partyCard.isEnabled()) {
      await partyCard.click()
      await page.waitForTimeout(200)
    } else {
      console.log(`   ⏭️  Already selected, skipping`)
      await page.waitForTimeout(100)
    }
  }
  console.log('   ✅ Interested parties selected\n')

  // Continue to Interfaces & Dependencies
  console.log('▶️  Step 8: Moving to Interfaces & Dependencies...')
  const nextButton2 = page.getByRole('button', { name: /Next Step/i })
  await nextButton2.scrollIntoViewIfNeeded()
  await nextButton2.click()
  await page.waitForTimeout(500)
  console.log('   ✅ On Interfaces & Dependencies\n')

  // Add Interface
  console.log('🔗 Step 9: Adding System Interface...')
  const addInterfaceButton = page.getByRole('button', { name: /Add Interface/i })
  await addInterfaceButton.scrollIntoViewIfNeeded()
  await addInterfaceButton.click()
  await page.waitForTimeout(250)

  const systemInput = page.getByPlaceholder(/System\/Department/i).first()
  await systemInput.click()
  await systemInput.pressSequentially('Customer Management System (CRM)', { delay: 30 })
  await page.waitForTimeout(200)

  const dependencyInput = page.getByPlaceholder(/Dependency/i).first()
  await dependencyInput.click()
  await dependencyInput.pressSequentially('AWS Cloud Infrastructure', { delay: 30 })
  await page.waitForTimeout(200)

  const impactInput = page.getByPlaceholder(/Impact on scope/i).first()
  await impactInput.click()
  await impactInput.pressSequentially('Critical - Customer data processing', { delay: 30 })
  await page.waitForTimeout(250)
  console.log('   ✅ Interface added\n')

  // Move to Exclusions
  console.log('▶️  Step 10: Moving to Exclusions...')
  const nextButton3 = page.getByRole('button', { name: /Next Step/i })
  await nextButton3.scrollIntoViewIfNeeded()
  await nextButton3.click()
  await page.waitForTimeout(500)
  console.log('   ✅ On Exclusions\n')

  // Select Exclusions
  console.log('🚫 Step 11: Selecting Exclusions...')
  const exclusions = [
    'Personal employee devices (BYOD)',
    'Guest Wi-Fi networks'
  ]

  for (const exclusion of exclusions) {
    console.log(`   ☑️  ${exclusion}`)
    const exclusionCard = page.locator(`text="${exclusion}"`).first().locator('..')
    await exclusionCard.scrollIntoViewIfNeeded()
    if (await exclusionCard.isEnabled()) {
      await exclusionCard.click()
      await page.waitForTimeout(200)
    }
  }
  console.log('   ✅ Exclusions selected\n')

  // Move to Scope Document
  console.log('▶️  Step 12: Moving to Scope Document...')
  const nextButton4 = page.getByRole('button', { name: /Next Step/i })
  await nextButton4.scrollIntoViewIfNeeded()
  await nextButton4.click()
  await page.waitForTimeout(500)
  console.log('   ✅ On Scope Document\n')

  // Select Processes and Services
  console.log('📄 Step 13: Selecting Processes and Services...')
  const processes = [
    'Customer data processing',
    'Software development and deployment',
    'Email and communication services'
  ]

  for (const process of processes) {
    console.log(`   ☑️  ${process}`)
    const processButton = page.getByRole('button', { name: process })
    await processButton.scrollIntoViewIfNeeded()
    if (await processButton.isEnabled()) {
      await processButton.click()
      await page.waitForTimeout(200)
    }
  }
  console.log('   ✅ Processes selected\n')

  // Select Departments
  console.log('🏢 Step 14: Selecting Departments...')
  const departments = [
    'IT Department',
    'Research & Development (R&D)',
    'Customer Service'
  ]

  for (const dept of departments) {
    console.log(`   ☑️  ${dept}`)
    const deptButton = page.getByRole('button', { name: dept })
    await deptButton.scrollIntoViewIfNeeded()
    if (await deptButton.isEnabled()) {
      await deptButton.click()
      await page.waitForTimeout(200)
    }
  }
  console.log('   ✅ Departments selected\n')

  // Select Physical Locations
  console.log('📍 Step 15: Selecting Physical Locations...')
  const locations = [
    'Main office building',
    'Data center facility',
    'Cloud infrastructure (AWS/Azure/GCP)'
  ]

  for (const location of locations) {
    console.log(`   ☑️  ${location}`)
    const locationButton = page.getByRole('button', { name: location })
    await locationButton.scrollIntoViewIfNeeded()
    if (await locationButton.isEnabled()) {
      await locationButton.click()
      await page.waitForTimeout(200)
    }
  }
  console.log('   ✅ Locations selected\n')

  // Add Additional Notes
  console.log('📝 Step 16: Adding Additional Notes...')
  const notesTextarea = page.getByPlaceholder(/Add any additional context/i)
  await notesTextarea.scrollIntoViewIfNeeded()
  await notesTextarea.click()
  await notesTextarea.pressSequentially(
    'This ISMS scope covers all critical business operations and customer-facing services.',
    { delay: 30 }
  )
  await page.waitForTimeout(250)
  console.log('   ✅ Notes added\n')

  // Verify Summary is visible
  console.log('📊 Step 17: Verifying Scope Document Summary...')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(500)
  console.log('   ✅ Summary visible\n')

  // Final summary
  console.log('\n🎉 ========================================')
  console.log('   DEMO COMPLETED SUCCESSFULLY!')
  console.log('   The browser will close in 2 seconds...')
  console.log('========================================\n')

  await page.waitForTimeout(2000)
})
