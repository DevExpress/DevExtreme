/**
 * Injects a stylesheet once for ESM import-map QUnit mode
 * (replaces legacy `*.css!` plugin imports).
 *
 * Returns a Promise so importers can `await` load — otherwise tests that
 * assert computed styles race the async <link> fetch.
 */
export function injectStylesheet(href) {
    const existing = document.querySelector(`link[data-dx-esm-css="${href}"]`);
    if(existing) {
        return waitForStylesheet(existing, href);
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-dx-esm-css', href);
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
