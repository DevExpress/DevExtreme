"use strict";

var browser = require("core/utils/browser"),
    caret = require("ui/text_box/utils.caret");

module.exports = function($input) {
    // NOTE: We desided to return to this problem when the Edge will update to the 16 version
    // Edge 15 sets caret to the end of the mask editor when iframe is used and focus was triggered by focus() method
    var isEdge15 = browser.msie && browser.version >= 15 && browser.version < 16;

    // Chrome devtools device emulation
    // Same problem for iOS user-agents
    var isEmulatedIOS = "chrome" in window && browser.safari;

    if(isEdge15 || isEmulatedIOS) {
        $input.focus();
        caret($input, 0);
    }
};
