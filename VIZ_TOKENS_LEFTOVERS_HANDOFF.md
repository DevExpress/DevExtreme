# Handoff: fluent-next viz tokens leftovers (PR #35341)

Temporary file for the next agent. **Delete it in the last commit before the PR is marked ready for review.**

- PR: https://github.com/DevExpress/DevExtreme/pull/35341 (draft, label `26_2`, no description)
- Head: `Raushen:feature/viz-tokens-leftovers` (fork remote), base: `feature/26_2_new_fluent_theme_with_design_tokens`
- Card: DevExpress/devextreme-private#5165 "Fluent-next: Review rest literal color in viz components" (private; its content is restated below)
- Parent work, already merged into the base: PR #35275 "Fluent-next: viz tokens" (card #5086)

## What the branch does

The fluent-next chart themes (`packages/devextreme/js/__internal/viz/core/themes/fluent-next/index.ts`) paint from published CSS names: they write `var(--dx-viz-..., <literal>)` into the markup. The names, their design-system roles and what each paints are in `packages/devextreme-scss/tools/naming/viz-contract.json`; `packages/devextreme-scss/tests/viz-contract.test.ts` holds the contract, the SCSS (`scss/widgets/fluent-next/common/_colors.scss`, `viz/_colors.scss`, `viz/_sizes.scss`) and the theme fallbacks to each other. Palette: `packages/devextreme/js/__internal/viz/palette.ts`.

Commits (oldest first):

1. Viz: group the published names by where they are declared
2. Viz: paint the sparkline and the sankey link from published names
3. Viz: paint a falling candlestick with the published red
4. Viz: draw the bullet target with the published content colour
5. Viz: publish a static name for the tree map hairline
6. Viz: lift the bar gauge shelf off the surface
7. Viz: name every gauge indicator the theme draws
8. Viz: name the map area fill and the three states of a map line
9. Viz: name the fills an application can switch on
10. Viz: take the indicating set from the published state colours
11. Viz: give the chart crosshair its own published name
12. Viz: read the axis a step quieter than the rest of the text
13. Viz: take the chart title weight from the design system
14. Fluent-next: shoot the viz named colours etalons (18 etalons for `e2e/testcafe-devextreme/tests/common/vizNamedColors.ts`, taken from CI)
15. Viz: take the remaining font weights from the design system
16. Viz: name the chart title weight like the other weights (`--dx-viz-font-weight-title` -> `--dx-viz-title-font-weight`)
17. this handoff file
18. Drop the widget names the base already lists (P3 item B2)

Font weights now all come from names: `--dx-viz-font-weight` (caption-default, 400, root font), `--dx-viz-export-font-weight` (base-default, 400), `--dx-viz-legend-title-font-weight` (numeric step `font-weight-200`, marked `// dx-no-semantic-role: ...` because the roles gate `tests/roles.test.ts` requires a marker for a step read; no weight role carries 200), `--dx-viz-label-font-weight` (caption-strong, 600; sankey label and tree map group label went 500 -> 600 on purpose), `--dx-viz-title-font-weight` (title-default, 600).

Card measurement (walk the raw theme from `__internal/viz/themes` `getTheme`, not the public one, which hands out resolved colours): literal colours 125 -> 99 (light), 100 (dark); every remaining literal belongs to the card's section 5 ("not painted with the current defaults"), with the exceptions listed under P2 below.

Last local verification on head `ecc722b74c`: `packages/devextreme-scss` jest 279/279, `naming:check`, lint, typecheck green; QUnit `DevExpress.viz.core/themes.tests.js` 120/120; jest `js/__internal/(viz|core/utils/__tests__/css_variables)` 79/79.

## How to build and verify

- The QUnit server runs on port 20060 (`pnpm run dev` in `packages/devextreme`, started by the developer). URL: `http://localhost:20060/run/DevExpress.viz.core/themes.tests.js?notimers=true&nojquery=true&nocsp=true`.
- Rebuild what the checks read instead of `build:dev` (its first step `clean:artifacts` also deletes `artifacts/js/dx.all.debug.js`, which playground pages use):
  - CSS: `pnpm nx run devextreme-scss:build:themes` (repo root)
  - QUnit code, from `packages/devextreme`: `pnpm nx build:ts:internal devextreme && pnpm nx build:npm:esm:internal devextreme -c qunit && pnpm nx clean:dist-ts devextreme`
