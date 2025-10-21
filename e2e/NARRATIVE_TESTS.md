# Narrative Test Documentation

This directory contains Playwright tests that generate detailed narrative descriptions alongside video recordings. These narrated tests are perfect for:

- **Documentation**: Creating comprehensive guides showing how the application works
- **Presentations**: Demonstrating workflows to stakeholders with both video and written descriptions
- **Training**: Helping new team members understand the application flow
- **Audit Trail**: Providing detailed records of test executions for compliance purposes

## What Are Narrative Tests?

Narrative tests run exactly like regular Playwright tests, but they generate rich, descriptive markdown documents that explain what's happening at each step. Think of them as a screenplay for your application - they describe not just *what* is happening, but *why* it's happening and *what it means* in the context of ISO 27001 implementation.

## Available Narrative Tests

### 1. SOA Update Workflow (`npm run demo:narrative`)
**File**: `generate-narrative.spec.ts` - "SOA Update Workflow - Narrated"

Demonstrates the complete workflow for documenting a control in the Statement of Applicability:
- Opening the dashboard
- Navigating to the SOA section
- Selecting a control
- Marking it as applicable
- Adding justification
- Setting implementation status
- Assigning responsibility
- Verifying dashboard updates

**Output**: `test-results/soa-workflow-narrative.md`

### 2. Scope Creation Workflow (`npm run demo:narrative`)
**File**: `generate-narrative.spec.ts` - "Scope Creation Workflow - Narrated"

Demonstrates the complete ISMS scope definition process:
- Entering organization details
- Identifying internal issues
- Identifying external issues
- Selecting interested parties
- Completing scope documentation

**Output**: `test-results/scope-creation-narrative.md`

## Running Narrative Tests

### Interactive Mode (Watch the Browser)
```bash
npm run demo:narrative
```
This runs the tests with the browser visible so you can watch the automation happen while the narrative is being generated.

### Headless Mode with Video Recording
```bash
npm run demo:narrative:video
```
This runs the tests in headless mode and records videos (saved to `test-results/` directory when tests fail).

### Running Specific Tests
```bash
# Run only the SOA workflow narrative
npx playwright test e2e/generate-narrative.spec.ts --headed -g "SOA Update"

# Run only the Scope Creation narrative
npx playwright test e2e/generate-narrative.spec.ts --headed -g "Scope Creation"
```

## Output Files

After running the tests, you'll find:

### Narrative Documents
- `test-results/soa-workflow-narrative.md` - Detailed narrative of SOA workflow
- `test-results/scope-creation-narrative.md` - Detailed narrative of scope creation workflow

### Videos (on failure)
- `test-results/*/video.webm` - Screen recordings of failed tests

### Screenshots (on failure)
- `test-results/*/screenshot.png` - Screenshots captured at failure points

## Sample Narrative Output

Here's what a narrative looks like:

```markdown
# Test Narrative: Statement of Applicability Update Workflow

**Generated:** 1/18/2025, 10:30:15 AM

---

## Step 1: Application Launch

**Time:** 0.0s | **Action:** Application Launch

The ISMS application dashboard opens, presenting the main overview screen.
The dashboard displays the current implementation status across all ISO 27001:2022
requirements, showing a comprehensive view of the organization's information
security management system progress.

> The dashboard serves as the central hub for all ISMS activities, providing
> quick access to key areas such as risk assessment, policy management, and
> control implementation.

---

## Step 2: Navigation to SOA

**Time:** 2.1s | **Action:** Navigation to SOA

The user navigates to the Statement of Applicability section by clicking
the "Review SOA Controls" quick action button...
```

## Customizing Narratives

To create your own narrative tests:

1. **Import the NarrativeGenerator class** from `generate-narrative.spec.ts`
2. **Create a new test** with narrative tracking
3. **Add narrative steps** using `narrator.addStep(action, description, details)`
4. **Save the narrative** at the end using `narrator.save(filename)`

Example:

```typescript
import { test, expect } from '@playwright/test'
import { NarrativeGenerator } from './generate-narrative.spec.ts'

test('My Custom Workflow - Narrated', async ({ page }) => {
  const narrator = new NarrativeGenerator('My Custom Workflow')

  narrator.addStep(
    'Opening Page',
    'The user navigates to the custom page...',
    'This page is used for specific functionality...'
  )

  await page.goto('/custom-page')

  // ... more test steps with narrator.addStep() calls ...

  narrator.save('custom-workflow-narrative.md')
})
```

## Benefits

### For Documentation
- Automatically generates user guides as tests run
- Ensures documentation stays in sync with actual functionality
- Provides step-by-step walkthroughs with context

### For Presentations
- Combine narrative markdown with video recordings
- Show stakeholders exactly how the system works
- Explain the "why" behind each action

### For Compliance
- Create audit trails showing how controls are documented
- Demonstrate systematic approach to ISO 27001 implementation
- Provide evidence of thorough testing

### For Training
- New team members can read narratives to understand workflows
- Videos + narratives provide multiple learning modalities
- Context-rich explanations help understanding

## Video + Narrative Combination

The most powerful use case is combining videos with narratives:

1. **Run test with video**: `npm run demo:narrative:video`
2. **Review the video**: Watch what happened visually
3. **Read the narrative**: Understand why each action was taken
4. **Share both**: Provide comprehensive documentation to stakeholders

## Tips

- **Slow down tests** for better visibility: Adjust `slowMo` in test.use()
- **Add more detail** in narratives: The more context, the more valuable
- **Update narratives** when functionality changes: Keep them current
- **Use for onboarding**: Have new team members run and read narratives
- **Create presentations**: Export narratives to PDF for stakeholder meetings

## Future Enhancements

Potential additions to the narrative system:

- **Audio narration**: Text-to-speech overlay on videos
- **HTML reports**: Interactive web-based narratives
- **Screenshot integration**: Embed screenshots in narrative markdown
- **Timestamp linking**: Link narrative steps to specific video timestamps
- **Metrics collection**: Track performance data during narrative generation
- **Multi-language**: Generate narratives in different languages

## Questions or Issues?

If you have questions about narrative tests or want to create custom ones, refer to the main test files in this directory or check the Playwright documentation at https://playwright.dev.
