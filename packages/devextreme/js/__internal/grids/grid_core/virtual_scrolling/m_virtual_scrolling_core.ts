import positionUtils from '@js/common/core/animation/position';
import eventsEngine from '@js/common/core/events/core/events_engine';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import type { Callback } from '@js/core/utils/callbacks';
import Callbacks from '@js/core/utils/callbacks';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { isDefined } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import type { ChangedEvent } from '@ts/grids/grid_core/data_source_adapter/types';
import type {
  GridPropertyType,
  InternalGrid,
  InternalGridOptions,
} from '@ts/grids/grid_core/types';
import type {
  ChangedCallback,
  VirtualItemsCount,
} from '@ts/grids/grid_core/virtual_data_loader/types';
import type Scrollable from '@ts/ui/scroll_view/scrollable';

import gridCoreUtils from '../utils';
import { VirtualDataLoader } from '../virtual_data_loader/virtual_data_loader';
import {
  LEGACY_SCROLLING_MODE,
  SCROLLING_MODE_INFINITE,
  SCROLLING_MODE_VIRTUAL,
} from './const';
import type {
  ExternalScrollable,
  ExternalScrollers,
  ViewportParams,
  VirtualScrollDataOptions,
} from './types';

const isVirtualMode = (that: VirtualScrollController): boolean => that.option('scrolling.mode') === SCROLLING_MODE_VIRTUAL || that.isVirtual();
const isAppendMode = (that: VirtualScrollController): boolean => that.option('scrolling.mode') === SCROLLING_MODE_INFINITE && !that.isVirtual();

// @ts-expect-error scrollTop() is typed as a setter only
const getScrollTop = (scrollable: ExternalScrollable): number => scrollable.scrollTop();

function subscribeToExternalScrollers(
  $element: dxElementWrapper,
  scrollChangedHandler: (scrollTop: number) => void,
  $targetElement?: dxElementWrapper,
): ExternalScrollers {
  const scrollToArray: ((position: number) => void)[] = [];
  const disposeArray: (() => void)[] = [];
  const $target = $targetElement ?? $element;

  function getElementOffset(scrollable: ExternalScrollable): number {
    const $scrollableElement = 'element' in scrollable ? scrollable.$element() : scrollable;
    const scrollableOffset = positionUtils.offset($scrollableElement);
    const elementTop = Number($element.offset()?.top);

    if (!scrollableOffset) {
      return elementTop;
    }

    return getScrollTop(scrollable) - (scrollableOffset.top - elementTop);
  }

  function createWindowScrollHandler(scrollable: ExternalScrollable): () => void {
    return function windowScrollHandler(): void {
      let scrollTop = getScrollTop(scrollable) - getElementOffset(scrollable);

      scrollTop = scrollTop > 0 ? scrollTop : 0;
      scrollChangedHandler(scrollTop);
    };
  }

  function subscribeToScrollEvents($parentElement: dxElementWrapper): void {
    const isDocument = $parentElement.get(0).nodeName === '#document';
    const isElement = $parentElement.get(0).nodeType === Node.ELEMENT_NODE;
    const widget = $parentElement.data<Scrollable | undefined>('dxScrollable');
    const scrollable = widget
      ?? ((isDocument && $(getWindow()))
      || (isElement && $parentElement.css('overflowY') === 'auto' && $parentElement));

    if (!scrollable) {
      return;
    }

    const handler = createWindowScrollHandler(scrollable);

    if (widget) {
      widget.on('scroll', handler);
    } else {
      eventsEngine.on(scrollable, 'scroll', handler);
    }

    scrollToArray.push((pos) => {
      const topOffset = getElementOffset(scrollable);
      const scrollMethod = 'scrollTo' in scrollable ? 'scrollTo' : 'scrollTop';

      if (pos - topOffset >= 0) {
        scrollable[scrollMethod](pos + topOffset);
      }
    });

    disposeArray.push(() => {
      if (widget) {
        widget.off('scroll', handler);
      } else {
        eventsEngine.off(scrollable, 'scroll', handler);
      }
    });
  }

  const getScrollElementParent = ($child: dxElementWrapper): dxElementWrapper => {
    const node: Node & { host?: Element } = $child.get(0);

    return $(node.parentNode ?? node.host);
  };

  for (
    let $scrollElement = $target.parent();
    $scrollElement.length;
    $scrollElement = getScrollElementParent($scrollElement)
  ) {
    subscribeToScrollEvents($scrollElement);
  }

  return {
    scrollTo(pos): void {
      each(scrollToArray, (_, scrollTo) => {
        scrollTo(pos);
      });
    },

    dispose(): void {
      each(disposeArray, (_, dispose) => {
        dispose();
      });
    },
  };
}

class VirtualScrollController<
  TDataOptions extends VirtualScrollDataOptions = VirtualScrollDataOptions,
