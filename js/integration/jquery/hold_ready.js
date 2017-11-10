"use strict";

var jQuery = require("jquery"),
    holdReady = jQuery.holdReady || jQuery.fn.holdReady,
    themes_callback = require("../../ui/themes_callback"),
    ready = require("../../core/utils/ready");

if(!themes_callback.fired()) {
    holdReady(true);

    themes_callback.add(function() {
        ready(function() {
            holdReady(false);
        });
    });
}
