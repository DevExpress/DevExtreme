# derive-registries.ts

`tools/naming/derive-registries.ts` writes `tools/naming/registries.json`, the single source of truth
for the fluent-next naming standard.

```
node tools/naming/derive-registries.ts          # writes registries.json   (pnpm run naming:registries)
node tools/naming/derive-registries.ts --check  # fails if the committed file is stale
```

## Where the data comes from

- **The token package** (`@devexpress/design-tokens-internal/tokens.flat.json`, the
  `components/core/theme/fluent` tokens). From it come the colour `parts` (the last word of every
  colour token: `bg`, `border`, `content`, `icon`…). The vocabulary is read from the package's flat
  index, not from generated output, so the script needs no build for this part and cannot drift
  from the package.
- **The theme folders** in `scss/widgets/fluent-next/`: each folder becomes a component, its name in
  kebab case (`dateBox` → `date-box`) unless `OVERRIDES.components` says otherwise.
- **`OVERRIDES`** at the top of the script — every judgment call, reviewed as code, with the reason
  next to each entry: folder ↔ component exceptions (`gridBase` → `grid`), `systemFolders` /
  `systemTier`, `declarationHome`, `chassis` (who renders the grid / menu chassis), `embeds`,
  `rootSelectors`, `migrated`, `sassOnly`, and the grammar vocabularies (`states`, `modifiers`,
  `sizeSlots`, `subElements`, `systemConcerns`, `themeIdentity`, `partExclude` / `partsAdd` /
  `partsRemove`).

`rootSelectors` defaults to `.dx-<component without dashes>` for every migrated and system-tier
component; an override replaces it, for example when a widget paints outside its own element (a
dialog rendered into `body`, a toolbar menu inside a popup). Add the reason beside the entry.

## The name grammar it describes

```
$<component>(-<sub-element>)*(-<modifier>)*-<slot>(-<state>)
```

Parsed right to left with longest match: the trailing state, then the slot (a colour `part` in
`_colors.scss`, a `sizeSlot` in `_sizes.scss`), then the middle words. Overlaps between vocabularies
that compete for different positions are fine (`text` is both a part and a modifier); two are fatal
and the script refuses them:

- a state that is also a part;
- a sub-element of a component that is also a state.

## Who reads which field

| Fields | Read by |
|---|---|
| `components`, `declarationHome`, `systemTier`, `rootSelectors`, `exemptFolders`, `migrated`, `sassOnly` | `tools/naming/tier.ts` → `publish.ts` (the generator) |
| `rootSelectors` | `tools/review/reachability.ts` |
| `systemFolders` | `tests/disabled-paint.test.ts` |
| the grammar vocabularies, `chassis`, `embeds`, `systemConcerns`, `themeIdentity` | `tests/fluent-next-naming.test.ts` |

## Failures

- **`registries.json is stale — run node tools/naming/derive-registries.ts`** — the committed file
  differs from what the script builds now: `OVERRIDES` changed, a theme folder was added or removed,
  or a token package bump changed the colour `parts`. Regenerate with `pnpm run naming:registries` (build the themes
  first, see below) and review the JSON diff.
- **`STATES and PARTS overlap, the grammar would be undecidable`** / **`sub-elements of X collide with
  a state name`** — an `OVERRIDES` edit (or a new part from the package) made a word ambiguous. Pick
  another word or remove it from `partsAdd` / add it to `partExclude`.
- **`rootSelectors for non-migrated components: …`** — a `rootSelectors` override for a component that
  is neither in `migrated` nor in `systemTier`.
- **`rootSelectors[x]: "…" does not occur in the built bundle`** / **`is not a single .dx-* class or
  :root`** — a typo in a root selector, or the themes were not rebuilt. Regenerating needs the built
  bundle at `packages/devextreme/artifacts/css/dx.fluent-next.blue.light.css`; `--check` skips this
  gate when the bundle is absent (it only compares bytes).
