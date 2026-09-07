/* eslint-disable global-require, import/no-dynamic-require */

// Bundles every Angular demo via AOT; csp-bundle.js delegates here for --framework=Angular.

const path = require('path');
const fs = require('fs');
const os = require('os');
const esbuild = require('esbuild');
const { extractDemoHeadExtras, extractDemoBodyInner } = require('./demo-html');
const { createEntryShimSource } = require('./demo-render-signal');
const { discoverTestGlobalsFromContent } = require('../visual-tests/test-globals-bundle');
const { readShardConfig, applyShard: applyShardGeneric } = require('./shard');

const DEMOS_APP_ROOT = path.resolve(__dirname, '..', '..');
const REPO_ROOT = path.resolve(DEMOS_APP_ROOT, '..', '..');
const SRC_DEMOS_DIR = path.join(DEMOS_APP_ROOT, 'Demos');

const IS_GENERATE_MANIFESTS = process.env.CSP_BUNDLE_GENERATE_MANIFESTS === '1';
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

// Infinity so one global batch always covers the current demo count, sharing the most code.
const DEFAULT_SAFE_BATCH_SIZE = Infinity;
const BATCH_SIZE = (() => {
  const fromEnv = parseInt(process.env.CSP_BUNDLE_BATCH_SIZE, 10);
  if (fromEnv > 0) return fromEnv;
  return DEFAULT_SAFE_BATCH_SIZE;
})();

const BATCH_CONCURRENCY = (() => {
  const fromEnv = parseInt(process.env.CSP_BUNDLE_BATCH_CONCURRENCY, 10);
  if (fromEnv > 0) return fromEnv;
  return 1;
})();

const FILTER = (process.env.CSP_BUNDLE_FILTER || '').trim();

const { SHARD_TOTAL, SHARD_INDEX } = readShardConfig();

function applyShard(demos) {
  return applyShardGeneric(demos, (d) => `${d.widget}/${d.name}`, { SHARD_TOTAL, SHARD_INDEX });
}

const SHARED_TSCONFIG_TEMPLATE = path.join(__dirname, 'tsconfig.csp-bundle-angular.json');
const GENERATED_TSCONFIG_DIR = path.join(__dirname, '.csp-bundle-angular-tsconfigs');
// Under apps/demos so the shim's bare devextreme import resolves through node_modules.
const GENERATED_SHIM_DIR = path.join(__dirname, '.csp-bundle-angular-shims');
const ANGULAR_ZONE_SCRIPT = '../../../../node_modules/zone.js/bundles/zone.umd.js';
// esbuild's code-splitting output (shared chunks across a batch) — wiped and regenerated each run.
const CHUNKS_DIRNAME = '_chunks';

// @angular/build is transitive via @angular-devkit/build-angular; resolve through it for pnpm.
function resolveAngularBuildPrivate() {
  const buildAngularPkg = require.resolve('@angular-devkit/build-angular/package.json', {
    paths: [DEMOS_APP_ROOT],
  });
  const buildAngularDir = path.dirname(buildAngularPkg);
  return require(require.resolve('@angular/build/private', { paths: [buildAngularDir] }));
}

// ngc rejects empty files+include (TS18002), so `files` always lists the entry.
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

function writeDemoTsconfig(shimPath, entryPath) {
  return writeTsconfig(path.relative(REPO_ROOT, entryPath), [shimPath, entryPath]);
}

const allEntryShims = new Set();

// Unlike React/Vue, a shard's Angular demos share one devextreme module graph, so test globals can be assigned inline (no test-globals-bundle.js needed).
function demoTestGlobals(demo) {
  const testCodePath = path.join(path.dirname(demo.srcDir), 'test-code.js');
  if (!fs.existsSync(testCodePath)) return [];
  const content = fs.readFileSync(testCodePath, 'utf8');
  return Array.from(discoverTestGlobalsFromContent(content).entries());
}

