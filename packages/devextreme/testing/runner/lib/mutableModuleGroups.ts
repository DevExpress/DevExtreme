/**
 * Modules that always get a generated mutable facade (sinon.stub targets).
 * `internal` is wrapped via `?dx-original=1`; `also` aliases share one globalThis api.
 *
 * Keep hand-written shims only for non-generic cases (themes composition,
 * CSS inject, jquery globals, …).
 *
 * Consumed by `autoMutableFacade.ts` (serve-time codegen) and import-map build.
 */
export interface MutableModuleGroup {
  /** Path under `artifacts/transpiled-esm-npm/esm/`. */
  internal: string;
  /** Extra ESM artifact paths that share the same facade/api. */
  also?: readonly string[];
  /** Import-map bare keys beyond those derived from internal/also (strip `.js`). */
  extraKeys?: readonly string[];
  apiFromDefault?: boolean;
}

export const MUTABLE_MODULE_GROUPS: readonly MutableModuleGroup[] = [
  {
    internal: '__internal/viz/core/renderers/renderer.js',
    also: ['viz/core/renderers/renderer_default.js'],
    extraKeys: ['viz/core/renderers/renderer'],
  },
  {
    internal: '__internal/viz/core/renderers/animation.js',
    also: ['viz/core/renderers/animation.js'],
  },
  {
    internal: '__internal/viz/core/utils.js',
    also: ['viz/core/utils.js', 'viz/core/utils_default.js'],
  },
  {
    internal: '__internal/viz/axes/base_axis.js',
    extraKeys: ['viz/axes/base_axis'],
  },
  {
    internal: '__internal/viz/translators/translator2d.js',
    extraKeys: ['viz/translators/translator2d'],
  },
  {
    internal: '__internal/viz/axes/tick_generator.js',
    extraKeys: ['viz/axes/tick_generator'],
  },
  {
    internal: '__internal/viz/core/tooltip.js',
    also: ['viz/core/tooltip.js'],
  },
  {
    internal: '__internal/viz/core/export.js',
    also: [
      '__internal/viz/core/exportModule.js',
      'viz/core/export.js',
    ],
  },
  {
    internal: '__internal/viz/components/legend.js',
    also: ['viz/components/legend.js'],
  },
  {
    internal: '__internal/viz/core/loading_indicator.js',
    also: ['viz/core/loading_indicator.js'],
  },
  {
    // Real named exports live in palette.js; paletteModule.js is only
    // `import * as PaletteModule from './palette'; export default PaletteModule`.
    internal: '__internal/viz/palette.js',
    also: ['__internal/viz/paletteModule.js'],
    extraKeys: ['viz/palette'],
  },
  {
    internal: '__internal/common/core/animation/frame.js',
    also: [
      'common/core/animation/frame.js',
      '__internal/common/core/animation/frameModule.js',
    ],
    extraKeys: ['animation/frame'],
  },
];
