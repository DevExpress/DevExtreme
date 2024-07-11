"use strict";

exports.default = void 0;
var _iterator = require("../../core/utils/iterator");
var _ready_callbacks = _interopRequireDefault(require("../../core/utils/ready_callbacks"));
var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const addEventsListener = function (events, handler) {
  _ready_callbacks.default.add(function () {
    events.split(' ').forEach(function (event) {
      _dom_adapter.default.listen(_dom_adapter.default.getDocument(), event, handler, true);
    });
  });
};
const Observer = function (eventMap, pointerEquals, onPointerAdding) {
  onPointerAdding = onPointerAdding || function () {};
  let pointers = [];
  const getPointerIndex = function (e) {
    let index = -1;
    (0, _iterator.each)(pointers, function (i, pointer) {
      if (!pointerEquals(e, pointer)) {
        return true;
      }
      index = i;
      return false;
    });
    return index;
  };
  const addPointer = function (e) {
    if (getPointerIndex(e) === -1) {
      onPointerAdding(e);
      pointers.push(e);
    }
  };
  const removePointer = function (e) {
    const index = getPointerIndex(e);
    if (index > -1) {
      pointers.splice(index, 1);
    }
  };
  const updatePointer = function (e) {
    pointers[getPointerIndex(e)] = e;
  };
  addEventsListener(eventMap['dxpointerdown'], addPointer);
  addEventsListener(eventMap['dxpointermove'], updatePointer);
  addEventsListener(eventMap['dxpointerup'], removePointer);
  addEventsListener(eventMap['dxpointercancel'], removePointer);
  this.pointers = function () {
    return pointers;
  };
  this.reset = function () {
    pointers = [];
  };
};
var _default = exports.default = Observer;
module.exports = exports.default;
module.exports.default = exports.default;