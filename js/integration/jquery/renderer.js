"use strict";

var $ = require("jquery");
var rendererBase = require("../../core/renderer_base");
var useJQueryRenderer = window.useJQueryRenderer !== false;

if(useJQueryRenderer) {
    rendererBase.set($);
}
