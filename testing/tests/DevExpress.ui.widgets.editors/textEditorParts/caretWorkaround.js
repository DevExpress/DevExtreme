"use strict";

var browser = require("core/utils/browser"),
    caret = require("ui/text_box/utils.caret");

module.exports = function($input) {
    // NOTE: We decided to return to this problem when Edge 16 is released
    // Edge 15 sets the caret to the end of the mask editor when iframe is used and focus is triggered by the focus() method
    var isEdge15 = browser.msie && browser.version >= 15 && browser.version < 16;

    // Chrome devtools device emulation
    // Same problem for iOS user-agents
    var isEmulatedIOS = "chrome" in window && browser.safari;

    if(isEdge15 || isEmulatedIOS) {
        $input.focus();
        caret($input, 0);
    }
};
