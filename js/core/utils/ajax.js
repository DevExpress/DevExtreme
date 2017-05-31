"use strict";

var $ = require("../renderer");

// url, method, headers, body, withCredentials, responseType


var sendRequest = function() {
    return $.ajax.apply($, arguments);
}

exports.sendRequest = sendRequest;
