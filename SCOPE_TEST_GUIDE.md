# Scope Creation Test - Video & Narrative Guide

## Quick Start

### Run Scope Test with Video Recording (Headless - 2x Faster)
```bash
cd isms-app
npm run demo:scope-narrative:video
```

This will:
- Run the test in headless mode (no browser window)
- Record a video of the entire workflow
- Generate a narrative markdown file
- Complete in approximately **30-40 seconds** (2x faster than before)

### Run Scope Test with Browser Visible
```bash
npm run demo:scope-narrative
```

Watch the test execute in real-time with the browser visible.

## Output Files

After the test completes, find your outputs in the `test-results/` directory:

### 1. Video Recording
Location: `test-results/<test-name>/video.webm`

- Full video of the scope creation workflow
- Shows all 5 steps of the wizard
- No scrolling - smooth step-by-step transitions
- Ready for presentations or documentation

### 2. Narrative Script
Location: `test-results/scope-creation-narrative.md`

- **16 detailed narrative steps** explaining the workflow
- Each step includes:
  - **Action**: What's happening on screen
  - **Description**: Detailed explanation with context
  - **Details**: ISO 27001 significance and audit considerations
- Perfect for training materials or user documentation

### 3. HTML Report
Location: `test-results/index.html`

Open in browser to see:
- Test execution timeline
- Screenshots (if any failures)
- Video playback
- Detailed test logs

## Test Workflow

The test demonstrates the complete 5-step scope definition process:

### Step 1: Internal & External Issues (4 actions)
- Enter organization name: "TechCorp Solutions Ltd."
- Enter industry: "Cloud Services & Software Development"
- Select 3 internal issues
- Select 2 external issues

### Step 2: Interested Parties (3 actions)
- Navigate to step 2
- Select "Customers"
- Select "Employees"
- Select "Regulatory Bodies (GDPR/DPA)"

### Step 3: Interfaces & Dependencies (1 action)
- Navigate to step 3 (skip adding custom interfaces)

### Step 4: Exclusions (3 actions)
- Navigate to step 4
- Select "Personal employee devices (BYOD)"
- Select "Guest Wi-Fi networks"

### Step 5: Scope Document (12 actions)
- Navigate to step 5
- Select 3 processes/services
- Select 3 departments
- Select 2 physical locations
- Review summary

**Total: ~30-40 seconds** (reduced from 60-80 seconds)

## Performance Improvements

### Speed Optimizations Applied:
✅ All wait times reduced by 50%
- Button clicks: 1000ms → 500ms
- Step transitions: 2500ms → 1250ms
- Input fields: 1500ms → 750ms
- Text entry delay: 100ms → 50ms per character

✅ Video recording enabled for all runs
- Config changed from `video: 'retain-on-failure'` to `video: 'on'`

✅ No scrolling required
- Tests use native step navigation
- Smoother video output
- Better visual experience

## Viewing the Video

### On macOS:
```bash
open test-results/*/video.webm
```

### On Windows:
```bash
start test-results/*/video.webm
```

### On Linux:
```bash
xdg-open test-results/*/video.webm
```

Or drag the video file into your browser.

## Sample Narrative Output

Here's what the narrative looks like:

```markdown
# Test Narrative: ISMS Scope Definition Workflow

**Generated:** 1/18/2025, 2:30:45 PM

---

## Step 1: Dashboard Access

**Time:** 0.0s | **Action:** Dashboard Access

The user accesses the ISMS application and arrives at the main dashboard.
This landing page provides an overview of the organization's ISO 27001
implementation journey...

> The dashboard is designed to give users immediate insight into where
> they are in their ISO 27001 journey and what tasks require attention.

---

## Step 2: Scope Definition Navigation

**Time:** 1.0s | **Action:** Scope Definition Navigation

The user clicks on "Define ISMS Scope" in the sidebar navigation...
```

## Troubleshooting

### Video Not Recording?
Check `playwright.config.ts` line 14:
```typescript
video: 'on',  // Should be 'on' not 'retain-on-failure'
```

### Test Running Too Slow?
Verify wait times in `e2e/generate-narrative.spec.ts`:
- Most waits should be 500-750ms
- Step transitions should be 1250ms
- Character delays should be 50ms

### Narrative Not Generated?
Check console output for:
```
📝 Narrative saved to: test-results/scope-creation-narrative.md
```

If missing, check file permissions in `test-results/` directory.

## Advanced Usage

### Run with Different Browser
```bash
npx playwright test e2e/generate-narrative.spec.ts --project=firefox --grep 'Scope Creation'
```

### Run with Debug Mode
```bash
npx playwright test e2e/generate-narrative.spec.ts --debug --grep 'Scope Creation'
```

### Change Video Quality
Edit `playwright.config.ts`:
```typescript
use: {
  video: {
    mode: 'on',
    size: { width: 1920, height: 1080 }
  }
}
```

## Use Cases

### For Presentations
1. Run headless test to generate video
2. Open video in presentation software
3. Use narrative as speaker notes

### For Documentation
1. Generate narrative markdown
2. Add narrative sections to user guide
3. Embed video or link to it

### For Training
1. Share video with new team members
2. Provide narrative as step-by-step guide
3. Have trainees follow along in the app

### For Demos
1. Run headed test during live demo
2. Show stakeholders the workflow
3. Answer questions using narrative context

## Next Steps

Want to customize the test?
1. Edit `e2e/generate-narrative.spec.ts`
2. Modify narrative descriptions
3. Add/remove workflow steps
4. Adjust wait times for your environment

Want to test other workflows?
- SOA Update: `npm run demo:narrative -- --grep "SOA Update"`
- All narratives: `npm run demo:narrative:video`