function testGlobalsShimSource(entries) {
  if (entries.length === 0) return '';
  const namespaces = new Set(entries.map(([, accessorPath]) => accessorPath.split('.')[0]));
  return `
    Promise.all([${entries.map(([specifier]) => `import(${JSON.stringify(specifier)})`).join(', ')}]).then(function (m) {
      window.DevExpress = window.DevExpress || {};
      ${Array.from(namespaces).map((ns) => `window.DevExpress.${ns} = window.DevExpress.${ns} || {};`).join('\n      ')}
      ${entries.map(([, accessorPath], i) => `window.DevExpress.${accessorPath} = m[${i}].default;`).join('\n      ')}
    });
`;
}

function writeEntryShim(demo, entryPath) {
  fs.mkdirSync(GENERATED_SHIM_DIR, { recursive: true });
  const slug = `${demo.widget}-${demo.name}`.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const dest = path.join(GENERATED_SHIM_DIR, `${slug}.ts`);
  const source = createEntryShimSource(entryPath, { tsNoCheck: true }) + testGlobalsShimSource(demoTestGlobals(demo));
  fs.writeFileSync(dest, source);
  allEntryShims.add(dest);
  return dest;
}

function cleanupEntryShims(shimPaths) {
  for (const f of shimPaths ?? allEntryShims) {
    try { fs.unlinkSync(f); } catch {
      console.warn(`Failed to remove entry shim ${f}`);
    }
    allEntryShims.delete(f);
  }
}

const DEFAULT_BODY_INNER = `<div class="demo-container">
      <demo-app>Loading...</demo-app>
    </div>`;

function buildHtml({ jsFiles, cssFiles, srcDir }) {
  const cssLinks = [
    '<link rel="stylesheet" type="text/css" href="../../../../node_modules/devextreme-dist/css/dx.light.css" />',
    ...extractDemoHeadExtras(srcDir),
    ...cssFiles.map((f) => `<link rel="stylesheet" type="text/css" href="./${f}" />`),
  ].join('\n    ');
  const bodyInner = extractDemoBodyInner(srcDir) || DEFAULT_BODY_INNER;
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
    ${bodyInner}
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
  if (!fs.existsSync(SRC_DEMOS_DIR)) return out;

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
          out.push({ widget: widget.name, name: demo.name, srcDir: fwDir, entry });
        }
      }
    }
  }
  return out;
}

// Under AOT, component CSS url() paths resolve against the CSS file (not the document), one dir short — symlink the asset at the wrong path.
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
          const cleaned = item[1];
          result.add(path.resolve(path.dirname(tsFile), cleaned));
        }
      }
    }
  }
  return Array.from(result);
}

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

