"use strict";

var jQuery = require("jquery");
var compareVersions = require("../core/utils/version").compare;
var errors = require("../core/utils/error");

// Check availability in global environment
if(jQuery) {
    if(compareVersions(jQuery.fn.jquery, [1, 10]) < 0) {
        throw errors.Error("E0012");
    }

    require("./jquery/renderer");
    require("./jquery/events");
    require("./jquery/easing");
    require("./jquery/element_data");
    require("./jquery/component_registrator");
}
