"use strict";

var $ = require("../renderer");

var sendRequest = function(options) {
    return $.ajax.call($, options);
};

exports.sendRequest = sendRequest;
