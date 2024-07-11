"use strict";

exports.start = exports.end = void 0;
var _events_engine = _interopRequireDefault(require("../events/core/events_engine"));
var _element_data = require("../core/element_data");
var _class = _interopRequireDefault(require("../core/class"));
var _devices = _interopRequireDefault(require("../core/devices"));
var _event_registrator = _interopRequireDefault(require("./core/event_registrator"));
var _index = require("./utils/index");
var _pointer = _interopRequireDefault(require("./pointer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const HOVERSTART_NAMESPACE = 'dxHoverStart';
const HOVERSTART = exports.start = 'dxhoverstart';
const POINTERENTER_NAMESPACED_EVENT_NAME = (0, _index.addNamespace)(_pointer.default.enter, HOVERSTART_NAMESPACE);
const HOVEREND_NAMESPACE = 'dxHoverEnd';
const HOVEREND = exports.end = 'dxhoverend';
const POINTERLEAVE_NAMESPACED_EVENT_NAME = (0, _index.addNamespace)(_pointer.default.leave, HOVEREND_NAMESPACE);
const Hover = _class.default.inherit({
  noBubble: true,
  ctor: function () {
    this._handlerArrayKeyPath = this._eventNamespace + '_HandlerStore';
  },
  setup: function (element) {
    (0, _element_data.data)(element, this._handlerArrayKeyPath, {});
  },
  add: function (element, handleObj) {
    const that = this;
    const handler = function (e) {
      that._handler(e);
    };
    _events_engine.default.on(element, this._originalEventName, handleObj.selector, handler);
    (0, _element_data.data)(element, this._handlerArrayKeyPath)[handleObj.guid] = handler;
  },
  _handler: function (e) {
    if ((0, _index.isTouchEvent)(e) || _devices.default.isSimulator()) {
      return;
    }
    (0, _index.fireEvent)({
      type: this._eventName,
      originalEvent: e,
      delegateTarget: e.delegateTarget
    });
  },
  remove: function (element, handleObj) {
    const handler = (0, _element_data.data)(element, this._handlerArrayKeyPath)[handleObj.guid];
    _events_engine.default.off(element, this._originalEventName, handleObj.selector, handler);
  },
  teardown: function (element) {
    (0, _element_data.removeData)(element, this._handlerArrayKeyPath);
  }
});
const HoverStart = Hover.inherit({
  ctor: function () {
    this._eventNamespace = HOVERSTART_NAMESPACE;
    this._eventName = HOVERSTART;
    this._originalEventName = POINTERENTER_NAMESPACED_EVENT_NAME;
    this.callBase();
  },
  _handler: function (e) {
    const pointers = e.pointers || [];
    if (!pointers.length) {
      this.callBase(e);
    }
  }
});
const HoverEnd = Hover.inherit({
  ctor: function () {
    this._eventNamespace = HOVEREND_NAMESPACE;
    this._eventName = HOVEREND;
    this._originalEventName = POINTERLEAVE_NAMESPACED_EVENT_NAME;
    this.callBase();
  }
});

/**
 * @name UI Events.dxhoverstart
 * @type eventType
 * @type_function_param1 event:event
 * @module events/hover
*/

/**
 * @name UI Events.dxhoverend
 * @type eventType
 * @type_function_param1 event:event
 * @module events/hover
*/

(0, _event_registrator.default)(HOVERSTART, new HoverStart());
(0, _event_registrator.default)(HOVEREND, new HoverEnd());