'use strict';

var jQuery = require("jquery");
var deferredUtils = require("../../core/utils/deferred");
var useJQueryRenderer = require("../../core/config")().useJQueryRenderer;

if(useJQueryRenderer) {
    deferredUtils.setStrategy(jQuery.Deferred);
}
