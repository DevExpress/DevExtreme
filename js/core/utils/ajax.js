"use strict";

var $ = require("../renderer");

// url, method, headers, body, withCredentials, responseType

var sendRequest = function(options) {
    var params = options.data && $.param(options.data);

    options.type = options.type || "get";

    if(options.type.toLowerCase() === "get") {
        if(params) {
            options.url += (options.url.indexOf("?") > -1 ? "&" : "?") + params;
            delete options.data;
        }
        if(options.dataType === "jsonp") {
            options.url += (options.url.indexOf("?") > -1 ? "&" : "?") + "_=" + (Date.now);
        }
    }

    return $.ajax.call($, options);
};

exports.sendRequest = sendRequest;
