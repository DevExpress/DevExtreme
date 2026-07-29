import * as fs from 'node:fs';
import { IncomingMessage, ServerResponse } from 'node:http';
import * as path from 'node:path';

import {
  isQunitTestOrHelperPath,
  rewriteAspnetArtifactToEsm,
  rewriteQunitTestHelperSource,
} from './cjsInterop';

interface StaticFileServiceDeps {
  escapeHtml: (value: string) => string;
  rootDirectory: string;
  setNoCacheHeaders: (res: ServerResponse) => void;
  setStaticCacheHeaders: (res: ServerResponse, searchParams: URLSearchParams) => void;
}

export interface StaticFileService {
  tryServeStatic: (
    req: IncomingMessage,
    res: ServerResponse,
    pathname: string,
    searchParams: URLSearchParams,
  ) => boolean;
}

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.html':
    case '.htm':
      return 'text/html; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.js':
    case '.mjs':
      return 'application/javascript; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.xml':
    case '.xsl':
      return 'text/xml; charset=utf-8';
    case '.txt':
    case '.md':
    case '.log':
      return 'text/plain; charset=utf-8';
    case '.svg':
      return 'image/svg+xml';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.ico':
      return 'image/x-icon';
    case '.woff':
      return 'font/woff';
    case '.woff2':
      return 'font/woff2';
    case '.ttf':
      return 'font/ttf';
    case '.eot':
      return 'application/vnd.ms-fontobject';
    case '.map':
      return 'application/json; charset=utf-8';
    case '.wasm':
      return 'application/wasm';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Native ESM requires resolvable URLs. Our transpiled ESM tree uses
 * extensionless relative imports (`from './wrapper'`). Resolve those
 * to `.js` / `/index.js` on disk so import maps can load artifacts.
 *
 * Prefer `name.js` over a sibling directory `name/` — otherwise imports like
 * `../__internal/integration/jquery` resolve to a directory listing (HTML)
 * and the browser reports "Failed to fetch dynamically imported module".
 *
 * Also: files like `ui.collection_widget.edit` have a dotted basename;
 * `path.extname` returns `.edit`, so we must still try appending `.js`.
 */
function resolveStaticFilePath(filePath: string): string | null {
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return filePath;
  }

  const asJs = `${filePath}.js`;
  if (fs.existsSync(asJs) && fs.statSync(asJs).isFile()) {
    return asJs;
  }

  const asModuleJs = `${filePath}.mjs`;
  if (fs.existsSync(asModuleJs) && fs.statSync(asModuleJs).isFile()) {
    return asModuleJs;
  }

  const asIndexJs = path.join(filePath, 'index.js');
  if (fs.existsSync(asIndexJs) && fs.statSync(asIndexJs).isFile()) {
    return asIndexJs;
  }

  if (fs.existsSync(filePath)) {
    return filePath;
  }

  return null;
}

function sendStaticFile(res: ServerResponse, filePath: string, fileSize: number): boolean {
  res.statusCode = 200;
  res.setHeader('Content-Type', getContentType(filePath));
  res.setHeader('Content-Length', String(fileSize));

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);

  stream.on('error', () => {
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    }
    if (!res.writableEnded) {
      res.end('Internal Server Error');
    }
  });

  return true;
}

/**
 * Webpack/UMD vendor bundles mapped in the QUnit import map
 * (quill / diagram / gantt / jszip / exceljs / intl). Loaded as native ESM
 * they have no exports — wrap so `import X from '…'` works.
 */
function isWebpackVendorBundlePath(relativeUrlPath: string): boolean {
  const normalized = relativeUrlPath.split(path.sep).join('/');
  return normalized.endsWith('/devextreme-quill/dist/dx-quill.js')
    || normalized.endsWith('/artifacts/js/dx-diagram.js')
    || normalized.endsWith('/artifacts/js/dx-gantt.js')
    || normalized.endsWith('/artifacts/js/dx-exceljs-fork.js')
    || normalized.endsWith('/artifacts/js/jszip.js')
    || normalized.endsWith('/intl/dist/Intl.complete.js')
    || normalized.endsWith('/intl/dist/Intl.js');
}

function isIntlVendorBundlePath(relativeUrlPath: string): boolean {
  const normalized = relativeUrlPath.split(path.sep).join('/');
  return normalized.endsWith('/intl/dist/Intl.complete.js')
    || normalized.endsWith('/intl/dist/Intl.js');
}

