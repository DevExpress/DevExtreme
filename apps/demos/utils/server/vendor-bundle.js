// Builds a shared devextreme/framework-runtime bundle once per framework so demos
// can reference it instead of each bundling their own copy.

const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');

const DEMOS_APP_ROOT = path.join(__dirname, '..', '..');
console.log('DEMOS_APP_ROOT', DEMOS_APP_ROOT);
console.log('dirname', __dirname);
const SRC_DEMOS_DIR = path.join(DEMOS_APP_ROOT, 'Demos');
const VENDOR_OUT_DIR = path.join(DEMOS_APP_ROOT, 'bundles', 'vendor');
// Not os.tmpdir(): needs to be under apps/demos for node_modules resolution to work.
const VENDOR_SCRATCH_DIR = path.join(DEMOS_APP_ROOT, '.vendor-entry-tmp');

const VENDOR_HREF_PREFIX = '../../../../bundles/vendor/';

function vendorFilePath(framework) {
  return path.join(VENDOR_OUT_DIR, `${framework.toLowerCase()}.vendor.js`);
}

function manifestPath(framework) {
  return path.join(VENDOR_OUT_DIR, `${framework.toLowerCase()}.manifest.json`);
}

function globalVarName(framework) {
  return `__DX_VENDOR_${framework.toUpperCase()}__`;
}

// Angular isn't supported here — see build-vendor-bundles.js's header comment.
const VENDOR_PREFIXES = {
  React: [/^react$/, /^react-dom(\/.*)?$/, /^devextreme(-react)?(\/.*)?$/, /^globalize$/],
  ReactJs: [/^react$/, /^react-dom(\/.*)?$/, /^devextreme(-react)?(\/.*)?$/, /^globalize$/],
  Vue: [/^vue$/, /^devextreme(-vue)?(\/.*)?$/, /^globalize$/],
};

function isVendorSpecifier(spec, framework) {
  return (VENDOR_PREFIXES[framework] || []).some((re) => re.test(spec));
}

const VENDOR_KEYWORDS = {
  React: ['devextreme-react', 'devextreme', 'react-dom', 'react', 'globalize'],
  ReactJs: ['devextreme-react', 'devextreme', 'react-dom', 'react', 'globalize'],
  Vue: ['devextreme-vue', 'devextreme', 'vue', 'globalize'],
};

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.vue']);
const IMPORT_SPECIFIER_RE = /(?:^|\r?\n)\s*(?:import|export)(?:[^'";]*?from)?\s*['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\s*\)|import\(\s*['"]([^'"]+)['"]\s*\)/g;

const GENERATED_DIR_NAMES = new Set(['_chunks']);
const GENERATED_FILE_RE = /^bundle(\.[0-9a-f]+)?\.(js|css)$|^\.csp-bundle-angular-patched\./;

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (GENERATED_DIR_NAMES.has(entry.name)) continue; // eslint-disable-line no-continue
      walk(full, out);
    } else if (SOURCE_EXTENSIONS.has(path.extname(entry.name)) && !GENERATED_FILE_RE.test(entry.name)) {
      out.push(full);
    }
  }
}

function collectSpecifiersFromDir(dir, predicate) {
  const found = new Set();
  if (!fs.existsSync(dir)) return found;
  const files = [];
  walk(dir, files);
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    IMPORT_SPECIFIER_RE.lastIndex = 0;
    let m;
    // eslint-disable-next-line no-cond-assign
    while ((m = IMPORT_SPECIFIER_RE.exec(content))) {
      const spec = m[1] || m[2] || m[3];
      if (spec && predicate(spec)) found.add(spec);
    }
  }
  return found;
}

