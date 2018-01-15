"use strict";

var domAdapter = require("core/dom_adapter");

for(var method in domAdapter) {
    delete domAdapter[method];
}

domAdapter.getWindow = function() {
    return null;
};
