/* eslint-disable max-classes-per-file */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { isElementInDom } from '@js/core/utils/dom';
import { getBoundingRect } from '@js/core/utils/position';
import { getOuterHeight } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import LoadIndicator from '@js/ui/load_indicator';
import errors from '@js/ui/widget/ui.errors';
import type { DataSource } from '@ts/data/data_source/data_source';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { DataChange } from '@ts/grids/grid_core/data_controller/types';
import type { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/data_source_adapter';
import { CLASSES as EDITING_CLASSES, EDIT_MODE } from '@ts/grids/grid_core/editing/const';
import type { ErrorHandlingViewController } from '@ts/grids/grid_core/error_handling/error_handling_view_controller';
import type { ResizingController } from '@ts/grids/grid_core/grid_view/grid_view';
import type { InternalGrid, ModuleType, RowKey } from '@ts/grids/grid_core/types';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type { ViewDataChange } from '@ts/grids/grid_core/views/types';
import type { VirtualItemsCount } from '@ts/grids/grid_core/virtual_data_loader/types';

import type {
  ChangedEvent,
  LoadOperation,
  OperationTypes,
  RawItemData,
} from '../data_source_adapter/types';
import type { StateStoringDataControllerExtension } from '../state_storing/extenders/state_storing_data_controller';
import gridCoreUtils from '../utils';
import type { RowsViewScrollEvent } from '../views/types';
import {
  CLASSES,
  LEGACY_SCROLLING_MODE,
  LOAD_TIMEOUT,
} from './const';
import type { VirtualScrollingDataControllerExtension } from './extenders/virtual_scrolling_data_controller';
import { subscribeToExternalScrollers, VirtualScrollController } from './m_virtual_scrolling_core';
import type {
  ExternalScrollers,
  VirtualScrollDataOptions,
  VirtualScrollingDataSourceAdapter,
  VirtualScrollingResizingControllerExtension,
  VirtualScrollingRowsView,
} from './types';
import { isItemCountableByDataSource } from './utils/items';
import { isInfiniteMode, isVirtualMode, isVirtualPaging } from './utils/scrolling_mode';

export const updateLoading = (that: VirtualScrollingDataSourceAdapter): void => {
  const beginPageIndex = that._virtualScrollController.beginPageIndex(-1);

  if (isVirtualMode(that)) {
    if (
      beginPageIndex < 0
      || (
        (
          that.viewportSize() >= 0
          && that.getViewportItemIndex() >= 0
          && (
            beginPageIndex * that.pageSize() > that.getViewportItemIndex()
            || beginPageIndex * that.pageSize() + that.itemsCount()
              < that.getViewportItemIndex() + that.viewportSize()
          )
        )
        && that._dataSource.isLoading()
      )
    ) {
      if (!that._isLoading) {
        that._isLoading = true;
        that.loadingChanged.fire(true);
      }
    } else if (that._isLoading) {
      that._isLoading = false;
      that.loadingChanged.fire(false);
    }
  }
};

const removeEmptyRows = ($emptyRows: dxElementWrapper, className: string): void => {
  const getRowParent = (row: Element): Element => $(row).parent(`.${className}`).get(0);
  const tBodies = $emptyRows.toArray().map(getRowParent).filter((row) => row);
  let $rows = $emptyRows;

  if (tBodies.length) {
    $rows = $(tBodies);
  }

  const rowCount = className === VIEW_CLASSES.freeSpaceRow
    ? $rows.length - 1
    : $rows.length;

  for (let i = 0; i < rowCount; i += 1) {
    $rows.eq(i).remove();
  }
};

export const dataSourceAdapterExtender = (
  Base: ModuleType<DataSourceAdapter>,
): ModuleType<
  VirtualScrollingDataSourceAdapter
> => class VirtualScrollingCoreDataSourceAdapterExtender extends Base {
  protected declare _items: RawItemData[];

  private _totalCount!: number;

  private _isLoaded!: boolean;

  private _loadPageCount!: number;

  public _virtualScrollController!: VirtualScrollController;

  public _renderTime = 0;

  public _isLoading?: boolean;

  private _startLoadTime?: Date;

  public init(dataSource?: DataSource): void {
    super.init(dataSource);
    this._items = [];
    this._totalCount = -1;
    this._isLoaded = true;
    this._loadPageCount = 1;

    this._virtualScrollController = new VirtualScrollController(
      this.component,
      this._getVirtualScrollDataOptions(),
    );
  }

  public dispose(isSharedDataSource?: boolean): void {
    this._virtualScrollController.dispose();
    super.dispose(isSharedDataSource);
  }

  private _getVirtualScrollDataOptions(): VirtualScrollDataOptions {
    return {
      pageSize: (): number => this.pageSize(),
      totalItemsCount: (): number => this.totalItemsCount(),
      hasKnownLastPage: (): boolean => this.hasKnownLastPage(),
      // @ts-expect-error an arrow can't declare the pageIndex() overloads
      pageIndex: (index?: number): number | undefined => this._dataSource.pageIndex(index),
      isLoading: (): boolean => this._dataSource.isLoading() && !this.customLoader.isLoading(),
      pageCount: (): number => this.pageCount(),
      load: (): DeferredObj<unknown> => this._dataSource.load(),
      updateLoading: (): void => {
        updateLoading(this);
      },
      itemsCount: (): number => this.itemsCount(true),
      items: (): unknown[] => this._dataSource.items(),
      viewportItems: (items?: unknown[]): unknown[] => {
        if (items) {
          // @ts-expect-error viewportItems() gets back the items that items() returned
          this._items = items;
        }
        return this._items;
      },
      onChanged: (e): void => {
        // @ts-expect-error ChangedEvent lacks the legacy virtual scrolling change types
        this.changed.fire(e);
      },
      changingDuration: (): number => {
        if (this.isLoading()) {
          return LOAD_TIMEOUT;
        }

        return this._renderTime || 0;
      },
    };
  }

  protected loadingChangedHandler(isLoading: boolean): void {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      super.loadingChangedHandler(isLoading);
      return;
    }

    if (!isVirtualMode(this) || this.customLoader.isLoadingAll()) {
      this._isLoading = isLoading;
      super.loadingChangedHandler(isLoading);
    }

    if (isLoading) {
      this._startLoadTime = new Date();
    } else {
      this._startLoadTime = undefined;
    }
  }

  protected loadErrorHandler(e: Error | string): void {
    if (this.option(LEGACY_SCROLLING_MODE) !== false) {
      this._isLoading = false;
      this.loadingChanged.fire(false);
    }

    super.loadErrorHandler(e);
  }

  protected dataChangedHandler(e?: ChangedEvent): void {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      // @ts-expect-error DataSource items are typed as unknown
      this._items = this._dataSource.items().slice();
      this._totalCount = this._dataSourceTotalCount(true);
      super.dataChangedHandler(e);
      return;
    }

    const callBase = super.dataChangedHandler.bind(this);

    // @ts-expect-error ChangedEvent lacks the legacy virtual scrolling change types
    this._virtualScrollController.handleDataChanged(callBase, e);
  }

  protected _customizeRemoteOperations(
    options: LoadOperation,
    operationTypes: OperationTypes,
  ): void {
    const newMode = this.option(LEGACY_SCROLLING_MODE) === false;
    let renderAsync = this.option('scrolling.renderAsync');

    if (!isDefined(renderAsync)) {
      renderAsync = this._renderTime >= this.option('scrolling.renderingThreshold');
    }

    const isVirtualOrNewInfiniteMode = isVirtualMode(this) || (isInfiniteMode(this) && newMode);

    if (
      isVirtualOrNewInfiniteMode
      && !operationTypes.reload
      && (operationTypes.skip || newMode)
      && !renderAsync
    ) {
      options.delay = undefined;
    }

    super._customizeRemoteOperations(options, operationTypes);
  }

  public items(): RawItemData[] {
    return this._items;
  }

  protected _dataSourceTotalCount(isBase?: boolean): number {
    return this.option(LEGACY_SCROLLING_MODE) === false && isVirtualMode(this) && !isBase
      ? this._totalCount
      : super._dataSourceTotalCount();
  }

  public itemsCount(isBase?: boolean): number {
    if (isBase || this.option(LEGACY_SCROLLING_MODE) === false) {
      return super.itemsCount();
    }
    return this._virtualScrollController.itemsCount();
  }

  public load(): DeferredObj<unknown> {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return super.load();
    }
    return this._virtualScrollController.load();
  }

  public isLoading(): boolean {
    return this.option(LEGACY_SCROLLING_MODE) === false
      ? this._dataSource.isLoading()
      // @ts-expect-error _isLoading stays undefined until the first loading change
      : this._isLoading;
  }

  public isLoaded(): boolean {
    return this._dataSource.isLoaded() && this._isLoaded;
  }

  protected resetPagesCache(isLiveUpdate?: boolean): void {
    if (!isLiveUpdate) {
      this._virtualScrollController.reset(true);
    }
    super.resetPagesCache(isLiveUpdate);
  }

  protected _changeRowExpandCore(path: RowKey): void {
    const result = super._changeRowExpandCore(path);

    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return result;
    }

    this.resetPagesCache();
    updateLoading(this);

    return result;
  }

  public reload(full?: boolean, changesOnly?: boolean): DeferredObj<unknown> {
    this._dataSource.pageIndex(this.pageIndex());
    const virtualScrollController = this._virtualScrollController;

    if (this.option(LEGACY_SCROLLING_MODE) !== false && virtualScrollController) {
      const d = Deferred<unknown>();
      const resolve = d.resolve as (...a: unknown[]) => void;
      const reject = d.reject as (...a: unknown[]) => void;
      super.reload(full, changesOnly).done((r) => {
        const delayDeferred = virtualScrollController.getDelayDeferred();
        if (delayDeferred) {
          delayDeferred.done(resolve).fail(reject);
        } else {
          d.resolve(r);
        }
      }).fail(reject);
      return d;
    }
    return super.reload(full, changesOnly);
  }

  public refresh(options: LoadOperation, operationTypes: OperationTypes): void {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      super.refresh(options, operationTypes);
      return;
    }

    const { storeLoadOptions } = options;
    const dataSource = this._dataSource;

    if (operationTypes.reload) {
      this._virtualScrollController.reset();
      dataSource.items().length = 0;
      this._isLoaded = false;

      updateLoading(this);
      this._isLoaded = true;

      if (isInfiniteMode(this)) {
        this.pageIndex(0);
        dataSource.pageIndex(0);
        storeLoadOptions.pageIndex = 0;
        options.pageIndex = 0;
        storeLoadOptions.skip = 0;
      } else {
        dataSource.pageIndex(this.pageIndex());
        if (dataSource.paginate()) {
          options.pageIndex = this.pageIndex();
          storeLoadOptions.skip = this.pageIndex() * this.pageSize();
        }
      }
    } else if (isInfiniteMode(this) && storeLoadOptions.skip && this._totalCountCorrection < 0) {
      storeLoadOptions.skip += this._totalCountCorrection;
    }

    super.refresh(options, operationTypes);
  }

  public loadPageCount(): number;
  public loadPageCount(count: number): void;
  public loadPageCount(count?: number): number | undefined {
    if (!isDefined(count)) {
      return this._loadPageCount;
    }
    this._loadPageCount = count;

    return undefined;
  }

  protected _handleDataLoading(options: LoadOperation): void {
    const loadPageCount = this.loadPageCount();
    const pageSize = this.pageSize();
    const newMode = this.option(LEGACY_SCROLLING_MODE) === false;
    const { storeLoadOptions } = options;
    const takeIsDefined = isDefined(storeLoadOptions.take);

    // @ts-expect-error LoadOperation has no loadPageCount
    options.loadPageCount = loadPageCount;
    if (
      !options.isCustomLoading
      && newMode
      && takeIsDefined
      && loadPageCount > 1
      && pageSize > 0
    ) {
      storeLoadOptions.take = loadPageCount * pageSize;
    }
    super._handleDataLoading(options);
  }

  protected _loadPageSize(): number {
    return super._loadPageSize() * this.loadPageCount();
  }

  public beginPageIndex(...args: [] | [number]): number {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      // @ts-expect-error a spread argument can't match the overloads of pageIndex()
      return this._dataSource.pageIndex(...args);
    }

    return this._virtualScrollController.beginPageIndex(...args);
  }

  private endPageIndex(): number {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return this._dataSource.pageIndex();
    }

    return this._virtualScrollController.endPageIndex();
  }

  public pageIndex(): number;
  public pageIndex(pageIndex: number): void;
  public pageIndex(...args: [] | [number]): number | void {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      // @ts-expect-error a spread argument can't match the overloads of pageIndex()
      return this._dataSource.pageIndex(...args);
    }

    // @ts-expect-error a spread argument can't match the overloads of pageIndex()
    return this._virtualScrollController.pageIndex(...args);
  }

  public virtualItemsCount(): VirtualItemsCount | undefined {
    return this._virtualScrollController.virtualItemsCount();
  }

  public getContentOffset(type?: 'begin' | 'end'): number {
    return this._virtualScrollController.getContentOffset(type);
  }

  public getVirtualContentSize(): number {
    return this._virtualScrollController.getVirtualContentSize();
  }

  public setContentItemSizes(sizes: number[]): void {
    return this._virtualScrollController.setContentItemSizes(sizes);
  }

  public setViewportPosition(position: number): DeferredObj<unknown> {
    return this._virtualScrollController.setViewportPosition(position);
  }

  public getViewportItemIndex(): number {
    return this._virtualScrollController.getViewportItemIndex();
  }

  public setViewportItemIndex(viewportItemIndex: number): DeferredObj<unknown> | undefined {
    return this._virtualScrollController.setViewportItemIndex(viewportItemIndex);
  }

  public getItemIndexByPosition(): number {
    return this._virtualScrollController.getItemIndexByPosition();
  }

  public viewportSize(size?: number): number {
    return this._virtualScrollController.viewportSize(size);
  }

  public viewportItemSize(size?: number): number {
    return this._virtualScrollController.viewportItemSize(size);
  }

  public getItemSize(): number {
    return this._virtualScrollController.getItemSize();
  }

  public getItemSizes(): Record<number, number> {
    return this._virtualScrollController.getItemSizes();
  }

  public loadIfNeed(): void {
    return this._virtualScrollController.loadIfNeed();
  }
};

