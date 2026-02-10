

const { createUnplugin } = require('unplugin');
const { getDevExpressLCXKey } = require('./dx-get-lcx');
const { tryConvertLCXtoLCP } = require('./dx-lcx-2-lcp');

const PLACEHOLDER = '/* ___$$$$$___devextreme___lcp___placeholder____$$$$$ */';
// Target only the specific config file to avoid scanning all files during build
const TARGET_FILE_PATTERN = /[\/\\]__internal[\/\\]core[\/\\]m_config\.(ts|js)$/;

const DevExtremeLicensePlugin = createUnplugin(() => {
    let resolvedOnce = false;
    let lcpCache = null;
    let warnedOnce = false;

    function warnOnce(ctx, msg) {
        if(warnedOnce) return;
        warnedOnce = true;
        try {
            if(ctx && typeof ctx.warn === 'function') ctx.warn(msg);
        } catch{}
    }

    function resolveLcpSafe(ctx) {
        if(resolvedOnce) return lcpCache;
        resolvedOnce = true;

        try {
            const { key: lcx } = getDevExpressLCXKey();
            if(!lcx) {
                warnOnce(ctx, '[devextreme-bundler-plugin] LCX not found. Placeholder will remain.');
                return (lcpCache = null);
            }

            const lcp = tryConvertLCXtoLCP(lcx);
            if(!lcp) {
                warnOnce(ctx, '[devextreme-bundler-plugin] LCX->LCP conversion failed. Placeholder will remain.');
                return (lcpCache = null);
            }

            return (lcpCache = lcp);
        } catch{
            warnOnce(ctx, '[devextreme-bundler-plugin] Failed to resolve license key. Placeholder will remain.');
            return (lcpCache = null);
        }
    }

    return {
        name: 'devextreme-bundler-plugin',
        enforce: 'pre',
        transform(code, id) {
            try {
                if(!TARGET_FILE_PATTERN.test(id)) return null;
                if(typeof code !== 'string') return null;
                if(code.indexOf(PLACEHOLDER) === -1) return null;

                const lcp = resolveLcpSafe(this);
                if(!lcp) return null;

                return { code: code.split(PLACEHOLDER).join(lcp), map: null };
            } catch{
                warnOnce(this, '[devextreme-bundler-plugin] Patch error. Placeholder will remain.');
                return null;
            }
        },
    };
});

module.exports = {
    DevExtremeLicensePlugin,
};
