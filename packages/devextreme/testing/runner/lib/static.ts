import * as fs from 'node:fs';
import { IncomingMessage, ServerResponse } from 'node:http';
import * as path from 'node:path';

import {
  isQunitTestOrHelperPath,
  rewriteAspnetArtifactToEsm,
  rewriteQunitTestHelperSource,
} from './cjsInterop';
import { findHandWrittenShim } from './handWrittenShims';
import { setNoCacheHeaders as applyNoCacheHeaders } from './http';

interface StaticFileServiceDeps {
  escapeHtml: (value: string) => string;
  rootDirectory: string;
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

const CONTENT_TYPES: Readonly<Record<string, string>> = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'text/xml; charset=utf-8',
  '.xsl': 'text/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.log': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.map': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
};

const JS_CONTENT_TYPE = 'application/javascript; charset=utf-8';
const ESM_ARTIFACT_MARKER = '/artifacts/transpiled-esm-npm/esm/';

function normalizeUrlPath(filePath: string): string {
  return filePath.split(path.sep).join('/');
}

function getContentType(filePath: string): string {
  return CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream';
}

function sendError(res: ServerResponse, statusCode: number, message: string): boolean {
  // Always override any prior Cache-Control (e.g. DX_HTTP_CACHE year-long
  // headers set before a transform/read failure).
  applyNoCacheHeaders(res);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(message);
  return true;
}

function sendJsModuleBody(res: ServerResponse, body: string): boolean {
  const buffer = Buffer.from(body, 'utf8');
  res.statusCode = 200;
  res.setHeader('Content-Type', JS_CONTENT_TYPE);
  res.setHeader('Content-Length', String(buffer.length));
  res.end(buffer);
  return true;
}

