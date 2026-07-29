/**
 * Serve-time CJS → ESM helpers for QUnit tests/helpers under native ESM.
 *
 * 1) `import x from 'mod'` → namespace + `.default ?? ns` (CJS default interop)
 * 2) top-level `require(...)` → equivalent ESM imports
 * 3) CJS `module.exports` / `exports.*` helpers → `export default` + named exports
 */

const MIXED_DEFAULT_NAMED_RE = /import\s+([A-Za-z_$][\w$]*)\s*,\s*(\{[^}]*\})\s*from\s*('[^']+'|"[^"]+")/g;

const DEFAULT_ONLY_RE = /import\s+([A-Za-z_$][\w$]*)\s+from\s*('[^']+'|"[^"]+")/g;
const NAMED_ONLY_RE = /import\s*(\{[^}]*\})\s*from\s*('[^']+'|"[^"]+")/g;

const IDENT = '[A-Za-z_$][\\w$]*';
const SPEC = "('[^']+'|\"[^\"]+\")";

let requireCounter = 0;
let importCounter = 0;

function isBundleTemplatePath(sourcePath?: string): boolean {
  if (!sourcePath) {
    return false;
  }
  const normalized = sourcePath.replace(/\\/g, '/');
  return normalized.includes('/packages/devextreme/build/bundle-templates/')
    || normalized.startsWith('packages/devextreme/build/bundle-templates/');
}

function normalizeRequireSpecifierForEsm(specWithQuotes: string, sourcePath?: string): string {
  if (!isBundleTemplatePath(sourcePath)) {
    return specWithQuotes;
  }

  const quote = specWithQuotes[0];
  const spec = specWithQuotes.slice(1, -1);

  // Bundle template CJS requires are authored relative to bundler sources.
  // For browser ESM loader they must be bare package-style aliases.
  if (spec.startsWith('../')) {
    return `${quote}${spec.replace(/^(\.\.\/)+/, '')}${quote}`;
  }

  return specWithQuotes;
}

