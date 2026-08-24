const {
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
} = require('../server/csp-bundle-angular');

let createCompilerPluginPromise = null;
function getCreateCompilerPlugin() {
  if (!createCompilerPluginPromise) {
    createCompilerPluginPromise = Promise.resolve()
      .then(() => resolveAngularBuildPrivate().createCompilerPlugin);
  }
  return createCompilerPluginPromise;
}

async function buildAngularDemoInPlace(widget, name, srcDir) {
  const entry = findAngularEntry(srcDir);
  if (!entry) return { ok: false, reason: 'no app/app.component.ts (or main.ts/index.ts) entry' };

  const demo = { widget, name, srcDir, entry };
  const cssFiles = discoverComponentStyleFiles([entry]);
  const shims = computeGlobalShims(cssFiles);
  let installed = [];

  try {
    installed = installShims(shims);
    const createCompilerPlugin = await getCreateCompilerPlugin();
    const prepared = prepareDemo(demo);
    return await bundleDemo(prepared, createCompilerPlugin, srcDir);
  } finally {
    removeShims(installed);
    cleanupPatchedTsFiles();
    cleanupEntryShims();
  }
}

module.exports = { buildAngularDemoInPlace };
