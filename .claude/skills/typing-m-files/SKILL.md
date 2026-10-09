---
name: typing-m-files
description: Two separate jobs for `m_*.ts` files under `packages/devextreme/js/__internal`. Type: bring a file (or a line range of one) to 0 strict ESLint errors without changing behaviour. Rename: once a typed file is merged at 0, drop its `m_` prefix in a rename-only PR. Use when someone asks to type an `m_` file or part of it, fix the strict lint of an `m_` file, or rename a typed `m_` file.
---

# Typing `m_` files

An `m_*.ts` file under `js/__internal` was migrated from JS, and gets relaxed lint rules (mostly `warn`). Its **strict errors** and **warnings** are what it gets once the `m_` prefix is gone. The typing work brings a file to 0 strict errors while it still has the `m_` prefix. It also fixes the warnings whose fix provably behaves the same.

**Type or rename, never both.** The developer asks for one of the two:
- **Type** a file or a range: this file, from "Input" on.
- **Rename** a typed file: [rename.md](rename.md).

They are always two PRs from two branches, one after the other. PRs are squash-merged into `main`, so separate commits in one PR don't help: the squashed commit holds the rename and the rewrite together, and git then shows a delete plus an add. The rename branch is made from `main` after the typing PR has been merged; for a file typed in parts, after every part's PR. If you're asked for both at once, do the typing and say the rename comes after the merge.

**Area rules:** for a file under `js/__internal/grids/`, also follow [grids.md](grids.md).

## Input

The developer gives the files one per line, in the format of the typing checklists. There is a line range when only a part of a file is the task:

```
`packages/devextreme/js/__internal/grids/grid_core/selection/m_selection.ts`, lines 1–542
`packages/devextreme/js/__internal/grids/tree_list/m_focus.ts`
```

- Without `lines`, the task is the whole file.
- A line may also name the part and its first and last member: `` `…/m_columns_view.ts`, lines 553–825 (part 2 of 4: `ColumnsView.renderDelayedTemplates` … `ColumnsView._renderCells`) ``. Check that the range starts at the first member and ends with the last one. If it doesn't, the lines have moved since the range was picked. Find the members, and tell the developer the new range before starting.
- Without member names, if a range starts or ends inside a class member or a statement, tell the developer before starting.
- Use the same format whenever you name a file or a range in your report.

## Count strict errors and warnings

```bash
# from the repo root; paths may be repo-relative, packages/devextreme-relative or absolute
node .claude/skills/typing-m-files/scripts/strict-lint.mjs \
  '`packages/devextreme/js/__internal/grids/grid_core/selection/m_selection.ts`, lines 1–542' \
  '`packages/devextreme/js/__internal/grids/tree_list/m_focus.ts`' \
  [--summary] [--errors] [--json] [--check]
```

The script takes the input lines as they are, including a trailing `(part …)` and a leading `- [ ] `. Put them in single quotes, or the shell runs the backticks. Several lines can go in one argument. The short form `path/m_x.ts:1-542` works too.

For each file the script prints its strict errors and its warnings (inside the range, if given), a count per rule for each, and each message. `--errors` leaves the warning messages out of the list. It also shows how many errors inline disables hide; that number is for information only. `--check` exits with 1 while any errors are left; warnings don't fail it. It takes the strict rules from `packages/devextreme/eslint.config.mjs` each time it runs, so its numbers stay correct when the config changes.

Not counted at all: `max-classes-per-file`, `simple-import-sort/imports` and `spellcheck/spell-checker` (kept on purpose).

## Workflow

1. **List the work.** Run the script on the file or range. Its errors and warnings are what the task fixes. For a file that many others import (a hub such as `grid_core/m_types.ts`), also list the open PRs that touch it, and leave to them what they already change:
   ```bash
   gh pr list --repo DevExpress/DevExtreme --state open --limit 200 --json number,title,files \
     --jq '.[] | select(any(.files[]; .path | endswith("grid_core/m_types.ts"))) | "#\(.number) \(.title)"'
   ```
2. **Type, in this order.**
   1. Class fields. Only in a whole file, or in the part that holds the class fields (usually the first): every later method depends on them.
   2. Signatures: param types and return types.
   3. The remaining rules inside bodies.
   4. Warnings, one at a time, only where the fix provably behaves the same (see Warnings below).

   [fixes.md](fixes.md) has the team's fix for each rule, most frequent first, and a section on warnings.
