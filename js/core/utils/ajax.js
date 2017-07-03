"use strict";

var $ = require("../renderer");

var isStatusSuccess = function(status) {
    return 200 <= status && status < 300;
};

var sendRequest = function(options) {
    options.xhrFields = options.xhrFields || {};
    options.xhrFields.responseType = options.responseType;

    if(options.upload) {
        var xhr = new XMLHttpRequest();
        var d = $.Deferred();
        var result = d.promise();

        xhr.open(options.method, options.url, true);
        xhr.upload["onprogress"] = options.upload["onprogress"];
        xhr.upload["onloadstart"] = options.upload["onloadstart"];
        xhr.upload["onabort"] = options.upload["onabort"];

        xhr["onreadystatechange"] = function(e) {
            if(xhr.readyState === 4) {
                if(isStatusSuccess(xhr.status)) {
                    d.resolve();
                } else {
                    d.reject(xhr);
                }
            }
        };

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
    }

    return $.ajax(options);
};

exports.sendRequest = sendRequest;
