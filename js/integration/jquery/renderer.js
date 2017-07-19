"use strict";

var $ = require("jquery");
var rendererBase = require("../../core/renderer_base");
var useJQueryRenderer = require("../../core/config")().useJQueryRenderer;

if(useJQueryRenderer) {
    rendererBase.set($);
}
