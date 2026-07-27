/**
 * Injects a stylesheet once for ESM import-map QUnit mode
 * (replaces SystemJS `*.css!` plugin imports).
 */
export function injectStylesheet(href) {
    const existing = document.querySelector(`link[data-dx-esm-css="${href}"]`);
    if(existing) {
        return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-dx-esm-css', href);
    document.head.appendChild(link);
}
