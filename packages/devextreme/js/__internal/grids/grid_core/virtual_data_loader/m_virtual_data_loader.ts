import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { isObject, isString } from '@js/core/utils/type';

import type {
  ChangedCallback,
  ProcessedChange,
  VirtualDataLoaderCacheItem,
  VirtualDataLoaderController,
  VirtualDataLoaderDataOptions,
  VirtualItemsCount,
} from './types';

const LEGACY_SCROLLING_MODE = 'scrolling.legacyMode';

const needTwoPagesLoading = (that: VirtualDataLoader): boolean => (
  Boolean(that.option('scrolling.loadTwoPagesOnStart'))
  || that._controller.isVirtual()
  || that._controller.getViewportItemIndex() > 0
);

const getBeginPageIndex = (that: VirtualDataLoader): number => (
  that._cache.length ? that._cache[0].pageIndex : -1
);

const getEndPageIndex = (that: VirtualDataLoader): number => (
  that._cache.length ? that._cache[that._cache.length - 1].pageIndex : -1
);

const fireChanged = (that: VirtualDataLoader, changed: ChangedCallback, args?: unknown): void => {
  that._isChangedFiring = true;
  changed(args);
  that._isChangedFiring = false;
};

const processDelayChanged = (
  that: VirtualDataLoader,
  changed: ChangedCallback,
  args?: unknown,
): boolean | undefined => {
  if (that._isDelayChanged) {
    that._isDelayChanged = false;
    fireChanged(that, changed, args);
    return true;
  }
  return undefined;
};

const getViewportPageCount = (that: VirtualDataLoader): number => {
  const pageSize = that._dataOptions.pageSize();
  const preventPreload = that.option('scrolling.preventPreload');

  if (preventPreload) {
    return 0;
  }

  let realViewportSize = that._controller.viewportSize();

  if (that._controller.isVirtualMode() && that.option('scrolling.removeInvisiblePages')) {
    realViewportSize = 0;

    const viewportSize = that._controller.viewportSize() * that._controller.viewportItemSize();

    let offset = that._controller.getContentOffset();
    const position = that._controller.getViewportPosition();

    const virtualItemsCount = that._controller.virtualItemsCount();
    const totalItemsCount = that._dataOptions.totalItemsCount();

    for (let itemIndex = virtualItemsCount.begin; itemIndex < totalItemsCount; itemIndex += 1) {
      if (offset >= position + viewportSize) break;

      const itemSize = that._controller.getItemSizes()[itemIndex]
        || that._controller.viewportItemSize();
      offset += itemSize;
      if (offset >= position) {
        realViewportSize += 1;
      }
    }
  }

  return pageSize && realViewportSize > 0 ? Math.ceil(realViewportSize / pageSize) : 1;
};

const getPreloadPageCount = (that: VirtualDataLoader, previous?: boolean): number => {
  const preloadEnabled = that.option('scrolling.preloadEnabled');
  let pageCount = getViewportPageCount(that);
  const isAppendMode = that._controller.isAppendMode();

  if (pageCount) {
    if (previous) {
      pageCount = preloadEnabled ? 1 : 0;
    } else {
      if (preloadEnabled) {
        pageCount += 1;
      }

      if (isAppendMode || !needTwoPagesLoading(that)) {
        pageCount -= 1;
      }
    }
  }

  return pageCount;
};

const getPageIndexForLoad = (that: VirtualDataLoader): number => {
  let result = -1;
  const beginPageIndex = getBeginPageIndex(that);
  const dataOptions = that._dataOptions;

  if (beginPageIndex < 0) {
    result = that._pageIndex;
  } else if (!that._cache[that._pageIndex - beginPageIndex]) {
    result = that._pageIndex;
  } else if (beginPageIndex >= 0 && that._controller.viewportSize() >= 0) {
    if (beginPageIndex > 0) {
      const needToLoadPageBeforeLast = getEndPageIndex(that) + 1 === dataOptions.pageCount()
        && that._cache.length < getPreloadPageCount(that) + 1;
      const needToLoadPrevPage = needToLoadPageBeforeLast
        || (that._pageIndex === beginPageIndex && getPreloadPageCount(that, true));

      if (needToLoadPrevPage) {
        result = beginPageIndex - 1;
      }
    }

    if (result < 0) {
      const needToLoadNextPage = beginPageIndex + that._cache.length
        <= that._pageIndex + getPreloadPageCount(that);

      if (needToLoadNextPage) {
        result = beginPageIndex + that._cache.length;
      }
    }
  }

  if (that._loadingPageIndexes[result]) {
    result = -1;
  }

  return result;
};

const loadCore = (
  that: VirtualDataLoader,
  pageIndex: number,
): DeferredObj<unknown> | undefined => {
  const dataOptions = that._dataOptions;

  if (pageIndex === that.pageIndex()
    || (!dataOptions.isLoading() && pageIndex < dataOptions.pageCount())
    || (!dataOptions.hasKnownLastPage() && pageIndex === dataOptions.pageCount())) {
    dataOptions.pageIndex(pageIndex);

    that._loadingPageIndexes[pageIndex] = true;
    return when(dataOptions.load()).always(() => {
      that._loadingPageIndexes[pageIndex] = false;
    });
  }
  return undefined;
};