export const resizing = (
  Base: ModuleType<ResizingController>,
): ModuleType<
  ResizingController & VirtualScrollingResizingControllerExtension
> => class VirtualScrollingResizingControllerExtender extends Base {
  private _resizeTimeout?: ReturnType<typeof setTimeout> | null;

  private _lastTime?: Date;

  public dispose(): void {
    super.dispose();
    clearTimeout(this._resizeTimeout ?? undefined);
  }

  private _updateMasterDataGridCore(
    masterDataGrid: InternalGrid,
    masterRowOptions: unknown,
  ): DeferredObj<unknown> {
    return when(
      // @ts-expect-error _updateMasterDataGridCore is defined by masterDetail
      super._updateMasterDataGridCore(masterDataGrid, masterRowOptions),
    ).done((masterDataGridUpdated) => {
      const isNewVirtualMode = isVirtualMode(masterDataGrid)
        && masterDataGrid.option(LEGACY_SCROLLING_MODE) === false;

      if (!masterDataGridUpdated && isNewVirtualMode) {
        const scrollable = masterDataGrid.getScrollable();

        if (scrollable) {
          masterDataGrid.updateDimensions();
        }
      }
    });
  }

  public hasResizeTimeout(): boolean {
    return isDefined(this._resizeTimeout);
  }

  public resetLastResizeTime(): void {
    this._lastTime = undefined;
  }

  public resize(): DeferredObj<unknown> {
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in branches
    let result: DeferredObj<unknown>;

    if (isVirtualMode(this) || gridCoreUtils.isVirtualRowRendering(this)) {
      clearTimeout(this._resizeTimeout ?? undefined);
      this._resizeTimeout = null;

      const diff = new Date().getTime() - Number(this._lastTime);
      const updateTimeout = this.option('scrolling.updateTimeout');

      if (this._lastTime && diff < updateTimeout) {
        const deferred = Deferred<unknown>();
        const resolve = deferred.resolve as (...a: unknown[]) => void;
        const reject = deferred.reject as (...a: unknown[]) => void;
        result = deferred;
        // eslint-disable-next-line no-restricted-globals -- delays resize by updateTimeout
        this._resizeTimeout = setTimeout(() => {
          this._resizeTimeout = null;
          super.resize().done(resolve).fail(reject);
          this._lastTime = new Date();
        }, updateTimeout);
        this._lastTime = new Date();
      } else {
        result = super.resize();
        if (this._dataController.isLoaded()) {
          this._lastTime = new Date();
        }
      }
    } else {
      result = super.resize();
    }
    return result;
  }
};

