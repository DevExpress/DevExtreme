/**
 * Injects a stylesheet once for ESM import-map QUnit mode
 * (`*.css!` suite imports resolve here).
 *
 * Only appends `<link rel=stylesheet data-theme=…>`.
 * Do not add dx-theme-* classes on body — that belongs to themes.attachCssClasses
 * on `.dx-viewport` and would change typography/layout.
 *
 * Returns a Promise so importers can `await` load — otherwise tests that
 * assert computed styles race the async <link> fetch.
 *
 * @param {string} href
 * @param {{ themeName?: string }} [options]
 *   themeName — optional `data-theme` (fluent.blue.light / generic.light / …)
 */
export function injectStylesheet(href, options = {}) {
    const existing = document.querySelector(`link[data-dx-esm-css="${href}"]`);
    if(existing) {
        return waitForStylesheet(existing, href);
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-dx-esm-css', href);
    if(options.themeName) {
        link.setAttribute('data-theme', options.themeName);
    }
    document.head.appendChild(link);
    return waitForStylesheet(link, href);
}

function waitForStylesheet(link, href) {
    if(link.sheet || link.dataset.dxEsmCssLoaded === '1') {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const onLoad = () => {
            link.dataset.dxEsmCssLoaded = '1';
            resolve();
        };
        const onError = () => {
            reject(new Error(`Failed to load stylesheet: ${href}`));
        };

        link.addEventListener('load', onLoad, { once: true });
        link.addEventListener('error', onError, { once: true });

        // Cached stylesheets may already be applied before listeners attach
        if(link.sheet) {
            link.removeEventListener('load', onLoad);
            link.removeEventListener('error', onError);
            onLoad();
        }
    });
}