function rewriteRemainingRequires(source: string, sourcePath?: string): string {
  if (!/\brequire\s*\(/.test(source)) {
    return source;
  }

  const specToAlias = new Map<string, string>();
  const next = source.replace(
    new RegExp(`require\\s*\\(\\s*(${SPEC})\\s*\\)`, 'g'),
    (_m, spec: string) => {
      const normalizedSpec = normalizeRequireSpecifierForEsm(spec, sourcePath);
      let alias = specToAlias.get(normalizedSpec);
      if (!alias) {
        requireCounter += 1;
        alias = `__dxReq_${requireCounter}`;
        specToAlias.set(normalizedSpec, alias);
      }
      return `(${alias}.default ?? { ...${alias} })`;
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
      const normalized = spec.replace(/^(\.\.\/)+/, '');
      return `${prefix}${quote}${normalized}${quote}`;
    },
  );
}

function nextRequireId(): string {
  requireCounter += 1;
  return `__dxReq_${requireCounter}`;
}

function nextImportId(): string {
  importCounter += 1;
  return `__dxImp_${importCounter}`;
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

export function rewriteCjsStyleDefaultImports(source: string): string {
  importCounter = 0;
  let next = source.replace(
    MIXED_DEFAULT_NAMED_RE,
    (match, name: string, named: string, spec: string) => {
      if (!isBareSpecifier(spec)) {
        return match;
      }
      const ns = `__dxCjs_${name}`;
      const merged = `({ ...${ns}, ...(typeof ${ns}.default === 'object' && ${ns}.default ? ${ns}.default : {}) })`;
      const bindingPattern = importClauseToDestructuring(named);
      // `let` — some QUnit suites reassign default imports (e.g. `$ = coreRenderer`).
      return `import * as ${ns} from ${spec};`
        + ` let ${name} = ${ns}.default ?? { ...${ns} };`
        + ` const ${bindingPattern} = ${merged}`;
    },
  );

  next = next.replace(DEFAULT_ONLY_RE, (match, name: string, spec: string) => {
    if (!isBareSpecifier(spec)) {
      return match;
    }
    const ns = `__dxCjs_${name}`;
    return `import * as ${ns} from ${spec}; let ${name} = ${ns}.default ?? { ...${ns} }`;
  });

  next = next.replace(NAMED_ONLY_RE, (match, named: string, spec: string) => {
    if (!isBareSpecifier(spec)) {
      return match;
    }
    const ns = nextImportId();
    const merged = `({ ...${ns}, ...(typeof ${ns}.default === 'object' && ${ns}.default ? ${ns}.default : {}) })`;
    const bindingPattern = importClauseToDestructuring(named);
    return `import * as ${ns} from ${spec};`
      + ` const ${bindingPattern} = ${merged}`;
  });

  return next;
}

/**
 * Rewrite require() in legacy QUnit suites/helpers to ESM.
 * Common top-level forms become import + binding; any leftover
 * `require('…')` (including nested member access / in-function calls)
 * is rewritten via a shared import alias.
 */
export function rewriteRequiresToEsm(source: string, sourcePath?: string): string {
  if (!/\brequire\s*\(/.test(source)) {
    return source;
  }

  requireCounter = 0;
  let next = source;

  // const { a, b } = require('spec');
  next = next.replace(
    new RegExp(`^(const|let|var)\\s+(\\{[^}]+\\})\\s*=\\s*require\\s*\\(\\s*${SPEC}\\s*\\)\\s*;?\\s*$`, 'gm'),
    (_m, kind: string, pattern: string, spec: string) => {
      const normalizedSpec = normalizeRequireSpecifierForEsm(spec, sourcePath);
      const ns = nextRequireId();
      return `import * as ${ns} from ${normalizedSpec};`
        + `\n${kind} ${pattern} = ${ns}.default ?? { ...${ns} };`;
    },
  );

  // const name = require('spec').prop... (one or more members)
  next = next.replace(
    new RegExp(
      `^(const|let|var)\\s+(${IDENT})\\s*=\\s*require\\s*\\(\\s*${SPEC}\\s*\\)((?:\\s*\\.\\s*${IDENT})+)\\s*;?\\s*$`,
      'gm',
    ),
    (_m, kind: string, name: string, spec: string, members: string) => {
      const normalizedSpec = normalizeRequireSpecifierForEsm(spec, sourcePath);
      const ns = nextRequireId();
      const path = members.replace(/\s+/g, '');
      return `import * as ${ns} from ${normalizedSpec};`
        + `\n${kind} ${name} = (${ns}.default ?? { ...${ns} })${path};`;
    },
  );

  // const name = obj.path = require('spec');
  next = next.replace(
    new RegExp(
      `^(const|let|var)\\s+(${IDENT})\\s*=\\s*((?:${IDENT}|\\[['"][^\\]]+['"]\\])(?:\\.(?:${IDENT})|\\[['"][^\\]]+['"]\\])*)\\s*=\\s*require\\s*\\(\\s*${SPEC}\\s*\\)\\s*;?\\s*$`,
      'gm',
    ),
    (_m, kind: string, name: string, left: string, spec: string) => {
      const normalizedSpec = normalizeRequireSpecifierForEsm(spec, sourcePath);
      const ns = nextRequireId();
      return `import * as ${ns} from ${normalizedSpec};`
        + `\n${kind} ${name} = ${ns}.default ?? { ...${ns} };`
        + `\n${left} = ${name};`;
    },
  );

  // const name = obj.path = require('spec').prop...
  next = next.replace(
    new RegExp(
      `^(const|let|var)\\s+(${IDENT})\\s*=\\s*((?:${IDENT}|\\[['"][^\\]]+['"]\\])(?:\\.(?:${IDENT})|\\[['"][^\\]]+['"]\\])*)\\s*=\\s*require\\s*\\(\\s*${SPEC}\\s*\\)((?:\\s*\\.\\s*${IDENT})+)\\s*;?\\s*$`,
      'gm',
    ),
    (_m, kind: string, name: string, left: string, spec: string, members: string) => {
      const normalizedSpec = normalizeRequireSpecifierForEsm(spec, sourcePath);
      const ns = nextRequireId();
      const path = members.replace(/\s+/g, '');
      return `import * as ${ns} from ${normalizedSpec};`
        + `\n${kind} ${name} = (${ns}.default ?? { ...${ns} })${path};`
        + `\n${left} = ${name};`;
    },
  );

  // const name = require('spec');
  next = next.replace(
    new RegExp(
      `^(const|let|var)\\s+(${IDENT})\\s*=\\s*require\\s*\\(\\s*${SPEC}\\s*\\)\\s*;?\\s*$`,
      'gm',
    ),
    (_m, kind: string, name: string, spec: string) => {
      const normalizedSpec = normalizeRequireSpecifierForEsm(spec, sourcePath);
      const ns = nextRequireId();
      return `import * as ${ns} from ${normalizedSpec};`
        + `\n${kind} ${name} = ${ns}.default ?? { ...${ns} };`;
    },
  );

  // window.name = require('spec');  OR  name = require('spec');
  next = next.replace(
    new RegExp(
      `^((?:window\\.)?${IDENT})\\s*=\\s*require\\s*\\(\\s*${SPEC}\\s*\\)\\s*;?\\s*$`,
      'gm',
    ),
    (_m, left: string, spec: string) => {
      const normalizedSpec = normalizeRequireSpecifierForEsm(spec, sourcePath);
      const ns = nextRequireId();
      return `import * as ${ns} from ${normalizedSpec};`
        + `\n${left} = ${ns}.default ?? { ...${ns} };`;
    },
  );

  // obj.path = require('spec').prop...
  next = next.replace(
    new RegExp(
      `^((?:${IDENT}|\\[['"][^\\]]+['"]\\])(?:\\.(?:${IDENT})|\\[['"][^\\]]+['"]\\])*)\\s*=\\s*require\\s*\\(\\s*${SPEC}\\s*\\)((?:\\s*\\.\\s*${IDENT})+)\\s*;?\\s*$`,
      'gm',
    ),
    (_m, left: string, spec: string, members: string) => {
      const normalizedSpec = normalizeRequireSpecifierForEsm(spec, sourcePath);
      const ns = nextRequireId();
      const path = members.replace(/\s+/g, '');
      return `import * as ${ns} from ${normalizedSpec};`
        + `\n${left} = (${ns}.default ?? { ...${ns} })${path};`;
    },
  );

  // dictionaries['zh-tw'] = require('...');
  next = next.replace(
    new RegExp(
      `^((?:${IDENT}|\\[['"][^\\]]+['"]\\])(?:\\.(?:${IDENT})|\\[['"][^\\]]+['"]\\])*)\\s*=\\s*require\\s*\\(\\s*${SPEC}\\s*\\)\\s*;?\\s*$`,
      'gm',
    ),
    (_m, left: string, spec: string) => {
      const normalizedSpec = normalizeRequireSpecifierForEsm(spec, sourcePath);
      const ns = nextRequireId();
      return `import * as ${ns} from ${normalizedSpec};`
        + `\n${left} = ${ns}.default ?? { ...${ns} };`;
    },
  );

  // require('spec');
  next = next.replace(
    new RegExp(`^require\\s*\\(\\s*${SPEC}\\s*\\)\\s*;?\\s*$`, 'gm'),
    (_m, spec: string) => `import ${normalizeRequireSpecifierForEsm(spec, sourcePath)};`,
  );

  // Catch-all for any remaining static require('…') / require("…")
  // (nested access, in-function calls, unusual LHS forms).
  next = rewriteRemainingRequires(next, sourcePath);

  return next;
}

function rewriteRequiresToEsmInAmdBody(source: string): string {
  requireCounter = 0;
  let next = source;

  next = next.replace(
    new RegExp(`^\\s*(const|let|var)\\s+(\\{[^}]+\\})\\s*=\\s*require\\s*\\(\\s*${SPEC}\\s*\\)\\s*;?\\s*$`, 'gm'),
    (_m, kind: string, pattern: string, spec: string) => {
      const ns = nextRequireId();
      return `import * as ${ns} from ${spec};\n${kind} ${pattern} = ${ns}.default ?? { ...${ns} };`;
    },
  );

  next = next.replace(
    new RegExp(
      `^\\s*(const|let|var)\\s+(${IDENT})\\s*=\\s*require\\s*\\(\\s*${SPEC}\\s*\\)((?:\\s*\\.\\s*${IDENT})+)\\s*;?\\s*$`,
      'gm',
    ),
    (_m, kind: string, name: string, spec: string, members: string) => {
      const ns = nextRequireId();
      const path = members.replace(/\s+/g, '');
      return `import * as ${ns} from ${spec};\n${kind} ${name} = (${ns}.default ?? { ...${ns} })${path};`;
    },
  );

  next = next.replace(
    new RegExp(
      `^\\s*(const|let|var)\\s+(${IDENT})\\s*=\\s*require\\s*\\(\\s*${SPEC}\\s*\\)\\s*;?\\s*$`,
      'gm',
    ),
    (_m, kind: string, name: string, spec: string) => {
      const ns = nextRequireId();
      return `import * as ${ns} from ${spec};\n${kind} ${name} = ${ns}.default ?? { ...${ns} };`;
    },
  );

  next = next.replace(
    new RegExp(`^\\s*require\\s*\\(\\s*${SPEC}\\s*\\)\\s*;?\\s*$`, 'gm'),
    (_m, spec: string) => `import ${spec};`,
  );

  next = rewriteRemainingRequires(next);

  return next;
}

function rewriteAmdDefineFactory(source: string): string {
  const amdFactoryRe = /define\s*\(\s*function\s*\([^)]*\)\s*\{([\s\S]*?)\}\s*\)\s*;?/g;

  return source.replace(amdFactoryRe, (_match, body: string) => {
    const rewrittenBody = rewriteRequiresToEsmInAmdBody(body);
    const lines = rewrittenBody.split('\n');
    const importLines: string[] = [];
    const bodyLines: string[] = [];

    lines.forEach((line) => {
      if (/^\s*import\s/.test(line)) {
        importLines.push(line.trim());
      } else {
        bodyLines.push(line);
      }
    });

    const uniqueImports = [...new Set(importLines)];
    const bodyScript = bodyLines.join('\n').trim();
    const bodyWrapper = `(function() {\n${bodyScript}\n})();`;

    return `${uniqueImports.join('\n')}\n\n${bodyWrapper}`;
  });
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
      // `default` / `__esModule` are not valid/useful as `export const` names
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
  // const/let/var name = … | function/class name
  const directRe = new RegExp(
    `(?:^|[\\s;{}])(?:(?:const|let|var)\\s+${escaped}\\b|function\\s+${escaped}\\b|class\\s+${escaped}\\b)`,
  );
  if (directRe.test(source)) {
    return true;
  }
  // const { ChartTracker, PieTracker } = … (shorthand / default; not `name: alias`)
  const destructuringRe = new RegExp(
    `(?:const|let|var)\\s*\\{[^}]*\\b${escaped}\\b(?!\\s*:)[^}]*\\}`,
  );
  return destructuringRe.test(source);
}

export function wrapCjsModuleExports(source: string, sourcePath?: string): string {
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

  // AMD / legacy DevExpress.require helpers — leave untouched for now
  if (/\bdefine\.amd\b/.test(source) || /\bDevExpress\.require\b/.test(source)) {
    return source;
  }

  // Named ESM exports must reflect `module.exports.name`. When a local
  // binding already uses that name (`const name` or `const { name }`),
  // `export const name = …` / `export { name }` would either collide or
  // re-export the wrong value (e.g. trackerMock spies vs originals).
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
  let next = rewriteAmdDefineFactory(source);
  next = normalizeBundleTemplateRelativeEsmSpecifiers(next, sourcePath);
  next = rewriteRequiresToEsm(next, sourcePath);
  next = wrapCjsModuleExports(next, sourcePath);
  next = rewriteCjsStyleDefaultImports(next);
  return next;
}

export function isQunitTestOrHelperPath(relativePath: string): boolean {
  const normalized = relativePath.replace(/\\/g, '/');
  return (
    normalized.includes('/packages/devextreme/testing/tests/')
    || normalized.includes('/packages/devextreme/testing/helpers/')
    || normalized.includes('/packages/devextreme/build/bundle-templates/')
    || normalized.startsWith('packages/devextreme/testing/tests/')
    || normalized.startsWith('packages/devextreme/testing/helpers/')
    || normalized.startsWith('packages/devextreme/build/bundle-templates/')
  );
}