function sendTransformedJs(
  res: ServerResponse,
  filePath: string,
  transform: (raw: string) => string,
  errorMessage: string,
): boolean {
  try {
    return sendJsModuleBody(res, transform(fs.readFileSync(filePath, 'utf8')));
  } catch {
    return sendError(res, 500, errorMessage);
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

  for (const candidate of [`${filePath}.js`, `${filePath}.mjs`, path.join(filePath, 'index.js')]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return fs.existsSync(filePath) ? filePath : null;
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

// --- Vendor / UMD → ESM wrappers ------------------------------------------------

const ESM_DEFAULT_FROM_CJS = `const __dxVendorExport = module.exports && module.exports.__esModule
  && Object.prototype.hasOwnProperty.call(module.exports, 'default')
  ? module.exports.default
  : module.exports;
export default __dxVendorExport;
`;

function forceVendorGlobalThis(source: string): string {
  return source.replace(/}\(\s*this\s*,/g, '}(globalThis,');
}

function wrapVendorCjsBranch(
  source: string,
  options: {
    preamble?: string;
    requireShim?: string;
    exportsInit?: string;
    trailing?: string;
    rewriteThis?: boolean;
  } = {},
): string {
  const {
    preamble = '',
    requireShim = '',
    exportsInit = '{}',
    trailing = ESM_DEFAULT_FROM_CJS,
    rewriteThis = true,
  } = options;

  const vendorSource = rewriteThis ? forceVendorGlobalThis(source) : source;

  return [
    preamble,
    preamble ? '\n' : '',
    `const module = { exports: ${exportsInit} };\n`,
    'const exports = module.exports;\n',
    'var define;\n',
    requireShim,
    vendorSource,
    '\n',
    trailing,
  ].join('');
}

/**
 * `intl/dist/Intl.complete.js` appends locale data that expects a free
 * `IntlPolyfill` binding from the UMD *browser* branch. Forcing CJS breaks
 * that, so keep the global branch and re-export the polyfill.
 */
function wrapIntlVendorAsEsm(source: string): string {
  return 'var define;\n'
    + 'var IntlPolyfill;\n'
    + `${source
      .replace(/}\(this,/g, '}(globalThis,')
      .replace(/e\.IntlPolyfill=r\(\)/g, 'e.IntlPolyfill=IntlPolyfill=r()')}\n`
    + 'export default IntlPolyfill;\n';
}

/**
 * Force the CJS branch of a UMD wrapper and re-export `module.exports` as default.
 * Also emit synthetic named exports from the webpack entry module so
 * `import Def, * as Ns from 'pkg'` gets CJS-style interop
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

  return wrapVendorCjsBranch(source, {
    rewriteThis: false,
    trailing: `${ESM_DEFAULT_FROM_CJS}${namedExports ? `${namedExports}\n` : ''}`,
  });
}

/** globalize / cldrjs ship as UMD; native ESM needs a CJS-branch + require shim. */
function wrapGlobalizeOrCldrAsEsm(source: string, relativeUrlPath: string): string {
  const normalized = normalizeUrlPath(relativeUrlPath);
  const isCldrMain = normalized.endsWith('/cldrjs/dist/cldr.js');
  const isCldrPlugin = /\/cldrjs\/dist\/cldr\/[^/]+\.js$/i.test(normalized);
  const isGlobalizeMain = normalized.endsWith('/globalize/dist/globalize.js');
  const isGlobalizePlugin = normalized.includes('/globalize/dist/globalize/');
  const baseName = path.basename(normalized, '.js');
  const needsNumber = isGlobalizePlugin && (baseName === 'currency' || baseName === 'date');

  const preamble: string[] = [];
  if (isCldrPlugin) {
    preamble.push('import __dxCldr from \'cldr\';');
  } else if (isGlobalizeMain || isGlobalizePlugin) {
    preamble.push('import __dxCldr from \'cldr\';');
    preamble.push('import \'cldr/event\';');
    if (isGlobalizePlugin) {
      preamble.push('import \'cldr/supplemental\';');
      preamble.push('import __dxGlobalize from \'globalize\';');
      if (needsNumber) {
        // CJS factory skips `./number`; AMD/DevExtreme always load it first.
        preamble.push('import \'./number.js\';');
      }
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

  return wrapVendorCjsBranch(source, {
    preamble: preamble.join('\n'),
    requireShim,
  });
}

/**
 * Vector map geo data UMD: CJS writes into `exports`, browser branch expects
 * bare `DevExpress`. Under ESM imports hoist above suite setup, so create the
 * global sources bag and point `module.exports` at the same object.
 */
function wrapVectorMapDataAsEsm(source: string): string {
  return wrapVendorCjsBranch(source, {
    preamble: [
      'globalThis.DevExpress = globalThis.DevExpress || {};',
      'globalThis.DevExpress.viz = globalThis.DevExpress.viz || {};',
      'globalThis.DevExpress.viz.map = globalThis.DevExpress.viz.map || {};',
      'globalThis.DevExpress.viz.map.sources = globalThis.DevExpress.viz.map.sources || {};',
    ].join('\n'),
    exportsInit: 'globalThis.DevExpress.viz.map.sources',
    trailing: 'export default module.exports;\n',
  });
}

/** `dx.vectormaputils.js` is UMD (`exports.parse = …`); tests do `import { parse }`. */
function wrapVectorMapUtilsAsEsm(source: string): string {
  return wrapVendorCjsBranch(source, {
    rewriteThis: false,
    trailing: 'export default module.exports;\nexport const parse = module.exports.parse;\n',
  });
}

type VendorWrapper = (source: string, relativeUrlPath: string) => string;

function resolveVendorEsmWrapper(relativeUrlPath: string): VendorWrapper | null {
  const normalized = normalizeUrlPath(relativeUrlPath);

  if (
    normalized.endsWith('/intl/dist/Intl.complete.js')
    || normalized.endsWith('/intl/dist/Intl.js')
  ) {
    return (source) => wrapIntlVendorAsEsm(source);
  }

  if (
    normalized.endsWith('/globalize/dist/globalize.js')
    || normalized.includes('/globalize/dist/globalize/')
    || normalized.endsWith('/cldrjs/dist/cldr.js')
    || /\/cldrjs\/dist\/cldr\/[^/]+\.js$/i.test(normalized)
  ) {
    return wrapGlobalizeOrCldrAsEsm;
  }

  if (/\/artifacts\/js\/vectormap-data\/[^/]+\.js$/i.test(normalized)) {
    return (source) => wrapVectorMapDataAsEsm(source);
  }

  if (/\/artifacts\/js\/vectormap-utils\/dx\.vectormaputils\.js$/i.test(normalized)) {
    return (source) => wrapVectorMapUtilsAsEsm(source);
  }

  if (
    normalized.endsWith('/devextreme-quill/dist/dx-quill.js')
    || normalized.endsWith('/artifacts/js/dx-diagram.js')
    || normalized.endsWith('/artifacts/js/dx-gantt.js')
    || normalized.endsWith('/artifacts/js/dx-exceljs-fork.js')
    || normalized.endsWith('/artifacts/js/jszip.js')
  ) {
    return (source) => wrapWebpackVendorAsEsm(source);
  }

  return null;
}

/** Serve JSON as `export default …` for native ESM (`*.json!` replacement). */
function sendJsonAsEsmModule(res: ServerResponse, filePath: string): boolean {
  return sendTransformedJs(
    res,
    filePath,
    (raw) => {
      JSON.parse(raw);
      return `export default ${raw};\n`;
    },
    'Failed to export JSON as ESM module',
  );
}

// --- Mutable artifact facades ---------------------------------------------------

function sendShimModule(res: ServerResponse, shimUrl: string): boolean {
  // Serve a re-export at the artifact URL so relative library imports and
  // bare import-map entries share the same shim module graph.
  return sendJsModuleBody(
    res,
    `export * from '${shimUrl}';\nexport { default } from '${shimUrl}';\n`,
  );
}

// --- ESM artifact tweaks --------------------------------------------------------

/**
 * Convert leftover `exports.foo = …` (from #DEBUG / dual CJS-ESM sources)
 * into native ESM exports so the browser does not throw "exports is not defined".
 */
function rewriteLegacyCjsExportsInEsmArtifact(source: string): string {
  if (!/\bexports\./.test(source)) {
    return source;
  }

  return source
    .replace(
      /^exports\.([A-Za-z_$][\w$]*)\s*=\s*([A-Za-z_$][\w$]*);?\s*$/gm,
      (_match, exportName: string, valueName: string) => (exportName === valueName
        ? `export { ${exportName} };`
        : `export { ${valueName} as ${exportName} };`),
    )
    .replace(
      /^exports\.([A-Za-z_$][\w$]*)\s*=\s*function\s*\(/gm,
      'export function $1(',
    )
    .replace(
      /^exports\.([A-Za-z_$][\w$]*)\s*=\s*async\s+function\s*\(/gm,
      'export async function $1(',
    );
}

/**
 * ESM npm artifacts are built with removeDebug:true, which strips QUnit-only
 * hooks. Re-attach the ones still present as locals in the compiled module.
 *
 * When debug is kept (`-c qunit`), some sources still emit CJS `exports.*`
 * assignments that throw under native ESM — rewrite those to ESM exports.
 */
function restoreEsmDebugTestHooks(relativeUrlPath: string, source: string): string {
  const normalized = normalizeUrlPath(relativeUrlPath);
  if (!normalized.includes(ESM_ARTIFACT_MARKER)) {
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
    return sendJsModuleBody(res, body);
  } catch {
    return sendError(res, 500, 'Failed to serve ESM artifact');
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
      return sendError(res, 403, 'Forbidden');
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

    if (!stat.isFile()) {
      return false;
    }

    if (searchParams.has('esm-export') && path.extname(resolvedFilePath).toLowerCase() === '.json') {
      return sendJsonAsEsmModule(res, resolvedFilePath);
    }

    // Native ESM resolves relative imports against the request URL, not the
    // on-disk file. Redirect extensionless URLs to the canonical file URL.
    const resolvedUrlPath = `/${normalizeUrlPath(path.relative(rootDirectory, resolvedFilePath))}`;
    if (resolvedUrlPath !== normalizedPath) {
      const query = searchParams.toString();
      res.statusCode = 302;
      res.setHeader('Location', query ? `${resolvedUrlPath}?${query}` : resolvedUrlPath);
      res.end();
      return true;
    }

    const relativeUrlPath = normalizeUrlPath(relativeToRoot);
    const isJs = path.extname(resolvedFilePath).toLowerCase() === '.js';

    if (isJs && isQunitTestOrHelperPath(relativeUrlPath)) {
      return sendTransformedJs(
        res,
        resolvedFilePath,
        (raw) => rewriteQunitTestHelperSource(raw, relativeUrlPath),
        'Failed to rewrite CJS-style test/helper module',
      );
    }

    // Relative library imports bypass import maps, so hand-written shims are
    // also served at the artifact URL to keep one module instance.
    const shimUrl = findHandWrittenShim(relativeUrlPath);
    if (shimUrl) {
      return sendShimModule(res, shimUrl);
    }

    if (isJs) {
      const vendorWrapper = resolveVendorEsmWrapper(relativeUrlPath);
      if (vendorWrapper) {
        return sendTransformedJs(
          res,
          resolvedFilePath,
          (raw) => vendorWrapper(raw, relativeUrlPath),
          'Failed to wrap vendor bundle as ESM',
        );
      }

      if (relativeUrlPath.includes(ESM_ARTIFACT_MARKER)) {
        return sendEsmArtifactJs(res, resolvedFilePath, relativeUrlPath);
      }
    }

    return sendStaticFile(res, resolvedFilePath, stat.size);
  }

  return {
    tryServeStatic,
  };
}
