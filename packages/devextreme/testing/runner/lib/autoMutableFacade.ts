import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';

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

export interface AutoMutableFacadeEntry {
  /** Workspace-relative path to the real implementation module (no leading slash). */
  internalRelativePath: string;
  /** Named exports forwarded with wrapCtor (ctors / replaceable functions). */
  wrapExportNames: string[];
  /** Named exports re-exported as call/value forwards (DEBUG_set_*, scalars, …). */
  forwardExportNames: string[];
  globalKey: string;
  /**
   * Build `api` from `namespace.default ?? namespace` (default export is the
   * stub target object — errors, format_helper, visibility_change, …).
   */
  apiFromDefault?: boolean;
}

/**
 * Modules that always get a generated mutable facade (sinon.stub targets).
 * `internal` is wrapped via `?dx-original=1`; all `artifacts` / import-map keys
 * share one globalThis api.
 *
 * Keep hand-written shims only for non-generic cases (themes composition,
 * CSS inject, jquery globals, base_indicators debug export, …).
 */
export interface MutableModuleGroup {
  /** Path under `artifacts/transpiled-esm-npm/esm/`. */
  internal: string;
  /** Artifact paths (under esm/) that should serve this facade. */
  artifacts: readonly string[];
  /** Extra import-map bare keys (default: artifacts without `.js`). */
  importMapKeys?: readonly string[];
  apiFromDefault?: boolean;
}

export const MUTABLE_MODULE_GROUPS: readonly MutableModuleGroup[] = [
  {
    internal: '__internal/viz/core/renderers/renderer.js',
    artifacts: [
      '__internal/viz/core/renderers/renderer.js',
      'viz/core/renderers/renderer_default.js',
    ],
    importMapKeys: [
      'viz/core/renderers/renderer',
      'viz/core/renderers/renderer_default',
      '__internal/viz/core/renderers/renderer',
    ],
  },
  {
    internal: '__internal/viz/core/renderers/animation.js',
    artifacts: [
      '__internal/viz/core/renderers/animation.js',
      'viz/core/renderers/animation.js',
    ],
    importMapKeys: [
      'viz/core/renderers/animation',
      '__internal/viz/core/renderers/animation',
    ],
  },
  {
    internal: '__internal/viz/core/utils.js',
    artifacts: [
      '__internal/viz/core/utils.js',
      'viz/core/utils.js',
      'viz/core/utils_default.js',
    ],
    importMapKeys: [
      'viz/core/utils',
      'viz/core/utils_default',
      '__internal/viz/core/utils',
    ],
  },
  {
    internal: '__internal/viz/axes/base_axis.js',
    artifacts: ['__internal/viz/axes/base_axis.js'],
    importMapKeys: ['viz/axes/base_axis', '__internal/viz/axes/base_axis'],
  },
  {
    internal: 'exporter.js',
    artifacts: ['exporter.js'],
    importMapKeys: ['exporter', 'exporter.js'],
  },
  {
    internal: 'format_helper.js',
    artifacts: ['format_helper.js'],
    importMapKeys: ['format_helper', 'format_helper.js'],
    apiFromDefault: true,
  },
  {
    internal: '__internal/viz/translators/translator2d.js',
    artifacts: ['__internal/viz/translators/translator2d.js'],
    importMapKeys: [
      'viz/translators/translator2d',
      '__internal/viz/translators/translator2d',
    ],
  },
  {
    internal: '__internal/viz/axes/tick_generator.js',
    artifacts: ['__internal/viz/axes/tick_generator.js'],
    importMapKeys: [
      'viz/axes/tick_generator',
      '__internal/viz/axes/tick_generator',
    ],
  },
  {
    internal: '__internal/viz/core/tooltip.js',
    artifacts: [
      '__internal/viz/core/tooltip.js',
      'viz/core/tooltip.js',
    ],
    importMapKeys: ['viz/core/tooltip', '__internal/viz/core/tooltip'],
  },
  {
    internal: '__internal/viz/core/title.js',
    artifacts: [
      '__internal/viz/core/title.js',
      'viz/core/title.js',
    ],
    importMapKeys: ['viz/core/title', '__internal/viz/core/title'],
  },
  {
    internal: '__internal/viz/core/export.js',
    artifacts: [
      '__internal/viz/core/export.js',
      '__internal/viz/core/exportModule.js',
      'viz/core/export.js',
    ],
    importMapKeys: [
      'viz/core/export',
      '__internal/viz/core/export',
      '__internal/viz/core/exportModule',
    ],
  },
  {
    internal: '__internal/viz/chart_components/tracker.js',
    artifacts: [
      'viz/chart_components/tracker.js',
      '__internal/viz/chart_components/tracker.js',
    ],
    importMapKeys: [
      'viz/chart_components/tracker',
      '__internal/viz/chart_components/tracker',
    ],
  },
  {
    internal: '__internal/viz/components/legend.js',
    artifacts: [
      'viz/components/legend.js',
      '__internal/viz/components/legend.js',
    ],
    importMapKeys: [
      'viz/components/legend',
      '__internal/viz/components/legend',
    ],
  },
  {
    internal: '__internal/viz/core/loading_indicator.js',
    artifacts: [
      'viz/core/loading_indicator.js',
      '__internal/viz/core/loading_indicator.js',
    ],
    importMapKeys: [
      'viz/core/loading_indicator',
      '__internal/viz/core/loading_indicator',
    ],
  },
  {
    internal: '__internal/core/localization/ldml/date.parser.js',
    artifacts: [
      '__internal/core/localization/ldml/date.parser.js',
      '__internal/core/localization/ldml/dateParserModule.js',
      'common/core/localization/ldml/date.parser.js',
    ],
    importMapKeys: [
      '__internal/core/localization/ldml/date.parser',
      '__internal/core/localization/ldml/dateParserModule',
      'common/core/localization/ldml/date.parser',
    ],
  },
  {
    internal: '__internal/events/m_visibility_change.js',
    artifacts: [
      'common/core/events/visibility_change.js',
      '__internal/events/m_visibility_change.js',
    ],
    importMapKeys: [
      'common/core/events/visibility_change',
      '__internal/events/m_visibility_change',
    ],
    apiFromDefault: true,
  },
  {
    internal: 'core/errors.js',
    artifacts: ['core/errors.js'],
    importMapKeys: ['core/errors'],
    apiFromDefault: true,
  },
  {
    internal: 'ui/widget/ui.errors.js',
    artifacts: ['ui/widget/ui.errors.js'],
    importMapKeys: ['ui/widget/ui.errors'],
    apiFromDefault: true,
  },
  {
    internal: '__internal/core/m_template_manager.js',
    artifacts: ['__internal/core/m_template_manager.js'],
    importMapKeys: ['__internal/core/m_template_manager'],
    apiFromDefault: true,
  },
  {
    // Real named exports live in palette.js; paletteModule.js is only
    // `import * as PaletteModule from './palette'; export default PaletteModule`.
    internal: '__internal/viz/palette.js',
    artifacts: [
      '__internal/viz/palette.js',
      '__internal/viz/paletteModule.js',
    ],
    importMapKeys: [
      'viz/palette',
      '__internal/viz/paletteModule',
      '__internal/viz/palette',
    ],
  },
  {
    internal: '__internal/common/core/animation/frame.js',
    artifacts: [
      'common/core/animation/frame.js',
      '__internal/common/core/animation/frame.js',
      '__internal/common/core/animation/frameModule.js',
    ],
    importMapKeys: [
      'common/core/animation/frame',
      '__internal/common/core/animation/frame',
      'animation/frame',
      '__internal/common/core/animation/frameModule',
    ],
  },
];

