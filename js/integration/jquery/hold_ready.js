"use strict";

var jQuery = require("jquery"),
    themes_callback = require("../../ui/themes_callback"),
    ready = require("../../core/dom_adapter").ready;

if(jQuery && !themes_callback.fired()) {
    var holdReady = jQuery.holdReady || jQuery.fn.holdReady;

    holdReady(true);

    themes_callback.add(function() {
        ready(function() {
            holdReady(false);
        });
    });
}
