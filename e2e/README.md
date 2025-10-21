# Visual Demo Scripts - ISMS Application

This directory contains Playwright test scripts that demonstrate the ISMS application workflows with **visible mouse movements and typing animations**.

## 🎬 Scope Creation Demo

The scope creation demo (`scope-creation-demo.spec.ts`) provides a complete visual walkthrough of defining an ISMS scope step-by-step.

### Features

✨ **Visual Feedback**
- Visible browser window (headed mode)
- Slow motion (500ms delay between actions)
- Mouse hover animations before clicks
- Character-by-character typing with delays
- Automatic scrolling to elements

📋 **Complete Workflow**
1. Organization details entry
2. Internal issues selection
3. External issues selection
4. Interested parties identification
5. Interfaces and dependencies definition
6. Exclusions specification
7. Processes and services selection
8. Departments inclusion
9. Physical locations definition
10. Additional notes

## 🚀 Running the Demos

### Prerequisites

Make sure Playwright browsers are installed:

```bash
npx playwright install
```

### ⚠️ IMPORTANT: Do NOT Close the Browser!

When running these demos:
- A Chrome browser window will open automatically
- **DO NOT CLOSE THE BROWSER** - Let it run automatically!
- Watch the cursor move and text being typed
- The browser will close automatically when done
- Closing the browser manually will stop the demo

### 🌟 Recommended: Simple Demo (Best for First-Time Viewing)

Run the simplified, easy-to-follow demonstration:

```bash
npm run demo:scope-simple
```

This will:
- Open ONE browser window (easier to watch)
- Navigate through the first few steps clearly
- Show all key interactions with visual feedback
- Run slower for better visibility (800ms delays)
- **Duration**: ~2 minutes
- **Best for**: First-time viewing, presentations

### Full Demo (Complete Workflow)

Run the complete scope creation demonstration:

```bash
npm run demo:scope
```

This will:
- Open a visible Chrome browser
- Navigate through all 5 steps of scope creation
- Fill in organization details
- Select multiple options from predefined lists
- Add custom entries
- Show typing animations and mouse movements
- Display the final summary
- **Duration**: ~3-4 minutes
- **Note**: Runs 2 tests in parallel (can be confusing to watch)

### Quick Demo (Shortened Version)

For a faster overview:

```bash
npm run demo:scope-quick
```

This shows a condensed version covering the key interactions in ~1 minute.

### Manual Execution

You can also run Playwright directly with custom options:

```bash
# Run with default slow motion (500ms)
npx playwright test e2e/scope-creation-demo.spec.ts --headed --project=chromium

# Run even slower for presentations (1000ms delay)
npx playwright test e2e/scope-creation-demo.spec.ts --headed --project=chromium --slow-mo=1000

# Run in debug mode with Playwright Inspector
npx playwright test e2e/scope-creation-demo.spec.ts --debug --project=chromium
```

## 🎯 What You'll See

### Organization Details Entry
- Typing "Innovative Tech Solutions Inc." character by character
- Filling industry, CEO, and CISO names with realistic typing speed
- Date selection for effective and review dates

### Interactive Selections
- Hovering over buttons before clicking
- Green checkmarks appearing on selected items
- Smooth scrolling to bring elements into view
- Visual feedback for all user actions

### Custom Entries
- Adding custom internal/external issues
- Typing interface and dependency details
- Filling justifications for exclusions
- Adding additional notes

### Navigation
- Progressive step-by-step advancement
- Visual progress bar updates
- Step completion indicators

## 🛠️ Customization

### Adjust Speed

Edit the `slowMo` value in `scope-creation-demo.spec.ts`:

```typescript
test.use({
  launchOptions: {
    slowMo: 500, // Change this value (in milliseconds)
  },
})
```

### Modify Typing Speed

Change the `delay` parameter in `pressSequentially()` calls:

```typescript
await input.pressSequentially('Text here', { delay: 100 }) // 100ms per character
```

### Add More Steps

The demo is structured with clearly marked sections:

```typescript
// ============================================
// YOUR NEW STEP: Description
// ============================================
console.log('📝 Step X: Doing something...')
// Add your actions here
```

## 📊 Console Output

The demo provides detailed console output showing progress:

```
🎬 Starting Visual Demo: ISMS Scope Creation

📍 Step 1: Opening ISMS Dashboard...
🎯 Step 2: Clicking "Start Scope Definition" button...
📝 Step 3: Filling Organization Details...
   ✍️ Typing Organization Name...
   ✍️ Typing Industry...
   ...
✅ Step 18: Completing Scope Definition...

🎉 Scope Creation Demo Complete!
```

## 🐛 Troubleshooting

### Browser doesn't open
Make sure you've installed Playwright browsers:
```bash
npx playwright install chromium
```

### Test runs too fast
Increase the `slowMo` value or add more `waitForTimeout()` calls.

### Elements not found
The app might be loading slowly. Increase timeout values:
```typescript
await page.waitForTimeout(2000) // Increase from 1000 to 2000
```

### Port already in use
If port 5173 is occupied, either:
1. Stop the existing Vite server
2. Or modify `playwright.config.ts` to use a different port

## 📚 Additional Demos

### Other Available Demos

- `visual-demo.spec.ts` - SOA workflow demonstration
- `complete-workflow.spec.ts` - Full ISMS workflow test
- `soa-workflow.spec.ts` - SOA-specific tests

Run all demos:
```bash
npx playwright test e2e/ --headed
```

## 🎥 Recording

To record the demo as a video, use Playwright's video recording feature:

```typescript
// Add to test.use() in the spec file
test.use({
  video: 'on',
  launchOptions: {
    slowMo: 500,
  },
})
```

Videos will be saved in `test-results/` directory.

## 💡 Tips

1. **Close other applications** to ensure smooth recording
2. **Use a large monitor** to see all details clearly
3. **Disable notifications** to avoid interruptions
4. **Run one demo at a time** for best performance
5. **Check console output** for step-by-step progress
6. **Adjust `slowMo` based on your audience** - slower for presentations, faster for quick checks

## 🤝 Contributing

To add new demo scenarios:

1. Create a new test in this directory
2. Use `pressSequentially()` for typing animations
3. Add `hover()` before clicks for mouse visibility
4. Include `waitForTimeout()` for visibility
5. Add console logs for progress tracking
6. Document your demo in this README

## 📄 License

Part of the ISMS Application project.
