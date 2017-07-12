"use strict";

var jquery = require("jquery");
var useJQueryRenderer = window.useJQueryRenderer !== false;

// Check availability in global environment
if(jquery && useJQueryRenderer) {
    require("./jquery/renderer");
}
