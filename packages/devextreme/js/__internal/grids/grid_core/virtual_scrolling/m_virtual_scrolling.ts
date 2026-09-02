/* eslint-disable max-classes-per-file */
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { isElementInDom } from '@js/core/utils/dom';
import { each } from '@js/core/utils/iterator';
import { getBoundingRect } from '@js/core/utils/position';
import { getOuterHeight } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import LoadIndicator from '@js/ui/load_indicator';
import errors from '@js/ui/widget/ui.errors';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';
import type { ErrorHandlingViewController } from '@ts/grids/grid_core/error_handling/error_handling_view_controller';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import type { ResizingController } from '@ts/grids/grid_core/views/m_grid_view';
import type { RowsView } from '@ts/grids/grid_core/views/m_rows_view';

import type { ChangedEvent } from '../data_source_adapter/types';
import gridCoreUtils from '../m_utils';
import type { StateStoringDataControllerExtension } from '../state_storing/extenders/state_storing_data_controller';
import type { RowsViewScrollEvent } from '../views/types';
import {
  BOTTOM_LOAD_PANEL_CLASS,
  COLUMN_LINES_CLASS,
  FREESPACE_CLASS,
  GROUP_SPACE_CLASS,
  LEGACY_SCROLLING_MODE,
  LOAD_TIMEOUT,
  PAGING_METHOD_NAMES,
  ROW_INSERTED,
  VIRTUAL_ROW_CLASS,
} from './const';
import { subscribeToExternalScrollers, VirtualScrollController } from './m_virtual_scrolling_core';
import type { GroupCountableDataSource } from './utils/items';
import { isItemCountableByDataSource } from './utils/items';
import { isInfiniteMode, isVirtualMode, isVirtualPaging } from './utils/scrolling_mode';

export type VirtualScrollingDataSourceAdapter = InstanceType<ReturnType<typeof dataSourceAdapterExtender>>;

