"use strict";

exports.default = void 0;
var _index = require("./utils/index");
var _emitter = _interopRequireDefault(require("./core/emitter"));
var _emitter_registrator = _interopRequireDefault(require("./core/emitter_registrator"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const abs = Math.abs;
const HOLD_EVENT_NAME = 'dxhold';
const HOLD_TIMEOUT = 750;
const TOUCH_BOUNDARY = 5;
const HoldEmitter = _emitter.default.inherit({
  start: function (e) {
    this._startEventData = (0, _index.eventData)(e);
    this._startTimer(e);
  },
  _startTimer: function (e) {
    const holdTimeout = 'timeout' in this ? this.timeout : HOLD_TIMEOUT;
    this._holdTimer = setTimeout(function () {
      this._requestAccept(e);
      this._fireEvent(HOLD_EVENT_NAME, e, {
        target: e.target
      });
      this._forgetAccept();
    }.bind(this), holdTimeout);
  },
  move: function (e) {
    if (this._touchWasMoved(e)) {
      this._cancel(e);
    }
  },
  _touchWasMoved: function (e) {
    const delta = (0, _index.eventDelta)(this._startEventData, (0, _index.eventData)(e));
    return abs(delta.x) > TOUCH_BOUNDARY || abs(delta.y) > TOUCH_BOUNDARY;
  },
  end: function () {
    this._stopTimer();
  },
  _stopTimer: function () {
    clearTimeout(this._holdTimer);
  },
  cancel: function () {
    this._stopTimer();
  },
  dispose: function () {
    this._stopTimer();
  }
});

/**
  * @name UI Events.dxhold
  * @type eventType
  * @type_function_param1 event:event
  * @module events/hold
*/

(0, _emitter_registrator.default)({
  emitter: HoldEmitter,
  bubble: true,
  events: [HOLD_EVENT_NAME]
});
var _default = exports.default = {
  name: HOLD_EVENT_NAME
};
module.exports = exports.default;
module.exports.default = exports.default;