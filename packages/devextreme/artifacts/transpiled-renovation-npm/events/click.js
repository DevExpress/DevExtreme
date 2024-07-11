"use strict";

exports.name = void 0;
var _renderer = _interopRequireDefault(require("../core/renderer"));
var _events_engine = _interopRequireDefault(require("../events/core/events_engine"));
var _devices = _interopRequireDefault(require("../core/devices"));
var _dom_adapter = _interopRequireDefault(require("../core/dom_adapter"));
var _dom = require("../core/utils/dom");
var _frame = require("../animation/frame");
var _index = require("./utils/index");
var _event_nodes_disposing = require("./utils/event_nodes_disposing");
var _pointer = _interopRequireDefault(require("./pointer"));
var _emitter = _interopRequireDefault(require("./core/emitter"));
var _emitter_registrator = _interopRequireDefault(require("./core/emitter_registrator"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const CLICK_EVENT_NAME = exports.name = 'dxclick';
const misc = {
  requestAnimationFrame: _frame.requestAnimationFrame,
  cancelAnimationFrame: _frame.cancelAnimationFrame
};
let prevented = null;
let lastFiredEvent = null;
const onNodeRemove = () => {
  lastFiredEvent = null;
};
const clickHandler = function (e) {
  const originalEvent = e.originalEvent;
  const eventAlreadyFired = lastFiredEvent === originalEvent || originalEvent && originalEvent.DXCLICK_FIRED;
  const leftButton = !e.which || e.which === 1;
  if (leftButton && !prevented && !eventAlreadyFired) {
    if (originalEvent) {
      originalEvent.DXCLICK_FIRED = true;
    }
    (0, _event_nodes_disposing.unsubscribeNodesDisposing)(lastFiredEvent, onNodeRemove);
    lastFiredEvent = originalEvent;
    (0, _event_nodes_disposing.subscribeNodesDisposing)(lastFiredEvent, onNodeRemove);
    (0, _index.fireEvent)({
      type: CLICK_EVENT_NAME,
      originalEvent: e
    });
  }
};
const ClickEmitter = _emitter.default.inherit({
  ctor: function (element) {
    this.callBase(element);
    _events_engine.default.on(this.getElement(), 'click', clickHandler);
  },
  start: function (e) {
    prevented = null;
  },
  cancel: function () {
    prevented = true;
  },
  dispose: function () {
    _events_engine.default.off(this.getElement(), 'click', clickHandler);
  }
});

// NOTE: fixes native click blur on slow devices
(function () {
  const desktopDevice = _devices.default.real().generic;
  if (!desktopDevice) {
    let startTarget = null;
    let blurPrevented = false;
    const isInput = function (element) {
      return (0, _renderer.default)(element).is('input, textarea, select, button ,:focus, :focus *');
    };
    const pointerDownHandler = function (e) {
      startTarget = e.target;
      blurPrevented = e.isDefaultPrevented();
    };
    const getTarget = function (e) {
      var _originalEvent$target;
      const originalEvent = e.originalEvent;
      if (originalEvent !== null && originalEvent !== void 0 && (_originalEvent$target = originalEvent.target) !== null && _originalEvent$target !== void 0 && _originalEvent$target.shadowRoot) {
        var _originalEvent$compos;
        const path = originalEvent.path ?? ((_originalEvent$compos = originalEvent.composedPath) === null || _originalEvent$compos === void 0 ? void 0 : _originalEvent$compos.call(originalEvent));
        return (0, _renderer.default)(path[0]);
      }
      return (0, _renderer.default)(e.target);
    };
    const clickHandler = function (e) {
      const $target = getTarget(e);
      if (!blurPrevented && startTarget && !$target.is(startTarget) && !(0, _renderer.default)(startTarget).is('label') && isInput($target)) {
        (0, _dom.resetActiveElement)();
      }
      startTarget = null;
      blurPrevented = false;
    };
    const NATIVE_CLICK_FIXER_NAMESPACE = 'NATIVE_CLICK_FIXER';
    const document = _dom_adapter.default.getDocument();
    _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)(_pointer.default.down, NATIVE_CLICK_FIXER_NAMESPACE), pointerDownHandler);
    _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)('click', NATIVE_CLICK_FIXER_NAMESPACE), clickHandler);
  }
})();

/**
  * @name UI Events.dxclick
  * @type eventType
  * @type_function_param1 event:event
  * @module events/click
*/
(0, _emitter_registrator.default)({
  emitter: ClickEmitter,
  bubble: true,
  events: [CLICK_EVENT_NAME]
});