/** globalize / cldrjs ship as UMD; native ESM needs a CJS-branch + require shim. */
function isGlobalizeOrCldrVendorPath(relativeUrlPath: string): boolean {
  const normalized = relativeUrlPath.split(path.sep).join('/');
  return normalized.endsWith('/globalize/dist/globalize.js')
    || normalized.includes('/globalize/dist/globalize/')
    || normalized.endsWith('/cldrjs/dist/cldr.js')
    || /\/cldrjs\/dist\/cldr\/[^/]+\.js$/i.test(normalized);
}

/** Vector map geo JSON UMD writes into `DevExpress.viz.map.sources`. */
function isVectorMapDataPath(relativeUrlPath: string): boolean {
  const normalized = relativeUrlPath.split(path.sep).join('/');
  return /\/artifacts\/js\/vectormap-data\/[^/]+\.js$/i.test(normalized);
}

/**
 * `intl/dist/Intl.complete.js` appends locale data that expects a free
 * `IntlPolyfill` binding from the UMD *browser* branch. Forcing CJS breaks
 * that, so keep the global branch and re-export the polyfill.
 */
function wrapIntlVendorAsEsm(source: string): string {
  return 'var define;\n'
    // Locale-data IIFE at file end references bare `IntlPolyfill`.
    + 'var IntlPolyfill;\n'
    + `${source
      .replace(/}\(this,/g, '}(globalThis,')
      .replace(/e\.IntlPolyfill=r\(\)/g, 'e.IntlPolyfill=IntlPolyfill=r()')}\n`
    + 'export default IntlPolyfill;\n';
}

/**
 * Force the CJS branch of a UMD wrapper and re-export `module.exports` as default.
 * Also emit synthetic named exports from the webpack entry module so
 * `import Def, * as Ns from 'pkg'` mirrors SystemJS/CJS interop
 * (needed by diagram.importer → `Ns.DiagramControl`).
 */
