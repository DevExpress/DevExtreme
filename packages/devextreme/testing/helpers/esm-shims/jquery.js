/**
 * ESM jquery shim for QUnit import-map loader.
 * jQuery is loaded via classic script tag before modules run.
 */
const $ = window.jQuery;

if(!$ || typeof $.fn === 'undefined') {
    throw new Error('ESM jquery shim: window.jQuery is not available');
}

export default $;
export { $ };
