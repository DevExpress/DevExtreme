import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MUTABLE_FACADE_HELPER_URL = '/packages/devextreme/testing/helpers/esm-shims/mutable_facade.js';

const NAMESPACE_DEFAULT_RE = /import\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"]\s*;?\s*export\s+default\s+\1\s*;?/;

export interface AutoMutableFacadeEntry {
  /** Workspace-relative path to the real implementation module (no leading slash). */
  internalRelativePath: string;
  /** Named exports forwarded with wrapCtor (ctors / replaceable functions). */
  wrapExportNames: string[];
  /** Named exports re-exported as call/value forwards (DEBUG_set_*, plugin, …). */
  forwardExportNames: string[];
  globalKey: string;
}

const facadeIndex = new Map<string, AutoMutableFacadeEntry>();
let indexBuiltForRoot: string | null = null;

function normalizeUrlPath(relativeUrlPath: string): string {
  return relativeUrlPath.replace(/\\/g, '/').replace(/^\/+/, '');
}

function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

/**
 * Pure re-export used by viz public entries:
 *   import * as X from '...';
 *   export default X;
 */
export function parseNamespaceDefaultReexport(
  source: string,
): { binding: string; from: string } | null {
  const cleaned = stripComments(source).trim();
  const match = NAMESPACE_DEFAULT_RE.exec(cleaned);
  if (!match) {
    return null;
  }

  const remainder = cleaned.replace(match[0], '').trim();
  if (remainder.length > 0) {
    return null;
  }

  const [, binding, from] = match;
  return { binding, from };
}

function addNamedExportFromClause(names: Set<string>, part: string): void {
  const bit = part.trim();
  if (!bit || bit === 'default') {
    return;
  }

  const aliased = /^[A-Za-z_$][\w$]*\s+as\s+([A-Za-z_$][\w$]*)$/.exec(bit);
  if (aliased) {
    names.add(aliased[1]);
    return;
  }

  const plain = /^([A-Za-z_$][\w$]*)$/.exec(bit);
  if (plain) {
    names.add(plain[1]);
  }
}

export function collectEsmExportNames(source: string): string[] {
  const names = new Set<string>();

  for (const match of source.matchAll(
    /export\s+(?:async\s+)?(?:function\s*\*?|class|const|let|var)\s+([A-Za-z_$][\w$]*)/g,
  )) {
    names.add(match[1]);
  }

  for (const match of source.matchAll(/export\s*\{([^}]+)\}/g)) {
    match[1].split(',').forEach((part) => {
      addNamedExportFromClause(names, part);
    });
  }

  // Pre-rewrite DEBUG / dual CJS leftovers still present on disk
  for (const match of source.matchAll(/\bexports\.([A-Za-z_$][\w$]*)\s*=/g)) {
    names.add(match[1]);
  }

  names.delete('default');
  return [...names].sort();
}

function resolveImportSpecifier(
  fromFilePath: string,
  specifier: string,
  workspaceRoot: string,
): string | null {
  const esmRoot = path.join(
    workspaceRoot,
    'packages/devextreme/artifacts/transpiled-esm-npm/esm',
  );

  const candidate = specifier.startsWith('.')
    ? path.resolve(path.dirname(fromFilePath), specifier)
    : path.join(esmRoot, specifier);

  const withJs = candidate.endsWith('.js') ? candidate : `${candidate}.js`;
  if (fs.existsSync(withJs) && fs.statSync(withJs).isFile()) {
    return withJs;
  }
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }
  const indexJs = path.join(candidate, 'index.js');
  if (fs.existsSync(indexJs) && fs.statSync(indexJs).isFile()) {
    return indexJs;
  }
  return null;
}

function toWorkspaceRelativePath(workspaceRoot: string, absolutePath: string): string {
  return path.relative(workspaceRoot, absolutePath).split(path.sep).join('/');
}

