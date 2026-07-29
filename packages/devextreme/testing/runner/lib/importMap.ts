import * as fs from 'node:fs';
import * as path from 'node:path';

const ESM_ROOT = '/packages/devextreme/artifacts/transpiled-esm-npm/esm';
const SHIMS = '/packages/devextreme/testing/helpers/esm-shims';
const NODE_MODULES = '/packages/devextreme/node_modules';

function resolveEsmRootPath(): string {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, 'artifacts/transpiled-esm-npm/esm'),
    path.join(cwd, 'packages/devextreme/artifacts/transpiled-esm-npm/esm'),
  ];

  const resolved = candidates.find((candidate) => fs.existsSync(candidate));
  return resolved ?? candidates[0];
}

const ESM_FS_ROOT = resolveEsmRootPath();

function resolveWorkspaceRoot(): string {
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, 'packages', 'devextreme'))) {
    return cwd;
  }
  return path.resolve(cwd, '../..');
}

/**
 * Resolve a file from the workspace virtual store to a browser URL
 * (packages that are not always hoisted into package node_modules).
 */
function resolveVirtualStorePackageUrl(packageName: string, fileName: string): string | null {
  const workspaceRoot = resolveWorkspaceRoot();
  const storeDirs = [
    path.join(workspaceRoot, 'node_modules', '.pnpm'),
    path.join(workspaceRoot, 'packages', 'devextreme', 'node_modules', '.pnpm'),
  ];

  for (const storeDir of storeDirs) {
    if (!fs.existsSync(storeDir)) {
      // skip missing store roots
    } else {
      const matches = fs.readdirSync(storeDir)
        .filter((name) => name.startsWith(`${packageName}@`))
        .sort()
        .reverse();

      for (const match of matches) {
        const filePath = path.join(storeDir, match, 'node_modules', packageName, fileName);
        if (fs.existsSync(filePath)) {
          const relative = path.relative(workspaceRoot, filePath).split(path.sep).join('/');
          return `/${relative}`;
        }
      }
    }
  }

  return null;
}

export interface ImportMapOptions {
  jqueryUrl: string;
  cacheBuster: string;
  /** Absolute FS path to the suite script (for scanning json! / css! imports). */
  suiteFilePath?: string;
}

export interface BrowserImportMap {
  imports: Record<string, string>;
}

function withCacheBuster(url: string, cacheBuster: string): string {
  if (!cacheBuster) {
    return url;
  }

  return `${url}${url.includes('?') ? '&' : '?'}${cacheBuster}`;
}

/**
 * Collect legacy plugin-style bare imports (`*.json!`, etc.) from suite source.
 */
export function collectPluginSpecifiers(suiteSource: string): string[] {
  const found = new Set<string>();
  const re = /['"]([^'"]+\.(?:json|css)!)['"]/g;
  let match = re.exec(suiteSource);
  while (match) {
    found.add(match[1]);
    match = re.exec(suiteSource);
  }
  return [...found];
}

function collectRelativeImportPaths(source: string): string[] {
  const found: string[] = [];
  const re = /(?:import|export)\s+(?:[^'"\n;]+?\s+from\s+)?['"](\.[^'"]+)['"]|require\s*\(\s*['"](\.[^'"]+)['"]\s*\)/g;
  let match = re.exec(source);
  while (match) {
    found.push(match[1] || match[2]);
    match = re.exec(source);
  }
  return found;
}

function resolveLocalSuiteModulePath(fromFile: string, relativeSpec: string): string | null {
  const withoutQuery = relativeSpec.split('?')[0];
  const resolved = path.resolve(path.dirname(fromFile), withoutQuery);
  const candidates = [
    resolved,
    `${resolved}.js`,
    path.join(resolved, 'index.js'),
  ];
  const isExistingFile = (candidate: string): boolean => (
    fs.existsSync(candidate) && fs.statSync(candidate).isFile()
  );
  return candidates.find(isExistingFile) ?? null;
}

/**
 * Suites often pull `*.json!` only through nested helpers (e.g. loadPanel tests).
 * Walk relative local imports so those plugin specs land in the import map.
 */
