"use strict";

exports.default = _default;
const touchPropsToHook = ['pageX', 'pageY', 'screenX', 'screenY', 'clientX', 'clientY'];
const touchPropHook = function (name, event) {
  if (event[name] && !event.touches || !event.touches) {
    return event[name];
  }
  const touches = event.touches.length ? event.touches : event.changedTouches;
  if (!touches.length) {
    return;
  }
  return touches[0][name];
};
function _default(callback) {
  touchPropsToHook.forEach(function (name) {
    callback(name, function (event) {
      return touchPropHook(name, event);
    });
  }, this);
}
module.exports = exports.default;
module.exports.default = exports.default;