"use strict";

exports.name = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _event_registrator = _interopRequireDefault(require("./event_registrator"));
var _index = require("../utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const EVENT_NAME = exports.name = 'dxmousewheel';
const EVENT_NAMESPACE = 'dxWheel';
const NATIVE_EVENT_NAME = 'wheel';
const PIXEL_MODE = 0;
const DELTA_MUTLIPLIER = 30;
const wheel = {
  setup: function (element) {
    const $element = (0, _renderer.default)(element);
    _events_engine.default.on($element, (0, _index.addNamespace)(NATIVE_EVENT_NAME, EVENT_NAMESPACE), wheel._wheelHandler.bind(wheel));
  },
  teardown: function (element) {
    _events_engine.default.off(element, `.${EVENT_NAMESPACE}`);
  },
  _wheelHandler: function (e) {
    const {
      deltaMode,
      deltaY,
      deltaX,
      deltaZ
    } = e.originalEvent;
    (0, _index.fireEvent)({
      type: EVENT_NAME,
      originalEvent: e,
      delta: this._normalizeDelta(deltaY, deltaMode),
      deltaX,
      deltaY,
      deltaZ,
      deltaMode,
      pointerType: 'mouse'
    });
    e.stopPropagation();
  },
  _normalizeDelta(delta) {
    let deltaMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : PIXEL_MODE;
    if (deltaMode === PIXEL_MODE) {
      return -delta;
    } else {
      // Use multiplier to get rough delta value in px for the LINE or PAGE mode
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1392460
      return -DELTA_MUTLIPLIER * delta;
    }
  }
};
(0, _event_registrator.default)(EVENT_NAME, wheel);