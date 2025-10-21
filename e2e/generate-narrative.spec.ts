import { test, expect } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Narrative Generator for ISMS Application Tests
 *
 * This script runs alongside Playwright tests and generates detailed
 * narrative descriptions of what's happening during the test execution.
 *
 * Output: narrative.md file with step-by-step descriptions
 */

interface NarrativeStep {
  timestamp: string
  stepNumber: number
  action: string
  description: string
  details?: string
}

class NarrativeGenerator {
  private steps: NarrativeStep[] = []
  private stepCounter = 0
  private startTime = Date.now()
  private testName = ''

  constructor(testName: string) {
    this.testName = testName
  }

  addStep(action: string, description: string, details?: string) {
    this.stepCounter++
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1)

    this.steps.push({
      timestamp: `${elapsed}s`,
      stepNumber: this.stepCounter,
      action,
      description,
      details
    })
  }

  generateMarkdown(): string {
    let markdown = `# Test Narrative: ${this.testName}\n\n`
    markdown += `**Generated:** ${new Date().toLocaleString()}\n\n`
    markdown += `---\n\n`

    for (const step of this.steps) {
      markdown += `## Step ${step.stepNumber}: ${step.action}\n\n`
      markdown += `**Time:** ${step.timestamp} | **Action:** ${step.action}\n\n`
      markdown += `${step.description}\n\n`

      if (step.details) {
        markdown += `> ${step.details}\n\n`
      }

      markdown += `---\n\n`
    }

    return markdown
  }

  save(filename: string) {
    const outputDir = path.join(__dirname, '../test-results')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const filepath = path.join(outputDir, filename)
    fs.writeFileSync(filepath, this.generateMarkdown())
    console.log(`\n📝 Narrative saved to: ${filepath}`)
  }
}

// Configure for visual demonstration with comprehensive narration
// Total narration: ~15.4 minutes (925 seconds)
test.use({
  launchOptions: {
    slowMo: 500, // Moderate speed for comprehensive narration
  },
})

