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
its alpha, so `background-color` paints it from the cascade or from a role and the colour stays a
token. That is how gantt, list, the file manager, timeView and diagram were retired - see the
`$masked` flag in each `base/<widget>/_mixins.scss`, which keeps the legacy themes on the baked path
so their emitted css does not move.

**What is left is only what is the same in both modes.** A literal that does not flip answers for
every mode scope, so it is a frozen value, not a broken island. That every remaining data uri is
mode-invariant is not a claim to be trusted: `tests/data-uri-mode-parity.test.ts` compares the light
and the dark bundle and requires the same image at the same rule.

## Current inventory - 3 markers, 1 component

### fileManager - 3, structural

`done.svg` and `danger.svg` put a glyph on a success or danger disc beside the neutral arrows. The
arrows are a mask painted by `currentColor`, and the disc goes back on top as an image of its own,
so the two fills inside it stay literals: the disc is a fixed green or red in both modes, and the
glyph on it is `content-static-dark` - what sits on a fill that does not flip has no reason to flip
either.

### diagram - none

Every diagram icon is a mask, the properties-panel toggle included: it paints from
`content-static-dark`, the role its literal used to stand for, so nothing is frozen any more.

Two images are still emitted there, and neither is a marker. The `none` connector marks carry
`.st0{fill:#FF0000}` in their `<style>` block, which beats the `fill="currentColor"` attribute on
the same path, so the slash is genuinely red and no substitution reaches it: the mask keeps the
union of the slash and the box for `currentColor` to fill, and the red goes back on top as an image
that is the same in both modes. The selectbox placeholder is an empty drawing.

### Masks and forced colours

A forced-colours palette replaces `background-color` with its Canvas, which is what an icon sits on,
so a mask left to itself paints nothing at all where a baked image used to survive.
`base/_mask.scss` is what every masked glyph paints through, and it names the palette's text colour
for that case. One mask is deliberately not on it: the grid's virtual-row placeholder
(`base/dataGrid/_index.scss`) is a skeleton, not a glyph, and a solid `CanvasText` bar in place of
the rows it stands for would be worse than the nothing it shows now.

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

### gantt time-interval band

`$gantt-ti-bg` is `ds.$color-bg-primary-alpha-hovered` - the hovered rung of the translucent accent
ramp, alpha 0.20 - on an element that is always at rest. Kept deliberately, measured 17.09: the
resting rung of the same ramp is alpha 0.11, legacy fluent drew this band at 0.15, and against the
canvas the band would go from 1.33 to 1.16 - fainter than what it replaced, and no rung of the ramp
carries the legacy density.

The same ramp is read off-rung in two more places, in opposite directions: `$html-editor-variable-bg`
is another resting element on the hovered rung, and `$scheduler-workspace-cell-bg-focused` is a
focused element on the resting rung. Whether the ramp needs a fourth step or the three places need
to agree is a question for the ramp, not for this band.
