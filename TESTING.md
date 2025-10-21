# ISMS Application - Testing Guide

This document provides comprehensive information about testing the ISMS (Information Security Management System) application.

## Table of Contents

- [Setup](#setup)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)

## Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installing Dependencies

**IMPORTANT**: Before installing testing dependencies, fix npm permissions:

```bash
sudo chown -R $(whoami) "/Users/$(whoami)/.npm"
```

Then install the testing dependencies:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8
```

### Test Configuration

The project uses:
- **Vitest**: Fast, Vite-native test framework
- **React Testing Library**: For testing React components
- **jsdom**: Browser environment simulation

Configuration files:
- `vitest.config.ts` - Vitest configuration
- `src/test/setup.ts` - Test setup and global mocks
- `src/test/utils.tsx` - Testing utilities and helpers

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test:watch
```

### Run Tests with UI

```bash
npm test:ui
```

### Generate Coverage Report

```bash
npm test:coverage
```

Coverage reports are generated in `coverage/` directory:
- `coverage/index.html` - HTML report
- `coverage/coverage-final.json` - JSON report

## Test Coverage

### Current Test Files

1. **Dashboard.test.tsx**
   - Rendering tests
   - Progress calculation tests
   - Metrics calculation tests
   - Navigation tests
   - Real-time update tests
   - Edge case handling

2. **RiskAssessment.test.tsx**
   - Asset management tests
   - Threat management tests
   - Vulnerability management tests
   - Risk identification tests
   - Auto-save functionality tests
   - Export functionality tests

3. **StatementOfApplicability.test.tsx**
   - Control filtering tests
   - Applicability management tests
   - Risk treatment integration tests
   - Export functionality tests
   - Mandatory controls tests

### Coverage Goals

Target coverage metrics:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Test Structure

### Directory Structure

```
src/
├── components/
│   ├── __tests__/
│   │   ├── Dashboard.test.tsx
│   │   ├── RiskAssessment.test.tsx
│   │   ├── StatementOfApplicability.test.tsx
│   │   └── ... (other component tests)
│   ├── Dashboard.tsx
│   ├── RiskAssessment.tsx
│   └── ... (other components)
└── test/
    ├── setup.ts
    └── utils.tsx
```

### Test File Naming

- Component tests: `ComponentName.test.tsx`
- Utility tests: `utilityName.test.ts`
- Integration tests: `feature.integration.test.tsx`

## Writing Tests

### Basic Test Template

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders, userEvent } from '../../test/utils'
import YourComponent from '../YourComponent'

describe('YourComponent', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('Rendering', () => {
    it('should render component title', () => {
      renderWithProviders(<YourComponent />)
      expect(screen.getByText('Title')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should handle button click', async () => {
      const user = userEvent.setup()
      renderWithProviders(<YourComponent />)

      const button = screen.getByRole('button', { name: /click me/i })
      await user.click(button)

      expect(screen.getByText('Clicked')).toBeInTheDocument()
    })
  })

  describe('LocalStorage Integration', () => {
    it('should save data to localStorage', async () => {
      const user = userEvent.setup()
      renderWithProviders(<YourComponent />)

      // Perform action that saves data
      const saveButton = screen.getByText('Save')
      await user.click(saveButton)

      const saved = localStorage.getItem('key')
      expect(saved).toBeTruthy()
    })
  })
})
```

### Testing Async Operations

```typescript
import { waitFor } from '@testing-library/react'

it('should load data asynchronously', async () => {
  renderWithProviders(<YourComponent />)

  await waitFor(() => {
    expect(screen.getByText('Loaded Data')).toBeInTheDocument()
  })
})
```

### Testing User Events

```typescript
import { userEvent } from '../../test/utils'

it('should handle user input', async () => {
  const user = userEvent.setup()
  renderWithProviders(<YourComponent />)

  const input = screen.getByLabelText('Name')
  await user.type(input, 'John Doe')

  expect(input).toHaveValue('John Doe')
})
```

### Mocking localStorage

```typescript
beforeEach(() => {
  const mockData = { key: 'value' }
  localStorage.setItem('test-key', JSON.stringify(mockData))
})

