# Playwright Migration - Implementation Plan

## Goal

Prove that Playwright can fully replace TestCafe for screenshot/e2e tests. Both must run in CI simultaneously until Playwright is proven stable.

## Rules

- **No new screenshots** — Playwright tests must use existing TestCafe etalons from `tests/*/etalons/`
- **No deleted screenshots** — every existing etalon must be referenced
- **No deleted tests** — every TestCafe test must have a Playwright equivalent
- **No changed test logic** — page objects may differ in syntax but must verify the same behavior
- **Threshold adjustments only** — if a test doesn't pass locally due to cross-platform rendering, increase `maxDiffPixelRatio` per-test (not globally)
- **CI must report failures clearly** — if a screenshot doesn't match, the diff must appear in artifacts

## Current State

- **565 Playwright spec files** vs **620 TestCafe test files**
- **7 skipped tests** (all in scheduler/timezones)
- CI workflow exists (`playwright_tests.yml`) but only runs **scheduler** tests (common, timezones, viewOffset)
- CI runs on `devextreme-shr2` self-hosted runners
- Playwright config: viewport 1185x800, `maxDiffPixelRatio: 0.07`, `threshold: 0.2`
- Etalons are read directly from TestCafe `tests/` directory via `snapshotDir: './tests'`

## Missing Work

### 1. Expand CI to all components
Currently CI only runs scheduler tests. Need to add matrix entries for:
- `dataGrid/common`, `dataGrid/sticky`
- `editors/*`
- `navigation/*`
- `common/*` (draggable, filterBuilder, gantt, pivotGrid, treeList, etc.)
- `cardView/*`
- `accessibility/*`

### 2. Fix failing tests per scope (iterative)
Work scope-by-scope. For each scope:
1. Run tests locally: `npx playwright test playwright-tests/<scope>/`
2. Fix failures — adjust page objects, waitFor conditions, thresholds
3. Commit when scope passes locally
4. Push, verify on CI
5. While CI runs, start next scope

**Scope order** (largest/most critical first):
1. `scheduler/` — already in CI, mostly working
2. `dataGrid/` — largest component
3. `common/` — many sub-components
4. `editors/`
5. `navigation/`
6. `cardView/`
7. `accessibility/`

### 3. Verify CI failure reporting
- Intentionally break one etalon and push
- Confirm CI fails with clear error
- Confirm diff artifacts are uploaded and viewable

### 4. Run all tests together
After each scope passes individually, run full suite:
```bash
npx playwright test playwright-tests/ --reporter=list
```
Verify no cross-scope interference.

### 5. Handle stuck tests
If a test cannot be fixed after 5 attempts:
- Mark with `test.skip()` and add comment: `// TODO: Playwright migration - <reason>`
- Log the test path and failure reason in this file under "Stuck Tests" section

## How to Run

### Locally
```bash
cd e2e/testcafe-devextreme

# Single scope
npx playwright test playwright-tests/scheduler/common/ --reporter=list

# All tests
npx playwright test playwright-tests/ --reporter=list

# With UI for debugging
npx playwright test playwright-tests/scheduler/common/ --ui
```

### CI
Push to `playwright-poc` branch — workflow triggers automatically.

### CI Monitoring (gh cli)

```bash
# Check PR checks status
gh pr checks <PR_NUMBER> --repo DevExpress/DevExtreme

# View failed job logs
gh run view <RUN_ID> --repo DevExpress/DevExtreme --log-failed

# Re-run only failed jobs
gh run rerun <RUN_ID> --repo DevExpress/DevExtreme --failed

# List workflow runs for the branch
gh run list --repo DevExpress/DevExtreme --branch playwright-poc --workflow "Playwright tests (POC)"

# Watch a run in real-time
gh run watch <RUN_ID> --repo DevExpress/DevExtreme
```

- CI runs on `devextreme-shr2` self-hosted runners
- Concurrency group with `cancel-in-progress: true` — new push cancels previous run
- Playwright workflow: `.github/workflows/playwright_tests.yml`
- Artifacts: screenshot diffs are uploaded on failure for inspection

## Reporting

After each scope is completed (or if stuck), send a status update to Telegram (chat_id: 253383754) with this format:

```
Playwright Migration Status

Scope: <current scope>
Status: <passing / fixing / stuck>

Tests:  <X> passing, <Y> failing, <Z> skipped
CI:     <last run status — passing/failing/not started>

Progress:
✅ scheduler/common — <N> tests passing
✅ scheduler/viewOffset — <N> tests passing
🔧 dataGrid/common — fixing (<N> failing)
⬜ editors — not started
...

Stuck tests: <count>
- <test file> — <reason>
```

Send this report:
- After completing each scope
- When all scopes are done
- If stuck on a scope for more than 30 minutes

## Ralph Loop Prompt

```
Working directory: /Users/alekseisemikozov/Projects/DevExtreme/.claude/worktrees/playwright-poc/e2e/testcafe-devextreme

Task: Fix failing Playwright tests scope by scope.

Rules:
- Do NOT add/delete/modify any screenshot etalon files
- Do NOT change test logic — only fix page objects, selectors, waitFor, thresholds
- Do NOT skip tests unless they fail after 5 fix attempts
- For each scope: run tests, fix failures, run again until all pass
- If a test fails 5+ times, mark test.skip() with "// TODO: Playwright migration - <reason>" and move on
- Commit after each scope is fixed with message: "Playwright - fix <scope> tests"

Current scope order:
1. scheduler/common (verify still passes)
2. scheduler/timezones (7 skipped — try to unskip)
3. scheduler/viewOffset
4. dataGrid/common
5. dataGrid/sticky
6. common/* (each subfolder)
7. editors/*
8. navigation/*
9. cardView/*
10. accessibility/*

For each scope:
1. Run: npx playwright test playwright-tests/<scope>/ --reporter=list
2. If failures: read test code + page object, read TestCafe equivalent, fix
3. Re-run. Repeat up to 5 times per failing test.
4. When scope passes: git add + commit
5. Move to next scope

After all scopes done:
- Run full suite: npx playwright test playwright-tests/ --reporter=list
- Report results
```

## Stuck Tests

(Will be filled as tests are discovered that cannot be fixed)

| Test file | Reason | Attempts |
|-----------|--------|----------|
| | | |
