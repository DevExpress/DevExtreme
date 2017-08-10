"use strict";

var jQuery = require("jquery"),
    holdReady = jQuery.holdReady || jQuery.fn.holdReady,
    callback = require("../../ui/themes_callback");

holdReady(true);

if(callback.fired()) {
    holdReady(false);
} else {
    callback.add(function() {
        holdReady(false);
    });
}





