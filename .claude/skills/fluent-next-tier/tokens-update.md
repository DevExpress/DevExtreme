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
6. If adapting the theme to the new package renamed or removed a published `--dx-*` name, record it
   in the journal — see below.

## The public-name journal (`tools/naming/public-renames.json`)

### Why it exists

Every `--dx-*` custom property a theme publishes is API: an application sets it in its own CSS,
without rebuilding our SCSS, to retune a widget. If the name disappears, that override silently
stops working — no error anywhere, the widget just reverts to the theme value. So removing or
renaming a published name is a breaking change for users, and it has to reach the release notes.
The journal is that record: one entry per retired name, and the `note` field is the sentence that
goes into the release notes.

### How a bump leads here

A new token package can drop a role or a scale step, or change what a role means. Adapting the
theme can then rename a SCSS variable or remove it. In fluent-next the public name is derived from
the variable (`$button-icon-size` → `--dx-button-icon-size`), so `pnpm run naming:publish`
retires the old public name without anyone typing it — the diff looks like plain regeneration. The
same applies to any other change that renames or drops a published name; a bump is just the most
common reason.

### Which names belong in it

Only names that **shipped in a released version**. The journal tells users about something they
could have used.

- `generic`, `material`, `fluent`: their `--dx-*` names shipped long ago — every removal is
  journaled.
- `fluent-next` ships for the first time in 26.2. Until that release is out, its names that appear
  and disappear inside the feature branch never reached anyone and do **not** go into the journal
  (git history keeps them). After 26.2 every fluent-next removal is journaled.
- To check whether a name shipped: `git grep -F -e '<name>' upstream/main -- packages/devextreme-scss`
  (or the latest release tag). Not found there → it never shipped → no entry.
- Not a retirement: the same name with a new value (that is an etalon and release-notes matter,
  not a rename), and the names in `runtime-contract.json`, `runtime-reads.json`,
  `viz-contract.json` and `accent-contract.json` — those have their own contract files and tests,
  which fail on a rename and must be updated with it.

### Writing the entry

Add it in the same change that retires the name:

```json
{
  "name": "--dx-file-manager-view-mode-button-content-padding",
  "replacement": "--dx-file-manager-button-content-padding",
  "release": "26.2",
  "note": "Setting it had no effect; set --dx-file-manager-button-content-padding to pad the file actions button."
}
```

- `name` — the retired name exactly as it shipped.
- `replacement` — the name that takes over the role, or `null` when the role is gone.
- `release` — the release the removal ships in: the major.minor of `version` in
  `packages/devextreme-scss/package.json` (`26.2.0` → `"26.2"`).
- `note` — one sentence for the release notes, from the user's side: what they set, what happens
  now, what to set instead. Not why we changed it internally.

Then rebuild the themes and run `pnpm run naming:baseline`: it rewrites the snapshot baselines,
including `tests/public-surface.baseline.json`. Review that diff — the name must vanish only from
the themes you meant.

### What the tests hold

- `tests/public-surface.test.ts` — a name that leaves any theme's published surface fails unless it
  is in the journal ("no name leaves the published surface without a journal entry").
- `tests/public-renames.test.ts` — every entry is complete and listed once, a retired name never
  ships in a fluent-next bundle again, and every `replacement` does ship in the fluent-next bundles.
  The last check reads only fluent-next: for a legacy-theme rename whose replacement does not exist
  in fluent-next it fails — stop and ask the user rather than bending the test.

Never bring a retired name back as a compatibility alias in `_public-links.scss` to make a test or
an application happy: the tests forbid it, and keeping an old name alive is a product decision for
a human, not a fix.
