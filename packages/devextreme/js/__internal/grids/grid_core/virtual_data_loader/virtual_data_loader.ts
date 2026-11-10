import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { isObject, isString } from '@js/core/utils/type';
import type { ChangedEvent } from '@ts/grids/grid_core/data_source_adapter/types';

import type {
  ChangedCallback,
  ProcessedChange,
  VirtualDataLoaderCacheItem,
  VirtualDataLoaderChange,
  VirtualDataLoaderController,
  VirtualDataLoaderDataOptions,
  VirtualItemsCount,
} from './types';

const LEGACY_SCROLLING_MODE = 'scrolling.legacyMode';

export class VirtualDataLoader<TItem = unknown> {
  private readonly _dataOptions: VirtualDataLoaderDataOptions<TItem>;

  private readonly _controller: VirtualDataLoaderController;

  private _pageIndex: number;

  private _cache: VirtualDataLoaderCacheItem[];

  private _loadingPageIndexes: Record<number, boolean>;

  private _lastPageIndex: number;

  private _delayDeferred?: DeferredObj<unknown>;

  private _isChangedFiring?: boolean;

  private _isDelayChanged?: boolean;

  constructor(
    controller: VirtualDataLoaderController,
    dataOptions: VirtualDataLoaderDataOptions<TItem>,
  ) {
    this._dataOptions = dataOptions;
    this._controller = controller;
    this._lastPageIndex = this._dataOptions.pageIndex();
    this._pageIndex = this._lastPageIndex;
    this._cache = [];
    this._loadingPageIndexes = {};
  }

  private option(name: string): unknown {
    return this._controller.option(name);
  }

  private needTwoPagesLoading(): boolean {
    return Boolean(this.option('scrolling.loadTwoPagesOnStart'))
      || this._controller.isVirtual()
      || this._controller.getViewportItemIndex() > 0;
  }

  private getBeginPageIndex(): number {
    return this._cache.length ? this._cache[0].pageIndex : -1;
  }

  private getEndPageIndex(): number {
    return this._cache.length ? this._cache[this._cache.length - 1].pageIndex : -1;
  }

  private fireChanged(
    changedCallback: ChangedCallback<TItem>,
    args?: VirtualDataLoaderChange<TItem>,
  ): void {
    this._isChangedFiring = true;
    changedCallback(args);
    this._isChangedFiring = false;
  }

  private processDelayChanged(
    changedCallback: ChangedCallback<TItem>,
    args?: VirtualDataLoaderChange<TItem>,
  ): boolean | undefined {
    if (this._isDelayChanged) {
      this._isDelayChanged = false;
      this.fireChanged(changedCallback, args);
      return true;
    }
    return undefined;
  }

  private getViewportPageCount(): number {
    const pageSize = this._dataOptions.pageSize();
    const preventPreload = this.option('scrolling.preventPreload');

    if (preventPreload) {
      return 0;
    }

    let realViewportSize = this._controller.viewportSize();

    if (this._controller.isVirtualMode() && this.option('scrolling.removeInvisiblePages')) {
      realViewportSize = 0;

      const viewportSize = this._controller.viewportSize() * this._controller.viewportItemSize();

      let offset = this._controller.getContentOffset();
      const position = this._controller.getViewportPosition();

      const virtualItemsCount = this._controller.virtualItemsCount();
      const totalItemsCount = this._dataOptions.totalItemsCount();

      // @ts-expect-error virtualItemsCount is defined in virtual mode
      for (let itemIndex = virtualItemsCount.begin; itemIndex < totalItemsCount; itemIndex += 1) {
        if (offset >= position + viewportSize) break;

        const itemSize = this._controller.getItemSizes()[itemIndex]
          || this._controller.viewportItemSize();
        offset += itemSize;
        if (offset >= position) {
          realViewportSize += 1;
        }
      }
    }

    return pageSize && realViewportSize > 0 ? Math.ceil(realViewportSize / pageSize) : 1;
  }