// Demo components use SystemJS-era templateUrl/styleUrls paths that resolve wrong under AOT; patch to `./<basename>.<ext>` and feed the copy via fileReplacements.
const PATCHED_TS_PREFIX = '.csp-bundle-angular-patched.';
const TEMPLATE_URL_RE = /templateUrl\s*:\s*([`'"])([^`'"]+)\1/g;
const STYLE_URLS_INLINE_RE = /styleUrls\s*:\s*\[\s*([`'"])([^`'"]+)\1\s*\]/g;
const allPatchedTsFiles = new Set();

function aotRelativeFor(tsFile, originalSpec) {
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

function cleanupPatchedTsFiles(tsFiles) {
  for (const f of tsFiles ?? allPatchedTsFiles) {
    try { fs.unlinkSync(f); } catch { /* already gone */ }
    allPatchedTsFiles.delete(f);
  }
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

// Excludes patch siblings so re-runs stay idempotent.
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

const ANTI_FORGERY_PATH = path.join(DEMOS_APP_ROOT, 'shared', 'anti-forgery', 'fetch-override.js');
const antiForgeryPlugin = {
  name: 'csp-bundle-angular:anti-forgery',
  setup(build) {
    build.onResolve({ filter: /^anti-forgery$/ }, () => ({ path: ANTI_FORGERY_PATH }));
  },
};

// Resolves every @angular/* from a single base so the bundle shares one copy — otherwise two DI systems can end up bundled (NG0203/NG05100/NG0300).
const angularSingleCopyPlugin = {
  name: 'csp-bundle-angular:single-angular-copy',
  setup(build) {
    build.onResolve({ filter: /^@angular\// }, async (args) => {
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

// apps/demos/node_modules/devextreme only ships bundles/; redirect to the real ESM modules under packages/devextreme/artifacts.
const DEVEXTREME_ESM_ROOT = path.join(
  REPO_ROOT, 'packages', 'devextreme', 'artifacts', 'transpiled-esm-npm', 'esm',
);
const devextremeRedirectPlugin = {
  name: 'csp-bundle-angular:devextreme-esm-redirect',
  setup(build) {
    build.onResolve({ filter: /^devextreme(\/.*)?$/ }, (args) => {
      const sub = args.path === 'devextreme' ? '' : args.path.slice('devextreme/'.length);
      const candidates = sub
        ? [
          path.join(DEVEXTREME_ESM_ROOT, sub),
          path.join(DEVEXTREME_ESM_ROOT, `${sub}.js`),
          path.join(DEVEXTREME_ESM_ROOT, sub, 'index.js'),
          path.join(DEVEXTREME_ESM_ROOT, `${sub}.mjs`),
        ]
        : [path.join(DEVEXTREME_ESM_ROOT, 'index.js')];
      for (const candidate of candidates) {
        if (isFileCached(candidate)) {
          return { path: candidate };
        }
      }
      return null;
    });
  },
};

// Re-resolves snake_case devextreme-angular/ui/* imports (e.g. html_editor) to the kebab-case form the npm dist actually ships.
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

// devextreme-dist/js is near-empty — redirect VectorMap data to the real artifacts/js files.
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

// Resolve `globalize/<sub>` to the dist browser build.
const GLOBALIZE_BASE = path.join(REPO_ROOT, 'node_modules', 'globalize', 'dist', 'globalize');
const globalizePlugin = {
  name: 'csp-bundle-angular:globalize',
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
  const fileReplacements = {};
  for (const tsFile of findDemoTsFiles(path.join(demo.srcDir, 'app'))) {
    const patched = patchComponentTs(tsFile);
    if (patched) fileReplacements[tsFile] = patched;
  }
  const effectiveEntry = fileReplacements[demo.entry] || demo.entry;
  const shimEntry = writeEntryShim(demo, effectiveEntry);
  return {
    ...demo, effectiveEntry, shimEntry, fileReplacements,
  };
}

const ANGULAR_IMPLICIT_PACKAGES = ['zone.js', 'reflect-metadata', 'devextreme-dist'];
function writeDemoManifest(demo, destDir) {
  const { discoverDemoSpecifiers, resolvePackageVersions } = require('./vendor-bundle');
  const packages = resolvePackageVersions([
    ...discoverDemoSpecifiers(demo.srcDir),
    ...ANGULAR_IMPLICIT_PACKAGES,
  ]);
  fs.writeFileSync(
    path.join(destDir, 'demo.manifest.json'),
    JSON.stringify({ framework: FRAMEWORK, packages }, null, 2),
  );
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
  splitting = true,
}) {
  return {
    entryPoints,
    outdir,
    bundle: true,
    format: 'esm',
    splitting,
    chunkNames: `${CHUNKS_DIRNAME}/[hash]`,
    platform: 'browser',
    target: 'es2022',
    mainFields: ['es2020', 'es2015', 'browser', 'module', 'main'],
    conditions: ['es2020', 'es2015', 'module'],
    // globalize's package main eagerly requires plural CLDR data the demos don't load (E_MISSING_CLDR).
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
    minify: true,
    sourcemap: false,
    logLevel: 'silent',
    metafile: true,
    // write:true would silently drop the Angular compiler's extracted stylesheet resources; written explicitly below instead.
    write: false,
    plugins: [
      angularSingleCopyPlugin,
      antiForgeryPlugin,
      globalizePlugin,
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

// write:false means bundle.js/bundle.css and shared chunks must be flushed to disk explicitly (resources are handled separately by emitDemoResources).
async function writeOutputFiles(outputFiles) {
  const codeFiles = (outputFiles || []).filter((f) => /\.(js|css)$/i.test(f.path));
  await Promise.all(codeFiles.map(async (file) => {
    await fs.promises.mkdir(path.dirname(file.path), { recursive: true });
    await fs.promises.writeFile(file.path, file.contents);
  }));
}

// Extracted stylesheet resources land wherever esbuild's bundler puts them, not next to the demo — so copy each one into that demo's own `media/` folder too.
function demoAssetBasenames(demo) {
  const basenames = new Set();
  for (const cssFile of discoverComponentStyleFiles([demo.entry])) {
    if (fs.existsSync(cssFile)) {
      const src = fs.readFileSync(cssFile, 'utf8');
      for (const m of src.matchAll(URL_RE)) {
        const spec = m[2];
        const isExternal = path.isAbsolute(spec) || /^[a-z][\w+.-]*:/i.test(spec) || spec.startsWith('#');
        if (!isExternal) {
          basenames.add(path.basename(spec.split(/[?#]/)[0]));
        }
      }
    }
  }
  return basenames;
}

async function emitDemoResources(demoDestDirs, outputFiles) {
  const resourceFiles = (outputFiles || []).filter((f) => !/\.(js|css)$/i.test(f.path));
  if (resourceFiles.length === 0) return;
  const byBasename = new Map(resourceFiles.map((f) => [path.basename(f.path), f]));

  await Promise.all(demoDestDirs.map(async ({ demo, destDir }) => {
    const basenames = demoAssetBasenames(demo);
    await Promise.all([...basenames].map(async (basename) => {
      const file = byBasename.get(basename);
      if (file) {
        const dest = path.join(destDir, 'media', basename);
        await fs.promises.mkdir(path.dirname(dest), { recursive: true });
        await fs.promises.writeFile(dest, file.contents);
      }
    }));
  }));
}

async function bundleDemo(demo, createCompilerPlugin, destDirOverride) {
  const prepared = demo.effectiveEntry ? demo : prepareDemo(demo);
  const destDir = destDirOverride || path.join(SRC_DEMOS_DIR, prepared.widget, prepared.name, FRAMEWORK);
  fs.mkdirSync(destDir, { recursive: true });
  fs.rmSync(path.join(destDir, CHUNKS_DIRNAME), { recursive: true, force: true });

  const effectiveEntry = prepared.effectiveEntry;
  const tsconfig = writeDemoTsconfig(prepared.shimEntry, effectiveEntry);

  let result;
  try {
    result = await esbuild.build(makeBuildOptions({
      entryPoints: { bundle: prepared.shimEntry },
      outdir: destDir,
      tsconfig,
      fileReplacements: prepared.fileReplacements || {},
      createCompilerPlugin,
      splitting: false,
    }));
    await writeOutputFiles(result.outputFiles);
    await emitDemoResources([{ demo: prepared, destDir }], result.outputFiles);
  } catch (err) {
    return { ok: false, reason: (err && err.message) || String(err) };
  }

  // Drop shared chunks (already imported by bundle.js) and styles the AOT plugin listed but actually inlined.
  const outputs = Object.keys((result.metafile && result.metafile.outputs) || {})
    .filter((o) => !o.includes(`${CHUNKS_DIRNAME}/`))
    .filter((o) => fs.existsSync(path.resolve(DEMOS_APP_ROOT, o)));
  const localJsFiles = sortJsFiles(outputs.filter((o) => o.endsWith('.js')).map((o) => path.basename(o)));
  if (localJsFiles.length === 0) return { ok: false, reason: 'no JS output produced' };

  const jsFiles = [
    ANGULAR_ZONE_SCRIPT,
    ...localJsFiles,
  ];
  const cssFiles = outputs.filter((o) => o.endsWith('.css')).map((o) => path.basename(o));

  fs.writeFileSync(path.join(destDir, 'index.html'), buildHtml({ jsFiles, cssFiles, srcDir: prepared.srcDir }));
  if (IS_GENERATE_MANIFESTS) writeDemoManifest(prepared, destDir);
  return { ok: true };
}

async function bundleDemoBatch(batch, createCompilerPlugin) {
  const entryPoints = {};
  const entryPaths = [];
  for (const demo of batch) {
    entryPoints[entryNameForDemo(demo, 'bundle')] = demo.shimEntry;
    entryPaths.push(demo.shimEntry, demo.effectiveEntry);
  }

  const tsconfig = writeTsconfig(`batch-${batch[0].widget}-${batch[0].name}-${batch.length}-${Date.now()}`, entryPaths);
  const fileReplacements = mergeFileReplacements(batch);
  try {
    const result = await esbuild.build(makeBuildOptions({
      entryPoints,
      outdir: SRC_DEMOS_DIR,
      tsconfig,
      fileReplacements,
      createCompilerPlugin,
    }));
    await writeOutputFiles(result.outputFiles);
    await emitDemoResources(
      batch.map((demo) => ({ demo, destDir: path.join(SRC_DEMOS_DIR, demo.widget, demo.name, FRAMEWORK) })),
      result.outputFiles,
    );
  } catch (err) {
    return { ok: false, reason: (err && err.message) || String(err) };
  }

  for (const demo of batch) {
    const destDir = path.join(SRC_DEMOS_DIR, demo.widget, demo.name, FRAMEWORK);
    const cssFiles = ['bundle.css'].filter((file) => fs.existsSync(path.join(destDir, file)));
    const localJsFiles = sortJsFiles(['bundle.js'].filter((file) => fs.existsSync(path.join(destDir, file))));
    if (localJsFiles.length === 0) {
      return { ok: false, reason: `no JS output produced for ${demo.widget}/${demo.name}` };
    }

    const jsFiles = [
      ANGULAR_ZONE_SCRIPT,
      ...localJsFiles,
    ];
    fs.writeFileSync(path.join(destDir, 'index.html'), buildHtml({ jsFiles, cssFiles, srcDir: demo.srcDir }));
    if (IS_GENERATE_MANIFESTS) writeDemoManifest(demo, destDir);
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
  console.log(`Output: ${SRC_DEMOS_DIR}`);
  if (FILTER) console.log(`Filter: ${FILTER}`);
  console.log('');

  fs.mkdirSync(SRC_DEMOS_DIR, { recursive: true });

  for (const dir of [GENERATED_TSCONFIG_DIR, GENERATED_SHIM_DIR]) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
  // Shared across every demo's build, so not covered by the per-demo wipe above; safe to regenerate since chunk filenames are content-hashed.
  const chunksDir = path.join(SRC_DEMOS_DIR, CHUNKS_DIRNAME);
  if (fs.existsSync(chunksDir)) {
    fs.rmSync(chunksDir, { recursive: true, force: true });
  }
  sweepStalePatchedTsFiles(SRC_DEMOS_DIR);

  const { createCompilerPlugin } = resolveAngularBuildPrivate();

  const allDemos = findDemos();
  const demos = applyShard(allDemos);
  const shardNote = SHARD_TOTAL > 1 ? ` — shard ${SHARD_INDEX}/${SHARD_TOTAL}: ${demos.length} of ${allDemos.length}` : '';
  console.log(`Discovered ${allDemos.length} ${FRAMEWORK} demo(s)${shardNote}\n`);
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
      // `batchIndex * BATCH_SIZE` would be NaN when BATCH_SIZE is Infinity.
      let cursor = 0;
      const batchStarts = batches.map((batch) => {
        const start = cursor;
        cursor += batch.length;
        return start;
      });

      await runPool(batches, BATCH_CONCURRENCY, async (batch, batchIndex) => {
        const firstIndex = batchStarts[batchIndex];
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
    cleanupEntryShims();
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

module.exports = {
  main,
  resolveAngularBuildPrivate,
  findAngularEntry,
  prepareDemo,
  discoverComponentStyleFiles,
  computeGlobalShims,
  installShims,
  removeShims,
  cleanupPatchedTsFiles,
  cleanupEntryShims,
  bundleDemo,
  buildHtml,
  ANGULAR_ZONE_SCRIPT,
  angularSingleCopyPlugin,
  antiForgeryPlugin,
  globalizePlugin,
  devextremeAngularSnakeCasePlugin,
  devextremeDistRedirectPlugin,
  devextremeRedirectPlugin,
  NODE_MODULES,
  DEMOS_APP_ROOT,
};