const processChanged = (
  that: VirtualDataLoader,
  changed: ChangedCallback,
  changeType?: unknown,
  isDelayChanged?: boolean,
  removeCacheItem?: VirtualDataLoaderCacheItem,
): void => {
  const dataOptions = that._dataOptions;
  const items = dataOptions.items().slice();
  let change: ProcessedChange | undefined = isObject(changeType)
    ? changeType as ProcessedChange
    : undefined;
  const isPrepend = changeType === 'prepend';
  const viewportItems = dataOptions.viewportItems();

  if (changeType && isString(changeType) && !that._isDelayChanged) {
    change = {
      changeType,
      items,
    };
    if (removeCacheItem) {
      change.removeCount = removeCacheItem.itemsCount;
      if (change.removeCount && dataOptions.correctCount) {
        change.removeCount = dataOptions.correctCount(viewportItems, change.removeCount, isPrepend);
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
    that._dataOptions.viewportItems(items);
  }
  dataOptions.updateLoading();
  that._lastPageIndex = that.pageIndex();
  that._isDelayChanged = isDelayChanged;

  if (!isDelayChanged) {
    fireChanged(that, changed, change);
  }
};

export class VirtualDataLoader {
  public readonly _dataOptions: VirtualDataLoaderDataOptions;

  public readonly _controller: VirtualDataLoaderController;

  public _pageIndex: number;

  public _cache: VirtualDataLoaderCacheItem[];

  public _loadingPageIndexes: Record<number, boolean>;

  public _lastPageIndex: number;

  private _delayDeferred?: DeferredObj<unknown>;

  public _isChangedFiring?: boolean;

  public _isDelayChanged?: boolean;

  constructor(
    controller: VirtualDataLoaderController,
    dataOptions: VirtualDataLoaderDataOptions,
  ) {
    this._dataOptions = dataOptions;
    this._controller = controller;
    this._lastPageIndex = this._dataOptions.pageIndex();
    this._pageIndex = this._lastPageIndex;
    this._cache = [];
    this._loadingPageIndexes = {};
  }

  public option(name: string): unknown {
    return this._controller.option(name);
  }

  private viewportItemIndexChanged(itemIndex: number): DeferredObj<unknown> | undefined {
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

  public pageIndex(pageIndex?: number): number {
    const isVirtualMode = this._controller.isVirtualMode();
    const isAppendMode = this._controller.isAppendMode();

    if (this.option(LEGACY_SCROLLING_MODE) !== false && (isVirtualMode || isAppendMode)) {
      if (pageIndex !== undefined) {
        this._pageIndex = pageIndex;
      }
      return this._pageIndex;
    }
    return this._dataOptions.pageIndex(pageIndex);
  }

  private beginPageIndex(defaultPageIndex?: number): number {
    let index = getBeginPageIndex(this);
    if (index < 0) {
      index = defaultPageIndex ?? this.pageIndex();
    }
    return index;
  }

  private endPageIndex(): number {
    const endPageIndex = getEndPageIndex(this);

    return endPageIndex > 0 ? endPageIndex : this._lastPageIndex;
  }

  private pageSize(): number {
    return this._dataOptions.pageSize();
  }

  private load(): DeferredObj<unknown> {
    const dataOptions = this._dataOptions;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in branches
    let result: DeferredObj<unknown> | undefined;
    const isVirtualMode = this._controller.isVirtualMode();
    const isAppendMode = this._controller.isAppendMode();

    if (this.option(LEGACY_SCROLLING_MODE) !== false && (isVirtualMode || isAppendMode)) {
      const pageIndexForLoad = getPageIndexForLoad(this);

      if (pageIndexForLoad >= 0) {
        const loadResult = loadCore(this, pageIndexForLoad);
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

  private loadIfNeed(): void {
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

  private handleDataChanged(callBase: ChangedCallback, e?: { changes?: unknown }): void {
    const dataOptions = this._dataOptions;
    let lastCacheLength = this._cache.length;
    const isVirtualMode = this._controller.isVirtualMode();
    const isAppendMode = this._controller.isAppendMode();

    if (e?.changes) {
      fireChanged(this, callBase, e);
    } else if (this.option(LEGACY_SCROLLING_MODE) !== false && (isVirtualMode || isAppendMode)) {
      const beginPageIndex = getBeginPageIndex(this);
      if (beginPageIndex >= 0) {
        if (isVirtualMode && beginPageIndex + this._cache.length !== dataOptions.pageIndex()
          && beginPageIndex - 1 !== dataOptions.pageIndex()) {
          lastCacheLength = 0;
          this._cache = [];
        }
        if (isAppendMode && dataOptions.pageIndex() === 0) {
          this._cache = [];
        } else if (isAppendMode && dataOptions.pageIndex() < getEndPageIndex(this)) {
          fireChanged(this, callBase, { changeType: 'append', items: [] });
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
        processDelayChanged(this, callBase, { isDelayed: true });
      }
      const removeInvisiblePages = canRemoveInvisiblePages && this._cache.length > Math.max(
        getPreloadPageCount(this) + (this.option('scrolling.preloadEnabled') ? 1 : 0),
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

      const isDelayChanged = isVirtualMode && lastCacheLength === 0 && needTwoPagesLoading(this);
      processChanged(
        this,
        callBase,
        this._cache.length > 1 ? changeType : undefined,
        isDelayChanged,
        removeCacheItem,
      );
      this._delayDeferred = this.load().done(() => {
        if (processDelayChanged(this, callBase)) {
          this.load(); // needed for infinite scrolling when height is not defined
        }
      });
    } else {
      processChanged(this, callBase, e);
    }
  }

  public getDelayDeferred(): DeferredObj<unknown> | undefined {
    return this._delayDeferred;
  }

  private itemsCount(isBase?: boolean): number {
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
    let pageIndex = getBeginPageIndex(this);
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