export function collectPluginSpecifiersFromSuiteTree(suiteFilePath: string): string[] {
  const found = new Set<string>();
  const queue = [suiteFilePath];
  const seen = new Set<string>();

  while (queue.length) {
    const filePath = queue.shift();
    if (filePath === undefined) {
      break;
    }

    const normalized = path.resolve(filePath);
    if (!seen.has(normalized) && fs.existsSync(normalized)) {
      seen.add(normalized);

      const source = fs.readFileSync(normalized, 'utf8');
      collectPluginSpecifiers(source).forEach((specifier) => found.add(specifier));

      collectRelativeImportPaths(source).forEach((relativeSpec) => {
        const nextPath = resolveLocalSuiteModulePath(normalized, relativeSpec);
        if (nextPath) {
          queue.push(nextPath);
        }
      });
    }
  }

  return [...found];
}

function resolveJsonBangToUrl(specifier: string): string | null {
  // e.g. localization/messages/ja.json! → ESM messages file as module
  if (!specifier.endsWith('.json!')) {
    return null;
  }

  const withoutBang = specifier.slice(0, -1); // keep .json

  // Vendor CLDR JSON (localization.globalize suites)
  if (
    withoutBang.startsWith('devextreme-cldr-data/')
    || withoutBang.startsWith('cldr-core/')
  ) {
    return `${NODE_MODULES}/${withoutBang}?esm-export=1`;
  }

  return `${ESM_ROOT}/${withoutBang}?esm-export=1`;
}

/**
 * Suites that remap optional vendor packages to null stubs
 * (missing-dependency error coverage).
 */
function collectSuiteImportOverrides(suiteFilePath?: string): Record<string, string> {
  if (!suiteFilePath) {
    return {};
  }

  const normalized = suiteFilePath.replace(/\\/g, '/');
  const helpers = '/packages/devextreme/testing/helpers';

  if (normalized.includes('/importGantt.tests.js')) {
    return { 'devexpress-gantt': `${helpers}/noGantt.js` };
  }
  if (normalized.includes('/importQuill.tests.js')) {
    return { 'devextreme-quill': `${helpers}/quillDependencies/noQuill.js` };
  }
  if (normalized.includes('/importDiagram.tests.js')) {
    return { 'devexpress-diagram': `${helpers}/noDiagram.js` };
  }

  return {};
}

/**
 * Exact bare entries for package-root files (exporter, color, …).
 */
function collectPackageRootEntries(): Record<string, string> {
  const entries: Record<string, string> = {};

  if (!fs.existsSync(ESM_FS_ROOT)) {
    return entries;
  }

  fs.readdirSync(ESM_FS_ROOT, { withFileTypes: true }).forEach((entry) => {
    if (entry.isFile() && entry.name.endsWith('.js')) {
      const name = entry.name.slice(0, -3);
      entries[name] = `${ESM_ROOT}/${entry.name}`;
      return;
    }

    // Package folders with index.js (e.g. events → events/index.js)
    if (entry.isDirectory()) {
      const indexPath = path.join(ESM_FS_ROOT, entry.name, 'index.js');
      if (fs.existsSync(indexPath)) {
        entries[entry.name] = `${ESM_ROOT}/${entry.name}/index.js`;
      }
    }
  });

  return entries;
}

/**
 * Builds a browser import map for QUnit native ESM.
 */