function collectWebpackEntryExportNames(source: string): string[] {
  const entryMatch = /var __webpack_exports__ = __webpack_require__\((\d+)\);/.exec(source);
  if (!entryMatch) {
    return [];
  }

  const entryId = entryMatch[1];
  const moduleStart = source.indexOf(`/***/ ${entryId}`);
  if (moduleStart < 0) {
    return [];
  }

  const nextModule = source.indexOf('\n/***/ ', moduleStart + 1);
  const moduleSource = nextModule < 0
    ? source.slice(moduleStart)
    : source.slice(moduleStart, nextModule);

  const names = new Set<string>();
  const definePropertyRe = /Object\.defineProperty\(\s*exports\s*,\s*["']([^"']+)["']/g;
  let match = definePropertyRe.exec(moduleSource);
  while (match) {
    const name = match[1];
    if (name !== '__esModule' && name !== 'default' && /^[A-Za-z_$][\w$]*$/.test(name)) {
      names.add(name);
    }
    match = definePropertyRe.exec(moduleSource);
  }

  return [...names].sort();
}

function wrapWebpackVendorAsEsm(source: string): string {
  const namedExports = collectWebpackEntryExportNames(source)
    .map((name) => `export const ${name} = module.exports.${name};`)
    .join('\n');

  return `const module = { exports: {} };
const exports = module.exports;
// Prevent AMD branch when a global \`define\` exists on the page.
var define;
${source}
const __dxVendorExport = module.exports && module.exports.__esModule
  && Object.prototype.hasOwnProperty.call(module.exports, 'default')
  ? module.exports.default
  : module.exports;
export default __dxVendorExport;
${namedExports ? `${namedExports}\n` : ''}`;
}

/**
 * Wrap globalize / cldrjs UMD so `import 'globalize/number'` works under native ESM.
 * Forces the CJS branch and shims `require()` for the few ids these packages use.
 */
function wrapGlobalizeOrCldrAsEsm(source: string, relativeUrlPath: string): string {
  const normalized = relativeUrlPath.split(path.sep).join('/');
  const isCldrMain = normalized.endsWith('/cldrjs/dist/cldr.js');
  const isCldrPlugin = /\/cldrjs\/dist\/cldr\/[^/]+\.js$/i.test(normalized);
  const isGlobalizeMain = normalized.endsWith('/globalize/dist/globalize.js');
  const isGlobalizePlugin = normalized.includes('/globalize/dist/globalize/');
  const baseName = path.basename(normalized, '.js');
  const needsNumber = isGlobalizePlugin && (baseName === 'currency' || baseName === 'date');

  const preamble: string[] = [];
  if (isCldrPlugin) {
    preamble.push('import __dxCldr from \'cldr\';');
  } else if (isGlobalizeMain) {
    preamble.push('import __dxCldr from \'cldr\';');
    preamble.push('import \'cldr/event\';');
  } else if (isGlobalizePlugin) {
    preamble.push('import __dxCldr from \'cldr\';');
    preamble.push('import \'cldr/event\';');
    preamble.push('import \'cldr/supplemental\';');
    preamble.push('import __dxGlobalize from \'globalize\';');
    if (needsNumber) {
      // CJS factory skips `./number`; AMD/DevExtreme always load it first.
      preamble.push('import \'./number.js\';');
    }
  }

  const requireShim = isCldrMain
    ? 'function require(id) { throw new Error(\'Unexpected require in cldr: \' + id); }\n'
    : [
      'function require(id) {\n',
      '  if (id === \'cldrjs\' || id === \'cldr\' || id === \'../cldr\') {\n',
      '    return __dxCldr;\n',
      '  }\n',
      '  if (id === \'../globalize\' || id === \'globalize\') {\n',
      '    return __dxGlobalize;\n',
      '  }\n',
      '  throw new Error(\'Unhandled require in globalize/cldr UMD: \' + id);\n',
      '}\n',
    ].join('');

  const vendorSource = source.replace(/}\(\s*this\s*,/g, '}(globalThis,');

  return [
    preamble.join('\n'),
    preamble.length ? '\n' : '',
    'const module = { exports: {} };\n',
    'const exports = module.exports;\n',
    'var define;\n',
    requireShim,
    vendorSource,
    '\n',
    'const __dxVendorExport = module.exports && module.exports.__esModule\n',
    '  && Object.prototype.hasOwnProperty.call(module.exports, \'default\')\n',
    '  ? module.exports.default\n',
    '  : module.exports;\n',
    'export default __dxVendorExport;\n',
  ].join('');
}

/**
 * Vector map geo data UMD: CJS writes into `exports`, browser branch expects
 * bare `DevExpress`. Under ESM imports hoist above suite setup, so create the
 * global sources bag and point `module.exports` at the same object.
 */
function wrapVectorMapDataAsEsm(source: string): string {
  const vendorSource = source.replace(/}\(\s*this\s*,/g, '}(globalThis,');

  return [
    'globalThis.DevExpress = globalThis.DevExpress || {};\n',
    'globalThis.DevExpress.viz = globalThis.DevExpress.viz || {};\n',
    'globalThis.DevExpress.viz.map = globalThis.DevExpress.viz.map || {};\n',
    'globalThis.DevExpress.viz.map.sources = globalThis.DevExpress.viz.map.sources || {};\n',
    'const module = { exports: globalThis.DevExpress.viz.map.sources };\n',
    'const exports = module.exports;\n',
    'var define;\n',
    vendorSource,
    '\n',
    'export default module.exports;\n',
  ].join('');
}

function wrapVendorBundleSource(source: string, relativeUrlPath: string): string {
  if (isIntlVendorBundlePath(relativeUrlPath)) {
    return wrapIntlVendorAsEsm(source);
  }
  if (isGlobalizeOrCldrVendorPath(relativeUrlPath)) {
    return wrapGlobalizeOrCldrAsEsm(source, relativeUrlPath);
  }
  if (isVectorMapDataPath(relativeUrlPath)) {
    return wrapVectorMapDataAsEsm(source);
  }
  return wrapWebpackVendorAsEsm(source);
}

function sendWebpackVendorAsEsm(
  res: ServerResponse,
  filePath: string,
  relativeUrlPath: string,
): boolean {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const body = wrapVendorBundleSource(raw, relativeUrlPath);
    const buffer = Buffer.from(body, 'utf8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Content-Length', String(buffer.length));
    res.end(buffer);
    return true;
  } catch {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Failed to wrap vendor bundle as ESM');
    return true;
  }
}

/** Serve JSON as `export default …` for native ESM (`*.json!` replacement). */
function sendJsonAsEsmModule(res: ServerResponse, filePath: string): boolean {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    // Validate JSON before embedding
    JSON.parse(raw);
    const body = `export default ${raw};\n`;
    const buffer = Buffer.from(body, 'utf8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Content-Length', String(buffer.length));
    res.end(buffer);
    return true;
  } catch {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Failed to export JSON as ESM module');
    return true;
  }
}

