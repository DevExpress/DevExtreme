"use strict";

var window = require("../dom_adapter").getWindow();

var navigator = {
    userAgent: ""
};

module.exports = window.navigator ? window.navigator : navigator;
