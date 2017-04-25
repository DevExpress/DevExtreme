"use strict";

var angular = require("angular");

// Check availability in global environment
if(angular) {
    require("./angular/component_registrator");
    require("./angular/event_registrator");
    require("./angular/components");
    require("./angular/action_executors");
}
