import $ from '@js/core/renderer';
import { getWindow } from '@js/core/utils/window';
import eventsEngine from '@js/events/core/events_engine';
import browser from '@js/core/utils/browser';
import positionUtils from '@js/animation/position';
import { each } from '@js/core/utils/iterator';
import Class from '@js/core/class';
import { Deferred } from '@js/core/utils/deferred';
import Callbacks from '@js/core/utils/callbacks';
import { isDefined } from '@js/core/utils/type';
import { VirtualDataLoader } from '../virtual_data_loader/module';
import gridCoreUtils from '../module_utils';

const SCROLLING_MODE_INFINITE = 'infinite';
const SCROLLING_MODE_VIRTUAL = 'virtual';
const LEGACY_SCROLLING_MODE = 'scrolling.legacyMode';

const isVirtualMode = (that) => that.option('scrolling.mode') === SCROLLING_MODE_VIRTUAL || that._isVirtual;
const isAppendMode = (that) => that.option('scrolling.mode') === SCROLLING_MODE_INFINITE && !that._isVirtual;

export function subscribeToExternalScrollers($element, scrollChangedHandler, $targetElement?) {
  let $scrollElement;
  const scrollableArray: any = [];
  const scrollToArray: any = [];
  const disposeArray: any = [];
  $targetElement = $targetElement || $element;

  function getElementOffset(scrollable) {
    const $scrollableElement = scrollable.element ? scrollable.$element() : scrollable;
    // @ts-expect-error
    const scrollableOffset = positionUtils.offset($scrollableElement);

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
    },
  };

  function subscribeToScrollEvents($scrollElement) {
    const isDocument = $scrollElement.get(0).nodeName === '#document';
    // @ts-expect-error
    const isElement = $scrollElement.get(0).nodeType === getWindow().Node.ELEMENT_NODE;
    let scrollable = $scrollElement.data('dxScrollable');
    let eventsStrategy = widgetScrollStrategy;

    if (!scrollable) {
      scrollable = isDocument && $(getWindow() as any) || isElement && $scrollElement.css('overflowY') === 'auto' && $scrollElement;
      eventsStrategy = eventsEngine;
      if (!scrollable) return;
    }

    const handler = createWindowScrollHandler(scrollable);
    eventsStrategy.on(scrollable, 'scroll', handler);

    scrollToArray.push((pos) => {
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

  const getScrollElementParent = ($element) => $($element.get(0).parentNode ?? $element.get(0).host);

  for ($scrollElement = $targetElement.parent(); $scrollElement.length; $scrollElement = getScrollElementParent($scrollElement)) {
    subscribeToScrollEvents($scrollElement);
  }

  return {
    scrollTo(pos) {
      each(scrollToArray, (_, scrollTo) => {
        scrollTo(pos);
      });
    },

    dispose() {
      each(disposeArray, (_, dispose) => {
        dispose();
      });
    },
  };
}

export const VirtualScrollController = Class.inherit((function () {
  const members = {
    ctor(component, dataOptions, isVirtual) {
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
      this.positionChanged = Callbacks();
      this._dataLoader = new VirtualDataLoader(this, this._dataOptions);
    },

    getItemSizes() {
      return this._itemSizes;
    },

    option() {
      return this.component.option.apply(this.component, arguments);
    },

    isVirtual() {
      return this._isVirtual;
    },

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
            end: endItemsCount,
          };
        }

        return this._dataLoader.virtualItemsCount.apply(this._dataLoader, arguments);
      }
    },
    getScrollingTimeout() {
      const renderAsync = this.option('scrolling.renderAsync');
      let scrollingTimeout = 0;

      if (!isDefined(renderAsync)) {
        scrollingTimeout = Math.min(this.option('scrolling.timeout') || 0, this._dataOptions.changingDuration());

        if (scrollingTimeout < this.option('scrolling.renderingThreshold')) {
          scrollingTimeout = this.option('scrolling.minTimeout') || 0;
        }
      } else if (renderAsync) {
        scrollingTimeout = this.option('scrolling.timeout') ?? 0;
      }

      return scrollingTimeout;
    },
    setViewportPosition(position) {
      // @ts-expect-error
      const result = new Deferred();
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
    },

    getViewportPosition() {
      return this._position;
    },

    getItemIndexByPosition(position, viewportItemIndex, height) {
      position = position ?? this._position;
      const defaultItemSize = this.getItemSize();
      let offset = 0;
      let itemOffset = 0;

      const itemOffsetsWithSize = (Object.keys(this._itemSizes) as any).concat(-1);
      for (let i = 0; i < itemOffsetsWithSize.length && offset < position; i++) {
        // eslint-disable-next-line radix
        const itemOffsetWithSize = parseInt(itemOffsetsWithSize[i]);
        let itemOffsetDiff = (position - offset) / defaultItemSize;
        if (itemOffsetWithSize < 0 || itemOffset + itemOffsetDiff < itemOffsetWithSize) {
          itemOffset += itemOffsetDiff;

          if (this._sizeRatio < 1 && isDefined(viewportItemIndex)) {
            itemOffset = viewportItemIndex + (height / this._viewportItemSize);
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
    },

    isScrollingBack() {
      return this._isScrollingBack;
    },

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
    },

    setContentItemSizes(sizes) {
      const virtualItemsCount = this.virtualItemsCount();

      this._contentSize = sizes.reduce((a, b) => a + b, 0);

      if (virtualItemsCount) {
        sizes.forEach((size, index) => {
          this._itemSizes[virtualItemsCount.begin + index] = size;
        });

        const virtualContentSize = (virtualItemsCount.begin + virtualItemsCount.end + this.itemsCount()) * this._viewportItemSize;
        const contentHeightLimit = gridCoreUtils.getContentHeightLimit(browser);
        if (virtualContentSize > contentHeightLimit) {
          this._sizeRatio = contentHeightLimit / virtualContentSize;
        } else {
          this._sizeRatio = 1;
        }
      }
    },
    getItemSize() {
      return this._viewportItemSize * this._sizeRatio;
    },
    getItemOffset(itemIndex, isEnd) {
      const virtualItemsCount = this.virtualItemsCount();
      let itemCount = itemIndex;

      if (!virtualItemsCount) return 0;

      let offset = 0;
      const totalItemsCount = this._dataOptions.totalItemsCount();

      Object.keys(this._itemSizes).forEach((currentItemIndex: any) => {
        if (!itemCount) return;
        if (isEnd ? currentItemIndex >= totalItemsCount - itemIndex : currentItemIndex < itemIndex) {
          offset += this._itemSizes[currentItemIndex];
          itemCount--;
        }
      });

      return Math.floor(offset + itemCount * this._viewportItemSize * this._sizeRatio);
    },
    getContentOffset(type) {
      const isEnd = type === 'end';
      const virtualItemsCount = this.virtualItemsCount();

      if (!virtualItemsCount) return 0;

      return this.getItemOffset(isEnd ? virtualItemsCount.end : virtualItemsCount.begin, isEnd);
    },
    getVirtualContentSize() {
      const virtualItemsCount = this.virtualItemsCount();

      return virtualItemsCount ? this.getContentOffset('begin') + this.getContentOffset('end') + this._contentSize : 0;
    },
    getViewportItemIndex() {
      return this._viewportItemIndex;
    },
    setViewportItemIndex(itemIndex) {
      this._viewportItemIndex = itemIndex;
      if (this.option(LEGACY_SCROLLING_MODE) === false) {
        return;
      }

      return this._dataLoader.viewportItemIndexChanged.apply(this._dataLoader, arguments);
    },
    viewportItemSize(size) {
      if (size !== undefined) {
        this._viewportItemSize = size;
      }
      return this._viewportItemSize;
    },
    viewportSize(size) {
      if (size !== undefined) {
        this._viewportSize = size;
      }
      return this._viewportSize;
    },
    viewportHeight(height, scrollTop) {
      const position = scrollTop ?? this._position;
      const begin = this.getItemIndexByPosition(position);
      const end = this.getItemIndexByPosition(position + height, begin, height);

      this.viewportSize(Math.ceil(end - begin));

      if (!isDefined(scrollTop) && this._viewportItemIndex !== begin) {
        this._setViewportPositionCore(position);
      }
    },
    reset(isRefresh) {
      this._dataLoader.reset();
      if (!isRefresh) {
        this._itemSizes = {};
      }
    },

    subscribeToWindowScrollEvents($element) {
      this._windowScroll = this._windowScroll || subscribeToExternalScrollers($element, (scrollTop) => {
        if (this.viewportItemSize()) {
          this.setViewportPosition(scrollTop);
        }
      });
    },

    dispose() {
      clearTimeout(this._scrollTimeoutID);
      this._windowScroll && this._windowScroll.dispose();
      this._windowScroll = null;
    },

    scrollTo(pos) {
      this._windowScroll && this._windowScroll.scrollTo(pos);
    },

    isVirtualMode() {
      return isVirtualMode(this);
    },

    isAppendMode() {
      return isAppendMode(this);
    },

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
        take,
      };
    },

    itemsCount() {
      let result = 0;

      if (this.option(LEGACY_SCROLLING_MODE)) {
        result = this._dataLoader.itemsCount.apply(this._dataLoader, arguments);
      } else {
        result = this._dataOptions.itemsCount();
      }

      return result;
    },
  };

  [
    'pageIndex', 'beginPageIndex', 'endPageIndex',
    'pageSize', 'load', 'loadIfNeed', 'handleDataChanged',
    'getDelayDeferred',
  ].forEach((name) => {
    members[name] = function () {
      return this._dataLoader[name].apply(this._dataLoader, arguments);
    };
  });

  return members;
})());
