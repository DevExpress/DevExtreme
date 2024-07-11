"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fx = _interopRequireDefault(require("../../animation/fx"));
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../core/devices"));
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _deferred = require("../../core/utils/deferred");
var _extend = require("../../core/utils/extend");
var _position = require("../../core/utils/position");
var _size = require("../../core/utils/size");
var _click = require("../../events/click");
var _emitter = require("../../events/core/emitter.feedback");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _swipeable = _interopRequireDefault(require("../../events/gesture/swipeable"));
var _index = require("../../events/utils/index");
var _message = _interopRequireDefault(require("../../localization/message"));
var _editor = _interopRequireDefault(require("../../ui/editor/editor"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const SWITCH_CLASS = 'dx-switch';
const SWITCH_WRAPPER_CLASS = `${SWITCH_CLASS}-wrapper`;
const SWITCH_CONTAINER_CLASS = `${SWITCH_CLASS}-container`;
const SWITCH_INNER_CLASS = `${SWITCH_CLASS}-inner`;
const SWITCH_HANDLE_CLASS = `${SWITCH_CLASS}-handle`;
const SWITCH_ON_VALUE_CLASS = `${SWITCH_CLASS}-on-value`;
const SWITCH_ON_CLASS = `${SWITCH_CLASS}-on`;
const SWITCH_OFF_CLASS = `${SWITCH_CLASS}-off`;
const SWITCH_ANIMATION_DURATION = 100;
// @ts-expect-error
const Switch = _editor.default.inherit({
  _supportedKeys() {
    const isRTL = this.option('rtlEnabled');
    const click = function (e) {
      e.preventDefault();
      this._clickAction({
        event: e
      });
    };
    const move = function (value, e) {
      e.preventDefault();
      e.stopPropagation();
      this._saveValueChangeEvent(e);
      this._animateValue(value);
    };
    return (0, _extend.extend)(this.callBase(), {
      space: click,
      enter: click,
      leftArrow: move.bind(this, !!isRTL),
      rightArrow: move.bind(this, !isRTL)
    });
  },
  _useTemplates() {
    return false;
  },
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      hoverStateEnabled: true,
      activeStateEnabled: true,
      switchedOnText: _message.default.format('dxSwitch-switchedOnText'),
      switchedOffText: _message.default.format('dxSwitch-switchedOffText'),
      value: false
    });
  },
  _defaultOptionsRules() {
    return this.callBase().concat([{
      device() {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }]);
  },
  _feedbackHideTimeout: 0,
  _animating: false,
  _initMarkup() {
    this._renderContainers();
    this.$element().addClass(SWITCH_CLASS).append(this._$switchWrapper);
    this._renderSubmitElement();
    this._renderClick();
    this.setAria('role', 'switch');
    this._renderSwipeable();
    this.callBase();
    this._renderSwitchInner();
    this._renderLabels();
    this._renderValue();
  },
  _getInnerOffset(value, offset) {
    const ratio = (offset - this._offsetDirection() * Number(!value)) / 2;
    return `${100 * ratio}%`;
  },
  _getHandleOffset(value, offset) {
    if (this.option('rtlEnabled')) {
      value = !value;
    }
    if (value) {
      const calcValue = -100 + 100 * -offset;
      return `${calcValue}%`;
    }
    return `${100 * -offset}%`;
  },
  _renderSwitchInner() {
    this._$switchInner = (0, _renderer.default)('<div>').addClass(SWITCH_INNER_CLASS).appendTo(this._$switchContainer);
    this._$handle = (0, _renderer.default)('<div>').addClass(SWITCH_HANDLE_CLASS).appendTo(this._$switchInner);
  },
  _renderLabels() {
    this._$labelOn = (0, _renderer.default)('<div>').addClass(SWITCH_ON_CLASS).prependTo(this._$switchInner);
    this._$labelOff = (0, _renderer.default)('<div>').addClass(SWITCH_OFF_CLASS).appendTo(this._$switchInner);
    this._setLabelsText();
  },
  _renderContainers() {
    this._$switchContainer = (0, _renderer.default)('<div>').addClass(SWITCH_CONTAINER_CLASS);
    this._$switchWrapper = (0, _renderer.default)('<div>').addClass(SWITCH_WRAPPER_CLASS).append(this._$switchContainer);
  },
  _renderSwipeable() {
    this._createComponent(this.$element(), _swipeable.default, {
      elastic: false,
      immediate: true,
      onStart: this._swipeStartHandler.bind(this),
      onUpdated: this._swipeUpdateHandler.bind(this),
      onEnd: this._swipeEndHandler.bind(this),
      itemSizeFunc: this._getItemSizeFunc.bind(this)
    });
  },
  _getItemSizeFunc() {
    return (0, _size.getOuterWidth)(this._$switchContainer, true) - (0, _position.getBoundingRect)(this._$handle.get(0)).width;
  },
  _renderSubmitElement() {
    this._$submitElement = (0, _renderer.default)('<input>').attr('type', 'hidden').appendTo(this.$element());
  },
  _getSubmitElement() {
    return this._$submitElement;
  },
  _offsetDirection() {
    return this.option('rtlEnabled') ? -1 : 1;
  },
  _renderPosition(state, swipeOffset) {
    const innerOffset = this._getInnerOffset(state, swipeOffset);
    const handleOffset = this._getHandleOffset(state, swipeOffset);
    this._$switchInner.css('transform', ` translateX(${innerOffset})`);
    this._$handle.css('transform', ` translateX(${handleOffset})`);
  },
  _validateValue() {
    const check = this.option('value');
    if (typeof check !== 'boolean') {
      this._options.silent('value', !!check);
    }
  },
  _renderClick() {
    const eventName = (0, _index.addNamespace)(_click.name, this.NAME);
    const $element = this.$element();
    this._clickAction = this._createAction(this._clickHandler.bind(this));
    _events_engine.default.off($element, eventName);
    _events_engine.default.on($element, eventName, e => {
      this._clickAction({
        event: e
      });
    });
  },
  _clickHandler(args) {
    const e = args.event;
    this._saveValueChangeEvent(e);
    if (this._animating || this._swiping) {
      return;
    }
    this._animateValue(!this.option('value'));
  },
  _animateValue(value) {
    const startValue = this.option('value');
    const endValue = value;
    if (startValue === endValue) {
      return;
    }
    this._animating = true;
    const fromInnerOffset = this._getInnerOffset(startValue, 0);
    const toInnerOffset = this._getInnerOffset(endValue, 0);
    const fromHandleOffset = this._getHandleOffset(startValue, 0);
    const toHandleOffset = this._getHandleOffset(endValue, 0);
    const that = this;
    const fromInnerConfig = {};
    const toInnerConfig = {};
    const fromHandleConfig = {};
    const toHandlerConfig = {};
    // @ts-expect-error
    fromInnerConfig.transform = ` translateX(${fromInnerOffset})`;
    // @ts-expect-error
    toInnerConfig.transform = ` translateX(${toInnerOffset})`;
    // @ts-expect-error
    fromHandleConfig.transform = ` translateX(${fromHandleOffset})`;
    // @ts-expect-error
    toHandlerConfig.transform = ` translateX(${toHandleOffset})`;
    this.$element().toggleClass(SWITCH_ON_VALUE_CLASS, endValue);
    _fx.default.animate(this._$handle, {
      // @ts-expect-error
      from: fromHandleConfig,
      // @ts-expect-error
      to: toHandlerConfig,
      duration: SWITCH_ANIMATION_DURATION
    });
    _fx.default.animate(this._$switchInner, {
      // @ts-expect-error
      from: fromInnerConfig,
      // @ts-expect-error
      to: toInnerConfig,
      duration: SWITCH_ANIMATION_DURATION,
      complete() {
        that._animating = false;
        that.option('value', endValue);
      }
    });
  },
  _swipeStartHandler(e) {
    const state = this.option('value');
    const rtlEnabled = this.option('rtlEnabled');
    const maxOffOffset = rtlEnabled ? 0 : 1;
    const maxOnOffset = rtlEnabled ? 1 : 0;
    e.event.maxLeftOffset = state ? maxOffOffset : maxOnOffset;
    e.event.maxRightOffset = state ? maxOnOffset : maxOffOffset;
    this._swiping = true;
    this._feedbackDeferred = (0, _deferred.Deferred)();
    (0, _emitter.lock)(this._feedbackDeferred);
    this._toggleActiveState(this.$element(), this.option('activeStateEnabled'));
  },
  _swipeUpdateHandler(e) {
    this._renderPosition(this.option('value'), e.event.offset);
  },
  _swipeEndHandler(e) {
    const that = this;
    const offsetDirection = this._offsetDirection();
    const toInnerConfig = {};
    const toHandleConfig = {};
    const innerOffset = this._getInnerOffset(that.option('value'), e.event.targetOffset);
    const handleOffset = this._getHandleOffset(that.option('value'), e.event.targetOffset);
    // @ts-expect-error
    toInnerConfig.transform = ` translateX(${innerOffset})`;
    // @ts-expect-error
    toHandleConfig.transform = ` translateX(${handleOffset})`;
    _fx.default.animate(this._$handle, {
      // @ts-expect-error
      to: toHandleConfig,
      duration: SWITCH_ANIMATION_DURATION
    });
    _fx.default.animate(this._$switchInner, {
      // @ts-expect-error
      to: toInnerConfig,
      duration: SWITCH_ANIMATION_DURATION,
      complete() {
        that._swiping = false;
        const pos = that.option('value') + offsetDirection * e.event.targetOffset;
        that._saveValueChangeEvent(e.event);
        that.option('value', Boolean(pos));
        that._feedbackDeferred.resolve();
        that._toggleActiveState(that.$element(), false);
      }
    });
  },
  _renderValue() {
    this._validateValue();
    const value = this.option('value');
    this._renderPosition(value, 0);
    this.$element().toggleClass(SWITCH_ON_VALUE_CLASS, value);
    this._getSubmitElement().val(value);
    this.setAria({
      checked: value,
      label: value ? this.option('switchedOnText') : this.option('switchedOffText')
    });
  },
  _setLabelsText() {
    this._$labelOn && this._$labelOn.text(this.option('switchedOnText'));
    this._$labelOff && this._$labelOff.text(this.option('switchedOffText'));
  },
  _visibilityChanged(visible) {
    if (visible) {
      this.repaint();
    }
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'width':
        delete this._marginBound;
        this._refresh();
        break;
      case 'switchedOnText':
      case 'switchedOffText':
        this._setLabelsText();
        break;
      case 'value':
        this._renderValue();
        this.callBase(args);
        break;
      default:
        this.callBase(args);
    }
  }
});
(0, _component_registrator.default)('dxSwitch', Switch);
var _default = exports.default = Switch;