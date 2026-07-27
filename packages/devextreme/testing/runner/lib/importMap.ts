import * as fs from 'node:fs';

const ESM_ROOT = '/packages/devextreme/artifacts/transpiled-esm-npm/esm';
const SHIMS = '/packages/devextreme/testing/helpers/esm-shims';
const NODE_MODULES = '/packages/devextreme/node_modules';

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

    // Exact package entry points used as bare imports
    // CJS-interop: tests use `import localization from 'localization'`
    localization: `${SHIMS}/localization.js`,
    events: `${ESM_ROOT}/events.js`,
    data: `${ESM_ROOT}/data.js`,
    animation: `${ESM_ROOT}/animation.js`,

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

    // SystemJS css! plugin replacements
    'fluent_blue_light.css!': `${SHIMS}/fluent_blue_light.css.js`,
    'generic_light.css!': `${SHIMS}/generic_light.css.js`,
    'material_blue_light.css!': `${SHIMS}/material_blue_light.css.js`,
    'gantt.css!': `${SHIMS}/gantt.css.js`,

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
