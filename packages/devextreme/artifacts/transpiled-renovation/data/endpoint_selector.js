"use strict";

exports.default = void 0;
var _errors = _interopRequireDefault(require("../core/errors"));
var _window = require("../core/utils/window");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* global Debug*/

const window = (0, _window.getWindow)();
let IS_WINJS_ORIGIN;
let IS_LOCAL_ORIGIN;
function isLocalHostName(url) {
  return /^(localhost$|127\.)/i.test(url); // TODO more precise check for 127.x.x.x IP
}

/**
* @name EndpointSelector.ctor
* @publicName ctor(options)
* @param1 options:Object
* @hidden
*/
const EndpointSelector = function (config) {
  this.config = config;
  IS_WINJS_ORIGIN = window.location.protocol === 'ms-appx:';
  IS_LOCAL_ORIGIN = isLocalHostName(window.location.hostname);
};
EndpointSelector.prototype = {
  urlFor: function (key) {
    const bag = this.config[key];
    if (!bag) {
      throw _errors.default.Error('E0006');
    }
    if (bag.production) {
      if (IS_WINJS_ORIGIN && !Debug.debuggerEnabled || !IS_WINJS_ORIGIN && !IS_LOCAL_ORIGIN) {
        return bag.production;
      }
    }
    return bag.local;
  }
};
var _default = exports.default = EndpointSelector;
module.exports = exports.default;
module.exports.default = exports.default;