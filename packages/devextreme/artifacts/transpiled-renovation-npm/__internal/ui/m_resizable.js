"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _translator = require("../../animation/translator");
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _dom_component = _interopRequireDefault(require("../../core/dom_component"));
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _common = require("../../core/utils/common");
var _extend = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _math = require("../../core/utils/math");
var _size = require("../../core/utils/size");
var _type = require("../../core/utils/type");
var _window = require("../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _drag = require("../../events/drag");
var _index = require("../../events/utils/index");
var _visibility_change = require("../../events/visibility_change");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // @ts-expect-error
const RESIZABLE = 'dxResizable';
const RESIZABLE_CLASS = 'dx-resizable';
const RESIZABLE_RESIZING_CLASS = 'dx-resizable-resizing';
const RESIZABLE_HANDLE_CLASS = 'dx-resizable-handle';
const RESIZABLE_HANDLE_TOP_CLASS = 'dx-resizable-handle-top';
const RESIZABLE_HANDLE_BOTTOM_CLASS = 'dx-resizable-handle-bottom';
const RESIZABLE_HANDLE_LEFT_CLASS = 'dx-resizable-handle-left';
const RESIZABLE_HANDLE_RIGHT_CLASS = 'dx-resizable-handle-right';
const RESIZABLE_HANDLE_CORNER_CLASS = 'dx-resizable-handle-corner';
const DRAGSTART_START_EVENT_NAME = (0, _index.addNamespace)(_drag.start, RESIZABLE);
const DRAGSTART_EVENT_NAME = (0, _index.addNamespace)(_drag.move, RESIZABLE);
const DRAGSTART_END_EVENT_NAME = (0, _index.addNamespace)(_drag.end, RESIZABLE);
const SIDE_BORDER_WIDTH_STYLES = {
  left: 'borderLeftWidth',
  top: 'borderTopWidth',
  right: 'borderRightWidth',
  bottom: 'borderBottomWidth'
};
// @ts-expect-error
const Resizable = _dom_component.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      handles: 'all',
      // NOTE: does not affect proportional resize
      step: '1',
      stepPrecision: 'simple',
      area: undefined,
      minWidth: 30,
      maxWidth: Infinity,
      minHeight: 30,
      maxHeight: Infinity,
      onResizeStart: null,
      onResize: null,
      onResizeEnd: null,
      roundStepValue: true,
      keepAspectRatio: true
    });
  },
  _init() {
    this.callBase();
    this.$element().addClass(RESIZABLE_CLASS);
  },
  _initMarkup() {
    this.callBase();
    this._renderHandles();
  },
  _render() {
    this.callBase();
    this._renderActions();
  },
  _renderActions() {
    this._resizeStartAction = this._createActionByOption('onResizeStart');
    this._resizeEndAction = this._createActionByOption('onResizeEnd');
    this._resizeAction = this._createActionByOption('onResize');
  },
  _renderHandles() {
    this._handles = [];
    const handles = this.option('handles');
    if (handles === 'none' || !handles) {
      return;
    }
    const directions = handles === 'all' ? ['top', 'bottom', 'left', 'right'] : handles.split(' ');
    const activeHandlesMap = {};
    (0, _iterator.each)(directions, (index, handleName) => {
      activeHandlesMap[handleName] = true;
      this._renderHandle(handleName);
    });
    // @ts-expect-error
    activeHandlesMap.bottom && activeHandlesMap.right && this._renderHandle('corner-bottom-right');
    // @ts-expect-error
    activeHandlesMap.bottom && activeHandlesMap.left && this._renderHandle('corner-bottom-left');
    // @ts-expect-error
    activeHandlesMap.top && activeHandlesMap.right && this._renderHandle('corner-top-right');
    // @ts-expect-error
    activeHandlesMap.top && activeHandlesMap.left && this._renderHandle('corner-top-left');
    this._attachEventHandlers();
  },
  _renderHandle(handleName) {
    const $handle = (0, _renderer.default)('<div>').addClass(RESIZABLE_HANDLE_CLASS).addClass(`${RESIZABLE_HANDLE_CLASS}-${handleName}`).appendTo(this.$element());
    this._handles.push($handle);
  },
  _attachEventHandlers() {
    if (this.option('disabled')) {
      return;
    }
    const handlers = {};
    handlers[DRAGSTART_START_EVENT_NAME] = this._dragStartHandler.bind(this);
    handlers[DRAGSTART_EVENT_NAME] = this._dragHandler.bind(this);
    handlers[DRAGSTART_END_EVENT_NAME] = this._dragEndHandler.bind(this);
    this._handles.forEach(handleElement => {
      _events_engine.default.on(handleElement, handlers, {
        direction: 'both',
        immediate: true
      });
    });
  },
  _detachEventHandlers() {
    this._handles.forEach(handleElement => {
      // @ts-expect-error
      _events_engine.default.off(handleElement);
    });
  },
  _toggleEventHandlers(shouldAttachEvents) {
    shouldAttachEvents ? this._attachEventHandlers() : this._detachEventHandlers();
  },
  _getElementSize() {
    const $element = this.$element();
    return $element.css('boxSizing') === 'border-box' ? {
      width: (0, _size.getOuterWidth)($element),
      height: (0, _size.getOuterHeight)($element)
    } : {
      width: (0, _size.getWidth)($element),
      height: (0, _size.getHeight)($element)
    };
  },
  _dragStartHandler(e) {
    const $element = this.$element();
    if ($element.is('.dx-state-disabled, .dx-state-disabled *')) {
      e.cancel = true;
      return;
    }
    this._toggleResizingClass(true);
    this._movingSides = this._getMovingSides(e);
    this._elementLocation = (0, _translator.locate)($element);
    this._elementSize = this._getElementSize();
    this._renderDragOffsets(e);
    this._resizeStartAction({
      event: e,
      width: this._elementSize.width,
      height: this._elementSize.height,
      handles: this._movingSides
    });
    e.targetElements = null;
  },
  _toggleResizingClass(value) {
    this.$element().toggleClass(RESIZABLE_RESIZING_CLASS, value);
  },
  _renderDragOffsets(e) {
    const area = this._getArea();
    if (!area) {
      return;
    }
    const $handle = (0, _renderer.default)(e.target).closest(`.${RESIZABLE_HANDLE_CLASS}`);
    const handleWidth = (0, _size.getOuterWidth)($handle);
    const handleHeight = (0, _size.getOuterHeight)($handle);
    const handleOffset = $handle.offset();
    const areaOffset = area.offset;
    const scrollOffset = this._getAreaScrollOffset();
    // @ts-expect-error
    e.maxLeftOffset = this._leftMaxOffset = handleOffset.left - areaOffset.left - scrollOffset.scrollX;
    // @ts-expect-error
    e.maxRightOffset = this._rightMaxOffset = areaOffset.left + area.width - handleOffset.left - handleWidth + scrollOffset.scrollX;
    // @ts-expect-error
    e.maxTopOffset = this._topMaxOffset = handleOffset.top - areaOffset.top - scrollOffset.scrollY;
    // @ts-expect-error
    e.maxBottomOffset = this._bottomMaxOffset = areaOffset.top + area.height - handleOffset.top - handleHeight + scrollOffset.scrollY;
  },
  _getBorderWidth($element, direction) {
    if ((0, _type.isWindow)($element.get(0))) return 0;
    const borderWidth = $element.css(SIDE_BORDER_WIDTH_STYLES[direction]);
    // eslint-disable-next-line radix
    return parseInt(borderWidth) || 0;
  },
  _proportionate(direction, value) {
    const size = this._elementSize;
    const factor = direction === 'x' ? size.width / size.height : size.height / size.width;
    return value * factor;
  },
  _getProportionalDelta(_ref) {
    let {
      x,
      y
    } = _ref;
    const proportionalY = this._proportionate('y', x);
    if (proportionalY >= y) {
      return {
        x,
        y: proportionalY
      };
    }
    const proportionalX = this._proportionate('x', y);
    if (proportionalX >= x) {
      return {
        x: proportionalX,
        y
      };
    }
    return {
      x: 0,
      y: 0
    };
  },
  _getDirectionName(axis) {
    const sides = this._movingSides;
    if (axis === 'x') {
      return sides.left ? 'left' : 'right';
    }
    return sides.top ? 'top' : 'bottom';
  },
  _fitIntoArea(axis, value) {
    const directionName = this._getDirectionName(axis);
    return Math.min(value, this[`_${directionName}MaxOffset`] ?? Infinity);
  },
  _fitDeltaProportionally(delta) {
    let fittedDelta = _extends({}, delta);
    const size = this._elementSize;
    const {
      minWidth,
      minHeight,
      maxWidth,
      maxHeight
    } = this.option();
    const getWidth = () => size.width + fittedDelta.x;
    const getHeight = () => size.height + fittedDelta.y;
    const getFittedWidth = () => (0, _math.fitIntoRange)(getWidth(), minWidth, maxWidth);
    const getFittedHeight = () => (0, _math.fitIntoRange)(getHeight(), minHeight, maxHeight);
    const isInArea = axis => fittedDelta[axis] === this._fitIntoArea(axis, fittedDelta[axis]);
    const isFittedX = () => (0, _math.inRange)(getWidth(), minWidth, maxWidth) && isInArea('x');
    const isFittedY = () => (0, _math.inRange)(getHeight(), minHeight, maxHeight) && isInArea('y');
    if (!isFittedX()) {
      const x = this._fitIntoArea('x', getFittedWidth() - size.width);
      fittedDelta = {
        x,
        y: this._proportionate('y', x)
      };
    }
    if (!isFittedY()) {
      const y = this._fitIntoArea('y', getFittedHeight() - size.height);
      fittedDelta = {
        x: this._proportionate('x', y),
        y
      };
    }
    return isFittedX() && isFittedY() ? fittedDelta : {
      x: 0,
      y: 0
    };
  },
  _fitDelta(_ref2) {
    let {
      x,
      y
    } = _ref2;
    const size = this._elementSize;
    const {
      minWidth,
      minHeight,
      maxWidth,
      maxHeight
    } = this.option();
    return {
      x: (0, _math.fitIntoRange)(size.width + x, minWidth, maxWidth) - size.width,
      y: (0, _math.fitIntoRange)(size.height + y, minHeight, maxHeight) - size.height
    };
  },
  _getDeltaByOffset(offset) {
    const sides = this._movingSides;
    const shouldKeepAspectRatio = this._isCornerHandler(sides) && this.option('keepAspectRatio');
    let delta = {
      x: offset.x * (sides.left ? -1 : 1),
      y: offset.y * (sides.top ? -1 : 1)
    };
    if (shouldKeepAspectRatio) {
      const proportionalDelta = this._getProportionalDelta(delta);
      const fittedProportionalDelta = this._fitDeltaProportionally(proportionalDelta);
      delta = fittedProportionalDelta;
    } else {
      const fittedDelta = this._fitDelta(delta);
      const roundedFittedDelta = this._roundByStep(fittedDelta);
      delta = roundedFittedDelta;
    }
    return delta;
  },
  _updatePosition(delta, _ref3) {
    let {
      width,
      height
    } = _ref3;
    const location = this._elementLocation;
    const sides = this._movingSides;
    const $element = this.$element();
    const elementRect = this._getElementSize();
    const offsetTop = delta.y * (sides.top ? -1 : 1) - ((elementRect.height || height) - height);
    const offsetLeft = delta.x * (sides.left ? -1 : 1) - ((elementRect.width || width) - width);
    (0, _translator.move)($element, {
      top: location.top + (sides.top ? offsetTop : 0),
      left: location.left + (sides.left ? offsetLeft : 0)
    });
  },
  _dragHandler(e) {
    const offset = this._getOffset(e);
    const delta = this._getDeltaByOffset(offset);
    const dimensions = this._updateDimensions(delta);
    this._updatePosition(delta, dimensions);
    this._triggerResizeAction(e, dimensions);
  },
  _updateDimensions(delta) {
    const isAbsoluteSize = size => size.substring(size.length - 2) === 'px';
    const isStepPrecisionStrict = this.option('stepPrecision') === 'strict';
    const size = this._elementSize;
    const width = size.width + delta.x;
    const height = size.height + delta.y;
    const elementStyle = this.$element().get(0).style;
    const shouldRenderWidth = delta.x || isStepPrecisionStrict || isAbsoluteSize(elementStyle.width);
    const shouldRenderHeight = delta.y || isStepPrecisionStrict || isAbsoluteSize(elementStyle.height);
    if (shouldRenderWidth) this.option({
      width
    });
    if (shouldRenderHeight) this.option({
      height
    });
    return {
      width: shouldRenderWidth ? width : size.width,
      height: shouldRenderHeight ? height : size.height
    };
  },
  _triggerResizeAction(e, _ref4) {
    let {
      width,
      height
    } = _ref4;
    this._resizeAction({
      event: e,
      width: this.option('width') || width,
      height: this.option('height') || height,
      handles: this._movingSides
    });
    (0, _visibility_change.triggerResizeEvent)(this.$element());
  },
  _isCornerHandler(sides) {
    // @ts-expect-error
    return Object.values(sides).reduce((xor, value) => xor ^ value, 0) === 0;
  },
  _getOffset(e) {
    const {
      offset
    } = e;
    const sides = this._movingSides;
    if (!sides.left && !sides.right) offset.x = 0;
    if (!sides.top && !sides.bottom) offset.y = 0;
    return offset;
  },
  _roundByStep(delta) {
    return this.option('stepPrecision') === 'strict' ? this._roundStrict(delta) : this._roundNotStrict(delta);
  },
  _getSteps() {
    return (0, _common.pairToObject)(this.option('step'), !this.option('roundStepValue'));
  },
  _roundNotStrict(delta) {
    const steps = this._getSteps();
    return {
      x: delta.x - delta.x % steps.h,
      y: delta.y - delta.y % steps.v
    };
  },
  _roundStrict(delta) {
    const sides = this._movingSides;
    const offset = {
      x: delta.x * (sides.left ? -1 : 1),
      y: delta.y * (sides.top ? -1 : 1)
    };
    const steps = this._getSteps();
    const location = this._elementLocation;
    const size = this._elementSize;
    const xPos = sides.left ? location.left : location.left + size.width;
    const yPos = sides.top ? location.top : location.top + size.height;
    const newXShift = (xPos + offset.x) % steps.h;
    const newYShift = (yPos + offset.y) % steps.v;
    const sign = Math.sign || (x => {
      x = +x;
      if (x === 0 || isNaN(x)) {
        return x;
      }
      return x > 0 ? 1 : -1;
    });
    const separatorOffset = (steps, offset) => (1 + sign(offset) * 0.2) % 1 * steps;
    const isSmallOffset = (offset, steps) => Math.abs(offset) < 0.2 * steps;
    let newOffsetX = offset.x - newXShift;
    let newOffsetY = offset.y - newYShift;
    if (newXShift > separatorOffset(steps.h, offset.x)) {
      newOffsetX += steps.h;
    }
    if (newYShift > separatorOffset(steps.v, offset.y)) {
      newOffsetY += steps.v;
    }
    const roundedOffset = {
      x: (sides.left || sides.right) && !isSmallOffset(offset.x, steps.h) ? newOffsetX : 0,
      y: (sides.top || sides.bottom) && !isSmallOffset(offset.y, steps.v) ? newOffsetY : 0
    };
    return {
      x: roundedOffset.x * (sides.left ? -1 : 1),
      y: roundedOffset.y * (sides.top ? -1 : 1)
    };
  },
  _getMovingSides(e) {
    const $target = (0, _renderer.default)(e.target);
    const hasCornerTopLeftClass = $target.hasClass(`${RESIZABLE_HANDLE_CORNER_CLASS}-top-left`);
    const hasCornerTopRightClass = $target.hasClass(`${RESIZABLE_HANDLE_CORNER_CLASS}-top-right`);
    const hasCornerBottomLeftClass = $target.hasClass(`${RESIZABLE_HANDLE_CORNER_CLASS}-bottom-left`);
    const hasCornerBottomRightClass = $target.hasClass(`${RESIZABLE_HANDLE_CORNER_CLASS}-bottom-right`);
    return {
      top: $target.hasClass(RESIZABLE_HANDLE_TOP_CLASS) || hasCornerTopLeftClass || hasCornerTopRightClass,
      left: $target.hasClass(RESIZABLE_HANDLE_LEFT_CLASS) || hasCornerTopLeftClass || hasCornerBottomLeftClass,
      bottom: $target.hasClass(RESIZABLE_HANDLE_BOTTOM_CLASS) || hasCornerBottomLeftClass || hasCornerBottomRightClass,
      right: $target.hasClass(RESIZABLE_HANDLE_RIGHT_CLASS) || hasCornerTopRightClass || hasCornerBottomRightClass
    };
  },
  _getArea() {
    let area = this.option('area');
    if ((0, _type.isFunction)(area)) {
      area = area.call(this);
    }
    if ((0, _type.isPlainObject)(area)) {
      return this._getAreaFromObject(area);
    }
    return this._getAreaFromElement(area);
  },
  _getAreaScrollOffset() {
    const area = this.option('area');
    const isElement = !(0, _type.isFunction)(area) && !(0, _type.isPlainObject)(area);
    const scrollOffset = {
      scrollY: 0,
      scrollX: 0
    };
    if (isElement) {
      const areaElement = (0, _renderer.default)(area)[0];
      if ((0, _type.isWindow)(areaElement)) {
        scrollOffset.scrollX = areaElement.pageXOffset;
        scrollOffset.scrollY = areaElement.pageYOffset;
      }
    }
    return scrollOffset;
  },
  _getAreaFromObject(area) {
    const result = {
      width: area.right - area.left,
      height: area.bottom - area.top,
      offset: {
        left: area.left,
        top: area.top
      }
    };
    this._correctAreaGeometry(result);
    return result;
  },
  _getAreaFromElement(area) {
    const $area = (0, _renderer.default)(area);
    let result;
    if ($area.length) {
      result = {
        width: (0, _size.getInnerWidth)($area),
        height: (0, _size.getInnerHeight)($area),
        offset: (0, _extend.extend)({
          top: 0,
          left: 0
        }, (0, _type.isWindow)($area[0]) ? {} : $area.offset())
      };
      this._correctAreaGeometry(result, $area);
    }
    return result;
  },
  _correctAreaGeometry(result, $area) {
    const areaBorderLeft = $area ? this._getBorderWidth($area, 'left') : 0;
    const areaBorderTop = $area ? this._getBorderWidth($area, 'top') : 0;
    result.offset.left += areaBorderLeft + this._getBorderWidth(this.$element(), 'left');
    result.offset.top += areaBorderTop + this._getBorderWidth(this.$element(), 'top');
    result.width -= (0, _size.getOuterWidth)(this.$element()) - (0, _size.getInnerWidth)(this.$element());
    result.height -= (0, _size.getOuterHeight)(this.$element()) - (0, _size.getInnerHeight)(this.$element());
  },
  _dragEndHandler(e) {
    const $element = this.$element();
    this._resizeEndAction({
      event: e,
      width: (0, _size.getOuterWidth)($element),
      height: (0, _size.getOuterHeight)($element),
      handles: this._movingSides
    });
    this._toggleResizingClass(false);
  },
  _renderWidth(width) {
    this.option('width', (0, _math.fitIntoRange)(width, this.option('minWidth'), this.option('maxWidth')));
  },
  _renderHeight(height) {
    this.option('height', (0, _math.fitIntoRange)(height, this.option('minHeight'), this.option('maxHeight')));
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'disabled':
        this._toggleEventHandlers(!args.value);
        this.callBase(args);
        break;
      case 'handles':
        this._invalidate();
        break;
      case 'minWidth':
      case 'maxWidth':
        (0, _window.hasWindow)() && this._renderWidth((0, _size.getOuterWidth)(this.$element()));
        break;
      case 'minHeight':
      case 'maxHeight':
        (0, _window.hasWindow)() && this._renderHeight((0, _size.getOuterHeight)(this.$element()));
        break;
      case 'onResize':
      case 'onResizeStart':
      case 'onResizeEnd':
        this._renderActions();
        break;
      case 'area':
      case 'stepPrecision':
      case 'step':
      case 'roundStepValue':
      case 'keepAspectRatio':
        break;
      default:
        this.callBase(args);
        break;
    }
  },
  _clean() {
    this.$element().find(`.${RESIZABLE_HANDLE_CLASS}`).remove();
  },
  _useTemplates() {
    return false;
  }
});
(0, _component_registrator.default)(RESIZABLE, Resizable);
var _default = exports.default = Resizable;