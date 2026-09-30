# Rename-only PR

Once a file has 0 strict errors, it loses its `m_` prefix in a PR of its own. That PR renames and updates imports, and does nothing else. For grids files, also follow "Renames in grids" in [grids.md](grids.md).

## When

- The typing PR is merged into `main`. For a file typed in parts, every part's PR is merged.
- The rename is its own branch, made from the latest `main`. Don't build it on the typing branch: after a squash merge, the typing branch's commits are not in `main`, so a branch built on it shows the typing changes again and conflicts. If the current branch isn't a fresh one from the latest `main`, or it holds other changes, stop and ask the developer. Don't create or switch branches yourself.
- `strict-lint.mjs --check '<file>'` (no range) reports 0 on that branch, before the rename.
- A file imported from many places (more than about 20 outside its module) is renamed only at a moment the team has agreed and announced, so everyone merges or rebases first. Ask the developer before renaming one.

## Steps

1. **Only the `m_` prefix goes.** The file stays in the same folder, and the rest of its name stays the same: `grid_core/views/m_rows_view.ts` becomes `grid_core/views/rows_view.ts`, and `m_x.test.ts` becomes `x.test.ts`. Don't move the file or change anything else in its name.
   - **Check that the new name is free.** If `<dir>/x.ts` already exists, stop and ask the developer. Today that is `core/utils/m_date.ts` and `core/utils/m_math.ts`: `date.ts` and `math.ts` exist next to them.
   - **Check for a folder with the new name.** If `<dir>/x/` exists, an import of `'./x'` resolves to the new file, not to the folder's `index.ts`. Check that nothing imports the folder as `'./x'` or `'../x'`, and tell the developer. Today that is `grid_core/m_utils.ts` next to `grid_core/utils/`; `m_utils.ts` imports that folder as `'./utils/index'`, which keeps working.
2. `git mv <dir>/m_x.ts <dir>/x.ts`. Don't change the file's content, so git keeps tracking it as a rename. A rename plus a rewrite shows up as a delete plus an add, and every other open PR that touches the file then conflicts.
3. Update every importer: in each import path only the last part changes, `…/m_x` to `…/x`. Search for the path without its extension, in every form it is imported by:
   ```bash
   cd packages/devextreme
   git grep -n -E "['\"/]m_x['\"]" -- js testing
   ```
   Keep only the hits that resolve to this file; other modules have files with the same name. The forms in use are:
   - relative: `'./m_x'`, `'../m_x'`;
   - the `@ts/` alias: `'@ts/<area>/…/m_x'`;
   - QUnit tests: `'__internal/<area>/…/m_x'`;
   - public entries: `js/ui/*.js` import `'../__internal/<area>/…/m_widget'`;
   - `jest.mock('…/m_x', …)`;
   - inline type imports: `import('./…/m_x')`.
4. A matching `m_x.test.ts` is a separate `m_` file with its own strict count. Rename it only when it is at 0 too.

## Checks

```bash
cd packages/devextreme
git diff -M --stat <latest main>...HEAD   # e.g. upstream/main; the file must show as a rename (=>), not as a delete plus an add
pnpm exec eslint <renamed file> <changed importers>   # the file now gets the strict rules: 0 errors
pnpm exec tsc --noEmit -p js/__internal/tsconfig.json; echo "exit $?"
```

- If `js/ui/**` re-exports the file (for example a `m_widget.ts`), also run `pnpm run update-ts-reexports` and check that nothing changed. CI fails on stale generated re-exports.
- Tests: the Jest files that import the renamed file (the `git grep` above finds them). A broken import fails the whole suite file at load time.

## On a conflict

Don't resolve a rename conflict by hand. Make the branch again from the latest `main`, and run the `git mv` and the import updates again.
