"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _position = _interopRequireDefault(require("../animation/position"));
var _translator = require("../animation/translator");
var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));
var _dom_adapter = _interopRequireDefault(require("../core/dom_adapter"));
var _dom_component = _interopRequireDefault(require("../core/dom_component"));
var _element = require("../core/element");
var _renderer = _interopRequireDefault(require("../core/renderer"));
var _empty_template = require("../core/templates/empty_template");
var _common = require("../core/utils/common");
var _deferred = require("../core/utils/deferred");
var _extend = require("../core/utils/extend");
var _inflector = require("../core/utils/inflector");
var _position2 = require("../core/utils/position");
var _size = require("../core/utils/size");
var _string = require("../core/utils/string");
var _type = require("../core/utils/type");
var _view_port = require("../core/utils/view_port");
var _window = require("../core/utils/window");
var _events_engine = _interopRequireDefault(require("../events/core/events_engine"));
var _drag = require("../events/drag");
var _pointer = _interopRequireDefault(require("../events/pointer"));
var _index = require("../events/utils/index");
var _m_animator = _interopRequireDefault(require("./ui/scroll_view/m_animator"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // @ts-expect-error
// @ts-expect-error
const window = (0, _window.getWindow)();
const KEYDOWN_EVENT = 'keydown';
const DRAGGABLE = 'dxDraggable';
const DRAGSTART_EVENT_NAME = (0, _index.addNamespace)(_drag.start, DRAGGABLE);
const DRAG_EVENT_NAME = (0, _index.addNamespace)(_drag.move, DRAGGABLE);
const DRAGEND_EVENT_NAME = (0, _index.addNamespace)(_drag.end, DRAGGABLE);
const DRAG_ENTER_EVENT_NAME = (0, _index.addNamespace)(_drag.enter, DRAGGABLE);
const DRAGEND_LEAVE_EVENT_NAME = (0, _index.addNamespace)(_drag.leave, DRAGGABLE);
const POINTERDOWN_EVENT_NAME = (0, _index.addNamespace)(_pointer.default.down, DRAGGABLE);
const KEYDOWN_EVENT_NAME = (0, _index.addNamespace)(KEYDOWN_EVENT, DRAGGABLE);
const CLONE_CLASS = 'clone';
let targetDraggable;
let sourceDraggable;
const ANONYMOUS_TEMPLATE_NAME = 'content';
const getMousePosition = event => ({
  // @ts-expect-error
  x: event.pageX - (0, _renderer.default)(window).scrollLeft(),
  // @ts-expect-error
  y: event.pageY - (0, _renderer.default)(window).scrollTop()
});
const GESTURE_COVER_CLASS = 'dx-gesture-cover';
const OVERLAY_WRAPPER_CLASS = 'dx-overlay-wrapper';
const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
class ScrollHelper {
  constructor(orientation, component) {
    this._$scrollableAtPointer = null;
    this._preventScroll = true;
    this._component = component;
    if (orientation === 'vertical') {
      this._scrollValue = 'scrollTop';
      this._overFlowAttr = 'overflowY';
      this._sizeAttr = 'height';
      this._scrollSizeProp = 'scrollHeight';
      this._clientSizeProp = 'clientHeight';
      this._limitProps = {
        start: 'top',
        end: 'bottom'
      };
    } else {
      this._scrollValue = 'scrollLeft';
      this._overFlowAttr = 'overflowX';
      this._sizeAttr = 'width';
      this._scrollSizeProp = 'scrollWidth';
      this._clientSizeProp = 'clientWidth';
      this._limitProps = {
        start: 'left',
        end: 'right'
      };
    }
  }
  updateScrollable(elements, mousePosition) {
    let isScrollableFound = false;
    elements.some(element => {
      const $element = (0, _renderer.default)(element);
      const isTargetOverOverlayWrapper = $element.hasClass(OVERLAY_WRAPPER_CLASS);
      const isTargetOverOverlayContent = $element.hasClass(OVERLAY_CONTENT_CLASS);
      if (isTargetOverOverlayWrapper || isTargetOverOverlayContent) {
        return true;
      }
      isScrollableFound = this._trySetScrollable(element, mousePosition);
      return isScrollableFound;
    });
    if (!isScrollableFound) {
      this._$scrollableAtPointer = null;
      this._scrollSpeed = 0;
    }
  }
  isScrolling() {
    return !!this._scrollSpeed;
  }
  isScrollable($element) {
    return ($element.css(this._overFlowAttr) === 'auto' || $element.hasClass('dx-scrollable-container')) && $element.prop(this._scrollSizeProp) > Math.ceil(this._sizeAttr === 'width' ? (0, _size.getWidth)($element) : (0, _size.getHeight)($element));
  }
  _trySetScrollable(element, mousePosition) {
    const that = this;
    const $element = (0, _renderer.default)(element);
    let distanceToBorders;
    const sensitivity = that._component.option('scrollSensitivity');
    let isScrollable = that.isScrollable($element);
    if (isScrollable) {
      distanceToBorders = that._calculateDistanceToBorders($element, mousePosition);
      if (sensitivity > distanceToBorders[that._limitProps.start]) {
        if (!that._preventScroll) {
          that._scrollSpeed = -that._calculateScrollSpeed(distanceToBorders[that._limitProps.start]);
          that._$scrollableAtPointer = $element;
        }
      } else if (sensitivity > distanceToBorders[that._limitProps.end]) {
        if (!that._preventScroll) {
          that._scrollSpeed = that._calculateScrollSpeed(distanceToBorders[that._limitProps.end]);
          that._$scrollableAtPointer = $element;
        }
      } else {
        isScrollable = false;
        that._preventScroll = false;
      }
    }
    return isScrollable;
  }
  _calculateDistanceToBorders($area, mousePosition) {
    const area = $area.get(0);
    let areaBoundingRect;
    if (area) {
      areaBoundingRect = (0, _position2.getBoundingRect)(area);
      return {
        left: mousePosition.x - areaBoundingRect.left,
        top: mousePosition.y - areaBoundingRect.top,
        right: areaBoundingRect.right - mousePosition.x,
        bottom: areaBoundingRect.bottom - mousePosition.y
      };
    }
    return {};
  }
  _calculateScrollSpeed(distance) {
    const component = this._component;
    const sensitivity = component.option('scrollSensitivity');
    const maxSpeed = component.option('scrollSpeed');
    return Math.ceil(((sensitivity - distance) / sensitivity) ** 2 * maxSpeed);
  }
  scrollByStep() {
    const that = this;
    if (that._$scrollableAtPointer && that._scrollSpeed) {
      if (that._$scrollableAtPointer.hasClass('dx-scrollable-container')) {
        const $scrollable = that._$scrollableAtPointer.closest('.dx-scrollable');
        const scrollableInstance = $scrollable.data('dxScrollable') || $scrollable.data('dxScrollView');
        if (scrollableInstance) {
          const nextScrollPosition = scrollableInstance.scrollOffset()[that._limitProps.start] + that._scrollSpeed;
          scrollableInstance.scrollTo({
            [that._limitProps.start]: nextScrollPosition
          });
        }
      } else {
        const nextScrollPosition = that._$scrollableAtPointer[that._scrollValue]() + that._scrollSpeed;
        that._$scrollableAtPointer[that._scrollValue](nextScrollPosition);
      }
      const dragMoveArgs = that._component._dragMoveArgs;
      if (dragMoveArgs) {
        that._component._dragMoveHandler(dragMoveArgs);
      }
    }
  }
  reset() {
    this._$scrollableAtPointer = null;
    this._scrollSpeed = 0;
    this._preventScroll = true;
  }
  isOutsideScrollable($scrollable, event) {
    if (!$scrollable) {
      return false;
    }
    const scrollableSize = (0, _position2.getBoundingRect)($scrollable.get(0));
    const start = scrollableSize[this._limitProps.start];
    const size = scrollableSize[this._sizeAttr];
    const mousePosition = getMousePosition(event);
    const location = this._sizeAttr === 'width' ? mousePosition.x : mousePosition.y;
    return location < start || location > start + size;
  }
}
const ScrollAnimator = _m_animator.default.inherit({
  ctor(strategy) {
    this.callBase();
    this._strategy = strategy;
  },
  _step() {
    const horizontalScrollHelper = this._strategy._horizontalScrollHelper;
    const verticalScrollHelper = this._strategy._verticalScrollHelper;
    horizontalScrollHelper && horizontalScrollHelper.scrollByStep();
    verticalScrollHelper && verticalScrollHelper.scrollByStep();
  }
});
const Draggable = _dom_component.default.inherit({
  reset: _common.noop,
  dragMove: _common.noop,
  dragEnter: _common.noop,
  dragLeave: _common.noop,
  dragEnd(sourceEvent) {
    const sourceDraggable = this._getSourceDraggable();
    sourceDraggable._fireRemoveEvent(sourceEvent);
    return (0, _deferred.Deferred)().resolve();
  },
  _fireRemoveEvent: _common.noop,
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      onDragStart: null,
      onDragMove: null,
      onDragEnd: null,
      onDragEnter: null,
      onDragLeave: null,
      onDragCancel: null,
      onCancelByEsc: false,
      onDrop: null,
      immediate: true,
      dragDirection: 'both',
      boundary: undefined,
      boundOffset: 0,
      allowMoveByClick: false,
      itemData: null,
      container: undefined,
      dragTemplate: undefined,
      contentTemplate: 'content',
      handle: '',
      filter: '',
      clone: false,
      autoScroll: true,
      scrollSpeed: 30,
      scrollSensitivity: 60,
      group: undefined,
      data: undefined
    });
  },
  _setOptionsByReference() {
    this.callBase.apply(this, arguments);
    (0, _extend.extend)(this._optionsByReference, {
      component: true,
      group: true,
      itemData: true,
      data: true
    });
  },
  _init() {
    this.callBase();
    this._attachEventHandlers();
    this._scrollAnimator = new ScrollAnimator(this);
    this._horizontalScrollHelper = new ScrollHelper('horizontal', this);
    this._verticalScrollHelper = new ScrollHelper('vertical', this);
    this._initScrollTop = 0;
    this._initScrollLeft = 0;
  },
  _normalizeCursorOffset(offset) {
    if ((0, _type.isObject)(offset)) {
      offset = {
        h: offset.x,
        v: offset.y
      };
    }
    offset = (0, _common.splitPair)(offset).map(value => parseFloat(value));
    return {
      left: offset[0],
      top: offset.length === 1 ? offset[0] : offset[1]
    };
  },
  _getNormalizedCursorOffset(offset, options) {
    if ((0, _type.isFunction)(offset)) {
      offset = offset.call(this, options);
    }
    return this._normalizeCursorOffset(offset);
  },
  _calculateElementOffset(options) {
    let elementOffset;
    let dragElementOffset;
    const {
      event
    } = options;
    const $element = (0, _renderer.default)(options.itemElement);
    const $dragElement = (0, _renderer.default)(options.dragElement);
    const isCloned = this._dragElementIsCloned();
    const cursorOffset = this.option('cursorOffset');
    let normalizedCursorOffset = {
      left: 0,
      top: 0
    };
    const currentLocate = this._initialLocate = (0, _translator.locate)($dragElement);
    if (isCloned || options.initialOffset || cursorOffset) {
      elementOffset = options.initialOffset || $element.offset();
      if (cursorOffset) {
        normalizedCursorOffset = this._getNormalizedCursorOffset(cursorOffset, options);
        if (isFinite(normalizedCursorOffset.left)) {
          elementOffset.left = event.pageX;
        }
        if (isFinite(normalizedCursorOffset.top)) {
          elementOffset.top = event.pageY;
        }
      }
      dragElementOffset = $dragElement.offset();
      elementOffset.top -= dragElementOffset.top + (normalizedCursorOffset.top || 0) - currentLocate.top;
      elementOffset.left -= dragElementOffset.left + (normalizedCursorOffset.left || 0) - currentLocate.left;
    }
    return elementOffset;
  },
  _initPosition(options) {
    const $dragElement = (0, _renderer.default)(options.dragElement);
    const elementOffset = this._calculateElementOffset(options);
    if (elementOffset) {
      this._move(elementOffset, $dragElement);
    }
    this._startPosition = (0, _translator.locate)($dragElement);
  },
  _startAnimator() {
    if (!this._scrollAnimator.inProgress()) {
      this._scrollAnimator.start();
    }
  },
  _stopAnimator() {
    this._scrollAnimator.stop();
  },
  _addWidgetPrefix(className) {
    const componentName = this.NAME;
    return (0, _inflector.dasherize)(componentName) + (className ? `-${className}` : '');
  },
  _getItemsSelector() {
    return this.option('filter') || '';
  },
  _$content() {
    const $element = this.$element();
    const $wrapper = $element.children('.dx-template-wrapper');
    return $wrapper.length ? $wrapper : $element;
  },
  _attachEventHandlers() {
    if (this.option('disabled')) {
      return;
    }
    let $element = this._$content();
    let itemsSelector = this._getItemsSelector();
    const allowMoveByClick = this.option('allowMoveByClick');
    const data = {
      direction: this.option('dragDirection'),
      immediate: this.option('immediate'),
      checkDropTarget: ($target, event) => {
        const targetGroup = this.option('group');
        const sourceGroup = this._getSourceDraggable().option('group');
        const $scrollable = this._getScrollable($target);
        if (this._verticalScrollHelper.isOutsideScrollable($scrollable, event) || this._horizontalScrollHelper.isOutsideScrollable($scrollable, event)) {
          return false;
        }
        return sourceGroup && sourceGroup === targetGroup;
      }
    };
    if (allowMoveByClick) {
      $element = this._getArea();
      _events_engine.default.on($element, POINTERDOWN_EVENT_NAME, data, this._pointerDownHandler.bind(this));
    }
    if (itemsSelector[0] === '>') {
      itemsSelector = itemsSelector.slice(1);
    }
    // @ts-expect-error
    _events_engine.default.on($element, DRAGSTART_EVENT_NAME, itemsSelector, data, this._dragStartHandler.bind(this));
    _events_engine.default.on($element, DRAG_EVENT_NAME, data, this._dragMoveHandler.bind(this));
    _events_engine.default.on($element, DRAGEND_EVENT_NAME, data, this._dragEndHandler.bind(this));
    _events_engine.default.on($element, DRAG_ENTER_EVENT_NAME, data, this._dragEnterHandler.bind(this));
    _events_engine.default.on($element, DRAGEND_LEAVE_EVENT_NAME, data, this._dragLeaveHandler.bind(this));
    if (this.option('onCancelByEsc')) {
      _events_engine.default.on($element, KEYDOWN_EVENT_NAME, this._keydownHandler.bind(this));
    }
  },
  _dragElementIsCloned() {
    return this._$dragElement && this._$dragElement.hasClass(this._addWidgetPrefix(CLONE_CLASS));
  },
  _getDragTemplateArgs($element, $container) {
    return {
      container: (0, _element.getPublicElement)($container),
      model: {
        itemData: this.option('itemData'),
        itemElement: (0, _element.getPublicElement)($element)
      }
    };
  },
  _createDragElement($element) {
    let result = $element;
    const clone = this.option('clone');
    const $container = this._getContainer();
    let template = this.option('dragTemplate');
    if (template) {
      template = this._getTemplate(template);
      result = (0, _renderer.default)('<div>').appendTo($container);
      template.render(this._getDragTemplateArgs($element, result));
    } else if (clone) {
      result = (0, _renderer.default)('<div>').appendTo($container);
      $element.clone().css({
        width: $element.css('width'),
        height: $element.css('height')
      }).appendTo(result);
    }
    return result.toggleClass(this._addWidgetPrefix(CLONE_CLASS), result.get(0) !== $element.get(0)).toggleClass('dx-rtl', this.option('rtlEnabled'));
  },
  _resetDragElement() {
    if (this._dragElementIsCloned()) {
      this._$dragElement.remove();
    } else {
      this._toggleDraggingClass(false);
    }
    this._$dragElement = null;
  },
  _resetSourceElement() {
    this._toggleDragSourceClass(false);
    this._$sourceElement = null;
  },
  _detachEventHandlers() {
    _events_engine.default.off(this._$content(), `.${DRAGGABLE}`);
    _events_engine.default.off(this._getArea(), `.${DRAGGABLE}`);
  },
  _move(position, $element) {
    (0, _translator.move)($element || this._$dragElement, position);
  },
  _getDraggableElement(e) {
    const $sourceElement = this._getSourceElement();
    if ($sourceElement) {
      return $sourceElement;
    }
    const allowMoveByClick = this.option('allowMoveByClick');
    if (allowMoveByClick) {
      return this.$element();
    }
    let $target = (0, _renderer.default)(e && e.target);
    const itemsSelector = this._getItemsSelector();
    if (itemsSelector[0] === '>') {
      const $items = this._$content().find(itemsSelector);
      if (!$items.is($target)) {
        $target = $target.closest($items);
      }
    }
    return $target;
  },
  _getSourceElement() {
    const draggable = this._getSourceDraggable();
    return draggable._$sourceElement;
  },
  _pointerDownHandler(e) {
    if ((0, _index.needSkipEvent)(e)) {
      return;
    }
    const position = {};
    const $element = this.$element();
    const dragDirection = this.option('dragDirection');
    if (dragDirection === 'horizontal' || dragDirection === 'both') {
      position.left = e.pageX - $element.offset().left + (0, _translator.locate)($element).left - (0, _size.getWidth)($element) / 2;
    }
    if (dragDirection === 'vertical' || dragDirection === 'both') {
      position.top = e.pageY - $element.offset().top + (0, _translator.locate)($element).top - (0, _size.getHeight)($element) / 2;
    }
    this._move(position, $element);
    this._getAction('onDragMove')(this._getEventArgs(e));
  },
  _isValidElement(event, $element) {
    const handle = this.option('handle');
    const $target = (0, _renderer.default)(event.originalEvent && event.originalEvent.target);
    if (handle && !$target.closest(handle).length) {
      return false;
    }
    if (!$element.length) {
      return false;
    }
    return !$element.is('.dx-state-disabled, .dx-state-disabled *');
  },
  _dragStartHandler(e) {
    const $element = this._getDraggableElement(e);
    this.dragInProgress = true;
    if (!this._isValidElement(e, $element)) {
      e.cancel = true;
      return;
    }
    if (this._$sourceElement) {
      return;
    }
    const dragStartArgs = this._getDragStartArgs(e, $element);
    this._getAction('onDragStart')(dragStartArgs);
    if (dragStartArgs.cancel) {
      e.cancel = true;
      return;
    }
    this.option('itemData', dragStartArgs.itemData);
    this._setSourceDraggable();
    this._$sourceElement = $element;
    let initialOffset = $element.offset();
    if (!this._hasClonedDraggable() && this.option('autoScroll')) {
      this._initScrollTop = this._getScrollableScrollTop();
      this._initScrollLeft = this._getScrollableScrollLeft();
      initialOffset = this._getDraggableElementOffset(initialOffset.left, initialOffset.top);
    }
    const $dragElement = this._$dragElement = this._createDragElement($element);
    this._toggleDraggingClass(true);
    this._toggleDragSourceClass(true);
    this._setGestureCoverCursor($dragElement.children());
    const isFixedPosition = $dragElement.css('position') === 'fixed';
    this._initPosition((0, _extend.extend)({}, dragStartArgs, {
      dragElement: $dragElement.get(0),
      initialOffset: isFixedPosition && initialOffset
    }));
    this._getAction('onDraggableElementShown')(_extends({}, dragStartArgs, {
      dragElement: $dragElement
    }));
    const $area = this._getArea();
    const areaOffset = this._getAreaOffset($area);
    const boundOffset = this._getBoundOffset();
    const areaWidth = (0, _size.getOuterWidth)($area);
    const areaHeight = (0, _size.getOuterHeight)($area);
    const elementWidth = (0, _size.getWidth)($dragElement);
    const elementHeight = (0, _size.getHeight)($dragElement);
    const startOffset = {
      left: $dragElement.offset().left - areaOffset.left,
      top: $dragElement.offset().top - areaOffset.top
    };
    if ($area.length) {
      e.maxLeftOffset = startOffset.left - boundOffset.left;
      e.maxRightOffset = areaWidth - startOffset.left - elementWidth - boundOffset.right;
      e.maxTopOffset = startOffset.top - boundOffset.top;
      e.maxBottomOffset = areaHeight - startOffset.top - elementHeight - boundOffset.bottom;
    }
    if (this.option('autoScroll')) {
      this._startAnimator();
    }
  },
  _getAreaOffset($area) {
    const offset = $area && _position.default.offset($area);
    return offset || {
      left: 0,
      top: 0
    };
  },
  _toggleDraggingClass(value) {
    this._$dragElement && this._$dragElement.toggleClass(this._addWidgetPrefix('dragging'), value);
  },
  _toggleDragSourceClass(value, $element) {
    const $sourceElement = $element || this._$sourceElement;
    $sourceElement && $sourceElement.toggleClass(this._addWidgetPrefix('source'), value);
  },
  _setGestureCoverCursor($element) {
    (0, _renderer.default)(`.${GESTURE_COVER_CLASS}`).css('cursor', $element.css('cursor'));
  },
  _getBoundOffset() {
    let boundOffset = this.option('boundOffset');
    if ((0, _type.isFunction)(boundOffset)) {
      boundOffset = boundOffset.call(this);
    }
    return (0, _string.quadToObject)(boundOffset);
  },
  _getArea() {
    let area = this.option('boundary');
    if ((0, _type.isFunction)(area)) {
      area = area.call(this);
    }
    return (0, _renderer.default)(area);
  },
  _getContainer() {
    let container = this.option('container');
    if (container === undefined) {
      container = (0, _view_port.value)();
    }
    return (0, _renderer.default)(container);
  },
  _getDraggableElementOffset(initialOffsetX, initialOffsetY) {
    var _this$_startPosition, _this$_startPosition2;
    const initScrollTop = this._initScrollTop;
    const initScrollLeft = this._initScrollLeft;
    const scrollTop = this._getScrollableScrollTop();
    const scrollLeft = this._getScrollableScrollLeft();
    const elementPosition = (0, _renderer.default)(this.element()).css('position');
    const isFixedPosition = elementPosition === 'fixed';
    const result = {
      left: (((_this$_startPosition = this._startPosition) === null || _this$_startPosition === void 0 ? void 0 : _this$_startPosition.left) ?? 0) + initialOffsetX,
      top: (((_this$_startPosition2 = this._startPosition) === null || _this$_startPosition2 === void 0 ? void 0 : _this$_startPosition2.top) ?? 0) + initialOffsetY
    };
    if (isFixedPosition || this._hasClonedDraggable()) {
      return result;
    }
    return {
      left: (0, _type.isNumeric)(scrollLeft) ? result.left + scrollLeft - initScrollLeft : result.left,
      top: (0, _type.isNumeric)(scrollTop) ? result.top + scrollTop - initScrollTop : result.top
    };
  },
  _hasClonedDraggable() {
    return this.option('clone') || this.option('dragTemplate');
  },
  _dragMoveHandler(e) {
    this._dragMoveArgs = e;
    if (!this._$dragElement) {
      e.cancel = true;
      return;
    }
    const offset = this._getDraggableElementOffset(e.offset.x, e.offset.y);
    this._move(offset);
    this._updateScrollable(e);
    const eventArgs = this._getEventArgs(e);
    this._getAction('onDragMove')(eventArgs);
    if (eventArgs.cancel === true) {
      return;
    }
    const targetDraggable = this._getTargetDraggable();
    targetDraggable.dragMove(e, scrollBy);
  },
  _updateScrollable(e) {
    const that = this;
    if (that.option('autoScroll')) {
      const mousePosition = getMousePosition(e);
      const allObjects = _dom_adapter.default.elementsFromPoint(mousePosition.x, mousePosition.y, this.$element().get(0));
      that._verticalScrollHelper.updateScrollable(allObjects, mousePosition);
      that._horizontalScrollHelper.updateScrollable(allObjects, mousePosition);
    }
  },
  _getScrollable($element) {
    let $scrollable;
    $element.parents().toArray().some(parent => {
      const $parent = (0, _renderer.default)(parent);
      if (this._horizontalScrollHelper.isScrollable($parent) || this._verticalScrollHelper.isScrollable($parent)) {
        $scrollable = $parent;
        return true;
      }
      return false;
    });
    return $scrollable;
  },
  _getScrollableScrollTop() {
    var _this$_getScrollable;
    return ((_this$_getScrollable = this._getScrollable((0, _renderer.default)(this.element()))) === null || _this$_getScrollable === void 0 ? void 0 : _this$_getScrollable.scrollTop()) ?? 0;
  },
  _getScrollableScrollLeft() {
    var _this$_getScrollable2;
    return ((_this$_getScrollable2 = this._getScrollable((0, _renderer.default)(this.element()))) === null || _this$_getScrollable2 === void 0 ? void 0 : _this$_getScrollable2.scrollLeft()) ?? 0;
  },
  _defaultActionArgs() {
    const args = this.callBase.apply(this, arguments);
    const component = this.option('component');
    if (component) {
      args.component = component;
      args.element = component.element();
    }
    return args;
  },
  _getEventArgs(e) {
    const sourceDraggable = this._getSourceDraggable();
    const targetDraggable = this._getTargetDraggable();
    return {
      event: e,
      itemData: sourceDraggable.option('itemData'),
      itemElement: (0, _element.getPublicElement)(sourceDraggable._$sourceElement),
      fromComponent: sourceDraggable.option('component') || sourceDraggable,
      toComponent: targetDraggable.option('component') || targetDraggable,
      fromData: sourceDraggable.option('data'),
      toData: targetDraggable.option('data')
    };
  },
  _getDragStartArgs(e, $itemElement) {
    const args = this._getEventArgs(e);
    return {
      event: args.event,
      itemData: args.itemData,
      itemElement: $itemElement,
      fromData: args.fromData
    };
  },
  _revertItemToInitialPosition() {
    !this._dragElementIsCloned() && this._move(this._initialLocate, this._$sourceElement);
  },
  _dragEndHandler(e) {
    const d = (0, _deferred.Deferred)();
    const dragEndEventArgs = this._getEventArgs(e);
    const dropEventArgs = this._getEventArgs(e);
    const targetDraggable = this._getTargetDraggable();
    let needRevertPosition = true;
    this.dragInProgress = false;
    try {
      this._getAction('onDragEnd')(dragEndEventArgs);
    } finally {
      (0, _deferred.when)((0, _deferred.fromPromise)(dragEndEventArgs.cancel)).done(cancel => {
        if (!cancel) {
          if (targetDraggable !== this) {
            targetDraggable._getAction('onDrop')(dropEventArgs);
          }
          if (!dropEventArgs.cancel) {
            needRevertPosition = false;
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            (0, _deferred.when)((0, _deferred.fromPromise)(targetDraggable.dragEnd(dragEndEventArgs))).always(d.resolve);
            return;
          }
        }
        d.resolve();
      })
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      .fail(d.resolve);
      d.done(() => {
        if (needRevertPosition) {
          this._revertItemToInitialPosition();
        }
        this._resetDragOptions(targetDraggable);
      });
    }
  },
  _isTargetOverAnotherDraggable(e) {
    const sourceDraggable = this._getSourceDraggable();
    if (this === sourceDraggable) {
      return false;
    }
    const $dragElement = sourceDraggable._$dragElement;
    const $sourceDraggableElement = sourceDraggable.$element();
    const $targetDraggableElement = this.$element();
    const mousePosition = getMousePosition(e);
    const elements = _dom_adapter.default.elementsFromPoint(mousePosition.x, mousePosition.y, this.element());
    const firstWidgetElement = elements.filter(element => {
      const $element = (0, _renderer.default)(element);
      if ($element.hasClass(this._addWidgetPrefix())) {
        return !$element.closest($dragElement).length;
      }
      return false;
    })[0];
    const $sourceElement = this._getSourceElement();
    const isTargetOverItself = firstWidgetElement === $sourceDraggableElement.get(0);
    const isTargetOverNestedDraggable = (0, _renderer.default)(firstWidgetElement).closest($sourceElement).length;
    return !firstWidgetElement || firstWidgetElement === $targetDraggableElement.get(0) && !isTargetOverItself && !isTargetOverNestedDraggable;
  },
  _dragEnterHandler(e) {
    this._fireDragEnterEvent(e);
    if (this._isTargetOverAnotherDraggable(e)) {
      this._setTargetDraggable();
    }
    const sourceDraggable = this._getSourceDraggable();
    sourceDraggable.dragEnter(e);
  },
  _dragLeaveHandler(e) {
    this._fireDragLeaveEvent(e);
    this._resetTargetDraggable();
    if (this !== this._getSourceDraggable()) {
      this.reset();
    }
    const sourceDraggable = this._getSourceDraggable();
    sourceDraggable.dragLeave(e);
  },
  _keydownHandler(e) {
    if (this.dragInProgress && e.key === 'Escape') {
      this._keydownEscapeHandler(e);
    }
  },
  _keydownEscapeHandler(e) {
    var _sourceDraggable;
    const $sourceElement = this._getSourceElement();
    if (!$sourceElement) {
      return;
    }
    const dragCancelEventArgs = this._getEventArgs(e);
    this._getAction('onDragCancel')(dragCancelEventArgs);
    if (dragCancelEventArgs.cancel) {
      return;
    }
    this.dragInProgress = false;
    (_sourceDraggable = sourceDraggable) === null || _sourceDraggable === void 0 || _sourceDraggable._toggleDraggingClass(false);
    this._detachEventHandlers();
    this._revertItemToInitialPosition();
    const targetDraggable = this._getTargetDraggable();
    this._resetDragOptions(targetDraggable);
    this._attachEventHandlers();
  },
  _getAction(name) {
    return this[`_${name}Action`] || this._createActionByOption(name);
  },
  _getAnonymousTemplateName() {
    return ANONYMOUS_TEMPLATE_NAME;
  },
  _initTemplates() {
    if (!this.option('contentTemplate')) return;
    this._templateManager.addDefaultTemplates({
      content: new _empty_template.EmptyTemplate()
    });
    this.callBase.apply(this, arguments);
  },
  _render() {
    this.callBase();
    this.$element().addClass(this._addWidgetPrefix());
    const transclude = this._templateManager.anonymousTemplateName === this.option('contentTemplate');
    const template = this._getTemplateByOption('contentTemplate');
    if (template) {
      (0, _renderer.default)(template.render({
        container: this.element(),
        transclude
      }));
    }
  },
  _optionChanged(args) {
    const {
      name
    } = args;
    switch (name) {
      case 'onDragStart':
      case 'onDragMove':
      case 'onDragEnd':
      case 'onDrop':
      case 'onDragEnter':
      case 'onDragLeave':
      case 'onDragCancel':
      case 'onDraggableElementShown':
        this[`_${name}Action`] = this._createActionByOption(name);
        break;
      case 'dragTemplate':
      case 'contentTemplate':
      case 'container':
      case 'clone':
        break;
      case 'allowMoveByClick':
      case 'dragDirection':
      case 'disabled':
      case 'boundary':
      case 'filter':
      case 'immediate':
        this._resetDragElement();
        this._detachEventHandlers();
        this._attachEventHandlers();
        break;
      case 'onCancelByEsc':
        this._keydownHandler();
        break;
      case 'autoScroll':
        this._verticalScrollHelper.reset();
        this._horizontalScrollHelper.reset();
        break;
      case 'scrollSensitivity':
      case 'scrollSpeed':
      case 'boundOffset':
      case 'handle':
      case 'group':
      case 'data':
      case 'itemData':
        break;
      default:
        this.callBase(args);
    }
  },
  _getTargetDraggable() {
    return targetDraggable || this;
  },
  _getSourceDraggable() {
    return sourceDraggable || this;
  },
  _setTargetDraggable() {
    const currentGroup = this.option('group');
    const sourceDraggable = this._getSourceDraggable();
    if (currentGroup && currentGroup === sourceDraggable.option('group')) {
      targetDraggable = this;
    }
  },
  _setSourceDraggable() {
    sourceDraggable = this;
  },
  _resetSourceDraggable() {
    sourceDraggable = null;
  },
  _resetTargetDraggable() {
    targetDraggable = null;
  },
  _resetDragOptions(targetDraggable) {
    this.reset();
    targetDraggable.reset();
    this._stopAnimator();
    this._horizontalScrollHelper.reset();
    this._verticalScrollHelper.reset();
    this._resetDragElement();
    this._resetSourceElement();
    this._resetTargetDraggable();
    this._resetSourceDraggable();
  },
  _dispose() {
    this.callBase();
    this._detachEventHandlers();
    this._resetDragElement();
    this._resetTargetDraggable();
    this._resetSourceDraggable();
    this._$sourceElement = null;
    this._stopAnimator();
  },
  _fireDragEnterEvent(sourceEvent) {
    const args = this._getEventArgs(sourceEvent);
    this._getAction('onDragEnter')(args);
  },
  _fireDragLeaveEvent(sourceEvent) {
    const args = this._getEventArgs(sourceEvent);
    this._getAction('onDragLeave')(args);
  }
});
(0, _component_registrator.default)(DRAGGABLE, Draggable);
var _default = exports.default = Draggable;