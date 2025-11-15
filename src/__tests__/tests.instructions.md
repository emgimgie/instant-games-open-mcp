---
applyTo: "src/**/*.test.ts"
---

# Test Files - Specific Instructions

These instructions apply to all test files.

## Test Requirements

### 1. Test Structure
- Use Jest testing framework
- Follow AAA pattern: Arrange, Act, Assert
- Keep tests focused and independent
- Check: is test structure clear and organized?

### 2. Coverage
- Critical business logic should have tests
- API integration points should be tested
- Error cases should be covered
- Check: are important code paths tested?

### 3. Test Naming
- Use descriptive test names: "should do X when Y"
- Group related tests in describe blocks
- Check: are test names clear and meaningful?

### 4. Mock and Isolation
- Mock external dependencies (API calls, file system)
- Tests should not depend on external services
- Tests should not depend on each other
- Check: are tests properly isolated?

## What to Review in Test Code

1. **Test completeness**
   - Are happy paths tested?
   - Are error cases tested?
   - Are edge cases covered?

2. **Test quality**
   - Are assertions meaningful?
   - Are test data realistic?
   - Are tests maintainable?

3. **Performance**
   - Do tests run quickly?
   - Are timeouts appropriate?
   - Are there unnecessary waits?

## Anti-Patterns in Tests

❌ Tests that depend on external services
❌ Tests that depend on execution order
❌ Overly complex test setup
❌ Testing implementation details instead of behavior
❌ No assertions in test
❌ Commented out tests

Suggest improvements when you see these patterns.
