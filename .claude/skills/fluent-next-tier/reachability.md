# reachability.ts

`tools/review/reachability.ts` checks, on the **built** fluent-next bundle, that every `--dx-*` name
reaches the elements that read it. A custom property exists only on the element that declares it
and its descendants; a `var()` that finds nothing makes the browser drop the whole declaration, with
no compile error, no lint error and nothing in the console.

```
node tools/review/reachability.ts                   # the gate (last step of pnpm run naming:check)
node tools/review/reachability.ts --report          # also list every read outside the root text
node tools/review/reachability.ts --update-scopes   # rewrite nested-scopes.json from what it sees now
node tools/review/reachability.ts --update-unread   # rewrite the names list in unread-tier.json
```

It reads `packages/devextreme/artifacts/css/dx.fluent-next.blue.light.css`; without that file it
prints a note and exits 0, so rebuild the themes (`pnpm nx build:themes devextreme-scss`) before
trusting a local green. Inputs besides the bundle: `registries.rootSelectors`, its two lists
`tools/review/nested-scopes.json` and `tools/review/unread-tier.json`, and the runtime contracts
`tools/naming/runtime-reads.json` (lengths JS reads back with `getComputedStyle`) and
`tools/naming/viz-contract.json` (names the charts write into SVG).

## The five checks — each one fails the run

1. **`read and never declared`** — a `var(--dx-foo)` with no `--dx-foo` declared anywhere: a typo or
   a removed name. Fix the name or publish it on the scope that reads it. Names set at runtime by
   another layer (CardView card sizes, the scheduler animation, the accent colour) are listed in
   `SET_ELSEWHERE` in the script; add one there only when another layer really sets it.
2. **`cross-scope duplicate`** — the same selector and property are declared more than once and the
   copies read variables of different components. The last copy wins everywhere, and inside the other
   widget its variable is empty, so the property vanishes. In the legacy themes such duplicates were
   harmless (equal literals); the tier splits them across roots. Real case: base/dataGrid and
   base/treeList drew the same unscoped `.dx-command-ai-header-button .dx-button.dx-state-focused` and
   the AI column button lost its focus ring in DataGrid. Fix: read a shared-layer name
   (`gridBase`/`menuBase`, e.g. `$grid-outline-focused`), not one widget's.
3. **`scope outside the roots of X`** — a rule reads `--dx-X-…` but its selector text contains no root
   of X. Usually harmless (the element is nested in the widget and the selector is just short), but
   if JS mounts that element outside the widget — a portal: popup, drag preview, sortable clone,
   dialog in `body` — the variable is missing there. The text cannot tell the two apart, so this is a
   prompt to check: open the widget in that state and confirm in the DOM that the element sits inside
   the root. Then either add the scope to `nested-scopes.json["X"]`, or, if it is a portal, add its
   class to `OVERRIDES.rootSelectors` in `derive-registries.ts` (the tier is then declared on it too)
   or read a Sass twin / `:root` value in that branch. `--update-scopes` writes every current scope in
   one go — use it only after the checks, never as a way to turn CI green.
4. **`portal: .<scope> is another widget's overlay`** — a scope named after another widget's overlay
   (`-popup`, `-popup-wrapper`, `-overlay`, `-overlay-wrapper`, `-overlay-content`, `-popover`,
   `-popover-wrapper`, `-tooltip`, `-tooltip-wrapper`) is a portal by construction and cannot be
   nested. Fires whether or not the scope is listed, and `--update-scopes` refuses to list it. This
   is how the diagram toolbar's overflow menu was found: its scope had been listed by a bulk update and
   the icons had lost their margins.
5. **`declared and never read`** / **`pinned name(s) are read now`** — liveness: a name is live when an
   ordinary declaration reads it, a `@container style(--dx-…)` query names it, it is in the runtime or
   viz contract, or a live name reads it (computed to a fixpoint). The dead set is pinned in
   `unread-tier.json` by exact equality. A **new** dead name is public API that moves nothing — usually
   a rule switched from `var(--dx-x)` to `$x` or a literal, or the generator published a Sass helper.
   Read it where it belongs (or stop publishing it before release); after release, a published knob
   must keep working. A name that **revived** just needs `--update-unread`. The list counts only reads
   inside the bundle: about half of it is read by demos and application CSS by design.

## Known gap

A name that is read by a declaration that never wins the cascade (overwritten in the same rule, or
beaten by a more specific selector) passes. Deciding that needs the cascade, not the text.
