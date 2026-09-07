# Divergences

Places where fluent-next cannot express a value through the design-token tier and has to freeze
something instead. Each one is marked in the source so it can be found, and each entry here says
what would have to change for the marker to go away.

Comments in `_colors.scss` files point here with `See DIVERGENCES.md`.

## The `dx-data-uri-static` marker

An icon that is inlined as an SVG `data-uri` gets its colour by a build-time string replace of
`currentColor`. A CSS `var()` does not resolve inside a data-uri - it renders black - so the
colour has to be written as a literal, and the literal is a hand-copy of a `ds.$` token that
nothing keeps in sync.

The marker records which token the literal stands for:

```scss
$file-manager-icon: #161616 !default; // dx-data-uri-static: ds.$color-content
```

`tests/fluent-next-naming.test.ts` reads it: a variable that feeds a data-uri is exempt from the
rule that every colour variable is published into the component tier, because publishing a knob
that turns nothing would be worse than not publishing it.

**A single-colour icon does not need this.** The same artwork used as a `mask-image` carries only
its alpha, so `background-color: currentColor` paints it from the cascade and the colour stays a
token. That is how gantt, list and two of the file manager icons were retired - see
`base/gantt/_mixins.scss` and `base/list/_mixins.scss` for the `$masked` flag, which keeps the
legacy themes on the baked path so their emitted css does not move.

## Current inventory - 16 markers, 3 components

### fileManager - 6, structural

`done.svg` and `danger.svg` each put an inverted glyph on a success or danger disc beside the
neutral arrows. Three fills in one image; a single-colour mask cannot express that, so the six
literals stay. Tellingly the disabled state never needed a second copy of these two - they report
an outcome and do not grey out.

### timeView - 6, structural

Two of the three images are genuinely two-tone:

- `min-arrow.svg` - the tip is a donut, `fill="$background-color"` inside `stroke="$accent-color"`.
  Under an alpha mask both are opaque, the canvas-coloured hole fills in and the tip becomes a
  solid dot.
- `clock-bg.svg` - the dial and the numerals are deliberately opposed, so one colour would erase
  the digits.

`hour-arrow.svg` alone is single-colour, but converting it frees no literal: `$accent-color` is
still required by `min-arrow`.

### diagram - 4, deliberate

34 of the 36 diagram icons are single-colour and a working mask migration exists, but it was
measured and declined: diagram has no per-state duplication yet, so it saves nothing today, and
the wide connectors are one-pixel hairlines whose anti-aliasing shifts enough under a mask to fail
the screenshot comparer at its real defaults. Two icons could never follow anyway -
`connector-begin-none.svg` and `connector-end-none.svg` declare `.st0{fill:#FF0000}` in a `<style>`
block, which beats the `fill="currentColor"` attribute on the same path, so their diagonal slash
is genuinely red.

Revisit when diagram grows a second state: from that point a mask saves the whole set per state.

## Rasters

A colour frozen inside a `.png` is the same divergence in a harder form - no token reaches it at
all, and the file cannot follow a theme.

- **`grid/text-stub.png`** - the virtual-row placeholder. Retired: the artwork carried no
  anti-aliasing, so it was lifted to a plain mask and is now painted from the `skeleton` role,
  `color.bg-inverted` at 10% opacity. That role lives under `components/` in the token package,
  which `build-tokens.mjs` does not consume, so it is composed in `gridBase/_colors.scss` from the
  two semantic tokens that do reach `ds.$`. Worth knowing why it mattered: one file served both
  modes and it was black, so on a dark grid the placeholder sat 1.26 dE2000 from the row
  background - under the 2.3 just-noticeable threshold.
- **`pulldown.png`** - deleted. Its only rule targeted `.dx-scrollview-pulldown`, a class no
  scroll-view strategy puts in the DOM: the simulated and iOS ones build
  `dx-scrollview-pull-down-image`, which fluent-next hides, and the Android one builds a
  `dx-icon-pulldown` font glyph. Nothing painted it.

Nothing in the design system names a pull-to-refresh arrow, for the record: `scroll-view` exists
only in the wpf token set and covers the frame, not the glyph.

## Non-icon divergences

### gantt task bars

`$gantt-task-bg` is `ds.$color-bg-primary-shared` - primary-90 in light, primary-70 in dark. It is
the only surface role with that pair, so the design-review decision (a lighter blue on dark) holds
without freezing a literal. Referenced from `gantt/_colors.scss`.