export const rowsView = (
  Base: ModuleType<RowsView>,
): ModuleType<VirtualScrollingRowsView> => class VirtualScrollingRowsViewExtender extends Base {
  protected declare _dataController: DataController
  & VirtualScrollingDataControllerExtension
  & Partial<StateStoringDataControllerExtension>;

  protected declare dataSourceController: DataSourceController<VirtualScrollingDataSourceAdapter>;

  protected _errorHandlingController!: ErrorHandlingViewController;

  private _isFixedTableRendering?: boolean;

  private _heightWarningIsThrown?: boolean;

  private _windowScroll?: ExternalScrollers;

  public init(): void {
    super.init();

    this._errorHandlingController = this.getController('errorHandling');

    this._dataController.pageChanged.add((pageIndex) => {
      const scrollTop = this._scrollTop;

      this.scrollToPage(pageIndex ?? this._dataController.pageIndex());

      if (this.option(LEGACY_SCROLLING_MODE) === false && this._scrollTop === scrollTop) {
        this._dataController.updateViewport();
      }
    });

    this._dataController.dataSourceChanged.add(() => {
      if (!this._scrollTop) {
        this._scrollToCurrentPageOnResize();
      }
    });

    this._dataController.stateLoaded?.add(() => {
      this._scrollToCurrentPageOnResize();
    });

    this._scrollToCurrentPageOnResize();
  }

  private _scrollToCurrentPageOnResize(): void {
    if (this._dataController.pageIndex() > 0) {
      const resizeHandler = (): void => {
        this.resizeCompleted.remove(resizeHandler);
        this.scrollToPage(this._dataController.pageIndex());
      };
      this.resizeCompleted.add(resizeHandler);
    }
  }

  private scrollToPage(pageIndex: number): void {
    const pageSize = this._dataController ? this._dataController.pageSize() : 0;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in branches
    let scrollPosition: number;

    if (isVirtualMode(this) || isInfiniteMode(this)) {
      const itemSize = Number(this._dataController.getItemSize());
      const itemSizes = this._dataController.getItemSizes() ?? {};
      const itemIndex = pageIndex * pageSize;

      scrollPosition = itemIndex * itemSize;

      for (const index in itemSizes) {
        if (parseInt(index, 10) < itemIndex) {
          scrollPosition += itemSizes[index] - itemSize;
        }
      }
    } else {
      scrollPosition = 0;
    }

    this.scrollTo({ top: scrollPosition, left: this._scrollLeft });
  }

  public renderDelayedTemplates(change?: DataChange): void {
    this.waitAsyncTemplates().done(() => {
      this._updateContentPosition(true);
    });
    super.renderDelayedTemplates(change);
  }

  protected _renderCore(e?: DataChange): DeferredObj<unknown> {
    const startRenderTime = Date.now();

    const deferred = super._renderCore(e);

    const dataSourceAdapter = this.dataSourceController.getAdapter();

    if (dataSourceAdapter && e) {
      const itemCount = e.items ? e.items.length : 20;
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- 0 falls back
      const viewportSize = this._dataController.viewportSize() || 20;

      if (
        gridCoreUtils.isVirtualRowRendering(this)
        && itemCount > 0
        && this.option(LEGACY_SCROLLING_MODE) !== false
      ) {
        dataSourceAdapter._renderTime = ((Date.now() - startRenderTime) * viewportSize) / itemCount;
      } else {
        dataSourceAdapter._renderTime = Date.now() - startRenderTime;
      }
    }
    return deferred;
  }

  public _getRowElements(tableElement?: dxElementWrapper | null): dxElementWrapper {
    const $rows = super._getRowElements(tableElement);

    return $rows?.not(`.${CLASSES.virtualRow}`);
  }

  private _removeRowsElements(
    contentTable: dxElementWrapper,
    removeCount: number,
    changeType: string,
  ): void {
    let rowElements = this._getRowElements(contentTable).toArray();
    if (changeType === 'append') {
      rowElements = rowElements.slice(0, removeCount);
    } else {
      rowElements = rowElements.slice(-removeCount);
    }

    rowElements.forEach((rowElement) => {
      const $rowElement = $(rowElement);
      if (this._errorHandlingController) {
        this._errorHandlingController.removeErrorRow($rowElement.next());
      }
      $rowElement.remove();
    });
  }

  protected _updateContent(
    tableElement: dxElementWrapper,
    change?: ViewDataChange,
    isFixedTableRendering?: boolean,
  ): DeferredObj<unknown> {
    const contentElement = this._findContentElement();
    const changeType = change?.changeType;
    const d = Deferred<unknown>();
    const reject = d.reject as (...a: unknown[]) => void;

    // @ts-expect-error the view is rendered here
    const contentTable: dxElementWrapper = contentElement.children().first();
    if (changeType === 'append' || changeType === 'prepend') {
      this.waitAsyncTemplates().done(() => {
        const $tBodies = this._getBodies(tableElement);
        if ($tBodies.length === 1) {
          this._getBodies(contentTable)[changeType === 'append' ? 'append' : 'prepend']($tBodies.children());
        } else {
          $tBodies[changeType === 'append' ? 'appendTo' : 'prependTo'](contentTable);
        }

        tableElement.remove();
        const $freeSpaceRowElements = this._getFreeSpaceRowElements(contentTable);
        removeEmptyRows($freeSpaceRowElements, VIEW_CLASSES.freeSpaceRow);

        // @ts-expect-error DataChange lacks the loader's removeCount
        if (change.removeCount) {
          // @ts-expect-error DataChange lacks the loader's removeCount
          this._removeRowsElements(contentTable, change.removeCount, changeType);
        }

        this._restoreErrorRow(contentTable);
        d.resolve();
      }).fail(reject);
    } else {
      super._updateContent(tableElement, change, isFixedTableRendering).done(() => {
        if (changeType === 'update') {
          this._restoreErrorRow(contentTable);
        }
        d.resolve();
      }).fail(reject);
    }

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    const promise: DeferredObj<unknown> = d.promise();

    return promise.done(() => {
      this._updateBottomLoading();
    });
  }

  private _addVirtualRow(
    $table: dxElementWrapper,
    isFixed: boolean,
    location: string,
    position: number | undefined,
  ): void {
    if (!position) {
      return;
    }

    let $virtualRow = this._createEmptyRow(CLASSES.virtualRow, isFixed, position);

    $virtualRow = this._wrapRowIfNeed($table, $virtualRow);

    this._appendEmptyRow($table, $virtualRow, location);
  }

  private _updateContentItemSizes(): void {
    const rowHeights = this._getRowHeights();
    const correctedRowHeights = this._correctRowHeights(rowHeights);

    this._dataController.setContentItemSizes(correctedRowHeights);
  }

  private _updateViewportSize(viewportHeight: number | null, scrollTop?: number): void {
    let height = viewportHeight;

    if (!isDefined(height)) {
      // @ts-expect-error the view is rendered here
      const viewHeight: number = this._hasHeight
        ? getOuterHeight(this.element())
        : getOuterHeight(getWindow());
      height = viewHeight;
    }

    this._dataController.viewportHeight(height, scrollTop);
  }

  private _getRowHeights(): number[] {
    const isPopupEditMode = this._editingController?.getEditMode() === EDIT_MODE.popup;

    let rowElements = this._getRowElements(this._tableElement).toArray();

    if (isPopupEditMode) {
      rowElements = rowElements.filter((row) => !$(row).hasClass(EDITING_CLASSES.rowInserted));
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- getBoundingRect() returns any
    return rowElements.map((row) => getBoundingRect(row).height);
  }

  private _correctRowHeights(rowHeights: number[]): number[] {
    const dataController = this._dataController;
    const dataSourceAdapter = this.dataSourceController.getAdapter();
    const correctedRowHeights: number[] = [];
    const visibleRows = dataController.getVisibleRows();
    let itemSize = 0;
    let firstCountableItem = true;
    let lastLoadIndex: number | undefined = -1;

    for (let i = 0; i < rowHeights.length; i += 1) {
      const currentItem = visibleRows[i];
      if (!isDefined(currentItem)) {
        // eslint-disable-next-line no-continue -- an inverted if would exceed max-depth
        continue;
      }

      if (this.option(LEGACY_SCROLLING_MODE) === false) {
        if (Number(lastLoadIndex) >= 0 && lastLoadIndex !== currentItem.loadIndex) {
          correctedRowHeights.push(itemSize);
          itemSize = 0;
        }
        lastLoadIndex = currentItem.loadIndex;
      } else if (isItemCountableByDataSource(currentItem, dataSourceAdapter)) {
        if (firstCountableItem) {
          firstCountableItem = false;
        } else {
          correctedRowHeights.push(itemSize);
          itemSize = 0;
        }
      }

      itemSize += rowHeights[i];
    }
    if (itemSize > 0) {
      correctedRowHeights.push(itemSize);
    }
    return correctedRowHeights;
  }

  public _updateContentPosition(isRender?: boolean): void {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- 0 falls back
    const rowHeight = this._rowHeight || 20;

    this._dataController.viewportItemSize(rowHeight);

    if (isVirtualMode(this) || gridCoreUtils.isVirtualRowRendering(this)) {
      const isEmptyRows = this._dataController.isEmpty();
      if (isEmptyRows) {
        return;
      }

      if (!isRender) {
        this._updateContentItemSizes();
      }

      const top = this._dataController.getContentOffset('begin');

      const bottom = this._dataController.getContentOffset('end');
      const $tables = this.getTableElements();
      const $virtualRows = $tables.children('tbody').children(`.${CLASSES.virtualRow}`);

      removeEmptyRows($virtualRows, CLASSES.virtualRow);

      $tables.each((index, element) => {
        const isFixed = index > 0;
        const prevFixed = this._isFixedTableRendering;
        this._isFixedTableRendering = isFixed;
        this._addVirtualRow($(element), isFixed, 'top', top);
        this._addVirtualRow($(element), isFixed, 'bottom', bottom);
        this._isFixedTableRendering = prevFixed;
      });
    }
  }

  private _findBottomLoadPanel($contentElement?: dxElementWrapper): dxElementWrapper | undefined {
    const $element = $contentElement ?? this.element();
    const $bottomLoadPanel = $element?.find(`.${this.addWidgetPrefix(CLASSES.bottomLoadPanel)}`);
    if ($bottomLoadPanel?.length) {
      return $bottomLoadPanel;
    }

    return undefined;
  }

  private _updateBottomLoading(): void {
    const showBottomLoading = !this.dataSourceController.hasKnownLastPage()
      && this._dataController.isLoaded()
      && isVirtualPaging(this);
    const $contentElement = this._findContentElement();
    const bottomLoadPanelElement = this._findBottomLoadPanel($contentElement);

    if (showBottomLoading) {
      if (!bottomLoadPanelElement) {
        $('<div>')
          .addClass(this.addWidgetPrefix(CLASSES.bottomLoadPanel))
          .append(this._createComponent($('<div>'), LoadIndicator, {
            elementAttr: {
              role: null,
              'aria-label': null,
            },
          }).$element())
          // @ts-expect-error the view is rendered here
          .appendTo($contentElement);
      }
    } else if (bottomLoadPanelElement) {
      bottomLoadPanelElement.remove();
    }
  }

  protected _handleScroll(e: RowsViewScrollEvent): void {
    const legacyScrollingMode = this.option(LEGACY_SCROLLING_MODE) === true;
    const zeroTopPosition = e.scrollOffset.top === 0;
    const isScrollTopChanged = this._scrollTop !== e.scrollOffset.top;
    const hasScrolled = isScrollTopChanged || e.forceUpdateScrollPosition;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- OR of two flags
    const isValidScrollTarget = this._hasHeight || (!legacyScrollingMode && zeroTopPosition);

    if (hasScrolled && isValidScrollTarget && this._rowHeight) {
      this._scrollTop = e.scrollOffset.top;

      if (isScrollTopChanged) {
        this._saveHorizontalScrollPosition(e.scrollOffset.left);
      }

      const isVirtualRowRendering = isVirtualMode(this) || this.option('scrolling.rowRenderingMode') !== 'standard';

      if (isVirtualRowRendering && this.option(LEGACY_SCROLLING_MODE) === false) {
        this._updateContentItemSizes();
        this._updateViewportSize(null, this._scrollTop);
      }

      this._dataController.setViewportPosition(e.scrollOffset.top);
    }
    super._handleScroll(e);
  }

  protected _needUpdateRowHeight(itemsCount: number): boolean | undefined {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- OR of two flags
    return super._needUpdateRowHeight(itemsCount) || (itemsCount > 0
      && (isInfiniteMode(this) && !gridCoreUtils.isVirtualRowRendering(this))
    );
  }

  protected _updateRowHeight(): void {
    super._updateRowHeight();

    if (this._rowHeight) {
      this._updateContentPosition();

      // @ts-expect-error the view is rendered here
      const viewportHeight: number = this._hasHeight
        ? getOuterHeight(this.element())
        : getOuterHeight(getWindow());

      if (this.option(LEGACY_SCROLLING_MODE) === false) {
        this._updateViewportSize(viewportHeight);

        this._dataController.updateViewport();
      } else {
        this._dataController.viewportSize(Math.ceil(viewportHeight / this._rowHeight));
      }
    }
  }

  public updateFreeSpaceRowHeight($table?: dxElementWrapper): boolean | undefined {
    const result = super.updateFreeSpaceRowHeight($table);

    if (result) {
      this._updateContentPosition();
    }

    return result;
  }

  public setLoading(isLoading: boolean, messageText?: string): void {
    const dataController = this._dataController;
    const hasBottomLoadPanel = dataController.pageIndex() > 0
      && dataController.isLoaded()
      && !!this._findBottomLoadPanel();
    const isDefaultLoading = isLoading && !dataController.isCustomLoading();

    if (
      this.option(LEGACY_SCROLLING_MODE) === false
      && isDefaultLoading
      && dataController.isViewportChanging()
    ) {
      return;
    }

    super.setLoading(hasBottomLoadPanel ? false : isLoading, messageText);
  }

  private isGridDragging(): boolean {
    return this.component.option('isDragging');
  }

  // NOTE: warning won't be thrown if height was specified and then removed,
  // because for some reason `_hasHeight` is not updated properly in this case
  private throwHeightWarningIfNeed(): void {
    const isGridDragging = this.isGridDragging();
    if (this._hasHeight === undefined || isGridDragging) {
      return;
    }

    const needToThrow = !this._hasHeight && isVirtualPaging(this);
    if (needToThrow && !this._heightWarningIsThrown) {
      this._heightWarningIsThrown = true;
      errors.log('W1025');
    }
  }

  protected _resizeCore(): void {
    // @ts-expect-error the view is rendered here
    const $element: dxElementWrapper = this.element();

    super._resizeCore();

    this.throwHeightWarningIfNeed();

    if (this.component.$element() && !this._windowScroll && isElementInDom($element)) {
      const windowScroll = subscribeToExternalScrollers($element, (scrollPos) => {
        if (!this._hasHeight && this._rowHeight) {
          this._dataController.setViewportPosition(scrollPos);
        }
      }, this.component.$element());
      this._windowScroll = windowScroll;

      this.on('disposing', () => {
        windowScroll.dispose();
      });
    }

    if (this.option(LEGACY_SCROLLING_MODE) !== false) {
      this.loadIfNeed();
    }
  }

  public loadIfNeed(): void {
    this._dataController?.loadIfNeed?.();
  }

  protected _restoreErrorRow(contentTable?: dxElementWrapper): void {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      this._errorHandlingController?.removeErrorRow();
    }

    super._restoreErrorRow(contentTable);
  }
};
