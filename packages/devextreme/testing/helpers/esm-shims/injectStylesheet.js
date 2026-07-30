/**
 * Injects a stylesheet once for ESM import-map QUnit mode
 * (replaces legacy `*.css!` plugin imports).
 *
 * Returns a Promise so importers can `await` load — otherwise tests that
 * assert computed styles race the async <link> fetch.
 *
 * @param {string} href
 * @param {{ themeName?: string }} [options]
 *   themeName — set data-theme like SystemJS css-systemjs modules did
 *   (fluent.blue.light / generic.light / …) and attach theme classes on body
 *   without adding dx-viewport (tests use that class on #qunit-fixture only).
 */
export function injectStylesheet(href, options = {}) {
    const existing = document.querySelector(`link[data-dx-esm-css="${href}"]`);
    if(existing) {
        return waitForStylesheet(existing, href).then(() => {
            if(options.themeName) {
                applyThemeClasses(options.themeName);
            }
        });
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-dx-esm-css', href);
    if(options.themeName) {
        link.setAttribute('data-theme', options.themeName);
    }
    document.head.appendChild(link);
    return waitForStylesheet(link, href).then(() => {
        if(options.themeName) {
            applyThemeClasses(options.themeName);
        }
    });
}

/**
 * Mirrors themes.getCssClasses — typography/color without claiming dx-viewport.
 * @param {string} themeName
 */
function applyThemeClasses(themeName) {
    const parts = themeName.split('.');
    if(!parts[0] || !document.body) {
        return;
    }

    const classes = [
        `dx-theme-${parts[0]}`,
        `dx-theme-${parts[0]}-typography`,
    ];

    if(parts.length > 1) {
        const isMaterialBased = parts[0] === 'material' || parts[0] === 'fluent';
        classes.push(
            isMaterialBased && parts[2]
                ? `dx-color-scheme-${parts[1]}-${parts[2]}`
                : `dx-color-scheme-${parts[1]}`,
        );
    }

    document.body.classList.add(...classes);
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
