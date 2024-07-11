"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.name = exports.dblClick = void 0;
var _class = _interopRequireDefault(require("../../core/class"));
var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));
var _dom = require("../../core/utils/dom");
var _click = require("../../events/click");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _index = require("../../events/utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DBLCLICK_EVENT_NAME = exports.name = 'dxdblclick';
const DBLCLICK_NAMESPACE = 'dxDblClick';
const NAMESPACED_CLICK_EVENT = (0, _index.addNamespace)(_click.name, DBLCLICK_NAMESPACE);
const DBLCLICK_TIMEOUT = 300;
const DblClick = _class.default.inherit({
  ctor() {
    this._handlerCount = 0;
    this._forgetLastClick();
  },
  _forgetLastClick() {
    this._firstClickTarget = null;
    this._lastClickTimeStamp = -DBLCLICK_TIMEOUT;
  },
  add() {
    if (this._handlerCount <= 0) {
      _events_engine.default.on(_dom_adapter.default.getDocument(), NAMESPACED_CLICK_EVENT, this._clickHandler.bind(this));
    }
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    this._handlerCount += 1;
  },
  _clickHandler(e) {
    const timeStamp = e.timeStamp || Date.now();
    const timeBetweenClicks = timeStamp - this._lastClickTimeStamp;
    // NOTE: jQuery sets `timeStamp = Date.now()` for the triggered events, but
    // in the real event timeStamp is the number of milliseconds elapsed from the
    // beginning of the current document's lifetime till the event was created
    // (https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp).
    const isSimulated = timeBetweenClicks < 0;
    const isDouble = !isSimulated && timeBetweenClicks < DBLCLICK_TIMEOUT;
    if (isDouble) {
      (0, _index.fireEvent)({
        type: DBLCLICK_EVENT_NAME,
        target: (0, _dom.closestCommonParent)(this._firstClickTarget, e.target),
        originalEvent: e
      });
      this._forgetLastClick();
    } else {
      this._firstClickTarget = e.target;
      this._lastClickTimeStamp = timeStamp;
      clearTimeout(this._lastClickClearTimeout);
      this._lastClickClearTimeout = setTimeout(() => {
        this._forgetLastClick();
      }, DBLCLICK_TIMEOUT * 2);
    }
  },
  remove() {
    this._handlerCount -= 1;
    if (this._handlerCount <= 0) {
      this._forgetLastClick();
      _events_engine.default.off(_dom_adapter.default.getDocument(), NAMESPACED_CLICK_EVENT, undefined);
      clearTimeout(this._lastClickClearTimeout);
      this._handlerCount = 0;
    }
  }
});
const dblClick = exports.dblClick = new DblClick();