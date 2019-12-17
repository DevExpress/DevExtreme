const each = require('../core/utils/iterator').each;
const domAdapter = require('../core/dom_adapter');
const window = require('../core/utils/window').getWindow();
const callOnce = require('../core/utils/call_once');
const DXPROXY_HOST = 'dxproxy.devexpress.com:8000';
const urlMapping = {};

const getUrlParser = callOnce(function() {
    const a = domAdapter.createElement('a');
    const props = ['protocol', 'hostname', 'port', 'pathname', 'search', 'hash'];

    const normalizePath = function(value) {
        // occurs at least in IE
        if(value.charAt(0) !== '/') {
            value = '/' + value;
        }
        return value;
    };

    return function(url) {
        a.href = url;
        const result = {};
        each(props, function() {
            result[this] = a[this];
        });
        result.pathname = normalizePath(result.pathname);
        return result;
    };
});

const parseUrl = function(url) {
    const urlParser = getUrlParser();
    return urlParser(url);
};

const extractProxyAppId = function() {
    return window.location.pathname.split('/')[1];
};

module.exports = {
    parseUrl: parseUrl,

    isProxyUsed: function() {
        return window.location.host === DXPROXY_HOST;
    },

    formatProxyUrl: function(localUrl) {
        const urlData = parseUrl(localUrl);
        if(!/^(localhost$|127\.)/i.test(urlData.hostname)) {
            return localUrl;
        }

        const proxyUrlPart = DXPROXY_HOST + '/' + extractProxyAppId() + '_' + urlData.port;
        urlMapping[proxyUrlPart] = urlData.hostname + ':' + urlData.port;

        const resultUrl = 'http://' + proxyUrlPart + urlData.pathname + urlData.search;
        return resultUrl;
    },

    formatLocalUrl: function(proxyUrl) {
        if(proxyUrl.indexOf(DXPROXY_HOST) < 0) {
            return proxyUrl;
        }

        let resultUrl = proxyUrl;
        for(const proxyUrlPart in urlMapping) {
            if(Object.prototype.hasOwnProperty.call(urlMapping, proxyUrlPart)) {
                if(proxyUrl.indexOf(proxyUrlPart) >= 0) {
                    resultUrl = proxyUrl.replace(proxyUrlPart, urlMapping[proxyUrlPart]);
                    break;
                }
            }
        }

        return resultUrl;
    }
};
