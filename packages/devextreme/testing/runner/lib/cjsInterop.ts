/**
 * Serve-time CJS → ESM helpers for QUnit tests/helpers under native ESM.
 *
 * 1) `import x from 'mod'` → namespace + `'default' in ns ? ns.default : {…ns}`
 *    (skipped for `jquery` — its shim has a real `export default $`)
 * 2) `require(...)` → equivalent ESM imports (only fires for `build/bundle-templates/`
 *    sources now — `testing/tests/**`/`testing/helpers/**` are require()-free)
 * 3) CJS `module.exports` / `exports.*` → `export default` + named exports
 *    (same: bundle-templates only)
 */

const MIXED_DEFAULT_NAMED_RE = /import\s+([A-Za-z_$][\w$]*)\s*,\s*(\{[^}]*\})\s*from\s*('[^']+'|"[^"]+")/g;
const DEFAULT_ONLY_RE = /import\s+([A-Za-z_$][\w$]*)\s+from\s*('[^']+'|"[^"]+")/g;
const NAMED_ONLY_RE = /import\s*(\{[^}]*\})\s*from\s*('[^']+'|"[^"]+")/g;

const SPEC = "('[^']+'|\"[^\"]+\")";

const ESM_ARTIFACT_ROOT = '/packages/devextreme/artifacts/transpiled-esm-npm/esm';
const DX_NODE_MODULES = '/packages/devextreme/node_modules';

const BUNDLE_TEMPLATE_ROOTS = [
  'packages/devextreme/build/bundle-templates/',
  'packages/devextreme/artifacts/transpiled/bundles/',
  'packages/devextreme/artifacts/transpiled-esm-npm/bundles/',
];

const QUNIT_REWRITE_ROOTS = [
  'packages/devextreme/testing/tests/',
  'packages/devextreme/testing/helpers/',
  ...BUNDLE_TEMPLATE_ROOTS,
];

let requireCounter = 0;
let importCounter = 0;

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function pathMatchesRoots(filePath: string | undefined, roots: string[]): boolean {
  if (!filePath) {
    return false;
  }
  const normalized = normalizePath(filePath);
  return roots.some((root) => normalized.includes(`/${root}`) || normalized.startsWith(root));
}

function isBundleTemplatePath(sourcePath?: string): boolean {
  return pathMatchesRoots(sourcePath, BUNDLE_TEMPLATE_ROOTS);
}

function cjsDefaultExpr(ns: string): string {
  return `('default' in ${ns} ? ${ns}.default : { ...${ns} })`;
}

/**
 * Merge namespace named exports with a default object/function export
 * (gauge/widget ctors hang `_TESTS_*` statics on the default).
 */
function cjsMergedNamespaceExpr(ns: string): string {
  return `({ ...${ns}, ...((typeof ${ns}.default === 'object' || typeof ${ns}.default === 'function') && ${ns}.default ? ${ns}.default : {}) })`;
}

function nextRequireId(): string {
  requireCounter += 1;
  return `__dxReq_${requireCounter}`;
}

function nextImportId(): string {
  importCounter += 1;
  return `__dxImp_${importCounter}`;
}

function resetRewriteCounters(): void {
  requireCounter = 0;
  importCounter = 0;
}

function skipQuotedString(source: string, start: number): number {
  const quote = source[start];
  let i = start + 1;
  while (i < source.length) {
    const ch = source[i];
    if (ch === '\\') {
      i += 2;
    } else if (ch === quote) {
      return i + 1;
    } else {
      i += 1;
    }
  }
  return source.length;
}

/** True when `offset` lies inside a block or line comment (strings are skipped). */
function isOffsetInsideComment(source: string, offset: number): boolean {
  let i = 0;
  while (i < offset) {
    if (source.startsWith('/*', i)) {
      const end = source.indexOf('*/', i + 2);
      if (end < 0 || offset < end + 2) {
        return true;
      }
      i = end + 2;
    } else if (source.startsWith('//', i)) {
      const end = source.indexOf('\n', i);
      const lineEnd = end < 0 ? source.length : end;
      if (offset < lineEnd) {
        return true;
      }
      i = lineEnd;
    } else {
      const ch = source[i];
      if (ch === '"' || ch === '\'' || ch === '`') {
        i = skipQuotedString(source, i);
      } else {
        i += 1;
      }
    }
  }
  return false;
}

/**
 * Plugin-style json specs (`file.json!` / `file.json!json`) must not stay as
 * bare specifiers under a package prefix map — browsers resolve
 * `devextreme-cldr-data/fr.json!json` to a literal path with `!json` → 404.
 */
