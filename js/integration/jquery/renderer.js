"use strict";

var $ = require("jquery");
var rendererBase = require("../../core/renderer_base");
var useJQuery = require("../../core/config")().useJQuery;

if($ && useJQuery) {
    rendererBase.set($);
}