function buildGlobalKey(internalRelativePath: string): string {
  const digest = crypto
    .createHash('sha1')
    .update(internalRelativePath)
    .digest('hex')
    .slice(0, 16);
  const hint = internalRelativePath
    .replace(/^packages\/devextreme\/artifacts\/transpiled-esm-npm\/esm\//, '')
    .replace(/\.js$/, '')
    .replace(/[^\w]+/g, '_')
    .slice(-48);
  return `__dxAutoMutable_${hint}_${digest}`;
}

function buildDebugSets(
  wrapExportNames: string[],
  forwardExportNames: string[],
): Record<string, string> {
  const debugSets: Record<string, string> = {};
  for (const name of [...wrapExportNames, ...forwardExportNames]) {
    const match = /^DEBUG_set_(.+)$/.exec(name);
    if (match) {
      const [, propName] = match;
      debugSets[name] = propName;
    }
  }
  return debugSets;
}

function isFunctionLikeExport(name: string, internalSource: string): boolean {
  const functionOrClassPattern = new RegExp(
    `export\\s+(?:async\\s+)?(?:function\\s*\\*?|class)\\s+${name}\\b`,
  );
  const assigned = new RegExp(
    `export\\s+(?:const|let|var)\\s+${name}\\s*=\\s*(?:async\\s+)?function\\b`,
  );
  const cjsAssigned = new RegExp(
    `exports\\.${name}\\s*=\\s*(?:async\\s+)?function\\b`,
  );
  return functionOrClassPattern.test(internalSource)
    || assigned.test(internalSource)
    || cjsAssigned.test(internalSource);
}

function classifyExportNames(
  exportNames: string[],
  internalSource: string,
): { wrapExportNames: string[]; forwardExportNames: string[] } {
  const wrapExportNames: string[] = [];
  const forwardExportNames: string[] = [];

  exportNames.forEach((name) => {
    if (name.startsWith('DEBUG_set_')) {
      forwardExportNames.push(name);
      return;
    }

    const isPascalCase = /^[A-Z]/.test(name);
    // `_TESTS_Engine` / `_TESTS_Legend` — ctor aliases; wrapCtor.
    // `_TESTS_dataKey` — mutable scalar; must stay a live value (not a wrapper).
    const isTestCtorAlias = /^_TESTS_[A-Z]/.test(name);
    const isTestStubHelper = /_TESTS_.*stub|_stub_/i.test(name);
    const wrap = isPascalCase
      || isTestCtorAlias
      || isTestStubHelper
      || isFunctionLikeExport(name, internalSource);

    if (wrap) {
      wrapExportNames.push(name);
    } else {
      forwardExportNames.push(name);
    }
  });

  return { wrapExportNames, forwardExportNames };
}

export function generateAutoMutableFacadeSource(entry: AutoMutableFacadeEntry): string {
  const originalUrl = `/${entry.internalRelativePath}?dx-original=1`;
  const debugSets = buildDebugSets(entry.wrapExportNames, entry.forwardExportNames);
  const debugSetsLiteral = JSON.stringify(debugSets);

  const liveValueNames = entry.forwardExportNames.filter((name) => !name.startsWith('DEBUG_set_'));

  const exportLines = [
    ...entry.wrapExportNames.map(
      (name) => `export const ${name} = wrapCtor(api, '${name}');`,
    ),
    ...entry.forwardExportNames.map((name) => {
      if (name.startsWith('DEBUG_set_')) {
        return `export const ${name} = (...args) => api.${name}(...args);`;
      }
      // Live re-export: mutable DEBUG values (e.g. _TESTS_dataKey) change after init.
      return `export { ${name} } from '${originalUrl}';`;
    }),
  ];

  const liveApiBindings = liveValueNames.map(
    (name) => [
      `Object.defineProperty(api, '${name}', {`,
      '  configurable: true,',
      '  enumerable: true,',
      `  get: () => original.${name},`,
      '});',
    ].join('\n'),
  );

  return [
    '/* auto-generated mutable facade for QUnit (namespace-default reexport) */',
    `import * as original from '${originalUrl}';`,
    `import { createMutableApi, wrapCtor } from '${MUTABLE_FACADE_HELPER_URL}';`,
    '',
    `const api = createMutableApi(original, '${entry.globalKey}', ${debugSetsLiteral});`,
    ...liveApiBindings,
    '',
    ...exportLines,
    'export default api;',
    '',
  ].join('\n');
}

function registerFacadePaths(
  publicRelativePath: string,
  entry: AutoMutableFacadeEntry,
): void {
  facadeIndex.set(normalizeUrlPath(publicRelativePath), entry);
  facadeIndex.set(normalizeUrlPath(entry.internalRelativePath), entry);
}

function readTextFileOrNull(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function tryRegisterNamespaceDefaultFile(
  workspaceRoot: string,
  absoluteFilePath: string,
): AutoMutableFacadeEntry | null {
  const source = readTextFileOrNull(absoluteFilePath);
  if (source === null) {
    return null;
  }

  const parsed = parseNamespaceDefaultReexport(source);
  if (!parsed) {
    return null;
  }

  const internalAbsolute = resolveImportSpecifier(
    absoluteFilePath,
    parsed.from,
    workspaceRoot,
  );
  if (!internalAbsolute) {
    return null;
  }

  const internalSource = readTextFileOrNull(internalAbsolute);
  if (internalSource === null) {
    return null;
  }

  const exportNames = collectEsmExportNames(internalSource);
  const { wrapExportNames, forwardExportNames } = classifyExportNames(
    exportNames,
    internalSource,
  );
  const internalRelativePath = toWorkspaceRelativePath(workspaceRoot, internalAbsolute);
  const publicRelativePath = toWorkspaceRelativePath(workspaceRoot, absoluteFilePath);
  const entry: AutoMutableFacadeEntry = {
    internalRelativePath,
    wrapExportNames,
    forwardExportNames,
    globalKey: buildGlobalKey(internalRelativePath),
  };

  registerFacadePaths(publicRelativePath, entry);
  return entry;
}

function walkJsFiles(dir: string, acc: string[] = []): string[] {
  if (!fs.existsSync(dir)) {
    return acc;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkJsFiles(full, acc);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      acc.push(full);
    }
  }
  return acc;
}

function isSmallPublicReexportCandidate(filePath: string): boolean {
  try {
    return fs.statSync(filePath).size <= 2000;
  } catch {
    return false;
  }
}

export function ensureAutoMutableFacadeIndex(workspaceRoot: string): void {
  if (indexBuiltForRoot === workspaceRoot) {
    return;
  }

  facadeIndex.clear();
  const vizRoot = path.join(
    workspaceRoot,
    'packages/devextreme/artifacts/transpiled-esm-npm/esm/viz',
  );

  walkJsFiles(vizRoot)
    .filter((filePath) => isSmallPublicReexportCandidate(filePath))
    .forEach((filePath) => {
      tryRegisterNamespaceDefaultFile(workspaceRoot, filePath);
    });

  indexBuiltForRoot = workspaceRoot;
}

/**
 * Returns generated facade source for a namespace-default public entry
 * (and its resolved __internal target), or null when not applicable.
 */
export function tryBuildAutoMutableFacade(
  relativeUrlPath: string,
  absoluteFilePath: string,
  workspaceRoot: string,
): string | null {
  ensureAutoMutableFacadeIndex(workspaceRoot);

  const normalized = normalizeUrlPath(relativeUrlPath);
  let entry = facadeIndex.get(normalized);

  if (!entry) {
    // On-demand for files outside the viz scan / newly written artifacts
    const registered = tryRegisterNamespaceDefaultFile(workspaceRoot, absoluteFilePath);
    if (!registered) {
      return null;
    }
    entry = registered;
  }

  return generateAutoMutableFacadeSource(entry);
}

/** Test helper: reset in-memory index. */
export function resetAutoMutableFacadeIndexForTests(): void {
  facadeIndex.clear();
  indexBuiltForRoot = null;
}
