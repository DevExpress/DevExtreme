import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { getOuterHeight } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type {
  DataChange, PagingOptionName, PagingResult, ProcessedItem, RefreshOptions,
} from '@ts/grids/grid_core/data_controller/types';
import type { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { ModuleType, OptionChanged } from '@ts/grids/grid_core/types';
import type { ItemSizes, VirtualItemsCount } from '@ts/grids/grid_core/virtual_data_loader/types';

import gridCoreUtils, { isInfiniteMode, isVirtualMode, isVirtualPaging } from '../../utils';
import {
  LEGACY_SCROLLING_MODE,
  LOAD_TIMEOUT,
  VISIBLE_PAGE_INDEX,
} from '../const';
import type {
  ChangedLoadParams,
  ContentOffsetType,
  LoadPageParams,
  LoadViewportOptions,
  RowsScrollDataOptions,
  ViewportParams,
  VirtualScrollingDataChange,
  VirtualScrollingDataControllerExtension,
  VirtualScrollingDataSourceAdapter,
} from '../types';
import {
  correctCount,
  isItemCountableByDataSource,
  updateItemIndices,
} from '../utils/items';
import { VirtualScrollController } from '../virtual_scrolling_core';

export const virtualScrollingDataControllerExtender = (
  Base: ModuleType<DataController>,
): ModuleType<
  DataController & VirtualScrollingDataControllerExtension
> => class VirtualScrollingDataControllerExtender extends Base {
  protected declare dataSourceController: DataSourceController<VirtualScrollingDataSourceAdapter>;

  // TODO public controller
  public _rowsScrollController?: VirtualScrollController<ProcessedItem> | null;

  private _loadViewportParams?: ViewportParams | null;

  private _allItems?: ProcessedItem[] | null;

  private _visibleItems?: ProcessedItem[] | null;

  private _rowPageIndex!: number;

  private _viewportChanging?: boolean;

  private _needUpdateViewportAfterLoading?: boolean;

  private _itemCount?: number;

  public dispose(): void {
    const rowsScrollController = this._rowsScrollController;

    rowsScrollController?.dispose();
    super.dispose();
  }

  protected resetDataSource(): DeferredObj<unknown> {
    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    const baseResult: DeferredObj<unknown> = super.resetDataSource()
      ?? Deferred().resolve().promise();

    baseResult.done(this.initVirtualRows.bind(this));

    return baseResult;
  }

  protected loadDataSourceAdapter(): DeferredObj<unknown> {
    if (this._rowsScrollController && isVirtualPaging(this.option('scrolling'))) {
      const { loadPageCount } = isDefined(this._loadViewportParams)
        ? this.getLoadPageParams()
        : { loadPageCount: 0 };

      if (loadPageCount >= 1) {
        this.dataSourceController.getAdapter()?.loadPageCount(loadPageCount);
      }
    }

    return super.loadDataSourceAdapter();
  }

  private getRowPageSize(): number {
    const rowPageSize = this.option('scrolling.rowPageSize');
    const pageSize = this.pageSize();

    return pageSize && pageSize < rowPageSize ? pageSize : rowPageSize;
  }

  public reload(reload?: boolean, changesOnly?: boolean): DeferredObj<unknown> {
    const rowsScrollController = this._rowsScrollController
      ?? this.dataSourceController.getAdapter();
    const itemIndex = Number(rowsScrollController?.getItemIndexByPosition());
    const result = super.reload(reload, changesOnly);
    return result?.done(() => {
      if (isVirtualMode(this.option('scrolling')) || gridCoreUtils.isVirtualRowRendering(this)) {
        const rowIndexOffset = this.getRowIndexOffset();
        const rowIndex = Math.floor(itemIndex) - rowIndexOffset;
        const scrollable = this.component.getScrollable?.();
        const isSortingOperation = this.dataSourceController.operationTypes()?.sorting;

        if (scrollable && !isSortingOperation && rowIndex >= 0) {
          const rowElement = this.component.getRowElement(rowIndex);
          const $rowElement = rowElement?.[0] && $(rowElement[0]);
          let top = $rowElement?.position()?.top;
          const allowedTopOffset = browser.mozilla || browser.chrome ? 1 : 0; // T884308
          if ($rowElement && top && top > allowedTopOffset) {
            top = Math.round(top + Number(getOuterHeight($rowElement)) * (itemIndex % 1));
            scrollable.scrollTo({ top });
          }
        }
      }
    });
  }

  private initVirtualRows(): void {
    const virtualRowsRendering = gridCoreUtils.isVirtualRowRendering(this);
    const isLegacyScrolling = this.option(LEGACY_SCROLLING_MODE) !== false;

    this._allItems = null;
    this._loadViewportParams = null;

    if (!virtualRowsRendering || (isLegacyScrolling && !this.option('scrolling.rowPageSize'))) {
      this._visibleItems = null;
      this._rowsScrollController = null;
      return;
    }

    const pageIndex = !isVirtualMode(this.option('scrolling'))
      && this.pageIndex() >= this.dataSourceController.pageCount()
      ? this.dataSourceController.pageCount() - 1
      : this.pageIndex();
    this._rowPageIndex = Math.ceil((pageIndex * this.pageSize()) / this.getRowPageSize());
    this._visibleItems = isLegacyScrolling ? [] : null;
    this._viewportChanging = false;
    this._needUpdateViewportAfterLoading = false;

    if (!this._rowsScrollController) {
      this._rowsScrollController = new VirtualScrollController(
        this.component,
        this._getRowsScrollDataOptions(),
        true,
      );

      this._rowsScrollController.positionChanged.add(() => {
        if (this.option(LEGACY_SCROLLING_MODE) === false) {
          this._viewportChanging = true;
          this.loadViewport();
          this._viewportChanging = false;
          return;
        }

        if (!this._rowsScrollController) {
          return;
        }

        this.dataSourceController.getAdapter()
          ?.setViewportItemIndex(this._rowsScrollController.getViewportItemIndex());
      });
    }

    if (!isLegacyScrolling) {
      this._updateLoadViewportParams();
    }

    if (this.isLoaded() && isLegacyScrolling) {
      this._rowsScrollController.load();
    }
  }

  private _getRowsScrollDataOptions(): RowsScrollDataOptions {
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- the methods use their own this
    const that = this;
    const isItemCountable = (item: ProcessedItem): boolean => isItemCountableByDataSource(
      item,
      this.dataSourceController.getAdapter(),
    );

    return {
      pageSize(): number {
        return that.getRowPageSize();
      },
      loadedOffset(): number {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- false falls back
        return (isVirtualMode(that.option('scrolling')) && that.dataSourceController.getAdapter()?.lastLoadOptions().skip) || 0;
      },
      loadedItemCount(): number | undefined {
        return that._itemCount;
      },
      renderedItemsRange(): ViewportParams | undefined {
        return that.getRenderedItemsRange();
      },
      totalItemsCount(): number {
        if (isVirtualPaging(that.option('scrolling'))) {
          return that.dataSourceController.totalItemsCount();
        }

        return that.option(LEGACY_SCROLLING_MODE) === false
          // @ts-expect-error the item count is set once the loaded items are processed
          ? that._itemCount
          : that._items.filter(isItemCountable).length;
      },
      hasKnownLastPage(): boolean {
        return that.option(LEGACY_SCROLLING_MODE) === false
          ? that.dataSourceController.hasKnownLastPage()
          : true;
      },
      pageIndex(index?: number): number {
        if (index !== undefined) {
          that._rowPageIndex = index;
        }
        return that._rowPageIndex;
      },
      isLoading(): boolean {
        return that.isLoading();
      },
      pageCount(this: RowsScrollDataOptions): number {
        const pageCount = Math.ceil(this.totalItemsCount() / this.pageSize());
        return pageCount || 1;
      },
      load(this: RowsScrollDataOptions): undefined {
        if (!that._rowsScrollController) {
          return undefined;
        }

        if (that._rowsScrollController.pageIndex() >= this.pageCount()) {
          that._rowPageIndex = this.pageCount() - 1;
          that._rowsScrollController.pageIndex(that._rowPageIndex);
        }

        if (!this.items().length && this.totalItemsCount()) return undefined;

        that._rowsScrollController.handleDataChanged((loaderChange) => {
          if (!that._visibleItems) {
            return;
          }

          // @ts-expect-error the loader change becomes a data change here
          const change: DataChange = loaderChange ?? {};
          change.changeType = change.changeType ?? 'refresh';
          change.items = change.items ?? that._visibleItems;

          that._visibleItems.forEach((item, index) => {
            item.rowIndex = index;
          });
          that._fireChanged(change);
        });

        return undefined;
      },
      updateLoading(): void {
      },
      itemsCount(this: RowsScrollDataOptions): number {
        return this.items(true).length;
      },
      correctCount(items: ProcessedItem[], count: number, fromEnd = false): number {
        return correctCount(items, count, fromEnd, (item, isNextAfterLast, isFromEnd) => {
          if (item.isNewRow) {
            return isNextAfterLast && !isFromEnd;
          }

          if (isNextAfterLast && isFromEnd) {
            return !item.isNewRow;
          }

          return isItemCountable(item);
        });
      },
      items(this: RowsScrollDataOptions, countableOnly?: boolean): ProcessedItem[] {
        let result = that._items;

        if (that.option(LEGACY_SCROLLING_MODE)) {
          const dataSourceAdapter = that.dataSourceController.getAdapter();
          const virtualItemsCount = dataSourceAdapter?.virtualItemsCount();
          const begin = virtualItemsCount ? virtualItemsCount.begin : 0;
          const rowPageSize = that.getRowPageSize();

          let skip = that._rowPageIndex * rowPageSize - begin;
          let take = rowPageSize;

          if (skip < 0) {
            return [];
          }

          if (skip) {
            skip = this.correctCount(result, skip);
            result = result.slice(skip);
          }
          if (take) {
            take = this.correctCount(result, take);
            result = result.slice(0, take);
          }
        }

        return countableOnly ? result.filter(isItemCountable) : result;
      },
      viewportItems(items?: ProcessedItem[]): ProcessedItem[] {
        if (items && that.option(LEGACY_SCROLLING_MODE) !== false) {
          that._visibleItems = items;
        }
        // @ts-expect-error the loader changes the visible items in legacy mode only
        return that._visibleItems;
      },
      onChanged(): void {
      },
      changingDuration(): number {
        const dataSourceAdapter = that.dataSourceController.getAdapter();

        if (dataSourceAdapter?.isLoading() && that.option(LEGACY_SCROLLING_MODE) !== false) {
          return LOAD_TIMEOUT;
        }

        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- NaN falls back
        return dataSourceAdapter?._renderTime || 0;
      },
    };
  }

  protected _updateItemsCore(change: DataChange): void {
    const delta = this.getRowIndexDelta();

    super._updateItemsCore(change);
    if (this.option(LEGACY_SCROLLING_MODE) === false && gridCoreUtils.isVirtualRowRendering(this)) {
      if (change.changeType === 'update'
        && change.rowIndices.length === 0
        && 'cancelEmptyChanges' in change
        && change.cancelEmptyChanges) {
        change.cancel = true;
      }
      return;
    }

    if (!this._rowsScrollController) {
      return;
    }

    if (change.changeType === 'append' && change.items && !change.items.length) {
      return;
    }

    const isRefresh = change.changeType === 'refresh' || change.isLiveUpdate;

    if (isRefresh || change.changeType === 'append' || change.changeType === 'prepend') {
      change.cancel = true;
      if (isRefresh) {
        this._rowsScrollController.reset(true);
      }
      this._rowsScrollController.load();
      return;
    }

    const visibleItems = this._visibleItems;

    if (!visibleItems) {
      return;
    }

    if (change.changeType === 'update') {
      const { changeTypes, items } = change;

      if (changeTypes && items) {
        change.rowIndices.forEach((rowIndex, index) => {
          const changeType = changeTypes[index];
          const newItem = items[index];
          if (changeType === 'update') {
            visibleItems[rowIndex] = newItem;
          } else if (changeType === 'insert') {
            visibleItems.splice(rowIndex, 0, newItem);
          } else if (changeType === 'remove') {
            visibleItems.splice(rowIndex, 1);
          }
        });
      }
    } else {
      visibleItems.forEach((item, index) => {
        visibleItems[index] = this._items[index + delta] || item;
      });
      change.items = visibleItems;
    }

    updateItemIndices(visibleItems);
  }

  private _updateLoadViewportParams(): void {
    if (!this._rowsScrollController) {
      return;
    }

    const viewportParams = this._rowsScrollController.getViewportParams();
    const pageSize = this.pageSize();

    if (viewportParams && !isVirtualPaging(this.option('scrolling')) && pageSize > 0) {
      const pageOffset = this.pageIndex() * pageSize;
      viewportParams.skip += pageOffset;
    }
    this._loadViewportParams = viewportParams;
  }

  private getRenderedItemsRange(): { skip: number; take: number } | undefined {
    const renderedItems = this._items;
    const loadedItems = this._allItems;

    if (!renderedItems.length || !loadedItems?.length) {
      return undefined;
    }

    const loadedItemIndex = loadedItems[0].loadIndex ?? 0;
    const renderedItemIndex = renderedItems[0].loadIndex ?? 0;
    const pageStartItemIndex = isVirtualPaging(this.option('scrolling')) ? 0 : loadedItemIndex;
    const firstItemIndex = renderedItemIndex - pageStartItemIndex;
    const lastItemIndex = (renderedItems[renderedItems.length - 1].loadIndex ?? 0)
      - pageStartItemIndex;

    return {
      skip: firstItemIndex,
      take: lastItemIndex - firstItemIndex + 1,
    };
  }

  protected _processItems(items: RawItemData[], change: DataChange): ProcessedItem[] {
    const processedItems = super._processItems(items, change);

    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      const dataSourceAdapter = this.dataSourceController.getAdapter();
      let currentIndex = dataSourceAdapter?.lastLoadOptions().skip ?? 0;
      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the forEach
      let prevCountable: boolean | undefined;
      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the forEach
      let prevRowType: ProcessedItem['rowType'] | undefined;
      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the forEach
      let isPrevRowNew: boolean | undefined;
      let wasCountableItem = false;
      let newRows: ProcessedItem[] = [];

      processedItems.forEach((item) => {
        const { rowType } = item;
        const itemCountable = isItemCountableByDataSource(item, dataSourceAdapter);

        const isNextGroupItem = rowType === 'group'
          && (!!prevCountable || (prevRowType !== 'group' && currentIndex > 0));
        const isNextDataItem = rowType === 'data'
          && itemCountable
          && (!!prevCountable || prevRowType !== 'group');

        if (!item.isNewRow && isDefined(prevCountable)) {
          const isPrevNewRowFirst = isPrevRowNew && !wasCountableItem;
          if ((isNextGroupItem || isNextDataItem) && !isPrevNewRowFirst) {
            currentIndex += 1;
          }
        }

        if (isNextGroupItem || isNextDataItem) {
          wasCountableItem = true;
        }
        if (item.isNewRow) {
          newRows.push(item);
        } else {
          newRows.forEach((it) => { it.loadIndex = currentIndex; });
          newRows = [];
        }

        item.loadIndex = currentIndex;
        prevCountable = itemCountable;
        prevRowType = rowType;
        isPrevRowNew = item.isNewRow;
      });
      newRows.forEach((it) => { it.loadIndex = currentIndex; });
    }

    return processedItems;
  }

  protected _afterProcessItems(processedItems: ProcessedItem[]): ProcessedItem[] {
    const dataSourceAdapter = this.dataSourceController.getAdapter();

    this._itemCount = processedItems
      .filter((item) => isItemCountableByDataSource(item, dataSourceAdapter))
      .length;

    if (isDefined(this._loadViewportParams)) {
      this._updateLoadViewportParams();

      this._allItems = processedItems;

      if (!processedItems.length) {
        return processedItems;
      }

      const { skipForCurrentPage } = this.getLoadPageParams(true);
      const skip = Number(processedItems[0].loadIndex) + skipForCurrentPage;
      const { take } = this._loadViewportParams;

      return processedItems.filter((it) => {
        const isNewRowInEmptyData = it.isNewRow && it.loadIndex === skip && take === 0;
        const isLoadIndexGreaterStart = Number(it.loadIndex) >= skip;
        const isLoadIndexLessEnd = Number(it.loadIndex) < skip + take || isNewRowInEmptyData;
        return isLoadIndexGreaterStart && isLoadIndexLessEnd;
      });
    }

    return super._afterProcessItems(processedItems);
  }

  protected _applyChange(change: VirtualScrollingDataChange): void {
    const { items, changeType } = change;
    let { removeCount } = change;

    if (removeCount) {
      const fromEnd = changeType === 'prepend';
      const dataSourceAdapter = this.dataSourceController.getAdapter();

      removeCount = correctCount(
        this._items,
        removeCount,
        fromEnd,
        (item, isNextAfterLast) => isItemCountableByDataSource(item, dataSourceAdapter)
          || (item.rowType === 'group' && isNextAfterLast),
      );

      change.removeCount = removeCount;
    }

    switch (changeType) {
      case 'prepend':
        this._items.unshift(...items ?? []);
        if (removeCount) {
          this._items.splice(-removeCount);
        }
        break;
      case 'append':
        this._items.push(...items ?? []);
        if (removeCount) {
          this._items.splice(0, removeCount);
        }
        break;
      default:
        super._applyChange(change);
        break;
    }
  }

  public items(allItems?: boolean): ProcessedItem[] {
    return allItems ? this._allItems ?? this._items : this._visibleItems ?? this._items;
  }

  protected getRowIndexDelta(): number {
    let delta = 0;

    if (this.option(LEGACY_SCROLLING_MODE)) {
      const visibleItems = this._visibleItems;

      if (visibleItems?.[0]) {
        delta = this._items.indexOf(visibleItems[0]);
      }
    }

    return delta < 0 ? 0 : delta;
  }

  public getRowIndexOffset(byLoadedRows?: boolean, needGroupOffset?: boolean): number {
    let offset = 0;
    const dataSourceAdapter = this.dataSourceController.getAdapter();
    const rowsScrollController = this._rowsScrollController;
    const isLegacyScrolling = this.option(LEGACY_SCROLLING_MODE) !== false;
    const scrolling = this.option('scrolling');
    const virtualPaging = isVirtualPaging(scrolling);

    if (rowsScrollController && !byLoadedRows) {
      if (!isLegacyScrolling && isDefined(this._loadViewportParams)) {
        const { skipForCurrentPage, pageIndex } = this.getLoadPageParams(true);
        const items = this.items(true);
        offset = virtualPaging ? pageIndex * this.pageSize() : 0;
        if (items.length) {
          const firstLoadIndex = Number(items[0].loadIndex);
          offset += items
            .filter((item) => Number(item.loadIndex) < firstLoadIndex + skipForCurrentPage)
            .length;
        }
      } else {
        offset = rowsScrollController.beginPageIndex() * rowsScrollController.pageSize();
      }
    } else if (virtualPaging && !isLegacyScrolling && dataSourceAdapter) {
      const lastLoadOptions = dataSourceAdapter.lastLoadOptions();

      const { skips } = lastLoadOptions as { skips?: number[] };
      if (needGroupOffset && skips?.length) {
        offset = skips.reduce((res: number, skip: number) => res + skip, 0);
      } else {
        offset = lastLoadOptions.skip ?? 0;
      }
    } else if (isVirtualMode(scrolling) && dataSourceAdapter) {
      offset = dataSourceAdapter.beginPageIndex() * dataSourceAdapter.pageSize();
    }

    return offset;
  }

  protected getDataIndex(change: DataChange): number {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return this.getRowIndexOffset(true, true);
    }

    const lastVisibleItem = change.changeType === 'append' && this._items.length > 0
      ? this._items.at(-1)
      : null;

    return isDefined(lastVisibleItem?.dataIndex) ? lastVisibleItem.dataIndex + 1 : 0;
  }

  public viewportSize(size?: number): number | undefined {
    const dataSourceAdapter = this.dataSourceController.getAdapter();
    const result = this._rowsScrollController?.viewportSize(size);

    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return result;
    }

    return dataSourceAdapter?.viewportSize(size);
  }

  public viewportHeight(height: number, scrollTop?: number): void {
    this._rowsScrollController?.viewportHeight(height, scrollTop);
  }

  public viewportItemSize(size?: number): number | undefined {
    const dataSourceAdapter = this.dataSourceController.getAdapter();
    const result = this._rowsScrollController?.viewportItemSize(size);

    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return result;
    }

    return dataSourceAdapter?.viewportItemSize(size);
  }

  public setViewportPosition(position: number): void {
    const dataSourceAdapter = this.dataSourceController.getAdapter();
    this._isPaging = false;

    if (this._rowsScrollController) {
      this._rowsScrollController.setViewportPosition(position);
    } else {
      dataSourceAdapter?.setViewportPosition(position);
    }
  }

  public setContentItemSizes(sizes: number[]): void {
    const dataSourceAdapter = this.dataSourceController.getAdapter();
    const result = this._rowsScrollController?.setContentItemSizes(sizes);

    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return result;
    }

    return dataSourceAdapter?.setContentItemSizes(sizes);
  }

  private getPreloadedRowCount(): number {
    const preloadCount = this.option('scrolling.preloadedRowCount');
    const preloadEnabled = this.option('scrolling.preloadEnabled');

    if (isDefined(preloadCount)) {
      return preloadCount;
    }

    const viewportSize = Number(this.viewportSize());

    return preloadEnabled ? 2 * viewportSize : viewportSize;
  }

  private getLoadPageParams(byLoadedPage?: boolean): LoadPageParams {
    const pageSize = this.pageSize();
    // @ts-expect-error the callers update or check the load viewport params first
    const viewportParams: ViewportParams = this._loadViewportParams;
    const lastLoadOptions = this.dataSourceController.getAdapter()?.lastLoadOptions();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- NaN falls back
    const loadedPageIndex = lastLoadOptions?.pageIndex || 0;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- NaN falls back
    const loadedTake = lastLoadOptions?.take || 0;

    // @ts-expect-error the rows scroll controller exists while the viewport params are loaded
    const rowsScrollController: VirtualScrollController<ProcessedItem> = this._rowsScrollController;
    const isScrollingBack = rowsScrollController.isScrollingBack();
    const topPreloadCount = isScrollingBack ? this.getPreloadedRowCount() : 0;
    const bottomPreloadCount = isScrollingBack ? 0 : this.getPreloadedRowCount();
    const totalCountCorrection = this.dataSourceController.getAdapter()?.totalCountCorrection()
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- NaN falls back
      || 0;
    const skipWithPreload = Math.max(0, viewportParams.skip - topPreloadCount);
    const pageIndex = byLoadedPage
      ? loadedPageIndex
      : Math.floor(pageSize ? skipWithPreload / pageSize : 0);
    const pageOffset = pageIndex * pageSize;
    const skipForCurrentPage = viewportParams.skip - pageOffset;
    const loadingTake = viewportParams.take
      + skipForCurrentPage
      + bottomPreloadCount
      - totalCountCorrection;
    const take = byLoadedPage ? loadedTake : loadingTake;
    const loadPageCount = Math.ceil(pageSize ? take / pageSize : 0);

    return {
      pageIndex,
      loadPageCount: Math.max(1, loadPageCount),
      skipForCurrentPage: Math.max(0, skipForCurrentPage),
    };
  }

  private _updateVisiblePageIndex(value?: number): void {
    if (!this._rowsScrollController) {
      return;
    }

    if (isDefined(value)) {
      this._silentOption(VISIBLE_PAGE_INDEX, value);
      this.pageChanged.fire();
      return;
    }

    const viewportItemIndex = this._rowsScrollController.getViewportItemIndex();
    const newPageIndex = Math.floor(viewportItemIndex / this.pageSize());

    if (this.pageIndex() !== newPageIndex) {
      this._silentOption(VISIBLE_PAGE_INDEX, newPageIndex);
      this.updateItems({
        changeType: 'pageIndex',
      });
    }
  }

  private _getChangedLoadParams(): ChangedLoadParams | null {
    const loadedPageParams = this.getLoadPageParams(true);
    const { pageIndex, loadPageCount } = this.getLoadPageParams();
    const pageIndexIsValid = this._pageIndexIsValid(pageIndex);
    const loadParamsChanged = pageIndex !== loadedPageParams.pageIndex
      || loadPageCount !== loadedPageParams.loadPageCount;

    if (!this._isLoading && pageIndexIsValid && loadParamsChanged) {
      return {
        pageIndex,
        loadPageCount,
      };
    }

    return null;
  }

  private _pageIndexIsValid(pageIndex: number): boolean {
    const scrolling = this.option('scrolling');

    if ((isInfiniteMode(scrolling) && this.dataSourceController.hasKnownLastPage())
      || isVirtualMode(scrolling)) {
      return pageIndex * this.pageSize() < this.dataSourceController.totalItemsCount();
    }

    return true;
  }

  private isAllLoadedInAppendMode(): boolean {
    const loadedItemCount = this.pageSize()
      * (this.dataSourceController.getAdapter()?.loadPageCount() ?? 0);

    return isInfiniteMode(this.option('scrolling')) && this.dataSourceController.totalItemsCount() < loadedItemCount;
  }

  // T1326786: the grid is scrolled to paging.pageIndex on the first resize only,
  // until then the viewport is at the top and the loaded page is below it
  private isScrollToPagePending(changedParams: ChangedLoadParams): boolean {
    const loadedPageIndex = this.dataSourceController.getAdapter()?.pageIndex() ?? 0;
    const viewportIsAtTop = this._rowsScrollController?.getViewportItemIndex() === 0;
    const pageIndexAfterViewport = changedParams.pageIndex + changedParams.loadPageCount;

    return viewportIsAtTop && loadedPageIndex >= pageIndexAfterViewport;
  }

  private needToSkipViewportLoad(
    changedParams: ChangedLoadParams | null,
    viewportIsFilled: boolean,
  ): boolean {
    const isRepaintMode = this.option('editing.refreshMode') === 'repaint';

    if (isRepaintMode && viewportIsFilled) { // T1082889
      return true;
    }

    if (!changedParams) {
      return false;
    }

    const loadedPageIndex = this.dataSourceController.getAdapter()?.pageIndex() ?? 0;

    if (changedParams.pageIndex > loadedPageIndex) { // T1049853
      return true;
    }

    if (changedParams.pageIndex === loadedPageIndex) {
      return this.isAllLoadedInAppendMode();
    }

    return this.isScrollToPagePending(changedParams);
  }

  private _loadItems(checkLoading: boolean | undefined, viewportIsFilled: boolean): boolean {
    if (!this.dataSourceController.getAdapter()) {
      return false;
    }

    const virtualPaging = isVirtualPaging(this.option('scrolling'));
    const changedParams = this._getChangedLoadParams();

    if (virtualPaging && checkLoading
      && this.needToSkipViewportLoad(changedParams, viewportIsFilled)) {
      return false;
    }

    if (virtualPaging && this._isLoading) {
      this._needUpdateViewportAfterLoading = true;
    }

    if (!virtualPaging || !changedParams) {
      return false;
    }

    this.loadPages(changedParams);

    return true;
  }

  private loadPages(changedParams: ChangedLoadParams): void {
    const dataSourceAdapter = this.dataSourceController.getAdapter();

    if (!dataSourceAdapter) {
      return;
    }

    dataSourceAdapter.pageIndex(changedParams.pageIndex);
    dataSourceAdapter.loadPageCount(changedParams.loadPageCount);
    this._repaintChangesOnly = true;
    this._needUpdateDimensions = true;

    const viewportChanging = this._viewportChanging;

    this.load().always(() => {
      this._repaintChangesOnly = undefined;
      this._needUpdateDimensions = undefined;
    }).done(() => {
      this.handlePagesLoaded(viewportChanging);
    });
  }

  private handlePagesLoaded(viewportChanging: boolean | undefined): void {
    const isLastPage = this.dataSourceController.pageCount() > 0
      && this.pageIndex() === this.dataSourceController.pageCount() - 1;

    if (viewportChanging || isLastPage) {
      this._updateVisiblePageIndex();
    }

    if (this._needUpdateViewportAfterLoading) {
      this._needUpdateViewportAfterLoading = false;
      this.loadViewport({ checkLoadedParamsOnly: true });
    }
  }

  private loadViewport(params?: LoadViewportOptions): void {
    const { checkLoadedParamsOnly, checkLoading, viewportIsNotFilled } = params ?? {};
    const virtualPaging = isVirtualPaging(this.option('scrolling'));

    if (virtualPaging || gridCoreUtils.isVirtualRowRendering(this)) {
      this._updateLoadViewportParams();

      const loadingItemsStarted = this._loadItems(checkLoading, !viewportIsNotFilled);
      const isCustomLoading = this.dataSourceController.getAdapter()?.customLoader.isLoading();
      const isLoading = !!checkLoading && !isCustomLoading && this._isLoading;
      const needToUpdateItems = !(loadingItemsStarted || isLoading || checkLoadedParamsOnly);

      if (needToUpdateItems) {
        const noPendingChangesInEditing = !this.option('editing.changes')?.length;
        this.updateItems({
          changeType: 'refresh',
          repaintChangesOnly: true,
          needUpdateDimensions: true,
          useProcessedItemsCache: noPendingChangesInEditing,
          cancelEmptyChanges: true,
        });
      }
    }
  }

  public updateViewport(): void {
    const viewportSize = Number(this.viewportSize());
    const itemCount = this.items().length;
    const viewportIsNotFilled = viewportSize > itemCount;
    const currentTake = this._loadViewportParams?.take ?? 0;
    const newTake = this._rowsScrollController?.getViewportParams().take ?? 0;

    const needsMoreItems = viewportIsNotFilled || currentTake < newTake;

    if (needsMoreItems && !this._isPaging && itemCount) {
      this.loadViewport({
        checkLoading: true,
        viewportIsNotFilled,
      });
    }
  }

  public loadIfNeed(): void {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return;
    }

    const rowsScrollController = this._rowsScrollController;
    rowsScrollController?.loadIfNeed();

    const dataSourceAdapter = this.dataSourceController.getAdapter();
    dataSourceAdapter?.loadIfNeed();
  }

  public getItemSize(): number | undefined {
    const rowsScrollController = this._rowsScrollController;

    if (rowsScrollController) {
      return rowsScrollController.getItemSize();
    }

    const dataSourceAdapter = this.dataSourceController.getAdapter();
    return dataSourceAdapter?.getItemSize();
  }

  public getItemSizes(): ItemSizes | undefined {
    const rowsScrollController = this._rowsScrollController;

    if (rowsScrollController) {
      return rowsScrollController.getItemSizes();
    }

    const dataSourceAdapter = this.dataSourceController.getAdapter();
    return dataSourceAdapter?.getItemSizes();
  }

  public getContentOffset(type?: ContentOffsetType): number | undefined {
    const rowsScrollController = this._rowsScrollController;

    if (rowsScrollController) {
      return rowsScrollController.getContentOffset(type);
    }

    const dataSourceAdapter = this.dataSourceController.getAdapter();
    return dataSourceAdapter?.getContentOffset(type);
  }

  public refresh(options?: boolean | RefreshOptions): DeferredObj<unknown> {
    const dataSourceAdapter = this.dataSourceController.getAdapter();

    if (dataSourceAdapter && typeof options !== 'boolean' && options?.load && isInfiniteMode(this.option('scrolling'))) {
      dataSourceAdapter.resetCurrentTotalCount();
    }

    return super.refresh(options);
  }

  public virtualItemsCount(): VirtualItemsCount | undefined {
    const rowsScrollController = this._rowsScrollController;

    if (rowsScrollController) {
      return rowsScrollController.virtualItemsCount();
    }

    return this.dataSourceController.getAdapter()?.virtualItemsCount();
  }

  public pageIndex(): number;
  public pageIndex(value: number): DeferredObj<unknown>;
  public pageIndex(pageIndex?: number): PagingResult {
    const rowsScrollController = this._rowsScrollController;
    if (this.isNewModeVirtualPaging() && rowsScrollController) {
      if (pageIndex === undefined) {
        return this.option(VISIBLE_PAGE_INDEX) ?? 0;
      }
    }
    return pageIndex === undefined ? super.pageIndex() : super.pageIndex(pageIndex);
  }

  private isNewModeVirtualPaging(): boolean {
    return this.option(LEGACY_SCROLLING_MODE) === false && isVirtualPaging(this.option('scrolling'));
  }

  protected _fireChanged(e: DataChange): void {
    super._fireChanged(e);

    if (this.isNewModeVirtualPaging() && e.operationTypes) {
      const { fullReload, pageIndex } = e.operationTypes;
      const dataSourceAdapter = this.dataSourceController.getAdapter();

      if (e.isDataChanged && !fullReload && pageIndex && dataSourceAdapter) {
        this._updateVisiblePageIndex(dataSourceAdapter.pageIndex());
      }
    }
  }

  protected _getPagingOptionValue(optionName: PagingOptionName): number {
    if (this.isNewModeVirtualPaging()) {
      return this[optionName]();
    }

    return super._getPagingOptionValue(optionName);
  }

  protected resolvePaginate(enabled: boolean | undefined): boolean | undefined {
    if (enabled === undefined) {
      return undefined;
    }

    return enabled || isVirtualPaging(this.option('scrolling'));
  }

  protected requiresTotalCount(): boolean {
    return !isInfiniteMode(this.option('scrolling'));
  }

  public optionChanged(args: OptionChanged): void {
    if (args.name === 'scrolling') {
      args.handled = true;
      this.reset();
      return;
    }

    super.optionChanged(args);
  }

  public isEmpty(): boolean {
    return this.option(LEGACY_SCROLLING_MODE) === false
      ? !this.items(true).length
      : super.isEmpty();
  }

  public isLastPageLoaded(): boolean {
    let result = false;

    if (this.isNewModeVirtualPaging()) {
      const { pageIndex, loadPageCount } = this.getLoadPageParams(true);
      const pageCount = this.dataSourceController.pageCount();

      result = pageIndex + loadPageCount >= pageCount;
    } else {
      result = super.isLastPageLoaded();
    }

    return result;
  }

  public reset(): void {
    this._itemCount = 0;
    this._allItems = null;
    super.reset();
  }

  protected applyFilter(): DeferredObj<unknown> {
    this.dataSourceController.getAdapter()?.loadPageCount(1);

    return super.applyFilter();
  }

  public isViewportChanging(): boolean {
    return !!this._viewportChanging || super.isViewportChanging();
  }
};
