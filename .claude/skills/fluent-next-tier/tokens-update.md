# tokens:update

`tools/tokens/update.ts` is one command for a design-token package bump
(`@devexpress/design-tokens-internal`) and the report that goes with it.

```
pnpm run tokens:update 262.24.0   # bump, reinstall, rebuild the token layer, check, report
pnpm run tokens:update            # report the installed package, change nothing
pnpm run tokens:update --report   # the same, stated explicitly
```

## What it does

- Edits the dependency and its `minimumReleaseAgeExclude` entry (pnpm refuses a release younger than
  `minimumReleaseAge`, so the bump carries its own exclusion), reinstalls and rebuilds the token layer
  (`build/tokens/build-tokens.ts` → `scss/_design-system/`).
- Runs `derive-registries.ts --check` read-only and prints the report. The diffing and the markdown
  live in `tools/tokens/report.ts`, covered by `tests/tokens-report.test.ts`.

The report answers the expensive question — what the new package did:
- names the theme reads that the package no longer has (the build refuses those);
- every generated value that moved, per file, old and new side by side. This is the list that costs
  etalon screenshots.

A failed bump puts back what it touched — `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml` and
the generated token layer — so the tree is where it was, short of `node_modules`.

## What it does not do

- It does not rebuild the themes: the CSS bundles in `packages/devextreme/artifacts/css` still come
  from the old package until `pnpm nx build:themes devextreme-scss` runs. That is also why the
  registries are only checked here — their `rootSelectors` gate reads those bundles.
- Approving the Renovate pull request and re-recording etalons stay manual on purpose: the etalons
  are pixels, and a value change has to be looked at.

## After a bump

1. `pnpm nx build:themes devextreme-scss`.
2. If the report said the registries are stale: `pnpm run naming:registries` and review
   `registries.json` (new parts from the package can change the grammar — see
   [derive-registries.md](derive-registries.md)).
3. `pnpm run naming:check`, then the jest suite.
4. Ask user to re-record the etalons the moved values touch.
5. Read the `pnpm-lock.yaml` diff before committing: the install runs with `--no-frozen-lockfile`
   (the only way to move a pinned dependency) and pnpm normalises the rest of the lockfile on the
   way; anything beyond this package is housekeeping, not the bump.
