---
applyTo: "src/features/**/*"
---

# Feature Modules - Specific Instructions

These instructions apply to all feature modules in `src/features/`.

## Module Structure Requirements

Each feature module MUST follow this structure:

```
src/features/[featureName]/
├── index.ts      # Module definition and export
├── tools.ts      # ToolRegistration[] format
├── resources.ts  # ResourceRegistration[] format (optional)
├── handlers.ts   # Business logic
└── api.ts        # API calls using HttpClient
```

## Critical Rules

### 1. Dependency Rules
- ✅ CAN depend on: `../../core/*`, `../app/*`
- ❌ CANNOT depend on: other business modules (e.g., leaderboard cannot import from h5Game)
- Check: does this import violate module isolation?

### 2. Unified Format
- All tools MUST use `ToolRegistration[]` format
- Each tool MUST have `definition` + `handler` in same object
- Handler signature: `async (args: T, context: HandlerContext) => Promise<string>`
- Check: are tools using the unified format?

### 3. Context and Authentication
- Use `context.macToken` for authentication (don't access ApiConfig directly)
- Use `getEffectiveContext()` when handling private parameters
- Never access `args._*` (private parameters) in business logic
- Check: is context properly used?

### 4. App Info Retrieval
- Import `ensureAppInfo` from `../app/api.js`
- Always pass `context.projectPath` to get proper tenant isolation
- Cache app info in context when possible
- Check: is app info retrieved correctly?

## Code Review Checklist for Feature Modules

When reviewing changes in feature modules, check:

1. **Module Structure**
   - [ ] Files are in correct locations
   - [ ] index.ts properly exports module
   - [ ] No circular dependencies

2. **Tool Format**
   - [ ] Using ToolRegistration[] format
   - [ ] Definition and handler are paired
   - [ ] Input schema is complete
   - [ ] Description is in English

3. **Error Handling**
   - [ ] API errors are caught
   - [ ] User-friendly error messages
   - [ ] Context included in errors

4. **Dependencies**
   - [ ] Only imports from core/ or app/
   - [ ] No business module cross-dependencies
   - [ ] No direct API calls (use HttpClient)

5. **Documentation**
   - [ ] JSDoc on exported functions
   - [ ] Tool descriptions are clear
   - [ ] Usage examples if complex

## Common Patterns in Features

### Tool Handler Pattern
```typescript
handler: async (args: { param: string }, context) => {
  // 1. Validate input (if needed)
  if (!args.param) {
    throw new Error('param is required');
  }

  // 2. Get app info (if needed)
  const appInfo = await ensureAppInfo(context.projectPath);

  // 3. Call API
  const result = await someAPI(args, context);

  // 4. Return user-friendly message
  return formatSuccessMessage(result);
}
```

### API Call Pattern
```typescript
export async function someAPI(
  params: SomeParams,
  context: HandlerContext
): Promise<ApiResponse> {
  const client = new HttpClient();
  const appInfo = await ensureAppInfo(context.projectPath);

  return client.post('/api/endpoint', {
    body: {
      developer_id: appInfo.developer_id,
      app_id: appInfo.app_id,
      ...params
    }
  });
}
```

## Anti-Patterns to Flag

1. ❌ Importing from other feature modules
2. ❌ Direct `fetch()` calls (use HttpClient)
3. ❌ Accessing `args._private_param` in handlers
4. ❌ Hardcoded developer_id or app_id
5. ❌ Missing async/await in async functions
6. ❌ Tool definition separate from handler
7. ❌ Duplicate logic across modules

Flag these patterns and suggest the correct approach.