// SOA Update Workflow test - DISABLED
// Uncomment to re-enable SOA testing
/*
test('SOA Update Workflow - Narrated', async ({ page }) => {
  const narrator = new NarrativeGenerator('Statement of Applicability Update Workflow')

  narrator.addStep(
    'Application Launch',
    'The ISMS application dashboard opens, presenting the main overview screen. The dashboard displays the current implementation status across all ISO 27001:2022 requirements, showing a comprehensive view of the organization\'s information security management system progress.',
    'The dashboard serves as the central hub for all ISMS activities, providing quick access to key areas such as risk assessment, policy management, and control implementation.'
  )

  await page.goto('/')
  await expect(page.getByText('ISMS Dashboard')).toBeVisible()
  await page.waitForTimeout(2000)

  narrator.addStep(
    'Navigation to SOA',
    'The user navigates to the Statement of Applicability section by clicking the "Review SOA Controls" quick action button. This section contains all 93 controls from ISO 27001:2022 Annex A, which need to be assessed for applicability to the organization.',
    'The Statement of Applicability is a critical document that records decisions about which controls apply to the organization and which do not, along with justifications for each decision.'
  )

  await page.getByRole('button', { name: /Review SOA Controls/i }).click()
  await page.waitForTimeout(2000)
  await expect(page.getByText('Total Controls')).toBeVisible()
  await page.waitForTimeout(1000)

  narrator.addStep(
    'Control Selection',
    'The first control from the ISO 27001 Annex A control set is selected for assessment. Each control card displays the control ID, title, and current documentation status. The system presents controls in a logical grouping based on their security domain (Organizational, People, Physical, or Technological controls).',
    'Controls are organized to facilitate systematic review and documentation, ensuring no control is overlooked during the assessment process.'
  )

  const controlCards = page.locator('[class*="border"]').filter({ hasText: /A\.\d+\.\d+:/ })
  const firstControl = controlCards.first()
  await firstControl.scrollIntoViewIfNeeded()
  await firstControl.click()
  await page.waitForTimeout(1500)

  narrator.addStep(
    'Applicability Status Selection',
    'The control is marked as "Applicable" to the organization. This decision indicates that the control is relevant to the organization\'s security needs and should be implemented. The status dropdown offers three options: Applicable, Partially Applicable, or Not Applicable, each requiring appropriate justification.',
    'Determining applicability requires careful consideration of the organization\'s context, the nature of its information assets, and the threats and vulnerabilities it faces.'
  )

  const selects = page.locator('select')
  const statusSelect = selects.first()
  await statusSelect.scrollIntoViewIfNeeded()
  await statusSelect.selectOption('applicable')
  await page.waitForTimeout(1000)

  narrator.addStep(
    'Justification Documentation',
    'A comprehensive justification is entered explaining why this control is necessary for the organization. The justification reads: "This control is required to protect our information assets and ensure compliance with ISO 27001." This explanation provides context for auditors and stakeholders about the decision-making process.',
    'ISO 27001 requires organizations to justify their applicability decisions. Strong justifications demonstrate that decisions are based on thoughtful risk assessment rather than arbitrary choices.'
  )

  const justificationField = page.getByPlaceholder(/explain why/i).first()
  await justificationField.scrollIntoViewIfNeeded()
  await justificationField.fill('This control is required to protect our information assets and ensure compliance with ISO 27001')
  await page.waitForTimeout(1500)

  narrator.addStep(
    'Implementation Status Assignment',
    'The implementation status is set to "Planned", indicating that while the control is recognized as necessary, its implementation is scheduled for future execution. Other available statuses include "In Progress" for controls currently being deployed, and "Implemented" for controls that are fully operational.',
    'Tracking implementation status helps organizations prioritize their security initiatives and provides transparency about the current state of their security posture.'
  )

  const implSelect = selects.nth(1)
  await implSelect.scrollIntoViewIfNeeded()
  await implSelect.selectOption('planned')
  await page.waitForTimeout(1000)

  narrator.addStep(
    'Responsibility Assignment',
    'The "Information Security Team" is designated as the responsible party for this control. Assigning clear ownership ensures accountability and facilitates coordination of implementation efforts. The responsible party will oversee the control\'s deployment, monitoring, and maintenance.',
    'Clear ownership is essential for effective security governance. Each control should have a designated owner who ensures its proper implementation and ongoing effectiveness.'
  )

  const responsibleField = page.getByPlaceholder(/responsible/i).first()
  if (await responsibleField.isVisible()) {
    await responsibleField.scrollIntoViewIfNeeded()
    await responsibleField.fill('Information Security Team')
    await page.waitForTimeout(1000)
  }

  narrator.addStep(
    'Data Persistence',
    'The application automatically saves all entered information to the browser\'s local storage. This auto-save functionality ensures that no data is lost even if the user navigates away from the page or experiences an unexpected browser closure. The save operation happens silently in the background.',
    'Auto-save functionality improves user experience by eliminating the need for manual save operations and protecting against accidental data loss.'
  )

  await page.waitForTimeout(2000)

  narrator.addStep(
    'Return to Dashboard',
    'The user navigates back to the main dashboard by clicking the "Dashboard" link in the navigation menu. This triggers the application to recalculate all progress metrics based on the newly documented control information.',
    'The dashboard dynamically updates to reflect changes made throughout the application, providing real-time visibility into implementation progress.'
  )

  await page.getByText('Dashboard').first().click()
  await page.waitForTimeout(2000)
  await expect(page.getByText('ISMS Dashboard')).toBeVisible()

  narrator.addStep(
    'Progress Calculation',
    'The system recalculates the Statement of Applicability completion percentage. The calculation considers multiple factors: controls must have justifications, and applicable controls must also have implementation details (status, description, or responsible party) to count toward completion. This ensures that only thoroughly documented controls contribute to the progress metric.',
    'Progress metrics provide stakeholders with quantifiable indicators of ISMS implementation status, helping to demonstrate compliance readiness and identify areas requiring attention.'
  )

  await page.waitForTimeout(3000)

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

  if (soaData) {
    narrator.addStep(
      'Results Verification',
      `The Statement of Applicability completion status has been updated successfully. The system now shows ${soaData.documented} out of ${soaData.total} controls are documented, representing a ${soaData.percentage}% completion rate. This metric will continue to improve as more controls are assessed and documented.`,
      `This single control documentation has moved the organization one step closer to ISO 27001 certification. The systematic approach ensures comprehensive coverage of all security requirements.`
    )
  }

  narrator.addStep(
    'Test Completion',
    'The workflow demonstration concludes successfully. The test has verified that users can navigate to the Statement of Applicability, document control decisions with proper justification and implementation details, and see those changes reflected in the dashboard metrics. This end-to-end workflow represents a core function of the ISMS application.',
    'This workflow will be repeated for all 93 Annex A controls, building a comprehensive Statement of Applicability that demonstrates the organization\'s thoughtful approach to information security.'
  )

  await page.waitForTimeout(2000)

  // Save the narrative
  narrator.save('soa-workflow-narrative.md')

  // Verify expectations
  if (soaData) {
    expect(soaData.documented).toBeGreaterThan(0)
    expect(soaData.percentage).toBeGreaterThan(0)
  }
})
*/