export const updateLoading = function (that) {
  const beginPageIndex = that._virtualScrollController.beginPageIndex(-1);

  if (isVirtualMode(that)) {
    if (beginPageIndex < 0 || (that.viewportSize() >= 0 && that.getViewportItemIndex() >= 0 && (beginPageIndex * that.pageSize() > that.getViewportItemIndex()
              || beginPageIndex * that.pageSize() + that.itemsCount() < that.getViewportItemIndex() + that.viewportSize())) && that._dataSource.isLoading()) {
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

const proxyDataSourceAdapterMethod = function (that, methodName, args) {
  if (that.option(LEGACY_SCROLLING_MODE) === false && PAGING_METHOD_NAMES.includes(methodName)) {
    const dataSource = that._dataSource;

    return dataSource.pageIndex.apply(dataSource, args);
  }

  const virtualScrollController = that._virtualScrollController;
  return virtualScrollController[methodName].apply(virtualScrollController, args);
};

const removeEmptyRows = function ($emptyRows, className) {
  const getRowParent = (row) => $(row).parent(`.${className}`).get(0);
  const tBodies = $emptyRows.toArray().map(getRowParent).filter((row) => row);

  if (tBodies.length) {
    $emptyRows = $(tBodies);
  }

  const rowCount = className === FREESPACE_CLASS ? $emptyRows.length - 1 : $emptyRows.length;

  for (let i = 0; i < rowCount; i++) {
    $emptyRows.eq(i).remove();
  }
};

export const dataSourceAdapterExtender = (Base: ModuleType<DataSourceAdapter>) => class VirtualScrollingCoreDataSourceAdapterExtender extends Base {
  private _totalCount: any;

  private _isLoaded: any;

  private _loadPageCount: any;

  public _virtualScrollController!: VirtualScrollController;

  public _renderTime = 0;

  private _isLoading: any;

  private _startLoadTime: any;

  public init() {
    super.init.apply(this, arguments as any);
    this._items = [];
    this._totalCount = -1;
    this._isLoaded = true;
    this._loadPageCount = 1;

    this._virtualScrollController = new VirtualScrollController(this.component, this._getVirtualScrollDataOptions());
  }

  public dispose() {
    this._virtualScrollController.dispose();
    super.dispose.apply(this, arguments as any);
  }

  private _getVirtualScrollDataOptions() {
    const that = this;
    return {
      pageSize() {
        return that.pageSize();
      },
      totalItemsCount() {
        return that.totalItemsCount();
      },
      hasKnownLastPage() {
        return that.hasKnownLastPage();
      },
      pageIndex(index) {
        return that._dataSource.pageIndex(index);
      },
      isLoading() {
        return that._dataSource.isLoading() && !that.isCustomLoading();
      },
      pageCount() {
        return that.pageCount();
      },
      load() {
        return that._dataSource.load();
      },
      updateLoading() {
        updateLoading(that);
      },
      itemsCount() {
        return that.itemsCount(true);
      },
      items() {
        return that._dataSource.items();
      },
      viewportItems(items) {
        if (items) {
          that._items = items;
        }
        return that._items;
      },
      onChanged(e) {
        that.changed.fire(e);
      },
      changingDuration() {
        if (that.isLoading()) {
          return LOAD_TIMEOUT;
        }

        return that._renderTime || 0;
      },
    };
  }

  protected loadingChangedHandler(isLoading: boolean): void {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      super.loadingChangedHandler(isLoading);
      return;
    }

    if (!isVirtualMode(this) || this.isCustomLoadingAll()) {
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
      this._items = this._dataSource.items().slice();
      this._totalCount = this._dataSourceTotalCount(true);
      super.dataChangedHandler(e);
      return;
    }

    const callBase = super.dataChangedHandler.bind(this);

    this._virtualScrollController.handleDataChanged(callBase, e);
  }

  protected _customizeRemoteOperations(options, operationTypes) {
    const newMode = this.option(LEGACY_SCROLLING_MODE) === false;
    let renderAsync = this.option('scrolling.renderAsync');

    if (!isDefined(renderAsync)) {
      renderAsync = this._renderTime >= this.option('scrolling.renderingThreshold');
    }

    if ((isVirtualMode(this) || (isInfiniteMode(this) && newMode)) && !operationTypes.reload && (operationTypes.skip || newMode) && !renderAsync) {
      options.delay = undefined;
    }

    super._customizeRemoteOperations.apply(this, arguments as any);
  }

  public items() {
    return this._items;
  }

  protected _dataSourceTotalCount(isBase?) {
    return this.option(LEGACY_SCROLLING_MODE) === false && isVirtualMode(this) && !isBase ? this._totalCount : super._dataSourceTotalCount();
  }

  public itemsCount(isBase?) {
    if (isBase || this.option(LEGACY_SCROLLING_MODE) === false) {
      return super.itemsCount();
    }
    return this._virtualScrollController.itemsCount();
  }

  public load(loadOptions) {
    if (this.option(LEGACY_SCROLLING_MODE) === false || loadOptions) {
      return super.load(loadOptions);
    }
    return this._virtualScrollController.load();
  }

  public isLoading() {
    return this.option(LEGACY_SCROLLING_MODE) === false ? this._dataSource.isLoading() : this._isLoading;
  }

  public isLoaded() {
    return this._dataSource.isLoaded() && this._isLoaded;
  }

  protected resetPagesCache(isLiveUpdate?) {
    if (!isLiveUpdate) {
      this._virtualScrollController.reset(true);
    }
    super.resetPagesCache.apply(this, arguments as any);
  }

  protected _changeRowExpandCore() {
    const result = super._changeRowExpandCore.apply(this, arguments as any);

    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return result;
    }

    this.resetPagesCache();
    updateLoading(this);

    return result;
  }

  public reload() {
    this._dataSource.pageIndex(this.pageIndex());
    const virtualScrollController = this._virtualScrollController;

    if (this.option(LEGACY_SCROLLING_MODE) !== false && virtualScrollController) {
      // @ts-expect-error
      const d = new Deferred();
      super.reload.apply(this, arguments as any).done((r) => {
        const delayDeferred = virtualScrollController.getDelayDeferred();
        if (delayDeferred) {
          delayDeferred.done(d.resolve).fail(d.reject);
        } else {
          d.resolve(r);
        }
      }).fail(d.reject);
      return d;
    }
    return super.reload.apply(this, arguments as any);
  }

  public refresh(options, operationTypes) {
    if (this.option(LEGACY_SCROLLING_MODE) !== false) {
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
    }

    return super.refresh.apply(this, arguments as any);
  }

  public loadPageCount(count?) {
    if (!isDefined(count)) {
      return this._loadPageCount;
    }
    this._loadPageCount = count;
  }

  protected _handleDataLoading(options) {
    const loadPageCount = this.loadPageCount();
    const pageSize = this.pageSize();
    const newMode = this.option(LEGACY_SCROLLING_MODE) === false;
    const { storeLoadOptions } = options;
    const takeIsDefined = isDefined(storeLoadOptions.take);

    options.loadPageCount = loadPageCount;
    if (!options.isCustomLoading && newMode && takeIsDefined && loadPageCount > 1 && pageSize > 0) {
      storeLoadOptions.take = loadPageCount * pageSize;
    }
    super._handleDataLoading.apply(this, arguments as any);
  }

  protected _loadPageSize() {
    return super._loadPageSize.apply(this, arguments as any) * this.loadPageCount();
  }

  private beginPageIndex(): any {
    return proxyDataSourceAdapterMethod(this, 'beginPageIndex', [...arguments]);
  }

  private endPageIndex(): any {
    return proxyDataSourceAdapterMethod(this, 'endPageIndex', [...arguments]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public pageIndex(pageIndex?): any {
    return proxyDataSourceAdapterMethod(this, 'pageIndex', [...arguments]);
  }

  public virtualItemsCount(): any {
    return proxyDataSourceAdapterMethod(this, 'virtualItemsCount', [...arguments]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getContentOffset(type?): any {
    return proxyDataSourceAdapterMethod(this, 'getContentOffset', [...arguments]);
  }

  public getVirtualContentSize(): any {
    return proxyDataSourceAdapterMethod(this, 'getVirtualContentSize', [...arguments]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setContentItemSizes(sizes?): any {
    return proxyDataSourceAdapterMethod(this, 'setContentItemSizes', [...arguments]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setViewportPosition(position?): any {
    return proxyDataSourceAdapterMethod(this, 'setViewportPosition', [...arguments]);
  }

  public getViewportItemIndex(): any {
    return proxyDataSourceAdapterMethod(this, 'getViewportItemIndex', [...arguments]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setViewportItemIndex(viewportItemIndex?): any {
    return proxyDataSourceAdapterMethod(this, 'setViewportItemIndex', [...arguments]);
  }

  public getItemIndexByPosition(): any {
    return proxyDataSourceAdapterMethod(this, 'getItemIndexByPosition', [...arguments]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public viewportSize(size?): any {
    return proxyDataSourceAdapterMethod(this, 'viewportSize', [...arguments]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public viewportItemSize(size?): any {
    return proxyDataSourceAdapterMethod(this, 'viewportItemSize', [...arguments]);
  }

  public getItemSize(): any {
    return proxyDataSourceAdapterMethod(this, 'getItemSize', [...arguments]);
  }

  public getItemSizes(): any {
    return proxyDataSourceAdapterMethod(this, 'getItemSizes', [...arguments]);
  }

  public loadIfNeed(): any {
    return proxyDataSourceAdapterMethod(this, 'loadIfNeed', [...arguments]);
  }
};

export const resizing = (Base: ModuleType<ResizingController>) => class VirtualScrollingResizingControllerExtender extends Base {
  private _resizeTimeout: any;

  private _lastTime: any;

  public dispose() {
    super.dispose.apply(this, arguments as any);
    clearTimeout(this._resizeTimeout);
  }

  private _updateMasterDataGridCore(masterDataGrid) {
    // @ts-expect-error
    return when(super._updateMasterDataGridCore.apply(this, arguments as any)).done((masterDataGridUpdated) => {
      const isNewVirtualMode = isVirtualMode(masterDataGrid) && masterDataGrid.option(LEGACY_SCROLLING_MODE) === false;

      if (!masterDataGridUpdated && isNewVirtualMode) {
        const scrollable = masterDataGrid.getScrollable();

        if (scrollable) {
          masterDataGrid.updateDimensions();
        }
      }
    });
  }

  private hasResizeTimeout() {
    return isDefined(this._resizeTimeout);
  }

  public resetLastResizeTime(): void {
    this._lastTime = undefined;
  }

  public resize(): DeferredObj<unknown> {
    let result;

    if (isVirtualMode(this) || gridCoreUtils.isVirtualRowRendering(this)) {
      clearTimeout(this._resizeTimeout);
      this._resizeTimeout = null;

      const diff = (new Date()) as any - this._lastTime;
      const updateTimeout = this.option('scrolling.updateTimeout');

      if (this._lastTime && diff < updateTimeout) {
        // @ts-expect-error
        result = new Deferred();
        this._resizeTimeout = setTimeout(() => {
          this._resizeTimeout = null;
          super.resize.apply(this).done(result.resolve).fail(result.reject);
          this._lastTime = new Date();
        }, updateTimeout);
        this._lastTime = new Date();
      } else {
        result = super.resize.apply(this);
        if (this._dataController.isLoaded()) {
          this._lastTime = new Date();
        }
      }
    } else {
      result = super.resize.apply(this);
    }
    return result;
  }
};

export const rowsView = (Base: ModuleType<RowsView>) => class VirtualScrollingRowsViewExtender extends Base {
  protected _dataController!: DataController & Partial<StateStoringDataControllerExtension>;

  protected _errorHandlingController!: ErrorHandlingViewController;

  private _isFixedTableRendering: any;

  private _heightWarningIsThrown: any;

  private _windowScroll: any;

  private readonly _scrollTimeoutID: any;

  public init(): void {
    super.init();

    this._errorHandlingController = this.getController('errorHandling');

    this._dataController.pageChanged.add((pageIndex) => {
      const scrollTop = this._scrollTop;

      this.scrollToPage(pageIndex ?? this._dataController.pageIndex());

      if (this.option(LEGACY_SCROLLING_MODE) === false && this._scrollTop === scrollTop) {
        this._dataController
          // @ts-expect-error
          .updateViewport();
      }
    });

    this._dataController.dataSourceChanged.add(() => {
      !this._scrollTop && this._scrollToCurrentPageOnResize();
    });

    this._dataController.stateLoaded?.add(() => {
      this._scrollToCurrentPageOnResize();
    });

    this._scrollToCurrentPageOnResize();
  }

  public dispose() {
    clearTimeout(this._scrollTimeoutID);
    super.dispose();
  }

  private _scrollToCurrentPageOnResize() {
    if (this._dataController.pageIndex() > 0) {
      const resizeHandler = () => {
        this.resizeCompleted.remove(resizeHandler);
        this.scrollToPage(this._dataController.pageIndex());
      };
      this.resizeCompleted.add(resizeHandler);
    }
  }

  private scrollToPage(pageIndex) {
    const pageSize = this._dataController ? this._dataController.pageSize() : 0;
    let scrollPosition;

    if (isVirtualMode(this) || isInfiniteMode(this)) {
      const itemSize = this._dataController
        // @ts-expect-error
        .getItemSize();
      const itemSizes = this._dataController
        // @ts-expect-error
        .getItemSizes();
      const itemIndex = pageIndex * pageSize;

      scrollPosition = itemIndex * itemSize;

      for (const index in itemSizes) {
        // eslint-disable-next-line radix
        if (parseInt(index) < itemIndex) {
          scrollPosition += itemSizes[index] - itemSize;
        }
      }
    } else {
      scrollPosition = 0;
    }

    this.scrollTo({ y: scrollPosition, x: this._scrollLeft });
  }

  public renderDelayedTemplates() {
    this.waitAsyncTemplates().done(() => {
      this._updateContentPosition(true);
    });
    super.renderDelayedTemplates.apply(this, arguments as any);
  }

  protected _renderCore(e) {
    const startRenderTime = Date.now();

    const deferred = super._renderCore.apply(this, arguments as any);

    const dataSource = this._dataController._dataSource as VirtualScrollingDataSourceAdapter | null | undefined;

    if (dataSource && e) {
      const itemCount = e.items ? e.items.length : 20;
      const viewportSize = this._dataController
        // @ts-expect-error
        .viewportSize() || 20;

      if (gridCoreUtils.isVirtualRowRendering(this) && itemCount > 0 && this.option(LEGACY_SCROLLING_MODE) !== false) {
        dataSource._renderTime = (Date.now() - startRenderTime) * viewportSize / itemCount;
      } else {
        dataSource._renderTime = Date.now() - startRenderTime;
      }
    }
    return deferred;
  }

  public _getRowElements(tableElement) {
    const $rows = super._getRowElements(tableElement);

    return $rows?.not(`.${VIRTUAL_ROW_CLASS}`);
  }

  private _removeRowsElements(contentTable, removeCount, changeType) {
    let rowElements = this._getRowElements(contentTable).toArray();
    if (changeType === 'append') {
      rowElements = rowElements.slice(0, removeCount);
    } else {
      rowElements = rowElements.slice(-removeCount);
    }

    rowElements.map((rowElement) => {
      const $rowElement = $(rowElement);
      this._errorHandlingController && this._errorHandlingController.removeErrorRow(
        $rowElement.next(),
      );
      $rowElement.remove();
    });
  }

  protected _updateContent(tableElement, change) {
    let $freeSpaceRowElements;
    const contentElement = this._findContentElement();
    const changeType = change?.changeType;
    const d: any = Deferred();

    const contentTable = contentElement.children().first();
    if (changeType === 'append' || changeType === 'prepend') {
      this.waitAsyncTemplates().done(() => {
        const $tBodies = this._getBodies(tableElement);
        if ($tBodies.length === 1) {
          this._getBodies(contentTable)[changeType === 'append' ? 'append' : 'prepend']($tBodies.children());
        } else {
          $tBodies[changeType === 'append' ? 'appendTo' : 'prependTo'](contentTable);
        }

        tableElement.remove();
        $freeSpaceRowElements = this._getFreeSpaceRowElements(contentTable);
        removeEmptyRows($freeSpaceRowElements, FREESPACE_CLASS);

        if (change.removeCount) {
          this._removeRowsElements(contentTable, change.removeCount, changeType);
        }

        this._restoreErrorRow(contentTable);
        d.resolve();
      }).fail(d.reject);
    } else {
      super._updateContent.apply(this, arguments as any).done(() => {
        if (changeType === 'update') {
          this._restoreErrorRow(contentTable);
        }
        d.resolve();
      }).fail(d.reject);
    }

    return d.promise().done(() => {
      this._updateBottomLoading();
    });
  }

  private _addVirtualRow($table, isFixed, location, position) {
    if (!position) return;

    let $virtualRow = this._createEmptyRow(VIRTUAL_ROW_CLASS, isFixed, position);

    $virtualRow = this._wrapRowIfNeed($table, $virtualRow);

    this._appendEmptyRow($table, $virtualRow, location);
  }

  private _updateContentItemSizes() {
    const rowHeights = this._getRowHeights();
    const correctedRowHeights = this._correctRowHeights(rowHeights);

    this._dataController
      // @ts-expect-error
      .setContentItemSizes(correctedRowHeights);
  }

  private _updateViewportSize(viewportHeight, scrollTop?) {
    if (!isDefined(viewportHeight)) {
      viewportHeight = this._hasHeight ? getOuterHeight(this.element()) : getOuterHeight(getWindow());
    }

    this._dataController
      // @ts-expect-error
      .viewportHeight(viewportHeight, scrollTop);
  }

  private _getRowHeights() {
    const isPopupEditMode = this._editingController
      // @ts-expect-error
      ?.isPopupEditMode?.();

    let rowElements = this._getRowElements(this._tableElement).toArray();

    if (isPopupEditMode) {
      rowElements = rowElements.filter((row) => !$(row).hasClass(ROW_INSERTED));
    }

    return rowElements.map((row) => getBoundingRect(row).height);
  }

  private _correctRowHeights(rowHeights) {
    const dataController = this._dataController;
    const dataSource = dataController._dataSource;
    const correctedRowHeights: any = [];
    const visibleRows = dataController.getVisibleRows();
    let itemSize = 0;
    let firstCountableItem = true;
    let lastLoadIndex: any = -1;

    for (let i = 0; i < rowHeights.length; i++) {
      const currentItem = visibleRows[i];
      if (!isDefined(currentItem)) {
        continue;
      }

      if (this.option(LEGACY_SCROLLING_MODE) === false) {
        if (lastLoadIndex >= 0 && lastLoadIndex !== currentItem.loadIndex) {
          correctedRowHeights.push(itemSize);
          itemSize = 0;
        }
        lastLoadIndex = currentItem.loadIndex;
      } else if (isItemCountableByDataSource(currentItem, dataSource as unknown as GroupCountableDataSource)) {
        if (firstCountableItem) {
          firstCountableItem = false;
        } else {
          correctedRowHeights.push(itemSize);
          itemSize = 0;
        }
      }

      itemSize += rowHeights[i];
    }
    itemSize > 0 && correctedRowHeights.push(itemSize);
    return correctedRowHeights;
  }

  protected _updateContentPosition(isRender?) {
    const rowHeight = this._rowHeight || 20;

    this._dataController
      // @ts-expect-error
      .viewportItemSize(rowHeight);

    if (isVirtualMode(this) || gridCoreUtils.isVirtualRowRendering(this)) {
      const isEmptyRows = this._dataController.isEmpty();
      if (isEmptyRows) {
        return;
      }

      if (!isRender) {
        this._updateContentItemSizes();
      }

      const top = this._dataController
        // @ts-expect-error
        .getContentOffset('begin');

      const bottom = this._dataController
        // @ts-expect-error
        .getContentOffset('end');
      const $tables = this.getTableElements();
      const $virtualRows = $tables.children('tbody').children(`.${VIRTUAL_ROW_CLASS}`);

      removeEmptyRows($virtualRows, VIRTUAL_ROW_CLASS);

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

  private _isTableLinesDisplaysCorrect(table) {
    const hasColumnLines = table.find(`.${COLUMN_LINES_CLASS}`).length > 0;
    return hasColumnLines === this.option('showColumnLines');
  }

  private _isColumnElementsEqual($columns, $virtualColumns) {
    let result = $columns.length === $virtualColumns.length;

    if (result) {
      each($columns, (index, element) => {
        if (element.style.width !== $virtualColumns[index].style.width) {
          result = false;
          return result;
        }

        return undefined;
      });
    }

    return result;
  }

  private _getCellClasses(column) {
    const classes: any = [];
    const { cssClass } = column;
    const isExpandColumn = column.command === 'expand';

    cssClass && classes.push(cssClass);
    isExpandColumn && classes.push(this.addWidgetPrefix(GROUP_SPACE_CLASS));

    return classes;
  }

  private _findBottomLoadPanel($contentElement?) {
    const $element = $contentElement || this.element();
    const $bottomLoadPanel = $element?.find(`.${this.addWidgetPrefix(BOTTOM_LOAD_PANEL_CLASS)}`);
    if ($bottomLoadPanel?.length) {
      return $bottomLoadPanel;
    }
  }

  private _updateBottomLoading() {
    const that = this;
    const virtualMode = isVirtualMode(this);
    const infiniteMode = isInfiniteMode(this);
    const showBottomLoading = !that._dataController.hasKnownLastPage() && that._dataController.isLoaded() && (virtualMode || infiniteMode);
    const $contentElement = that._findContentElement();
    const bottomLoadPanelElement = that._findBottomLoadPanel($contentElement);

    if (showBottomLoading) {
      if (!bottomLoadPanelElement) {
        $('<div>')
          .addClass(that.addWidgetPrefix(BOTTOM_LOAD_PANEL_CLASS))
          .append(that._createComponent($('<div>'), LoadIndicator, {
            elementAttr: {
              role: null,
              'aria-label': null,
            },
          }).$element())
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
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const isValidScrollTarget = this._hasHeight || !legacyScrollingMode && zeroTopPosition;

    if (hasScrolled && isValidScrollTarget && this._rowHeight) {
      this._scrollTop = e.scrollOffset.top;
      const isVirtualRowRendering = isVirtualMode(this) || this.option('scrolling.rowRenderingMode') !== 'standard';

      if (isVirtualRowRendering && this.option(LEGACY_SCROLLING_MODE) === false) {
        this._updateContentItemSizes();
        this._updateViewportSize(null, this._scrollTop);
      }

      this._dataController
        // @ts-expect-error
        .setViewportPosition(e.scrollOffset.top);
    }
    super._handleScroll.apply(this, arguments as any);
  }

  protected _needUpdateRowHeight(itemsCount) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return super._needUpdateRowHeight.apply(this, arguments as any) || (itemsCount > 0
              && (isInfiniteMode(this) && !gridCoreUtils.isVirtualRowRendering(this))
    );
  }

  protected _updateRowHeight() {
    super._updateRowHeight.apply(this, arguments as any);

    if (this._rowHeight) {
      this._updateContentPosition();

      const viewportHeight = this._hasHeight ? getOuterHeight(this.element()) : getOuterHeight(getWindow());

      if (this.option(LEGACY_SCROLLING_MODE) === false) {
        this._updateViewportSize(viewportHeight);

        this._dataController
          // @ts-expect-error
          .updateViewport();
      } else {
        this._dataController
          // @ts-expect-error
          .viewportSize(Math.ceil(viewportHeight / this._rowHeight));
      }
    }
  }

  public updateFreeSpaceRowHeight() {
    const result: any = super.updateFreeSpaceRowHeight.apply(this, arguments as any);

    if (result) {
      this._updateContentPosition();
    }

    return result;
  }

  public setLoading(isLoading, messageText) {
    const dataController = this._dataController;
    const hasBottomLoadPanel = dataController.pageIndex() > 0 && dataController.isLoaded() && !!this._findBottomLoadPanel();
    const isDefaultLoading = isLoading && !dataController.isCustomLoading();

    if (this.option(LEGACY_SCROLLING_MODE) === false && isDefaultLoading && dataController.isViewportChanging()) {
      return;
    }

    if (hasBottomLoadPanel) {
      isLoading = false;
    }

    super.setLoading.call(this, isLoading, messageText);
  }

  private isGridDragging() {
    return this.component.option('isDragging');
  }

  // NOTE: warning won't be thrown if height was specified and then removed,
  // because for some reason `_hasHeight` is not updated properly in this case
  private throwHeightWarningIfNeed() {
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

  protected _resizeCore() {
    const that = this;
    const $element = that.element();

    super._resizeCore();

    this.throwHeightWarningIfNeed();

    if (that.component.$element() && !that._windowScroll && isElementInDom($element)) {
      that._windowScroll = subscribeToExternalScrollers($element, (scrollPos) => {
        if (!that._hasHeight && that._rowHeight) {
          that._dataController
            // @ts-expect-error
            .setViewportPosition(scrollPos);
        }
      }, that.component.$element());

      that.on('disposing', () => {
        that._windowScroll.dispose();
      });
    }

    if (this.option(LEGACY_SCROLLING_MODE) !== false) {
      that.loadIfNeed();
    }
  }

  public loadIfNeed() {
    this._dataController
      // @ts-expect-error
      ?.loadIfNeed?.();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _restoreErrorRow(contentTable?) {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      this._errorHandlingController?.removeErrorRow();
    }

    super._restoreErrorRow.apply(this, arguments as any);
  }
};
