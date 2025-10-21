# Test Suite Installation Guide

## Quick Start

### Step 1: Fix npm Permissions (if needed)

If you encounter permission errors during npm install, run:

```bash
sudo chown -R $(whoami) "/Users/$(whoami)/.npm"
```

### Step 2: Install Test Dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8
```

### Step 3: Verify Installation

```bash
npm test
```

## What Was Created

### Configuration Files

1. **vitest.config.ts** - Vitest configuration with jsdom environment
2. **src/test/setup.ts** - Test setup with global mocks
3. **src/test/utils.tsx** - Testing utilities and helpers

### Test Files

1. **src/components/__tests__/Dashboard.test.tsx** - Dashboard component tests
   - 50+ test cases covering:
     - Rendering
     - Progress calculations
     - Metrics calculations
     - Navigation
     - Real-time updates
     - Edge cases

2. **src/components/__tests__/RiskAssessment.test.tsx** - Risk Assessment tests
   - 40+ test cases covering:
     - Asset/Threat/Vulnerability management
     - Risk identification
     - Auto-save functionality
     - Export functionality
     - Data validation

3. **src/components/__tests__/StatementOfApplicability.test.tsx** - SOA tests
   - 40+ test cases covering:
     - Control filtering
     - Applicability management
     - Risk treatment integration
     - Export functionality
     - Mandatory controls

### Documentation

1. **TESTING.md** - Comprehensive testing guide
2. **TEST_INSTALLATION.md** - This file

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (runs tests on file changes)
```bash
npm test:watch
```

### UI Mode (visual test interface)
```bash
npm test:ui
```

### Coverage Report
```bash
npm test:coverage
```

## Test Coverage Summary

| Component | Test Cases | Coverage Areas |
|-----------|------------|----------------|
| Dashboard | 50+ | Progress calc, metrics, navigation, real-time updates |
| Risk Assessment | 40+ | CRUD operations, auto-save, export, validation |
| Statement of Applicability | 40+ | Filtering, applicability, integration, mandatory controls |

**Total**: 130+ test cases

## Expected Test Results

When you run `npm test`, you should see output similar to:

```
✓ src/components/__tests__/Dashboard.test.tsx (50 tests)
✓ src/components/__tests__/RiskAssessment.test.tsx (40 tests)
✓ src/components/__tests__/StatementOfApplicability.test.tsx (40 tests)

Test Files  3 passed (3)
     Tests  130 passed (130)
  Start at  XX:XX:XX
  Duration  X.XXs
```

## Troubleshooting

### Issue: npm install fails with EACCES error

**Solution:**
```bash
sudo chown -R $(whoami) "/Users/$(whoami)/.npm"
npm cache clean --force
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8
```

### Issue: Tests fail to run

**Solution:**
1. Check that all dependencies are installed:
   ```bash
   npm list vitest @testing-library/react
   ```

2. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Issue: Module not found errors

**Solution:**
Ensure `vitest.config.ts` has correct path aliases:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src')
  }
}
```

### Issue: Tests timeout

**Solution:**
Increase timeout in specific test or globally in `vitest.config.ts`:
```typescript
test: {
  testTimeout: 10000
}
```

## Next Steps

### 1. Run All Tests
```bash
npm test
```

### 2. Check Coverage
```bash
npm test:coverage
```

Open `coverage/index.html` in your browser to see detailed coverage report.

### 3. Add More Tests

Create test files for remaining components:
- `ScopeDefinition.test.tsx`
- `InformationSecurityPolicy.test.tsx`
- `RiskTreatment.test.tsx`
- etc.

### 4. Set Up CI/CD

Add GitHub Actions workflow to run tests on every push (see TESTING.md).

### 5. Integrate with Pre-commit Hooks

```bash
npm install -D husky lint-staged
npx husky install
```

Add to `.husky/pre-commit`:
```bash
#!/bin/sh
npm test
npm run lint
```

## Testing Best Practices

1. **Write tests first** (TDD approach)
2. **Test behavior, not implementation**
3. **Use descriptive test names**
4. **Clean up after each test**
5. **Test edge cases and error conditions**
6. **Aim for >80% coverage**

## Resources

- See `TESTING.md` for comprehensive testing guide
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Support

If you encounter issues:
1. Check this guide
2. Read `TESTING.md`
3. Review test examples in `__tests__/` directories
4. Check Vitest/RTL documentation

## Summary

You now have:
- ✅ Complete test infrastructure
- ✅ 130+ test cases across 3 major components
- ✅ Test utilities and helpers
- ✅ Comprehensive documentation
- ✅ npm scripts for running tests

Run `npm test` to get started!
