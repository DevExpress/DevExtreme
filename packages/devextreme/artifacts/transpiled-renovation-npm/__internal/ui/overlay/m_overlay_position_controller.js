"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OverlayPositionController = exports.OVERLAY_POSITION_ALIASES = void 0;
var _position = _interopRequireDefault(require("../../../animation/position"));
var _translator = require("../../../animation/translator");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _extend = require("../../../core/utils/extend");
var _type = require("../../../core/utils/type");
var _window = require("../../../core/utils/window");
var _swatch_container = _interopRequireDefault(require("../../../ui/widget/swatch_container"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();
const OVERLAY_POSITION_ALIASES = exports.OVERLAY_POSITION_ALIASES = {
  top: {
    my: 'top center',
    at: 'top center'
  },
  bottom: {
    my: 'bottom center',
    at: 'bottom center'
  },
  right: {
    my: 'right center',
    at: 'right center'
  },
  left: {
    my: 'left center',
    at: 'left center'
  },
  center: {
    my: 'center',
    at: 'center'
  },
  'right bottom': {
    my: 'right bottom',
    at: 'right bottom'
  },
  'right top': {
    my: 'right top',
    at: 'right top'
  },
  'left bottom': {
    my: 'left bottom',
    at: 'left bottom'
  },
  'left top': {
    my: 'left top',
    at: 'left top'
  }
};
const OVERLAY_DEFAULT_BOUNDARY_OFFSET = {
  h: 0,
  v: 0
};
class OverlayPositionController {
  constructor(_ref) {
    let {
      position,
      container,
      visualContainer,
      $root,
      $content,
      $wrapper,
      onPositioned,
      onVisualPositionChanged,
      restorePosition,
      _fixWrapperPosition,
      _skipContentPositioning
    } = _ref;
    this._props = {
      position,
      container,
      visualContainer,
      restorePosition,
      onPositioned,
      onVisualPositionChanged,
      _fixWrapperPosition,
      _skipContentPositioning
    };
    this._$root = $root;
    this._$content = $content;
    this._$wrapper = $wrapper;
    this._$markupContainer = undefined;
    this._$visualContainer = undefined;
    this._shouldRenderContentInitialPosition = true;
    this._visualPosition = undefined;
    this._initialPosition = undefined;
    this._previousVisualPosition = undefined;
    this.updateContainer(container);
    this.updatePosition(position);
    this.updateVisualContainer(visualContainer);
  }
  get $container() {
    this.updateContainer(); // NOTE: swatch classes can be updated runtime
    return this._$markupContainer;
  }
  get $visualContainer() {
    return this._$visualContainer;
  }
  get position() {
    return this._position;
  }
  set fixWrapperPosition(fixWrapperPosition) {
    this._props._fixWrapperPosition = fixWrapperPosition;
    this.styleWrapperPosition();
  }
  set restorePosition(restorePosition) {
    this._props.restorePosition = restorePosition;
  }
  restorePositionOnNextRender(value) {
    // NOTE: no visual position means it's a first render
    this._shouldRenderContentInitialPosition = value || !this._visualPosition;
  }
  openingHandled() {
    const shouldRestorePosition = this._props.restorePosition;
    this.restorePositionOnNextRender(shouldRestorePosition);
  }
  updatePosition(positionProp) {
    this._props.position = positionProp;
    this._position = this._normalizePosition(positionProp);
    this.updateVisualContainer();
  }
  updateContainer() {
    let containerProp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._props.container;
    this._props.container = containerProp;
    this._$markupContainer = containerProp ? (0, _renderer.default)(containerProp) : _swatch_container.default.getSwatchContainer(this._$root);
    this.updateVisualContainer(this._props.visualContainer);
  }
  updateVisualContainer() {
    let visualContainer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._props.visualContainer;
    this._props.visualContainer = visualContainer;
    this._$visualContainer = this._getVisualContainer();
  }
  detectVisualPositionChange(event) {
    this._updateVisualPositionValue();
    this._raisePositionedEvents(event);
  }
  positionContent() {
    if (this._shouldRenderContentInitialPosition) {
      this._renderContentInitialPosition();
    } else {
      (0, _translator.move)(this._$content, this._visualPosition);
      this.detectVisualPositionChange();
    }
  }
  positionWrapper() {
    if (this._$visualContainer) {
      // @ts-expect-error
      _position.default.setup(this._$wrapper, {
        my: 'top left',
        at: 'top left',
        of: this._$visualContainer
      });
    }
  }
  styleWrapperPosition() {
    // @ts-expect-error
    const useFixed = (0, _type.isWindow)(this.$visualContainer.get(0)) || this._props._fixWrapperPosition;
    const positionStyle = useFixed ? 'fixed' : 'absolute';
    this._$wrapper.css('position', positionStyle);
  }
  _updateVisualPositionValue() {
    this._previousVisualPosition = this._visualPosition;
    this._visualPosition = (0, _translator.locate)(this._$content);
  }
  _renderContentInitialPosition() {
    this._renderBoundaryOffset();
    (0, _translator.resetPosition)(this._$content);
    // @ts-expect-error
    const wrapperOverflow = this._$wrapper.css('overflow');
    this._$wrapper.css('overflow', 'hidden');
    if (!this._props._skipContentPositioning) {
      // @ts-expect-error
      const resultPosition = _position.default.setup(this._$content, this._position);
      this._initialPosition = resultPosition;
    }
    // @ts-expect-error
    this._$wrapper.css('overflow', wrapperOverflow);
    this.detectVisualPositionChange();
  }
  _raisePositionedEvents(event) {
    const previousPosition = this._previousVisualPosition;
    const newPosition = this._visualPosition;
    const isVisualPositionChanged = (previousPosition === null || previousPosition === void 0 ? void 0 : previousPosition.top) !== newPosition.top || (previousPosition === null || previousPosition === void 0 ? void 0 : previousPosition.left) !== newPosition.left;
    if (isVisualPositionChanged) {
      this._props.onVisualPositionChanged({
        previousPosition,
        position: newPosition,
        event
      });
    }
    this._props.onPositioned({
      position: this._initialPosition
    });
  }
  _renderBoundaryOffset() {
    const boundaryOffset = this._position ?? {
      boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET
    };
    this._$content.css('margin', `${boundaryOffset.v}px ${boundaryOffset.h}px`);
  }
  _getVisualContainer() {
    var _this$_props$position, _this$_props$position2;
    const containerProp = this._props.container;
    const visualContainerProp = this._props.visualContainer;
    const positionOf = (0, _type.isEvent)((_this$_props$position = this._props.position) === null || _this$_props$position === void 0 ? void 0 : _this$_props$position.of) ? this._props.position.of.target : (_this$_props$position2 = this._props.position) === null || _this$_props$position2 === void 0 ? void 0 : _this$_props$position2.of;
    if (visualContainerProp) {
      return (0, _renderer.default)(visualContainerProp);
    }
    if (containerProp) {
      return (0, _renderer.default)(containerProp);
    }
    if (positionOf) {
      return (0, _renderer.default)(positionOf);
    }
    // @ts-expect-error
    return (0, _renderer.default)(window);
  }
  _normalizePosition(positionProp) {
    const defaultPositionConfig = {
      boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET
    };
    if ((0, _type.isDefined)(positionProp)) {
      return (0, _extend.extend)(true, {}, defaultPositionConfig, this._positionToObject(positionProp));
    }
    return defaultPositionConfig;
  }
  _positionToObject(position) {
    if ((0, _type.isString)(position)) {
      return (0, _extend.extend)({}, OVERLAY_POSITION_ALIASES[position]);
    }
    return position;
  }
}
exports.OverlayPositionController = OverlayPositionController;