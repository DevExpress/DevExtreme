/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable prefer-rest-params */
/* eslint-disable @stylistic/max-len */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable prefer-spread */
/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
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
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import type { VirtualItemsCount } from '@ts/grids/grid_core/virtual_data_loader/types';

import gridCoreUtils from '../../m_utils';
import {
  LEGACY_SCROLLING_MODE,
  LOAD_TIMEOUT,
  VISIBLE_PAGE_INDEX,
} from '../const';
import { VirtualScrollController } from '../m_virtual_scrolling_core';
import type { ChangedLoadParams } from '../types';
import {
  correctCount,
  isItemCountableByDataSource,
  updateItemIndices,
} from '../utils/items';
import {
  isAppendMode,
  isVirtualMode,
  isVirtualPaging,
} from '../utils/scrolling_mode';

export interface VirtualScrollingDataControllerExtension {
  virtualItemsCount: () => VirtualItemsCount | undefined;
}

export const virtualScrollingDataControllerExtender = (
  Base: ModuleType<DataController>,
): ModuleType<
  DataController & VirtualScrollingDataControllerExtension
> => class VirtualScrollingDataControllerExtender extends Base {
  private _loadViewportParams: any;

  private _allItems: any;

  private _visibleItems: any;

  private _rowPageIndex: any;

  private _viewportChanging: any;

  private _needUpdateViewportAfterLoading: any;

  private _itemCount: any;

  public dispose(): void {
    const rowsScrollController = this._rowsScrollController;

    rowsScrollController?.dispose();
    super.dispose.apply(this, arguments as any);
  }

  protected _refreshDataSource(): DeferredObj<unknown> {
    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    const baseResult: DeferredObj<unknown> = super._refreshDataSource() ?? Deferred().resolve().promise();

    baseResult.done(this.initVirtualRows.bind(this));

    return baseResult;
  }

  protected _loadDataSource(): DeferredObj<unknown> {
    if (this._rowsScrollController && isVirtualPaging(this)) {
      const { loadPageCount } = isDefined(this._loadViewportParams) ? this.getLoadPageParams() : { loadPageCount: 0 };

      loadPageCount >= 1 && this._dataSource?.loadPageCount(loadPageCount);
    }

    return super._loadDataSource.apply(this, arguments as any);
  }

  private getRowPageSize() {
    const rowPageSize = this.option('scrolling.rowPageSize');
    const pageSize = this.pageSize();

    return pageSize && pageSize < rowPageSize ? pageSize : rowPageSize;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public reload(reload?: boolean, changesOnly?: boolean): DeferredObj<unknown> {
    const rowsScrollController = this._rowsScrollController || this._dataSource;
    const itemIndex = rowsScrollController?.getItemIndexByPosition();
    const result = super.reload.apply(this, arguments as any);
    return result?.done(() => {
      if (isVirtualMode(this) || gridCoreUtils.isVirtualRowRendering(this)) {
        const rowIndexOffset = this.getRowIndexOffset();
        const rowIndex = Math.floor(itemIndex) - rowIndexOffset;
        const { component } = this;
        const scrollable = component.getScrollable && component.getScrollable();
        const isSortingOperation = this.dataSource().operationTypes().sorting;

        if (scrollable && !isSortingOperation && rowIndex >= 0) {
          const rowElement = component.getRowElement(rowIndex);
          const $rowElement = rowElement?.[0] && $(rowElement[0]);
          let top = $rowElement?.position()?.top;
          const isChromeLatest = browser.chrome && Number(browser.version ?? 0) >= 91;
          const allowedTopOffset = browser.mozilla || isChromeLatest ? 1 : 0; // T884308
          if (top && top > allowedTopOffset) {
            top = Math.round(top + getOuterHeight($rowElement) * (itemIndex % 1));
            scrollable.scrollTo({ y: top });
          }
        }
      }
    });
  }

  private initVirtualRows() {
    const virtualRowsRendering = gridCoreUtils.isVirtualRowRendering(this);

    this._allItems = null;
    this._loadViewportParams = null;

    if (this.option('scrolling.mode') !== 'virtual' && !virtualRowsRendering || !virtualRowsRendering || this.option(LEGACY_SCROLLING_MODE) !== false && !this.option('scrolling.rowPageSize')) {
      this._visibleItems = null;
      this._rowsScrollController = null;
      return;
    }

    const pageIndex = !isVirtualMode(this) && this.pageIndex() >= this.pageCount() ? this.pageCount() - 1 : this.pageIndex();
    this._rowPageIndex = Math.ceil(pageIndex * this.pageSize() / this.getRowPageSize());
    this._visibleItems = this.option(LEGACY_SCROLLING_MODE) === false ? null : [];
    this._viewportChanging = false;
    this._needUpdateViewportAfterLoading = false;

    if (!this._rowsScrollController) {
      this._rowsScrollController = new VirtualScrollController(this.component, this._getRowsScrollDataOptions(), true);

      this._rowsScrollController.positionChanged.add(() => {
        if (this.option(LEGACY_SCROLLING_MODE) === false) {
          this._viewportChanging = true;
          this.loadViewport();
          this._viewportChanging = false;
          return;
        }
        this._dataSource?.setViewportItemIndex(this._rowsScrollController!.getViewportItemIndex());
      });
    }

    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      this._updateLoadViewportParams();
    }

    if (this.isLoaded() && this.option(LEGACY_SCROLLING_MODE) !== false) {
      this._rowsScrollController.load();
    }
  }

  private _getRowsScrollDataOptions() {
    const that = this;
    const isItemCountable = function (item) {
      return isItemCountableByDataSource(item, that._dataSource);
    };

    return {
      pageSize() {
        return that.getRowPageSize();
      },
      loadedOffset() {
        return isVirtualMode(that) && that._dataSource?.lastLoadOptions().skip || 0;
      },
      loadedItemCount() {
        return that._itemCount;
      },
      totalItemsCount() {
        if (isVirtualPaging(that)) {
          return that.totalItemsCount();
        }

        return that.option(LEGACY_SCROLLING_MODE) === false ? that._itemCount : that._items.filter(isItemCountable).length;
      },
      hasKnownLastPage() {
        return that.option(LEGACY_SCROLLING_MODE) === false ? that.hasKnownLastPage() : true;
      },
      pageIndex(index) {
        if (index !== undefined) {
          that._rowPageIndex = index;
        }
        return that._rowPageIndex;
      },
      isLoading() {
        return that.isLoading();
      },
      pageCount() {
        const pageCount = Math.ceil(this.totalItemsCount() / this.pageSize());
        return pageCount || 1;
      },
      load() {
        if (that._rowsScrollController!.pageIndex() >= this.pageCount()) {
          that._rowPageIndex = this.pageCount() - 1;
          that._rowsScrollController!.pageIndex(that._rowPageIndex);
        }

        if (!this.items().length && this.totalItemsCount()) return;

        that._rowsScrollController!.handleDataChanged((change) => {
          change = change || {};
          change.changeType = change.changeType || 'refresh';
          change.items = change.items || that._visibleItems;

          that._visibleItems.forEach((item, index) => {
            item.rowIndex = index;
          });
          that._fireChanged(change);
        });
      },
      updateLoading() {
      },
      itemsCount() {
        return this.items(true).length;
      },
      correctCount(items: ProcessedItem[], count, fromEnd) {
        return correctCount(items, count, fromEnd, (item, isNextAfterLast, fromEnd) => {
          if (item.isNewRow) {
            return isNextAfterLast && !fromEnd;
          }

          if (isNextAfterLast && fromEnd) {
            return !item.isNewRow;
          }

          return isItemCountable(item);
        });
      },
      items(countableOnly) {
        let result = that._items;

        if (that.option(LEGACY_SCROLLING_MODE)) {
          const dataSource = that.dataSource();
          const virtualItemsCount = dataSource?.virtualItemsCount();
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
      viewportItems(items) {
        if (items && that.option(LEGACY_SCROLLING_MODE) !== false) {
          that._visibleItems = items;
        }
        return that._visibleItems;
      },
      onChanged() {
      },
      changingDuration() {
        const dataSource = that.dataSource();

        if (dataSource?.isLoading() && that.option(LEGACY_SCROLLING_MODE) !== false) {
          return LOAD_TIMEOUT;
        }

        return dataSource?._renderTime || 0;
      },
    };
  }

  protected _updateItemsCore(change) {
    const delta = this.getRowIndexDelta();

    super._updateItemsCore.apply(this, arguments as any);
    if (this.option(LEGACY_SCROLLING_MODE) === false && gridCoreUtils.isVirtualRowRendering(this)) {
      if (change.changeType === 'update' && change.rowIndices.length === 0 && change.cancelEmptyChanges) {
        change.cancel = true;
      }
      return;
    }

    const rowsScrollController = this._rowsScrollController;

    if (rowsScrollController) {
      const visibleItems = this._visibleItems;
      const isRefresh = change.changeType === 'refresh' || change.isLiveUpdate;

      if (change.changeType === 'append' && change.items && !change.items.length) return;

      if (isRefresh || change.changeType === 'append' || change.changeType === 'prepend') {
        change.cancel = true;
        isRefresh && rowsScrollController.reset(true);
        rowsScrollController.load();
      } else {
        if (change.changeType === 'update') {
          change.rowIndices.forEach((rowIndex, index) => {
            const changeType = change.changeTypes[index];
            const newItem = change.items[index];
            if (changeType === 'update') {
              visibleItems[rowIndex] = newItem;
            } else if (changeType === 'insert') {
              visibleItems.splice(rowIndex, 0, newItem);
            } else if (changeType === 'remove') {
              visibleItems.splice(rowIndex, 1);
            }
          });
        } else {
          visibleItems.forEach((item, index) => {
            visibleItems[index] = this._items[index + delta] || visibleItems[index];
          });
          change.items = visibleItems;
        }

        updateItemIndices(visibleItems);
      }
    }
  }

  private _updateLoadViewportParams() {
    const viewportParams = this._rowsScrollController!.getViewportParams();
    const pageSize = this.pageSize();

    if (viewportParams && !isVirtualPaging(this) && pageSize > 0) {
      const pageOffset = this.pageIndex() * pageSize;
      viewportParams.skip += pageOffset;
    }
    this._loadViewportParams = viewportParams;
  }

  protected _processItems(items: RawItemData[], change: DataChange): ProcessedItem[] {
    const processedItems = super._processItems(items, change);

    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      const dataSource = this._dataSource;
      let currentIndex = dataSource?.lastLoadOptions().skip ?? 0;
      let prevCountable;
      let prevRowType;
      let isPrevRowNew;
      let wasCountableItem = false;
      let newRows: any = [];

      processedItems.forEach((item) => {
        const { rowType } = item;
        const itemCountable = isItemCountableByDataSource(item, dataSource);

        const isNextGroupItem = rowType === 'group' && (prevCountable || (prevRowType !== 'group' && currentIndex > 0));
        const isNextDataItem = rowType === 'data' && itemCountable && (prevCountable || prevRowType !== 'group');

        if (!item.isNewRow && isDefined(prevCountable)) {
          const isPrevNewRowFirst = isPrevRowNew && !wasCountableItem;
          if ((isNextGroupItem || isNextDataItem) && !isPrevNewRowFirst) {
            currentIndex++;
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
    this._itemCount = processedItems.filter((item) => isItemCountableByDataSource(item, this._dataSource)).length;

    if (isDefined(this._loadViewportParams)) {
      this._updateLoadViewportParams();

      let result = processedItems;
      this._allItems = processedItems;

      if (processedItems.length) {
        const { skipForCurrentPage } = this.getLoadPageParams(true);
        const skip = processedItems[0].loadIndex! + skipForCurrentPage;
        const { take } = this._loadViewportParams;

        result = processedItems.filter((it) => {
          const isNewRowInEmptyData = it.isNewRow && it.loadIndex === skip && take === 0;
          const isLoadIndexGreaterStart = it.loadIndex! >= skip;
          const isLoadIndexLessEnd = it.loadIndex! < skip + take || isNewRowInEmptyData;
          return isLoadIndexGreaterStart && isLoadIndexLessEnd;
        });
      }

      return result;
    }

    return super._afterProcessItems(processedItems);
  }

  protected _applyChange(change) {
    const that = this;
    const { items } = change;
    const { changeType } = change;
    let { removeCount } = change;

    if (removeCount) {
      const fromEnd = changeType === 'prepend';
      removeCount = correctCount(that._items, removeCount, fromEnd, (item, isNextAfterLast) => isItemCountableByDataSource(item, that._dataSource) || (item.rowType === 'group' && isNextAfterLast));

      change.removeCount = removeCount;
    }

    switch (changeType) {
      case 'prepend':
        that._items.unshift.apply(that._items, items);
        if (removeCount) {
          that._items.splice(-removeCount);
        }
        break;
      case 'append':
        that._items.push.apply(that._items, items);
        if (removeCount) {
          that._items.splice(0, removeCount);
        }
        break;
      default:
        super._applyChange(change);
        break;
    }
  }

  public items(allItems?) {
    return allItems ? this._allItems || this._items : this._visibleItems || this._items;
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

  public getRowIndexOffset(byLoadedRows?, needGroupOffset?) {
    let offset = 0;
    const dataSource = this.dataSource();
    const rowsScrollController = this._rowsScrollController;
    const newMode = this.option(LEGACY_SCROLLING_MODE) === false;
    const virtualPaging = isVirtualPaging(this);

    if (rowsScrollController && !byLoadedRows) {
      if (newMode && isDefined(this._loadViewportParams)) {
        const { skipForCurrentPage, pageIndex } = this.getLoadPageParams(true);
        const items = this.items(true);
        offset = virtualPaging ? pageIndex * this.pageSize() : 0;
        if (items.length) {
          const firstLoadIndex = items[0].loadIndex;
          offset += items.filter((item) => item.loadIndex < firstLoadIndex + skipForCurrentPage).length;
        }
      } else {
        offset = rowsScrollController.beginPageIndex() * rowsScrollController.pageSize();
      }
    } else if (virtualPaging && newMode && dataSource) {
      const lastLoadOptions = dataSource.lastLoadOptions();

      if (needGroupOffset && lastLoadOptions.skips?.length) {
        offset = lastLoadOptions.skips.reduce((res: number, skip: number) => res + skip, 0);
      } else {
        offset = lastLoadOptions.skip ?? 0;
      }
    } else if (isVirtualMode(this) && dataSource) {
      offset = dataSource.beginPageIndex() * dataSource.pageSize();
    }

    return offset;
  }

  protected getDataIndex(change: DataChange): number {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return this.getRowIndexOffset(true, true);
    }

    // @ts-expect-error changeType can be 'append' only when virtual scrolling with scrolling.legacyMode are enabled
    const lastVisibleItem = change.changeType === 'append' && this._items.length > 0
      ? this._items.at(-1)
      : null;

    return isDefined(lastVisibleItem?.dataIndex) ? lastVisibleItem!.dataIndex + 1 : 0;
  }

  private viewportSize() {
    const rowsScrollController = this._rowsScrollController;
    const dataSource = this._dataSource;
    // @ts-expect-error
    const result = rowsScrollController?.viewportSize.apply(rowsScrollController, arguments);

    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return result;
    }

    return dataSource?.viewportSize.apply(dataSource, arguments);
  }

  private viewportHeight(height, scrollTop) {
    this._rowsScrollController?.viewportHeight(height, scrollTop);
  }

  private viewportItemSize() {
    const rowsScrollController = this._rowsScrollController;
    const dataSource = this._dataSource;
    // @ts-expect-error
    const result = rowsScrollController?.viewportItemSize.apply(rowsScrollController, arguments);

    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return result;
    }

    return dataSource?.viewportItemSize.apply(dataSource, arguments);
  }

  private setViewportPosition() {
    const rowsScrollController = this._rowsScrollController;
    const dataSource = this._dataSource;
    this._isPaging = false;

    if (rowsScrollController) {
      // @ts-expect-error
      rowsScrollController.setViewportPosition.apply(rowsScrollController, arguments);
    } else {
      dataSource?.setViewportPosition.apply(dataSource, arguments);
    }
  }

  private setContentItemSizes(sizes) {
    const rowsScrollController = this._rowsScrollController;
    const dataSource = this._dataSource;
    const result = rowsScrollController?.setContentItemSizes(sizes);

    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return result;
    }

    return dataSource?.setContentItemSizes(sizes);
  }

  private getPreloadedRowCount() {
    const preloadCount = this.option('scrolling.preloadedRowCount');
    const preloadEnabled = this.option('scrolling.preloadEnabled');

    if (isDefined(preloadCount)) {
      return preloadCount;
    }

    const viewportSize = this.viewportSize();

    return preloadEnabled ? 2 * viewportSize : viewportSize;
  }

  private getLoadPageParams(byLoadedPage?) {
    const pageSize = this.pageSize();
    const viewportParams = this._loadViewportParams;
    const lastLoadOptions = this._dataSource?.lastLoadOptions();
    const loadedPageIndex = lastLoadOptions?.pageIndex || 0;
    const loadedTake = lastLoadOptions?.take || 0;

    const isScrollingBack = this._rowsScrollController!.isScrollingBack();
    const topPreloadCount = isScrollingBack ? this.getPreloadedRowCount() : 0;
    const bottomPreloadCount = isScrollingBack ? 0 : this.getPreloadedRowCount();
    const totalCountCorrection = this._dataSource?.totalCountCorrection() || 0;
    const skipWithPreload = Math.max(0, viewportParams.skip - topPreloadCount);
    const pageIndex = byLoadedPage ? loadedPageIndex : Math.floor(pageSize ? skipWithPreload / pageSize : 0);
    const pageOffset = pageIndex * pageSize;
    const skipForCurrentPage = viewportParams.skip - pageOffset;
    const loadingTake = viewportParams.take + skipForCurrentPage + bottomPreloadCount - totalCountCorrection;
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
    let result: ChangedLoadParams | null = null;

    if (!this._isLoading && pageIndexIsValid && (pageIndex !== loadedPageParams.pageIndex || loadPageCount !== loadedPageParams.loadPageCount)) {
      result = {
        pageIndex,
        loadPageCount,
      };
    }
    return result;
  }

  private _pageIndexIsValid(pageIndex) {
    let result = true;

    if (isAppendMode(this) && this.hasKnownLastPage() || isVirtualMode(this)) {
      result = pageIndex * this.pageSize() < this.totalItemsCount();
    }

    return result;
  }

  private isAllLoadedInAppendMode(): boolean {
    const loadedItemCount = this.pageSize() * (this._dataSource?.loadPageCount() ?? 0);

    return isAppendMode(this) && this.totalItemsCount() < loadedItemCount;
  }

  // T1326786: the grid is scrolled to paging.pageIndex on the first resize only,
  // until then the viewport is at the top and the loaded page is below it
  private isScrollToPagePending(changedParams: ChangedLoadParams): boolean {
    const loadedPageIndex = this._dataSource?.pageIndex() ?? 0;
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

    const loadedPageIndex = this._dataSource?.pageIndex() ?? 0;

    if (changedParams.pageIndex > loadedPageIndex) { // T1049853
      return true;
    }

    if (changedParams.pageIndex === loadedPageIndex) {
      return this.isAllLoadedInAppendMode();
    }

    return this.isScrollToPagePending(changedParams);
  }

  private _loadItems(checkLoading: boolean, viewportIsFilled: boolean): boolean {
    if (!this._dataSource) {
      return false;
    }

    const virtualPaging = isVirtualPaging(this);
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
    this._dataSource.pageIndex(changedParams.pageIndex);
    this._dataSource.loadPageCount(changedParams.loadPageCount);
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

  private handlePagesLoaded(viewportChanging: boolean): void {
    const isLastPage = this.pageCount() > 0 && this.pageIndex() === this.pageCount() - 1;

    if (viewportChanging || isLastPage) {
      this._updateVisiblePageIndex();
    }

    if (this._needUpdateViewportAfterLoading) {
      this._needUpdateViewportAfterLoading = false;
      this.loadViewport({ checkLoadedParamsOnly: true });
    }
  }

  private loadViewport(params?) {
    const { checkLoadedParamsOnly, checkLoading, viewportIsNotFilled } = params ?? {};
    const virtualPaging = isVirtualPaging(this);

    if (virtualPaging || gridCoreUtils.isVirtualRowRendering(this)) {
      this._updateLoadViewportParams();

      const loadingItemsStarted = this._loadItems(checkLoading, !viewportIsNotFilled);
      const isCustomLoading = this._dataSource?.isCustomLoading();
      const isLoading = checkLoading && !isCustomLoading && this._isLoading;
      const needToUpdateItems = !(loadingItemsStarted
                        || isLoading
                        || checkLoadedParamsOnly);

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

  private updateViewport() {
    const viewportSize = this.viewportSize();
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

  private loadIfNeed() {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return;
    }

    const rowsScrollController = this._rowsScrollController;
    rowsScrollController?.loadIfNeed();

    const dataSource = this._dataSource;
    return dataSource?.loadIfNeed();
  }

  private getItemSize() {
    const rowsScrollController = this._rowsScrollController;

    if (rowsScrollController) {
      // @ts-expect-error
      return rowsScrollController.getItemSize.apply(rowsScrollController, arguments);
    }

    const dataSource = this._dataSource;
    return dataSource?.getItemSize.apply(dataSource, arguments);
  }

  private getItemSizes() {
    const rowsScrollController = this._rowsScrollController;

    if (rowsScrollController) {
      // @ts-expect-error
      return rowsScrollController.getItemSizes.apply(rowsScrollController, arguments);
    }

    const dataSource = this._dataSource;
    return dataSource?.getItemSizes.apply(dataSource, arguments);
  }

  private getContentOffset() {
    const rowsScrollController = this._rowsScrollController;

    if (rowsScrollController) {
      // @ts-expect-error
      return rowsScrollController.getContentOffset.apply(rowsScrollController, arguments);
    }

    const dataSource = this._dataSource;
    return dataSource?.getContentOffset.apply(dataSource, arguments);
  }

  public refresh(options?: boolean | RefreshOptions): DeferredObj<unknown> {
    const dataSource = this._dataSource;

    if (dataSource && typeof options !== 'boolean' && options?.load && isAppendMode(this)) {
      dataSource.resetCurrentTotalCount();
    }

    return super.refresh.apply(this, arguments as any);
  }

  private topItemIndex() {
    return this._loadViewportParams?.skip;
  }

  private bottomItemIndex() {
    const viewportParams = this._loadViewportParams;
    return viewportParams && viewportParams.skip + viewportParams.take;
  }

  public virtualItemsCount(): VirtualItemsCount | undefined {
    const rowsScrollController = this._rowsScrollController;

    if (rowsScrollController) {
      return rowsScrollController.virtualItemsCount();
    }

    return this._dataSource?.virtualItemsCount() as VirtualItemsCount | undefined;
  }

  public pageIndex(): number;
  public pageIndex(value: number): DeferredObj<unknown>;
  public pageIndex(pageIndex?): PagingResult {
    const virtualPaging = isVirtualPaging(this);
    const rowsScrollController = this._rowsScrollController;
    if (this.option(LEGACY_SCROLLING_MODE) === false && virtualPaging && rowsScrollController) {
      if (pageIndex === undefined) {
        return this.option(VISIBLE_PAGE_INDEX) ?? 0;
      }
    }
    return super.pageIndex.apply(this, arguments as any);
  }

  protected _fireChanged(e: DataChange): void {
    super._fireChanged.apply(this, arguments as any);

    const { operationTypes } = e;
    if (this.option(LEGACY_SCROLLING_MODE) === false && isVirtualPaging(this) && operationTypes) {
      const { fullReload, pageIndex } = operationTypes;

      if (e.isDataChanged && !fullReload && pageIndex) {
        this._updateVisiblePageIndex(this._dataSource.pageIndex());
      }
    }
  }

  protected _getPagingOptionValue(optionName: PagingOptionName): number {
    let result = super._getPagingOptionValue.apply(this, arguments as any);

    if (this.option(LEGACY_SCROLLING_MODE) === false && isVirtualPaging(this)) {
      result = this[optionName]();
    }

    return result;
  }

  public isEmpty(): boolean {
    return this.option(LEGACY_SCROLLING_MODE) === false ? !this.items(true).length : super.isEmpty.apply(this, arguments as any);
  }

  public isLastPageLoaded(): boolean {
    let result = false;

    if (this.option(LEGACY_SCROLLING_MODE) === false && isVirtualPaging(this)) {
      const { pageIndex, loadPageCount } = this.getLoadPageParams(true);
      const pageCount = this.pageCount();

      result = pageIndex + loadPageCount >= pageCount;
    } else {
      result = super.isLastPageLoaded.apply(this, arguments as any);
    }

    return result;
  }

  public reset(): void {
    this._itemCount = 0;
    this._allItems = null;
    super.reset.apply(this, arguments as any);
  }

  protected _applyFilter(): DeferredObj<unknown> {
    this._dataSource?.loadPageCount(1);

    return super._applyFilter();
  }

  private getVirtualContentSize() {
    return this._dataSource?.getVirtualContentSize.apply(this._dataSource, arguments as any);
  }

  private setViewportItemIndex() {
    return this._dataSource?.setViewportItemIndex.apply(this._dataSource, arguments as any);
  }

  public isViewportChanging(): boolean {
    return this._viewportChanging || super.isViewportChanging();
  }
};
