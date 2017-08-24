"use strict";

var Deferred = require("./deferred").Deferred;
var extendFromObject = require("./extend").extendFromObject;
var isDefined = require("./type").isDefined;
var ajaxStrategy;

var SUCCESS = "success",
    ERROR = "error",
    TIMEOUT = "timeout",
    NO_CONTENT = "nocontent",
    PARSER_ERROR = "parsererror";


var isStatusSuccess = function(status) {
    return 200 <= status && status < 300;
};

var hasContent = function(status) {
    return status !== 204;
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

var evalScriptForCrossDomain = function(options, dataType, d) {
    var script = document.createElement("script");
    script.src = options.url;
    document.head.appendChild(script);

    window.addEventListener("load", function(e) {
        if(dataType !== "jsonp") {
            d.resolve(null, SUCCESS);
        }
        script.parentNode.removeChild(script);
    });

    window.addEventListener("error", function(e) {
        d.reject(null, ERROR);
        script.parentNode.removeChild(script);
    });
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
    extendFromObject(accepts, options.accepts, true);

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

var getDataFromResponse = function(xhr) {
    return xhr.responseType && xhr.responseType !== "text" || typeof xhr.responseText !== "string"
                ? xhr.response
                : xhr.responseText;
};

var postProcess = function(deferred, xhr, dataType) {

    var data = getDataFromResponse(xhr);

    switch(dataType) {
        case "jsonp":
            evalScript(data);
            break;

        case "script":
            evalScript(data);
            deferred.resolve(data, SUCCESS);
            break;

        case "json":
            try {
                deferred.resolve(JSON.parse(data), SUCCESS);
            } catch(e) {
                deferred.reject(xhr, PARSER_ERROR, e);
            }
            break;

        default:
            deferred.resolve(data, SUCCESS);
    }
};

var isCrossDomain = function(url) {
    var crossDomain = false,
        originAnchor = document.createElement("a"),
        urlAnchor = document.createElement("a");

    originAnchor.href = location.href;

    try {
        urlAnchor.href = url;
        urlAnchor.href = urlAnchor.href;

        crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
            urlAnchor.protocol + "//" + urlAnchor.host;
    } catch(e) {
        crossDomain = true;
    }
    return crossDomain;
};

var setHttpTimeout = function(timeout, xhr, deferred) {
    return timeout && setTimeout(function() {
        xhr.customStatus = TIMEOUT;
        xhr.abort();
    }, timeout);
};

var sendRequest = function(options) {

    if(ajaxStrategy && !options.responseType && !options.upload) {
        return ajaxStrategy(options);
    }

    var xhr = new XMLHttpRequest(),
        d = new Deferred(),
        result = d.promise(),

        headers = options.headers || {},
        params = options.data,
        method = (options.method || "GET").toUpperCase(),
        async = isDefined(options.async) ? options.async : true,
        dataType = options.dataType,
        useJsonp = dataType === "jsonp",
        contentType = getContentTypeHeader(options, headers, method),
        timeout = options.timeout || 0,
        timeoutId;

    if(useJsonp) {
        var timestamp = Date.now(),
            random = Math.random().toString().replace(/\D/g, ""),
            callbackName = options.jsonpCallback || "callback" + timestamp + "_" + random,
            callbackParameter = options.jsonp || "callback";

        params = params || {};
        params[callbackParameter] = callbackName;
        params["_"] = timestamp;

        dataType = "jsonp";

        window[callbackName] = function(data) {
            d.resolve(data, SUCCESS);
        };
    }

    if(params && !options.upload) {
        if(typeof params !== "string") {
            params = paramsConvert(params);
        }

        if(method === "GET") {
            options.url += (options.url.indexOf("?") > -1 ? "&" : "?") + params;
            params = null;
        } else if(contentType && contentType.indexOf("application/x-www-form-urlencoded") > -1) {
            params = params.replace(/%20/g, "+");
        }
    }

    if(isCrossDomain(options.url) && (dataType === "jsonp" || dataType === "script")) {
        evalScriptForCrossDomain(options, dataType, d);
        return result;
    }

    xhr.open(
        method,
        options.url,
        async,
        options.username,
        options.password);

    if(async) {
        xhr.timeout = timeout;
        timeoutId = setHttpTimeout(timeout, xhr, d);
    }

    xhr["onreadystatechange"] = function(e) {
        if(xhr.readyState === 4) {
            clearTimeout(timeoutId);
            if(isStatusSuccess(xhr.status)) {
                if(hasContent(xhr.status)) {
                    postProcess(d, xhr, dataType);
                } else {
                    d.resolve(null, NO_CONTENT);
                }
            } else {
                d.reject(xhr, xhr.customStatus || ERROR);
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
    if(!isCrossDomain(options.url) && !headers["X-Requested-With"]) {
        headers["X-Requested-With"] = "XMLHttpRequest";
    }

    for(var name in headers) {
        if(headers.hasOwnProperty(name) && isDefined(headers[name])) {
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

var setAjaxStrategy = function(strategy) {
    ajaxStrategy = strategy;
};

exports.setAjaxStrategy = setAjaxStrategy;
exports.sendRequest = sendRequest;
