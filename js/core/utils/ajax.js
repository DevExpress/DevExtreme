"use strict";

var $ = require("../renderer");

var sendRequest = function(options) {
    // var params = options.data && $.param(options.data);

    // var requestOptions = {
    //     url: options.url,
    //     method: options.method || "get",
    //     dataType: options.dataType,
    //     headers: options.headers,
    //     timeout: options.timeout,
    //     jsonp: options.jsonp,
    //     async: options.async,
    //     accepts: options.accepts, //"json": "application/json;odata=verbose,text/plain"
    //     contentType: options.contentType,
    //     xhrFields: options.xhrFields //withCredentials
    // };

    // if(requestOptions.method.toLowerCase() === "get") {
    //     if(params) {
    //         requestOptions.url += (requestOptions.url.indexOf("?") > -1 ? "&" : "?") + params;
    //     }
    //     if(options.dataType === "jsonp") {
    //         requestOptions.url += (requestOptions.url.indexOf("?") > -1 ? "&" : "?") + "_=" + (Date.now);
    //     }
    // } else {
    //     requestOptions.data = options.data;
    // }

    return $.ajax.call($, options);
};

exports.sendRequest = sendRequest;
