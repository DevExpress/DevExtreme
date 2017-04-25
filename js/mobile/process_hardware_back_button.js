"use strict";

var $ = require("jquery"),
    hardwareBack = $.Callbacks();

/**
 * @name processHardwareBackButton
 * @publicName processHardwareBackButton()
 * @module mobile/process_hardware_back_button
 * @export default
 */
module.exports = function() {
    hardwareBack.fire();
};
module.exports.processCallback = hardwareBack;
