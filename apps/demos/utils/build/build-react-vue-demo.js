const { bundleDemo } = require('../server/csp-bundle');

async function buildReactVueDemoInPlace(framework, widget, name, srcDir) {
  return bundleDemo({ widget, name, srcDir }, { destDir: srcDir, framework });
}

module.exports = { buildReactVueDemoInPlace };
