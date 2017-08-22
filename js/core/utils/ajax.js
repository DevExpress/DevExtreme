"use strict";

//var jQuery = require("jquery");
var Deferred = require("./deferred").Deferred;
var extendFromObject = require("./extend").extendFromObject;
var isEmpty = require("./string").isEmpty;

var isStatusSuccess = function(status) {
    return 200 <= status && status < 300;
};

var paramsConvert = function(params) {
    var result = [];

    for(var name in params) {
        result.push(encodeURIComponent(name) + "=" + encodeURIComponent(params[name]));
    }

    return result.join("&");
};

var evalScript = function(code) {
    var script = document.createElement("script");
    script.text = code;
    document.head.appendChild(script).parentNode.removeChild(script);
};

var getAcceptHeader = function(options, headers) {
    if(headers["Accept"]) {
        return headers["Accept"];
    }

    var dataType = options.dataType || "*",
        accepts = {
            "*": "*/*",
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript"
        };
    extendFromObject(accepts, options.accepts);

    return accepts[dataType] ?
            accepts[dataType] + (dataType !== "*" ? ", */*; q=0.01" : "") :
            accepts["*"];
};

var getContentTypeHeader = function(options, headers) {
    var contentTypes = [options.contentType, headers["Content-Type"]],
        realTypes = [];

    for(var i in contentTypes) {
        var type = contentTypes[i];
        if(!isEmpty(type)) realTypes.push(type);
    }

    if(!realTypes.length) {
        return "application/x-www-form-urlencoded; charset=UTF-8";
    }

    return realTypes.join();
};

var processData = function(deferred, xhr, dataType) {
    var data = (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? xhr.response : xhr.responseText;
    if(dataType === "json") {
        try {
            deferred.resolve(JSON.parse(data));
        } catch(e) { // TODO - test this and resolve with normal error
            deferred.reject(e);
        }
    } else if(dataType === "script") {
        evalScript(data);
        deferred.resolve();
    } else {
        deferred.resolve(data);
    }
};

var sendRequest = function(options) {
    // if(!options.responseType && !options.upload) {
    //     return jQuery.ajax(options);
    // }
    var xhr = new XMLHttpRequest();
    var d = new Deferred();
    var result = d.promise();

    var headers = options.headers || {};
    var params = options.data;
    var method = options.method || "GET";
    var useJsonp = options.dataType === "jsonp" || options.jsonp;

    if(useJsonp) {
        var timestamp = Date.now();
        var callbackName = options.jsonp || "callback" + timestamp;
        params = params || {};
        params["$format"] = "json";
        params["$callback"] = callbackName;
        params["_"] = timestamp;
        window[callbackName] = function(data) {
            d.resolve(data);
        };
    }

    if(params && typeof params !== "string" && !options.upload) {
        params = paramsConvert(params);
    }

    if(method.toUpperCase() === "GET" && params) {
        options.url += (options.url.indexOf("?") > -1 ? "&" : "?") + params;
        params = null;
    }

    xhr.open(
        method,
        options.url,
        options.async || true,
        options.username,
        options.password);

    xhr.timeout = options.timeout || 0;

    xhr["onreadystatechange"] = function(e) {
        if(xhr.readyState === 4) {
            if(isStatusSuccess(xhr.status)) {
                useJsonp ? evalScript(xhr.responseText) : processData(d, xhr, options.dataType);
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

    headers["Content-Type"] = getContentTypeHeader(options, headers);
    headers["Accept"] = getAcceptHeader(options, headers);

    for(var name in headers) {
        if(headers.hasOwnProperty(name)) {
            xhr.setRequestHeader(name, headers[name]);
        }
    }

    if(options.beforeSend) {
        options.beforeSend(xhr);
    }

    xhr.send(params);

    result.abort = function() {
        xhr.abort();
    };

    return result;
};

exports.sendRequest = sendRequest;
