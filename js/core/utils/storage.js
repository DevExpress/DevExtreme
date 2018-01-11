"use strict";

var window = require("../../core/dom_adapter").getWindow();

var getSessionStorage = function() {
    var sessionStorage;

    try {
        sessionStorage = window.sessionStorage;
    } catch(e) { }

    return sessionStorage;
};

exports.sessionStorage = getSessionStorage;
