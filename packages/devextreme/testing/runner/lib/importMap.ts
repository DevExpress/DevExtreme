import * as fs from 'node:fs';
import * as path from 'node:path';

import { buildMutableModuleImportMapEntries } from './autoMutableFacade';

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

  if (url.startsWith(ESM_ROOT)) {
    return url;
  }

  return `${url}${url.includes('?') ? '&' : '?'}${cacheBuster}`;
}

/**
 * Collect plugin-style bare imports (`*.json!`, `*.json!json`, `*.css!`, …) from suite source.
 */
export function collectPluginSpecifiers(suiteSource: string): string[] {
  const found = new Set<string>();
  // `file.json!` / `file.json!json` (and css equivalents)
  const re = /['"]([^'"]+\.(?:json|css)!(?:json|css)?)['"]/g;
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
  // e.g. localization/messages/ja.json! or cldr fr.json!json → JSON as ESM module
  const jsonBang = /^(.*\.json)!(?:json)?$/.exec(specifier);
  if (!jsonBang) {
    return null;
  }

  const withoutBang = jsonBang[1]; // keep .json

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
 *
 * The stub suites are often wrappers (`*.missingModules.tests.js`) that
 * `require()` / `import` `importQuill.tests.js` etc. — match against the
 * whole local import tree, not only the entry suite path.
 */
function collectSuiteImportOverrides(suiteFilePath?: string): Record<string, string> {
  if (!suiteFilePath) {
    return {};
  }

  const helpers = '/packages/devextreme/testing/helpers';
  const overrides: Record<string, string> = {};

  const queue = [suiteFilePath];
  const seen = new Set<string>();

  while (queue.length) {
    const filePath = queue.shift();
    if (filePath === undefined) {
      break;
    }

    const normalizedPath = path.resolve(filePath);
    if (!seen.has(normalizedPath) && fs.existsSync(normalizedPath)) {
      seen.add(normalizedPath);

      const normalized = normalizedPath.replace(/\\/g, '/');
      if (normalized.includes('/importGantt.tests.js')) {
        overrides['devexpress-gantt'] = `${helpers}/noGantt.js`;
      }
      if (normalized.includes('/importQuill.tests.js')) {
        overrides['devextreme-quill'] = `${helpers}/quillDependencies/noQuill.js`;
      }
      if (normalized.includes('/importDiagram.tests.js')) {
        overrides['devexpress-diagram'] = `${helpers}/noDiagram.js`;
      }

      const source = fs.readFileSync(normalizedPath, 'utf8');
      collectRelativeImportPaths(source).forEach((relativeSpec) => {
        const nextPath = resolveLocalSuiteModulePath(normalizedPath, relativeSpec);
        if (nextPath) {
          queue.push(nextPath);
        }
      });
    }
  }

  return overrides;
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
      // Extensionless, like the `viz/` `core/` `common/` prefix maps: artifacts import
      // root modules as `../../exporter`, and a second URL for the same file would give
      // the browser a second module instance with its own copy of every binding.
      const url = `${ESM_ROOT}/${name}`;
      entries[name] = url;
      // Suites often `require('aspnet.js')` / `require('color.js')` with the extension.
      entries[entry.name] = url;
      return;
    }

    // Package folders with index.js (e.g. events → events/index.js), mapped
    // extensionless for the same reason as the file branch above: artifacts
    // import them as `../events`, and the server resolves the index itself.
    if (entry.isDirectory()) {
      const indexPath = path.join(ESM_FS_ROOT, entry.name, 'index.js');
      if (fs.existsSync(indexPath)) {
        entries[entry.name] = `${ESM_ROOT}/${entry.name}`;
      }
    }
  });

  return entries;
}

const BUNDLE_TEMPLATES_ROOT = '/packages/devextreme/build/bundle-templates/';

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
    'bundles/': BUNDLE_TEMPLATES_ROOT,
    'bundles/dx.custom.js': '/packages/devextreme/artifacts/transpiled-esm-npm/bundles/dx.custom.js',

    // Exact package-root entries (exporter, color, localization, events, …)
    ...collectPackageRootEntries(),
    // Forced mutable facades → ESM artifacts (generated at serve-time).
    ...buildMutableModuleImportMapEntries(ESM_ROOT),

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
    'material_blue_light.css!': `${SHIMS}/material_blue_light.css.js`,
    'gantt.css!': `${SHIMS}/gantt.css.js`,

    // Auto-mutable modules are provided by buildMutableModuleImportMapEntries above.
    // Hand-written only where composition is custom (themes).
    'viz/core/base_theme_manager': `${ESM_ROOT}/viz/core/base_theme_manager.js`,
    'viz/chart_components/layout_manager': `${ESM_ROOT}/viz/chart_components/layout_manager.js`,
    'viz/chart_components/scroll_bar': `${ESM_ROOT}/viz/chart_components/scroll_bar.js`,
    'viz/components/chart_theme_manager': `${ESM_ROOT}/viz/components/chart_theme_manager.js`,
    'viz/components/data_validator': `${ESM_ROOT}/viz/components/data_validator.js`,
    'viz/series/points/base_point': `${ESM_ROOT}/viz/series/points/base_point.js`,
    'viz/series/base_series': `${ESM_ROOT}/viz/series/base_series.js`,
    'viz/core/series_family': `${ESM_ROOT}/viz/core/series_family.js`,
    'viz/series/points/label': `${ESM_ROOT}/viz/series/points/label.js`,
    'viz/translators/range': `${ESM_ROOT}/viz/translators/range.js`,
    'viz/translators/translator1d': `${ESM_ROOT}/viz/translators/translator1d.js`,
    'viz/vector_map/tracker': `${ESM_ROOT}/viz/vector_map/tracker.js`,
    'viz/vector_map/map_layer': `${ESM_ROOT}/viz/vector_map/map_layer.js`,
    '__internal/viz/core/base_theme_manager': `${ESM_ROOT}/__internal/viz/core/base_theme_manager.js`,
    '__internal/viz/chart_components/layout_manager': `${ESM_ROOT}/__internal/viz/chart_components/layout_manager.js`,
    '__internal/viz/chart_components/scroll_bar': `${ESM_ROOT}/__internal/viz/chart_components/scroll_bar.js`,
    '__internal/viz/components/chart_theme_manager': `${ESM_ROOT}/__internal/viz/components/chart_theme_manager.js`,
    '__internal/viz/components/data_validator': `${ESM_ROOT}/__internal/viz/components/data_validator.js`,
    '__internal/viz/series/points/base_point': `${ESM_ROOT}/__internal/viz/series/points/base_point.js`,
    '__internal/viz/series/base_series': `${ESM_ROOT}/__internal/viz/series/base_series.js`,
    '__internal/viz/core/series_family': `${ESM_ROOT}/__internal/viz/core/series_family.js`,
    '__internal/viz/series/points/label': `${ESM_ROOT}/__internal/viz/series/points/label.js`,
    '__internal/viz/translators/range': `${ESM_ROOT}/__internal/viz/translators/range.js`,
    '__internal/viz/translators/translator1d': `${ESM_ROOT}/__internal/viz/translators/translator1d.js`,
    '__internal/viz/vector_map/tracker': `${ESM_ROOT}/__internal/viz/vector_map/tracker.js`,
    '__internal/viz/vector_map/map_layer': `${ESM_ROOT}/__internal/viz/vector_map/map_layer.js`,
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
      if (/\.json!(?:json)?$/.test(specifier)) {
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
