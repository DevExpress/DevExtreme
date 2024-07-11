"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _deferred = require("../../../core/utils/deferred");
var _extend = require("../../../core/utils/extend");
var _emitter = require("../../../events/core/emitter.feedback");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _hold = _interopRequireDefault(require("../../../events/hold"));
var _pointer = _interopRequireDefault(require("../../../events/pointer"));
var _index = require("../../../events/utils/index");
var _ui = _interopRequireDefault(require("../../../ui/widget/ui.widget"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const SPIN_CLASS = 'dx-numberbox-spin';
const SPIN_BUTTON_CLASS = 'dx-numberbox-spin-button';
const SPIN_HOLD_DELAY = 100;
const NUMBER_BOX = 'dxNumberBox';
const POINTERUP_EVENT_NAME = (0, _index.addNamespace)(_pointer.default.up, NUMBER_BOX);
const POINTERCANCEL_EVENT_NAME = (0, _index.addNamespace)(_pointer.default.cancel, NUMBER_BOX);
// @ts-expect-error
const SpinButton = _ui.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      direction: 'up',
      onChange: null,
      activeStateEnabled: true,
      hoverStateEnabled: true
    });
  },
  _initMarkup() {
    this.callBase();
    const direction = `${SPIN_CLASS}-${this.option('direction')}`;
    this.$element().addClass(SPIN_BUTTON_CLASS).addClass(direction);
    this._spinIcon = (0, _renderer.default)('<div>').addClass(`${direction}-icon`).appendTo(this.$element());
  },
  _render() {
    this.callBase();
    const eventName = (0, _index.addNamespace)(_pointer.default.down, this.NAME);
    const $element = this.$element();
    _events_engine.default.off($element, eventName);
    _events_engine.default.on($element, eventName, this._spinDownHandler.bind(this));
    this._spinChangeHandler = this._createActionByOption('onChange');
  },
  _spinDownHandler(e) {
    e.preventDefault();
    this._clearTimer();
    _events_engine.default.on(this.$element(), _hold.default.name, () => {
      this._feedBackDeferred = (0, _deferred.Deferred)();
      (0, _emitter.lock)(this._feedBackDeferred);
      this._spinChangeHandler({
        event: e
      });
      this._holdTimer = setInterval(this._spinChangeHandler, SPIN_HOLD_DELAY, {
        event: e
      });
    });
    const document = _dom_adapter.default.getDocument();
    _events_engine.default.on(document, POINTERUP_EVENT_NAME, this._clearTimer.bind(this));
    _events_engine.default.on(document, POINTERCANCEL_EVENT_NAME, this._clearTimer.bind(this));
    this._spinChangeHandler({
      event: e
    });
  },
  _dispose() {
    this._clearTimer();
    this.callBase();
  },
  _clearTimer() {
    _events_engine.default.off(this.$element(), _hold.default.name);
    const document = _dom_adapter.default.getDocument();
    _events_engine.default.off(document, POINTERUP_EVENT_NAME);
    _events_engine.default.off(document, POINTERCANCEL_EVENT_NAME);
    if (this._feedBackDeferred) {
      this._feedBackDeferred.resolve();
    }
    if (this._holdTimer) {
      clearInterval(this._holdTimer);
    }
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'onChange':
      case 'direction':
        this._invalidate();
        break;
      default:
        this.callBase(args);
    }
  }
});
var _default = exports.default = SpinButton;