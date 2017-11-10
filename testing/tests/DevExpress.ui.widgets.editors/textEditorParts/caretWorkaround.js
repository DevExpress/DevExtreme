"use strict";

var browser = require("core/utils/browser"),
    devices = require("core/devices"),
    caret = require("ui/text_box/utils.caret");

module.exports = function($input) {
    // NOTE: We decided to return to this problem when Edge 17 is released
    // Edge 15 or 16 sets the caret to the end of the mask editor when iframe is used and focus is triggered by the focus() method
    var isEdge15_16 = browser.msie && browser.version >= 15 && browser.version < 17;

    var isDesktopChrome = ("chrome" in window) && ("app" in window.chrome) && ("isInstalled" in window.chrome.app),
        isChromeEmulatedIOS = isDesktopChrome && browser.safari,
        isChromeEmulatedWinPhone = isDesktopChrome && browser.msie && devices.real().deviceType === "phone";

    if(isEdge15_16 || isChromeEmulatedIOS || isChromeEmulatedWinPhone) {
        $input.focus();
        caret($input, 0);
    }
};
