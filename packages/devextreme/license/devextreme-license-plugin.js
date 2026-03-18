const { createUnplugin } = require('unplugin');
const { getDevExpressLCXKey } = require('./dx-get-lcx');
const { tryConvertLCXtoLCP, getLCPWarning } = require('./dx-lcx-2-lcp');
const { MESSAGES } = require('./messages');

const PLUGIN_NAME = 'devextreme-bundler-plugin';
const PLUGIN_PREFIX = `[${PLUGIN_NAME}]`;
const PLACEHOLDER = '/* ___$$$$$___devextreme___lcp___placeholder____$$$$$ */';
// Target only the specific config file to avoid scanning all files during build
const TARGET_FILE_PATTERN = /[\/\\]__internal[\/\\]core[\/\\]m_config\.(ts|js)$/;

const DevExtremeLicensePlugin = createUnplugin(() => {
    let resolvedOnce = false;
    let lcpCache = null;
    let warnedOnce = false;

    function warn(ctx, msg) {
        try {
            if(ctx && typeof ctx.warn === 'function') {
                ctx.warn(msg);
            }
        } catch{}
    }

    function warnOnce(ctx, msg) {
        if(warnedOnce) return;
        warnedOnce = true;
        warn(ctx, msg);
    }

    function warnLicenseIssue(ctx, source, warning) {
        try {
            if(ctx && typeof ctx.warn === 'function') {
                ctx.warn(`${PLUGIN_PREFIX} DevExpress license key (LCX) retrieved from: ${source}`);
                ctx.warn(`${PLUGIN_PREFIX} Warning: ${warning}`);
            }
        } catch{}
    }

    function resolveLcpSafe(ctx) {
        if(resolvedOnce) return lcpCache;
        resolvedOnce = true;

        try {
            const { key: lcx, source } = getDevExpressLCXKey() || {};

            if(!lcx) {
                warnOnce(ctx, `${PLUGIN_PREFIX} Warning: ${MESSAGES.keyNotFound}`);
                return (lcpCache = null);
            }

            const lcp = tryConvertLCXtoLCP(lcx);
            if(!lcp) {
                warnLicenseIssue(ctx, source, MESSAGES.keyNotFound);
                return (lcpCache = null);
            }

            const warning = getLCPWarning(lcp);
            if(warning) {
                warnLicenseIssue(ctx, source, warning);
            }

            return (lcpCache = lcp);
        } catch{
            warnOnce(ctx, `${PLUGIN_PREFIX} Warning: ${MESSAGES.resolveFailed}`);
            return (lcpCache = null);
        }
    }

    return {
        name: PLUGIN_NAME,
        enforce: 'pre',
        transform(code, id) {
            try {
                if(!TARGET_FILE_PATTERN.test(id)) return null;
                if(typeof code !== 'string') return null;
                if(!code.includes(PLACEHOLDER)) return null;

                const lcp = resolveLcpSafe(this);
                if(!lcp) return null;

                return { code: code.split(PLACEHOLDER).join(lcp), map: null };
            } catch{
                warnOnce(this, `${PLUGIN_PREFIX} Patch error. Placeholder will remain.`);
                return null;
            }
        },
    };
});

module.exports = {
    DevExtremeLicensePlugin,
};
