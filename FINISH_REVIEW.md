# Playwright Migration — Final Review Checklist

## Goal
Every Playwright test must have a 1:1 correspondence with TestCafe:
- Same test name
- Same test count per file
- Same behavior tested

## Key Rules

### 1. forEach Tests Must Match TestCafe Structure
TestCafe allows duplicate test names inside forEach loops:
```typescript
// TestCafe: 5 iterations = 5 tests with SAME name "Usual appointments render"
[0, 735, 1440, -735, -1440].forEach((offset) => {
  test('Usual appointments render', async (t) => { ... });
});
```

Playwright does NOT allow duplicate test names. Solution: **keep forEach inside ONE test**:
```typescript
// CORRECT: 1 test with 5 iterations inside (matches TC count)
test('Usual appointments render', async ({ page }) => {
  for (const offset of [0, 735, 1440, -735, -1440]) {
    await clearTestPage(page);
    // ... test with this offset
  }
});
```

**WRONG** (creates extra tests):
```typescript
// WRONG: 5 separate tests with different names
test('Usual appointments render (offset: 0)', ...)
test('Usual appointments render (offset: 735)', ...)
```

### 2. Test Names Must Be Identical
- Copy test name from TestCafe exactly
- No ticket numbers added/removed unless TC has them
- No parameterization suffixes unless TC has them

### 3. No Extra Screenshots / No Missing Screenshots
- All etalons are from TestCafe CI
- Playwright must not generate new etalons
- Playwright must not delete any etalons

### 4. Verification Steps

For each component folder:
1. Run TestCafe test names from CI: check TEST_NAMES_COMPARISON.md
2. Run `npx playwright test --list --project=chromium playwright-tests/<component>/`
3. Compare counts and names
4. If PW has more tests — check for forEach expansion (collapse them)
5. If PW has fewer — check for missing tests (add them)

### 5. CI Must Pass
- `common (1/2)` and `common (2/2)` — must be SUCCESS
- `scheduler/viewOffset` — must be SUCCESS
- Other jobs — screenshot pixel differences expected (macOS vs Ubuntu rendering)

## Known Issues

### forEach Expansion (needs collapsing)
These components have expanded forEach that need to be collapsed:
- `scheduler/viewOffset/` — TC: ~28 tests, PW: ~537 (massive expansion)
- `scheduler/timezones/` — TC: ~36 tests, PW: ~105
- `scheduler/common/` — various files with expanded forEach
- `accessibility/*.matrix.spec.ts` — matrix expansion (OK — mirrors TC testAccessibility pattern)

### Screenshot Dimension Mismatches (CI vs Local) — SOLVED
- **Root cause:** TestCafe headless Chrome has 15px classic scrollbar, Playwright headless Chromium has 0px overlay scrollbar. This made content 15px wider in Playwright, breaking all etalon comparisons.
- **Solution:** `html { padding-right: 15px !important; box-sizing: border-box !important; }` in `container.html`. This simulates the scrollbar space, making body content = 1200 - 16 margin - 15 padding = 1169px — matching TestCafe layout.
- **Known workaround:** This is an intentional CSS hack to match TestCafe headless Chrome behavior. Playwright headless Chromium uses overlay scrollbar (0px) which cannot be changed via CSS. The padding-right approach reserves the same 15px space without affecting visual layout.
- ViewOffset additionally uses viewport 1185 (project chromium-1185) for tests with etalons that depend on full-page width.

### Accessibility Matrix Tests
TC uses `testAccessibility()` which generates N tests per option combination at runtime.
PW uses `testAccessibilityMatrix()` helper that does the same.
These are expected to have different counts but same coverage.
