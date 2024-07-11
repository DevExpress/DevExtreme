"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _position = _interopRequireDefault(require("../../../animation/position"));
var _translator = require("../../../animation/translator");
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _element = require("../../../core/element");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _extend = require("../../../core/utils/extend");
var _math = require("../../../core/utils/math");
var _position2 = require("../../../core/utils/position");
var _size = require("../../../core/utils/size");
var _type = require("../../../core/utils/type");
var _window = require("../../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _index = require("../../../events/utils/index");
var _ui = _interopRequireDefault(require("../../../ui/popup/ui.popup"));
var _themes = require("../../../ui/themes");
var _ui2 = _interopRequireDefault(require("../../../ui/widget/ui.errors"));
var _m_popover_position_controller = require("./m_popover_position_controller");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const POPOVER_CLASS = 'dx-popover';
const POPOVER_WRAPPER_CLASS = 'dx-popover-wrapper';
const POPOVER_ARROW_CLASS = 'dx-popover-arrow';
const POPOVER_WITHOUT_TITLE_CLASS = 'dx-popover-without-title';
const POSITION_FLIP_MAP = {
  left: 'right',
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  center: 'center'
};
const getEventNameByOption = function (optionValue) {
  // @ts-expect-error
  return (0, _type.isObject)(optionValue) ? optionValue.name : optionValue;
};
const getEventName = function (that, optionName) {
  const optionValue = that.option(optionName);
  return getEventNameByOption(optionValue);
};
const getEventDelay = function (that, optionName) {
  const optionValue = that.option(optionName);
  // @ts-expect-error
  return (0, _type.isObject)(optionValue) && optionValue.delay;
};
const attachEvent = function (that, name) {
  const {
    target,
    shading,
    disabled,
    hideEvent
  } = that.option();
  const isSelector = (0, _type.isString)(target);
  const shouldIgnoreHideEvent = shading && name === 'hide';
  const event = shouldIgnoreHideEvent ? null : getEventName(that, `${name}Event`);
  if (shouldIgnoreHideEvent && hideEvent) {
    _ui2.default.log('W1020');
  }
  if (!event || disabled) {
    return;
  }
  const eventName = (0, _index.addNamespace)(event, that.NAME);
  const action = that._createAction(function () {
    const delay = getEventDelay(that, `${name}Event`);
    this._clearEventsTimeouts();
    if (delay) {
      this._timeouts[name] = setTimeout(() => {
        that[name]();
      }, delay);
    } else {
      that[name]();
    }
  }.bind(that), {
    validatingTargetName: 'target'
  });
  const handler = function (e) {
    action({
      event: e,
      target: (0, _renderer.default)(e.currentTarget)
    });
  };
  const EVENT_HANDLER_NAME = `_${name}EventHandler`;
  if (isSelector) {
    that[EVENT_HANDLER_NAME] = handler;
    _events_engine.default.on(_dom_adapter.default.getDocument(), eventName, target, handler);
  } else {
    const targetElement = (0, _element.getPublicElement)((0, _renderer.default)(target));
    that[EVENT_HANDLER_NAME] = undefined;
    _events_engine.default.on(targetElement, eventName, handler);
  }
};
const detachEvent = function (that, target, name, event) {
  let eventName = event || getEventName(that, `${name}Event`);
  if (!eventName) {
    return;
  }
  eventName = (0, _index.addNamespace)(eventName, that.NAME);
  const EVENT_HANDLER_NAME = `_${name}EventHandler`;
  if (that[EVENT_HANDLER_NAME]) {
    // @ts-expect-error
    _events_engine.default.off(_dom_adapter.default.getDocument(), eventName, target, that[EVENT_HANDLER_NAME]);
  } else {
    _events_engine.default.off((0, _element.getPublicElement)((0, _renderer.default)(target)), eventName);
  }
};
const Popover = _ui.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      target: undefined,
      shading: false,
      position: (0, _extend.extend)({}, _m_popover_position_controller.POPOVER_POSITION_ALIASES.bottom),
      hideOnOutsideClick: true,
      animation: {
        show: {
          type: 'fade',
          from: 0,
          to: 1
        },
        hide: {
          type: 'fade',
          from: 1,
          to: 0
        }
      },
      showTitle: false,
      width: 'auto',
      height: 'auto',
      dragEnabled: false,
      resizeEnabled: false,
      fullScreen: false,
      hideOnParentScroll: true,
      arrowPosition: '',
      arrowOffset: 0,
      _fixWrapperPosition: true
    });
  },
  _defaultOptionsRules() {
    return [{
      device: {
        platform: 'ios'
      },
      options: {
        arrowPosition: {
          boundaryOffset: {
            h: 20,
            v: -10
          },
          collision: 'fit'
        }
      }
    }, {
      device() {
        return !(0, _window.hasWindow)();
      },
      options: {
        animation: null
      }
    }, {
      device() {
        // @ts-expect-error
        return (0, _themes.isMaterialBased)();
      },
      options: {
        useFlatToolbarButtons: true
      }
    }, {
      device() {
        // @ts-expect-error
        return (0, _themes.isMaterial)();
      },
      options: {
        useDefaultToolbarButtons: true,
        showCloseButton: false
      }
    }];
  },
  _init() {
    var _this$option;
    this.callBase();
    this._renderArrow();
    this._timeouts = {};
    this.$element().addClass(POPOVER_CLASS);
    this.$wrapper().addClass(POPOVER_WRAPPER_CLASS);
    const isInteractive = (_this$option = this.option('toolbarItems')) === null || _this$option === void 0 ? void 0 : _this$option.length;
    this.setAria('role', isInteractive ? 'dialog' : 'tooltip');
  },
  _render() {
    this.callBase.apply(this, arguments);
    this._detachEvents(this.option('target'));
    this._attachEvents();
  },
  _detachEvents(target) {
    detachEvent(this, target, 'show');
    detachEvent(this, target, 'hide');
  },
  _attachEvents() {
    attachEvent(this, 'show');
    attachEvent(this, 'hide');
  },
  _renderArrow() {
    this._$arrow = (0, _renderer.default)('<div>').addClass(POPOVER_ARROW_CLASS).prependTo(this.$overlayContent());
  },
  _documentDownHandler(e) {
    if (this._isOutsideClick(e)) {
      return this.callBase(e);
    }
    return true;
  },
  _isOutsideClick(e) {
    return !(0, _renderer.default)(e.target).closest(this.option('target')).length;
  },
  _animate(animation) {
    if (animation && animation.to && typeof animation.to === 'object') {
      (0, _extend.extend)(animation.to, {
        position: this._getContainerPosition()
      });
    }
    this.callBase.apply(this, arguments);
  },
  _stopAnimation() {
    this.callBase.apply(this, arguments);
  },
  _renderTitle() {
    this.$wrapper().toggleClass(POPOVER_WITHOUT_TITLE_CLASS, !this.option('showTitle'));
    this.callBase();
  },
  _renderPosition() {
    let shouldUpdateDimensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    this.callBase();
    this._renderOverlayPosition(shouldUpdateDimensions);
    this._actions.onPositioned();
  },
  _renderOverlayPosition(shouldUpdateDimensions) {
    this._resetOverlayPosition(shouldUpdateDimensions);
    this._updateContentSize(shouldUpdateDimensions);
    const contentPosition = this._getContainerPosition();
    // @ts-expect-error
    const resultLocation = _position.default.setup(this.$overlayContent(), contentPosition);
    const positionSide = this._getSideByLocation(resultLocation);
    this._togglePositionClass(`dx-position-${positionSide}`);
    this._toggleFlippedClass(resultLocation.h.flip, resultLocation.v.flip);
    const isArrowVisible = this._isHorizontalSide() || this._isVerticalSide();
    if (isArrowVisible) {
      this._renderArrowPosition(positionSide);
    }
  },
  _resetOverlayPosition(shouldUpdateDimensions) {
    this._setContentHeight(shouldUpdateDimensions);
    this._togglePositionClass(`dx-position-${this._positionController._positionSide}`);
    (0, _translator.move)(this.$overlayContent(), {
      left: 0,
      top: 0
    });
    this._$arrow.css({
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto'
    });
  },
  _updateContentSize(shouldUpdateDimensions) {
    if (!this.$content() || !shouldUpdateDimensions) {
      return;
    }
    // @ts-expect-error
    const containerLocation = _position.default.calculate(this.$overlayContent(), this._getContainerPosition());
    if (containerLocation.h.oversize > 0 && this._isHorizontalSide() && !containerLocation.h.fit) {
      const newContainerWidth = (0, _size.getWidth)(this.$overlayContent()) - containerLocation.h.oversize;
      (0, _size.setWidth)(this.$overlayContent(), newContainerWidth);
    }
    if (containerLocation.v.oversize > 0 && this._isVerticalSide() && !containerLocation.v.fit) {
      const newOverlayContentHeight = (0, _size.getHeight)(this.$overlayContent()) - containerLocation.v.oversize;
      const newPopupContentHeight = (0, _size.getHeight)(this.$content()) - containerLocation.v.oversize;
      (0, _size.setHeight)(this.$overlayContent(), newOverlayContentHeight);
      (0, _size.setHeight)(this.$content(), newPopupContentHeight);
    }
  },
  _getContainerPosition() {
    return this._positionController._getContainerPosition();
  },
  _getHideOnParentScrollTarget() {
    return (0, _renderer.default)(this._positionController._position.of || this.callBase());
  },
  _getSideByLocation(location) {
    const isFlippedByVertical = location.v.flip;
    const isFlippedByHorizontal = location.h.flip;
    return this._isVerticalSide() && isFlippedByVertical || this._isHorizontalSide() && isFlippedByHorizontal || this._isPopoverInside() ? POSITION_FLIP_MAP[this._positionController._positionSide] : this._positionController._positionSide;
  },
  _togglePositionClass(positionClass) {
    this.$wrapper().removeClass('dx-position-left dx-position-right dx-position-top dx-position-bottom').addClass(positionClass);
  },
  _toggleFlippedClass(isFlippedHorizontal, isFlippedVertical) {
    this.$wrapper().toggleClass('dx-popover-flipped-horizontal', isFlippedHorizontal).toggleClass('dx-popover-flipped-vertical', isFlippedVertical);
  },
  _renderArrowPosition(side) {
    const arrowRect = (0, _position2.getBoundingRect)(this._$arrow.get(0));
    const arrowFlip = -(this._isVerticalSide(side) ? arrowRect.height : arrowRect.width);
    this._$arrow.css(POSITION_FLIP_MAP[side], arrowFlip);
    const axis = this._isVerticalSide(side) ? 'left' : 'top';
    const sizeProperty = this._isVerticalSide(side) ? 'width' : 'height';
    const $target = (0, _renderer.default)(this._positionController._position.of);
    // @ts-expect-error
    const targetOffset = _position.default.offset($target) || {
      top: 0,
      left: 0
    };
    // @ts-expect-error
    const contentOffset = _position.default.offset(this.$overlayContent());
    const arrowSize = arrowRect[sizeProperty];
    const contentLocation = contentOffset[axis];
    const contentSize = (0, _position2.getBoundingRect)(this.$overlayContent().get(0))[sizeProperty];
    const targetLocation = targetOffset[axis];
    const targetElement = $target.get(0);
    // @ts-expect-error
    const targetSize = targetElement && !targetElement.preventDefault ? (0, _position2.getBoundingRect)(targetElement)[sizeProperty] : 0;
    const min = Math.max(contentLocation, targetLocation);
    const max = Math.min(contentLocation + contentSize, targetLocation + targetSize);
    let arrowLocation;
    if (this.option('arrowPosition') === 'start') {
      arrowLocation = min - contentLocation;
    } else if (this.option('arrowPosition') === 'end') {
      arrowLocation = max - contentLocation - arrowSize;
    } else {
      arrowLocation = (min + max) / 2 - contentLocation - arrowSize / 2;
    }
    const borderWidth = this._positionController._getContentBorderWidth(side);
    const finalArrowLocation = (0, _math.fitIntoRange)(arrowLocation - borderWidth + this.option('arrowOffset'), borderWidth, contentSize - arrowSize - borderWidth * 2);
    this._$arrow.css(axis, finalArrowLocation);
  },
  _isPopoverInside() {
    return this._positionController._isPopoverInside();
  },
  _setContentHeight(fullUpdate) {
    if (fullUpdate) {
      this.callBase();
    }
  },
  _getPositionControllerConfig() {
    const {
      shading,
      target
    } = this.option();
    return (0, _extend.extend)({}, this.callBase(), {
      target,
      shading,
      $arrow: this._$arrow
    });
  },
  _initPositionController() {
    this._positionController = new _m_popover_position_controller.PopoverPositionController(this._getPositionControllerConfig());
  },
  _renderWrapperDimensions() {
    if (this.option('shading')) {
      this.$wrapper().css({
        width: '100%',
        height: '100%'
      });
    }
  },
  _isVerticalSide(side) {
    return this._positionController._isVerticalSide(side);
  },
  _isHorizontalSide(side) {
    return this._positionController._isHorizontalSide(side);
  },
  _clearEventTimeout(name) {
    clearTimeout(this._timeouts[name]);
  },
  _clearEventsTimeouts() {
    this._clearEventTimeout('show');
    this._clearEventTimeout('hide');
  },
  _clean() {
    this._detachEvents(this.option('target'));
    this.callBase.apply(this, arguments);
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'arrowPosition':
      case 'arrowOffset':
        this._renderGeometry();
        break;
      case 'fullScreen':
        if (args.value) {
          this.option('fullScreen', false);
        }
        break;
      case 'target':
        args.previousValue && this._detachEvents(args.previousValue);
        this._positionController.updateTarget(args.value);
        this._invalidate();
        break;
      case 'showEvent':
      case 'hideEvent':
        {
          const name = args.name.substring(0, 4);
          const event = getEventNameByOption(args.previousValue);
          this.hide();
          detachEvent(this, this.option('target'), name, event);
          attachEvent(this, name);
          break;
        }
      case 'visible':
        this._clearEventTimeout(args.value ? 'show' : 'hide');
        this.callBase(args);
        break;
      default:
        this.callBase(args);
    }
  },
  show(target) {
    if (target) {
      this.option('target', target);
    }
    return this.callBase();
  }
});
(0, _component_registrator.default)('dxPopover', Popover);
var _default = exports.default = Popover;