/**
 * Artifact modules whose relative imports must share a mutable facade with
 * bare import-map entries (Renderer / Axis / tickGenerator / Tooltip
 * / paletteModule / palette stubbing under native ESM).
 */
const MUTABLE_ARTIFACT_FACADES: readonly { suffix: string; shimUrl: string }[] = [
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/core/renderers/renderer.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_renderer.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/core/renderers/animation.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_animation.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/core/utils.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_utils.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/core/utils.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_utils.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/core/utils_default.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_utils.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/core/renderers/renderer_default.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_renderer.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/core/renderers/animation.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_animation.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/axes/base_axis.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_base_axis.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/translators/translator2d.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_translator2d.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/axes/tick_generator.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_tick_generator.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/core/tooltip.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_tooltip.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/core/tooltip.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_tooltip.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/core/title.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_title.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/core/title.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_title.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/core/export.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_export.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/core/exportModule.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_export.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/core/export.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_export.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/core/base_theme_manager.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_base_theme_manager.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/core/base_theme_manager.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_base_theme_manager.js',
  },
  {
    // m_base_chart imports this via relative path; charts QUnit stubs mutate it.
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/chart_components/tracker.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_chart_tracker.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/chart_components/tracker.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_chart_tracker.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/components/legend.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_components_legend.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/components/legend.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_components_legend.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/components/chart_theme_manager.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_chart_theme_manager.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/components/chart_theme_manager.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_chart_theme_manager.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/components/data_validator.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_data_validator.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/components/data_validator.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_data_validator.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/chart_components/layout_manager.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_layout_manager.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/chart_components/layout_manager.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_layout_manager.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/chart_components/scroll_bar.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_scroll_bar.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/chart_components/scroll_bar.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_scroll_bar.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/chart_components/crosshair.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_crosshair.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/chart_components/crosshair.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_crosshair.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/series/points/base_point.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_base_point.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/series/points/base_point.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_base_point.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/series/base_series.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_base_series.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/series/base_series.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_base_series.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/core/series_family.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_series_family.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/core/series_family.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_series_family.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/core/loading_indicator.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_loading_indicator.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/core/loading_indicator.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_loading_indicator.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/core/localization/ldml/date.parser.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/date_parser.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/core/localization/ldml/dateParserModule.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/date_parser.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/common/core/localization/ldml/date.parser.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/date_parser.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/series/points/label.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_series_label.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/series/points/label.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_series_label.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/common/core/events/visibility_change.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/visibility_change.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/events/m_visibility_change.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/visibility_change.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/core/errors.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/core_errors.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/ui/widget/ui.errors.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/ui_errors.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/translators/range.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_range.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/translators/range.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_range.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/translators/translator1d.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_translator1d.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/translators/translator1d.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_translator1d.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/core/plaque.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_plaque.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/core/plaque.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_plaque.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/range_selector/tracker.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_rs_tracker.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/range_selector/tracker.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_rs_tracker.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/range_selector/series_data_source.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_rs_series_data_source.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/range_selector/series_data_source.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_rs_series_data_source.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/range_selector/sliders_controller.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_rs_sliders_controller.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/range_selector/sliders_controller.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_rs_sliders_controller.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/core/m_template_manager.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/template_manager.js',
  },

  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/projection.main.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_projection_main.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/vector_map/projection.main.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_projection_main.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/control_bar/control_bar.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_control_bar.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/vector_map/control_bar/control_bar.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_control_bar.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/gesture_handler.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_gesture_handler.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/vector_map/gesture_handler.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_gesture_handler.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/tracker.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_tracker.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/vector_map/tracker.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_tracker.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/data_exchanger.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_data_exchanger.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/vector_map/data_exchanger.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_data_exchanger.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/legend.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_legend.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/vector_map/legend.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_legend.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/layout.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_layout.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/vector_map/layout.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_layout.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/map_layer.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_map_layer.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/vector_map/map_layer.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_map_layer.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/tooltip_viewer.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_tooltip_viewer.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/viz/vector_map/tooltip_viewer.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_tooltip_viewer.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/paletteModule.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_paletteModule.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/palette.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_paletteModule.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/ui/themes.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/themes.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/ui/themes.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/themes.js',
  },
];

