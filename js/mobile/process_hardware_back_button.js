"use strict";

var hardwareBack = require("../core/utils/callbacks")();

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
