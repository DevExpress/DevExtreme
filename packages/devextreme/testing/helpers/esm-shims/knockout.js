/**
 * ESM knockout shim for QUnit import-map loader.
 * Knockout is loaded via classic script tag before modules run.
 */
const ko = window.ko;

if(!ko) {
    throw new Error('ESM knockout shim: window.ko is not available');
}

export default ko;
export { ko };
