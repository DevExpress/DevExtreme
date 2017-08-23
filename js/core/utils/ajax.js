"use strict";

//var jQuery = require("jquery");
var Deferred = require("./deferred").Deferred;
var extendFromObject = require("./extend").extendFromObject;

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
        scriptAccept = "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
        accepts = {
            "*": "*/*",
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript",
            jsonp: scriptAccept,
            script: scriptAccept
        };
    extendFromObject(accepts, options.accepts);

    return accepts[dataType] ?
            accepts[dataType] + (dataType !== "*" ? ", */*; q=0.01" : "") :
            accepts["*"];
};

var getContentTypeHeader = function(options, headers, method) {
    var defaultContentType;
    if(options.data && method !== "GET") {
        defaultContentType = "application/x-www-form-urlencoded;charset=utf-8";
    }

    return headers["Content-Type"] ||
           options.contentType ||
           defaultContentType;
};

var postProcess = function(deferred, xhr, dataType) {

    var data = xhr.responseType && xhr.responseType !== "text" || typeof xhr.responseText !== "string"
                ? xhr.response
                : xhr.responseText;

    if(dataType === "json") {
        try {
            deferred.resolve(JSON.parse(data));
        } catch(e) {
            deferred.reject(e);
        }
    } else if(dataType === "script") {
        evalScript(data);
        deferred.resolve(data);
    } else {
        deferred.resolve(data);
    }
};

var sendRequest = function(options) {

    //return jQuery.ajax(options);

    var xhr = new XMLHttpRequest(),
        d = new Deferred(),
        result = d.promise(),

        headers = options.headers || {},
        params = options.data,
        method = (options.method || "GET").toUpperCase(),
        useJsonp = options.dataType === "jsonp" || options.jsonp,
        contentType = getContentTypeHeader(options, headers, method);

    if(useJsonp) {
        var timestamp = Date.now(),
            callbackName = options.jsonpCallback || "callback" + timestamp + "_" + Math.random().toString().replace(/\D/g, ""),
            callbackParameter = options.jsonp || "callback";

        params = params || {};
        params[callbackParameter] = callbackName;
        params["_"] = timestamp;

        window[callbackName] = function(data) {
            d.resolve(data);
        };
    }

    if(params) {
        if(typeof params !== "string" && !options.upload) {
            params = paramsConvert(params);
        }

        if(method === "GET") {
            options.url += (options.url.indexOf("?") > -1 ? "&" : "?") + params;
            params = null;
        } else if(contentType && contentType.indexOf("application/x-www-form-urlencoded") > -1) {
            params = params.replace(/%20/g, "+");
        }
    }

    xhr.open(
        method,
        options.url,
        options.async,
        options.username,
        options.password);

    if(options.async) {
        xhr.timeout = options.timeout || 0;
    }

    xhr["onreadystatechange"] = function(e) {
        if(xhr.readyState === 4) {
            if(isStatusSuccess(xhr.status)) {
                useJsonp ? evalScript(xhr.responseText) : postProcess(d, xhr, options.dataType);
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

    headers["Content-Type"] = contentType;
    headers["Accept"] = getAcceptHeader(options, headers);
    headers["X-Requested-With"] = "XMLHttpRequest";

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
