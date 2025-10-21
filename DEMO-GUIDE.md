# 🎬 ISMS Scope Creation Visual Demo Guide

## Quick Start

```bash
npm run demo:scope-simple
```

**⚠️ IMPORTANT: Watch the demo - DO NOT close the browser window!**

## What This Demo Does

The visual demo automatically:
- ✨ Opens a Chrome browser with visible interface
- 🖱️ Shows mouse hover effects before clicking
- ⌨️ Types text character-by-character
- 📜 Scrolls smoothly through the form
- ☑️ Selects options with visual feedback
- 🎯 Navigates through multiple steps

## Available Demos

### 1. Simple Demo (RECOMMENDED)
```bash
npm run demo:scope-simple
```
- **Duration**: ~2 minutes
- **Best for**: First viewing, presentations
- Single browser window
- Clear step-by-step console output
- Slower for better visibility

### 2. Full Demo
```bash
npm run demo:scope
```
- **Duration**: ~3-4 minutes
- Complete workflow through all 5 steps
- More detailed interactions
- Runs 2 tests in parallel

### 3. Quick Demo
```bash
npm run demo:scope-quick
```
- **Duration**: ~1 minute
- Condensed version
- Key interactions only

## Console Output

You'll see detailed progress in your terminal:

```
🎬 ========================================
   ISMS SCOPE CREATION VISUAL DEMO
   Please WATCH - Do NOT close the browser!
========================================

📍 Step 1: Opening ISMS Dashboard...
✅ Dashboard loaded

📍 Step 2: Navigating to Scope Definition...
✅ Scope Definition page opened

✍️  Step 3: Entering Organization Details...
   ✅ Organization name entered

📋 Step 4: Selecting Internal Issues...
   ☑️  Sensitive R&D data requires high protection...
   ☑️  Customer data and privacy requirements...
   ✅ Internal issues selected

...and so on
```

## What You'll See in the Browser

### Step 1: Dashboard
- Browser opens to ISMS Dashboard
- Cursor hovers over "Scope Definition" step
- Clicks to navigate

### Step 2: Organization Details
- Scrolls to organization name field
- Cursor hovers over input
- Types "TechCorp Solutions Ltd." character by character
- Moves to industry field
- Types "Cloud Services & Software Development"

### Step 3: Internal Issues
- Scrolls to issues section
- Hovers over each issue button
- Clicks to select
- Green checkmarks appear

### Step 4: External Issues
- Scrolls down
- Selects regulatory and security issues
- Visual feedback on selection

### Step 5: Next Steps
- Hovers over "Next Step" button
- Clicks to proceed
- Navigates to Interested Parties
- Selects key stakeholders

...and continues through all steps!

## Customization

### Adjust Speed

Edit the `slowMo` value in the test file:

```typescript
// In e2e/scope-demo-simple.spec.ts
test.use({
  launchOptions: {
    slowMo: 800, // milliseconds - increase for slower, decrease for faster
  },
})
```

### Adjust Typing Speed

Change the `delay` parameter:

```typescript
await input.pressSequentially('Text here', { delay: 120 }) // 120ms per character
```

## Troubleshooting

### Browser closes immediately
**Issue**: You closed the browser manually
**Solution**: Let the demo run automatically - don't close the browser

### Port already in use
**Issue**: Port 5173 is occupied
**Solution**:
```bash
# Kill any existing Vite processes
lsof -ti:5173 | xargs kill
# Or stop your dev server before running the demo
```

### Elements not found
**Issue**: App is loading slowly
**Solution**: The demo already has generous waits. If needed, increase timeout values in the test file.

### Test fails but browser worked
**Issue**: Demo ran but Playwright reported failure
**Solution**: This is normal if you manually interacted with the browser. The demo still worked visually!

## Tips for Best Results

1. **Close other applications** - Reduces system load
2. **Use a large monitor** - Easier to see details
3. **Disable notifications** - Prevents interruptions
4. **Run one demo at a time** - Better performance
5. **Full screen the browser** - Better visibility
6. **Watch the console** - Shows progress
7. **Don't click in the browser** - Let it run automatically

## Recording the Demo

To record as video, you can use:

1. **Built-in screen recording** (Mac):
   - Press `Cmd + Shift + 5`
   - Select screen area
   - Start recording
   - Run `npm run demo:scope-simple`

2. **Playwright video recording**:
   - Edit the test file and add:
     ```typescript
     test.use({
       video: 'on',
       launchOptions: { slowMo: 800 }
     })
     ```
   - Videos saved in `test-results/` directory

## For Presentations

Best settings for live demonstrations:

```bash
# Slowest, most visible
npx playwright test e2e/scope-demo-simple.spec.ts --headed --slow-mo=1200

# Or edit the test to set slowMo: 1200
```

This gives plenty of time for audience to see each action.

## More Information

See `e2e/README.md` for complete documentation including:
- Full technical details
- All customization options
- Additional demo scripts
- Advanced configuration

## Support

Having issues? Check:
1. Playwright is installed: `npx playwright install chromium`
2. Dependencies are installed: `npm install`
3. Dev server can start: `npm run dev`
4. Port 5173 is available

## What's Next?

After watching the demo, you can:
1. Modify the test to show different data
2. Create your own demo scripts
3. Add more steps to the demonstration
4. Use for training and presentations
5. Extend to other ISMS modules

---

**Remember**: This is an automated demo - just watch and enjoy! 🎭
