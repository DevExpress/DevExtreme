// Exposes the devextreme widgets test-code.js needs as window.DevExpress, matching React/Vue demos by identity via vendorGlobalPlugin (Angular does this inline in its own bundle instead, see csp-bundle-angular.js).

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const esbuild = require('esbuild');

const DEMOS_ROOT = path.join(__dirname, '..', '..');
const SUPPORTED_FRAMEWORKS = new Set(['React', 'Vue']);

const IMPORT_AND_RE = /testUtils\.importAnd\(\(\)\s*=>\s*(\[[^\]]+\]|'[^']+')\s*,\s*\(\)\s*=>\s*(\[[^\]]+\]|DevExpress\.[a-zA-Z0-9_.]+)/g;

function parseList(raw) {
  if (raw.startsWith('[')) {
    return Array.from(raw.matchAll(/'([^']+)'|(DevExpress\.[a-zA-Z0-9_.]+)/g))
      .map((m) => m[1] || m[2]);
  }
  return [raw.replace(/'/g, '')];
}

// Shared with csp-bundle-angular.js, which runs this per-demo instead of globbing every demo.
function discoverTestGlobalsFromContent(content, specifierToPath = new Map()) {
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
  return specifierToPath;
}

function discoverTestGlobals() {
  const specifierToPath = new Map();
  const files = glob.sync('Demos/**/test-code.js', { cwd: DEMOS_ROOT });

  for (const file of files) {
    const content = fs.readFileSync(path.join(DEMOS_ROOT, file), 'utf8');
    discoverTestGlobalsFromContent(content, specifierToPath);
  }

  return specifierToPath;
}

function outputPath(framework) {
  return path.join(DEMOS_ROOT, 'bundles', 'vendor', `test-globals-${framework.toLowerCase()}.js`);
}

// Requires csp-bundle/vendor-bundle lazily so importing this module doesn't pull them into Jest's coverage run.
async function buildTestGlobalsScript(framework) {
  if (!SUPPORTED_FRAMEWORKS.has(framework)) return null;

  const specifierToPath = discoverTestGlobals();
  if (specifierToPath.size === 0) return null;

  const entries = Array.from(specifierToPath.entries());
  const namespaces = new Set(entries.map(([, accessorPath]) => accessorPath.split('.')[0]));

  // eslint-disable-next-line global-require
  const { getVendorManifest } = require('../server/vendor-bundle');
  const manifest = getVendorManifest(framework);
  if (!manifest) return null;

  // Poll for the vendor global instead of a fixed delay — it loads via <script src>.
  const entryContents = `(function wait() {
    if (typeof window.${manifest.globalVar} === 'undefined') {
      setTimeout(wait, 50);
      return;
    }
    Promise.all([${entries.map(([specifier]) => `import(${JSON.stringify(specifier)})`).join(', ')}]).then(function (m) {
      window.DevExpress = window.DevExpress || {};
      ${Array.from(namespaces).map((ns) => `window.DevExpress.${ns} = window.DevExpress.${ns} || {};`).join('\n      ')}
      ${entries.map(([, accessorPath], i) => `window.DevExpress.${accessorPath} = m[${i}].default;`).join('\n      ')}
    });
  })();`;

  const outFile = outputPath(framework);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });

  // eslint-disable-next-line global-require
  const { getSharedOptions } = require('../server/csp-bundle');
  const shared = getSharedOptions(framework);
  await esbuild.build({
    ...shared,
    stdin: {
      contents: entryContents,
      resolveDir: DEMOS_ROOT,
      loader: 'js',
    },
    outfile: outFile,
    minify: true,
  });

  return outFile;
}

function getTestGlobalsScriptPath(framework) {
  if (!SUPPORTED_FRAMEWORKS.has(framework)) return '';
  const outFile = outputPath(framework);
  return fs.existsSync(outFile) ? outFile : '';
}

module.exports = { buildTestGlobalsScript, getTestGlobalsScriptPath, discoverTestGlobalsFromContent };
