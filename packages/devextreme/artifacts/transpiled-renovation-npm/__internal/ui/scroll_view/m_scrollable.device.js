"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deviceDependentOptions = void 0;
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _support = require("../../../core/utils/support");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const deviceDependentOptions = function () {
  return [{
    device() {
      return !_support.nativeScrolling;
    },
    options: {
      useNative: false
    }
  }, {
    device(device) {
      return !_devices.default.isSimulator() && _devices.default.real().deviceType === 'desktop' && device.platform === 'generic';
    },
    options: {
      bounceEnabled: false,
      scrollByThumb: true,
      scrollByContent: _support.touch,
      showScrollbar: 'onHover'
    }
  }];
};
exports.deviceDependentOptions = deviceDependentOptions;