  private getPreloadPageCount(previous?: boolean): number {
    const preloadEnabled = this.option('scrolling.preloadEnabled');
    let pageCount = this.getViewportPageCount();
    const isAppendMode = this._controller.isAppendMode();

    if (pageCount) {
      if (previous) {
        pageCount = preloadEnabled ? 1 : 0;
      } else {
        if (preloadEnabled) {
          pageCount += 1;
        }

        if (isAppendMode || !this.needTwoPagesLoading()) {
          pageCount -= 1;
        }
      }
    }

    return pageCount;
  }

  private getPageIndexForLoad(): number {
    let result = -1;
    const beginPageIndex = this.getBeginPageIndex();
    const dataOptions = this._dataOptions;

    if (beginPageIndex < 0) {
      result = this._pageIndex;
    } else if (!this._cache[this._pageIndex - beginPageIndex]) {
      result = this._pageIndex;
    } else if (beginPageIndex >= 0 && this._controller.viewportSize() >= 0) {
      if (beginPageIndex > 0) {
        const needToLoadPageBeforeLast = this.getEndPageIndex() + 1 === dataOptions.pageCount()
          && this._cache.length < this.getPreloadPageCount() + 1;
        const needToLoadPrevPage = needToLoadPageBeforeLast
          || (this._pageIndex === beginPageIndex && this.getPreloadPageCount(true));

        if (needToLoadPrevPage) {
          result = beginPageIndex - 1;
        }
      }

      if (result < 0) {
        const needToLoadNextPage = beginPageIndex + this._cache.length
          <= this._pageIndex + this.getPreloadPageCount();

        if (needToLoadNextPage) {
          result = beginPageIndex + this._cache.length;
        }
      }
    }

    if (this._loadingPageIndexes[result]) {
      result = -1;
    }

    return result;
  }

  private loadCore(
    pageIndex: number,
  ): DeferredObj<unknown> | undefined {
    const dataOptions = this._dataOptions;

    if (pageIndex === this.pageIndex()
      || (!dataOptions.isLoading() && pageIndex < dataOptions.pageCount())
      || (!dataOptions.hasKnownLastPage() && pageIndex === dataOptions.pageCount())) {
      dataOptions.pageIndex(pageIndex);

      this._loadingPageIndexes[pageIndex] = true;
      return when(dataOptions.load()).always(() => {
        this._loadingPageIndexes[pageIndex] = false;
      });
    }
    return undefined;
  }

  private processChanged(
    changedCallback: ChangedCallback<TItem>,
    changeType?: ProcessedChange['changeType'] | ChangedEvent,
    isDelayChanged?: boolean,
    removeCacheItem?: VirtualDataLoaderCacheItem,
  ): void {
    const dataOptions = this._dataOptions;
    const items = dataOptions.items().slice();
    let change: ProcessedChange<TItem> | ChangedEvent | undefined = isObject(changeType)
      ? changeType
      : undefined;
    const isPrepend = changeType === 'prepend';
    const viewportItems = dataOptions.viewportItems();

    if (changeType && isString(changeType) && !this._isDelayChanged) {
      change = {
        changeType,
        items,
      };
      if (removeCacheItem) {
        change.removeCount = removeCacheItem.itemsCount;
        if (change.removeCount && dataOptions.correctCount) {
          change.removeCount = dataOptions.correctCount(
            viewportItems,
            change.removeCount,
            isPrepend,
          );
        }
      }
    }
    let removeItemCount = removeCacheItem ? removeCacheItem.itemsLength : 0;

    if (removeItemCount && dataOptions.correctCount) {
      removeItemCount = dataOptions.correctCount(viewportItems, removeItemCount, isPrepend);
    }

    if (changeType === 'append') {
      viewportItems.push(...items);
      if (removeCacheItem) {
        viewportItems.splice(0, removeItemCount);
      }
    } else if (isPrepend) {
      viewportItems.unshift(...items);
      if (removeCacheItem) {
        viewportItems.splice(-removeItemCount);
      }
    } else {
      this._dataOptions.viewportItems(items);
    }
    dataOptions.updateLoading();
    this._lastPageIndex = this.pageIndex();
    this._isDelayChanged = isDelayChanged;

    if (!isDelayChanged) {
      this.fireChanged(changedCallback, change);
    }
  }

