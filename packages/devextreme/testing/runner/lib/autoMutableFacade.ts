import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';

import {
  MUTABLE_MODULE_GROUPS,
  type MutableModuleGroup,
} from './mutableModuleGroups';

export type { MutableModuleGroup };
export { MUTABLE_MODULE_GROUPS };

const MUTABLE_FACADE_HELPER_URL = '/packages/devextreme/testing/helpers/esm-shims/mutable_facade.js';
const ESM_ARTIFACT_PREFIX = 'packages/devextreme/artifacts/transpiled-esm-npm/esm/';

const NAMESPACE_DEFAULT_RE = /import\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"]\s*;?\s*export\s+default\s+\1\s*;?/;

/** JS keywords / reserved that cannot be a bare `export const name`. */
const RESERVED_EXPORT_NAMES = new Set([
  'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
  'delete', 'do', 'else', 'enum', 'export', 'extends', 'false', 'finally',
  'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'null',
  'return', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof',
  'var', 'void', 'while', 'with', 'yield', 'await', 'let', 'static',
  'implements', 'interface', 'package', 'private', 'protected', 'public',
]);

interface AutoMutableFacadeEntry {
  /** Workspace-relative path to the real implementation module (no leading slash). */
  internalRelativePath: string;
  /** Named exports forwarded with wrapCtor (ctors / replaceable functions). */
  wrapExportNames: string[];
  /** Named exports re-exported as call/value forwards (setters, scalars, …). */
  forwardExportNames: string[];
  globalKey: string;
  /**
   * Build `api` from `namespace.default ?? namespace` (default export is the
   * stub target object — errors, format_helper, visibility_change, …).
   */
  apiFromDefault?: boolean;
}

/** Hand-written shims that stay (custom composition / non-generic). */
const HAND_WRITTEN_ESM_FACADES: readonly { esmPath: string; shimUrl: string }[] = [
  {
    esmPath: '__internal/ui/themes.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/themes.js',
  },
  {
    esmPath: 'ui/themes.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/themes.js',
  },
];

/** Index keys are ESM-relative (`__internal/viz/…`, `exporter.js`, …). */
const facadeIndex = new Map<string, AutoMutableFacadeEntry>();
let indexBuiltForRoot: string | null = null;

function normalizeUrlPath(relativeUrlPath: string): string {
  return relativeUrlPath.replace(/\\/g, '/').replace(/^\/+/, '');
}

function stripJs(filePath: string): string {
  return filePath.endsWith('.js') ? filePath.slice(0, -3) : filePath;
}

function groupArtifacts(group: MutableModuleGroup): readonly string[] {
  return group.also ? [group.internal, ...group.also] : [group.internal];
}

function groupImportMapKeys(group: MutableModuleGroup): string[] {
  const keys = new Set<string>();
  for (const artifact of groupArtifacts(group)) {
    keys.add(stripJs(artifact));
  }
  for (const key of group.extraKeys ?? []) {
    keys.add(key);
  }
  return [...keys];
}

function artifactForImportMapKey(group: MutableModuleGroup, key: string): string {
  const match = groupArtifacts(group).find(
    (item) => item === key || item === `${key}.js` || stripJs(item) === key,
  ) ?? group.internal;
  return match.endsWith('.js') ? match : `${match}.js`;
}

