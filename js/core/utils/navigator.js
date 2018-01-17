"use strict";

var window = require("../dom_adapter").getWindow();

function getNavigator() {
    return window && window.navigator ? window.navigator : {};
}

exports.getNavigator = getNavigator();
