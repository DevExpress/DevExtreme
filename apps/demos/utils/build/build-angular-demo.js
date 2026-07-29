// In-place esbuild+AOT build for a single Angular demo (local dev serving).
// Reuses the AOT/asset-shim/ts-patch internals from utils/server/csp-bundle-angular.js
// so the dev path and the CI CSP-check path never drift apart; writes bundle.js
// *and* a freshly regenerated index.html next to the demo's own source,
// instead of into csp-bundled-demos/. Angular's AOT output names component
// CSS after the component (e.g. app.component.css), not a fixed bundle.css,
// so index.html has to be regenerated to reflect whatever was actually
// produced — bundleDemo() already does exactly that.

const {
  resolveAngularBuildPrivate,
  findAngularEntry,
  prepareDemo,
  discoverComponentStyleFiles,
  computeGlobalShims,
  installShims,
  removeShims,
  cleanupPatchedTsFiles,
  bundleDemo,
} = require('../server/csp-bundle-angular');

// The AOT compiler plugin factory is expensive to resolve (walks node_modules
// for @angular/build/private) — do it once per server process, not per demo.
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
  }
}

module.exports = { buildAngularDemoInPlace };