test('Scope Creation Workflow - Narrated', async ({ page }) => {
  const narrator = new NarrativeGenerator('ISMS Scope Definition Workflow')
  test.setTimeout(1200000) // 20 minutes for comprehensive narration (~15.4 min)

  narrator.addStep(
    'Dashboard Access',
    'The user accesses the ISMS application and arrives at the main dashboard. This landing page provides an overview of the organization\'s ISO 27001 implementation journey, displaying progress across all major implementation stages including scope definition, risk assessment, control implementation, and audit readiness.',
    'The dashboard is designed to give users immediate insight into where they are in their ISO 27001 journey and what tasks require attention.'
  )

  // Clear localStorage to start with a clean state
  await page.goto('/')
  await page.waitForTimeout(500)

  // Clear all storage and verify
  const cleared = await page.evaluate(() => {
    const before = Object.keys(localStorage).length
    localStorage.clear()
    sessionStorage.clear()
    const after = Object.keys(localStorage).length
    return { before, after }
  })

  console.log(`🧹 Storage cleared - Before: ${cleared.before} keys, After: ${cleared.after} keys`)

  await expect(page.getByText('ISMS Dashboard')).toBeVisible()

  // Step 1: Dashboard Access (Introduction narration: 32.8s)
  await page.waitForTimeout(32000)

  narrator.addStep(
    'Scope Definition Navigation',
    'The user clicks on "Define ISMS Scope" in the sidebar navigation. Scope definition is the foundational step in ISO 27001 implementation, where the organization establishes the boundaries of its Information Security Management System. The application presents a structured, five-step wizard that guides users through the scope definition process systematically.',
    'A well-defined scope is critical for ISO 27001 certification. It must be neither too broad (making implementation impractical) nor too narrow (limiting the value of certification).'
  )

  // Steps 2-3: Navigation + Overview ("The Journey Begins": 66.3s total, ~33s each)
  const scopeMenuItem = page.locator('text=Define ISMS Scope').first()
  await scopeMenuItem.click()
  await page.waitForSelector('text=Step-by-step guide to defining your ISMS boundaries', { timeout: 10000 })
  await page.waitForTimeout(10000) // Pause after clicking navigation

  // Clear localStorage and force a clean state by clearing pre-selected items
  await page.evaluate(() => {
    // Remove localStorage keys
    localStorage.removeItem('isms-scope-data')
    localStorage.removeItem('scopeData')

    // Set empty scope data
    const emptyScope = {
      organizationName: '',
      organizationType: 'Corporation',
      industry: '',
      policyVersion: '',
      ceoName: '',
      cisoName: '',
      effectiveDate: '',
      nextReviewDate: '',
      internalIssues: [],
      externalIssues: [],
      interestedParties: [],
      interfaces: [],
      exclusions: [],
      scopeDocument: {
        processesAndServices: [],
        departments: [],
        physicalLocations: [],
        additionalNotes: ''
      }
    }
    localStorage.setItem('isms-scope-data', JSON.stringify(emptyScope))
  })

  // Navigate to scope page again to pick up empty data (instead of reload which goes to dashboard)
  await scopeMenuItem.click()
  await page.waitForSelector('text=Step-by-step guide to defining your ISMS boundaries', { timeout: 10000 })
  await page.waitForTimeout(5000)

  console.log(`🧹 Scope data cleared and reset to empty state`)

  narrator.addStep(
    'Step 1 Overview - Internal & External Issues',
    'The wizard opens on Step 1, which focuses on identifying internal and external issues that define the ISMS scope. The interface displays a progress bar showing "Step 1 of 5" and highlights "Internal & External Issues" as the current step. The page includes organization details fields and sections for both internal and external issues that influence scope boundaries.',
    'ISO 27001 Clause 4.1 requires organizations to understand their context by identifying internal and external issues. This understanding shapes appropriate scope boundaries.'
  )

  // Continue "The Journey Begins" narration
  await page.waitForTimeout(20000) // Rest of 66.3s narration

  narrator.addStep(
    'Organization Name Entry',
    'The organization name "TechCorp Solutions Ltd." is entered into the system. This information will appear in all generated documentation and helps contextualize the ISMS within the specific organizational structure. The input field provides helpful placeholder text suggesting appropriate formatting.',
    'Accurate organizational information is essential for certification documentation and helps auditors understand the organizational context of the ISMS.'
  )

  // Steps 4-6: Organizational Context ("Establishing Organizational Context": 81s total)
  const orgNameInput = page.getByPlaceholder(/e.g., Acme Corporation/i)
  await orgNameInput.click()
  await orgNameInput.clear()
  await orgNameInput.pressSequentially('TechCorp Solutions Ltd.', { delay: 150 })
  await page.waitForTimeout(15000) // Step 4 narration

  narrator.addStep(
    'Industry Classification',
    'The organization\'s industry is specified as "Cloud Services & Software Development". This classification helps establish the context for risk assessment and control selection. Different industries face different information security risks - cloud services providers must address multi-tenancy, data segregation, and service availability concerns.',
    'Industry classification influences which threats are most relevant, which controls are most appropriate, and which compliance requirements apply to the organization.'
  )

  const industryInput = page.getByPlaceholder(/e.g., Technology Services/i)
  await industryInput.click()
  await industryInput.clear()
  await industryInput.pressSequentially('Cloud Services & Software Development', { delay: 80 })
  await page.waitForTimeout(15000) // Step 5 narration

  narrator.addStep(
    'Policy Details Entry',
    'The policy version "2.0" is entered, indicating this is the second major revision of the organization\'s ISMS documentation. The CEO "Michael Anderson" and CISO "Jennifer Martinez" are designated as the executive sponsors and oversight authorities for the ISMS. The effective date is set to October 18, 2025, with a next review date one year later on October 18, 2026.',
    'ISO 27001 requires clear leadership accountability. Designating the CEO and CISO establishes executive ownership and ensures adequate resources and authority for the ISMS. Regular annual reviews ensure the ISMS remains current and effective.'
  )

  const policyVersionInput = page.getByPlaceholder(/e.g., 1.0/i)
  await policyVersionInput.click()
  await policyVersionInput.clear()
  await policyVersionInput.pressSequentially('2.0', { delay: 150 })
  await page.waitForTimeout(3000)

  const ceoNameInput = page.getByPlaceholder(/e.g., John Smith/i)
  await ceoNameInput.click()
  await ceoNameInput.clear()
  await ceoNameInput.pressSequentially('Michael Anderson', { delay: 120 })
  await page.waitForTimeout(3000)

  const cisoNameInput = page.getByPlaceholder(/e.g., Sarah Johnson/i)
  await cisoNameInput.click()
  await cisoNameInput.clear()
  await cisoNameInput.pressSequentially('Jennifer Martinez', { delay: 120 })
  await page.waitForTimeout(3000)

  const effectiveDateInput = page.locator('input[type="date"]').first()
  await effectiveDateInput.click()
  await effectiveDateInput.fill('2025-10-18')
  await page.waitForTimeout(3000)

  const reviewDateInput = page.locator('input[type="date"]').nth(1)
  await reviewDateInput.click()
  await reviewDateInput.fill('2026-10-18')
  await page.waitForTimeout(20000) // Step 6 narration completion

  narrator.addStep(
    'Internal Issues Selection',
    'The user now selects three critical internal issues from the predefined options. Each selection appears as a clickable button that turns green when selected, providing clear visual feedback. The selected issues are: "Sensitive R&D data requires high protection" (protecting intellectual property), "Customer data and privacy requirements" (data protection obligations), and "Financial data processing and reporting" (financial information integrity).',
    'These internal issues create a foundation for risk assessment. Each identified issue will lead to specific risks that need to be assessed and treated in later implementation phases.'
  )

  // Step 7: Internal Issues ("Identifying Internal Challenges": 88.1s)
  const internalIssues = [
    'Sensitive R&D data requires high protection',
    'Customer data and privacy requirements',
    'Financial data processing and reporting'
  ]

  for (const issue of internalIssues) {
    const issueButton = page.getByRole('button', { name: issue })

    // Only click if button is enabled (not already selected)
    if (await issueButton.isEnabled()) {
      await issueButton.click()
      await page.waitForTimeout(3000) // Pause between selections for narration
    } else {
      // Skip already selected items
      await page.waitForTimeout(100)
    }
  }

  await page.waitForTimeout(75000) // Complete Step 7 narration (88.1s total)

  narrator.addStep(
    'External Issues Selection',
    'Two significant external issues are identified from the available options. "Industry regulations (GDPR, HIPAA, SOX, etc.)" is selected, acknowledging the heavily regulated environment. "Cybersecurity threats and attack vectors" is also selected, recognizing the evolving threat landscape including ransomware, phishing, and advanced persistent threats. Selected items are highlighted with green checkmarks.',
    'External issues often drive mandatory compliance requirements and influence the organization\'s risk appetite and tolerance levels. Regulatory compliance is frequently a primary driver for ISO 27001 certification.'
  )

  // Step 8: External Issues ("Understanding External Pressures": 87.9s)
  const externalIssues = [
    'Industry regulations (GDPR, HIPAA, SOX, etc.)',
    'Cybersecurity threats and attack vectors'
  ]

  for (const issue of externalIssues) {
    const issueButton = page.getByRole('button', { name: issue }).first()

    // Only click if button is enabled (not already selected)
    if (await issueButton.isEnabled()) {
      await issueButton.click()
      await page.waitForTimeout(3000) // Pause between selections
    } else {
      // Skip already selected items
      await page.waitForTimeout(100)
    }
  }

  await page.waitForTimeout(80000) // Complete Step 8 narration (87.9s total)

  narrator.addStep(
    'Progress to Step 2 - Interested Parties',
    'Having completed the internal and external issues analysis, the user clicks the "Next Step" button at the bottom of the page. The interface smoothly transitions to Step 2: Interested Parties. The progress bar updates to show "Step 2 of 5" and the step indicator highlights "Interested Parties" as active. The page displays predefined interested party options with detailed requirements and influence descriptions.',
    'ISO 27001 Clause 4.2 requires organizations to identify interested parties and their requirements. This ensures the ISMS addresses stakeholder needs and expectations, not just internal management preferences.'
  )

  // Steps 9-10: Stakeholders ("Identifying Stakeholders": 100.2s total)
  await page.waitForTimeout(5000)
  const nextButton1 = page.getByRole('button', { name: /Next Step/i })
  await nextButton1.click()
  await page.waitForTimeout(30000) // Step 9 narration (~50s)

  narrator.addStep(
    'Interested Parties Selection',
    'Three key interested parties are selected by clicking their respective cards. Each card displays the party name, their requirements, and their influence on the ISMS scope. "Customers" (requiring data protection and privacy compliance), "Employees" (needing personal data protection and workplace security), and "Regulatory Bodies (GDPR/DPA)" (enforcing data protection regulations) are chosen. Selected cards turn green with checkmarks.',
    'Understanding interested parties ensures the ISMS meets all stakeholder expectations and compliance obligations, reducing the risk of certification failures or regulatory penalties during audits.'
  )

  const parties = ['Customers', 'Employees', 'Regulatory Bodies (GDPR/DPA)']

  for (const party of parties) {
    const partyCard = page.locator(`text="${party}"`).first().locator('..')

    // Only click if not already selected
    if (await partyCard.isEnabled()) {
      await partyCard.click()
      await page.waitForTimeout(3000)
    } else {
      // Skip already selected items
      await page.waitForTimeout(100)
    }
  }

  await page.waitForTimeout(50000) // Step 10 narration (~50s)

  narrator.addStep(
    'Progress to Step 3 - Interfaces & Dependencies',
    'The user proceeds to Step 3 by clicking "Next Step". The interface transitions to the "Interfaces & Dependencies" section. The progress bar now shows "Step 3 of 5" and displays a form for documenting system interfaces and dependencies. This step helps identify situations where organizational boundaries and technical boundaries intersect.',
    'ISO 27001 requires understanding interfaces and dependencies because they can constrain scope decisions. For example, if two departments share infrastructure, it may be impractical to include one in scope but not the other.'
  )

  // Steps 11-12: Dependencies ("Documenting Dependencies": 72.3s total)
  await page.waitForTimeout(5000)
  const nextButton2 = page.getByRole('button', { name: /Next Step/i })
  await nextButton2.click()
  await page.waitForTimeout(30000) // Step 11 narration (~36s)

  narrator.addStep(
    'Skipping Interfaces Documentation',
    'For this demonstration, the user proceeds without adding custom interface dependencies. In a real implementation, organizations would document critical system interfaces, shared infrastructure, and dependencies that influence scope boundaries. The "Add Interface" button is available but not used in this walkthrough.',
    'Interface documentation helps auditors understand technical constraints on scope decisions and demonstrates thoughtful consideration of organizational complexity.'
  )

  await page.waitForTimeout(35000) // Step 12 narration (~36s)

  narrator.addStep(
    'Progress to Step 4 - Exclusions',
    'Advancing to Step 4, the interface displays the "Exclusions" section. The progress bar updates to "Step 4 of 5". This step presents numerous predefined exclusions with justifications, allowing users to select items intentionally excluded from the ISMS scope. Each exclusion card shows the excluded item and the rationale for exclusion.',
    'ISO 27001 requires documenting and justifying scope exclusions. Auditors will verify that exclusions are legitimate and that the remaining scope adequately addresses the organization\'s information security risks.'
  )

  // Steps 13-14: Exclusions ("Defining Exclusions": 86.7s total)
  await page.waitForTimeout(5000)
  const nextButton3 = page.getByRole('button', { name: /Next Step/i })
  await nextButton3.click()
  await page.waitForTimeout(35000) // Step 13 narration (~43s)

  narrator.addStep(
    'Selecting Scope Exclusions',
    'Two common exclusions are selected: "Personal employee devices (BYOD)" - justified because the company has no administrative control over personal devices - and "Guest Wi-Fi networks" - excluded because the guest network is isolated with no access to business systems or data. These selections turn green indicating they are added to the scope document.',
    'Well-justified exclusions demonstrate that scope boundaries are based on practical control considerations rather than convenience. They show auditors that scope decisions are thoughtful and appropriate.'
  )

  const exclusions = [
    'Personal employee devices (BYOD)',
    'Guest Wi-Fi networks'
  ]

  for (const exclusion of exclusions) {
    const exclusionCard = page.locator(`text="${exclusion}"`).first().locator('..')
    await exclusionCard.click()
    await page.waitForTimeout(3000)
  }

  await page.waitForTimeout(35000) // Step 14 narration (~43s)

  narrator.addStep(
    'Progress to Step 5 - Scope Document',
    'The user advances to the final step by clicking "Next Step". The interface transitions to Step 5: "Scope Document". The progress bar shows "Step 5 of 5" with a green checkmark indicating near-completion. This step presents sections for documenting processes & services, departments, physical locations, and exclusions. Multiple predefined options are available for selection in each category.',
    'The scope document formalizes all previous analysis into a coherent statement of ISMS boundaries. This document will be included in certification audits and serves as a key reference throughout ISO 27001 implementation.'
  )

  // Steps 15-18: Scope Document ("Formalizing the Scope Statement": 148.6s total)
  await page.waitForTimeout(5000)
  const nextButton4 = page.getByRole('button', { name: /Next Step/i })
  await nextButton4.click()

  // Wait for Step 5 to load
  await page.waitForSelector('text=/Processes and Services Included in Scope/i', { timeout: 10000 })
  await page.waitForTimeout(30000) // Step 15 narration (~37s)

  narrator.addStep(
    'Selecting Processes and Services',
    'The user selects key processes to include in scope: "Software development and deployment" (core technical processes), "Customer data processing" (handling customer information), and "Network and infrastructure management" (maintaining IT infrastructure). Each selection highlights in green. These processes represent the organization\'s core information-handling activities that require security management.',
    'Processes and services define what the ISMS actually protects. Selecting appropriate processes ensures the ISMS covers all critical information-handling activities while remaining practical to implement.'
  )

  const processes = [
    'Software development and deployment',
    'Customer data processing',
    'Network and infrastructure management'
  ]

  for (const process of processes) {
    const processButton = page.getByRole('button', { name: process })

    // Only click if button is enabled (not already selected)
    if (await processButton.isEnabled()) {
      await processButton.click()
      await page.waitForTimeout(3000)
    } else {
      // Skip already selected items
      await page.waitForTimeout(100)
    }
  }

  await page.waitForTimeout(25000) // Step 16 narration (~37s)

  narrator.addStep(
    'Selecting Departments',
    'Three departments are selected for ISMS scope coverage: "IT Department" (manages technical infrastructure), "Research & Development (R&D)" (handles intellectual property), and "Customer Service" (processes customer data). The selections turn green with checkmarks. These departments handle the majority of the organization\'s sensitive information and critical business processes.',
    'Department selection defines organizational boundaries of the ISMS. Including the right departments ensures comprehensive coverage of information security risks while maintaining implementation feasibility.'
  )

  const departments = [
    'IT Department',
    'Research & Development (R&D)',
    'Customer Service'
  ]

  for (const dept of departments) {
    const deptButton = page.getByRole('button', { name: dept, exact: true })

    // Only click if button is enabled (not already selected)
    if (await deptButton.isEnabled()) {
      await deptButton.click()
      await page.waitForTimeout(3000)
    } else {
      // Skip already selected items
      await page.waitForTimeout(100)
    }
  }

  await page.waitForTimeout(25000) // Step 17 narration (~37s)

  narrator.addStep(
    'Selecting Physical Locations',
    'Physical locations are defined: "Main office building" and "Data center facility" are selected. These represent the primary physical sites where information assets are stored and processed. The selections turn green indicating inclusion in the scope document. Cloud infrastructure could also be selected if applicable to the organization.',
    'Physical location boundaries are essential for security controls related to physical access, environmental protections, and disaster recovery planning. Auditors will verify that stated locations are accurate.'
  )

  const locations = [
    'Main office building',
    'Data center facility'
  ]

  for (const location of locations) {
    const locationButton = page.getByRole('button', { name: location })

    // Only click if button is enabled (not already selected)
    if (await locationButton.isEnabled()) {
      await locationButton.click()
      await page.waitForTimeout(3000)
    } else {
      // Skip already selected items
      await page.waitForTimeout(100)
    }
  }

  await page.waitForTimeout(25000) // Step 18 narration (~37s)

  narrator.addStep(
    'Reviewing Scope Summary',
    'The bottom of the page displays a comprehensive summary showing all scope components: Processes/Services (3 defined), Departments (3 included), Physical Locations (2 included), and Exclusions (2 defined). The analysis summary also shows Internal Issues (3), External Issues (2), Interested Parties (3), and Interfaces & Dependencies (0). This provides a complete overview before finalizing the scope.',
    'The summary helps users verify completeness and consistency of their scope definition before generating the formal scope document or proceeding with implementation.'
  )

  // Steps 19-20: Completion ("Adding Context and Completing the Process": 117.6s total)
  await page.waitForTimeout(55000) // Step 19 narration (~58s)

  narrator.addStep(
    'Workflow Completion',
    'The scope definition workflow is now complete. The organization has systematically identified its context (internal and external issues), its stakeholders (interested parties), its boundaries (processes, departments, locations), and its exclusions. The user can now either generate an AI-powered scope document using the "Generate with AI" button or continue without AI generation. All data is automatically saved to local storage.',
    'A well-defined scope is the cornerstone of successful ISO 27001 implementation. This systematic approach ensures scope decisions are based on thorough analysis rather than arbitrary choices, significantly improving certification readiness.'
  )

  await page.waitForTimeout(55000) // Step 20 narration (~58s)

  // Conclusion narration (43.4s)
  await page.waitForTimeout(43000)

  // Save the narrative
  narrator.save('scope-creation-narrative.md')
})