/** Hand-written shims that stay (custom composition / non-generic). */
const HAND_WRITTEN_ARTIFACT_FACADES: readonly { suffix: string; shimUrl: string }[] = [
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/__internal/ui/themes.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/themes.js',
  },
  {
    suffix: '/artifacts/transpiled-esm-npm/esm/ui/themes.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/themes.js',
  },
];

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

function resolveDebugSetTarget(
  suffix: string,
  exportNames: string[],
  debugSetName: string,
): string {
  // Prefer exact export match; fall back to case-insensitive
  // (`DEBUG_set_title` → `Title`, `DEBUG_set_tooltip` → `Tooltip`).
  const exact = exportNames.find((n) => n === suffix);
  if (exact) {
    return exact;
  }
  const ci = exportNames.find(
    (n) => n !== debugSetName && n.toLowerCase() === suffix.toLowerCase(),
  );
  return ci ?? suffix;
}

/**
 * Map test-only setters onto the export they replace on the mutable api.
 * - `DEBUG_set_title` → `Title`
 * - `_setLegend` → `Legend` (funnel/sankey legend stubs)
 */
function resolveMutableSetterTarget(
  setterName: string,
  exportNames: string[],
): string | null {
  const debugMatch = /^DEBUG_set_(.+)$/.exec(setterName);
  if (debugMatch) {
    return resolveDebugSetTarget(debugMatch[1], exportNames, setterName);
  }

  const setMatch = /^_set([A-Z].*)$/.exec(setterName);
  if (!setMatch) {
    return null;
  }

  const suffix = setMatch[1];
  const exact = exportNames.find((n) => n === suffix);
  if (exact) {
    return exact;
  }
  return exportNames.find(
    (n) => n !== setterName && n.toLowerCase() === suffix.toLowerCase(),
  ) ?? null;
}

