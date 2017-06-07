"use strict";

var $ = require("../renderer");

// url, method, headers, body, withCredentials, responseType

var sendRequest = function(options) {
    if(options.data) {
        options.url += (options.url.indexOf("?") > -1 ? "&" : "?") + $.param(options.data);
        delete options.data;
    }

    return $.ajax(options);
};

exports.sendRequest = sendRequest;
