// Builds a shared devextreme/framework-runtime bundle once per framework so demos
// can reference it instead of each bundling their own copy — see buildVendorBundle.

const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');

const DEMOS_APP_ROOT = path.join(__dirname, '..', '..');
const SRC_DEMOS_DIR = path.join(DEMOS_APP_ROOT, 'Demos');
const VENDOR_OUT_DIR = path.join(DEMOS_APP_ROOT, 'bundles', 'vendor');
// Inside apps/demos (not os.tmpdir()) so node_modules resolution finds apps/demos/node_modules.
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

// Prefix-based: devextreme/devextreme-react/devextreme-vue have no root export.
const VENDOR_PREFIXES = {
  React: [/^react$/, /^react-dom(\/.*)?$/, /^devextreme(-react)?(\/.*)?$/],
  ReactJs: [/^react$/, /^react-dom(\/.*)?$/, /^devextreme(-react)?(\/.*)?$/],
  Vue: [/^vue$/, /^devextreme(-vue)?(\/.*)?$/],
  Angular: [
    /^@angular\/(core|common|forms|platform-browser|platform-browser-dynamic|animations|router)(\/.*)?$/,
    /^devextreme(-angular)?(\/.*)?$/,
    /^rxjs(\/.*)?$/,
  ],
};

function isVendorSpecifier(spec, framework) {
  return (VENDOR_PREFIXES[framework] || []).some((re) => re.test(spec));
}

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.vue']);
const IMPORT_SPECIFIER_RE = /(?:import|export)(?:[^'";]*?from)?\s*['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\s*\)|import\(\s*['"]([^'"]+)['"]\s*\)/g;

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
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
      const files = [];
      walk(fwDir, files);
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        IMPORT_SPECIFIER_RE.lastIndex = 0;
        let m;
        // eslint-disable-next-line no-cond-assign
        while ((m = IMPORT_SPECIFIER_RE.exec(content))) {
          const spec = m[1] || m[2] || m[3];
          if (spec && isVendorSpecifier(spec, framework)) found.add(spec);
        }
      }
    }
  }
  return found;
}

function safeName(spec) {
  return spec.replace(/[^a-zA-Z0-9_]/g, '_');
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Narrow on purpose: esbuild only round-trips to JS for paths matching this filter,
// so a broad filter here pays that cost for every resolution in the bundle.
function specifierFilter(specifiers) {
  return new RegExp(`^(?:${specifiers.map(escapeRegExp).join('|')})$`);
}

const MAX_ATTEMPTS = 10;

async function buildVendorBundle(framework, esbuildOptions = {}) {
  let specifiers = Array.from(discoverSpecifiers(framework)).sort();
  if (specifiers.length === 0) return null;

  fs.mkdirSync(VENDOR_OUT_DIR, { recursive: true });
  fs.mkdirSync(VENDOR_SCRATCH_DIR, { recursive: true });

  const dropped = new Set();
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
        metafile: false,
        logLevel: 'silent',
      }).then(() => ({ ok: true })).catch((err) => ({ ok: false, err }));
    } finally {
      fs.rmSync(entryFile, { force: true });
    }

    if (result.ok) break;

    // Regex-based discovery can pick up type-only/dead specifiers that never
    // actually resolve; drop exactly the lines esbuild reports and retry.
    const buildCwd = esbuildOptions.absWorkingDir || process.cwd();
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

  const manifest = {
    framework,
    specifiers,
    globalVar: globalVarName(framework),
    file: path.basename(vendorFilePath(framework)),
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

      build.onResolve({ filter: specifierFilter(manifest.specifiers) }, (args) => {
        if (!specSet.has(args.path)) return null;
        return { path: args.path, namespace: 'dx-vendor-external' };
      });

      build.onLoad({ filter: /.*/, namespace: 'dx-vendor-external' }, (args) => ({
        // __esModule:true so esbuild's CJS-interop helper doesn't double-wrap default exports.
        contents: `module.exports = Object.assign({ __esModule: true }, window.${manifest.globalVar}[${JSON.stringify(safeName(args.path))}]);`,
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
  buildVendorBundle,
  getVendorManifest,
  invalidateVendorManifestCache,
  vendorGlobalPlugin,
  vendorScriptTag,
  isVendorSpecifier,
  VENDOR_PREFIXES,
};
