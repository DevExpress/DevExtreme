import positionUtils from '@js/common/core/animation/position';
import eventsEngine from '@js/common/core/events/core/events_engine';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import Callbacks from '@js/core/utils/callbacks';
import { Deferred } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { isDefined } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';

import gridCoreUtils from '../m_utils';
import { VirtualDataLoader } from '../virtual_data_loader/m_virtual_data_loader';

const SCROLLING_MODE_INFINITE = 'infinite';
const SCROLLING_MODE_VIRTUAL = 'virtual';
const LEGACY_SCROLLING_MODE = 'scrolling.legacyMode';

const isVirtualMode = (that) => that.option('scrolling.mode') === SCROLLING_MODE_VIRTUAL || that._isVirtual;
const isAppendMode = (that) => that.option('scrolling.mode') === SCROLLING_MODE_INFINITE && !that._isVirtual;

function subscribeToExternalScrollers($element, scrollChangedHandler, $targetElement?) {
  let $scrollElement;
  const scrollableArray: any = [];
  const scrollToArray: any = [];
  const disposeArray: any = [];
  $targetElement = $targetElement || $element;

  function getElementOffset(scrollable) {
    const $scrollableElement = scrollable.element ? scrollable.$element() : scrollable;
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

class VirtualScrollController {
  private readonly _dataOptions: any;

  private readonly component: any;

  private _viewportSize: number;

  private _viewportItemSize: number;

  private _viewportItemIndex: number;

  private _position: number;

  private _isScrollingBack: boolean;

  private _itemSizes: any;

  private readonly _isVirtual: any;

  private _contentSize: number;

  private _sizeRatio: number;

  public positionChanged: any;

  private readonly _dataLoader: VirtualDataLoader;

  private _scrollTimeoutID: any;

  private _windowScroll: any;

  constructor(component, dataOptions, isVirtual?) {
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
  }

  private getItemSizes() {
    return this._itemSizes;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private option(name, value?) {
    return this.component.option.apply(this.component, arguments);
  }

  private isVirtual() {
    return this._isVirtual;
  }

  private virtualItemsCount() {
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

      // @ts-expect-error
      return this._dataLoader.virtualItemsCount.apply(this._dataLoader, arguments);
    }

    return undefined;
  }

  private getScrollingTimeout() {
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
  }

  private setViewportPosition(position) {
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
  }

  private getViewportPosition() {
    return this._position;
  }

  private getItemIndexByPosition(position?, viewportItemIndex?, height?) {
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
  }

  public isScrollingBack() {
    return this._isScrollingBack;
  }

  private _setViewportPositionCore(position) {
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

  public setContentItemSizes(sizes) {
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
  }

  private getItemSize() {
    return this._viewportItemSize * this._sizeRatio;
  }

  public getItemOffset(itemIndex, isEnd?) {
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
  }

  private getContentOffset(type) {
    const isEnd = type === 'end';
    const virtualItemsCount = this.virtualItemsCount();

    if (!virtualItemsCount) return 0;

    return this.getItemOffset(isEnd ? virtualItemsCount.end : virtualItemsCount.begin, isEnd);
  }

  private getVirtualContentSize() {
    const virtualItemsCount = this.virtualItemsCount();

    return virtualItemsCount ? this.getContentOffset('begin') + this.getContentOffset('end') + this._contentSize : 0;
  }

  public getViewportItemIndex() {
    return this._viewportItemIndex;
  }

  private setViewportItemIndex(itemIndex) {
    this._viewportItemIndex = itemIndex;
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return;
    }

    // @ts-expect-error
    return this._dataLoader.viewportItemIndexChanged.apply(this._dataLoader, arguments);
  }

  private viewportItemSize(size?) {
    if (size !== undefined) {
      this._viewportItemSize = size;
    }
    return this._viewportItemSize;
  }

  private viewportSize(size) {
    if (size !== undefined) {
      this._viewportSize = size;
    }
    return this._viewportSize;
  }

  public viewportHeight(height, scrollTop) {
    const position = scrollTop ?? this._position;
    const begin = this.getItemIndexByPosition(position);
    const end = this.getItemIndexByPosition(position + height, begin, height);

    this.viewportSize(Math.ceil(end - begin));

    if (!isDefined(scrollTop) && this._viewportItemIndex !== begin) {
      this._setViewportPositionCore(position);
    }
  }

  public reset(isRefresh?) {
    this._dataLoader.reset();
    if (!isRefresh) {
      this._itemSizes = {};
    }
  }

  private subscribeToWindowScrollEvents($element) {
    this._windowScroll = this._windowScroll || subscribeToExternalScrollers($element, (scrollTop) => {
      if (this.viewportItemSize()) {
        this.setViewportPosition(scrollTop);
      }
    });
  }

  public dispose() {
    clearTimeout(this._scrollTimeoutID);
    this._windowScroll && this._windowScroll.dispose();
    this._windowScroll = null;
  }

  private scrollTo(pos) {
    this._windowScroll && this._windowScroll.scrollTo(pos);
  }

  private isVirtualMode() {
    return isVirtualMode(this);
  }

  private isAppendMode() {
    return isAppendMode(this);
  }

  // new mode
  public getViewportParams() {
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
  }

  public itemsCount() {
    let result = 0;

    if (this.option(LEGACY_SCROLLING_MODE)) {
      // @ts-expect-error
      result = this._dataLoader.itemsCount.apply(this._dataLoader, arguments);
    } else {
      result = this._dataOptions.itemsCount();
    }

    return result;
  }

  public pageIndex(...args) {
    return this._dataLoader.pageIndex(...args);
  }

  public beginPageIndex(...args) {
    // @ts-expect-error
    return this._dataLoader.beginPageIndex(...args);
  }

  private endPageIndex(...args) {
    // @ts-expect-error
    return this._dataLoader.endPageIndex(...args);
  }

  public pageSize(...args) {
    // @ts-expect-error
    return this._dataLoader.pageSize(...args);
  }

  public load(...args) {
    // @ts-expect-error
    return this._dataLoader.load(...args);
  }

  public loadIfNeed(...args) {
    // @ts-expect-error
    return this._dataLoader.loadIfNeed(...args);
  }

  public handleDataChanged(...args) {
    // @ts-expect-error
    return this._dataLoader.handleDataChanged(...args);
  }

  public getDelayDeferred() {
    return this._dataLoader.getDelayDeferred();
  }
}

export default { VirtualScrollController };
export { subscribeToExternalScrollers, VirtualScrollController };