3. **Review your own diff against [traps.md](traps.md).** Every body edit must keep behaviour exactly the same.
4. **Checks** (below).
5. **Report:**
   - strict errors and warnings, before and after, for each file or range in the input format;
   - every body edit, one line each, with why it behaves the same;
   - what was added to the module's `types.ts`;
   - the warnings left, grouped by rule, with the reason each was left.
6. **Review loop.** The developer then usually goes through the remaining directives and casts one by one. A question like "can we remove them?" is about what the last step added. Don't reopen items that were already settled; if a technique you found would also fit one of them, say so in one line.

## Rules

**Scope**
- The task's files are the given files plus the module's own `types.ts`, where new types go (create it if the module has none). With a range, touch only those lines of the given file, plus its import block.
- Anything else needs the developer's OK before you touch it: the test file for an agreed refactor, another module's `types.ts`, or callers in other files.
- If a new type (usually a return type) breaks callers in other files, stop and ask the developer. The options are a compile-only fix at those callers, a wider type, or agreeing it with whoever is typing those files.
  - Measure before asking. Put the honest type in on a backup copy, run `tsc`, and group the errors by cause. For example, `element(): dxElementWrapper | undefined` broke 90 places in 26 files: about 78 were the `| undefined`, about 10 were gaps in `renderer.d.ts` (see fixes.md). Bring that table to the developer, then restore the file from the backup (`cmp` it).
  - Until the developer decides, keep the wider type with a directive that gives the reason.
  - When agreed, a behaviour-neutral change that reaches many files (one accessor typed across 26 files) goes in its own commit, separate from the file's typing.
- Don't change public API: no edits to `js/**/*.d.ts`.

**Typing only**
- Annotate params, locals, returns and fields.
- Change a body only where a new type makes it fail to compile (a guard, a `?? fallback`, a narrowing), or where a strict rule needs it (`fixes.md`). Either way, the edit must provably behave the same for every value the code can get. A value from a source that isn't typed yet gets a directive, not a cast (see Disables).
- Don't refactor. That means no extracting functions, rewriting loops, renaming members or functions, removing dead code or dropping unused params, unless the developer agrees for that one function. Renaming a local variable to fix `no-shadow` is fine.
- An agreed refactor gets tests first: written and passing on the old code, then the change, then a mutation check that the tests catch a broken version. The test file is outside the task: name it when you ask for the agreement.
- A bug found while typing is not fixed in the typing PR. Tell the developer, with file, line and why it's a bug.

**Warnings**
- The target is 0 errors. Warnings are best effort.
- Fix a warning when the fix provably behaves the same, for every value the code can get. "Provably" means you can show it from the types or the code: a trustworthy type (not `any`), or the surrounding code. A test run is not proof.
- Otherwise leave the warning as it is, and don't add a disable for it.
- `fixes.md` ("Warnings") says when each warning rule's fix behaves the same.

