"use strict";

var jQuery = require("jquery");
var rendererBase = require("../../core/renderer_base");
var useJQuery = require("../../core/config")().useJQuery;

if(jQuery && useJQuery) {
    rendererBase.set(jQuery);
}
