"use strict";

exports.lock = exports.inactive = exports.active = void 0;
var _class = _interopRequireDefault(require("../../core/class"));
var _common = require("../../core/utils/common");
var _dom = require("../../core/utils/dom");
var _devices = _interopRequireDefault(require("../../core/devices"));
var _index = require("../utils/index");
var _pointer = _interopRequireDefault(require("../pointer"));
var _emitter = _interopRequireDefault(require("./emitter"));
var _emitter_registrator = _interopRequireDefault(require("./emitter_registrator"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ACTIVE_EVENT_NAME = exports.active = 'dxactive';
const INACTIVE_EVENT_NAME = exports.inactive = 'dxinactive';
const ACTIVE_TIMEOUT = 30;
const INACTIVE_TIMEOUT = 400;
const FeedbackEvent = _class.default.inherit({
  ctor: function (timeout, fire) {
    this._timeout = timeout;
    this._fire = fire;
  },
  start: function () {
    const that = this;
    this._schedule(function () {
      that.force();
    });
  },
  _schedule: function (fn) {
    this.stop();
    this._timer = setTimeout(fn, this._timeout);
  },
  stop: function () {
    clearTimeout(this._timer);
  },
  force: function () {
    if (this._fired) {
      return;
    }
    this.stop();
    this._fire();
    this._fired = true;
  },
  fired: function () {
    return this._fired;
  }
});
let activeFeedback;
const FeedbackEmitter = _emitter.default.inherit({
  ctor: function () {
    this.callBase.apply(this, arguments);
    this._active = new FeedbackEvent(0, _common.noop);
    this._inactive = new FeedbackEvent(0, _common.noop);
  },
  configure: function (data, eventName) {
    switch (eventName) {
      case ACTIVE_EVENT_NAME:
        data.activeTimeout = data.timeout;
        break;
      case INACTIVE_EVENT_NAME:
        data.inactiveTimeout = data.timeout;
        break;
    }
    this.callBase(data);
  },
  start: function (e) {
    if (activeFeedback) {
      const activeChildExists = (0, _dom.contains)(this.getElement().get(0), activeFeedback.getElement().get(0));
      const childJustActivated = !activeFeedback._active.fired();
      if (activeChildExists && childJustActivated) {
        this._cancel();
        return;
      }
      activeFeedback._inactive.force();
    }
    activeFeedback = this;
    this._initEvents(e);
    this._active.start();
  },
  _initEvents: function (e) {
    const that = this;
    const eventTarget = this._getEmitterTarget(e);
    const mouseEvent = (0, _index.isMouseEvent)(e);
    const isSimulator = _devices.default.isSimulator();
    const deferFeedback = isSimulator || !mouseEvent;
    const activeTimeout = (0, _common.ensureDefined)(this.activeTimeout, ACTIVE_TIMEOUT);
    const inactiveTimeout = (0, _common.ensureDefined)(this.inactiveTimeout, INACTIVE_TIMEOUT);
    this._active = new FeedbackEvent(deferFeedback ? activeTimeout : 0, function () {
      that._fireEvent(ACTIVE_EVENT_NAME, e, {
        target: eventTarget
      });
    });
    this._inactive = new FeedbackEvent(deferFeedback ? inactiveTimeout : 0, function () {
      that._fireEvent(INACTIVE_EVENT_NAME, e, {
        target: eventTarget
      });
      activeFeedback = null;
    });
  },
  cancel: function (e) {
    this.end(e);
  },
  end: function (e) {
    const skipTimers = e.type !== _pointer.default.up;
    if (skipTimers) {
      this._active.stop();
    } else {
      this._active.force();
    }
    this._inactive.start();
    if (skipTimers) {
      this._inactive.force();
    }
  },
  dispose: function () {
    this._active.stop();
    this._inactive.stop();
    if (activeFeedback === this) {
      activeFeedback = null;
    }
    this.callBase();
  },
  lockInactive: function () {
    this._active.force();
    this._inactive.stop();
    activeFeedback = null;
    this._cancel();
    return this._inactive.force.bind(this._inactive);
  }
});
FeedbackEmitter.lock = function (deferred) {
  const lockInactive = activeFeedback ? activeFeedback.lockInactive() : _common.noop;
  deferred.done(lockInactive);
};
(0, _emitter_registrator.default)({
  emitter: FeedbackEmitter,
  events: [ACTIVE_EVENT_NAME, INACTIVE_EVENT_NAME]
});
const lock = exports.lock = FeedbackEmitter.lock;