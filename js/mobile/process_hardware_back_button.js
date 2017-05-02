"use strict";

var $ = require("../core/renderer"),
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
