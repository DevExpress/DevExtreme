/**
 * Serve-time CJS → ESM helpers for QUnit tests/helpers under native ESM.
 *
 * 1) `import x from 'mod'` → namespace + `.default ?? ns` (CJS default interop)
 * 2) top-level `require(...)` → equivalent ESM imports
 * 3) CJS `module.exports` / `exports.*` helpers → `export default`
 */

const MIXED_DEFAULT_NAMED_RE = /import\s+([A-Za-z_$][\w$]*)\s*,\s*(\{[^}]*\})\s*from\s*('[^']+'|"[^"]+")/g;

const DEFAULT_ONLY_RE = /import\s+([A-Za-z_$][\w$]*)\s+from\s*('[^']+'|"[^"]+")/g;
const NAMED_ONLY_RE = /import\s*(\{[^}]*\})\s*from\s*('[^']+'|"[^"]+")/g;

const IDENT = '[A-Za-z_$][\\w$]*';
const SPEC = "('[^']+'|\"[^\"]+\")";

let requireCounter = 0;
let importCounter = 0;

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
      return `import * as ${ns} from ${spec};`
        + ` const ${name} = ${ns}.default ?? { ...${ns} };`
        + ` const ${named} = ${merged}`;
    },
  );

  next = next.replace(DEFAULT_ONLY_RE, (match, name: string, spec: string) => {
    if (!isBareSpecifier(spec)) {
      return match;
    }
    const ns = `__dxCjs_${name}`;
    return `import * as ${ns} from ${spec}; const ${name} = ${ns}.default ?? { ...${ns} }`;
  });

  next = next.replace(NAMED_ONLY_RE, (match, named: string, spec: string) => {
    if (!isBareSpecifier(spec)) {
      return match;
    }
    const ns = nextImportId();
    const merged = `({ ...${ns}, ...(typeof ${ns}.default === 'object' && ${ns}.default ? ${ns}.default : {}) })`;
    return `import * as ${ns} from ${spec};`
      + ` const ${named} = ${merged}`;
  });

  return next;
}

/**
 * Rewrite common top-level require() patterns used by legacy QUnit suites.
 * Does not rewrite require() inside functions (rare; e.g. aspnet.tests.js).
 */
export function rewriteRequiresToEsm(source: string): string {
  if (!/\brequire\s*\(/.test(source)) {
    return source;
  }

  requireCounter = 0;
  let next = source;

  // const { a, b } = require('spec');
  next = next.replace(
    new RegExp(`^(const|let|var)\\s+(\\{[^}]+\\})\\s*=\\s*require\\s*\\(\\s*${SPEC}\\s*\\)\\s*;?\\s*$`, 'gm'),
    (_m, kind: string, pattern: string, spec: string) => {
      const ns = nextRequireId();
      return `import * as ${ns} from ${spec};`
        + `\n${kind} ${pattern} = ${ns}.default ?? { ...${ns} };`;
    },
  );

  // const name = require('spec').prop;
  next = next.replace(
    new RegExp(
      `^(const|let|var)\\s+(${IDENT})\\s*=\\s*require\\s*\\(\\s*${SPEC}\\s*\\)\\s*\\.\\s*(${IDENT})\\s*;?\\s*$`,
      'gm',
    ),
    (_m, kind: string, name: string, spec: string, prop: string) => {
      const ns = nextRequireId();
      return `import * as ${ns} from ${spec};`
        + `\n${kind} ${name} = (${ns}.default ?? { ...${ns} }).${prop};`;
    },
  );

  // const name = require('spec');
  next = next.replace(
    new RegExp(
      `^(const|let|var)\\s+(${IDENT})\\s*=\\s*require\\s*\\(\\s*${SPEC}\\s*\\)\\s*;?\\s*$`,
      'gm',
    ),
    (_m, kind: string, name: string, spec: string) => {
      const ns = nextRequireId();
      return `import * as ${ns} from ${spec};`
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
      const ns = nextRequireId();
      return `import * as ${ns} from ${spec};`
        + `\n${left} = ${ns}.default ?? { ...${ns} };`;
    },
  );

  // dictionaries['zh-tw'] = require('...');
  next = next.replace(
    new RegExp(
      `^((?:${IDENT}|\\[['"][^\\]]+['"]\\])(?:\\.(?:${IDENT})|\\[['"][^\\]]+['"]\\])*)\\s*=\\s*require\\s*\\(\\s*${SPEC}\\s*\\)\\s*;?\\s*$`,
      'gm',
    ),
    (_m, left: string, spec: string) => {
      const ns = nextRequireId();
      return `import * as ${ns} from ${spec};`
        + `\n${left} = ${ns}.default ?? { ...${ns} };`;
    },
  );

  // require('spec');
  next = next.replace(
    new RegExp(`^require\\s*\\(\\s*${SPEC}\\s*\\)\\s*;?\\s*$`, 'gm'),
    (_m, spec: string) => `import ${spec};`,
  );

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
      `^\\s*(const|let|var)\\s+(${IDENT})\\s*=\\s*require\\s*\\(\\s*${SPEC}\\s*\\)\\s*\\.\\s*(${IDENT})\\s*;?\\s*$`,
      'gm',
    ),
    (_m, kind: string, name: string, spec: string, prop: string) => {
      const ns = nextRequireId();
      return `import * as ${ns} from ${spec};\n${kind} ${name} = (${ns}.default ?? { ...${ns} }).${prop};`;
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

export function wrapCjsModuleExports(source: string): string {
  if (/\bexport\b/.test(source)) {
    return source;
  }

  const usesExports = /\bmodule\.exports\b/.test(source)
    || /\bexports\./.test(source)
    || /\bexports\[/.test(source);

  if (!usesExports) {
    return source;
  }

  // AMD / legacy DevExpress.require helpers — leave untouched for now
  if (/\bdefine\.amd\b/.test(source) || /\bDevExpress\.require\b/.test(source)) {
    return source;
  }

  return `const module = { exports: {} };
let exports = module.exports;
${source}
export default module.exports;
`;
}

export function rewriteQunitTestHelperSource(source: string): string {
  let next = rewriteAmdDefineFactory(source);
  next = rewriteRequiresToEsm(next);
  next = wrapCjsModuleExports(next);
  next = rewriteCjsStyleDefaultImports(next);
  return next;
}

export function isQunitTestOrHelperPath(relativePath: string): boolean {
  const normalized = relativePath.replace(/\\/g, '/');
  return (
    normalized.includes('/packages/devextreme/testing/tests/')
    || normalized.includes('/packages/devextreme/testing/helpers/')
    || normalized.startsWith('packages/devextreme/testing/tests/')
    || normalized.startsWith('packages/devextreme/testing/helpers/')
  );
}
