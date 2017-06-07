"use strict";

var ajax = require("core/utils/ajax"),
    mockOptions,
    $;

ajax.sendRequest = function(request) {
    var deferred = $.Deferred(),
        response = [];

    response.push(request);

    if(typeof mockOptions.callback === "function") {
        mockOptions.callback.call(response, response);
    }

    return deferred.resolveWith(response, [response, "success"]).promise();
};

module.exports = function(options) {
    mockOptions = options;
};
