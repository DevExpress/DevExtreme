"use strict";

var errors = require("../core/errors"),
    proxyUrlFormatter = require("./proxy_url_formatter");

var location = window.location,
    IS_WINJS_ORIGIN = location.protocol === "ms-appx:",
    IS_LOCAL_ORIGIN = isLocalHostName(location.hostname);

function isLocalHostName(url) {
    return /^(localhost$|127\.)/i.test(url); // TODO more precise check for 127.x.x.x IP
}

/**
* @name EndpointSelector
* @publicName EndpointSelector
* @type object
* @namespace DevExpress
* @module data/endpoint_selector
* @export default
*/
var EndpointSelector = function(config) {
    this.config = config;
};

EndpointSelector.prototype = {
    /**
    * @name EndpointSelectorMethods_urlFor
    * @publicName urlFor(key)
    * @param1 key:string
    * @type method
    * @return string
    */
    urlFor: function(key) {
        var bag = this.config[key];
        if(!bag) {
            throw errors.Error("E0006");
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
