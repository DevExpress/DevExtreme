"use strict";

var jQuery = require("jquery");

// Check availability in global environment
if(jQuery) {
    require("./jquery/renderer");
    require("./jquery/events");
    require("./jquery/easing");
    require("./jquery/element_data");
    require("./jquery/component_registrator");
}