- SCSS gates: `pnpm test`, `pnpm run naming:check`, `pnpm run lint`, `pnpm run typecheck` in `packages/devextreme-scss` (they read the built CSS in `packages/devextreme/artifacts/css`, so rebuild CSS first).
- `viz/_public.scss` is generated: `pnpm run naming:publish` in `packages/devextreme-scss`.
- CI: every push cancels the running workflows of the PR (`cancel-in-progress: true`), so collect screenshots before pushing again.

## Remaining work

### A. CI (do first)

1. **Demos Visual Tests, fluent-next.** The `*-screenshots-fluent-next.blue.light` jobs (angular 1..10/10, vue 2/5, possibly jquery and react) fail because the branch changes chart visuals on purpose (axis/legend label colour, title weight 600, label weights, indicating set, bar gauge shelf, sparkline, candlestick, crosshair, map line/area, tree map tile border). Take the actual screenshots from the run on the latest head (artifacts of `.github/workflows/visual-tests-demos.yml`), overwrite the matching files in `apps/demos/testing/etalons/` (`<Demo> (fluent-next.blue.light).png`), check that the frameworks agree on each shared etalon, commit as one commit (e.g. `Fluent-next: re-shoot the viz demo etalons`), push once.
2. **`jquery(2/3)-screenshots-material.blue.light` fails.** The branch does not touch material. Find out whether the same job fails on the base branch (latest runs of PRs into `feature/26_2_new_fluent_theme_with_design_tokens`, e.g. #35338) before changing anything.
3. **TestCafe `common - fluent-next`** failed before commit 14 only because the 18 etalons were missing (no other diffs; it passes on the base). Confirm it is green now.
4. Check every other failing check on the latest head and report causes.

### B. P3 from the review (requested by the user)

1. Tests whose names claim completeness but hold a hand-written list. QUnit `fluent-next theme should name every gauge indicator the theme draws` (`themes.tests.js`) lists three indicators by hand and also asserts the map area fill, which belongs elsewhere; e2e `every gauge indicator the theme draws takes a published name` (`vizNamedColors.ts`). Either derive the set from `gauge.valueIndicators` of the raw theme (keys: `_default`, `rangebar`, `twocolorneedle`, `trianglemarker`, `textcloud`; `textcloud.text.font.color` stays `#ffffff` on purpose) or rename the test to the subset it covers. Also `should keep a win and a loss grey, from the published pair` asserts the sankey link; move that assertion.
2. Done in commit 18: `packages/testcafe-models/types.ts` is identical to the base again.
3. Name order: in `scss/widgets/fluent-next/common/_colors.scss` and in the `LIGHT`/`DARK` tables of `index.ts`, `crosshair` and `cyan-subtle` sit among the `content-*` names and `grid` comes after `red-subtle`. Restore alphabetical order (the generated `_public.scss` is already sorted).
4. Commit subjects longer than 60 characters: commits 2 (65), 4 (61), 8 (62), 10 (61). Shortening them rewrites history and needs a force push; ask the user first.
5. No code comments are allowed. The only comment-like lines left are the `// eslint-disable-next-line spellcheck/spell-checker` lint directives in `index.ts` and the `// dx-no-semantic-role:` marker the roles gate reads. The alternative to the marker is an entry in `typographyUnmarked` of `packages/devextreme-scss/tests/roles.baseline.json`; the user has not chosen.

### C. Comments on card #5165 (restated; the agent cannot read the private issue)

Status after this branch in brackets.

1. Fonts: size (11-20px, 88 literal values in the theme) is still literal. [Weights are done. Sizes: this PR or a card of their own - ask the user.]
2. Accent scope: card #5086 lists rangeSelector, map markers, bullet and the gauge range bar / text cloud as following the accent; only RangeSelector does, by the designers' decision. Align the #5086 text and untick its boxes. [Issue text, not code; the user does it.]
3. After that decision: reword the "Chart does not follow custom accent" note in card #5049 and the same disclaimer in the `customAccentColor` docs on the site. [The disclaimer was not found: in DevExpress/devextreme-documentation branch `feature/26_2_new_fluent_theme_with_design_tokens` the two `customAccentColor` pages are empty stubs; ask where it lives.]
4. Check in the Widget Gallery that switching the accent recolours the charts without a reload. [The library side is covered by `e2e/testcafe-devextreme/tests/common/accentColor.ts` (RangeSelector repaints without re-creation); the gallery itself is a manual check.]
5. Legend `customizeItems` hands the application the live items: `marker.fill` (chart, pie, funnel, barGauge, vectorMap) and a `markerTemplate`'s `model.marker.fill` / `states.*.fill` are still `var(--dx-viz-...)` / `color-mix(...)`. Resolving them in place would stop the live repaint; hand the application a copy, or put the name back after the callback when the application did not change it. [Open. `js/__internal/viz/components/legend.ts`, `that._data = options.customizeItems(data.slice()) || data;`]
6. Funnel `item.color` and Sankey node `.color` (undocumented fields) still hold names; their `getColor()` is resolved. [Open. `funnel/item.ts` (`that.color = options.color`), `sankey/node_item.ts` (`that.color = params.color`).]
7. `exportFromMarkup` with markup that has no `data-backgroundcolor` falls back to the theme's literal background, not to the value the page declares. [Open. `js/__internal/viz/core/export.ts`, `fallbackOf(... || getTheme().backgroundColor)`.]
8. `getTheme('fluent-next.*')` now returns a resolved copy (`js/__internal/viz/handed_out_theme.ts`), so an application that changed the returned object to restyle every widget (undocumented) no longer does. Decide whether to document it. [Decision for the user.]
9. A tooltip whose container is a reused mode scope positioned with `overflow: hidden/auto` is clipped by that scope - the reuse logic of `getSwatchContainer`, shared with overlays. [Open. `js/__internal/viz/core/tooltip.ts`.]
10. For the accent decision: a RangeSelector with a chart does not use `selectedRangeColor` at all; only the slider handles and markers follow the accent there. [Information, no code.]

### D. P2 from the review (open; confirm with the user before doing)

1. Crosshair label in a dark scope: the label background is the crosshair colour (`chart_components/crosshair.ts`, `fill: labelOptions.backgroundColor || options.line.stroke`) and its text is `#ffffff`; with `--dx-viz-crosshair` = `#e87e78` in dark the contrast is 2.73 (was 3.35; light `#b33133` gives 6.17). Shows only when `crosshair.label.visible` is on.
2. Tree map with `colorizer: { type: 'none' }`: tiles take `--dx-viz-cyan-subtle` (`#acd7e6` light) and the label (visible by default) is `#ffffff`: contrast 1.54 (was 3.74). The default colorizer is `discrete` (`tree_map.base.ts`, `setDefaultColorizer('discrete')`), so only opt-in. The e2e case hides the labels, so no screenshot shows it.
3. Literals the card counted as "not painted" that are painted: `rangeSelector.shutter.color = #ffffff` in the dark theme only (`range_selector.ts` uses the container background only when no colour is set; in a light scope inside a dark page the veil disappears), and `map['layer:marker:dot'].borderColor` / `backColor` = `#ffffff` on every marker layer.

## House rules of the user

- No code comments of any kind. Intent comes from names.
- Commit messages: one line, under 60 characters, no body, no co-author trailer, no "Generated with" footer.
- Never post to GitHub (comments, reviews, PR description) and push only when the user asks; draft replies in chat instead.
- A test that says "every/all/no" must derive its set; an absence assertion needs a positive one next to it; no tautological tests.
- Read two or three neighbouring files and copy their shape before writing.
- Verify before asserting; say plainly what was and was not checked.
