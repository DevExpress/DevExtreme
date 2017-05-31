"use strict";

var $ = require("../renderer");

// url, method, headers, body, withCredentials, responseType


var sendRequest = function(params) {
    var deferred = $.Deferred(),
        xhr = new XMLHttpRequest();

    xhr.open("GET", params.url, true);
    xhr.setRequestHeader("Content-Type", params.responseType);

    xhr["onreadystatechange"] = function() {
        if(xhr.readyState === 4) {
            if(xhr.status === 200) {
                deferred.resolve(xhr.response);
            } else {
                deferred.reject("HTTP error: " + xhr.status);
            }
        }
    };

    xhr.send();
    return deferred;
};

exports.sendRequest = sendRequest;
