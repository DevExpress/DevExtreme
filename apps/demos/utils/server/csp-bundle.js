// Pre-bundles React/Vue demos with esbuild for the CSP check, so it validates the
// production CSP profile. Output: apps/demos/csp-bundled-demos/<Widget>/<Name>/<Framework>/index.html.
// Angular is delegated to csp-bundle-angular.js.

const path = require('path');
const fs = require('fs');
const os = require('os');
const esbuild = require('esbuild');
const { extractDemoHeadExtras, extractDemoBodyInner } = require('./demo-html');

const FRAMEWORK_ARG = (process.argv.find((a) => a.startsWith('--framework=')) || '').split('=')[1];
const FRAMEWORK = FRAMEWORK_ARG || process.env.CSP_FRAMEWORKS || 'React';

// ReactJs is the generated JavaScript twin of each React demo (see
// utils/ts-to-js-converter) — same JSX sources with .js extensions, which the
// shared '.js': 'jsx' loader already covers, so it needs no separate handling.
const SUPPORTED = ['React', 'ReactJs', 'Vue', 'Angular'];
if (!SUPPORTED.includes(FRAMEWORK)) {
  console.log(`csp-bundle: framework ${FRAMEWORK} is not supported (only ${SUPPORTED.join(', ')}). Nothing to do.`);
  process.exit(0);
}

const IS_ANGULAR = FRAMEWORK === 'Angular';

// Write bundle.js/bundle.css next to each demo's own source (the real, only
// demo tree) instead of into the csp-bundled-demos/ side directory used by the
// CSP-only check. This is what CI's demo-build step uses in production.
const IN_PLACE = process.env.BUNDLE_IN_PLACE === '1';

const DEMOS_APP_ROOT = path.join(__dirname, '..', '..');
const SRC_DEMOS_DIR = path.join(DEMOS_APP_ROOT, 'Demos');
const OUT_ROOT = IN_PLACE ? SRC_DEMOS_DIR : path.join(DEMOS_APP_ROOT, 'csp-bundled-demos');
const NODE_MODULES = path.join(DEMOS_APP_ROOT, 'node_modules');

const CONCURRENCY = (() => {
  const fromEnv = parseInt(process.env.CSP_BUNDLE_CONCURRENCY, 10);
  if (fromEnv > 0) return fromEnv;
  return Math.max(4, (os.cpus() || []).length - 1);
})();

// Optional round-robin sharding across parallel CI jobs (CSP_SHARD_TOTAL /
// CSP_SHARD_INDEX, 1-based).
const SHARD_TOTAL = Math.max(1, parseInt(process.env.CSP_SHARD_TOTAL, 10) || 1);
const SHARD_INDEX = (() => {
  const n = parseInt(process.env.CSP_SHARD_INDEX, 10);
  return n >= 1 && n <= SHARD_TOTAL ? n : 1;
})();

function applyShard(demos) {
  if (SHARD_TOTAL <= 1) return demos;
  const sorted = [...demos].sort(
    (a, b) => `${a.widget}/${a.name}`.localeCompare(`${b.widget}/${b.name}`),
  );
  return sorted.filter((_, i) => i % SHARD_TOTAL === SHARD_INDEX - 1);
}

function findDemos() {
  const out = [];
  if (!fs.existsSync(SRC_DEMOS_DIR)) return out;

  // Optional substring filter for local smoke tests: CSP_BUNDLE_FILTER=Button/Icons
  const filter = (process.env.CSP_BUNDLE_FILTER || '').trim();

  const widgets = fs.readdirSync(SRC_DEMOS_DIR, { withFileTypes: true })
    .filter((w) => w.isDirectory());
  for (const widget of widgets) {
    const widgetDir = path.join(SRC_DEMOS_DIR, widget.name);
    const demos = fs.readdirSync(widgetDir, { withFileTypes: true })
      .filter((d) => d.isDirectory());
    for (const demo of demos) {
      const fwDir = path.join(widgetDir, demo.name, FRAMEWORK);
      const matchesFilter = !filter || `${widget.name}/${demo.name}`.includes(filter);
      if (matchesFilter && fs.existsSync(path.join(fwDir, 'index.html'))) {
        out.push({ widget: widget.name, name: demo.name, srcDir: fwDir });
      }
    }
  }
  return out;
}