function findMutableArtifactFacade(relativeUrlPath: string): string | null {
  const normalized = relativeUrlPath.split(path.sep).join('/');
  const withLeadingSlash = normalized.startsWith('/') ? normalized : `/${normalized}`;
  const match = MUTABLE_ARTIFACT_FACADES.find((entry) => withLeadingSlash.endsWith(entry.suffix)
    || normalized.endsWith(entry.suffix.replace(/^\//, '')));
  return match?.shimUrl ?? null;
}

function sendMutableFacadeModule(res: ServerResponse, shimUrl: string): boolean {
  // Serve a re-export at the artifact URL so relative library imports and
  // bare import-map entries share the same shim module graph.
  const body = `export * from '${shimUrl}';\nexport { default } from '${shimUrl}';\n`;
  const buffer = Buffer.from(body, 'utf8');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Content-Length', String(buffer.length));
  res.end(buffer);
  return true;
}

/**
 * Convert leftover `exports.foo = …` (from #DEBUG / dual CJS-ESM sources)
 * into native ESM exports so the browser does not throw "exports is not defined".
 */
function rewriteLegacyCjsExportsInEsmArtifact(source: string): string {
  if (!/\bexports\./.test(source)) {
    return source;
  }

  let next = source;

  // exports.name = name;  /  exports.alias = name;
  next = next.replace(
    /^exports\.([A-Za-z_$][\w$]*)\s*=\s*([A-Za-z_$][\w$]*);?\s*$/gm,
    (_match, exportName: string, valueName: string) => (exportName === valueName
      ? `export { ${exportName} };`
      : `export { ${valueName} as ${exportName} };`),
  );

  // exports.name = function (
  next = next.replace(
    /^exports\.([A-Za-z_$][\w$]*)\s*=\s*function\s*\(/gm,
    'export function $1(',
  );

  // exports.name = async function (
  next = next.replace(
    /^exports\.([A-Za-z_$][\w$]*)\s*=\s*async\s+function\s*\(/gm,
    'export async function $1(',
  );

  return next;
}

/**
 * ESM npm artifacts are built with removeDebug:true, which strips QUnit-only
 * hooks. Re-attach the ones still present as locals in the compiled module.
 *
 * When debug is kept (`-c qunit`), some sources still emit CJS `exports.*`
 * assignments that throw under native ESM — rewrite those to ESM exports.
 */
function restoreEsmDebugTestHooks(relativeUrlPath: string, source: string): string {
  const normalized = relativeUrlPath.split(path.sep).join('/');
  if (!normalized.includes('/artifacts/transpiled-esm-npm/esm/')) {
    return source;
  }

  let next = source;

  if (normalized.endsWith('/__internal/events/core/m_events_engine.js')
    && !next.includes('eventsEngine.detectPassiveEventHandlersSupport')) {
    next = next.replace(
      /eventsEngine\.passiveEventHandlersSupported\s*=\s*passiveEventHandlersSupported;/,
      'eventsEngine.passiveEventHandlersSupported = passiveEventHandlersSupported;\n'
      + 'eventsEngine.elementDataMap = elementDataMap;\n'
      + 'eventsEngine.detectPassiveEventHandlersSupport = detectPassiveEventHandlersSupport;',
    );
  }

  return rewriteLegacyCjsExportsInEsmArtifact(next);
}

function sendEsmArtifactJs(
  res: ServerResponse,
  filePath: string,
  relativeUrlPath: string,
): boolean {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    let body = restoreEsmDebugTestHooks(relativeUrlPath, raw);
    body = rewriteAspnetArtifactToEsm(body, relativeUrlPath);
    if (body === raw) {
      return sendStaticFile(res, filePath, fs.statSync(filePath).size);
    }
    const buffer = Buffer.from(body, 'utf8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Content-Length', String(buffer.length));
    res.end(buffer);
    return true;
  } catch {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Failed to serve ESM artifact');
    return true;
  }
}

/** Rewrite CJS require/exports and default imports for QUnit tests/helpers. */
function sendTestHelperJs(res: ServerResponse, filePath: string, relativeUrlPath: string): boolean {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const body = rewriteQunitTestHelperSource(raw, relativeUrlPath);
    const buffer = Buffer.from(body, 'utf8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Content-Length', String(buffer.length));
    res.end(buffer);
    return true;
  } catch {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Failed to rewrite CJS-style test/helper module');
    return true;
  }
}

function sendDirectoryListing(
  res: ServerResponse,
  requestPath: string,
  dirPath: string,
  escapeHtml: (value: string) => string,
): boolean {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const pathname = requestPath.endsWith('/') ? requestPath : `${requestPath}/`;

  const items: string[] = [];

  if (pathname !== '/') {
    const parentPath = pathname
      .split('/')
      .filter(Boolean)
      .slice(0, -1)
      .join('/');
    const href = parentPath ? `/${parentPath}/` : '/';
    items.push(`<li><a href="${escapeHtml(href)}">..</a></li>`);
  }

  entries
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((entry) => {
      const suffix = entry.isDirectory() ? '/' : '';
      const href = `${pathname}${encodeURIComponent(entry.name)}${suffix}`;
      items.push(`<li><a href="${escapeHtml(href)}">${escapeHtml(entry.name)}${suffix}</a></li>`);
    });

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Index of ${escapeHtml(pathname)}</title>
</head>
<body>
<h1>Index of ${escapeHtml(pathname)}</h1>
<ul>
${items.join('\n')}
</ul>
</body>
</html>`;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);

  return true;
}

export function createStaticFileService({
  escapeHtml,
  rootDirectory,
  setNoCacheHeaders,
  setStaticCacheHeaders,
}: StaticFileServiceDeps): StaticFileService {
  function tryServeStatic(
    _req: IncomingMessage,
    res: ServerResponse,
    pathname: string,
    searchParams: URLSearchParams,
  ): boolean {
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    const relativePath = normalizedPath.replace(/^\/+/, '');
    const filePath = path.resolve(path.join(rootDirectory, relativePath));
    const relativeToRoot = path.relative(rootDirectory, filePath);

    if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
      setNoCacheHeaders(res);
      res.statusCode = 403;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Forbidden');
      return true;
    }

    const resolvedFilePath = resolveStaticFilePath(filePath);

    if (!resolvedFilePath) {
      return false;
    }

    setStaticCacheHeaders(res, searchParams);

    const stat = fs.statSync(resolvedFilePath);

    if (stat.isDirectory()) {
      return sendDirectoryListing(res, pathname, resolvedFilePath, escapeHtml);
    }

    if (stat.isFile()) {
      if (searchParams.has('esm-export') && path.extname(resolvedFilePath).toLowerCase() === '.json') {
        return sendJsonAsEsmModule(res, resolvedFilePath);
      }

      // Native ESM resolves relative imports against the request URL, not the
      // on-disk file. If we silently serve `foo.js` / `foo/index.js` for
      // extensionless `foo`, `../` chains break without a redirect to the real file URL.
      // Redirect to the canonical file URL so the browser base path is correct.
      const resolvedUrlPath = `/${path.relative(rootDirectory, resolvedFilePath)
        .split(path.sep)
        .join('/')}`;
      if (resolvedUrlPath !== normalizedPath) {
        const query = searchParams.toString();
        res.statusCode = 302;
        res.setHeader('Location', query ? `${resolvedUrlPath}?${query}` : resolvedUrlPath);
        res.end();
        return true;
      }

      const relativeUrlPath = relativeToRoot.split(path.sep).join('/');
      if (
        path.extname(resolvedFilePath).toLowerCase() === '.js'
        && isQunitTestOrHelperPath(relativeUrlPath)
      ) {
        return sendTestHelperJs(res, resolvedFilePath, relativeUrlPath);
      }

      // Relative library imports bypass import maps — serve mutable facades
      // at the artifact URL unless ?dx-original=1 (used by the shim itself).
      if (!searchParams.has('dx-original')) {
        const shimUrl = findMutableArtifactFacade(relativeUrlPath);
        if (shimUrl) {
          return sendMutableFacadeModule(res, shimUrl);
        }
      }

      if (
        path.extname(resolvedFilePath).toLowerCase() === '.js'
        && (
          isWebpackVendorBundlePath(relativeUrlPath)
          || isGlobalizeOrCldrVendorPath(relativeUrlPath)
          || isVectorMapDataPath(relativeUrlPath)
        )
      ) {
        return sendWebpackVendorAsEsm(res, resolvedFilePath, relativeUrlPath);
      }

      if (
        path.extname(resolvedFilePath).toLowerCase() === '.js'
        && relativeUrlPath.split(path.sep).join('/').includes('/artifacts/transpiled-esm-npm/esm/')
      ) {
        return sendEsmArtifactJs(res, resolvedFilePath, relativeUrlPath);
      }

      return sendStaticFile(res, resolvedFilePath, stat.size);
    }

    return false;
  }

  return {
    tryServeStatic,
  };
}