function normalizeJsonPluginSpecifier(spec: string): string | null {
  const jsonBang = /^(.*\.json)!(?:json)?$/.exec(spec);
  if (!jsonBang) {
    return null;
  }

  const jsonPath = jsonBang[1];
  if (jsonPath.startsWith('devextreme-cldr-data/') || jsonPath.startsWith('cldr-core/')) {
    return `${DX_NODE_MODULES}/${jsonPath}?esm-export=1`;
  }
  if (jsonPath.startsWith('.') || jsonPath.startsWith('/')) {
    return `${jsonPath}?esm-export=1`;
  }
  return `${ESM_ARTIFACT_ROOT}/${jsonPath}?esm-export=1`;
}

function normalizeRequireSpecifierForEsm(specWithQuotes: string, sourcePath?: string): string {
  const quote = specWithQuotes[0];
  const spec = specWithQuotes.slice(1, -1);

  const jsonUrl = normalizeJsonPluginSpecifier(spec);
  if (jsonUrl) {
    return `${quote}${jsonUrl}${quote}`;
  }

  if (!isBundleTemplatePath(sourcePath)) {
    return specWithQuotes;
  }

  // Bundle template CJS requires are relative to bundler sources; browser ESM
  // needs bare package-style aliases.
  if (spec.startsWith('../')) {
    return `${quote}${spec.replace(/^(\.\.\/)+/, '')}${quote}`;
  }

  return specWithQuotes;
}

function normalizeBundleTemplateRelativeEsmSpecifiers(source: string, sourcePath?: string): string {
  if (!isBundleTemplatePath(sourcePath)) {
    return source;
  }

  return source.replace(
    /((?:import|export)\s[^'"]*?\sfrom\s*|import\s*)(['"])([^'"]+)\2/g,
    (_match, prefix: string, quote: string, spec: string) => {
      if (!spec.startsWith('../')) {
        return `${prefix}${quote}${spec}${quote}`;
      }
      return `${prefix}${quote}${spec.replace(/^(\.\.\/)+/, '')}${quote}`;
    },
  );
}

/**
 * Replace every static `require('…')` with a shared namespace alias and hoist
 * `import * as` declarations. Skips requires inside comments (bundle templates
 * keep optional widgets commented out).
 */