**Where types go**
- Reuse before creating: public types from the `js/**/*.d.ts` files (`@js/common`, `@js/core/utils/callbacks`, the component's own `@js/ui/<component>`, …), then the module's own `types.ts`.
- A new type goes into the module's own `types.ts`. Other modules import it from there.

**Disables**
- Existing inline `eslint-disable` comments and `@ts-expect-error` may stay.
- **A value from a source that isn't typed yet gets a directive, not a cast.** A cast stays silent once the source gets typed. A directive is then reported as unused, so someone sees it and removes it.
  - The value is `any`, which is what `no-unsafe-return` reports: use `// eslint-disable-next-line @typescript-eslint/no-unsafe-return -- <what isn't typed yet>`. Don't use `@ts-expect-error` here: TypeScript sees no error on an `any` value, so tsc fails at once with TS2578 (unused directive).
  - TypeScript rejects the value, because it is `unknown` or has a wider or wrong type: use `// @ts-expect-error <what isn't typed yet>`. Keep that line short, because the directive hides every error on it.
- Remove a directive once it is reported as unused: TS2578 from tsc, or "Unused eslint-disable directive" from ESLint. ESLint shows that as a warning, and `strict-lint.mjs` shows it as a note.
- Any other new disable is a last resort: line-level, with a reason (`-- <why>`). Never a file-level disable.
- An existing file-level disable of a warning rule (for example `/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */`) is removed when the developer asks. Then resolve each report as fixes.md ("Warnings") says, and give a line disable with a reason where the fix isn't provably the same. `max-classes-per-file` stays.
- A directive hides every error on its line, so its reason must cover all of them. Directives with the same cause get the same reason text, so `grep -rn "<reason>"` finds them all later.

**Style**
- Braces around every `if` body, including one-line guards.
- No `_` prefix on new members.
- No new comments, except a short one that says *why*.

**Never**
- Run `pnpm run dev`. The developer runs it and tells you when the build is ready.
- Edit the generated wrappers (`packages/devextreme-{angular,react,vue}/src`), `localization/default_messages.ts` or `cldr-data`.
- Commit or push without being asked.

## Checks before a PR

Run from `packages/devextreme`:

```bash
node ../../.claude/skills/typing-m-files/scripts/strict-lint.mjs --check '<input lines>'     # 0 errors; the warnings left go in the report
node_modules/.bin/eslint <files>                                                             # no errors
node_modules/.bin/tsc --noEmit -p js/__internal/tsconfig.json; echo "exit $?"                # exit 0
```

- Call the binaries in `node_modules/.bin` directly, not through `pnpm exec`. When `node_modules` lags the lockfile (after a dependency bump on `main`), `pnpm exec` and `pnpm run` first run a full install, the `nx-infra-plugin` postinstall and `nx reset`. `nx reset` stops the Nx daemon and can take down the developer's watch build. If a step needs `pnpm run` (for example `update-ts-reexports` in [rename.md](rename.md)), tell the developer before running it.

- `tsc`: use `js/__internal/tsconfig.json`. The root `tsconfig.json` compiles only `.d.ts` files, so it passes no matter what. In a fresh worktree, run `pnpm nx build:localization:generate devextreme` first, or you get phantom TS2307 errors for `cldr-data`.
- With a range, only the range must be at 0. The rest of the file keeps its errors until its own part.
- Tests: only those that cover the changed code. Pick them by tracing what uses it, not by folder. Whole-tree runs happen on CI.
  - Jest (Jest 30, the flag is plural):
    ```bash
    node_modules/.bin/jest --no-coverage --runInBand --selectProjects jsdom-tests --testPathPatterns "<pattern>"
    ```
  - QUnit (`testing/tests/<suite>/…`) runs on the developer's dev server. Ask them to start it and tell you when the build is ready. Then open `http://localhost:20060/run/<path under testing/tests>?notimers=true&nojquery=true&nocsp=true`.
  - Before trusting a QUnit result, check the built file of *every* file you changed, under `packages/devextreme/artifacts/transpiled-esm-npm/esm/` (what the runner serves). The watch build sometimes skips a file without saying so, and sometimes stops rebuilding altogether: then every file in that tree has the same old timestamp. The built file must be newer than the source and must contain your body edits. Grep for them as Babel writes them: a rest param `...args` comes back as `arguments`, while `??` stays. Type-only edits leave no trace in the built JS. If a built file is stale, ask the developer to rebuild (`rm -rf .nx/cache`, then restart the dev build).
  - If the Playwright browser is held by another session, the chrome-devtools tools work too: open the page in an `isolatedContext`, and read `#qunit-testresult` once the run is done instead of polling it.
  - In a browser that draws 15px scrollbars, a few pixel tests fail with `Expected: 0, Result: 15`, for example two "Scroller shown …" tests in `DevExpress.ui.widgets.dataGrid/gridView.tests.js`. They fail before your change too; don't chase them.
  - In headless Chrome, `DevExpress.ui.widgets.dataGrid/adaptiveColumns.tests.js` › "Columns should hide consistently if percentage width (T640539)" fails too (expected 2 adaptive buttons, got 4), on unmodified code. Don't chase it either.
- Check a type question with a probe, not by reading the diff. Write a small file with one line that must compile and one that must fail. Run it with `node_modules/.bin/tsc` from `packages/devextreme` (TypeScript 5.9.3), through a tsconfig that extends `js/__internal/tsconfig.json` with `"files": ["<probe>"]` and `"include": []`. That config also prints unrelated JSX and lib errors, so keep only the probe file's lines. Delete the probe afterwards.
