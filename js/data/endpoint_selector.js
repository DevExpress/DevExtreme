/* global Debug*/
var errors = require('../core/errors'),
    window = require('../core/utils/window').getWindow(),
    proxyUrlFormatter = require('./proxy_url_formatter');

var IS_WINJS_ORIGIN,
    IS_LOCAL_ORIGIN;

function isLocalHostName(url) {
    return /^(localhost$|127\.)/i.test(url); // TODO more precise check for 127.x.x.x IP
}

/**
* @name EndpointSelectorMethods.ctor
* @publicName ctor(options)
* @param1 options:Object
* @hidden
*/
var EndpointSelector = function(config) {
    this.config = config;
    IS_WINJS_ORIGIN = window.location.protocol === 'ms-appx:';
    IS_LOCAL_ORIGIN = isLocalHostName(window.location.hostname);
};

EndpointSelector.prototype = {
    urlFor: function(key) {
        var bag = this.config[key];
        if(!bag) {
            throw errors.Error('E0006');
        }

        if(proxyUrlFormatter.isProxyUsed()) {
            return proxyUrlFormatter.formatProxyUrl(bag.local);
        }

        if(bag.production) {
            if(IS_WINJS_ORIGIN && !Debug.debuggerEnabled || !IS_WINJS_ORIGIN && !IS_LOCAL_ORIGIN) {
                return bag.production;
            }
        }

        return bag.local;
    }

};

module.exports = EndpointSelector;