  public viewportItemIndexChanged(itemIndex: number): DeferredObj<unknown> | undefined {
    const pageSize = this._dataOptions.pageSize();
    const pageCount = this._dataOptions.pageCount();
    const virtualMode = this._controller.isVirtualMode();
    const appendMode = this._controller.isAppendMode();
    const totalItemsCount = this._dataOptions.totalItemsCount();
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned below
    let newPageIndex: number;

    if (!(pageSize && (virtualMode || appendMode) && totalItemsCount >= 0)) {
      return undefined;
    }

    const viewportSize = this._controller.viewportSize();
    if (viewportSize && (itemIndex + viewportSize) >= totalItemsCount
      && !this._controller.isVirtual()) {
      if (this._dataOptions.hasKnownLastPage()) {
        newPageIndex = pageCount - 1;
        const lastPageSize = totalItemsCount % pageSize;
        if (newPageIndex > 0 && lastPageSize > 0 && lastPageSize < viewportSize) {
          newPageIndex -= 1;
        }
      } else {
        newPageIndex = pageCount;
      }
    } else {
      newPageIndex = Math.min(Math.max(Math.floor(itemIndex / pageSize), 0), pageCount - 1);
    }

    this.pageIndex(newPageIndex);
    return this.load();
  }

  public pageIndex(): number;
  public pageIndex(pageIndex: number): number | undefined;
  public pageIndex(pageIndex?: number): number | undefined {
    const isVirtualMode = this._controller.isVirtualMode();
    const isAppendMode = this._controller.isAppendMode();

    if (this.option(LEGACY_SCROLLING_MODE) !== false && (isVirtualMode || isAppendMode)) {
      if (pageIndex !== undefined) {
        this._pageIndex = pageIndex;
      }
      return this._pageIndex;
    }
    return pageIndex === undefined
      ? this._dataOptions.pageIndex()
      : this._dataOptions.pageIndex(pageIndex);
  }

  public beginPageIndex(defaultPageIndex?: number): number {
    let index = this.getBeginPageIndex();
    if (index < 0) {
      index = defaultPageIndex ?? this.pageIndex();
    }
    return index;
  }

  public endPageIndex(): number {
    const endPageIndex = this.getEndPageIndex();

    return endPageIndex > 0 ? endPageIndex : this._lastPageIndex;
  }

  public pageSize(): number {
    return this._dataOptions.pageSize();
  }

  public load(): DeferredObj<unknown> {
    const dataOptions = this._dataOptions;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in branches
    let result: DeferredObj<unknown> | undefined;
    const isVirtualMode = this._controller.isVirtualMode();
    const isAppendMode = this._controller.isAppendMode();

    if (this.option(LEGACY_SCROLLING_MODE) !== false && (isVirtualMode || isAppendMode)) {
      const pageIndexForLoad = this.getPageIndexForLoad();

      if (pageIndexForLoad >= 0) {
        const loadResult = this.loadCore(pageIndexForLoad);
        if (loadResult) {
          const deferred = Deferred<unknown>();
          result = deferred;
          const resolve = deferred.resolve as (...a: unknown[]) => void;
          const reject = deferred.reject as (...a: unknown[]) => void;
          loadResult.done(() => {
            const delayDeferred = this._delayDeferred;
            if (delayDeferred) {
              delayDeferred.done(resolve).fail(reject);
            } else {
              deferred.resolve();
            }
          }).fail(reject);
          dataOptions.updateLoading();
        }
      }
    } else {
      result = dataOptions.load();
    }

    if (!result && this._lastPageIndex !== this.pageIndex()) {
      this._dataOptions.onChanged({
        changeType: 'pageIndex',
      });
    }

    return result ?? Deferred<unknown>().resolve();
  }

  public loadIfNeed(): void {
    const isVirtualMode = this._controller.isVirtualMode();
    const isAppendMode = this._controller.isAppendMode();

    if ((isVirtualMode || isAppendMode) && !this._dataOptions.isLoading()
      && (!this._isChangedFiring || this._controller.isVirtual())) {
      const position = this._controller.getViewportPosition();
      if (position > 0) {
        this._controller._setViewportPositionCore(position);
      } else {
        this.load();
      }
    }
  }

