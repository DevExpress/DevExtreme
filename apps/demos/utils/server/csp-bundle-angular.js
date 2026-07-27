/* eslint-disable global-require, import/no-dynamic-require */

// Bundles every Angular demo into csp-bundled-demos/<Widget>/<Demo>/Angular/ via
// AOT (@angular/build/private's createCompilerPlugin). Kept separate from
// csp-bundle.js, which delegates here for --framework=Angular.

const path = require('path');
const fs = require('fs');
const os = require('os');
const esbuild = require('esbuild');

const DEMOS_APP_ROOT = path.resolve(__dirname, '..', '..');
const REPO_ROOT = path.resolve(DEMOS_APP_ROOT, '..', '..');
const SRC_DEMOS_DIR = path.join(DEMOS_APP_ROOT, 'Demos');
const OUT_ROOT = path.join(DEMOS_APP_ROOT, 'csp-bundled-demos');
const NODE_MODULES = path.join(DEMOS_APP_ROOT, 'node_modules');
const FRAMEWORK = 'Angular';

const CONCURRENCY = (() => {
  const fromEnv = parseInt(process.env.CSP_BUNDLE_CONCURRENCY, 10);
  if (fromEnv > 0) return fromEnv;
  return Math.max(2, (os.cpus() || []).length - 1);
})();

const RETRY_CONCURRENCY = (() => {
  const fromEnv = parseInt(process.env.CSP_BUNDLE_RETRY_CONCURRENCY, 10);
  if (fromEnv > 0) return fromEnv;
  return 2;
})();

// Demos per esbuild build. Larger batches amortize the per-build Angular
// compilation setup but are memory-bound — too large OOMs the CI runner. 12 is
// the safe default; raise via CSP_BUNDLE_BATCH_SIZE only on a high-RAM box.
const BATCH_SIZE = (() => {
  const fromEnv = parseInt(process.env.CSP_BUNDLE_BATCH_SIZE, 10);
  if (fromEnv > 0) return fromEnv;
  return 12;
})();

const BATCH_CONCURRENCY = (() => {
  const fromEnv = parseInt(process.env.CSP_BUNDLE_BATCH_CONCURRENCY, 10);
  if (fromEnv > 0) return fromEnv;
  return 1;
})();

// Optional substring filter for local smoke tests, e.g. CSP_BUNDLE_FILTER=Common/FormsOverview.
const FILTER = (process.env.CSP_BUNDLE_FILTER || '').trim();

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

const SHARED_TSCONFIG_TEMPLATE = path.join(__dirname, 'tsconfig.csp-bundle-angular.json');
const GENERATED_TSCONFIG_DIR = path.join(__dirname, '.csp-bundle-angular-tsconfigs');
const ANGULAR_ZONE_SCRIPT = '../../../../node_modules/zone.js/bundles/zone.umd.js';

// Skipped from the bundled Angular CSP check. NG0300: devextreme-angular's
// fesm2022 build duplicates DxoPivotGridFieldChooserTextsComponent across the
// pivot-grid and field-chooser entries, so this demo (using both) registers two
// components for one selector. A library packaging defect, not a demo-source bug.
const KNOWN_BROKEN_DEMOS = new Set([
  'PivotGrid/StandaloneFieldChooser',
]);

// @angular/build is transitive via @angular-devkit/build-angular; resolve through it for pnpm.
function resolveAngularBuildPrivate() {
  const buildAngularPkg = require.resolve('@angular-devkit/build-angular/package.json', {
    paths: [DEMOS_APP_ROOT],
  });
  const buildAngularDir = path.dirname(buildAngularPkg);
  return require(require.resolve('@angular/build/private', { paths: [buildAngularDir] }));
}

