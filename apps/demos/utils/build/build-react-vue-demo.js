// In-place esbuild build for a single React/Vue demo (local dev serving).
// Reuses the bundling core from utils/server/csp-bundle.js so the dev path and
// the CI CSP-check path never drift apart; writes bundle.js/bundle.css *and*
// a freshly regenerated index.html next to the demo's own source, instead of
// into csp-bundled-demos/. Regenerating index.html on every build (rather
// than keeping a separate static copy) is what actually needs no per-demo
// module/config generation any more — buildHtml() already reconstructs it
// from the demo's own existing body markup (see extractDemoBodyInner), so
// re-running it against an already-migrated file is a no-op fixed point.

const { bundleDemo } = require('../server/csp-bundle');

async function buildReactVueDemoInPlace(framework, widget, name, srcDir) {
  return bundleDemo({ widget, name, srcDir }, { destDir: srcDir, framework });
}

module.exports = { buildReactVueDemoInPlace };
