import { test, expect } from '@playwright/test'

/**
 * Simplified Statement of Applicability (SOA) Demo
 *
 * Watch this demo run - DO NOT CLOSE THE BROWSER!
 * The browser will close automatically when complete.
 *
 * To run: npm run demo:soa-simple
 */

// Configure for visual demonstration
test.use({
  launchOptions: {
    slowMo: 800, // Slowed down for better visibility
  },
})

test('Statement of Applicability Visual Demo', async ({ page }) => {
  // Set a long timeout for the demo - 7 minutes
  test.setTimeout(420000)
  console.log('\n🎬 ========================================')
  console.log('   STATEMENT OF APPLICABILITY DEMO')
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

  // Navigate to Statement of Applicability via sidebar
  console.log('📍 Step 2: Clicking "Statement of Applicability" in sidebar...')
  await page.waitForTimeout(1000) // Give React time to hydrate
  const soaMenuItem = page.locator('text=Statement of Applicability').first()
  await soaMenuItem.waitFor({ state: 'visible', timeout: 10000 })
  await soaMenuItem.scrollIntoViewIfNeeded()
  await soaMenuItem.click()

  // Wait for SOA page to load
  await page.waitForSelector('text=Total Controls', { timeout: 10000 })
  await page.waitForTimeout(600)
  console.log('✅ Statement of Applicability page opened\n')

  // ============================================
  // Document Applicable Controls
  // ============================================
  console.log('📋 Step 3: Documenting Applicable Controls...\n')

  // Control 1: A.5.1 - Policies for information security (Mandatory)
  console.log('   📌 Control A.5.1 - Policies for information security')

  // Scroll to A.5.1 heading
  await page.getByText('A.5.1: Policies for information security').scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)

  // Click the purple button with shield icon for this control
  const control1Card = page.locator('div:has(h3:has-text("A.5.1: Policies for information security"))').first()
  await control1Card.locator('.flex.items-center.gap-2 >> button:has(svg.lucide-shield)').click()
  await page.waitForTimeout(600)

  // Scroll to make sure the expanded form is fully visible
  await control1Card.scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)

  // Set as applicable
  await control1Card.locator('label:has-text("Applicability Status")').locator('..').locator('select').selectOption('applicable')
  await page.waitForTimeout(200)

  // Set implementation status
  await control1Card.locator('label:has-text("Implementation Status")').locator('..').locator('select').selectOption('implemented')
  await page.waitForTimeout(200)

  // Add justification
  await control1Card.locator('label:has-text("Justification")').locator('..').locator('textarea').fill('Mandatory control required for ISO 27001 compliance. Information security policies have been established, documented, and communicated to all employees.')
  await page.waitForTimeout(200)

  // Add implementation description
  await control1Card.locator('label:has-text("Implementation Description")').locator('..').locator('textarea').fill('Comprehensive information security policy framework established including policy statement, objectives, roles and responsibilities, and compliance requirements.')
  await page.waitForTimeout(200)

  // Add responsible party
  await control1Card.locator('label:has-text("Responsible Party")').locator('..').locator('input[type="text"]').fill('CISO and Information Security Team')
  await page.waitForTimeout(200)

  console.log('   ✅ A.5.1 documented as Implemented\n')

  // Control 2: A.5.10 - Acceptable use of information
  console.log('   📌 Control A.5.10 - Acceptable use of information')

  await page.getByText('A.5.10: Acceptable use of information and other associated assets').scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)

  const control2Card = page.locator('div:has(h3:has-text("A.5.10:"))').first()
  await control2Card.locator('.flex.items-center.gap-2 >> button:has(svg.lucide-shield)').click()
  await page.waitForTimeout(600)

  await control2Card.scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)

  await control2Card.locator('label:has-text("Applicability Status")').locator('..').locator('select').selectOption('applicable')
  await page.waitForTimeout(200)

  await control2Card.locator('label:has-text("Implementation Status")').locator('..').locator('select').selectOption('in-progress')
  await page.waitForTimeout(200)

  await control2Card.locator('label:has-text("Justification")').locator('..').locator('textarea').fill('Required to establish clear guidelines for acceptable use of information and information processing facilities to prevent misuse and security incidents.')
  await page.waitForTimeout(200)

  await control2Card.locator('label:has-text("Implementation Description")').locator('..').locator('textarea').fill('Acceptable Use Policy being developed and will be enforced through employee acknowledgment and regular awareness training.')
  await page.waitForTimeout(200)

  await control2Card.locator('label:has-text("Responsible Party")').locator('..').locator('input[type="text"]').fill('HR and IT Security Team')
  await page.waitForTimeout(200)

  console.log('   ✅ A.5.10 documented as In Progress\n')

  // Control 3: A.5.15 - Access control
  console.log('   📌 Control A.5.15 - Access control')

  await page.getByText('A.5.15: Access control').first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)

  const control3Card = page.locator('div:has(h3:has-text("A.5.15:"))').first()
  await control3Card.locator('.flex.items-center.gap-2 >> button:has(svg.lucide-shield)').click()
  await page.waitForTimeout(600)

  await control3Card.scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)

  await control3Card.locator('label:has-text("Applicability Status")').locator('..').locator('select').selectOption('applicable')
  await page.waitForTimeout(200)

  await control3Card.locator('label:has-text("Implementation Status")').locator('..').locator('select').selectOption('planned')
  await page.waitForTimeout(200)

  await control3Card.locator('label:has-text("Justification")').locator('..').locator('textarea').fill('Critical for maintaining customer trust and protecting sensitive data. Access control rules based on least privilege principle must be established.')
  await page.waitForTimeout(200)

  await control3Card.locator('label:has-text("Implementation Description")').locator('..').locator('textarea').fill('Implementing role-based access control (RBAC) system with regular access reviews and automated provisioning/de-provisioning.')
  await page.waitForTimeout(200)

  await control3Card.locator('label:has-text("Responsible Party")').locator('..').locator('input[type="text"]').fill('IT Operations Manager')
  await page.waitForTimeout(200)

  await control3Card.locator('label:has-text("Target Implementation Date")').locator('..').locator('input[type="date"]').fill('2025-12-31')
  await page.waitForTimeout(200)

  console.log('   ✅ A.5.15 documented as Planned\n')

  // Control 4: A.8.2 - Privileged access rights
  console.log('   📌 Control A.8.2 - Privileged access rights')

  await page.getByText('A.8.2: Privileged access rights').first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)

  const control4Card = page.locator('div:has(h3:has-text("A.8.2:"))').first()
  await control4Card.locator('.flex.items-center.gap-2 >> button:has(svg.lucide-shield)').click()
  await page.waitForTimeout(600)

  await control4Card.scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)

  await control4Card.locator('label:has-text("Applicability Status")').locator('..').locator('select').selectOption('applicable')
  await page.waitForTimeout(200)

  await control4Card.locator('label:has-text("Implementation Status")').locator('..').locator('select').selectOption('implemented')
  await page.waitForTimeout(200)

  await control4Card.locator('label:has-text("Justification")').locator('..').locator('textarea').fill('Necessary to prevent security incidents and protect against cyber threats by restricting privileged access to authorized personnel only.')
  await page.waitForTimeout(200)

  await control4Card.locator('label:has-text("Implementation Description")').locator('..').locator('textarea').fill('Privileged access management (PAM) solution implemented with multi-factor authentication, session recording, and regular access audits.')
  await page.waitForTimeout(200)

  await control4Card.locator('label:has-text("Responsible Party")').locator('..').locator('input[type="text"]').fill('Security Operations Team')
  await page.waitForTimeout(200)

  console.log('   ✅ A.8.2 documented as Implemented\n')

  // Control 5: A.8.10 - Information deletion
  console.log('   📌 Control A.8.10 - Information deletion')

  await page.getByText('A.8.10: Information deletion').first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)

  const control5Card = page.locator('div:has(h3:has-text("A.8.10:"))').first()
  await control5Card.locator('.flex.items-center.gap-2 >> button:has(svg.lucide-shield)').click()
  await page.waitForTimeout(600)

  await control5Card.scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)

  await control5Card.locator('label:has-text("Applicability Status")').locator('..').locator('select').selectOption('applicable')
  await page.waitForTimeout(200)

  await control5Card.locator('label:has-text("Implementation Status")').locator('..').locator('select').selectOption('in-progress')
  await page.waitForTimeout(200)

  await control5Card.locator('label:has-text("Justification")').locator('..').locator('textarea').fill('Required to protect confidential information and meet data protection requirements. Secure deletion prevents data breaches from disposed storage media.')
  await page.waitForTimeout(200)

  await control5Card.locator('label:has-text("Implementation Description")').locator('..').locator('textarea').fill('Developing data retention and secure deletion procedures with encryption of data at rest and secure wiping protocols for decommissioned devices.')
  await page.waitForTimeout(200)

  await control5Card.locator('label:has-text("Responsible Party")').locator('..').locator('input[type="text"]').fill('Data Protection Officer')
  await page.waitForTimeout(200)

  console.log('   ✅ A.8.10 documented as In Progress\n')

  // ============================================
  // Document Partially Applicable Control
  // ============================================
  console.log('📋 Step 4: Documenting Partially Applicable Control...\n')

  // Control 6: A.8.15 - Logging (Partially Applicable)
  console.log('   📌 Control A.8.15 - Logging')

  await page.getByText('A.8.15: Logging').first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)

  const control6Card = page.locator('div:has(h3:has-text("A.8.15:"))').first()
  await control6Card.locator('.flex.items-center.gap-2 >> button:has(svg.lucide-shield)').click()
  await page.waitForTimeout(600)

  await control6Card.scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)

  await control6Card.locator('label:has-text("Applicability Status")').locator('..').locator('select').selectOption('partially-applicable')
  await page.waitForTimeout(200)

  await control6Card.locator('label:has-text("Implementation Status")').locator('..').locator('select').selectOption('in-progress')
  await page.waitForTimeout(200)

  await control6Card.locator('label:has-text("Justification")').locator('..').locator('textarea').fill('Partially applicable - logging is implemented for critical systems but not yet comprehensive across all infrastructure. Full implementation requires additional SIEM capabilities.')
  await page.waitForTimeout(200)

  await control6Card.locator('label:has-text("Implementation Description")').locator('..').locator('textarea').fill('Event logging active on production servers and databases. Expanding to cover network devices and cloud services with centralized SIEM platform.')
  await page.waitForTimeout(200)

  await control6Card.locator('label:has-text("Responsible Party")').locator('..').locator('input[type="text"]').fill('SOC Team Lead')
  await page.waitForTimeout(200)

  console.log('   ✅ A.8.15 documented as Partially Applicable\n')

  // ============================================
  // Document Not Applicable Controls
  // ============================================
  console.log('📋 Step 5: Documenting Not Applicable Controls...\n')

  // Control 7: A.6.6 - Capacity management (Not Applicable)
  console.log('   📌 Control A.6.6 - Capacity management')

  // Ensure we're still on the SOA page
  await expect(page.getByText('Total Controls')).toBeVisible()
  await page.waitForTimeout(300)

  await page.getByText('A.6.6: Capacity management').first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)

  const control7Card = page.locator('div:has(h3:has-text("A.6.6:"))').first()
  await control7Card.waitFor({ state: 'visible', timeout: 5000 })
  await control7Card.locator('.flex.items-center.gap-2 >> button:has(svg.lucide-shield)').click()
  await page.waitForTimeout(600)

  await control7Card.scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)

  await control7Card.locator('label:has-text("Applicability Status")').locator('..').locator('select').selectOption('not-applicable')
  await page.waitForTimeout(200)

  await control7Card.locator('label:has-text("Justification")').locator('..').locator('textarea').fill('Not applicable - all infrastructure is cloud-based with auto-scaling capabilities managed by cloud provider (AWS). Capacity management is handled automatically.')
  await page.waitForTimeout(200)

  await control7Card.locator('label:has-text("Responsible Party")').locator('..').locator('input[type="text"]').fill('Cloud Infrastructure Team')
  await page.waitForTimeout(200)

  console.log('   ✅ A.6.6 documented as Not Applicable\n')

  // Control 8: A.7.14 - Secure disposal of equipment (Not Applicable)
  console.log('   📌 Control A.7.14 - Secure disposal of equipment')

  // Ensure we're still on the SOA page
  await expect(page.getByText('Total Controls')).toBeVisible()
  await page.waitForTimeout(300)

  await page.getByText('A.7.14: Secure disposal or re-use of equipment').first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)

  const control8Card = page.locator('div:has(h3:has-text("A.7.14:"))').first()
  await control8Card.waitFor({ state: 'visible', timeout: 5000 })
  await control8Card.locator('.flex.items-center.gap-2 >> button:has(svg.lucide-shield)').click()
  await page.waitForTimeout(600)

  await control8Card.scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)

  await control8Card.locator('label:has-text("Applicability Status")').locator('..').locator('select').selectOption('not-applicable')
  await page.waitForTimeout(200)

  await control8Card.locator('label:has-text("Justification")').locator('..').locator('textarea').fill('Not applicable - organization operates entirely on cloud infrastructure with no physical on-premise equipment to dispose. Equipment disposal is managed by cloud service provider.')
  await page.waitForTimeout(200)

  await control8Card.locator('label:has-text("Responsible Party")').locator('..').locator('input[type="text"]').fill('Facilities Manager')
  await page.waitForTimeout(200)

  console.log('   ✅ A.7.14 documented as Not Applicable\n')

  // ============================================
  // Verify Summary Metrics
  // ============================================
  console.log('📊 Step 6: Verifying SOA Summary...')

  // Scroll to top to see the summary
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(600)

  // Verify totals are displayed
  await expect(page.getByText('Total Controls')).toBeVisible()
  await expect(page.getByText('Applicable')).toBeVisible()
  await expect(page.getByText('Partially')).toBeVisible()
  await expect(page.getByText('Not Applicable')).toBeVisible()

  console.log('   ✅ SOA summary displayed with control counts\n')

  // Final summary
  console.log('\n🎉 ========================================')
  console.log('   DEMO COMPLETED SUCCESSFULLY!')
  console.log('   Statement of Applicability Complete')
  console.log('   - 5 Controls marked as Applicable')
  console.log('   - 1 Control marked as Partially Applicable')
  console.log('   - 2 Controls marked as Not Applicable')
  console.log('   - All with justifications & details')
  console.log('   The browser will close in 3 seconds...')
  console.log('========================================\n')

  await page.waitForTimeout(3000)
})