// Per demo, write a tsconfig that extends the shared template and lists the entry
// in `files` (ngc rejects empty files+include, TS18002). Slug avoids collisions.
function writeTsconfig(name, entryPaths) {
  fs.mkdirSync(GENERATED_TSCONFIG_DIR, { recursive: true });
  const slug = name.replace(/[\\/]/g, '__').replace(/[^a-zA-Z0-9_.-]/g, '_');
  const dest = path.join(GENERATED_TSCONFIG_DIR, `${slug}.tsconfig.json`);
  // `extends` resolves relative to this file, so use a relative path.
  const extendsRel = path
    .relative(path.dirname(dest), SHARED_TSCONFIG_TEMPLATE)
    .split(path.sep)
    .join('/');
  const config = {
    extends: extendsRel,
    files: entryPaths.map((entryPath) => path.relative(path.dirname(dest), entryPath).split(path.sep).join('/')),
  };
  fs.writeFileSync(dest, `${JSON.stringify(config, null, 2)}\n`);
  return dest;
}

function writeDemoTsconfig(entryPath) {
  return writeTsconfig(path.relative(REPO_ROOT, entryPath), [entryPath]);
}

function buildHtml({ jsFiles, cssFiles }) {
  const cssLinks = [
    '<link rel="stylesheet" type="text/css" href="../../../../node_modules/devextreme-dist/css/dx.light.css" />',
    ...cssFiles.map((f) => `<link rel="stylesheet" type="text/css" href="./${f}" />`),
  ].join('\n    ');
  const scripts = jsFiles
    .map((f) => {
      const src = f.startsWith('.') ? f : `./${f}`;
      const type = f === ANGULAR_ZONE_SCRIPT ? '' : ' type="module"';
      return `<script src="${src}"${type}></script>`;
    })
    .join('\n    ');
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>DevExtreme Demo</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    ${cssLinks}
  </head>
  <body class="dx-viewport">
    <div class="demo-container">
      <demo-app>Loading...</demo-app>
    </div>
    ${scripts}
  </body>
</html>
`;
}

// Angular demos use app/app.component.ts as both component and bootstrap entry.
function findAngularEntry(srcDir) {
  const candidate = path.join(srcDir, 'app', 'app.component.ts');
  if (fs.existsSync(candidate)) return candidate;
  for (const name of ['main.ts', 'index.ts']) {
    const p = path.join(srcDir, name);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function findDemos() {
  const out = [];
  const skipped = [];
  if (!fs.existsSync(SRC_DEMOS_DIR)) return { out, skipped };

  const widgets = fs.readdirSync(SRC_DEMOS_DIR, { withFileTypes: true }).filter((w) => w.isDirectory());
  for (const widget of widgets) {
    const widgetDir = path.join(SRC_DEMOS_DIR, widget.name);
    const demos = fs.readdirSync(widgetDir, { withFileTypes: true }).filter((d) => d.isDirectory());
    for (const demo of demos) {
      const key = `${widget.name}/${demo.name}`;
      const fwDir = path.join(widgetDir, demo.name, FRAMEWORK);
      const matchesFilter = !FILTER || key.includes(FILTER);
      if (matchesFilter && fs.existsSync(path.join(fwDir, 'index.html'))) {
        const entry = findAngularEntry(fwDir);
        if (entry) {
          if (KNOWN_BROKEN_DEMOS.has(key)) {
            skipped.push({ widget: widget.name, name: demo.name });
          } else {
            out.push({ widget: widget.name, name: demo.name, srcDir: fwDir, entry });
          }
        }
      }
    }
  }
  return { out, skipped };
}

// ---- CSS asset shim infrastructure ----
// Demo component CSS uses url() paths that assumed inline injection (resolved
// against the document URL). Under AOT they resolve against the CSS file location
// and fall one dir short, so we symlink the asset at the "wrong" location.
const ASSET_EXT_RE = /\.(png|jpe?g|gif|svg|webp|ico|avif)(\?[^)'"\s]*)?$/i;
const URL_RE = /url\(\s*(['"]?)([^)'"]+?)\1\s*\)/g;

function rescueAssetPath(cssFile, urlSpec) {
  if (path.isAbsolute(urlSpec) || /^[a-z]+:/i.test(urlSpec)) return null;
  const direct = path.resolve(path.dirname(cssFile), urlSpec);
  if (fs.existsSync(direct)) return direct;
  const tail = urlSpec.replace(/^(\.\.[\\/])+/, '');
  let dir = path.dirname(cssFile);
  while (dir !== path.dirname(dir)) {
    const candidate = path.join(dir, tail);
    if (fs.existsSync(candidate)) return candidate;
    dir = path.dirname(dir);
  }
  return null;
}

const STYLE_URLS_RE = /styleUrls\s*:\s*\[([^\]]*)\]/g;
const STYLE_URL_ITEM_RE = /['"`]([^'"`]+)['"`]/g;
function discoverComponentStyleFiles(tsFiles) {
  const result = new Set();
  for (const tsFile of tsFiles) {
    if (fs.existsSync(tsFile)) {
      const src = fs.readFileSync(tsFile, 'utf8');
      for (const m of src.matchAll(STYLE_URLS_RE)) {
        for (const item of m[1].matchAll(STYLE_URL_ITEM_RE)) {
          // Drop the SystemJS `${modulePrefix}` placeholder; under AOT it collapses to ''.
          const cleaned = item[1].includes('${') ? item[1].replace(/\$\{[^}]+\}/g, '') : item[1];
          result.add(path.resolve(path.dirname(tsFile), cleaned));
        }
      }
    }
  }
  return Array.from(result);
}

// Build a deduplicated list of (wrongPath -> realPath) asset shims across all demos.
function computeGlobalShims(allCssFiles) {
  const seen = new Map(); // wrongPath -> { rescued }
  for (const cssFile of allCssFiles) {
    if (fs.existsSync(cssFile)) {
      const src = fs.readFileSync(cssFile, 'utf8');
      for (const m of src.matchAll(URL_RE)) {
        const spec = m[2];
        if (ASSET_EXT_RE.test(spec)) {
          const wrongPath = path.resolve(path.dirname(cssFile), spec);
          if (!fs.existsSync(wrongPath) && !seen.has(wrongPath)) {
            const rescued = rescueAssetPath(cssFile, spec);
            if (rescued) {
              seen.set(wrongPath, { rescued });
            }
          }
        }
      }
    }
  }
  return Array.from(seen.entries()).map(([wrongPath, v]) => ({ wrongPath, rescued: v.rescued }));
}

function installShims(shims) {
  const installed = [];
  for (const { wrongPath, rescued } of shims) {
    const createdDirs = [];
    let dir = path.dirname(wrongPath);
    const toCreate = [];
    while (!fs.existsSync(dir)) {
      toCreate.push(dir);
      dir = path.dirname(dir);
    }
    for (const d of toCreate.reverse()) {
      fs.mkdirSync(d);
      createdDirs.push(d);
    }
    try {
      fs.symlinkSync(rescued, wrongPath);
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
    installed.push({ link: wrongPath, createdDirs });
  }
  return installed;
}

function removeShims(installed) {
  for (const { link, createdDirs } of installed) {
    try { fs.unlinkSync(link); } catch { /* already gone */ }
    for (const d of createdDirs) {
      try {
        if (fs.readdirSync(d).length === 0) fs.rmdirSync(d);
      } catch { /* not ours */ }
    }
  }
}

// ---- SystemJS-style templateUrl / styleUrls patcher ----
// Demo components use SystemJS-era paths (`.${modulePrefix}/<name>.html`) that
// resolve wrong under AOT. The real resource is always a sibling of the .ts with
// the same basename, so rewrite to `./<basename>.<ext>` and feed the patched copy
// (written next to the original so its relative imports still resolve) via
// fileReplacements.
const PATCHED_TS_PREFIX = '.csp-bundle-angular-patched.';
const TEMPLATE_URL_RE = /templateUrl\s*:\s*([`'"])([^`'"]+)\1/g;
const STYLE_URLS_INLINE_RE = /styleUrls\s*:\s*\[\s*([`'"])([^`'"]+)\1\s*\]/g;
const allPatchedTsFiles = new Set();

function aotRelativeFor(tsFile, originalSpec) {
  // The original spec embeds the SystemJS `${modulePrefix}` plus the dir name.
  // The real resource is a sibling of the .ts with the same basename.
  const ext = path.extname(originalSpec);
  if (!ext) return null;
  const tsBase = path.basename(tsFile, '.ts');
  return `./${tsBase}${ext}`;
}

function patchedSiblingPath(tsFile) {
  return path.join(path.dirname(tsFile), `${PATCHED_TS_PREFIX}${path.basename(tsFile)}`);
}

function patchComponentTs(tsFile) {
  if (!fs.existsSync(tsFile)) return null;
  const original = fs.readFileSync(tsFile, 'utf8');
  let patched = original;
  patched = patched.replace(TEMPLATE_URL_RE, (match, _quote, spec) => {
    if (!spec.includes('${') && !spec.includes('/')) return match;
    const fixed = aotRelativeFor(tsFile, spec);
    if (!fixed) return match;
    return `templateUrl: '${fixed}'`;
  });
  patched = patched.replace(STYLE_URLS_INLINE_RE, (match, _quote, spec) => {
    if (!spec.includes('${') && !spec.includes('/')) return match;
    const fixed = aotRelativeFor(tsFile, spec);
    if (!fixed) return match;
    return `styleUrls: ['${fixed}']`;
  });
  // Prepend @ts-nocheck so JIT-era demo code (never strictly typed) compiles under AOT.
  patched = `// @ts-nocheck\n${patched}`;
  const dest = patchedSiblingPath(tsFile);
  fs.writeFileSync(dest, patched);
  allPatchedTsFiles.add(dest);
  return dest;
}

function cleanupPatchedTsFiles() {
  for (const f of allPatchedTsFiles) {
    try { fs.unlinkSync(f); } catch { /* already gone */ }
  }
  allPatchedTsFiles.clear();
}

// Safety net: delete patched-TS scratch files left behind by a crashed run.
function sweepStalePatchedTsFiles(rootDir) {
  if (!fs.existsSync(rootDir)) return;
  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    const full = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      sweepStalePatchedTsFiles(full);
    } else if (entry.isFile() && entry.name.startsWith(PATCHED_TS_PREFIX)) {
      try { fs.unlinkSync(full); } catch { /* race */ }
    }
  }
}

// Collect every .ts file under the demo's app/ subtree (all need @ts-nocheck),
// excluding patch siblings so re-runs are idempotent.
function findDemoTsFiles(rootDir) {
  const out = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); } else if (
        entry.isFile()
        && /\.ts$/.test(entry.name)
        && !entry.name.endsWith('.d.ts')
        && !entry.name.startsWith(PATCHED_TS_PREFIX)
      ) {
        out.push(full);
      }
    }
  }
  walk(rootDir);
  return out;
}

// Map the bare `anti-forgery` specifier as the SystemJS config does.
const ANTI_FORGERY_PATH = path.join(DEMOS_APP_ROOT, 'shared', 'anti-forgery', 'fetch-override.js');
const antiForgeryPlugin = {
  name: 'csp-bundle-angular:anti-forgery',
  setup(build) {
    build.onResolve({ filter: /^anti-forgery$/ }, () => ({ path: ANTI_FORGERY_PATH }));
  },
};

// ---- single @angular copy ----
// The pnpm store holds several @angular/core versions, so an importer-relative
// resolve can bundle two — two DI systems (NG0203/NG05100/NG0300). Resolve every
// @angular/* from a single base (apps/demos) so the bundle shares one copy.
const angularSingleCopyPlugin = {
  name: 'csp-bundle-angular:single-angular-copy',
  setup(build) {
    build.onResolve({ filter: /^@angular\// }, async (args) => {
      // Re-entry guard: our own build.resolve() below re-triggers this hook.
      if (args.pluginData && args.pluginData.ngDeduped) return null;
      const resolved = await build.resolve(args.path, {
        kind: args.kind,
        importer: args.importer,
        resolveDir: DEMOS_APP_ROOT,
        pluginData: { ngDeduped: true },
      });
      if (resolved.errors.length > 0) return resolved;
      return { path: resolved.path, external: resolved.external };
    });
  },
};

const fileExistsCache = new Map();
function isFileCached(filePath) {
  if (!fileExistsCache.has(filePath)) {
    fileExistsCache.set(filePath, fs.existsSync(filePath) && fs.statSync(filePath).isFile());
  }
  return fileExistsCache.get(filePath);
}

// ---- devextreme path redirect plugin ----
// apps/demos/node_modules/devextreme only ships bundles/; redirect to the real CJS
// modules under packages/devextreme/artifacts, as the SystemJS dev config does.
const DEVEXTREME_CJS_ROOT = path.join(
  REPO_ROOT, 'packages', 'devextreme', 'artifacts', 'transpiled-esm-npm', 'cjs',
);
const devextremeRedirectPlugin = {
  name: 'csp-bundle-angular:devextreme-cjs-redirect',
  setup(build) {
    build.onResolve({ filter: /^devextreme(\/.*)?$/ }, (args) => {
      const sub = args.path === 'devextreme' ? '' : args.path.slice('devextreme/'.length);
      // Try the path as-is first (explicit extensions), then implicit .js/index.js/.mjs.
      const candidates = sub
        ? [
          path.join(DEVEXTREME_CJS_ROOT, sub),
          path.join(DEVEXTREME_CJS_ROOT, `${sub}.js`),
          path.join(DEVEXTREME_CJS_ROOT, sub, 'index.js'),
          path.join(DEVEXTREME_CJS_ROOT, `${sub}.mjs`),
        ]
        : [path.join(DEVEXTREME_CJS_ROOT, 'index.js')];
      for (const candidate of candidates) {
        if (isFileCached(candidate)) {
          return { path: candidate };
        }
      }
      return null;
    });
  },
};

// Re-resolve snake_case devextreme-angular/ui/* imports (e.g. html_editor) to the
// kebab-case form the npm dist actually ships.
const devextremeAngularSnakeCasePlugin = {
  name: 'csp-bundle-angular:devextreme-angular-snake-case',
  setup(build) {
    build.onResolve({ filter: /^devextreme-angular\/ui\/[^/]+(\/.*)?$/ }, (args) => {
      const rest = args.path.slice('devextreme-angular/ui/'.length);
      const [name, ...tail] = rest.split('/');
      if (!name.includes('_')) return null;
      const kebab = name.replace(/_/g, '-');
      const remapped = ['devextreme-angular', 'ui', kebab, ...tail].join('/');
      return build.resolve(remapped, {
        kind: args.kind,
        importer: args.importer,
        resolveDir: args.resolveDir,
      });
    });
  },
};

// Redirect devextreme-dist/js/* (VectorMap data) to the real files under
// packages/devextreme/artifacts/js — the dist package is near-empty.
const DEVEXTREME_ARTIFACTS_JS = path.join(REPO_ROOT, 'packages', 'devextreme', 'artifacts', 'js');
const devextremeDistRedirectPlugin = {
  name: 'csp-bundle-angular:devextreme-dist-redirect',
  setup(build) {
    build.onResolve({ filter: /^devextreme-dist\/js\/.+$/ }, (args) => {
      const sub = args.path.slice('devextreme-dist/js/'.length);
      const candidates = [
        path.join(DEVEXTREME_ARTIFACTS_JS, sub),
        path.join(DEVEXTREME_ARTIFACTS_JS, `${sub}.js`),
      ];
      for (const candidate of candidates) {
        if (isFileCached(candidate)) {
          return { path: candidate };
        }
      }
      return null;
    });
  },
};

// Rewrite SystemJS specifiers (npm:foo, <spec>!json, globalize/<sub>) for esbuild.
const GLOBALIZE_BASE = path.join(REPO_ROOT, 'node_modules', 'globalize', 'dist', 'globalize');
const systemJsQuirksPlugin = {
  name: 'csp-bundle-angular:systemjs-quirks',
  setup(build) {
    build.onResolve({ filter: /^globalize\/[^/]+$/ }, (args) => {
      const sub = args.path.slice('globalize/'.length);
      const candidates = [
        path.join(GLOBALIZE_BASE, `${sub}.js`),
        path.join(NODE_MODULES, 'globalize', 'dist', 'globalize', `${sub}.js`),
      ];
      for (const candidate of candidates) {
        if (isFileCached(candidate)) return { path: candidate };
      }
      return null;
    });

    build.onResolve({ filter: /(^npm:)|(!json$)/ }, async (args) => {
      let spec = args.path;
      const forceJson = spec.endsWith('!json');
      if (forceJson) spec = spec.slice(0, -'!json'.length);
      if (spec.startsWith('npm:')) spec = spec.slice('npm:'.length);

      const resolved = await build.resolve(spec, {
        kind: args.kind,
        importer: args.importer,
        resolveDir: args.resolveDir,
        pluginData: { cspBundleAngularResolved: true },
      });
      if (resolved.errors.length > 0) return resolved;

      if (forceJson) {
        return { path: resolved.path, namespace: 'csp-bundle-angular-force-json' };
      }
      return { path: resolved.path, external: resolved.external };
    });

    build.onLoad({ filter: /.*/, namespace: 'csp-bundle-angular-force-json' }, (args) => ({
      contents: fs.readFileSync(args.path, 'utf8'),
      loader: 'json',
    }));
  },
};

function makeCompilerPlugin(createCompilerPlugin, tsconfig, fileReplacements) {
  return createCompilerPlugin(
    {
      tsconfig,
      sourcemap: false,
      jit: false,
      advancedOptimizations: false,
      incremental: false,
      fileReplacements,
    },
    {
      workspaceRoot: DEMOS_APP_ROOT,
      optimization: false,
      inlineFonts: false,
      sourcemap: false,
      outputNames: { bundles: '[name]', media: 'media/[name]' },
      target: ['es2022'],
      inlineStyleLanguage: 'css',
      cacheOptions: { enabled: false, path: '', basePath: DEMOS_APP_ROOT },
    },
  );
}

function prepareDemo(demo) {
  // Patch every .ts in the demo and feed the copies via fileReplacements; point
  // the entry (which bypasses resolveModuleNames) at its patched copy directly.
  const fileReplacements = {};
  for (const tsFile of findDemoTsFiles(path.join(demo.srcDir, 'app'))) {
    const patched = patchComponentTs(tsFile);
    if (patched) fileReplacements[tsFile] = patched;
  }
  const effectiveEntry = fileReplacements[demo.entry] || demo.entry;
  return { ...demo, effectiveEntry, fileReplacements };
}

function sortJsFiles(jsFiles) {
  return jsFiles.sort((a, b) => {
    if (a === 'polyfills.js') return -1;
    if (b === 'polyfills.js') return 1;
    return a.localeCompare(b);
  });
}

function mergeFileReplacements(demos) {
  return Object.assign({}, ...demos.map((demo) => demo.fileReplacements || {}));
}

function entryNameForDemo(demo, name) {
  return [demo.widget, demo.name, FRAMEWORK, name].join('/');
}

function chunk(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function makeBuildOptions({
  entryPoints,
  outdir,
  tsconfig,
  fileReplacements,
  createCompilerPlugin,
}) {
  return {
    entryPoints,
    outdir,
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    mainFields: ['es2020', 'es2015', 'browser', 'module', 'main'],
    conditions: ['es2020', 'es2015', 'module'],
    // Resolve bare `globalize` to the core build (as the dev config and the
    // React/Vue bundler do). Its package main (node-main.js) eagerly requires
    // globalize/plural, which demands plurals-type-cardinal CLDR data the demos
    // don't load (E_MISSING_CLDR).
    alias: {
      globalize: path.join(NODE_MODULES, 'globalize', 'dist', 'globalize.js'),
    },
    loader: {
      '.png': 'dataurl',
      '.jpg': 'dataurl',
      '.jpeg': 'dataurl',
      '.gif': 'dataurl',
      '.svg': 'dataurl',
    },
    define: {
      'process.env.NODE_ENV': '"production"',
      ngJitMode: 'false',
    },
    minify: false,
    sourcemap: false,
    logLevel: 'silent',
    metafile: true,
    plugins: [
      angularSingleCopyPlugin,
      antiForgeryPlugin,
      systemJsQuirksPlugin,
      devextremeAngularSnakeCasePlugin,
      devextremeDistRedirectPlugin,
      devextremeRedirectPlugin,
      makeCompilerPlugin(createCompilerPlugin, tsconfig, fileReplacements),
    ],
    resolveExtensions: ['.ts', '.mjs', '.js'],
    absWorkingDir: DEMOS_APP_ROOT,
    nodePaths: [NODE_MODULES],
  };
}

async function bundleDemo(demo, createCompilerPlugin) {
  const prepared = demo.effectiveEntry ? demo : prepareDemo(demo);
  const destDir = path.join(OUT_ROOT, prepared.widget, prepared.name, FRAMEWORK);
  fs.mkdirSync(destDir, { recursive: true });

  const effectiveEntry = prepared.effectiveEntry;
  const tsconfig = writeDemoTsconfig(effectiveEntry);

  let result;
  try {
    result = await esbuild.build(makeBuildOptions({
      entryPoints: { bundle: effectiveEntry },
      outdir: destDir,
      tsconfig,
      fileReplacements: prepared.fileReplacements || {},
      createCompilerPlugin,
    }));
  } catch (err) {
    return { ok: false, reason: (err && err.message) || String(err) };
  }

  const outputs = Object.keys((result.metafile && result.metafile.outputs) || {});
  const localJsFiles = sortJsFiles(outputs.filter((o) => o.endsWith('.js')).map((o) => path.basename(o)));
  if (localJsFiles.length === 0) return { ok: false, reason: 'no JS output produced' };

  const jsFiles = [
    ANGULAR_ZONE_SCRIPT,
    ...localJsFiles,
  ];
  const cssFiles = outputs.filter((o) => o.endsWith('.css')).map((o) => path.basename(o));

  fs.writeFileSync(path.join(destDir, 'index.html'), buildHtml({ jsFiles, cssFiles }));
  return { ok: true };
}

async function bundleDemoBatch(batch, createCompilerPlugin) {
  const entryPoints = {};
  const entryPaths = [];
  for (const demo of batch) {
    entryPoints[entryNameForDemo(demo, 'bundle')] = demo.effectiveEntry;
    entryPaths.push(demo.effectiveEntry);
  }

  const tsconfig = writeTsconfig(`batch-${batch[0].widget}-${batch[0].name}-${batch.length}-${Date.now()}`, entryPaths);
  const fileReplacements = mergeFileReplacements(batch);
  try {
    await esbuild.build(makeBuildOptions({
      entryPoints,
      outdir: OUT_ROOT,
      tsconfig,
      fileReplacements,
      createCompilerPlugin,
    }));
  } catch (err) {
    return { ok: false, reason: (err && err.message) || String(err) };
  }

  for (const demo of batch) {
    const destDir = path.join(OUT_ROOT, demo.widget, demo.name, FRAMEWORK);
    const cssFiles = ['bundle.css'].filter((file) => fs.existsSync(path.join(destDir, file)));
    const localJsFiles = sortJsFiles(['bundle.js'].filter((file) => fs.existsSync(path.join(destDir, file))));
    if (localJsFiles.length === 0) {
      return { ok: false, reason: `no JS output produced for ${demo.widget}/${demo.name}` };
    }

    const jsFiles = [
      ANGULAR_ZONE_SCRIPT,
      ...localJsFiles,
    ];
    fs.writeFileSync(path.join(destDir, 'index.html'), buildHtml({ jsFiles, cssFiles }));
  }

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
  console.log(`Retry concurrency: ${RETRY_CONCURRENCY}`);
  console.log(`Batch size: ${BATCH_SIZE}`);
  console.log(`Batch concurrency: ${BATCH_CONCURRENCY}`);
  if (SHARD_TOTAL > 1) console.log(`Shard: ${SHARD_INDEX}/${SHARD_TOTAL}`);
  console.log(`Source: ${SRC_DEMOS_DIR}`);
  console.log(`Output: ${OUT_ROOT}`);
  if (FILTER) console.log(`Filter: ${FILTER}`);
  console.log('');

  // Wipe previous Angular output; leave React/Vue subtrees alone.
  if (fs.existsSync(OUT_ROOT)) {
    const existingWidgets = fs.readdirSync(OUT_ROOT, { withFileTypes: true }).filter((w) => w.isDirectory());
    for (const widget of existingWidgets) {
      const widgetPath = path.join(OUT_ROOT, widget.name);
      const existingDemos = fs.readdirSync(widgetPath, { withFileTypes: true }).filter((d) => d.isDirectory());
      for (const demo of existingDemos) {
        const fwDir = path.join(widgetPath, demo.name, FRAMEWORK);
        if (fs.existsSync(fwDir)) fs.rmSync(fwDir, { recursive: true, force: true });
      }
    }
  }
  fs.mkdirSync(OUT_ROOT, { recursive: true });
  if (fs.existsSync(GENERATED_TSCONFIG_DIR)) {
    fs.rmSync(GENERATED_TSCONFIG_DIR, { recursive: true, force: true });
  }
  sweepStalePatchedTsFiles(SRC_DEMOS_DIR);

  const { createCompilerPlugin } = resolveAngularBuildPrivate();

  const { out: allDemos, skipped } = findDemos();
  const demos = applyShard(allDemos);
  const shardNote = SHARD_TOTAL > 1 ? ` — shard ${SHARD_INDEX}/${SHARD_TOTAL}: ${demos.length} of ${allDemos.length} bundleable` : '';
  console.log(`Discovered ${allDemos.length + skipped.length} ${FRAMEWORK} demo(s) — ${allDemos.length} bundleable, ${skipped.length} skipped (KNOWN_BROKEN_DEMOS)${shardNote}\n`);
  if (skipped.length > 0) {
    for (const s of skipped) console.log(`  • skipping ${s.widget}/${s.name}`);
    console.log('');
  }
  if (demos.length === 0) {
    console.log('Nothing to bundle.');
    return;
  }

  const allCssFiles = discoverComponentStyleFiles(demos.map((d) => d.entry));
  const shims = computeGlobalShims(allCssFiles);
  console.log(`Component CSS files: ${allCssFiles.length}`);
  console.log(`Asset shims to install: ${shims.length}`);
  let installed = [];
  try {
    installed = installShims(shims);
  } catch (err) {
    removeShims(installed);
    console.error('Failed to install asset shims:', err.message);
    process.exit(1);
  }

  let ok = 0;
  let fail = 0;
  const failures = [];
  const t0 = Date.now();

  try {
    const preparedDemos = demos.map(prepareDemo);
    if (BATCH_SIZE === 1) {
      await runPool(preparedDemos, CONCURRENCY, async (demo, i) => {
        const idx = i + 1;
        const res = await bundleDemo(demo, createCompilerPlugin);
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
    } else {
      const batches = chunk(preparedDemos, BATCH_SIZE);

      await runPool(batches, BATCH_CONCURRENCY, async (batch, batchIndex) => {
        const firstIndex = batchIndex * BATCH_SIZE;
        const lastIndex = Math.min(firstIndex + batch.length, demos.length);
        const res = await bundleDemoBatch(batch, createCompilerPlugin);
        if (res.ok) {
          ok += batch.length;
          if (lastIndex % 25 === 0 || lastIndex === demos.length || batch.length > 1) {
            console.log(`  [${lastIndex}/${demos.length}] bundled (${ok} ok / ${fail} fail)`);
          }
          return;
        }

        console.log(`  ⚠️ batch [${firstIndex + 1}-${lastIndex}/${demos.length}] failed — retrying demos individually`);
        await runPool(batch, RETRY_CONCURRENCY, async (demo, i) => {
          const idx = firstIndex + i + 1;
          const single = await bundleDemo(demo, createCompilerPlugin);
          if (single.ok) {
            ok += 1;
            if (idx % 25 === 0 || idx === demos.length) {
              console.log(`  [${idx}/${demos.length}] bundled (${ok} ok / ${fail} fail)`);
            }
          } else {
            fail += 1;
            failures.push({ ...demo, reason: single.reason || res.reason });
            console.log(`  ❌ [${idx}/${demos.length}] ${demo.widget}/${demo.name} — ${single.reason || res.reason}`);
          }
        });
      });
    }
  } finally {
    removeShims(installed);
    cleanupPatchedTsFiles();
  }

  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\nDone in ${dt}s — ok=${ok} fail=${fail}`);

  if (fail > 0) {
    console.log('\nFailed demos:');
    for (const f of failures) console.log(`  ${f.widget}/${f.name} — ${f.reason}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main().then(() => {
    process.exit(process.exitCode || 0);
  }).catch((err) => {
    console.error('csp-bundle-angular failed:', err);
    process.exit(1);
  });
}

module.exports = { main };
