"use strict";

var jQuery = require("jquery"),
    holdReady = jQuery.holdReady || jQuery.fn.holdReady,
    themeLoadedCallback = require("../../ui/themes_callbacks");

if(!themeLoadedCallback.fired()) {
    holdReady(true);

    var themeLoadedHandler = function() {
        holdReady(false);
        themeLoadedCallback.remove(themeLoadedHandler);
    };

    themeLoadedCallback.add(themeLoadedHandler);
}