function rewriteRequiresToEsm(source: string, sourcePath?: string): string {
  if (!/\brequire\s*\(/.test(source)) {
    return source;
  }

  const specToAlias = new Map<string, string>();
  const next = source.replace(
    // SPEC already includes a capturing group — do not wrap it again or
    // the replace callback's `offset` argument shifts.
    new RegExp(`require\\s*\\(\\s*${SPEC}\\s*\\)(?:\\s*\\.\\s*default\\b)?`, 'g'),
    (match, spec: string, offset: number) => {
      if (isOffsetInsideComment(source, offset)) {
        return match;
      }
      const normalizedSpec = normalizeRequireSpecifierForEsm(spec, sourcePath);
      let alias = specToAlias.get(normalizedSpec);
      if (!alias) {
        alias = nextRequireId();
        specToAlias.set(normalizedSpec, alias);
      }
      // Prefer an explicit default (including null); otherwise a mutable
      // shallow copy of the namespace. Bare `ns` is an immutable Module
      // Namespace and breaks `DevExpress.events = require(…); events.click = …`.
      return `(${cjsDefaultExpr(alias)})`;
    },
  );

  if (!specToAlias.size) {
    return next;
  }

  const importBlock = [...specToAlias.entries()]
    .map(([spec, alias]) => `import * as ${alias} from ${spec};`)
    .join('\n');

  return `${importBlock}\n${next}`;
}

function isBareSpecifier(specWithQuotes: string): boolean {
  const spec = specWithQuotes.slice(1, -1);
  return !spec.startsWith('.') && !spec.startsWith('/');
}

/**
 * Convert an ESM named-import clause `{ a as b, c }` into an object
 * destructuring pattern `{ a: b, c }` (import `as` is not valid there).
 */
function importClauseToDestructuring(namedClause: string): string {
  const trimmedClause = namedClause.trim();
  if (!trimmedClause.startsWith('{') || !trimmedClause.endsWith('}')) {
    return namedClause;
  }

  const inner = trimmedClause.slice(1, -1);
  const parts = inner.split(',').map((part) => part.trim()).filter(Boolean);
  const converted = parts.map((part) => {
    const asMatch = /^([A-Za-z_$][\w$]*)\s+as\s+([A-Za-z_$][\w$]*)$/.exec(part);
    if (asMatch) {
      return `${asMatch[1]}: ${asMatch[2]}`;
    }
    return part;
  });

  return `{ ${converted.join(', ')} }`;
}

function rewriteCjsStyleDefaultImports(source: string): string {
  let next = source.replace(
    MIXED_DEFAULT_NAMED_RE,
    (match, name: string, named: string, spec: string) => {
      if (!isBareSpecifier(spec)) {
        return match;
      }
      const ns = `__dxCjs_${name}`;
      const bindingPattern = importClauseToDestructuring(named);
      // `let` — some QUnit suites reassign default imports (e.g. `$ = coreRenderer`).
      return `import * as ${ns} from ${spec};`
        + ` let ${name} = ${cjsDefaultExpr(ns)};`
        + ` const ${bindingPattern} = ${cjsMergedNamespaceExpr(ns)}`;
    },
  );

  next = next.replace(DEFAULT_ONLY_RE, (match, name: string, spec: string) => {
    if (!isBareSpecifier(spec)) {
      return match;
    }
    const ns = `__dxCjs_${name}`;
    return `import * as ${ns} from ${spec}; let ${name} = ${cjsDefaultExpr(ns)}`;
  });

  next = next.replace(NAMED_ONLY_RE, (match, named: string, spec: string) => {
    if (!isBareSpecifier(spec)) {
      return match;
    }
    const ns = nextImportId();
    const bindingPattern = importClauseToDestructuring(named);
    return `import * as ${ns} from ${spec};`
      + ` const ${bindingPattern} = ${cjsMergedNamespaceExpr(ns)}`;
  });

  return next;
}

/**
 * True for a single-line static import we can safely hoist.
 * Incomplete multi-line openers (`import {`) must stay with their body lines.
 */
function isCompleteImportLine(line: string): boolean {
  const trimmed = line.trim();
  if (!/^import\b/.test(trimmed) || /^import\s*\(/.test(trimmed)) {
    return false;
  }
  if (/^import\s*['"][^'"]+['"]/.test(trimmed)) {
    return true;
  }
  return /\bfrom\s*['"][^'"]+['"]/.test(trimmed);
}

function hoistImportsFromSource(source: string): { imports: string[]; body: string } {
  const normalized = source.replace(/;(?=\s*import\s)/g, ';\n');
  const imports: string[] = [];
  const bodyLines: string[] = [];

  normalized.split('\n').forEach((line) => {
    if (isCompleteImportLine(line)) {
      imports.push(line.trim());
    } else {
      bodyLines.push(line);
    }
  });

  return {
    imports,
    body: bodyLines.join('\n').trim(),
  };
}

/** Collect `exports.foo` / `module.exports.foo` assignment names for ESM named re-exports. */
function collectCjsExportNames(source: string): string[] {
  const names = new Set<string>();
  const patterns = [
    /(?:^|[^\w$.])exports\.([A-Za-z_$][\w$]*)\s*=/g,
    /(?:^|[^\w$.])module\.exports\.([A-Za-z_$][\w$]*)\s*=/g,
    /(?:^|[^\w$.])exports\[['"]([A-Za-z_$][\w$]*)['"]\]\s*=/g,
    /(?:^|[^\w$.])module\.exports\[['"]([A-Za-z_$][\w$]*)['"]\]\s*=/g,
  ];

  patterns.forEach((pattern) => {
    let match = pattern.exec(source);
    while (match) {
      const name = match[1];
      if (name !== 'default' && name !== '__esModule') {
        names.add(name);
      }
      match = pattern.exec(source);
    }
  });

  return [...names].sort();
}

function rewriteBundleTemplateModuleExports(source: string): string {
  return source.replace(
    /^\s*module\.exports\s*=\s*([\s\S]*?);\s*$/gm,
    'export default $1;',
  );
}

function isLocallyDeclaredBinding(source: string, name: string): boolean {
  const escaped = name.replace(/\$/g, '\\$');
  const directRe = new RegExp(
    `(?:^|[\\s;{}])(?:(?:const|let|var)\\s+${escaped}\\b|function\\s+${escaped}\\b|class\\s+${escaped}\\b)`,
  );
  if (directRe.test(source)) {
    return true;
  }
  const destructuringRe = new RegExp(
    `(?:const|let|var)\\s*\\{[^}]*\\b${escaped}\\b(?!\\s*:)[^}]*\\}`,
  );
  return destructuringRe.test(source);
}

function wrapCjsModuleExports(source: string, sourcePath?: string): string {
  if (/^\s*export\s/m.test(source)) {
    return source;
  }

  const usesExports = /\bmodule\.exports\b/.test(source)
    || /\bexports\./.test(source)
    || /\bexports\[/.test(source);

  if (!usesExports) {
    return source;
  }

  if (isBundleTemplatePath(sourcePath)) {
    return rewriteBundleTemplateModuleExports(source);
  }

  // AMD / DevExpress.require helpers — leave untouched
  if (/\bdefine\.amd\b/.test(source) || /\bDevExpress\.require\b/.test(source)) {
    return source;
  }

  // Named ESM exports must reflect `module.exports.name`. When a local binding
  // already uses that name, alias to avoid collisions / wrong re-exports.
  const namedExports = collectCjsExportNames(source)
    .map((name) => {
      if (isLocallyDeclaredBinding(source, name)) {
        const alias = `__dxExp_${name}`;
        return `const ${alias} = module.exports.${name};\nexport { ${alias} as ${name} };`;
      }
      return `export const ${name} = module.exports.${name};`;
    })
    .join('\n');

  return `const module = { exports: {} };
let exports = module.exports;
${source}
export default module.exports;
${namedExports ? `${namedExports}\n` : ''}`;
}

export function rewriteQunitTestHelperSource(source: string, sourcePath?: string): string {
  resetRewriteCounters();
  let next = normalizeBundleTemplateRelativeEsmSpecifiers(source, sourcePath);
  next = rewriteRequiresToEsm(next, sourcePath);
  next = wrapCjsModuleExports(next, sourcePath);
  next = rewriteCjsStyleDefaultImports(next);
  const { imports, body } = hoistImportsFromSource(next);
  if (!imports.length) {
    return next;
  }
  return `${[...new Set(imports)].join('\n')}\n${body}\n`;
}

/**
 * Convert the UMD `aspnet.js` artifact into a native ESM module.
 * Non-AMD branch expects a global `DevExpress`; under import maps that throws.
 */
export function rewriteAspnetArtifactToEsm(source: string, sourcePath?: string): string {
  const normalized = normalizePath(sourcePath || '');
  if (normalized && !normalized.endsWith('/aspnet.js')) {
    return source;
  }
  if (!/\bDevExpress\.aspnet\s*=/.test(source) || !/\bdefine\s*\(/.test(source)) {
    return source;
  }
  if (/^\s*import\s/m.test(source)) {
    return source;
  }

  const factoryCall = /\)\s*\(\s*function\s*\(([^)]*)\)\s*\{/;
  const match = factoryCall.exec(source);
  if (!match) {
    return source;
  }

  const params = match[1];
  let body = source.slice(match.index + match[0].length);
  body = body.replace(/\}\)\s*;?\s*$/, '');

  return `import __dxAspnetJquery from 'jquery';
import * as __dxAspnetTemplateEngineRegistry from './core/templates/template_engine_registry';
import * as __dxAspnetTemplateBase from './core/templates/template_base';
import * as __dxAspnetGuid from './core/guid';
import * as __dxAspnetValidationEngine from './ui/validation_engine';
import * as __dxAspnetIterator from './core/utils/iterator';
import * as __dxAspnetDom from './core/utils/dom';
import * as __dxAspnetString from './core/utils/string';
import * as __dxAspnetAjax from './core/utils/ajax';

const __dxAspnetFactory = function(${params}) {
${body}
};

const __dxAspnet = __dxAspnetFactory(
  __dxAspnetJquery,
  __dxAspnetTemplateEngineRegistry.setTemplateEngine,
  __dxAspnetTemplateBase.renderedCallbacks,
  ${cjsDefaultExpr('__dxAspnetGuid')},
  ${cjsDefaultExpr('__dxAspnetValidationEngine')},
  __dxAspnetIterator,
  __dxAspnetDom.extractTemplateMarkup,
  __dxAspnetString.encodeHtml,
  ${cjsDefaultExpr('__dxAspnetAjax')},
);

export default __dxAspnet;
`;
}

export function isQunitTestOrHelperPath(relativePath: string): boolean {
  const normalized = normalizePath(relativePath);
  if (normalized.includes('/testing/helpers/esm-shims/')) {
    return false;
  }
  return pathMatchesRoots(normalized, QUNIT_REWRITE_ROOTS);
}