afterEach(() => {
  localStorage.clear()
})
```

### Testing Events

```typescript
import { vi } from 'vitest'

it('should dispatch custom event', async () => {
  const eventSpy = vi.fn()
  window.addEventListener('isms-data-updated', eventSpy)

  renderWithProviders(<YourComponent />)

  // Trigger action that dispatches event
  await user.click(screen.getByText('Save'))

  expect(eventSpy).toHaveBeenCalled()

  window.removeEventListener('isms-data-updated', eventSpy)
})
```

## Best Practices

### 1. Test Behavior, Not Implementation

❌ **Bad**: Testing internal state
```typescript
expect(component.state.count).toBe(5)
```

✅ **Good**: Testing user-visible behavior
```typescript
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

### 2. Use Accessible Queries

Prefer queries in this order:
1. `getByRole` - Most accessible
2. `getByLabelText` - Forms
3. `getByPlaceholderText` - Forms fallback
4. `getByText` - Non-interactive content
5. `getByTestId` - Last resort

```typescript
// Best
const button = screen.getByRole('button', { name: /submit/i })

// Good for forms
const input = screen.getByLabelText('Email')

// Avoid if possible
const element = screen.getByTestId('custom-element')
```

### 3. Clean Up After Each Test

```typescript
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.clearAllMocks()
})
```

### 4. Test Edge Cases

- Empty states
- Loading states
- Error states
- Invalid input
- Boundary values
- Null/undefined values
- Corrupted data

### 5. Use Descriptive Test Names

❌ **Bad**:
```typescript
it('works', () => { ... })
```

✅ **Good**:
```typescript
it('should calculate risk level as "high" when likelihood is high and impact is high', () => { ... })
```

### 6. Group Related Tests

```typescript
describe('Dashboard Component', () => {
  describe('Rendering', () => {
    // All rendering tests
  })

  describe('Progress Calculations', () => {
    // All calculation tests
  })

  describe('User Interactions', () => {
    // All interaction tests
  })
})
```

### 7. Avoid Testing Third-Party Libraries

Don't test React, recharts, or other libraries - they have their own tests.

### 8. Mock External Dependencies

```typescript
import { vi } from 'vitest'

vi.mock('xlsx-js-style', () => ({
  write: vi.fn(),
  utils: {
    book_new: vi.fn(),
    json_to_sheet: vi.fn()
  }
}))
```

### 9. Test Accessibility

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('should have no accessibility violations', async () => {
  const { container } = renderWithProviders(<YourComponent />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### 10. Use Snapshots Sparingly

Snapshots are useful for:
- Complex UI structures
- Error messages
- Static content

But avoid for:
- Large components
- Dynamic data
- Timestamps

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## Debugging Tests

### Run Single Test File

```bash
npm test Dashboard.test.tsx
```

### Run Tests Matching Pattern

```bash
npm test -t "should calculate risk"
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/vitest",
  "args": ["--run"],
  "console": "integratedTerminal"
}
```

### View Test Output

```bash
npm test -- --reporter=verbose
```

## Common Issues

### Issue: Tests timeout

**Solution**: Increase timeout in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    testTimeout: 10000
  }
})
```

### Issue: localStorage not persisting

**Solution**: Clear localStorage in `afterEach`:

```typescript
afterEach(() => {
  localStorage.clear()
})
```

### Issue: React warnings in tests

**Solution**: Ensure proper cleanup and act wrapping:

```typescript
import { act } from '@testing-library/react'

await act(async () => {
  // Code that updates state
})
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest-DOM Matchers](https://github.com/testing-library/jest-dom)

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass: `npm test`
3. Check coverage: `npm run test:coverage`
4. Update this document if needed

## Questions?

For testing questions or issues:
1. Check this document
2. Review existing test files
3. Check Vitest/RTL documentation
4. Ask in team chat or create an issue