> {
  private readonly _dataOptions: TDataOptions;

  private readonly component: InternalGrid;

  private _viewportSize: number;

  private _viewportItemSize: number;

  private _viewportItemIndex: number;

  private _position: number;

  private _isScrollingBack: boolean;

  private _itemSizes: Record<number, number>;

  private readonly _isVirtual: boolean;

  private _contentSize: number;

  private _sizeRatio: number;

  public positionChanged: Callback;

  private readonly _dataLoader: VirtualDataLoader;

  private _scrollTimeoutID?: ReturnType<typeof setTimeout>;

  private _windowScroll?: ExternalScrollers | null;

  constructor(component: InternalGrid, dataOptions: TDataOptions, isVirtual = false) {
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

  public getItemSizes(): Record<number, number> {
    return this._itemSizes;
  }

  public option<TPropertyName extends string>(
    name: TPropertyName,
  ): GridPropertyType<InternalGridOptions, TPropertyName> {
    return this.component.option(name);
  }

  public isVirtual(): boolean {
    return this._isVirtual;
  }

  public virtualItemsCount(): VirtualItemsCount | undefined {
    if (isVirtualMode(this)) {
      const dataOptions = this._dataOptions;
      const totalItemsCount = dataOptions.totalItemsCount();
      if (this.option(LEGACY_SCROLLING_MODE) === false && totalItemsCount !== -1) {
        const renderedItemsRange = dataOptions.renderedItemsRange?.();
        const viewportParams = this.getViewportParams();
        const loadedOffset = Number(dataOptions.loadedOffset?.());
        const loadedItemCount = Number(dataOptions.loadedItemCount?.());

        const skip = renderedItemsRange?.skip ?? Math.max(viewportParams.skip, loadedOffset);
        const take = renderedItemsRange?.take ?? Math.min(viewportParams.take, loadedItemCount);

        const endItemsCount = Math.max(totalItemsCount - (skip + take), 0);
        return {
          begin: skip,
          end: endItemsCount,
        };
      }

      return this._dataLoader.virtualItemsCount();
    }

    return undefined;
  }

  private getScrollingTimeout(): number {
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

  public setViewportPosition(position: number): DeferredObj<unknown> {
    const result = Deferred<unknown>();
    const scrollingTimeout = this.getScrollingTimeout();

    clearTimeout(this._scrollTimeoutID);
    if (scrollingTimeout > 0) {
      // eslint-disable-next-line no-restricted-globals -- delays rendering by scrolling.timeout
      this._scrollTimeoutID = setTimeout(() => {
        this._setViewportPositionCore(position);
        result.resolve();
      }, scrollingTimeout);
    } else {
      this._setViewportPositionCore(position);
      result.resolve();
    }
    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return result.promise();
  }

  public getViewportPosition(): number {
    return this._position;
  }

  public getItemIndexByPosition(
    position?: number,
    viewportItemIndex?: number,
    height?: number,
  ): number {
    const targetPosition = position ?? this._position;
    const defaultItemSize = this.getItemSize();
    let offset = 0;
    let itemOffset = 0;

    const itemOffsetsWithSize = [...Object.keys(this._itemSizes), -1];
    for (let i = 0; i < itemOffsetsWithSize.length && offset < targetPosition; i += 1) {
      const itemOffsetWithSize = parseInt(String(itemOffsetsWithSize[i]), 10);
      let itemOffsetDiff = (targetPosition - offset) / defaultItemSize;
      if (itemOffsetWithSize < 0 || itemOffset + itemOffsetDiff < itemOffsetWithSize) {
        itemOffset += itemOffsetDiff;

        if (this._sizeRatio < 1 && isDefined(viewportItemIndex)) {
          itemOffset = viewportItemIndex + (Number(height) / this._viewportItemSize);
        }
        break;
      } else {
        itemOffsetDiff = itemOffsetWithSize - itemOffset;
        offset += itemOffsetDiff * defaultItemSize;
        itemOffset += itemOffsetDiff;
      }
      const itemSize = this._itemSizes[itemOffsetWithSize];
      offset += itemSize;
      itemOffset += offset < targetPosition ? 1 : (targetPosition - offset + itemSize) / itemSize;
    }
    return Math.round(itemOffset * 50) / 50;
  }

  public isScrollingBack(): boolean {
    return this._isScrollingBack;
  }

  public _setViewportPositionCore(position: number): DeferredObj<unknown> | undefined {
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

  public setContentItemSizes(sizes: number[]): void {
    const virtualItemsCount = this.virtualItemsCount();

    this._contentSize = sizes.reduce((a, b) => a + b, 0);

    if (virtualItemsCount) {
      sizes.forEach((size, index) => {
        this._itemSizes[virtualItemsCount.begin + index] = size;
      });

      const virtualItemCount = virtualItemsCount.begin + virtualItemsCount.end + this.itemsCount();
      const virtualContentSize = virtualItemCount * this._viewportItemSize;
      const contentHeightLimit = gridCoreUtils.getContentHeightLimit(browser);
      if (virtualContentSize > contentHeightLimit) {
        this._sizeRatio = contentHeightLimit / virtualContentSize;
      } else {
        this._sizeRatio = 1;
      }
    }
  }

  public getItemSize(): number {
    return this._viewportItemSize * this._sizeRatio;
  }

  public getItemOffset(itemIndex: number, isEnd?: boolean): number {
    const virtualItemsCount = this.virtualItemsCount();
    let itemCount = itemIndex;

    if (!virtualItemsCount) return 0;

    let offset = 0;
    const totalItemsCount = this._dataOptions.totalItemsCount();

    Object.keys(this._itemSizes).forEach((currentItemKey) => {
      const currentItemIndex = Number(currentItemKey);
      if (!itemCount) return;
      if (isEnd ? currentItemIndex >= totalItemsCount - itemIndex : currentItemIndex < itemIndex) {
        offset += this._itemSizes[currentItemIndex];
        itemCount -= 1;
      }
    });

    return offset + itemCount * this._viewportItemSize * this._sizeRatio;
  }

  public getContentOffset(type?: 'begin' | 'end'): number {
    const isEnd = type === 'end';
    const virtualItemsCount = this.virtualItemsCount();

    if (!virtualItemsCount) return 0;

    return this.getItemOffset(isEnd ? virtualItemsCount.end : virtualItemsCount.begin, isEnd);
  }

  public getVirtualContentSize(): number {
    const virtualItemsCount = this.virtualItemsCount();

    return virtualItemsCount ? this.getContentOffset('begin') + this.getContentOffset('end') + this._contentSize : 0;
  }

  public getViewportItemIndex(): number {
    return this._viewportItemIndex;
  }

  public setViewportItemIndex(itemIndex: number): DeferredObj<unknown> | undefined {
    this._viewportItemIndex = itemIndex;
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return undefined;
    }

    return this._dataLoader.viewportItemIndexChanged(itemIndex);
  }

  public viewportItemSize(size?: number): number {
    if (size !== undefined) {
      this._viewportItemSize = size;
    }
    return this._viewportItemSize;
  }

  public viewportSize(size?: number): number {
    if (size !== undefined) {
      this._viewportSize = size;
    }
    return this._viewportSize;
  }

  public viewportHeight(height: number, scrollTop?: number): void {
    const position = scrollTop ?? this._position;
    const begin = this.getItemIndexByPosition(position);
    const end = this.getItemIndexByPosition(position + height, begin, height);

    this.viewportSize(Math.ceil(end - begin));

    if (!isDefined(scrollTop) && this._viewportItemIndex !== begin) {
      this._setViewportPositionCore(position);
    }
  }

  public reset(isRefresh?: boolean): void {
    this._dataLoader.reset();
    if (!isRefresh) {
      this._itemSizes = {};
    }
  }

  public subscribeToWindowScrollEvents($element: dxElementWrapper): void {
    this._windowScroll = this._windowScroll ?? subscribeToExternalScrollers(
      $element,
      (scrollTop) => {
        if (this.viewportItemSize()) {
          this.setViewportPosition(scrollTop);
        }
      },
    );
  }

  public dispose(): void {
    clearTimeout(this._scrollTimeoutID);
    this._windowScroll?.dispose();
    this._windowScroll = null;
  }

  public scrollTo(pos: number): void {
    this._windowScroll?.scrollTo(pos);
  }

  public isVirtualMode(): boolean {
    return isVirtualMode(this);
  }

  public isAppendMode(): boolean {
    return isAppendMode(this);
  }

  public getViewportParams(): ViewportParams {
    const virtualMode = this.option('scrolling.mode') === SCROLLING_MODE_VIRTUAL;
    const totalItemsCount = this._dataOptions.totalItemsCount();
    const hasKnownLastPage = this._dataOptions.hasKnownLastPage();
    const topIndex = hasKnownLastPage && this._viewportItemIndex > totalItemsCount
      ? totalItemsCount
      : this._viewportItemIndex;
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

  public itemsCount(isBase?: boolean): number {
    if (this.option(LEGACY_SCROLLING_MODE)) {
      return this._dataLoader.itemsCount(isBase);
    }

    return this._dataOptions.itemsCount();
  }

  public pageIndex(): number;
  public pageIndex(pageIndex: number): number | undefined;
  public pageIndex(pageIndex?: number): number | undefined {
    return pageIndex === undefined
      ? this._dataLoader.pageIndex()
      : this._dataLoader.pageIndex(pageIndex);
  }

  public beginPageIndex(defaultPageIndex?: number): number {
    return this._dataLoader.beginPageIndex(defaultPageIndex);
  }

  public endPageIndex(): number {
    return this._dataLoader.endPageIndex();
  }

  public pageSize(): number {
    return this._dataLoader.pageSize();
  }

  public load(): DeferredObj<unknown> {
    return this._dataLoader.load();
  }

  public loadIfNeed(): void {
    this._dataLoader.loadIfNeed();
  }

  public handleDataChanged(callBase: ChangedCallback, e?: ChangedEvent): void {
    this._dataLoader.handleDataChanged(callBase, e);
  }

  public getDelayDeferred(): DeferredObj<unknown> | undefined {
    return this._dataLoader.getDelayDeferred();
  }
}

export default { VirtualScrollController };
export { subscribeToExternalScrollers, VirtualScrollController };