function findEntry(srcDir) {
  for (const candidate of ['index.tsx', 'index.ts', 'index.jsx', 'index.js']) {
    const p = path.join(srcDir, candidate);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// Treat imports of missing .css files as empty.
const ignoreMissingCssPlugin = {
  name: 'csp-bundle:ignore-missing-css',
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, (args) => {
      const fullPath = path.resolve(args.resolveDir, args.path);
      if (!fs.existsSync(fullPath)) {
        return { path: fullPath, namespace: 'csp-bundle-empty-css' };
      }
      return null;
    });
    build.onLoad({ filter: /.*/, namespace: 'csp-bundle-empty-css' }, () => ({
      contents: '',
      loader: 'css',
    }));
  },
};

// Resolve demo-specific bare specifiers (anti-forgery, globalize/<sub>) for esbuild.
const ANTI_FORGERY_PATH = path.join(DEMOS_APP_ROOT, 'shared', 'anti-forgery', 'fetch-override.js');
const GLOBALIZE_BASE = path.join(NODE_MODULES, 'globalize', 'dist', 'globalize');

const demoAliasesPlugin = {
  name: 'csp-bundle:demo-aliases',
  setup(build) {
    build.onResolve({ filter: /^anti-forgery$/ }, () => ({ path: ANTI_FORGERY_PATH }));

    build.onResolve({ filter: /^globalize\/[^/]+$/ }, (args) => {
      const sub = args.path.slice('globalize/'.length);
      const full = path.join(GLOBALIZE_BASE, `${sub}.js`);
      if (fs.existsSync(full)) return { path: full };
      return null;
    });
  },
};

// Force a single devextreme copy: collapse resolved cjs paths to their esm twin.
// Mixing both (esm via devextreme-react, cjs via aspnet-data require) bundles two
// copies of the Class/callBase system and infinitely recurses in the data path.
const DX_CJS_SEG = `${path.sep}devextreme${path.sep}cjs${path.sep}`;
const DX_ESM_SEG = `${path.sep}devextreme${path.sep}esm${path.sep}`;
const devextremeDedupePlugin = {
  name: 'csp-bundle:devextreme-single-copy',
  setup(build) {
    build.onResolve({ filter: /^devextreme(\/.*)?$/ }, async (args) => {
      // Re-entry guard: our own build.resolve() below re-triggers this hook.
      if (args.pluginData && args.pluginData.dxDeduped) return null;
      const resolved = await build.resolve(args.path, {
        kind: args.kind,
        importer: args.importer,
        resolveDir: args.resolveDir,
        pluginData: { dxDeduped: true },
      });
      if (resolved.errors.length > 0) return resolved;
      if (resolved.path.includes(DX_CJS_SEG)) {
        const esmPath = resolved.path.replace(DX_CJS_SEG, DX_ESM_SEG);
        if (fs.existsSync(esmPath)) {
          return { path: esmPath, external: resolved.external };
        }
      }
      return { path: resolved.path, external: resolved.external };
    });
  },
};

// Vue's esbuild plugin is safe to reuse across builds, so it's memoized per
// process rather than tied to the CLI's single module-level FRAMEWORK — lets
// getSharedOptions() be called for either framework from a long-lived process
// (e.g. the dev server's lazy build-on-request path), not just this CLI's
// single-framework-per-run invocation.
let vuePluginInstance = null;
function getVuePlugin() {
  if (!vuePluginInstance) {
    // eslint-disable-next-line global-require
    const mod = require('esbuild-plugin-vue3');
    const factory = typeof mod === 'function' ? mod : (mod.default || mod);
    vuePluginInstance = factory();
  }
  return vuePluginInstance;
}

