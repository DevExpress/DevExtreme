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

1. **List the work.** Run the script on the file or range. Its errors and warnings are what the task fixes.
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

## Rules

**Scope**
- The task's files are the given files plus the module's own `types.ts`, where new types go (create it if the module has none). With a range, touch only those lines of the given file, plus its import block.
- Anything else needs the developer's OK before you touch it: the test file for an agreed refactor, another module's `types.ts`, or callers in other files.
- If a new type (usually a return type) breaks callers in other files, stop and ask the developer. The options are a compile-only fix at those callers, a wider type, or agreeing it with whoever is typing those files.
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
pnpm exec eslint <files>                                                                   # no errors
pnpm exec tsc --noEmit -p js/__internal/tsconfig.json; echo "exit $?"                      # exit 0
```

- `tsc`: use `js/__internal/tsconfig.json`. The root `tsconfig.json` compiles only `.d.ts` files, so it passes no matter what. In a fresh worktree, run `pnpm nx build:localization:generate devextreme` first, or you get phantom TS2307 errors for `cldr-data`.
- With a range, only the range must be at 0. The rest of the file keeps its errors until its own part.
- Tests: only those that cover the changed code. Pick them by tracing what uses it, not by folder. Whole-tree runs happen on CI.
  - Jest (Jest 30, the flag is plural):
    ```bash
    pnpm exec jest --no-coverage --runInBand --selectProjects jsdom-tests --testPathPatterns "<pattern>"
    ```
  - QUnit (`testing/tests/<suite>/…`) runs on the developer's dev server. Ask them to start it and tell you when the build is ready. Then open `http://localhost:20060/run/<path under testing/tests>?notimers=true&nojquery=true&nocsp=true`.
  - Before trusting a QUnit result, check the built file of *every* file you changed, under `packages/devextreme/artifacts/transpiled/`. The watch build sometimes skips one without saying so. The built file must be newer than the source and must contain your body edits. Type-only edits leave no trace in the built JS. If a built file is stale, ask the developer to rebuild (`rm -rf .nx/cache`, then restart the dev build).
