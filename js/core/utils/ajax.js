"use strict";

var jQuery = require("jquery");
var Deferred = require("./deferred").Deferred;
var extendFromObject = require("./extend").extendFromObject;

var isStatusSuccess = function(status) {
    return 200 <= status && status < 300;
};

var sendRequest = function(options) {
    if(!options.responseType && !options.upload) {
        return jQuery.ajax(options);
    }
    var xhr = new XMLHttpRequest();
    var d = new Deferred();
    var result = d.promise();
    var contentType = options.contentType || "application/x-www-form-urlencoded; charset=UTF-8";

    var dataType = options.dataType || "*";
    var accepts = {
        "*": "*/*",
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
    };
    extendFromObject(accepts, options.accepts);

    var acceptHeader = accepts[dataType] ?
        accepts[dataType] + (dataType !== "*" ? ", */*; q=0.01" : "") :
        accepts["*"];

    xhr.open(
        options.method || "GET",
        options.url,
        options.async,
        options.username,
        options.password);

    xhr.setRequestHeader("Content-Type", contentType);
    xhr.setRequestHeader("Accept", acceptHeader);
    xhr.timeout = options.timeout || 0;

    xhr["onreadystatechange"] = function(e) {
        if(xhr.readyState === 4) {
            if(isStatusSuccess(xhr.status)) {
                d.resolve(xhr.response);
            } else {
                d.reject(xhr);
            }
        }
    };

    if(options.upload) {
        xhr.upload["onprogress"] = options.upload["onprogress"];
        xhr.upload["onloadstart"] = options.upload["onloadstart"];
        xhr.upload["onabort"] = options.upload["onabort"];
    }

    if(options.xhrFields) {
        for(var field in options.xhrFields) {
            xhr[field] = options.xhrFields[field];
        }
    }

    if(options.responseType === "arraybuffer") {
        xhr.responseType = options.responseType;
    }

    if(options.headers) {
        for(var name in options.headers) {
            if(options.headers.hasOwnProperty(name)) {
                xhr.setRequestHeader(name, options.headers[name]);
            }
        }
    }

    if(options.beforeSend) {
        options.beforeSend(xhr);
    }

    xhr.send(options.data);

    result.abort = function() {
        xhr.abort();
    };

    return result;
};

exports.sendRequest = sendRequest;
