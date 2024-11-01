import { fx } from '@js/common/core/animation';
import { name as clickEventName } from '@js/common/core/events/click';
import { lock } from '@js/common/core/events/core/emitter.feedback';
import eventsEngine from '@js/common/core/events/core/events_engine';
import Swipeable from '@js/common/core/events/gesture/swipeable';
import { addNamespace } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import $ from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getBoundingRect } from '@js/core/utils/position';
import { getOuterWidth } from '@js/core/utils/size';
import Editor from '@js/ui/editor/editor';

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
const Switch = Editor.inherit({
  _supportedKeys() {
    const isRTL = this.option('rtlEnabled');

    const click = function (e) {
      e.preventDefault();
      this._clickAction({ event: e });
    };
    const move = function (value, e) {
      e.preventDefault();
      e.stopPropagation();
      this._saveValueChangeEvent(e);
      this._animateValue(value);
    };
    return extend(this.callBase(), {
      space: click,
      enter: click,
      leftArrow: move.bind(this, !!isRTL),
      rightArrow: move.bind(this, !isRTL),
    });
  },

  _useTemplates() {
    return false;
  },

  _getDefaultOptions() {
    return extend(this.callBase(), {
      hoverStateEnabled: true,

      activeStateEnabled: true,

      switchedOnText: messageLocalization.format('dxSwitch-switchedOnText'),

      switchedOffText: messageLocalization.format('dxSwitch-switchedOffText'),

      value: false,
    });
  },

  _defaultOptionsRules() {
    return this.callBase().concat([
      {
        device() {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        options: {
          focusStateEnabled: true,
        },
      },
    ]);
  },

  _feedbackHideTimeout: 0,
  _animating: false,

  _initMarkup() {
    this._renderContainers();

    this.$element()
      .addClass(SWITCH_CLASS)
      .append(this._$switchWrapper);

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
    this._$switchInner = $('<div>')
      .addClass(SWITCH_INNER_CLASS)
      .appendTo(this._$switchContainer);

    this._$handle = $('<div>')
      .addClass(SWITCH_HANDLE_CLASS)
      .appendTo(this._$switchInner);
  },

  _renderLabels() {
    this._$labelOn = $('<div>')
      .addClass(SWITCH_ON_CLASS)
      .prependTo(this._$switchInner);

    this._$labelOff = $('<div>')
      .addClass(SWITCH_OFF_CLASS)
      .appendTo(this._$switchInner);

    this._setLabelsText();
  },

  _renderContainers() {
    this._$switchContainer = $('<div>')
      .addClass(SWITCH_CONTAINER_CLASS);

    this._$switchWrapper = $('<div>')
      .addClass(SWITCH_WRAPPER_CLASS)
      .append(this._$switchContainer);
  },

  _renderSwipeable() {
    this._createComponent(this.$element(), Swipeable, {
      elastic: false,
      immediate: true,
      onStart: this._swipeStartHandler.bind(this),
      onUpdated: this._swipeUpdateHandler.bind(this),
      onEnd: this._swipeEndHandler.bind(this),
      itemSizeFunc: this._getItemSizeFunc.bind(this),
    });
  },

  _getItemSizeFunc() {
    return getOuterWidth(this._$switchContainer, true) - getBoundingRect(this._$handle.get(0)).width;
  },

  _renderSubmitElement() {
    this._$submitElement = $('<input>')
      .attr('type', 'hidden')
      .appendTo(this.$element());
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
    const eventName = addNamespace(clickEventName, this.NAME);
    const $element = this.$element();
    this._clickAction = this._createAction(this._clickHandler.bind(this));

    eventsEngine.off($element, eventName);
    eventsEngine.on($element, eventName, (e) => {
      this._clickAction({ event: e });
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

    fx.animate(this._$handle, {
      // @ts-expect-error
      from: fromHandleConfig,
      // @ts-expect-error
      to: toHandlerConfig,
      duration: SWITCH_ANIMATION_DURATION,
    });

    fx.animate(this._$switchInner, {
      // @ts-expect-error
      from: fromInnerConfig,
      // @ts-expect-error
      to: toInnerConfig,
      duration: SWITCH_ANIMATION_DURATION,
      complete() {
        that._animating = false;
        that.option('value', endValue);
      },
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

    this._feedbackDeferred = Deferred();
    lock(this._feedbackDeferred);
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

    fx.animate(this._$handle, {
      // @ts-expect-error
      to: toHandleConfig,
      duration: SWITCH_ANIMATION_DURATION,
    });

    fx.animate(this._$switchInner, {
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
      },
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
      label: value ? this.option('switchedOnText') : this.option('switchedOffText'),
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
  },
});

registerComponent('dxSwitch', Switch);

export default Switch;
