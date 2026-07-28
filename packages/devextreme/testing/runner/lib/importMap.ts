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
 * Collect SystemJS plugin-style bare imports (`*.json!`, etc.) from suite source.
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

function resolveJsonBangToUrl(specifier: string): string | null {
  // e.g. localization/messages/ja.json! → ESM messages file as module
  if (!specifier.endsWith('.json!')) {
    return null;
  }

  const withoutBang = specifier.slice(0, -1); // keep .json
  return `${ESM_ROOT}/${withoutBang}?esm-export=1`;
}

/**
 * SystemJS used artifacts baseURL, so bare `exporter` → exporter.js.
 * Import maps need exact keys for those package-root entry files.
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
 * Builds a browser import map for QUnit ESM loader.
 * Bare prefixes mirror SystemJS map + Vite playground aliases.
 */
export function buildQunitImportMap({
  cacheBuster,
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
    'viz/': `${ESM_ROOT}/viz/`,
    '__internal/': `${ESM_ROOT}/__internal/`,
    'renovation/': `${ESM_ROOT}/renovation/`,
    'bundles/': '/packages/devextreme/build/bundle-templates/',

    // Exact package-root entries (exporter, color, localization, events, …)
    ...collectPackageRootEntries(),

    jquery: `${SHIMS}/jquery.js`,

    // Injected by babel transform-runtime (esm transpile)
    '@babel/runtime/': `${NODE_MODULES}/@babel/runtime/`,

    // Vendors (prefer ESM builds where available)
    inferno: `${NODE_MODULES}/inferno/dist/index.dev.esm.js`,
    'inferno-hydrate': `${NODE_MODULES}/inferno-hydrate/dist/index.dev.esm.js`,
    'inferno-create-element': `${NODE_MODULES}/inferno-create-element/dist/index.dev.esm.js`,
    '@preact/signals-core': `${NODE_MODULES}/@preact/signals-core/dist/signals-core.module.js`,

    // eslint-disable-next-line spellcheck/spell-checker
    fflate: `${NODE_MODULES}/fflate/esm/browser.js`,
    knockout: `${NODE_MODULES}/knockout/build/output/knockout-latest.debug.js`,

    // SystemJS css! plugin replacements
    'fluent_blue_light.css!': `${SHIMS}/fluent_blue_light.css.js`,
    'generic_light.css!': `${SHIMS}/generic_light.css.js`,
    'material_blue_light.css!': `${SHIMS}/material_blue_light.css.js`,
    'gantt.css!': `${SHIMS}/gantt.css.js`,

    // Debug-export shims
    '__internal/viz/gauges/base_indicators': `${SHIMS}/base_indicators.js`,

    // Stubs
    zod: `${SHIMS}/zod.js`,
    'zod-to-json-schema': `${SHIMS}/zod-to-json-schema.js`,
  };

  if (suiteFilePath && fs.existsSync(suiteFilePath)) {
    const source = fs.readFileSync(suiteFilePath, 'utf8');
    collectPluginSpecifiers(source).forEach((specifier) => {
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
    imports[key] = withCacheBuster(url, cacheBuster);
  });

  return { imports };
}

export function getEsmModuleRoot(): string {
  return ESM_ROOT;
}
