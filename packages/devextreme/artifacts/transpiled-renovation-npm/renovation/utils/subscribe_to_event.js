"use strict";

exports.subscribeToDxInactiveEvent = exports.subscribeToDxHoverStartEvent = exports.subscribeToDxHoverEndEvent = exports.subscribeToDxFocusOutEvent = exports.subscribeToDxFocusInEvent = exports.subscribeToDxActiveEvent = exports.subscribeToDXScrollStopEvent = exports.subscribeToDXScrollStartEvent = exports.subscribeToDXScrollMoveEvent = exports.subscribeToDXScrollEndEvent = exports.subscribeToDXScrollCancelEvent = exports.subscribeToDXPointerUpEvent = exports.subscribeToDXPointerMoveEvent = exports.subscribeToDXPointerDownEvent = exports.subscribeToClickEvent = void 0;
exports.subscribeToEvent = subscribeToEvent;
exports.subscribeToScrollInitEvent = exports.subscribeToScrollEvent = exports.subscribeToMouseLeaveEvent = exports.subscribeToMouseEnterEvent = exports.subscribeToKeyDownEvent = void 0;
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var clickEvent = _interopRequireWildcard(require("../../events/click"));
var _index = require("../../events/utils/index");
var _emitterGesture = _interopRequireDefault(require("../../events/gesture/emitter.gesture.scroll"));
var _pointer = _interopRequireDefault(require("../../events/pointer"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function subscribeToEvent(eventName) {
  return (element, handler, eventData, namespace) => {
    const event = namespace ? (0, _index.addNamespace)(eventName, namespace) : eventName;
    if (handler) {
      _events_engine.default.on(element, event, eventData, handler);
      return () => {
        _events_engine.default.off(element, event, handler);
      };
    }
    return undefined;
  };
}
const subscribeToClickEvent = exports.subscribeToClickEvent = subscribeToEvent(clickEvent.name);
const subscribeToScrollEvent = exports.subscribeToScrollEvent = subscribeToEvent(_emitterGesture.default.scroll);
const subscribeToScrollInitEvent = exports.subscribeToScrollInitEvent = subscribeToEvent(_emitterGesture.default.init);
const subscribeToDXScrollStartEvent = exports.subscribeToDXScrollStartEvent = subscribeToEvent(_emitterGesture.default.start);
const subscribeToDXScrollMoveEvent = exports.subscribeToDXScrollMoveEvent = subscribeToEvent(_emitterGesture.default.move);
const subscribeToDXScrollEndEvent = exports.subscribeToDXScrollEndEvent = subscribeToEvent(_emitterGesture.default.end);
const subscribeToDXScrollStopEvent = exports.subscribeToDXScrollStopEvent = subscribeToEvent(_emitterGesture.default.stop);
const subscribeToDXScrollCancelEvent = exports.subscribeToDXScrollCancelEvent = subscribeToEvent(_emitterGesture.default.cancel);
const subscribeToDXPointerDownEvent = exports.subscribeToDXPointerDownEvent = subscribeToEvent(_pointer.default.down);
const subscribeToDXPointerUpEvent = exports.subscribeToDXPointerUpEvent = subscribeToEvent(_pointer.default.up);
const subscribeToDXPointerMoveEvent = exports.subscribeToDXPointerMoveEvent = subscribeToEvent(_pointer.default.move);
const subscribeToMouseEnterEvent = exports.subscribeToMouseEnterEvent = subscribeToEvent('mouseenter');
const subscribeToMouseLeaveEvent = exports.subscribeToMouseLeaveEvent = subscribeToEvent('mouseleave');
const subscribeToKeyDownEvent = exports.subscribeToKeyDownEvent = subscribeToEvent('keydown');
const subscribeToDxActiveEvent = exports.subscribeToDxActiveEvent = subscribeToEvent('dxactive');
const subscribeToDxInactiveEvent = exports.subscribeToDxInactiveEvent = subscribeToEvent('dxinactive');
const subscribeToDxHoverStartEvent = exports.subscribeToDxHoverStartEvent = subscribeToEvent('dxhoverstart');
const subscribeToDxHoverEndEvent = exports.subscribeToDxHoverEndEvent = subscribeToEvent('dxhoverend');
const subscribeToDxFocusInEvent = exports.subscribeToDxFocusInEvent = subscribeToEvent('focusin');
const subscribeToDxFocusOutEvent = exports.subscribeToDxFocusOutEvent = subscribeToEvent('focusout');