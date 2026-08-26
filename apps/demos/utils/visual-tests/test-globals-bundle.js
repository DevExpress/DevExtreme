// Bundles just the devextreme modules test-code.js files need, exposed as window.DevExpress —
// a lightweight stand-in for the UMD global jQuery demos get for free from dx.all.js.

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const esbuild = require('esbuild');

const DEMOS_ROOT = path.join(__dirname, '..', '..');
const OUT_FILE = path.join(DEMOS_ROOT, 'bundles', 'vendor', 'test-globals.js');

const IMPORT_AND_RE = /testUtils\.importAnd\(\(\)\s*=>\s*(\[[^\]]+\]|'[^']+')\s*,\s*\(\)\s*=>\s*(\[[^\]]+\]|DevExpress\.[a-zA-Z0-9_.]+)/g;

function parseList(raw) {
  if (raw.startsWith('[')) {
    return Array.from(raw.matchAll(/'([^']+)'|(DevExpress\.[a-zA-Z0-9_.]+)/g))
      .map((m) => m[1] || m[2]);
  }
  return [raw.replace(/'/g, '')];
}

function discoverTestGlobals() {
  const specifierToPath = new Map();
  const files = glob.sync('Demos/**/test-code.js', { cwd: DEMOS_ROOT });

  for (const file of files) {
    const content = fs.readFileSync(path.join(DEMOS_ROOT, file), 'utf8');
    IMPORT_AND_RE.lastIndex = 0;
    let match = IMPORT_AND_RE.exec(content);
    while (match) {
      const specifiers = parseList(match[1]);
      const accessors = parseList(match[2]);
      specifiers.forEach((specifier, i) => {
        const accessor = accessors[i];
        if (specifier && accessor) {
          specifierToPath.set(specifier, accessor.replace(/^DevExpress\./, ''));
        }
      });
      match = IMPORT_AND_RE.exec(content);
    }
  }

  return specifierToPath;
}

let cachedPath = null;

// Written to disk (not inlined) so TestCafe can serve it as a cached <script src>.
function buildTestGlobalsScript() {
  if (cachedPath !== null) return cachedPath;

  const specifierToPath = discoverTestGlobals();
  if (specifierToPath.size === 0) {
    cachedPath = '';
    return cachedPath;
  }

  const entries = Array.from(specifierToPath.entries());
  const namespaces = new Set(entries.map(([, accessorPath]) => accessorPath.split('.')[0]));

  const entryContents = [
    ...entries.map(([specifier], i) => `import * as m${i} from ${JSON.stringify(specifier)};`),
    'window.DevExpress = window.DevExpress || {};',
    ...Array.from(namespaces).map((ns) => `window.DevExpress.${ns} = window.DevExpress.${ns} || {};`),
    ...entries.map(([, accessorPath], i) => `window.DevExpress.${accessorPath} = m${i}.default;`),
  ].join('\n');

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });

  esbuild.buildSync({
    stdin: {
      contents: entryContents,
      resolveDir: DEMOS_ROOT,
      loader: 'js',
    },
    outfile: OUT_FILE,
    bundle: true,
    format: 'iife',
    minify: true,
    logLevel: 'silent',
  });

  cachedPath = OUT_FILE;
  return cachedPath;
}

module.exports = { buildTestGlobalsScript };
