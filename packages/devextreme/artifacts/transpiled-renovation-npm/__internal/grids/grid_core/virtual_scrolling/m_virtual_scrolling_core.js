"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.VirtualScrollController = void 0;
exports.subscribeToExternalScrollers = subscribeToExternalScrollers;
var _position = _interopRequireDefault(require("../../../../animation/position"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _browser = _interopRequireDefault(require("../../../../core/utils/browser"));
var _callbacks = _interopRequireDefault(require("../../../../core/utils/callbacks"));
var _deferred = require("../../../../core/utils/deferred");
var _iterator = require("../../../../core/utils/iterator");
var _type = require("../../../../core/utils/type");
var _window = require("../../../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _m_virtual_data_loader = require("../virtual_data_loader/m_virtual_data_loader");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const SCROLLING_MODE_INFINITE = 'infinite';
const SCROLLING_MODE_VIRTUAL = 'virtual';
const LEGACY_SCROLLING_MODE = 'scrolling.legacyMode';
const isVirtualMode = that => that.option('scrolling.mode') === SCROLLING_MODE_VIRTUAL || that._isVirtual;
const isAppendMode = that => that.option('scrolling.mode') === SCROLLING_MODE_INFINITE && !that._isVirtual;
function subscribeToExternalScrollers($element, scrollChangedHandler, $targetElement) {
  let $scrollElement;
  const scrollableArray = [];
  const scrollToArray = [];
  const disposeArray = [];
  $targetElement = $targetElement || $element;
  function getElementOffset(scrollable) {
    const $scrollableElement = scrollable.element ? scrollable.$element() : scrollable;
    // @ts-expect-error
    const scrollableOffset = _position.default.offset($scrollableElement);
    if (!scrollableOffset) {
      return $element.offset().top;
    }
    return scrollable.scrollTop() - (scrollableOffset.top - $element.offset().top);
  }
  function createWindowScrollHandler(scrollable) {
    return function () {
      let scrollTop = scrollable.scrollTop() - getElementOffset(scrollable);
      scrollTop = scrollTop > 0 ? scrollTop : 0;
      scrollChangedHandler(scrollTop);
    };
  }
  const widgetScrollStrategy = {
    on(scrollable, eventName, handler) {
      scrollable.on('scroll', handler);
    },
    off(scrollable, eventName, handler) {
      scrollable.off('scroll', handler);
    }
  };
  function subscribeToScrollEvents($scrollElement) {
    const isDocument = $scrollElement.get(0).nodeName === '#document';
    // @ts-expect-error
    const isElement = $scrollElement.get(0).nodeType === (0, _window.getWindow)().Node.ELEMENT_NODE;
    let scrollable = $scrollElement.data('dxScrollable');
    let eventsStrategy = widgetScrollStrategy;
    if (!scrollable) {
      scrollable = isDocument && (0, _renderer.default)((0, _window.getWindow)()) || isElement && $scrollElement.css('overflowY') === 'auto' && $scrollElement;
      eventsStrategy = _events_engine.default;
      if (!scrollable) return;
    }
    const handler = createWindowScrollHandler(scrollable);
    eventsStrategy.on(scrollable, 'scroll', handler);
    scrollToArray.push(pos => {
      const topOffset = getElementOffset(scrollable);
      const scrollMethod = scrollable.scrollTo ? 'scrollTo' : 'scrollTop';
      if (pos - topOffset >= 0) {
        scrollable[scrollMethod](pos + topOffset);
      }
    });
    scrollableArray.push(scrollable);
    disposeArray.push(() => {
      eventsStrategy.off(scrollable, 'scroll', handler);
    });
  }
  const getScrollElementParent = $element => (0, _renderer.default)($element.get(0).parentNode ?? $element.get(0).host);
  for ($scrollElement = $targetElement.parent(); $scrollElement.length; $scrollElement = getScrollElementParent($scrollElement)) {
    subscribeToScrollEvents($scrollElement);
  }
  return {
    scrollTo(pos) {
      (0, _iterator.each)(scrollToArray, (_, scrollTo) => {
        scrollTo(pos);
      });
    },
    dispose() {
      (0, _iterator.each)(disposeArray, (_, dispose) => {
        dispose();
      });
    }
  };
}
class VirtualScrollController {
  constructor(component, dataOptions, isVirtual) {
    this._dataOptions = dataOptions;
    this.component = component;
    this._viewportSize = component.option(LEGACY_SCROLLING_MODE) === false ? 15 : 0;
    this._viewportItemSize = 20;
    this._viewportItemIndex = 0;
    this._position = 0;
    this._isScrollingBack = false;
    this._contentSize = 0;
    this._itemSizes = {};
    this._sizeRatio = 1;
    this._isVirtual = isVirtual;
    this.positionChanged = (0, _callbacks.default)();
    this._dataLoader = new _m_virtual_data_loader.VirtualDataLoader(this, this._dataOptions);
  }
  getItemSizes() {
    return this._itemSizes;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  option(name, value) {
    return this.component.option.apply(this.component, arguments);
  }
  isVirtual() {
    return this._isVirtual;
  }
  virtualItemsCount() {
    if (isVirtualMode(this)) {
      const dataOptions = this._dataOptions;
      const totalItemsCount = dataOptions.totalItemsCount();
      if (this.option(LEGACY_SCROLLING_MODE) === false && totalItemsCount !== -1) {
        const viewportParams = this.getViewportParams();
        const loadedOffset = dataOptions.loadedOffset();
        const loadedItemCount = dataOptions.loadedItemCount();
        const skip = Math.max(viewportParams.skip, loadedOffset);
        const take = Math.min(viewportParams.take, loadedItemCount);
        const endItemsCount = Math.max(totalItemsCount - (skip + take), 0);
        return {
          begin: skip,
          end: endItemsCount
        };
      }
      // @ts-expect-error
      return this._dataLoader.virtualItemsCount.apply(this._dataLoader, arguments);
    }
    return undefined;
  }
  getScrollingTimeout() {
    const renderAsync = this.option('scrolling.renderAsync');
    let scrollingTimeout = 0;
    if (!(0, _type.isDefined)(renderAsync)) {
      scrollingTimeout = Math.min(this.option('scrolling.timeout') || 0, this._dataOptions.changingDuration());
      if (scrollingTimeout < this.option('scrolling.renderingThreshold')) {
        scrollingTimeout = this.option('scrolling.minTimeout') || 0;
      }
    } else if (renderAsync) {
      scrollingTimeout = this.option('scrolling.timeout') ?? 0;
    }
    return scrollingTimeout;
  }
  setViewportPosition(position) {
    // @ts-expect-error
    const result = new _deferred.Deferred();
    const scrollingTimeout = this.getScrollingTimeout();
    clearTimeout(this._scrollTimeoutID);
    if (scrollingTimeout > 0) {
      this._scrollTimeoutID = setTimeout(() => {
        this._setViewportPositionCore(position);
        result.resolve();
      }, scrollingTimeout);
    } else {
      this._setViewportPositionCore(position);
      result.resolve();
    }
    return result.promise();
  }
  getViewportPosition() {
    return this._position;
  }
  getItemIndexByPosition(position, viewportItemIndex, height) {
    position = position ?? this._position;
    const defaultItemSize = this.getItemSize();
    let offset = 0;
    let itemOffset = 0;
    const itemOffsetsWithSize = Object.keys(this._itemSizes).concat(-1);
    for (let i = 0; i < itemOffsetsWithSize.length && offset < position; i++) {
      // eslint-disable-next-line radix
      const itemOffsetWithSize = parseInt(itemOffsetsWithSize[i]);
      let itemOffsetDiff = (position - offset) / defaultItemSize;
      if (itemOffsetWithSize < 0 || itemOffset + itemOffsetDiff < itemOffsetWithSize) {
        itemOffset += itemOffsetDiff;
        if (this._sizeRatio < 1 && (0, _type.isDefined)(viewportItemIndex)) {
          itemOffset = viewportItemIndex + height / this._viewportItemSize;
        }
        break;
      } else {
        itemOffsetDiff = itemOffsetWithSize - itemOffset;
        offset += itemOffsetDiff * defaultItemSize;
        itemOffset += itemOffsetDiff;
      }
      const itemSize = this._itemSizes[itemOffsetWithSize];
      offset += itemSize;
      itemOffset += offset < position ? 1 : (position - offset + itemSize) / itemSize;
    }
    return Math.round(itemOffset * 50) / 50;
  }
  isScrollingBack() {
    return this._isScrollingBack;
  }
  _setViewportPositionCore(position) {
    const prevPosition = this._position || 0;
    this._position = position;
    if (prevPosition !== this._position) {
      this._isScrollingBack = this._position < prevPosition;
    }
    const itemIndex = this.getItemIndexByPosition();
    const result = this.setViewportItemIndex(itemIndex);
    this.positionChanged.fire();
    return result;
  }
  setContentItemSizes(sizes) {
    const virtualItemsCount = this.virtualItemsCount();
    this._contentSize = sizes.reduce((a, b) => a + b, 0);
    if (virtualItemsCount) {
      sizes.forEach((size, index) => {
        this._itemSizes[virtualItemsCount.begin + index] = size;
      });
      const virtualContentSize = (virtualItemsCount.begin + virtualItemsCount.end + this.itemsCount()) * this._viewportItemSize;
      const contentHeightLimit = _m_utils.default.getContentHeightLimit(_browser.default);
      if (virtualContentSize > contentHeightLimit) {
        this._sizeRatio = contentHeightLimit / virtualContentSize;
      } else {
        this._sizeRatio = 1;
      }
    }
  }
  getItemSize() {
    return this._viewportItemSize * this._sizeRatio;
  }
  getItemOffset(itemIndex, isEnd) {
    const virtualItemsCount = this.virtualItemsCount();
    let itemCount = itemIndex;
    if (!virtualItemsCount) return 0;
    let offset = 0;
    const totalItemsCount = this._dataOptions.totalItemsCount();
    Object.keys(this._itemSizes).forEach(currentItemIndex => {
      if (!itemCount) return;
      if (isEnd ? currentItemIndex >= totalItemsCount - itemIndex : currentItemIndex < itemIndex) {
        offset += this._itemSizes[currentItemIndex];
        itemCount--;
      }
    });
    return Math.floor(offset + itemCount * this._viewportItemSize * this._sizeRatio);
  }
  getContentOffset(type) {
    const isEnd = type === 'end';
    const virtualItemsCount = this.virtualItemsCount();
    if (!virtualItemsCount) return 0;
    return this.getItemOffset(isEnd ? virtualItemsCount.end : virtualItemsCount.begin, isEnd);
  }
  getVirtualContentSize() {
    const virtualItemsCount = this.virtualItemsCount();
    return virtualItemsCount ? this.getContentOffset('begin') + this.getContentOffset('end') + this._contentSize : 0;
  }
  getViewportItemIndex() {
    return this._viewportItemIndex;
  }
  setViewportItemIndex(itemIndex) {
    this._viewportItemIndex = itemIndex;
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return;
    }
    // @ts-expect-error
    return this._dataLoader.viewportItemIndexChanged.apply(this._dataLoader, arguments);
  }
  viewportItemSize(size) {
    if (size !== undefined) {
      this._viewportItemSize = size;
    }
    return this._viewportItemSize;
  }
  viewportSize(size) {
    if (size !== undefined) {
      this._viewportSize = size;
    }
    return this._viewportSize;
  }
  viewportHeight(height, scrollTop) {
    const position = scrollTop ?? this._position;
    const begin = this.getItemIndexByPosition(position);
    const end = this.getItemIndexByPosition(position + height, begin, height);
    this.viewportSize(Math.ceil(end - begin));
    if (!(0, _type.isDefined)(scrollTop) && this._viewportItemIndex !== begin) {
      this._setViewportPositionCore(position);
    }
  }
  reset(isRefresh) {
    this._dataLoader.reset();
    if (!isRefresh) {
      this._itemSizes = {};
    }
  }
  subscribeToWindowScrollEvents($element) {
    this._windowScroll = this._windowScroll || subscribeToExternalScrollers($element, scrollTop => {
      if (this.viewportItemSize()) {
        this.setViewportPosition(scrollTop);
      }
    });
  }
  dispose() {
    clearTimeout(this._scrollTimeoutID);
    this._windowScroll && this._windowScroll.dispose();
    this._windowScroll = null;
  }
  scrollTo(pos) {
    this._windowScroll && this._windowScroll.scrollTo(pos);
  }
  isVirtualMode() {
    return isVirtualMode(this);
  }
  isAppendMode() {
    return isAppendMode(this);
  }
  // new mode
  getViewportParams() {
    const virtualMode = this.option('scrolling.mode') === SCROLLING_MODE_VIRTUAL;
    const totalItemsCount = this._dataOptions.totalItemsCount();
    const hasKnownLastPage = this._dataOptions.hasKnownLastPage();
    const topIndex = hasKnownLastPage && this._viewportItemIndex > totalItemsCount ? totalItemsCount : this._viewportItemIndex;
    const bottomIndex = this._viewportSize + topIndex;
    const maxGap = this.option('scrolling.prerenderedRowChunkSize') || 1;
    const isScrollingBack = this.isScrollingBack();
    const minGap = this.option('scrolling.prerenderedRowCount') ?? 1;
    const topMinGap = isScrollingBack ? minGap : 0;
    const bottomMinGap = isScrollingBack ? 0 : minGap;
    const skip = Math.floor(Math.max(0, topIndex - topMinGap) / maxGap) * maxGap;
    let take = Math.ceil((bottomIndex + bottomMinGap - skip) / maxGap) * maxGap;
    if (virtualMode) {
      const remainedItems = Math.max(0, totalItemsCount - skip);
      take = Math.min(take, remainedItems);
    }
    return {
      skip,
      take
    };
  }
  itemsCount() {
    let result = 0;
    if (this.option(LEGACY_SCROLLING_MODE)) {
      // @ts-expect-error
      result = this._dataLoader.itemsCount.apply(this._dataLoader, arguments);
    } else {
      result = this._dataOptions.itemsCount();
    }
    return result;
  }
  pageIndex() {
    return this._dataLoader.pageIndex(...arguments);
  }
  beginPageIndex() {
    // @ts-expect-error
    return this._dataLoader.beginPageIndex(...arguments);
  }
  endPageIndex() {
    // @ts-expect-error
    return this._dataLoader.endPageIndex(...arguments);
  }
  pageSize() {
    // @ts-expect-error
    return this._dataLoader.pageSize(...arguments);
  }
  load() {
    // @ts-expect-error
    return this._dataLoader.load(...arguments);
  }
  loadIfNeed() {
    // @ts-expect-error
    return this._dataLoader.loadIfNeed(...arguments);
  }
  handleDataChanged() {
    // @ts-expect-error
    return this._dataLoader.handleDataChanged(...arguments);
  }
  getDelayDeferred() {
    return this._dataLoader.getDelayDeferred();
  }
}
exports.VirtualScrollController = VirtualScrollController;
var _default = exports.default = {
  VirtualScrollController
};