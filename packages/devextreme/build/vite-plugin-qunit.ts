/* eslint-disable */
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { PluginOption, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';

const TESTING_ROOT = path.resolve(__dirname, '../testing');
const TESTS_DIR = path.join(TESTING_ROOT, 'tests');
const JS_DIR = path.resolve(__dirname, '../js');
const ARTIFACTS_CSS_DIR = path.resolve(__dirname, '../artifacts/css');

interface CategoryMeta {
  constellation?: string;
  explicit?: boolean;
  runOnDevices?: boolean;
}

interface TestSuite {
  category: string;
  file: string;
  constellation: string;
}

function discoverTests(): TestSuite[] {
  const suites: TestSuite[] = [];
  const categories = fs.readdirSync(TESTS_DIR).filter((d) => {
    const fullPath = path.join(TESTS_DIR, d);
    return fs.statSync(fullPath).isDirectory() && d.startsWith('DevExpress.');
  });

  for (const category of categories) {
    const catDir = path.join(TESTS_DIR, category);
    const metaPath = path.join(catDir, '__meta.json');
    let constellation = 'misc';

    if (fs.existsSync(metaPath)) {
      const meta: CategoryMeta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      if (meta.constellation) {
        constellation = String(meta.constellation);
      }
    }

    const files = fs.readdirSync(catDir).filter((f) => f.endsWith('.tests.js'));

    for (const file of files) {
      suites.push({ category, file, constellation });
    }

    const subDirs = fs.readdirSync(catDir).filter((d) => {
      const subPath = path.join(catDir, d);
      return fs.statSync(subPath).isDirectory() && !d.startsWith('__');
    });

    for (const subDir of subDirs) {
      const subFiles = fs.readdirSync(path.join(catDir, subDir)).filter((f) => f.endsWith('.tests.js'));
      for (const file of subFiles) {
        suites.push({ category, file: `${subDir}/${file}`, constellation });
      }
    }
  }

  return suites;
}

const CSS_THEME_MAP: Record<string, string> = {
  'generic_light.css': 'dx.light.css',
  'material_blue_light.css': 'dx.material.blue.light.css',
  'fluent_blue_light.css': 'dx.fluent.blue.light.css',
  'gantt.css': 'dx-gantt.css',
};

function generateTestIndexHtml(suites: TestSuite[]): string {
  const byCategory: Record<string, TestSuite[]> = {};
  for (const s of suites) {
    (byCategory[s.category] ??= []).push(s);
  }

  const links = Object.keys(byCategory).sort().map((cat) => {
    const items = byCategory[cat].map((s) =>
      `<li><a href="/qunit/${s.category}/${s.file}">${s.file}</a></li>`
    ).join('\n');
    return `<h3>${cat} <small>(${byCategory[cat].length})</small></h3><ul>${items}</ul>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <title>QUnit Tests (Vite)</title>
  <style>
    body { font-family: sans-serif; max-width: 900px; margin: 20px auto; }
    h3 { margin: 15px 0 5px; }
    ul { margin: 0; }
    li { margin: 2px 0; }
    small { color: #888; }
  </style>
</head>
<body>
  <h1>QUnit Tests (Vite)</h1>
  <p>Total: ${suites.length} test files</p>
  ${links}
</body>
</html>`;
}

function generateTestPageHtml(category: string, testFile: string): string {
  const testPath = `/testing/tests/${category}/${testFile}`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>QUnit: ${category}/${testFile}</title>
  <link rel="stylesheet" href="/node_modules/qunit/qunit/qunit.css">
  <script src="/node_modules/jquery/dist/jquery.js"></script>
  <script src="/node_modules/sinon/pkg/sinon.js"></script>
  <script src="/node_modules/qunit/qunit/qunit.js"></script>
  <script>
    QUnit.config.autostart = false;
    QUnit.config.reorder = false;
    window.process = window.process || {};
    window.process.env = window.process.env || {};
    window.process.env.NODE_ENV = 'test';
  </script>
  <script src="/testing/helpers/qunitExtensions.js"></script>
  <link rel="stylesheet" href="/artifacts/css/dx.light.css">
</head>
<body>
  <div id="qunit"></div>
  <div id="qunit-fixture"></div>
  <script type="module">
    try {
      await import('/testing/vite-qunit-bootstrap.ts');
      await import('${testPath}');
      window.__testModuleLoaded = true;
    } catch (e) {
      window.__testLoadError = e.message;
      window.__testModuleLoaded = true;
    }
    if (!window.__qunitRunnerMode) {
      QUnit.start();
    }
  </script>
</body>
</html>`;
}

function transformAmdHelper(code: string, id: string): string | null {
  const amdPattern = /\(function\s*\(\s*root\s*,\s*factory\s*\)\s*\{[\s\S]*?define\s*\(\s*function\s*\(\s*require\s*,\s*exports\s*,\s*module\s*\)\s*\{([\s\S]*?)\}\s*\)\s*;[\s\S]*?\}\s*\(\s*(?:window|this)\s*,\s*function\s*\(([\s\S]*?)\)\s*\{([\s\S]*)\}\s*\)\s*\)\s*;?\s*$/;

  const match = code.match(amdPattern);
  if (!match) return null;

  const amdBody = match[1].trim();
  const factoryParams = match[2].trim();
  const factoryBody = match[3];

  const requireCalls: Array<{ varName: string; modulePath: string; property?: string }> = [];
  const requirePattern = /(?:(\w+)\s*=\s*)?(?:root\.(\w+)\s*=\s*)?(?:module\.exports\s*=\s*)?(?:require\(\s*'([^']+)'\s*\)(?:\.(\w+))?)/g;
  let reqMatch;
  while ((reqMatch = requirePattern.exec(amdBody)) !== null) {
    const modulePath = reqMatch[3];
    const property = reqMatch[4];
    const varName = reqMatch[1] || reqMatch[2] || property || path.basename(modulePath, path.extname(modulePath));
    requireCalls.push({ varName, modulePath, property });
  }

  const imports = requireCalls.map((r) => {
    if (r.property) {
      return `import { ${r.property} as ${r.varName} } from '${r.modulePath}';`;
    }
    return `import ${r.varName} from '${r.modulePath}';`;
  }).join('\n');

  const preambleLines: string[] = [];
  const lines = code.split('\n');
  for (const line of lines) {
    if (line.match(/^\s*(?:let|var|const)\s+\w+/) && !line.match(/function\s*\(\s*root/)) {
      preambleLines.push(line);
    } else {
      break;
    }
  }
  const preamble = preambleLines.join('\n');

  const paramList = factoryParams.split(',').map((p) => p.trim()).filter(Boolean);
  const paramImports = paramList.map((param, i) => {
    const existing = requireCalls.find((r) => r.varName === param);
    if (existing) return '';

    if (param === '$' || param === 'jQuery') return `import $ from 'jquery';`;
    if (param === 'inferno') return `import inferno from 'inferno';`;
    return '';
  }).filter(Boolean).join('\n');

  const result = `${preamble ? preamble + '\n' : ''}${imports}
${paramImports}

const __factory = (function(${factoryParams}) {${factoryBody}});
const __result = __factory(${paramList.map((p) => {
    if (p === '$' || p === 'jQuery') return '$';
    if (p === 'inferno') return 'inferno';
    const req = requireCalls.find((r) => r.varName === p);
    if (req) return req.varName;
    return 'undefined';
  }).join(', ')});
export default __result;
`;

  return result;
}

function postTransformPlugin(): PluginOption {
  const defaultCache = new Map<string, boolean>();

  function sourceHasDefault(filePath: string): boolean {
    if (defaultCache.has(filePath)) return defaultCache.get(filePath)!;
    try {
      const src = fs.readFileSync(filePath, 'utf8');
      const has = /\bexport\s+default\b/.test(src) ||
        /\bexport\s*\{[^}]*\bdefault\b/.test(src);
      defaultCache.set(filePath, has);
      return has;
    } catch {
      defaultCache.set(filePath, true);
      return true;
    }
  }

  return {
    name: 'devextreme-post-transform',
    enforce: 'post',

    transform(code: string, id: string) {
      if (id.includes('node_modules')) return undefined;
      if (!id.includes('/js/')) return undefined;
      if (id.includes('/testing/')) return undefined;

      let modified = code;
      let changed = false;

      const namespaceDefaultPattern = /import\s*\*\s*as\s+(\w+)\s+from\s*['"]([^'"]+)['"]\s*;\s*export\s+default\s+\1\s*;/g;
      modified = modified.replace(namespaceDefaultPattern, (match, varName, source) => {
        changed = true;
        return `import * as ${varName} from '${source}'; export default { ...${varName} };`;
      });

      if (changed) {
        return { code: modified, map: null };
      }

      if (sourceHasDefault(id)) return undefined;
      if (!/\bexport\s/.test(code)) return undefined;

      const localNames: string[] = [];
      const directPattern = /\bexport\s+(?:const|let|var|function|class)\s+(\w+)/g;
      let m;
      while ((m = directPattern.exec(code)) !== null) {
        localNames.push(m[1]);
      }

      const localExportEntries: Array<{ local: string; exported: string }> = [];
      const localExportPattern = /\bexport\s*\{\s*([^}]+?)\s*\}(?!\s*from)/g;
      while ((m = localExportPattern.exec(code)) !== null) {
        const entries = m[1].split(',').map((n: string) => {
          const parts = n.trim().split(/\s+as\s+/);
          return { local: parts[0].trim(), exported: (parts[1] || parts[0]).trim() };
        }).filter((e: { local: string; exported: string }) => e.local && e.exported);
        localExportEntries.push(...entries);
      }

      const allLocal = [
        ...localNames.map((n) => ({ local: n, exported: n })),
        ...localExportEntries,
      ];

      if (allLocal.length > 0) {
        const props = allLocal.map((e) =>
          e.local === e.exported ? e.local : `${e.exported}: ${e.local}`
        ).join(', ');
        return {
          code: code + `\nexport default { ${props} };\n`,
          map: null,
        };
      }

      const reExportImports: string[] = [];
      const reExportKeys: string[] = [];
      const reExportPattern = /\bexport\s*\{\s*([^}]+?)\s*\}\s*from\s*["']([^"']+)["']/g;
      let idx = 0;
      while ((m = reExportPattern.exec(code)) !== null) {
        const names = m[1].split(',').map((n: string) => {
          const parts = n.trim().split(/\s+as\s+/);
          return { original: parts[0].trim(), exported: (parts[1] || parts[0]).trim() };
        });
        const source = m[2];
        for (const { original, exported } of names) {
          const alias = `_sd${idx++}`;
          reExportImports.push(`import { ${original} as ${alias} } from ${JSON.stringify(source)};`);
          reExportKeys.push(`${exported}: ${alias}`);
        }
      }

      if (reExportKeys.length > 0) {
        return {
          code: code + `\n${reExportImports.join('\n')}\nexport default { ${reExportKeys.join(', ')} };\n`,
          map: null,
        };
      }

      return undefined;
    },
  };
}

export default function qunitPlugin(): PluginOption[] {
  let suites: TestSuite[] = [];

  const mainPlugin: PluginOption = {
    name: 'devextreme-qunit',
    enforce: 'pre',

    configureServer(server: ViteDevServer) {
      suites = discoverTests();

      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = req.url?.split('?')[0] ?? '';

        if (url === '/qunit' || url === '/qunit/') {
          res.setHeader('Content-Type', 'text/html');
          res.end(generateTestIndexHtml(suites));
          return;
        }

        const testMatch = url.match(/^\/qunit\/([^/]+)\/(.+\.tests\.js)$/);
        if (testMatch) {
          const [, category, testFile] = testMatch;
          const testPath = path.join(TESTS_DIR, category, testFile);
          if (fs.existsSync(testPath)) {
            res.setHeader('Content-Type', 'text/html');
            res.end(generateTestPageHtml(category, testFile));
            return;
          }
        }

        next();
      });
    },

    resolveId(source: string) {
      if (source.endsWith('!')) {
        const clean = source.slice(0, -1);

        const cssFile = CSS_THEME_MAP[clean];
        if (cssFile) {
          return path.join(ARTIFACTS_CSS_DIR, cssFile);
        }

        if (clean.endsWith('.json')) {
          const jsonPath = path.resolve(JS_DIR, clean);
          if (fs.existsSync(jsonPath)) {
            return jsonPath;
          }
        }
      }

      return undefined;
    },

    transform(code: string, id: string) {
      if (id.includes('/testing/helpers/') && id.endsWith('.js')) {
        if (code.includes('define(function(require')) {
          const transformed = transformAmdHelper(code, id);
          if (transformed) {
            return { code: transformed, map: null };
          }
        }
      }

      return undefined;
    },
  };

  return [mainPlugin, postTransformPlugin()];
}

export { discoverTests, type TestSuite };