/** Strip workspace / URL prefixes down to a path under `…/esm/`. */
function toEsmRelativePath(urlOrPath: string): string {
  const normalized = normalizeUrlPath(urlOrPath);
  const idx = normalized.indexOf(ESM_ARTIFACT_PREFIX);
  if (idx >= 0) {
    return normalized.slice(idx + ESM_ARTIFACT_PREFIX.length);
  }
  return normalized;
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
function parseNamespaceDefaultReexport(
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

function collectEsmExportNames(source: string): string[] {
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

function findExportBySuffix(
  suffix: string,
  exportNames: string[],
  excludeName: string,
): string | undefined {
  return exportNames.find((n) => n === suffix)
    ?? exportNames.find(
      (n) => n !== excludeName && n.toLowerCase() === suffix.toLowerCase(),
    );
}

/**
 * Map test-only setters onto the export they replace on the mutable api.
 * - `DEBUG_set_title` → `Title`
 * - `_setLegend` → `Legend`
 */
function resolveSetterTarget(
  setterName: string,
  exportNames: string[],
): string | null {
  const debugMatch = /^DEBUG_set_(.+)$/.exec(setterName);
  if (debugMatch) {
    return findExportBySuffix(debugMatch[1], exportNames, setterName) ?? debugMatch[1];
  }

  const setMatch = /^_set([A-Z].*)$/.exec(setterName);
  if (!setMatch) {
    return null;
  }

  return findExportBySuffix(setMatch[1], exportNames, setterName) ?? null;
}

function buildDebugSets(
  wrapExportNames: string[],
  forwardExportNames: string[],
): Record<string, string> {
  const exportNames = [...wrapExportNames, ...forwardExportNames];
  const debugSets: Record<string, string> = {};
  for (const name of exportNames) {
    const target = resolveSetterTarget(name, exportNames);
    if (target) {
      debugSets[name] = target;
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
  // Put optional whitespace inside the negative lookahead so `\s*` cannot
  // backtrack past a space and then accept `export const plugin = { ... }`.
  const constNonData = new RegExp(
    `export\\s+(?:const|let|var)\\s+${name}\\s*=(?!\\s*(?:[{[\\d'"\`\\-]|null\\b|undefined\\b|true\\b|false\\b))`,
  );
  const cjsNonData = new RegExp(
    `exports\\.${name}\\s*=(?!\\s*(?:[{[\\d'"\`\\-]|null\\b|undefined\\b|true\\b|false\\b))`,
  );
  return functionOrClassPattern.test(internalSource)
    || assigned.test(internalSource)
    || cjsAssigned.test(internalSource)
    || constNonData.test(internalSource)
    || cjsNonData.test(internalSource);
}

function shouldWrapExport(name: string, internalSource: string): boolean {
  // SCREAMING_SNAKE constants (PANE_PADDING) must stay value forwards.
  const isScreamingSnake = /^[A-Z][A-Z0-9_]*$/.test(name);
  const isPascalCase = /^[A-Z]/.test(name) && !isScreamingSnake;
  const isTestCtorAlias = /^_TESTS_[A-Z]/.test(name);
  const isTestStubHelper = /_TESTS_.*stub|_stub_/i.test(name);
  return isPascalCase
    || isTestCtorAlias
    || isTestStubHelper
    || RESERVED_EXPORT_NAMES.has(name)
    || isFunctionLikeExport(name, internalSource);
}

function classifyExportNames(
  exportNames: string[],
  internalSource: string,
): { wrapExportNames: string[]; forwardExportNames: string[] } {
  const wrapExportNames: string[] = [];
  const forwardExportNames: string[] = [];

  exportNames.forEach((name) => {
    // Setters that replace another export must use createMutableApi wiring.
    if (resolveSetterTarget(name, exportNames)) {
      forwardExportNames.push(name);
      return;
    }

    if (shouldWrapExport(name, internalSource)) {
      wrapExportNames.push(name);
    } else {
      forwardExportNames.push(name);
    }
  });

  return { wrapExportNames, forwardExportNames };
}

function emitNamedExport(name: string, expression: string): string {
  if (RESERVED_EXPORT_NAMES.has(name)) {
    const alias = `__dxExport_${name}`;
    return `const ${alias} = ${expression};\nexport { ${alias} as ${name} };`;
  }
  return `export const ${name} = ${expression};`;
}

function generateAutoMutableFacadeSource(entry: AutoMutableFacadeEntry): string {
  const originalUrl = `/${entry.internalRelativePath}?dx-original=1`;
  const debugSets = buildDebugSets(entry.wrapExportNames, entry.forwardExportNames);
  const debugSetsLiteral = JSON.stringify(debugSets);
  const liveValueNames = entry.forwardExportNames.filter((name) => name.startsWith('_TESTS_'));

  const exportLines = [
    ...entry.wrapExportNames.map((name) => emitNamedExport(
      name,
      `(typeof api.${name} === 'function' ? wrapCtor(api, '${name}') : api.${name})`,
    )),
    ...entry.forwardExportNames.map((name) => {
      if (debugSets[name]) {
        return emitNamedExport(name, `(...args) => api.${name}(...args)`);
      }
      if (name.startsWith('_TESTS_')) {
        return `export { ${name} } from '${originalUrl}';`;
      }
      return emitNamedExport(name, `api.${name}`);
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

  const helperImport = `import { createMutableApi, wrapCtor } from '${MUTABLE_FACADE_HELPER_URL}';`;

  if (entry.apiFromDefault) {
    return [
      '/* auto-generated mutable facade for QUnit (default-export api) */',
      `import * as originalNs from '${originalUrl}';`,
      helperImport,
      '',
      'const original = originalNs.default ?? originalNs;',
      'const api = createMutableApi(',
      '  original && typeof original === \'object\' ? { ...original } : { value: original },',
      `  '${entry.globalKey}',`,
      `  ${debugSetsLiteral}`,
      ');',
      '',
      ...exportLines,
      'export default api;',
      '',
    ].join('\n');
  }

  return [
    '/* auto-generated mutable facade for QUnit */',
    `import * as original from '${originalUrl}';`,
    helperImport,
    '',
    `const api = createMutableApi(original, '${entry.globalKey}', ${debugSetsLiteral});`,
    ...liveApiBindings,
    '',
    ...exportLines,
    'export default api;',
    '',
  ].join('\n');
}

function registerEsmArtifact(esmRelativePath: string, entry: AutoMutableFacadeEntry): void {
  facadeIndex.set(toEsmRelativePath(esmRelativePath), entry);
}

function readTextFileOrNull(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function buildEntryForInternalFile(
  workspaceRoot: string,
  internalAbsolute: string,
  options: { apiFromDefault?: boolean } = {},
): AutoMutableFacadeEntry | null {
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

  return {
    internalRelativePath,
    wrapExportNames,
    forwardExportNames,
    globalKey: buildGlobalKey(internalRelativePath),
    apiFromDefault: options.apiFromDefault,
  };
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

  const entry = buildEntryForInternalFile(workspaceRoot, internalAbsolute);
  if (!entry) {
    return null;
  }

  registerEsmArtifact(toWorkspaceRelativePath(workspaceRoot, absoluteFilePath), entry);
  registerEsmArtifact(entry.internalRelativePath, entry);
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

function registerForcedMutableGroups(workspaceRoot: string): void {
  const esmRoot = path.join(
    workspaceRoot,
    'packages/devextreme/artifacts/transpiled-esm-npm/esm',
  );

  MUTABLE_MODULE_GROUPS.forEach((group) => {
    const internalAbsolute = path.join(esmRoot, group.internal);
    const entry = buildEntryForInternalFile(workspaceRoot, internalAbsolute, {
      apiFromDefault: group.apiFromDefault,
    });
    if (!entry) {
      return;
    }

    groupArtifacts(group).forEach((artifact) => {
      registerEsmArtifact(artifact, entry);
    });
  });
}

export function ensureAutoMutableFacadeIndex(workspaceRoot: string): void {
  if (indexBuiltForRoot === workspaceRoot) {
    return;
  }

  facadeIndex.clear();
  registerForcedMutableGroups(workspaceRoot);

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
 * Import-map entries for forced mutable modules → ESM artifact URLs
 * (served as generated facades by static.ts).
 */
export function buildMutableModuleImportMapEntries(esmRootUrl: string): Record<string, string> {
  const entries: Record<string, string> = {};

  MUTABLE_MODULE_GROUPS.forEach((group) => {
    groupImportMapKeys(group).forEach((key) => {
      entries[key] = `${esmRootUrl}/${artifactForImportMapKey(group, key)}`;
    });
  });

  return entries;
}

export function findHandWrittenMutableFacade(relativeUrlPath: string): string | null {
  const esmPath = toEsmRelativePath(relativeUrlPath);
  const match = HAND_WRITTEN_ESM_FACADES.find((entry) => entry.esmPath === esmPath);
  return match?.shimUrl ?? null;
}

/**
 * Returns generated facade source for a forced mutable module or a
 * namespace-default public entry, or null when not applicable.
 */
export function tryBuildAutoMutableFacade(
  relativeUrlPath: string,
  absoluteFilePath: string,
  workspaceRoot: string,
): string | null {
  ensureAutoMutableFacadeIndex(workspaceRoot);

  const esmKey = toEsmRelativePath(relativeUrlPath);
  let entry = facadeIndex.get(esmKey);

  if (!entry) {
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
