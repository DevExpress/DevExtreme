// CLI: node utils/server/build-vendor-bundles.js [React|Vue|Angular ...]
// Defaults to React+Vue — Angular is excluded because a separately-bundled
// devextreme-angular/@angular/* throws a JIT/Ivy-linker error at runtime (pass
// `Angular` explicitly to pick that up).

const path = require('path');
const fs = require('fs');
const { buildVendorBundle } = require('./vendor-bundle');

const REQUESTED = process.argv.slice(2);
const FRAMEWORKS = REQUESTED.length > 0 ? REQUESTED : ['React', 'Vue'];

function reactVueOptions(framework) {
  // eslint-disable-next-line global-require
  const { getSharedOptions } = require('./csp-bundle');
  const options = getSharedOptions(framework);
  return {
    ...options,
    plugins: options.plugins.filter((p) => p.name !== 'vendor-bundle:external-global'),
  };
}

function angularOptions() {
  // eslint-disable-next-line global-require
  const cspBundleAngular = require('./csp-bundle-angular');
  const {
    angularSingleCopyPlugin,
    antiForgeryPlugin,
    systemJsQuirksPlugin,
    devextremeAngularSnakeCasePlugin,
    devextremeDistRedirectPlugin,
    devextremeRedirectPlugin,
    NODE_MODULES,
    DEMOS_APP_ROOT,
  } = cspBundleAngular;

  return {
    platform: 'browser',
    target: 'es2022',
    mainFields: ['es2020', 'es2015', 'browser', 'module', 'main'],
    conditions: ['es2020', 'es2015', 'module'],
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
    logLevel: 'silent',
    plugins: [
      angularSingleCopyPlugin,
      antiForgeryPlugin,
      systemJsQuirksPlugin,
      devextremeAngularSnakeCasePlugin,
      devextremeDistRedirectPlugin,
      devextremeRedirectPlugin,
    ],
    resolveExtensions: ['.ts', '.mjs', '.js'],
    absWorkingDir: DEMOS_APP_ROOT,
    nodePaths: [NODE_MODULES],
  };
}

async function main() {
  for (const framework of FRAMEWORKS) {
    const options = framework === 'Angular' ? angularOptions() : reactVueOptions(framework);
    process.stdout.write(`Building vendor bundle for ${framework}... `);
    const manifest = await buildVendorBundle(framework, options);
    if (!manifest) {
      console.log('skipped (no vendor-eligible imports found)');
      // eslint-disable-next-line no-continue
      continue;
    }
    const outFile = path.join(__dirname, '..', '..', 'bundles', 'vendor', manifest.file);
    const size = fs.statSync(outFile).size;
    console.log(`${manifest.specifiers.length} specifiers, ${(size / 1024).toFixed(0)} KB -> bundles/vendor/${manifest.file}`);
  }
}

main().catch((err) => {
  console.error('build-vendor-bundles failed:', err);
  process.exit(1);
});
