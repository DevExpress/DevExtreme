import * as fs from 'node:fs';
import { IncomingMessage, ServerResponse } from 'node:http';
import * as path from 'node:path';

import {
  isQunitTestOrHelperPath,
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
 * bare import-map entries (Renderer / Axis stubbing under native ESM).
 */
const MUTABLE_ARTIFACT_FACADES: readonly { suffix: string; shimUrl: string }[] = [
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/core/renderers/renderer.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_renderer.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/viz/axes/base_axis.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/viz_base_axis.js',
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

/** Rewrite CJS require/exports and default imports for QUnit tests/helpers. */
function sendTestHelperJs(res: ServerResponse, filePath: string): boolean {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const body = rewriteQunitTestHelperSource(raw);
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
        return sendTestHelperJs(res, resolvedFilePath);
      }

      // Relative library imports bypass import maps — serve mutable facades
      // at the artifact URL unless ?dx-original=1 (used by the shim itself).
      if (!searchParams.has('dx-original')) {
        const shimUrl = findMutableArtifactFacade(relativeUrlPath);
        if (shimUrl) {
          return sendMutableFacadeModule(res, shimUrl);
        }
      }

      return sendStaticFile(res, resolvedFilePath, stat.size);
    }

    return false;
  }

  return {
    tryServeStatic,
  };
}
