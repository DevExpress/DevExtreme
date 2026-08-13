// CLI: node utils/server/build-vendor-bundles.js [React|Vue ...]
// Defaults to both. Angular isn't supported here — see csp-bundle-angular.js's
// `splitting: true` batch build instead (a standalone vendor bundle conflicts with the
// per-demo Angular compiler plugin's own need to read every file's real source; see git
// history / project memory for the investigation).

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

async function main() {
  for (const framework of FRAMEWORKS) {
    const options = reactVueOptions(framework);
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
