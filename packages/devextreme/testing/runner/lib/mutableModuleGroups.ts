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
    internal: '__internal/viz/core/utils.js',
    also: ['viz/core/utils.js', 'viz/core/utils_default.js'],
  },
  {
    internal: '__internal/viz/translators/translator2d.js',
    extraKeys: ['viz/translators/translator2d'],
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
