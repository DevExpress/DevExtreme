"use strict";

exports.default = void 0;
var _extend = require("../../core/utils/extend");
var _base = _interopRequireDefault(require("./base"));
var _observer = _interopRequireDefault(require("./observer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const eventMap = {
  'dxpointerdown': 'mousedown',
  'dxpointermove': 'mousemove',
  'dxpointerup': 'mouseup',
  'dxpointercancel': '',
  'dxpointerover': 'mouseover',
  'dxpointerout': 'mouseout',
  'dxpointerenter': 'mouseenter',
  'dxpointerleave': 'mouseleave'
};
const normalizeMouseEvent = function (e) {
  e.pointerId = 1;
  return {
    pointers: observer.pointers(),
    pointerId: 1
  };
};
let observer;
let activated = false;
const activateStrategy = function () {
  if (activated) {
    return;
  }
  observer = new _observer.default(eventMap, function () {
    return true;
  });
  activated = true;
};
const MouseStrategy = _base.default.inherit({
  ctor: function () {
    this.callBase.apply(this, arguments);
    activateStrategy();
  },
  _fireEvent: function (args) {
    return this.callBase((0, _extend.extend)(normalizeMouseEvent(args.originalEvent), args));
  }
});
MouseStrategy.map = eventMap;
MouseStrategy.normalize = normalizeMouseEvent;
MouseStrategy.activate = activateStrategy;
MouseStrategy.resetObserver = function () {
  observer.reset();
};
var _default = exports.default = MouseStrategy;
module.exports = exports.default;
module.exports.default = exports.default;