import { test, expect } from '@playwright/test'

/**
 * Simplified Risk Assessment Demo
 *
 * Watch this demo run - DO NOT CLOSE THE BROWSER!
 * The browser will close automatically when complete.
 *
 * To run: npm run demo:risk-simple
 */

// Configure for visual demonstration
test.use({
  launchOptions: {
    slowMo: 800, // Slowed down for better visibility
  },
})

test('Risk Assessment Visual Demo', async ({ page }) => {
  // Set a long timeout for the demo - 7 minutes
  test.setTimeout(420000)
  console.log('\n🎬 ========================================')
  console.log('   RISK ASSESSMENT DEMO')
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

  // Navigate to Risk Assessment via sidebar
  console.log('📍 Step 2: Clicking "Risk Assessment" in sidebar...')
  await page.waitForTimeout(1000) // Give React time to hydrate
  const riskMenuItem = page.locator('text=Risk Assessment').first()
  await riskMenuItem.waitFor({ state: 'visible', timeout: 10000 })
  await riskMenuItem.scrollIntoViewIfNeeded()
  await riskMenuItem.click()

  // Wait for navigation to complete
  await page.waitForSelector('text=Assessment Setup', { timeout: 10000 })
  await page.waitForTimeout(400)
  console.log('✅ Risk Assessment page opened\n')

  // ============================================
  // STEP 1: Assessment Setup
  // ============================================
  console.log('⚙️  Step 3: Configuring Assessment Setup...')

  // Fill Organization Name
  const orgNameInput = page.getByPlaceholder('Enter organization name')
  await orgNameInput.scrollIntoViewIfNeeded()
  await orgNameInput.click()
  await orgNameInput.fill('TechCorp Solutions Ltd.')
  await page.waitForTimeout(250)
  console.log('   ✅ Organization name entered')

  // Fill Assessment Date
  const assessmentDateInput = page.locator('input[type="date"]').first()
  await assessmentDateInput.click()
  await assessmentDateInput.fill('2025-10-21')
  await page.waitForTimeout(250)
  console.log('   ✅ Assessment date entered')

  // Fill Assessor
  const assessorInput = page.getByPlaceholder('Enter assessor name/team')
  await assessorInput.click()
  await assessorInput.fill('Information Security Team')
  await page.waitForTimeout(250)
  console.log('   ✅ Assessor entered')

  // Fill Scope
  const scopeTextarea = page.getByPlaceholder('Define the scope of your risk assessment...')
  await scopeTextarea.scrollIntoViewIfNeeded()
  await scopeTextarea.click()
  await scopeTextarea.fill('All information systems and data processing activities within the ISMS scope, including customer data, cloud infrastructure, and business applications.')
  await page.waitForTimeout(250)
  console.log('   ✅ Scope defined\n')

  // Move to next step
  console.log('▶️  Step 4: Proceeding to Asset Identification...')
  const nextButton = page.getByRole('button', { name: /Next/i }).last()
  await nextButton.scrollIntoViewIfNeeded()
  await nextButton.click()

  // Wait for navigation to Asset Identification step
  await page.waitForSelector('text=Identified Assets', { timeout: 10000 })
  await page.waitForTimeout(600)
  console.log('   ✅ Moved to Asset Identification step\n')

  // ============================================
  // STEP 2: Asset Identification
  // ============================================
  console.log('📦 Step 5: Selecting Critical Assets...')

  const assets = [
    'Customer Database',
    'Financial Records',
    'Email System',
    'Web Application'
  ]

  for (const asset of assets) {
    console.log(`   ☑️  ${asset}`)
    const assetButton = page.getByRole('button', { name: asset })
    await assetButton.scrollIntoViewIfNeeded()
    await assetButton.click()
    await page.waitForTimeout(200)
  }
  console.log('   ✅ Critical assets selected\n')

  // Verify assets are saved
  await page.waitForTimeout(500)
  console.log('\n📊 Step 6: Verifying Asset Information...')
  await expect(page.getByRole('heading', { name: 'Customer Database' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Financial Records' })).toBeVisible()
  console.log('   ✅ Assets successfully identified and saved\n')

  // Move to Risk Analysis step
  console.log('▶️  Step 7: Proceeding to Risk Analysis...')
  const nextButton2 = page.getByRole('button', { name: /Next/i }).last()
  await nextButton2.scrollIntoViewIfNeeded()
  await nextButton2.click()

  // Wait for Risk Analysis step to load
  await page.waitForSelector('text=Risk Analysis', { timeout: 10000 })
  await page.waitForTimeout(600)
  console.log('   ✅ Moved to Risk Analysis step\n')

  // ============================================
  // STEP 3: Risk Analysis
  // ============================================
  console.log('⚡ Step 8: Analyzing Risk for Customer Database...')

  // Select the first asset (Customer Database)
  const customerDbButton = page.getByRole('button', { name: /Customer Database/ }).first()
  await customerDbButton.scrollIntoViewIfNeeded()
  await customerDbButton.click()
  await page.waitForTimeout(400)
  console.log('   ✅ Selected Customer Database for risk analysis')

  // Select a threat
  console.log('   🎯 Selecting threat...')
  const threatSelect = page.locator('label:has-text("Select Threat")').locator('..').locator('select')
  await threatSelect.scrollIntoViewIfNeeded()
  await threatSelect.selectOption({ index: 1 }) // Select first available threat
  await page.waitForTimeout(300)
  console.log('   ✅ Threat selected')

  // Select a vulnerability
  console.log('   🔓 Selecting vulnerability...')
  const vulnSelect = page.locator('label:has-text("Select Vulnerability")').locator('..').locator('select')
  await vulnSelect.scrollIntoViewIfNeeded()
  await vulnSelect.selectOption({ index: 1 }) // Select first available vulnerability
  await page.waitForTimeout(300)
  console.log('   ✅ Vulnerability selected')

  // Set likelihood to high
  console.log('   📊 Setting likelihood and impact...')
  const likelihoodSelect = page.locator('label:has-text("Likelihood")').locator('..').locator('select')
  await likelihoodSelect.selectOption('high')
  await page.waitForTimeout(200)

  // Set impact to high
  const impactSelect = page.locator('label:has-text("Impact")').locator('..').locator('select')
  await impactSelect.selectOption('high')
  await page.waitForTimeout(300)
  console.log('   ✅ Likelihood and impact set to High')

  // Enter existing controls
  console.log('   🛡️  Entering existing controls...')
  const controlsTextarea = page.getByPlaceholder(/Firewall protection/)
  await controlsTextarea.scrollIntoViewIfNeeded()
  await controlsTextarea.click()
  const controls = [
    'Database encryption at rest',
    'Access control lists (ACLs)',
    'Regular security audits',
    'Intrusion detection system (IDS)'
  ]
  await controlsTextarea.fill(controls.join('\n'))
  await page.waitForTimeout(400)
  console.log('   ✅ Existing controls entered:')
  controls.forEach(control => console.log(`      • ${control}`))

  // Add the first risk
  console.log('\n   💾 Adding first risk to assessment...')
  const addRiskButton = page.getByRole('button', { name: /Add Risk & Continue/i })
  await addRiskButton.scrollIntoViewIfNeeded()
  await addRiskButton.click()
  await page.waitForTimeout(600)
  console.log('   ✅ First risk successfully added with controls\n')

  // Add second risk for Customer Database
  console.log('⚡ Step 9: Adding second risk for Customer Database...')

  // Select another threat
  const threatSelect2 = page.locator('label:has-text("Select Threat")').locator('..').locator('select')
  await threatSelect2.scrollIntoViewIfNeeded()
  await threatSelect2.selectOption({ index: 2 }) // Select second threat
  await page.waitForTimeout(300)
  console.log('   ✅ Second threat selected')

  // Select vulnerability
  const vulnSelect2 = page.locator('label:has-text("Select Vulnerability")').locator('..').locator('select')
  await vulnSelect2.scrollIntoViewIfNeeded()
  await vulnSelect2.selectOption({ index: 1 })
  await page.waitForTimeout(300)
  console.log('   ✅ Vulnerability selected')

  // Set likelihood to medium, impact to high
  const likelihoodSelect2 = page.locator('label:has-text("Likelihood")').locator('..').locator('select')
  await likelihoodSelect2.selectOption('medium')
  await page.waitForTimeout(200)

  const impactSelect2 = page.locator('label:has-text("Impact")').locator('..').locator('select')
  await impactSelect2.selectOption('high')
  await page.waitForTimeout(300)
  console.log('   ✅ Likelihood: Medium, Impact: High')

  // Enter controls for second risk
  const controlsTextarea2 = page.getByPlaceholder(/Firewall protection/)
  await controlsTextarea2.scrollIntoViewIfNeeded()
  await controlsTextarea2.click()
  await controlsTextarea2.fill('Multi-factor authentication\nData backup and recovery\nSecurity awareness training')
  await page.waitForTimeout(300)
  console.log('   ✅ Controls entered for second risk')

  // Add second risk
  await addRiskButton.scrollIntoViewIfNeeded()
  await addRiskButton.click()
  await page.waitForTimeout(600)
  console.log('   ✅ Second risk added\n')

  // Add risk for Financial Records
  console.log('⚡ Step 10: Adding risk for Financial Records...')

  // Select Financial Records asset
  const financialRecordsButton = page.getByRole('button', { name: /Financial Records/ }).first()
  await financialRecordsButton.scrollIntoViewIfNeeded()
  await financialRecordsButton.click()
  await page.waitForTimeout(400)
  console.log('   ✅ Selected Financial Records')

  // Select threat
  const threatSelect3 = page.locator('label:has-text("Select Threat")').locator('..').locator('select')
  await threatSelect3.scrollIntoViewIfNeeded()
  await threatSelect3.selectOption({ index: 1 })
  await page.waitForTimeout(300)

  // Select vulnerability
  const vulnSelect3 = page.locator('label:has-text("Select Vulnerability")').locator('..').locator('select')
  await vulnSelect3.scrollIntoViewIfNeeded()
  await vulnSelect3.selectOption({ index: 1 })
  await page.waitForTimeout(300)
  console.log('   ✅ Threat and vulnerability selected')

  // Set likelihood and impact
  const likelihoodSelect3 = page.locator('label:has-text("Likelihood")').locator('..').locator('select')
  await likelihoodSelect3.selectOption('low')
  const impactSelect3 = page.locator('label:has-text("Impact")').locator('..').locator('select')
  await impactSelect3.selectOption('very-high')
  await page.waitForTimeout(300)
  console.log('   ✅ Likelihood: Low, Impact: Very High')

  // Enter controls
  const controlsTextarea3 = page.getByPlaceholder(/Firewall protection/)
  await controlsTextarea3.scrollIntoViewIfNeeded()
  await controlsTextarea3.fill('Financial data encryption\nAccess logging and monitoring\nRegular compliance audits')
  await page.waitForTimeout(300)
  console.log('   ✅ Controls entered')

  // Add third risk
  await addRiskButton.scrollIntoViewIfNeeded()
  await addRiskButton.click()
  await page.waitForTimeout(600)
  console.log('   ✅ Third risk added for Financial Records\n')

  // Add risk for Email System
  console.log('⚡ Step 11: Adding risk for Email System...')

  // Select Email System asset
  const emailSystemButton = page.getByRole('button', { name: /Email System/ }).first()
  await emailSystemButton.scrollIntoViewIfNeeded()
  await emailSystemButton.click()
  await page.waitForTimeout(400)
  console.log('   ✅ Selected Email System')

  // Select threat
  const threatSelect4 = page.locator('label:has-text("Select Threat")').locator('..').locator('select')
  await threatSelect4.scrollIntoViewIfNeeded()
  await threatSelect4.selectOption({ index: 1 })
  await page.waitForTimeout(300)

  // Select vulnerability
  const vulnSelect4 = page.locator('label:has-text("Select Vulnerability")').locator('..').locator('select')
  await vulnSelect4.scrollIntoViewIfNeeded()
  await vulnSelect4.selectOption({ index: 1 })
  await page.waitForTimeout(300)
  console.log('   ✅ Threat and vulnerability selected')

  // Set likelihood and impact
  const likelihoodSelect4 = page.locator('label:has-text("Likelihood")').locator('..').locator('select')
  await likelihoodSelect4.selectOption('high')
  const impactSelect4 = page.locator('label:has-text("Impact")').locator('..').locator('select')
  await impactSelect4.selectOption('medium')
  await page.waitForTimeout(300)
  console.log('   ✅ Likelihood: High, Impact: Medium')

  // Enter controls
  const controlsTextarea4 = page.getByPlaceholder(/Firewall protection/)
  await controlsTextarea4.scrollIntoViewIfNeeded()
  await controlsTextarea4.fill('Email encryption (TLS/SSL)\nSpam and malware filtering\nEmail authentication (SPF, DKIM, DMARC)')
  await page.waitForTimeout(300)
  console.log('   ✅ Controls entered')

  // Add fourth risk
  await addRiskButton.scrollIntoViewIfNeeded()
  await addRiskButton.click()
  await page.waitForTimeout(600)
  console.log('   ✅ Fourth risk added for Email System\n')

  // Add risk for Web Application
  console.log('⚡ Step 12: Adding risk for Web Application...')

  // Select Web Application asset
  const webAppButton = page.getByRole('button', { name: /Web Application/ }).first()
  await webAppButton.scrollIntoViewIfNeeded()
  await webAppButton.click()
  await page.waitForTimeout(400)
  console.log('   ✅ Selected Web Application')

  // Select threat
  const threatSelect5 = page.locator('label:has-text("Select Threat")').locator('..').locator('select')
  await threatSelect5.scrollIntoViewIfNeeded()
  await threatSelect5.selectOption({ index: 1 })
  await page.waitForTimeout(300)

  // Select vulnerability
  const vulnSelect5 = page.locator('label:has-text("Select Vulnerability")').locator('..').locator('select')
  await vulnSelect5.scrollIntoViewIfNeeded()
  await vulnSelect5.selectOption({ index: 1 })
  await page.waitForTimeout(300)
  console.log('   ✅ Threat and vulnerability selected')

  // Set likelihood and impact
  const likelihoodSelect5 = page.locator('label:has-text("Likelihood")').locator('..').locator('select')
  await likelihoodSelect5.selectOption('medium')
  const impactSelect5 = page.locator('label:has-text("Impact")').locator('..').locator('select')
  await impactSelect5.selectOption('high')
  await page.waitForTimeout(300)
  console.log('   ✅ Likelihood: Medium, Impact: High')

  // Enter controls
  const controlsTextarea5 = page.getByPlaceholder(/Firewall protection/)
  await controlsTextarea5.scrollIntoViewIfNeeded()
  await controlsTextarea5.fill('Web application firewall (WAF)\nSecure coding practices\nRegular vulnerability scanning\nInput validation and sanitization')
  await page.waitForTimeout(300)
  console.log('   ✅ Controls entered')

  // Add fifth risk
  await addRiskButton.scrollIntoViewIfNeeded()
  await addRiskButton.click()
  await page.waitForTimeout(600)
  console.log('   ✅ Fifth risk added for Web Application\n')

  // Final summary
  console.log('\n🎉 ========================================')
  console.log('   DEMO COMPLETED SUCCESSFULLY!')
  console.log('   Risk Assessment with Controls Complete')
  console.log('   - Setup & Asset Identification ✓')
  console.log('   - Risk Analysis with 5 Risks & Controls ✓')
  console.log('     • Customer Database: 2 risks')
  console.log('     • Financial Records: 1 risk')
  console.log('     • Email System: 1 risk')
  console.log('     • Web Application: 1 risk')
  console.log('   ALL ASSETS COVERED ✓')
  console.log('   The browser will close in 3 seconds...')
  console.log('========================================\n')

  await page.waitForTimeout(3000)
})
