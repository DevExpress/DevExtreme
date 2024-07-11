"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fx = _interopRequireDefault(require("../animation/fx"));
var _translator = require("../animation/translator");
var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));
var _element = require("../core/element");
var _renderer = _interopRequireDefault(require("../core/renderer"));
var _deferred = require("../core/utils/deferred");
var _extend = require("../core/utils/extend");
var _position = require("../core/utils/position");
var _size = require("../core/utils/size");
var _window = require("../core/utils/window");
var _events_engine = _interopRequireDefault(require("../events/core/events_engine"));
var _m_draggable = _interopRequireDefault(require("./m_draggable"));
var _type = require("../core/utils/type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();
const SORTABLE = 'dxSortable';
const PLACEHOLDER_CLASS = 'placeholder';
const CLONE_CLASS = 'clone';
const isElementVisible = itemElement => (0, _renderer.default)(itemElement).is(':visible');
const animate = (element, config) => {
  var _config$to, _config$to2;
  if (!element) return;
  const left = ((_config$to = config.to) === null || _config$to === void 0 ? void 0 : _config$to.left) || 0;
  const top = ((_config$to2 = config.to) === null || _config$to2 === void 0 ? void 0 : _config$to2.top) || 0;
  element.style.transform = `translate(${left}px,${top}px)`;
  element.style.transition = _fx.default.off ? '' : `transform ${config.duration}ms ${config.easing}`;
};
const stopAnimation = element => {
  if (!element) return;
  element.style.transform = '';
  element.style.transition = '';
};
function getScrollableBoundary($scrollable) {
  const offset = $scrollable.offset();
  const {
    style
  } = $scrollable[0];
  const paddingLeft = parseFloat(style.paddingLeft) || 0;
  const paddingRight = parseFloat(style.paddingRight) || 0;
  const paddingTop = parseFloat(style.paddingTop) || 0;
  // use clientWidth, because vertical scrollbar reduces content width
  const width = $scrollable[0].clientWidth - (paddingLeft + paddingRight);
  const height = (0, _size.getHeight)($scrollable);
  const left = offset.left + paddingLeft;
  const top = offset.top + paddingTop;
  return {
    left,
    right: left + width,
    top,
    bottom: top + height
  };
}
const Sortable = _m_draggable.default.inherit({
  _init() {
    this.callBase();
    this._sourceScrollHandler = this._handleSourceScroll.bind(this);
    this._sourceScrollableInfo = null;
  },
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      clone: true,
      filter: '> *',
      itemOrientation: 'vertical',
      dropFeedbackMode: 'push',
      allowDropInsideItem: false,
      allowReordering: true,
      moveItemOnDrop: false,
      onDragChange: null,
      onAdd: null,
      onRemove: null,
      onReorder: null,
      onPlaceholderPrepared: null,
      animation: {
        type: 'slide',
        duration: 300,
        easing: 'ease'
      },
      fromIndex: null,
      toIndex: null,
      dropInsideItem: false,
      itemPoints: null,
      fromIndexOffset: 0,
      offset: 0,
      autoUpdate: false,
      draggableElementSize: 0
    });
  },
  reset() {
    this.option({
      dropInsideItem: false,
      toIndex: null,
      fromIndex: null,
      itemPoints: null,
      fromIndexOffset: 0,
      draggableElementSize: 0
    });
    if (this._$placeholderElement) {
      this._$placeholderElement.remove();
    }
    this._$placeholderElement = null;
    if (!this._isIndicateMode() && this._$modifiedItem) {
      this._$modifiedItem.css('marginBottom', this._modifiedItemMargin);
      this._$modifiedItem = null;
    }
  },
  _getPrevVisibleItem(items, index) {
    return items.slice(0, index).reverse().filter(isElementVisible)[0];
  },
  _dragStartHandler(e) {
    this.callBase.apply(this, arguments);
    if (e.cancel === true) {
      return;
    }
    const $sourceElement = this._getSourceElement();
    this._updateItemPoints();
    this._subscribeToSourceScroll(e);
    this.option('fromIndex', this._getElementIndex($sourceElement));
    this.option('fromIndexOffset', this.option('offset'));
  },
  _subscribeToSourceScroll(e) {
    const $scrollable = this._getScrollable((0, _renderer.default)(e.target));
    if ($scrollable) {
      this._sourceScrollableInfo = {
        element: $scrollable,
        scrollLeft: $scrollable.scrollLeft(),
        scrollTop: $scrollable.scrollTop()
      };
      _events_engine.default.off($scrollable, 'scroll', this._sourceScrollHandler);
      _events_engine.default.on($scrollable, 'scroll', this._sourceScrollHandler);
    }
  },
  _unsubscribeFromSourceScroll() {
    if (this._sourceScrollableInfo) {
      _events_engine.default.off(this._sourceScrollableInfo.element, 'scroll', this._sourceScrollHandler);
      this._sourceScrollableInfo = null;
    }
  },
  _handleSourceScroll(e) {
    const sourceScrollableInfo = this._sourceScrollableInfo;
    if (sourceScrollableInfo) {
      ['scrollLeft', 'scrollTop'].forEach(scrollProp => {
        if (e.target[scrollProp] !== sourceScrollableInfo[scrollProp]) {
          const scrollBy = e.target[scrollProp] - sourceScrollableInfo[scrollProp];
          this._correctItemPoints(scrollBy);
          this._movePlaceholder();
          sourceScrollableInfo[scrollProp] = e.target[scrollProp];
        }
      });
    }
  },
  _dragEnterHandler(e) {
    this.callBase.apply(this, arguments);
    if (this === this._getSourceDraggable()) {
      return;
    }
    this._subscribeToSourceScroll(e);
    this._updateItemPoints();
    this.option('fromIndex', -1);
    if (!this._isIndicateMode()) {
      const itemPoints = this.option('itemPoints');
      const lastItemPoint = itemPoints[itemPoints.length - 1];
      if (lastItemPoint) {
        const $element = this.$element();
        const $sourceElement = this._getSourceElement();
        const isVertical = this._isVerticalOrientation();
        const sourceElementSize = isVertical ? (0, _size.getOuterHeight)($sourceElement, true) : (0, _size.getOuterWidth)($sourceElement, true);
        const scrollSize = $element.get(0)[isVertical ? 'scrollHeight' : 'scrollWidth'];
        const scrollPosition = $element.get(0)[isVertical ? 'scrollTop' : 'scrollLeft'];
        const positionProp = isVertical ? 'top' : 'left';
        const lastPointPosition = lastItemPoint[positionProp];
        const elementPosition = $element.offset()[positionProp];
        const freeSize = elementPosition + scrollSize - scrollPosition - lastPointPosition;
        if (freeSize < sourceElementSize) {
          if (isVertical) {
            const items = this._getItems();
            const $lastItem = (0, _renderer.default)(this._getPrevVisibleItem(items));
            this._$modifiedItem = $lastItem;
            this._modifiedItemMargin = $lastItem.get(0).style.marginBottom;
            $lastItem.css('marginBottom', sourceElementSize - freeSize);
            const $sortable = $lastItem.closest('.dx-sortable');
            const sortable = $sortable.data('dxScrollable') || $sortable.data('dxScrollView');
            sortable && sortable.update();
          }
        }
      }
    }
  },
  _dragLeaveHandler() {
    this.callBase.apply(this, arguments);
    if (this !== this._getSourceDraggable()) {
      this._unsubscribeFromSourceScroll();
    }
  },
  dragEnter() {
    if (this !== this._getTargetDraggable()) {
      this.option('toIndex', -1);
    }
  },
  dragLeave() {
    if (this !== this._getTargetDraggable()) {
      this.option('toIndex', this.option('fromIndex'));
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _allowDrop(event) {
    const targetDraggable = this._getTargetDraggable();
    const $targetDraggable = targetDraggable.$element();
    const $scrollable = this._getScrollable($targetDraggable);
    if ($scrollable) {
      const {
        left,
        right,
        top,
        bottom
      } = getScrollableBoundary($scrollable);
      const toIndex = this.option('toIndex');
      const itemPoints = this.option('itemPoints');
      const itemPoint = itemPoints === null || itemPoints === void 0 ? void 0 : itemPoints.filter(item => item.index === toIndex)[0];
      if (itemPoint && itemPoint.top !== undefined) {
        const isVertical = this._isVerticalOrientation();
        if (isVertical) {
          return top <= Math.ceil(itemPoint.top) && Math.floor(itemPoint.top) <= bottom;
        }
        return left <= Math.ceil(itemPoint.left) && Math.floor(itemPoint.left) <= right;
      }
    }
    return true;
  },
  dragEnd(sourceEvent) {
    this._unsubscribeFromSourceScroll();
    const $sourceElement = this._getSourceElement();
    const sourceDraggable = this._getSourceDraggable();
    const isSourceDraggable = sourceDraggable.NAME !== this.NAME;
    const toIndex = this.option('toIndex');
    const {
      event
    } = sourceEvent;
    const allowDrop = this._allowDrop(event);
    if (toIndex !== null && toIndex >= 0 && allowDrop) {
      let cancelAdd;
      let cancelRemove;
      if (sourceDraggable !== this) {
        cancelAdd = this._fireAddEvent(event);
        if (!cancelAdd) {
          cancelRemove = this._fireRemoveEvent(event);
        }
      }
      if (isSourceDraggable) {
        (0, _translator.resetPosition)($sourceElement);
      }
      if (this.option('moveItemOnDrop')) {
        !cancelAdd && this._moveItem($sourceElement, toIndex, cancelRemove);
      }
      if (sourceDraggable === this) {
        return this._fireReorderEvent(event);
      }
    }
    return (0, _deferred.Deferred)().resolve();
  },
  dragMove(e) {
    const itemPoints = this.option('itemPoints');
    if (!itemPoints) {
      return;
    }
    const isVertical = this._isVerticalOrientation();
    const axisName = isVertical ? 'top' : 'left';
    const cursorPosition = isVertical ? e.pageY : e.pageX;
    const rtlEnabled = this.option('rtlEnabled');
    let itemPoint;
    for (let i = itemPoints.length - 1; i >= 0; i--) {
      const centerPosition = itemPoints[i + 1] && (itemPoints[i][axisName] + itemPoints[i + 1][axisName]) / 2;
      if ((!isVertical && rtlEnabled ? cursorPosition > centerPosition : centerPosition > cursorPosition) || centerPosition === undefined) {
        itemPoint = itemPoints[i];
      } else {
        break;
      }
    }
    if (itemPoint) {
      this._updatePlaceholderPosition(e, itemPoint);
      if (this._verticalScrollHelper.isScrolling() && this._isIndicateMode()) {
        this._movePlaceholder();
      }
    }
  },
  _isIndicateMode() {
    return this.option('dropFeedbackMode') === 'indicate' || this.option('allowDropInsideItem');
  },
  _createPlaceholder() {
    let $placeholderContainer;
    if (this._isIndicateMode()) {
      $placeholderContainer = (0, _renderer.default)('<div>').addClass(this._addWidgetPrefix(PLACEHOLDER_CLASS)).insertBefore(this._getSourceDraggable()._$dragElement);
    }
    this._$placeholderElement = $placeholderContainer;
    return $placeholderContainer;
  },
  _getItems() {
    const itemsSelector = this._getItemsSelector();
    return this._$content().find(itemsSelector).not(`.${this._addWidgetPrefix(PLACEHOLDER_CLASS)}`).not(`.${this._addWidgetPrefix(CLONE_CLASS)}`).toArray();
  },
  _allowReordering() {
    const sourceDraggable = this._getSourceDraggable();
    const targetDraggable = this._getTargetDraggable();
    return sourceDraggable !== targetDraggable || this.option('allowReordering');
  },
  _isValidPoint(visibleIndex, draggableVisibleIndex, dropInsideItem) {
    const allowDropInsideItem = this.option('allowDropInsideItem');
    const allowReordering = dropInsideItem || this._allowReordering();
    if (!allowReordering && (visibleIndex !== 0 || !allowDropInsideItem)) {
      return false;
    }
    if (!this._isIndicateMode()) {
      return true;
    }
    return draggableVisibleIndex === -1 || visibleIndex !== draggableVisibleIndex && (dropInsideItem || visibleIndex !== draggableVisibleIndex + 1);
  },
  _getItemPoints() {
    const that = this;
    let result = [];
    let $item;
    let offset;
    let itemWidth;
    const rtlEnabled = that.option('rtlEnabled');
    const isVertical = that._isVerticalOrientation();
    const itemElements = that._getItems();
    const visibleItemElements = itemElements.filter(isElementVisible);
    const visibleItemCount = visibleItemElements.length;
    const $draggableItem = this._getDraggableElement();
    const draggableVisibleIndex = visibleItemElements.indexOf($draggableItem.get(0));
    if (visibleItemCount) {
      for (let i = 0; i <= visibleItemCount; i++) {
        const needCorrectLeftPosition = !isVertical && rtlEnabled ^ i === visibleItemCount;
        const needCorrectTopPosition = isVertical && i === visibleItemCount;
        if (i < visibleItemCount) {
          $item = (0, _renderer.default)(visibleItemElements[i]);
          offset = $item.offset();
          itemWidth = (0, _size.getOuterWidth)($item);
        }
        result.push({
          dropInsideItem: false,
          left: offset.left + (needCorrectLeftPosition ? itemWidth : 0),
          top: offset.top + (needCorrectTopPosition ? result[i - 1].height : 0),
          index: i === visibleItemCount ? itemElements.length : itemElements.indexOf($item.get(0)),
          $item,
          width: (0, _size.getOuterWidth)($item),
          height: (0, _size.getOuterHeight)($item),
          isValid: that._isValidPoint(i, draggableVisibleIndex)
        });
      }
      if (this.option('allowDropInsideItem')) {
        const points = result;
        result = [];
        for (let i = 0; i < points.length; i++) {
          result.push(points[i]);
          if (points[i + 1]) {
            result.push((0, _extend.extend)({}, points[i], {
              dropInsideItem: true,
              top: Math.floor((points[i].top + points[i + 1].top) / 2),
              left: Math.floor((points[i].left + points[i + 1].left) / 2),
              isValid: this._isValidPoint(i, draggableVisibleIndex, true)
            }));
          }
        }
      }
    } else {
      result.push({
        dropInsideItem: false,
        index: 0,
        isValid: true
      });
    }
    return result;
  },
  _updateItemPoints(forceUpdate) {
    if (forceUpdate || this.option('autoUpdate') || !this.option('itemPoints')) {
      this.option('itemPoints', this._getItemPoints());
    }
  },
  _correctItemPoints(scrollBy) {
    const itemPoints = this.option('itemPoints');
    if (scrollBy && itemPoints && !this.option('autoUpdate')) {
      const isVertical = this._isVerticalOrientation();
      const positionPropName = isVertical ? 'top' : 'left';
      itemPoints.forEach(itemPoint => {
        itemPoint[positionPropName] -= scrollBy;
      });
    }
  },
  _getElementIndex($itemElement) {
    return this._getItems().indexOf($itemElement.get(0));
  },
  _getDragTemplateArgs($element) {
    const args = this.callBase.apply(this, arguments);
    args.model.fromIndex = this._getElementIndex($element);
    return args;
  },
  _togglePlaceholder(value) {
    this._$placeholderElement && this._$placeholderElement.toggle(value);
  },
  _isVerticalOrientation() {
    return this.option('itemOrientation') === 'vertical';
  },
  _normalizeToIndex(toIndex, skipOffsetting) {
    const isAnotherDraggable = this._getSourceDraggable() !== this._getTargetDraggable();
    const fromIndex = this._getActualFromIndex();
    if (toIndex === null) {
      return fromIndex;
    }
    return Math.max(isAnotherDraggable || fromIndex >= toIndex || skipOffsetting ? toIndex : toIndex - 1, 0);
  },
  _updatePlaceholderPosition(e, itemPoint) {
    const sourceDraggable = this._getSourceDraggable();
    const toIndex = this._normalizeToIndex(itemPoint.index, itemPoint.dropInsideItem);
    const eventArgs = (0, _extend.extend)(this._getEventArgs(e), {
      toIndex,
      dropInsideItem: itemPoint.dropInsideItem
    });
    itemPoint.isValid && this._getAction('onDragChange')(eventArgs);
    if (eventArgs.cancel || !itemPoint.isValid) {
      if (!itemPoint.isValid) {
        this.option({
          dropInsideItem: false,
          toIndex: null
        });
      }
      return;
    }
    this.option({
      dropInsideItem: itemPoint.dropInsideItem,
      toIndex: itemPoint.index
    });
    this._getAction('onPlaceholderPrepared')((0, _extend.extend)(this._getEventArgs(e), {
      placeholderElement: (0, _element.getPublicElement)(this._$placeholderElement),
      dragElement: (0, _element.getPublicElement)(sourceDraggable._$dragElement)
    }));
    this._updateItemPoints();
  },
  _makeWidthCorrection($item, width) {
    this._$scrollable = this._getScrollable($item);
    if (this._$scrollable) {
      const scrollableWidth = (0, _size.getWidth)(this._$scrollable);
      const overflowLeft = this._$scrollable.offset().left - $item.offset().left;
      const overflowRight = (0, _size.getOuterWidth)($item) - overflowLeft - scrollableWidth;
      if (overflowLeft > 0) {
        width -= overflowLeft;
      }
      if (overflowRight > 0) {
        width -= overflowRight;
      }
    }
    return width;
  },
  _updatePlaceholderSizes($placeholderElement, itemElement) {
    const that = this;
    const dropInsideItem = that.option('dropInsideItem');
    const $item = (0, _renderer.default)(itemElement);
    const isVertical = that._isVerticalOrientation();
    let width = '';
    let height = '';
    $placeholderElement.toggleClass(that._addWidgetPrefix('placeholder-inside'), dropInsideItem);
    if (isVertical || dropInsideItem) {
      width = (0, _size.getOuterWidth)($item);
    }
    if (!isVertical || dropInsideItem) {
      height = (0, _size.getOuterHeight)($item);
    }
    width = that._makeWidthCorrection($item, width);
    $placeholderElement.css({
      width,
      height
    });
  },
  _moveItem($itemElement, index, cancelRemove) {
    let $prevTargetItemElement;
    const $itemElements = this._getItems();
    const $targetItemElement = $itemElements[index];
    const sourceDraggable = this._getSourceDraggable();
    if (cancelRemove) {
      $itemElement = $itemElement.clone();
      sourceDraggable._toggleDragSourceClass(false, $itemElement);
    }
    if (!$targetItemElement) {
      $prevTargetItemElement = $itemElements[index - 1];
    }
    this._moveItemCore($itemElement, $targetItemElement, $prevTargetItemElement);
  },
  _moveItemCore($targetItem, item, prevItem) {
    if (!item && !prevItem) {
      $targetItem.appendTo(this.$element());
    } else if (prevItem) {
      $targetItem.insertAfter((0, _renderer.default)(prevItem));
    } else {
      $targetItem.insertBefore((0, _renderer.default)(item));
    }
  },
  _getDragStartArgs(e, $itemElement) {
    return (0, _extend.extend)(this.callBase.apply(this, arguments), {
      fromIndex: this._getElementIndex($itemElement)
    });
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getEventArgs(e) {
    const sourceDraggable = this._getSourceDraggable();
    const targetDraggable = this._getTargetDraggable();
    const dropInsideItem = targetDraggable.option('dropInsideItem');
    return (0, _extend.extend)(this.callBase.apply(this, arguments), {
      fromIndex: sourceDraggable.option('fromIndex'),
      toIndex: this._normalizeToIndex(targetDraggable.option('toIndex'), dropInsideItem),
      dropInsideItem
    });
  },
  _optionChanged(args) {
    const {
      name
    } = args;
    switch (name) {
      case 'onDragChange':
      case 'onPlaceholderPrepared':
      case 'onAdd':
      case 'onRemove':
      case 'onReorder':
        this[`_${name}Action`] = this._createActionByOption(name);
        break;
      case 'itemOrientation':
      case 'allowDropInsideItem':
      case 'moveItemOnDrop':
      case 'dropFeedbackMode':
      case 'itemPoints':
      case 'animation':
      case 'allowReordering':
      case 'fromIndexOffset':
      case 'offset':
      case 'draggableElementSize':
      case 'autoUpdate':
        break;
      case 'fromIndex':
        [false, true].forEach(isDragSource => {
          const fromIndex = isDragSource ? args.value : args.previousValue;
          if (fromIndex !== null) {
            const $fromElement = (0, _renderer.default)(this._getItems()[fromIndex]);
            this._toggleDragSourceClass(isDragSource, $fromElement);
          }
        });
        break;
      case 'dropInsideItem':
        this._optionChangedDropInsideItem(args);
        break;
      case 'toIndex':
        this._optionChangedToIndex(args);
        break;
      default:
        this.callBase(args);
    }
  },
  _optionChangedDropInsideItem() {
    if (this._isIndicateMode() && this._$placeholderElement) {
      this._movePlaceholder();
    }
  },
  _isPositionVisible(position) {
    const $element = this.$element();
    let scrollContainer;
    if ($element.css('overflow') !== 'hidden') {
      scrollContainer = $element.get(0);
    } else {
      $element.parents().each(function () {
        // @ts-expect-error
        if ((0, _renderer.default)(this).css('overflow') !== 'visible') {
          scrollContainer = this;
          return false;
        }
        return undefined;
      });
    }
    if (scrollContainer) {
      const clientRect = (0, _position.getBoundingRect)(scrollContainer);
      const isVerticalOrientation = this._isVerticalOrientation();
      const start = isVerticalOrientation ? 'top' : 'left';
      const end = isVerticalOrientation ? 'bottom' : 'right';
      const pageOffset = isVerticalOrientation ? window.pageYOffset : window.pageXOffset;
      if (position[start] < clientRect[start] + pageOffset || position[start] > clientRect[end] + pageOffset) {
        return false;
      }
    }
    return true;
  },
  _optionChangedToIndex(args) {
    const toIndex = args.value;
    if (this._isIndicateMode()) {
      const showPlaceholder = toIndex !== null && toIndex >= 0;
      this._togglePlaceholder(showPlaceholder);
      if (showPlaceholder) {
        this._movePlaceholder();
      }
    } else {
      this._moveItems(args.previousValue, args.value, args.fullUpdate);
    }
  },
  update() {
    if (this.option('fromIndex') === null && this.option('toIndex') === null) {
      return;
    }
    this._updateItemPoints(true);
    this._updateDragSourceClass();
    const toIndex = this.option('toIndex');
    this._optionChangedToIndex({
      value: toIndex,
      fullUpdate: true
    });
  },
  _updateDragSourceClass() {
    const fromIndex = this._getActualFromIndex();
    const $fromElement = (0, _renderer.default)(this._getItems()[fromIndex]);
    if ($fromElement.length) {
      this._$sourceElement = $fromElement;
      this._toggleDragSourceClass(true, $fromElement);
    }
  },
  _makeLeftCorrection(left) {
    const that = this;
    const $scrollable = that._$scrollable;
    if ($scrollable && that._isVerticalOrientation()) {
      const overflowLeft = $scrollable.offset().left - left;
      if (overflowLeft > 0) {
        left += overflowLeft;
      }
    }
    return left;
  },
  _movePlaceholder() {
    const that = this;
    const $placeholderElement = that._$placeholderElement || that._createPlaceholder();
    if (!$placeholderElement) {
      return;
    }
    const items = that._getItems();
    const toIndex = that.option('toIndex');
    const isVerticalOrientation = that._isVerticalOrientation();
    const rtlEnabled = this.option('rtlEnabled');
    const dropInsideItem = that.option('dropInsideItem');
    let position = null;
    let itemElement = items[toIndex];
    if (itemElement) {
      const $itemElement = (0, _renderer.default)(itemElement);
      position = $itemElement.offset();
      if (!isVerticalOrientation && rtlEnabled && !dropInsideItem) {
        position.left += (0, _size.getOuterWidth)($itemElement, true);
      }
    } else {
      const prevVisibleItemElement = itemElement = this._getPrevVisibleItem(items, toIndex);
      if (prevVisibleItemElement) {
        position = (0, _renderer.default)(prevVisibleItemElement).offset();
        if (isVerticalOrientation) {
          position.top += (0, _size.getOuterHeight)(prevVisibleItemElement, true);
        } else if (!rtlEnabled) {
          position.left += (0, _size.getOuterWidth)(prevVisibleItemElement, true);
        }
      }
    }
    that._updatePlaceholderSizes($placeholderElement, itemElement);
    if (position && !that._isPositionVisible(position)) {
      position = null;
    }
    if (position) {
      const isLastVerticalPosition = isVerticalOrientation && toIndex === items.length;
      const outerPlaceholderHeight = (0, _size.getOuterHeight)($placeholderElement);
      position.left = that._makeLeftCorrection(position.left);
      position.top = isLastVerticalPosition && position.top >= outerPlaceholderHeight ? position.top - outerPlaceholderHeight : position.top;
      that._move(position, $placeholderElement);
    }
    $placeholderElement.toggle(!!position);
  },
  _getPositions(items, elementSize, fromIndex, toIndex) {
    const positions = [];
    for (let i = 0; i < items.length; i++) {
      let position = 0;
      if (toIndex === null || fromIndex === null) {
        positions.push(position);
        continue;
      }
      if (fromIndex === -1) {
        if (i >= toIndex) {
          position = elementSize;
        }
      } else if (toIndex === -1) {
        if (i > fromIndex) {
          position = -elementSize;
        }
      } else if (fromIndex < toIndex) {
        if (i > fromIndex && i < toIndex) {
          position = -elementSize;
        }
      } else if (fromIndex > toIndex) {
        if (i >= toIndex && i < fromIndex) {
          position = elementSize;
        }
      }
      positions.push(position);
    }
    return positions;
  },
  _getDraggableElementSize(isVerticalOrientation) {
    const $draggableItem = this._getDraggableElement();
    let size = this.option('draggableElementSize');
    if (!size) {
      size = isVerticalOrientation ? ((0, _size.getOuterHeight)($draggableItem) + (0, _size.getOuterHeight)($draggableItem, true)) / 2 : ((0, _size.getOuterWidth)($draggableItem) + (0, _size.getOuterWidth)($draggableItem, true)) / 2;
      if (!this.option('autoUpdate')) {
        this.option('draggableElementSize', size);
      }
    }
    return size;
  },
  _getActualFromIndex() {
    const {
      fromIndex,
      fromIndexOffset,
      offset
    } = this.option();
    return fromIndex == null ? null : fromIndex + fromIndexOffset - offset;
  },
  _moveItems(prevToIndex, toIndex, fullUpdate) {
    const fromIndex = this._getActualFromIndex();
    const isVerticalOrientation = this._isVerticalOrientation();
    const positionPropName = isVerticalOrientation ? 'top' : 'left';
    const elementSize = this._getDraggableElementSize(isVerticalOrientation);
    const items = this._getItems();
    const prevPositions = this._getPositions(items, elementSize, fromIndex, prevToIndex);
    const positions = this._getPositions(items, elementSize, fromIndex, toIndex);
    const animationConfig = this.option('animation');
    const rtlEnabled = this.option('rtlEnabled');
    for (let i = 0; i < items.length; i++) {
      const itemElement = items[i];
      const prevPosition = prevPositions[i];
      const position = positions[i];
      if (toIndex === null || fromIndex === null) {
        stopAnimation(itemElement);
      } else if (prevPosition !== position || fullUpdate && (0, _type.isDefined)(position)) {
        animate(itemElement, (0, _extend.extend)({}, animationConfig, {
          to: {
            [positionPropName]: !isVerticalOrientation && rtlEnabled ? -position : position
          }
        }));
      }
    }
  },
  _toggleDragSourceClass(value, $element) {
    const $sourceElement = $element || this._$sourceElement;
    this.callBase.apply(this, arguments);
    if (!this._isIndicateMode()) {
      $sourceElement && $sourceElement.toggleClass(this._addWidgetPrefix('source-hidden'), value);
    }
  },
  _dispose() {
    this.reset();
    this.callBase();
  },
  _fireAddEvent(sourceEvent) {
    const args = this._getEventArgs(sourceEvent);
    this._getAction('onAdd')(args);
    return args.cancel;
  },
  _fireRemoveEvent(sourceEvent) {
    const sourceDraggable = this._getSourceDraggable();
    const args = this._getEventArgs(sourceEvent);
    sourceDraggable._getAction('onRemove')(args);
    return args.cancel;
  },
  _fireReorderEvent(sourceEvent) {
    const args = this._getEventArgs(sourceEvent);
    this._getAction('onReorder')(args);
    return args.promise || (0, _deferred.Deferred)().resolve();
  }
});
(0, _component_registrator.default)(SORTABLE, Sortable);
var _default = exports.default = Sortable;