export function buildQunitImportMap({
  cacheBuster,
  jqueryUrl,
  suiteFilePath,
}: ImportMapOptions): BrowserImportMap {
  const rawImports: Record<string, string> = {
    // Package roots (trailing slash = prefix remap)
    'ui/': `${ESM_ROOT}/ui/`,
    'core/': `${ESM_ROOT}/core/`,
    'common/': `${ESM_ROOT}/common/`,
    'data/': `${ESM_ROOT}/data/`,
    'events/': `${ESM_ROOT}/events/`,
    'animation/': `${ESM_ROOT}/animation/`,
    'localization/': `${ESM_ROOT}/localization/`,
    'file_management/': `${ESM_ROOT}/file_management/`,
    'integration/': `${ESM_ROOT}/integration/`,
    'mobile/': `${ESM_ROOT}/mobile/`,
    'viz/': `${ESM_ROOT}/viz/`,
    '__internal/': `${ESM_ROOT}/__internal/`,
    'renovation/': `${ESM_ROOT}/renovation/`,
    'bundles/': '/packages/devextreme/build/bundle-templates/',

    // Exact package-root entries (exporter, color, localization, events, …)
    ...collectPackageRootEntries(),

    jquery: jqueryUrl.includes('noJQuery') ? jqueryUrl : `${SHIMS}/jquery.js`,

    // Injected by babel transform-runtime (esm transpile).
    // jspdf imports `@babel/runtime/helpers/<name>` (CJS); our artifacts use
    // `helpers/esm/<name>`. Remap non-esm helper paths to the ESM builds, but
    // keep an exact `helpers/esm/` prefix so existing imports stay correct.
    '@babel/runtime/helpers/esm/': `${NODE_MODULES}/@babel/runtime/helpers/esm/`,
    '@babel/runtime/helpers/': `${NODE_MODULES}/@babel/runtime/helpers/esm/`,
    '@babel/runtime/': `${NODE_MODULES}/@babel/runtime/`,

    // Vendors (prefer ESM builds where available)
    inferno: `${NODE_MODULES}/inferno/dist/index.dev.esm.js`,
    'inferno-hydrate': `${NODE_MODULES}/inferno-hydrate/dist/index.dev.esm.js`,
    'inferno-create-element': `${NODE_MODULES}/inferno-create-element/dist/index.dev.esm.js`,
    '@preact/signals-core': `${NODE_MODULES}/@preact/signals-core/dist/signals-core.module.js`,

    // eslint-disable-next-line spellcheck/spell-checker
    fflate: resolveVirtualStorePackageUrl('fflate', 'esm/browser.js')
      ?? `${NODE_MODULES}/fflate/esm/browser.js`,
    knockout: `${SHIMS}/knockout.js`,
    rrule: `${NODE_MODULES}/rrule/dist/esm/index.js`,
    // eslint-disable-next-line spellcheck/spell-checker
    tslib: resolveVirtualStorePackageUrl('tslib', 'tslib.es6.mjs') ?? `${SHIMS}/tslib.js`,
    jspdf: `${NODE_MODULES}/jspdf/dist/jspdf.es.min.js`,
    'jspdf-autotable': `${SHIMS}/jspdf_autotable.js`,
    'fast-png': resolveVirtualStorePackageUrl('fast-png', 'lib-esm/index.js') ?? `${NODE_MODULES}/fast-png/lib-esm/index.js`,
    // eslint-disable-next-line spellcheck/spell-checker
    iobuffer: resolveVirtualStorePackageUrl('iobuffer', 'lib-esm/IOBuffer.js') ?? `${NODE_MODULES}/iobuffer/lib-esm/IOBuffer.js`,
    // eslint-disable-next-line spellcheck/spell-checker
    pako: resolveVirtualStorePackageUrl('pako', 'dist/pako.esm.mjs') ?? `${NODE_MODULES}/pako/dist/pako.esm.mjs`,
    // Plugins live under dist/globalize/*.js (not dist/*.js)
    globalize: `${NODE_MODULES}/globalize/dist/globalize.js`,
    'globalize/': `${NODE_MODULES}/globalize/dist/globalize/`,
    cldr: `${NODE_MODULES}/cldrjs/dist/cldr.js`,
    'cldr/': `${NODE_MODULES}/cldrjs/dist/cldr/`,
    'devextreme-cldr-data/': `${NODE_MODULES}/devextreme-cldr-data/`,
    'cldr-core/': `${NODE_MODULES}/cldr-core/`,
    // Browser UMD build (Node `intl/index.js` uses `global` / `require`)
    intl: `${NODE_MODULES}/intl/dist/Intl.complete.js`,
    jszip: '/packages/devextreme/artifacts/js/jszip.js',
    'devextreme-exceljs-fork': '/packages/devextreme/artifacts/js/dx-exceljs-fork.js',
    'devextreme-quill': `${NODE_MODULES}/devextreme-quill/dist/dx-quill.js`,
    'devexpress-diagram': '/packages/devextreme/artifacts/js/dx-diagram.js',
    'devexpress-gantt': '/packages/devextreme/artifacts/js/dx-gantt.js',

    // css! plugin replacements
    'fluent_blue_light.css!': `${SHIMS}/fluent_blue_light.css.js`,
    'generic_light.css!': `${SHIMS}/generic_light.css.js`,
    'material_blue_light.css!': `${SHIMS}/material_blue_light.css.js`,
    'gantt.css!': `${SHIMS}/gantt.css.js`,

    // Debug-export shims
    '__internal/viz/gauges/base_indicators': `${SHIMS}/base_indicators.js`,

    // Mutable facades so QUnit can stub Renderer / Axis / Translator2D
    // / tickGenerator / Tooltip / themes / utils / animation / vectorMap under native ESM
    'viz/core/renderers/renderer': `${SHIMS}/viz_renderer.js`,
    'viz/core/renderers/renderer_default': `${SHIMS}/viz_renderer.js`,
    'viz/core/renderers/animation': `${SHIMS}/viz_animation.js`,
    'viz/core/utils': `${SHIMS}/viz_utils.js`,
    'viz/core/utils_default': `${SHIMS}/viz_utils.js`,
    'viz/palette': `${SHIMS}/viz_paletteModule.js`,
    '__internal/viz/paletteModule': `${SHIMS}/viz_paletteModule.js`,
    '__internal/viz/palette': `${SHIMS}/viz_paletteModule.js`,
    'viz/core/tooltip': `${SHIMS}/viz_tooltip.js`,
    'viz/core/title': `${SHIMS}/viz_title.js`,
    'viz/core/export': `${SHIMS}/viz_export.js`,
    'viz/core/base_theme_manager': `${SHIMS}/viz_base_theme_manager.js`,
    'viz/chart_components/tracker': `${SHIMS}/viz_chart_tracker.js`,
    'viz/chart_components/layout_manager': `${SHIMS}/viz_layout_manager.js`,
    'viz/chart_components/scroll_bar': `${SHIMS}/viz_scroll_bar.js`,
    'viz/chart_components/crosshair': `${SHIMS}/viz_crosshair.js`,
    'viz/components/legend': `${SHIMS}/viz_components_legend.js`,
    'viz/components/chart_theme_manager': `${SHIMS}/viz_chart_theme_manager.js`,
    'viz/components/data_validator': `${SHIMS}/viz_data_validator.js`,
    'viz/series/points/base_point': `${SHIMS}/viz_base_point.js`,
    'viz/series/base_series': `${SHIMS}/viz_base_series.js`,
    'viz/core/series_family': `${SHIMS}/viz_series_family.js`,
    'viz/core/loading_indicator': `${SHIMS}/viz_loading_indicator.js`,
    'viz/axes/base_axis': `${SHIMS}/viz_base_axis.js`,
    '__internal/core/localization/ldml/date.parser': `${SHIMS}/date_parser.js`,
    '__internal/core/localization/ldml/dateParserModule': `${SHIMS}/date_parser.js`,
    'common/core/localization/ldml/date.parser': `${SHIMS}/date_parser.js`,
    'viz/axes/tick_generator': `${SHIMS}/viz_tick_generator.js`,
    'viz/translators/translator2d': `${SHIMS}/viz_translator2d.js`,
    'viz/vector_map/projection.main': `${SHIMS}/viz_projection_main.js`,
    'viz/vector_map/control_bar/control_bar': `${SHIMS}/viz_control_bar.js`,
    'viz/vector_map/gesture_handler': `${SHIMS}/viz_gesture_handler.js`,
    'viz/vector_map/tracker': `${SHIMS}/viz_tracker.js`,
    'viz/vector_map/data_exchanger': `${SHIMS}/viz_data_exchanger.js`,
    'viz/vector_map/legend': `${SHIMS}/viz_legend.js`,
    'viz/vector_map/layout': `${SHIMS}/viz_layout.js`,
    'viz/vector_map/map_layer': `${SHIMS}/viz_map_layer.js`,
    'viz/vector_map/tooltip_viewer': `${SHIMS}/viz_tooltip_viewer.js`,
    '__internal/viz/core/renderers/renderer': `${SHIMS}/viz_renderer.js`,
    '__internal/viz/core/renderers/animation': `${SHIMS}/viz_animation.js`,
    '__internal/viz/core/utils': `${SHIMS}/viz_utils.js`,
    '__internal/viz/core/tooltip': `${SHIMS}/viz_tooltip.js`,
    '__internal/viz/core/title': `${SHIMS}/viz_title.js`,
    '__internal/viz/core/export': `${SHIMS}/viz_export.js`,
    '__internal/viz/core/exportModule': `${SHIMS}/viz_export.js`,
    '__internal/viz/core/base_theme_manager': `${SHIMS}/viz_base_theme_manager.js`,
    '__internal/viz/chart_components/tracker': `${SHIMS}/viz_chart_tracker.js`,
    '__internal/viz/chart_components/layout_manager': `${SHIMS}/viz_layout_manager.js`,
    '__internal/viz/chart_components/scroll_bar': `${SHIMS}/viz_scroll_bar.js`,
    '__internal/viz/chart_components/crosshair': `${SHIMS}/viz_crosshair.js`,
    '__internal/viz/components/legend': `${SHIMS}/viz_components_legend.js`,
    '__internal/viz/components/chart_theme_manager': `${SHIMS}/viz_chart_theme_manager.js`,
    '__internal/viz/components/data_validator': `${SHIMS}/viz_data_validator.js`,
    '__internal/viz/series/points/base_point': `${SHIMS}/viz_base_point.js`,
    '__internal/viz/series/base_series': `${SHIMS}/viz_base_series.js`,
    '__internal/viz/core/series_family': `${SHIMS}/viz_series_family.js`,
    '__internal/viz/core/loading_indicator': `${SHIMS}/viz_loading_indicator.js`,
    '__internal/viz/axes/base_axis': `${SHIMS}/viz_base_axis.js`,
    '__internal/viz/axes/tick_generator': `${SHIMS}/viz_tick_generator.js`,
    '__internal/viz/translators/translator2d': `${SHIMS}/viz_translator2d.js`,
    '__internal/viz/vector_map/projection.main': `${SHIMS}/viz_projection_main.js`,
    '__internal/viz/vector_map/control_bar/control_bar': `${SHIMS}/viz_control_bar.js`,
    '__internal/viz/vector_map/gesture_handler': `${SHIMS}/viz_gesture_handler.js`,
    '__internal/viz/vector_map/tracker': `${SHIMS}/viz_tracker.js`,
    '__internal/viz/vector_map/data_exchanger': `${SHIMS}/viz_data_exchanger.js`,
    '__internal/viz/vector_map/legend': `${SHIMS}/viz_legend.js`,
    '__internal/viz/vector_map/layout': `${SHIMS}/viz_layout.js`,
    '__internal/viz/vector_map/map_layer': `${SHIMS}/viz_map_layer.js`,
    '__internal/viz/vector_map/tooltip_viewer': `${SHIMS}/viz_tooltip_viewer.js`,
    'ui/themes': `${SHIMS}/themes.js`,
    '__internal/ui/themes': `${SHIMS}/themes.js`,

    // Stubs
    zod: `${SHIMS}/zod.js`,
    'zod-to-json-schema': `${SHIMS}/zod-to-json-schema.js`,

    // Suite-specific missing-dependency overrides
    ...collectSuiteImportOverrides(suiteFilePath),
  };

  if (suiteFilePath && fs.existsSync(suiteFilePath)) {
    collectPluginSpecifiersFromSuiteTree(suiteFilePath).forEach((specifier) => {
      if (specifier.endsWith('.json!')) {
        const url = resolveJsonBangToUrl(specifier);
        if (url) {
          rawImports[specifier] = url;
        }
      }
    });
  }

  const imports: Record<string, string> = {};
  Object.entries(rawImports).forEach(([key, url]) => {
    // Import-map package-prefix entries (`foo/`) must map to a URL ending
    // with `/` per spec. Appending `?cache` breaks that shape and browsers
    // treat such entries as blocked (`null`), causing CI-only resolution fails.
    imports[key] = key.endsWith('/') ? url : withCacheBuster(url, cacheBuster);
  });

  return { imports };
}

export function getEsmModuleRoot(): string {
  return ESM_ROOT;
}