function discoverSpecifiers(framework) {
  const found = new Set();
  if (!fs.existsSync(SRC_DEMOS_DIR)) return found;

  const widgets = fs.readdirSync(SRC_DEMOS_DIR, { withFileTypes: true }).filter((w) => w.isDirectory());
  for (const widget of widgets) {
    const demoDir = path.join(SRC_DEMOS_DIR, widget.name);
    const demos = fs.readdirSync(demoDir, { withFileTypes: true }).filter((d) => d.isDirectory());
    for (const demo of demos) {
      const fwDir = path.join(demoDir, demo.name, framework);
      if (!fs.existsSync(fwDir)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      collectSpecifiersFromDir(fwDir, (spec) => isVendorSpecifier(spec, framework))
        .forEach((spec) => found.add(spec));
    }
  }
  return found;
}

const NON_PACKAGE_SPECIFIERS = new Set(['anti-forgery']);

function discoverDemoSpecifiers(demoFrameworkDir) {
  return collectSpecifiersFromDir(
    demoFrameworkDir,
    (spec) => !spec.startsWith('.') && !NON_PACKAGE_SPECIFIERS.has(spec),
  );
}

function packageNameForSpecifier(spec) {
  let s = spec;
  if (s.endsWith('!json')) s = s.slice(0, -'!json'.length);
  if (s.startsWith('npm:')) s = s.slice('npm:'.length);
  if (s.startsWith('@')) return s.split('/').slice(0, 2).join('/');
  return s.split('/')[0];
}

function nearestPackageJson(startFile) {
  let dir = path.dirname(startFile);
  for (;;) {
    const candidate = path.join(dir, 'package.json');
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function readVersion(pkgJsonPath) {
  return JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8')).version || null;
}

const packageVersionCache = new Map();
function resolvePackageVersion(pkgName, resolveDir) {
  const cacheKey = `${resolveDir}::${pkgName}`;
  if (packageVersionCache.has(cacheKey)) return packageVersionCache.get(cacheKey);

  let version = null;
  try {
    version = readVersion(require.resolve(`${pkgName}/package.json`, { paths: [resolveDir] }));
  } catch {
    try {
      const pkgJsonPath = nearestPackageJson(require.resolve(pkgName, { paths: [resolveDir] }));
      if (pkgJsonPath) version = readVersion(pkgJsonPath);
    } catch {
      version = null;
    }
  }
  packageVersionCache.set(cacheKey, version);
  return version;
}

function resolvePackageVersions(specifiers, resolveDir = DEMOS_APP_ROOT) {
  const packages = {};
  for (const spec of specifiers) {
    const pkgName = packageNameForSpecifier(spec);
    if (Object.prototype.hasOwnProperty.call(packages, pkgName)) continue; // eslint-disable-line no-continue
    const version = resolvePackageVersion(pkgName, resolveDir);
    if (version) {
      packages[pkgName] = version;
    } else {
      console.warn(`vendor-bundle: could not resolve a version for package "${pkgName}" (from specifier "${spec}")`);
    }
  }
  return packages;
}

function safeName(spec) {
  return spec.replace(/[^a-zA-Z0-9_]/g, '_');
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function specifierFilter(specifiers) {
  return new RegExp(`^(?:${specifiers.map(escapeRegExp).join('|')})$`);
}

function keywordFilter(keywords) {
  return new RegExp(keywords.map(escapeRegExp).join('|'));
}

function computeClosure(metafile, entryFile, buildCwd) {
  if (!metafile || !entryFile) return [];
  const toAbs = (p) => (path.isAbsolute(p) ? p : path.resolve(buildCwd, p));
  const entryKey = Object.keys(metafile.inputs).find((k) => toAbs(k) === entryFile);
  if (!entryKey) return [];

  const closure = [];
  const seen = new Set();
  const stack = (metafile.inputs[entryKey].imports || []).map((imp) => imp.path).filter(Boolean);
  while (stack.length > 0) {
    const cur = stack.pop();
    const abs = toAbs(cur);
    if (seen.has(abs)) continue; // eslint-disable-line no-continue
    seen.add(abs);
    // Skip esbuild's own synthetic inputs (e.g. "<runtime>") — not real, resolvable files.
    if (fs.existsSync(abs)) closure.push(abs);
    const info = metafile.inputs[cur];
    if (!info) continue; // eslint-disable-line no-continue
    for (const childImp of info.imports || []) {
      if (childImp.path) stack.push(childImp.path);
    }
  }
  return closure;
}

const MAX_ATTEMPTS = 10;

async function buildVendorBundle(framework, esbuildOptions = {}) {
  let specifiers = Array.from(discoverSpecifiers(framework)).sort();
  if (specifiers.length === 0) return null;

  fs.mkdirSync(VENDOR_OUT_DIR, { recursive: true });
  fs.mkdirSync(VENDOR_SCRATCH_DIR, { recursive: true });

  const buildCwd = esbuildOptions.absWorkingDir || process.cwd();
  const dropped = new Set();
  let finalMetafile = null;
  let finalEntryFile = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const entryContents = specifiers
      .map((spec) => `export * as ${safeName(spec)} from ${JSON.stringify(spec)};`)
      .join('\n');
    const entryFile = path.join(VENDOR_SCRATCH_DIR, `entry-${framework}-${process.pid}-${Date.now()}.js`);
    fs.writeFileSync(entryFile, entryContents);

    let result;
    try {
      result = await esbuild.build({
        ...esbuildOptions,
        entryPoints: [entryFile],
        outfile: vendorFilePath(framework),
        bundle: true,
        format: 'iife',
        globalName: globalVarName(framework),
        minify: true,
        metafile: true,
        logLevel: 'silent',
      }).then((r) => ({ ok: true, metafile: r.metafile })).catch((err) => ({ ok: false, err }));
    } finally {
      fs.rmSync(entryFile, { force: true });
    }

    if (result.ok) {
      finalMetafile = result.metafile;
      finalEntryFile = entryFile;
      break;
    }

    // Regex discovery can pick up dead specifiers that never resolve; drop and retry.
    const badLines = new Set();
    for (const e of result.err.errors || []) {
      if (!e.location) continue; // eslint-disable-line no-continue
      const errFile = path.isAbsolute(e.location.file)
        ? e.location.file
        : path.resolve(buildCwd, e.location.file);
      if (errFile === entryFile) badLines.add(e.location.line);
    }
    if (badLines.size === 0 || attempt === MAX_ATTEMPTS) {
      throw result.err;
    }
    for (const line of badLines) {
      const spec = specifiers[line - 1];
      if (spec) dropped.add(spec);
    }
    specifiers = specifiers.filter((s) => !dropped.has(s));
  }

  if (dropped.size > 0) {
    console.warn(`vendor-bundle: dropped ${dropped.size} unresolvable specifier(s) for ${framework}: ${[...dropped].join(', ')}`);
  }

  // Second pass: rebuild with an `export * as` entry for every file in the closure too.
  const closure = computeClosure(finalMetafile, finalEntryFile, buildCwd);
  const coverage = closure.map((absPath, i) => [absPath, `__f${i}`]);

  const finalPassEntryContents = [
    ...specifiers.map((spec) => `export * as ${safeName(spec)} from ${JSON.stringify(spec)};`),
    ...coverage.map(([absPath, key]) => `export * as ${key} from ${JSON.stringify(absPath)};`),
  ].join('\n');
  const finalPassEntryFile = path.join(VENDOR_SCRATCH_DIR, `entry-final-${framework}-${process.pid}-${Date.now()}.js`);
  fs.writeFileSync(finalPassEntryFile, finalPassEntryContents);
  try {
    await esbuild.build({
      ...esbuildOptions,
      entryPoints: [finalPassEntryFile],
      outfile: vendorFilePath(framework),
      bundle: true,
      format: 'iife',
      globalName: globalVarName(framework),
      minify: true,
      metafile: false,
      logLevel: 'silent',
    });
  } finally {
    fs.rmSync(finalPassEntryFile, { force: true });
  }

  const manifest = {
    framework,
    specifiers,
    globalVar: globalVarName(framework),
    file: path.basename(vendorFilePath(framework)),
    coverage,
    packages: resolvePackageVersions(specifiers),
  };
  fs.writeFileSync(manifestPath(framework), JSON.stringify(manifest, null, 2));
  manifestCache.set(framework, manifest);
  return manifest;
}

const manifestCache = new Map();
function getVendorManifest(framework) {
  if (manifestCache.has(framework)) return manifestCache.get(framework);
  let manifest = null;
  const p = manifestPath(framework);
  if (fs.existsSync(p)) {
    try {
      manifest = JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch {
      manifest = null;
    }
  }
  manifestCache.set(framework, manifest);
  return manifest;
}

function invalidateVendorManifestCache(framework) {
  if (framework) manifestCache.delete(framework);
  else manifestCache.clear();
}

function vendorGlobalPlugin(framework) {
  return {
    name: 'vendor-bundle:external-global',
    setup(build) {
      const manifest = getVendorManifest(framework);
      if (!manifest) return;
      if (manifest.specifiers.length === 0) return;
      const specSet = new Set(manifest.specifiers);
      const coverageMap = new Map(manifest.coverage || []);
      const keywords = VENDOR_KEYWORDS[framework] || [];

      build.onResolve({ filter: specifierFilter(manifest.specifiers) }, (args) => {
        if (!specSet.has(args.path)) return null;
        return { path: safeName(args.path), namespace: 'dx-vendor-external' };
      });

      // A bundler-internal reimport can bypass the bare specifier text entirely (resolving
      // straight to one of the vendor bundle's internal chunk files). Catching that in
      // onResolve would need a recursive build.resolve() call to find out where it lands —
      // but nested build.resolve() calls can't reliably guard against reentrancy via
      // pluginData (other plugins' own nested resolves overwrite it with their own flag),
      // which caused infinite mutual recursion with other plugins here. onLoad sidesteps
      // this entirely: by the time it fires, esbuild has already resolved args.path to an
      // absolute file path, so the coverage map can be checked directly, no recursion needed.
      if (coverageMap.size > 0 && keywords.length > 0) {
        build.onLoad({ filter: keywordFilter(keywords) }, (args) => {
          const key = coverageMap.get(args.path);
          if (!key) return null;
          return {
            contents: `module.exports = Object.assign({ __esModule: true }, window.${manifest.globalVar}[${JSON.stringify(key)}]);`,
            loader: 'js',
          };
        });
      }

      build.onLoad({ filter: /.*/, namespace: 'dx-vendor-external' }, (args) => ({
        // __esModule:true so esbuild's CJS-interop helper doesn't double-wrap default exports.
        contents: `module.exports = Object.assign({ __esModule: true }, window.${manifest.globalVar}[${JSON.stringify(args.path)}]);`,
        loader: 'js',
      }));
    },
  };
}

function vendorScriptTag(framework) {
  const manifest = getVendorManifest(framework);
  if (!manifest) return '';
  return `<script src="${VENDOR_HREF_PREFIX}${manifest.file}"></script>`;
}

module.exports = {
  discoverSpecifiers,
  discoverDemoSpecifiers,
  resolvePackageVersions,
  buildVendorBundle,
  getVendorManifest,
  invalidateVendorManifestCache,
  vendorGlobalPlugin,
  vendorScriptTag,
  isVendorSpecifier,
  VENDOR_PREFIXES,
};
