const { bundleDemo } = require('../server/demo-bundle');

async function buildReactVueDemoInPlace(framework, widget, name, srcDir) {
  return bundleDemo({ widget, name, srcDir }, { destDir: srcDir, framework });
}

module.exports = { buildReactVueDemoInPlace };