function getSharedOptions(framework) {
  return {
    bundle: true,
    minify: false,
    format: 'iife',
    loader: {
      '.js': 'jsx',
      '.png': 'dataurl',
      '.jpg': 'dataurl',
      '.jpeg': 'dataurl',
      '.gif': 'dataurl',
      '.svg': 'dataurl',
    },
    alias: {
      react: path.join(NODE_MODULES, 'react'),
      'react-dom': path.join(NODE_MODULES, 'react-dom'),
      // Alias bare 'globalize' to the browser build.
      globalize: path.join(NODE_MODULES, 'globalize', 'dist', 'globalize.js'),
    },
    define: {
      'process.env.NODE_ENV': '"production"',
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
    },
    logLevel: 'silent',
    plugins: [
      devextremeDedupePlugin,
      demoAliasesPlugin,
      ignoreMissingCssPlugin,
      ...(framework === 'Vue' ? [getVuePlugin()] : []),
    ],
  };
}

// Reuse the dev <body> markup (minus its <script> tags) so the bundle
// renders into the same mount node — a few demos don't use `#app`.
const DEFAULT_BODY_INNER = `<div class="demo-container">
      <div id="app"></div>
    </div>`;

function buildHtml({ jsFile, cssFiles, srcDir }) {
  // Theme first, then whatever the demo declared (dx-gantt.css, font-awesome, …),
  // then the demo's own styles last — the cascade order the dev page had.
  const headLinks = [
    '<link rel="stylesheet" type="text/css" href="../../../../node_modules/devextreme-dist/css/dx.light.css" />',
    ...extractDemoHeadExtras(srcDir),
    ...cssFiles.map((f) => `<link rel="stylesheet" type="text/css" href="./${f}" />`),
  ].join('\n    ');

  const bodyInner = extractDemoBodyInner(srcDir) || DEFAULT_BODY_INNER;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>DevExtreme Demo</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    ${headLinks}
  </head>
  <body class="dx-viewport">
    ${bodyInner}
    <script src="./${jsFile}"></script>
  </body>
</html>
`;
}

// Core esbuild step, parameterized by destination + framework so it can be
// reused both for the CSP-check output (below) and for an in-place build that
// writes bundle.js next to the demo's own source (see utils/build/).
async function bundleDemoTo({ srcDir, destDir, framework }) {
  const entry = findEntry(srcDir);
  if (!entry) return { ok: false, reason: 'no entry point (index.tsx|ts|jsx|js)' };

  fs.mkdirSync(destDir, { recursive: true });

  let result;
  try {
    result = await esbuild.build({
      ...getSharedOptions(framework),
      entryPoints: [entry],
      outdir: destDir,
      entryNames: 'bundle',
      assetNames: 'bundle',
      metafile: true,
    });
  } catch (err) {
    return { ok: false, reason: (err && err.message) || String(err) };
  }

  const outputs = Object.keys(result.metafile && result.metafile.outputs ? result.metafile.outputs : {});
  const jsFiles = outputs.filter((o) => o.endsWith('.js')).map((o) => path.basename(o));
  const cssFiles = outputs.filter((o) => o.endsWith('.css')).map((o) => path.basename(o));

  if (jsFiles.length === 0) return { ok: false, reason: 'no JS output produced' };

  // Standalone styles.css that the dev demo references separately (React) —
  // normalized to bundle.css too, so callers only ever deal with one CSS name.
  const stylesSrc = path.join(srcDir, 'styles.css');
  if (cssFiles.length === 0 && fs.existsSync(stylesSrc)) {
    const dest = path.join(destDir, 'bundle.css');
    fs.copyFileSync(stylesSrc, dest);
    cssFiles.push('bundle.css');
  }

  return { ok: true, jsFiles, cssFiles };
}

async function bundleDemo(demo, { destDir: destDirOverride, framework = FRAMEWORK } = {}) {
  const destDir = destDirOverride || path.join(OUT_ROOT, demo.widget, demo.name, FRAMEWORK);
  const result = await bundleDemoTo({ srcDir: demo.srcDir, destDir, framework });
  if (!result.ok) return result;

  fs.writeFileSync(
    path.join(destDir, 'index.html'),
    buildHtml({ jsFile: result.jsFiles[0], cssFiles: result.cssFiles, srcDir: demo.srcDir }),
  );

  return { ok: true };
}

async function runPool(items, concurrency, fn) {
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const i = nextIndex;
      nextIndex += 1;
      await fn(items[i], i);
    }
  }
  const workerCount = Math.max(1, Math.min(concurrency || 1, items.length));
  await Promise.all(Array.from({ length: workerCount }, worker));
}

async function main() {
  console.log(`Framework: ${FRAMEWORK}`);
  console.log(`Concurrency: ${CONCURRENCY}`);
  console.log(`Source: ${SRC_DEMOS_DIR}`);
  console.log(`Output: ${OUT_ROOT}\n`);

  // Wipe only this framework's previous output so per-framework runs don't clash.
  // In-place mode writes into the demo's own source folder, which must NOT be
  // wiped (that would delete the demo's actual source, not just old output).
  if (!IN_PLACE && fs.existsSync(OUT_ROOT)) {
    const existingWidgets = fs.readdirSync(OUT_ROOT, { withFileTypes: true })
      .filter((w) => w.isDirectory());
    for (const widget of existingWidgets) {
      const existingDemos = fs.readdirSync(path.join(OUT_ROOT, widget.name), { withFileTypes: true })
        .filter((d) => d.isDirectory());
      for (const demo of existingDemos) {
        const fwDir = path.join(OUT_ROOT, widget.name, demo.name, FRAMEWORK);
        if (fs.existsSync(fwDir)) fs.rmSync(fwDir, { recursive: true, force: true });
      }
    }
  }
  fs.mkdirSync(OUT_ROOT, { recursive: true });

  const allDemos = findDemos();
  const demos = applyShard(allDemos);
  const shardNote = SHARD_TOTAL > 1
    ? ` — shard ${SHARD_INDEX}/${SHARD_TOTAL}: ${demos.length} of ${allDemos.length}`
    : '';
  console.log(`Discovered ${allDemos.length} ${FRAMEWORK} demo(s)${shardNote}\n`);

  let ok = 0;
  let fail = 0;
  const failures = [];
  const t0 = Date.now();

  await runPool(demos, CONCURRENCY, async (demo, i) => {
    const idx = i + 1;
    const res = await bundleDemo(demo);
    if (res.ok) {
      ok += 1;
      if (idx % 25 === 0 || idx === demos.length) {
        console.log(`  [${idx}/${demos.length}] bundled (${ok} ok / ${fail} fail)`);
      }
    } else {
      fail += 1;
      failures.push({ ...demo, reason: res.reason });
      console.log(`  ❌ [${idx}/${demos.length}] ${demo.widget}/${demo.name} — ${res.reason}`);
    }
  });

  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\nDone in ${dt}s — ok=${ok} fail=${fail}`);

  if (fail > 0) {
    console.log('\nFailed demos:');
    for (const f of failures) {
      console.log(`  ${f.widget}/${f.name} — ${f.reason}`);
    }
    process.exitCode = 1;
  }
}

if (require.main === module) {
  // eslint-disable-next-line global-require
  const entrypoint = IS_ANGULAR ? require('./csp-bundle-angular').main : main;

  entrypoint().then(() => {
    process.exit(process.exitCode || 0);
  }).catch((err) => {
    console.error('csp-bundle failed:', err);
    process.exit(1);
  });
}

module.exports = {
  bundleDemo, bundleDemoTo, findEntry, buildHtml, extractDemoBodyInner,
};
