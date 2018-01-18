"use strict";

var window = require("../dom_adapter").getWindow();

var navigator = {
    userAgent: ""
};

function getNavigator() {
    return window.navigator ? window.navigator : navigator;
}

exports.getNavigator = getNavigator();