function buildDebugSets(
  wrapExportNames: string[],
  forwardExportNames: string[],
): Record<string, string> {
  const exportNames = [...wrapExportNames, ...forwardExportNames];
  const debugSets: Record<string, string> = {};
  for (const name of exportNames) {
    const target = resolveMutableSetterTarget(name, exportNames);
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
  // e.g. `export const triggerResizeEvent = triggerVisibilityChangeEvent('dxresize')`
  // — RHS is a call/identifier producing a function, not a data literal.
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

function classifyExportNames(
  exportNames: string[],
  internalSource: string,
): { wrapExportNames: string[]; forwardExportNames: string[] } {
  const wrapExportNames: string[] = [];
  const forwardExportNames: string[] = [];

  exportNames.forEach((name) => {
    // Test setters that replace another export on the mutable api must not
    // go through wrapCtor — they need createMutableApi's DEBUG/_set wiring.
    if (name.startsWith('DEBUG_set_') || resolveMutableSetterTarget(name, exportNames)) {
      forwardExportNames.push(name);
      return;
    }

    // PascalCase ctors (Title, Renderer) — but not SCREAMING_SNAKE
    // constants like PANE_PADDING (number); wrapCtor turns those into NaN in math.
    const isScreamingSnake = /^[A-Z][A-Z0-9_]*$/.test(name);
    const isPascalCase = /^[A-Z]/.test(name) && !isScreamingSnake;
    const isTestCtorAlias = /^_TESTS_[A-Z]/.test(name);
    const isTestStubHelper = /_TESTS_.*stub|_stub_/i.test(name);
    const wrap = isPascalCase
      || isTestCtorAlias
      || isTestStubHelper
      || RESERVED_EXPORT_NAMES.has(name)
      || isFunctionLikeExport(name, internalSource);

    if (wrap) {
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

export function generateAutoMutableFacadeSource(entry: AutoMutableFacadeEntry): string {
  const originalUrl = `/${entry.internalRelativePath}?dx-original=1`;
  const debugSets = buildDebugSets(entry.wrapExportNames, entry.forwardExportNames);
  const debugSetsLiteral = JSON.stringify(debugSets);
  const liveValueNames = entry.forwardExportNames.filter((name) => name.startsWith('_TESTS_'));

  const exportLines = [
    ...entry.wrapExportNames.map(
      (name) => emitNamedExport(name, `wrapCtor(api, '${name}')`),
    ),
    ...entry.forwardExportNames.map((name) => {
      if (name.startsWith('DEBUG_set_') || /^_set[A-Z]/.test(name)) {
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

  if (entry.apiFromDefault) {
    return [
      '/* auto-generated mutable facade for QUnit (default-export api) */',
      `import * as originalNs from '${originalUrl}';`,
      `import { createMutableApi, wrapCtor } from '${MUTABLE_FACADE_HELPER_URL}';`,
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

  const publicRelativePath = toWorkspaceRelativePath(workspaceRoot, absoluteFilePath);
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

    const paths = new Set<string>([group.internal, ...group.artifacts]);
    paths.forEach((artifact) => {
      registerFacadePaths(`${ESM_ARTIFACT_PREFIX}${artifact}`, entry);
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
    const keys = group.importMapKeys
      ?? group.artifacts.map((artifact) => artifact.replace(/\.js$/, ''));

    keys.forEach((key) => {
      const artifact = group.artifacts.find(
        (item) => item === key || item === `${key}.js` || item.replace(/\.js$/, '') === key,
      ) ?? group.internal;
      const urlPath = artifact.endsWith('.js') ? artifact : `${artifact}.js`;
      entries[key] = `${esmRootUrl}/${urlPath}`;
    });
  });

  return entries;
}

export function findHandWrittenMutableFacade(relativeUrlPath: string): string | null {
  const normalized = normalizeUrlPath(relativeUrlPath);
  const withLeadingSlash = normalized.startsWith('/') ? normalized : `/${normalized}`;
  const match = HAND_WRITTEN_ARTIFACT_FACADES.find((entry) => (
    withLeadingSlash.endsWith(entry.suffix)
    || normalized.endsWith(entry.suffix.replace(/^\//, ''))
  ));
  return match?.shimUrl ?? null;
}

function artifactPathMatches(normalizedUrl: string, registeredKey: string): boolean {
  if (normalizedUrl === registeredKey) {
    return true;
  }

  const strip = (value: string): string => {
    const idx = value.indexOf(ESM_ARTIFACT_PREFIX);
    return idx >= 0 ? value.slice(idx + ESM_ARTIFACT_PREFIX.length) : value.replace(/^\/+/, '');
  };

  const urlRel = strip(normalizedUrl);
  const keyRel = strip(registeredKey);
  // Require a path boundary so `excel_exporter.js` does not match `exporter.js`.
  return urlRel === keyRel;
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

  const normalized = normalizeUrlPath(relativeUrlPath);
  let entry = facadeIndex.get(normalized);

  if (!entry) {
    for (const [key, value] of facadeIndex.entries()) {
      if (artifactPathMatches(normalized, key)) {
        entry = value;
        break;
      }
    }
  }

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