  public handleDataChanged(changedCallback: ChangedCallback<TItem>, e?: ChangedEvent): void {
    const dataOptions = this._dataOptions;
    let lastCacheLength = this._cache.length;
    const isVirtualMode = this._controller.isVirtualMode();
    const isAppendMode = this._controller.isAppendMode();

    if (e?.changes) {
      this.fireChanged(changedCallback, e);
    } else if (this.option(LEGACY_SCROLLING_MODE) !== false && (isVirtualMode || isAppendMode)) {
      const beginPageIndex = this.getBeginPageIndex();
      if (beginPageIndex >= 0) {
        if (isVirtualMode && beginPageIndex + this._cache.length !== dataOptions.pageIndex()
          && beginPageIndex - 1 !== dataOptions.pageIndex()) {
          lastCacheLength = 0;
          this._cache = [];
        }
        if (isAppendMode && dataOptions.pageIndex() === 0) {
          this._cache = [];
        } else if (isAppendMode && dataOptions.pageIndex() < this.getEndPageIndex()) {
          this.fireChanged(changedCallback, { changeType: 'append', items: [] });
          return;
        }
      }

      const cacheItem = {
        pageIndex: dataOptions.pageIndex(),
        itemsLength: dataOptions.items(true).length,
        itemsCount: this.itemsCount(true),
      };

      const canRemoveInvisiblePages = Boolean(this.option('scrolling.removeInvisiblePages'))
        && isVirtualMode;
      if (!canRemoveInvisiblePages) {
        this.processDelayChanged(changedCallback, { isDelayed: true });
      }
      const removeInvisiblePages = canRemoveInvisiblePages && this._cache.length > Math.max(
        this.getPreloadPageCount() + (this.option('scrolling.preloadEnabled') ? 1 : 0),
        2,
      );

      const isPrepend = beginPageIndex === dataOptions.pageIndex() + 1;
      const changeType = isPrepend ? 'prepend' : 'append';
      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned below
      let removeCacheItem: VirtualDataLoaderCacheItem | undefined;
      if (isPrepend) {
        if (removeInvisiblePages) {
          removeCacheItem = this._cache.pop();
        }
        this._cache.unshift(cacheItem);
      } else {
        if (removeInvisiblePages) {
          removeCacheItem = this._cache.shift();
        }
        this._cache.push(cacheItem);
      }

      const isDelayChanged = isVirtualMode && lastCacheLength === 0 && this.needTwoPagesLoading();
      this.processChanged(
        changedCallback,
        this._cache.length > 1 ? changeType : undefined,
        isDelayChanged,
        removeCacheItem,
      );
      this._delayDeferred = this.load().done(() => {
        if (this.processDelayChanged(changedCallback)) {
          this.load(); // needed for infinite scrolling when height is not defined
        }
      });
    } else {
      this.processChanged(changedCallback, e);
    }
  }

  public getDelayDeferred(): DeferredObj<unknown> | undefined {
    return this._delayDeferred;
  }

  public itemsCount(isBase?: boolean): number {
    let count = 0;
    const isVirtualMode = this._controller.isVirtualMode();

    if (!isBase && isVirtualMode) {
      this._cache.forEach((cacheItem) => {
        count += cacheItem.itemsCount;
      });
    } else {
      count = this._dataOptions.itemsCount();
    }
    return count;
  }

  public virtualItemsCount(): VirtualItemsCount {
    let pageIndex = this.getBeginPageIndex();
    if (pageIndex < 0) {
      pageIndex = this._dataOptions.pageIndex();
    }
    const beginItemsCount = pageIndex * this._dataOptions.pageSize();
    const itemsCount = this._cache.length * this._dataOptions.pageSize();
    const endItemsCount = Math.max(
      0,
      this._dataOptions.totalItemsCount() - itemsCount - beginItemsCount,
    );
    return {
      begin: beginItemsCount,
      end: endItemsCount,
    };
  }

  public reset(): void {
    this._loadingPageIndexes = {};
    this._cache = [];
  }
}
