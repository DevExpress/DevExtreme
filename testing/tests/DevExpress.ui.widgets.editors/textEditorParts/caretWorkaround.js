const browser = require('core/utils/browser');
const devices = require('core/devices');
const caret = require('ui/text_box/utils.caret');

module.exports = function($input) {
    // NOTE: We decided to return to this problem when next Edge is released
    // Edge sets the caret to the end of the mask editor when iframe is used and focus is triggered by the focus() method
    const isEdge = browser.msie && browser.version >= 15 && browser.version < 19;

    const isDesktopChrome = ('chrome' in window) && ('app' in window.chrome) && ('isInstalled' in window.chrome.app);
    const isChromeEmulatedIOS = isDesktopChrome && browser.safari;
    const isChromeEmulatedWinPhone = isDesktopChrome && browser.msie && devices.real().deviceType === 'phone';

    if(isEdge || isChromeEmulatedIOS || isChromeEmulatedWinPhone) {
        $input.focus();
        caret($input, 0);
    }
};
