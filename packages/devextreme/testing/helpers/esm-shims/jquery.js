/**
 * ESM jquery shim for QUnit import-map loader.
 * jQuery is loaded via classic script tag before modules run;
 * run-suite calls `jQuery.noConflict()` which clears `window.$`.
 * Re-attach `$` so suites that use the global alias (without importing
 * jquery) keep working — SystemJS used to restore it when the UMD build
 * was loaded again as a module dependency.
 */
const $ = window.jQuery;

if(!$ || typeof $.fn === 'undefined') {
    throw new Error('ESM jquery shim: window.jQuery is not available');
}

window.$ = $;

export default $;
export { $ };
