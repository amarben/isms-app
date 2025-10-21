import { test, expect } from '@playwright/test'

/**
 * Simplified Information Security Policy Creation Demo
 *
 * Watch this demo run - DO NOT CLOSE THE BROWSER!
 * The browser will close automatically when complete.
 *
 * To run: npm run demo:policy-simple
 */

// Configure for visual demonstration
test.use({
  launchOptions: {
    slowMo: 800, // Slowed down for better visibility
  },
})

test('Policy Creation Visual Demo', async ({ page }) => {
  // Set a long timeout for the demo - 7 minutes
  test.setTimeout(420000)
  console.log('\n🎬 ========================================')
  console.log('   INFORMATION SECURITY POLICY DEMO')
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

  // Navigate to Information Security Policy via sidebar
  console.log('📍 Step 2: Clicking "Information Security Policy" in sidebar...')
  await page.waitForTimeout(1000) // Give React time to hydrate
  const policyMenuItem = page.locator('text=Information Security Policy').first()
  await policyMenuItem.waitFor({ state: 'visible', timeout: 10000 })
  await policyMenuItem.scrollIntoViewIfNeeded()
  await policyMenuItem.click()

  // Wait for navigation to complete
  await page.waitForSelector('text=Create your organization', { timeout: 10000 })
  await page.waitForTimeout(400)
  console.log('✅ Policy Creation page opened\n')

  // ============================================
  // STEP 1: Policy Statement & Scope
  // ============================================
  console.log('📝 Step 3: Entering Policy Statement...')

  // Select a predefined policy statement
  const policyStatement = 'TechCorp Solutions Ltd. is committed to protecting the confidentiality, integrity, and availability of all information assets and ensuring the security of information systems that support our business operations.'
  const policyStatementButton = page.getByRole('button', { name: new RegExp(policyStatement.substring(0, 50)) })
  await policyStatementButton.scrollIntoViewIfNeeded()
  await policyStatementButton.click()
  await page.waitForTimeout(400)
  console.log('   ✅ Policy statement selected\n')

  // Select a predefined scope statement
  console.log('📄 Step 4: Selecting Policy Scope...')
  const scopeStatement = 'This policy applies to all employees, contractors, consultants, vendors, and third parties who have access to organizational information systems and data.'
  const scopeButton = page.getByRole('button', { name: new RegExp(scopeStatement.substring(0, 50)) })
  await scopeButton.scrollIntoViewIfNeeded()
  await scopeButton.click()
  await page.waitForTimeout(400)
  console.log('   ✅ Scope selected\n')

  // Move to next step
  console.log('▶️  Step 5: Proceeding to Objectives & Details...')
  const nextButton = page.getByRole('button', { name: /Next/i }).last()
  await nextButton.scrollIntoViewIfNeeded()
  await nextButton.click()
  await page.waitForTimeout(600)
  console.log('   ✅ Moved to Objectives step\n')

  // ============================================
  // STEP 2: Organization Details & Objectives
  // ============================================
  console.log('✍️  Step 6: Entering Organization Details...')

  // Fill Organization Name (required field)
  const orgNameInput = page.getByPlaceholder(/e.g., Acme Corporation/i)
  await orgNameInput.scrollIntoViewIfNeeded()
  await orgNameInput.click()
  await orgNameInput.pressSequentially('TechCorp Solutions Ltd.', { delay: 30 })
  await page.waitForTimeout(250)
  console.log('   ✅ Organization name entered')

  // Fill Industry
  const industryInput = page.getByPlaceholder(/e.g., Technology, Healthcare, Finance/i)
  await industryInput.scrollIntoViewIfNeeded()
  await industryInput.click()
  await industryInput.pressSequentially('Cloud Services & Software Development', { delay: 30 })
  await page.waitForTimeout(250)
  console.log('   ✅ Industry entered')

  // Fill Policy Version
  const versionInput = page.getByPlaceholder(/e.g., 1.0/i)
  await versionInput.click()
  await versionInput.pressSequentially('2.0', { delay: 30 })
  await page.waitForTimeout(250)
  console.log('   ✅ Policy version entered')

  // Fill CEO Name
  const ceoInput = page.getByPlaceholder(/e.g., John Smith/i)
  await ceoInput.click()
  await ceoInput.pressSequentially('Michael Anderson', { delay: 30 })
  await page.waitForTimeout(250)
  console.log('   ✅ CEO name entered')

  // Fill CISO Name
  const cisoInput = page.getByPlaceholder(/e.g., Jane Doe/i)
  await cisoInput.click()
  await cisoInput.pressSequentially('Jennifer Martinez', { delay: 30 })
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

  // Select Security Objectives
  console.log('🎯 Step 7: Selecting Security Objectives...')

  const objectives = [
    'Protect the confidentiality, integrity, and availability of information assets',
    'Ensure compliance with applicable laws, regulations, and contractual requirements',
    'Maintain business continuity and minimize the impact of security incidents'
  ]

  for (const objective of objectives) {
    console.log(`   ☑️  ${objective.substring(0, 40)}...`)
    const objectiveButton = page.getByRole('button', { name: objective })
    await objectiveButton.scrollIntoViewIfNeeded()

    if (await objectiveButton.isEnabled()) {
      await objectiveButton.click()
      await page.waitForTimeout(200)
    }
  }
  console.log('   ✅ Objectives selected\n')

  // Move to next step
  console.log('▶️  Step 8: Proceeding to Roles & Responsibilities...')
  const nextButton2 = page.getByRole('button', { name: /Next/i }).last()
  await nextButton2.scrollIntoViewIfNeeded()
  await nextButton2.click()
  await page.waitForTimeout(600)
  console.log('   ✅ Moved to Roles step\n')

  // ============================================
  // STEP 3: Roles & Responsibilities
  // ============================================
  console.log('👥 Step 9: Selecting Roles and Responsibilities...')

  const roles = [
    'Chief Executive Officer (CEO)',
    'Chief Information Security Officer (CISO)',
    'All Employees'
  ]

  for (const role of roles) {
    console.log(`   ☑️  ${role}`)
    const roleButton = page.getByRole('button', { name: role })
    await roleButton.scrollIntoViewIfNeeded()

    if (await roleButton.isEnabled()) {
      await roleButton.click()
      await page.waitForTimeout(200)
    }
  }
  console.log('   ✅ Roles selected\n')

  // Move to next step
  console.log('▶️  Step 10: Proceeding to Compliance & Consequences...')
  const nextButton3 = page.getByRole('button', { name: /Next/i }).last()
  await nextButton3.scrollIntoViewIfNeeded()
  await nextButton3.click()
  await page.waitForTimeout(600)
  console.log('   ✅ Moved to Compliance step\n')

  // ============================================
  // STEP 4: Compliance & Consequences
  // ============================================
  console.log('📋 Step 11: Selecting Compliance Requirements...')

  const complianceReqs = [
    'ISO/IEC 27001:2022 - Information Security Management Systems',
    'General Data Protection Regulation (GDPR)',
    'NIST Cybersecurity Framework'
  ]

  for (const req of complianceReqs) {
    console.log(`   ☑️  ${req.substring(0, 40)}...`)
    const reqButton = page.getByRole('button', { name: req })
    await reqButton.scrollIntoViewIfNeeded()

    if (await reqButton.isEnabled()) {
      await reqButton.click()
      await page.waitForTimeout(200)
    }
  }
  console.log('   ✅ Compliance requirements selected\n')

  // Select consequences
  console.log('⚠️  Step 12: Selecting Consequences...')
  const consequencesText = 'Failure to comply with this policy may result in disciplinary action, up to and including termination of employment or contract.'
  const consequencesButton = page.getByRole('button', { name: new RegExp(consequencesText.substring(0, 50)) })
  await consequencesButton.scrollIntoViewIfNeeded()
  await consequencesButton.click()
  await page.waitForTimeout(400)
  console.log('   ✅ Consequences selected\n')

  // Move to final step
  console.log('▶️  Step 13: Proceeding to Review & Approval...')
  const nextButton4 = page.getByRole('button', { name: /Next/i }).last()
  await nextButton4.scrollIntoViewIfNeeded()
  await nextButton4.click()
  await page.waitForTimeout(600)
  console.log('   ✅ Moved to Review step\n')

  // ============================================
  // STEP 5: Review & Approval
  // ============================================
  console.log('📊 Step 14: Reviewing Policy Summary...')
  await page.waitForSelector('text=Policy Summary', { timeout: 5000 })
  await expect(page.getByText('Policy Summary')).toBeVisible()
  await expect(page.getByText('TechCorp Solutions Ltd.')).toBeVisible()
  await page.waitForTimeout(500)
  console.log('   ✅ Policy summary visible with all data\n')

  // Final summary
  console.log('\n🎉 ========================================')
  console.log('   DEMO COMPLETED SUCCESSFULLY!')
  console.log('   The browser will close in 2 seconds...')
  console.log('========================================\n')

  await page.waitForTimeout(2000)
})
