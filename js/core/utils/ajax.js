var Deferred = require("./deferred").Deferred;
var domAdapter = require("../../core/dom_adapter");
var httpRequest = require("../../core/http_request");
var windowUtils = require("../../core/utils/window");
var window = windowUtils.getWindow();
var extendFromObject = require("./extend").extendFromObject;
var isDefined = require("./type").isDefined;
var Promise = require("../polyfills/promise");
var injector = require("./dependency_injector");

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
        var value = params[name];

        if(value === undefined) {
            continue;
        }

        if(value === null) {
            value = "";
        }

        result.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
    }

    return result.join("&");
};

var createScript = function(options) {
    var script = domAdapter.createElement("script");
    for(var name in options) {
        script[name] = options[name];
    }
    return script;
};

var removeScript = function(scriptNode) {
    scriptNode.parentNode.removeChild(scriptNode);
};

var appendToHead = function(element) {
    return domAdapter.getHead().appendChild(element);
};

var evalScript = function(code) {
    var script = createScript({ text: code });
    appendToHead(script);
    removeScript(script);
};

var evalCrossDomainScript = function(url) {
    var script = createScript({ src: url });

    return new Promise(function(resolve, reject) {
        var events = {
            "load": resolve,
            "error": reject
        };

        var loadHandler = function(e) {
            events[e.type]();
            removeScript(script);
        };

        for(var event in events) {
            domAdapter.listen(script, event, loadHandler);
        }

        appendToHead(script);
    });
};

var getAcceptHeader = function(options) {

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

var getContentTypeHeader = function(options) {
    var defaultContentType;
    if(options.data && !options.upload && getMethod(options) !== "GET") {
        defaultContentType = "application/x-www-form-urlencoded;charset=utf-8";
    }

    return options.contentType ||
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
            deferred.resolve(data, SUCCESS, xhr);
            break;

        case "json":
            try {
                deferred.resolve(JSON.parse(data), SUCCESS, xhr);
            } catch(e) {
                deferred.reject(xhr, PARSER_ERROR, e);
            }
            break;

        default:
            deferred.resolve(data, SUCCESS, xhr);
    }
};

var isCrossDomain = function(url) {
    if(!windowUtils.hasWindow()) {
        return true;
    }

    var crossDomain = false,
        originAnchor = domAdapter.createElement("a"),
        urlAnchor = domAdapter.createElement("a");

    originAnchor.href = window.location.href;

    try {
        urlAnchor.href = url;

        // NOTE: IE11
        // eslint-disable-next-line no-self-assign
        urlAnchor.href = urlAnchor.href;

        crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
            urlAnchor.protocol + "//" + urlAnchor.host;
    } catch(e) {
        crossDomain = true;
    }
    return crossDomain;
};

var setHttpTimeout = function(timeout, xhr) {
    return timeout && setTimeout(function() {
        xhr.customStatus = TIMEOUT;
        xhr.abort();
    }, timeout);
};

var getJsonpOptions = function(options) {
    if(options.dataType === "jsonp") {
        var random = Math.random().toString().replace(/\D/g, ""),
            callbackName = options.jsonpCallback || "dxCallback" + Date.now() + "_" + random,
            callbackParameter = options.jsonp || "callback";

        options.data = options.data || {};
        options.data[callbackParameter] = callbackName;

        return callbackName;
    }
};

var getRequestOptions = function(options, headers) {

    var params = options.data,
        paramsAlreadyString = typeof params === "string",
        url = options.url || window.location.href;

    if(!paramsAlreadyString && !options.cache) {
        params = params || {};
        params["_"] = Date.now();
    }

    if(params && !options.upload) {
        if(!paramsAlreadyString) {
            params = paramsConvert(params);
        }

        if(getMethod(options) === "GET") {
            if(params !== "") {
                url += (url.indexOf("?") > -1 ? "&" : "?") + params;
            }
            params = null;
        } else if(headers["Content-Type"] && headers["Content-Type"].indexOf("application/x-www-form-urlencoded") > -1) {
            params = params.replace(/%20/g, "+");
        }
    }

    return {
        url: url,
        parameters: params
    };
};

var getMethod = function(options) {
    return (options.method || "GET").toUpperCase();
};

var getRequestHeaders = function(options) {
    var headers = options.headers || {};

    headers["Content-Type"] = headers["Content-Type"] || getContentTypeHeader(options);
    headers["Accept"] = headers["Accept"] || getAcceptHeader(options);

    if(!options.crossDomain && !headers["X-Requested-With"]) {
        headers["X-Requested-With"] = "XMLHttpRequest";
    }
    return headers;
};


var sendRequest = function(options) {
    var xhr = httpRequest.getXhr(),
        d = new Deferred(),
        result = d.promise(),
        async = isDefined(options.async) ? options.async : true,
        dataType = options.dataType,
        timeout = options.timeout || 0,
        timeoutId;

    options.crossDomain = isCrossDomain(options.url);
    var needScriptEvaluation = dataType === "jsonp" || dataType === "script";

    if(options.cache === undefined) {
        options.cache = !needScriptEvaluation;
    }

    var callbackName = getJsonpOptions(options),
        headers = getRequestHeaders(options),
        requestOptions = getRequestOptions(options, headers),
        url = requestOptions.url,
        parameters = requestOptions.parameters;

    if(callbackName) {
        window[callbackName] = function(data) {
            d.resolve(data, SUCCESS, xhr);
        };
    }

    if(options.crossDomain && needScriptEvaluation) {
        var reject = function() {
                d.reject(xhr, ERROR);
            },
            resolve = function() {
                if(dataType === "jsonp") return;
                d.resolve(null, SUCCESS, xhr);
            };

        evalCrossDomainScript(url).then(resolve, reject);
        return result;
    }

    if(options.crossDomain && !("withCredentials" in xhr)) {
        d.reject(xhr, ERROR);
        return result;
    }

    xhr.open(
        getMethod(options),
        url,
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
                    d.resolve(null, NO_CONTENT, xhr);
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

    for(var name in headers) {
        if(Object.prototype.hasOwnProperty.call(headers, name) && isDefined(headers[name])) {
            xhr.setRequestHeader(name, headers[name]);
        }
    }

    if(options.beforeSend) {
        options.beforeSend(xhr);
    }

    xhr.send(parameters);

    result.abort = function() {
        xhr.abort();
    };

    return result;
};

module.exports = injector({ sendRequest: sendRequest });
