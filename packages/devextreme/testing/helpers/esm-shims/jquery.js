/**
 * ESM jquery shim for QUnit import-map loader.
 * jQuery is loaded via classic script tag before modules run;
 * run-suite calls `jQuery.noConflict()` which clears `window.$`.
 * Re-attach `$` so suites that use the global alias (without importing
 * jquery) keep working.
 */
const $ = window.jQuery;

if(!$ || typeof $.fn === 'undefined') {
    throw new Error('ESM jquery shim: window.jQuery is not available');
}

window.$ = $;

export default $;
export { $ };
