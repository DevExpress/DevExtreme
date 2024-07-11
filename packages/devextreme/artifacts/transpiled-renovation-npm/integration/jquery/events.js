"use strict";

var _jquery = _interopRequireDefault(require("jquery"));
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _use_jquery = _interopRequireDefault(require("./use_jquery"));
var _event_registrator_callbacks = _interopRequireDefault(require("../../events/core/event_registrator_callbacks"));
var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line no-restricted-imports

const useJQuery = (0, _use_jquery.default)();
if (useJQuery) {
  _event_registrator_callbacks.default.add(function (name, eventObject) {
    _jquery.default.event.special[name] = eventObject;
  });
  if (_events_engine.default.passiveEventHandlersSupported()) {
    _events_engine.default.forcePassiveFalseEventNames.forEach(function (eventName) {
      _jquery.default.event.special[eventName] = {
        setup: function (data, namespaces, handler) {
          _dom_adapter.default.listen(this, eventName, handler, {
            passive: false
          });
        }
      };
    });
  }
  _events_engine.default.set({
    on: function (element) {
      (0, _jquery.default)(element).on.apply((0, _jquery.default)(element), Array.prototype.slice.call(arguments, 1));
    },
    one: function (element) {
      (0, _jquery.default)(element).one.apply((0, _jquery.default)(element), Array.prototype.slice.call(arguments, 1));
    },
    off: function (element) {
      (0, _jquery.default)(element).off.apply((0, _jquery.default)(element), Array.prototype.slice.call(arguments, 1));
    },
    trigger: function (element) {
      (0, _jquery.default)(element).trigger.apply((0, _jquery.default)(element), Array.prototype.slice.call(arguments, 1));
    },
    triggerHandler: function (element) {
      (0, _jquery.default)(element).triggerHandler.apply((0, _jquery.default)(element), Array.prototype.slice.call(arguments, 1));
    },
    Event: _jquery.default.Event
  });
}