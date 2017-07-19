"use strict";

var jquery = require("jquery");

// Check availability in global environment
if(jquery) {
    require("./jquery/renderer");
    require("./jquery/easing");
}
