import { getOuterHeight } from '@js/core/utils/size';
import $ from '@js/core/renderer';
import { getWindow } from '@js/core/utils/window';
import { each } from '@js/core/utils/iterator';
// @ts-expect-error
import { when, Deferred } from '@js/core/utils/deferred';
import browser from '@js/core/utils/browser';
import { getBoundingRect } from '@js/core/utils/position';
import { isDefined } from '@js/core/utils/type';
import LoadIndicator from '@js/ui/load_indicator';
import { VirtualScrollController, subscribeToExternalScrollers } from '@js/ui/grid_core/ui.grid_core.virtual_scrolling_core';
import gridCoreUtils from '../module_utils';

const BOTTOM_LOAD_PANEL_CLASS = 'bottom-load-panel';
const TABLE_CONTENT_CLASS = 'table-content';
const GROUP_SPACE_CLASS = 'group-space';
const CONTENT_CLASS = 'content';
const FREESPACE_CLASS = 'dx-freespace-row';
const COLUMN_LINES_CLASS = 'dx-column-lines';
const VIRTUAL_ROW_CLASS = 'dx-virtual-row';
const ROW_INSERTED = 'dx-row-inserted';

const SCROLLING_MODE_INFINITE = 'infinite';
const SCROLLING_MODE_VIRTUAL = 'virtual';
const LOAD_TIMEOUT = 300;
const LEGACY_SCROLLING_MODE = 'scrolling.legacyMode';
const VISIBLE_PAGE_INDEX = 'paging.pageIndex';

const isVirtualMode = function (that) {
  return that.option('scrolling.mode') === SCROLLING_MODE_VIRTUAL;
};

const isAppendMode = function (that) {
  return that.option('scrolling.mode') === SCROLLING_MODE_INFINITE;
};

const isVirtualPaging = function (that) {
  return isVirtualMode(that) || isAppendMode(that);
};

const correctCount = function (items, count, fromEnd, isItemCountableFunc) {
  for (let i = 0; i < count + 1; i++) {
    const item = items[fromEnd ? items.length - 1 - i : i];
    if (item && !isItemCountableFunc(item, i === count, fromEnd)) {
      count++;
    }
  }
  return count;
};

const isItemCountableByDataSource = function (item, dataSource) {
  return item.rowType === 'data' && !item.isNewRow || item.rowType === 'group' && dataSource.isGroupItemCountable(item.data);
};

const updateItemIndices = function (items) {
  items.forEach((item, index) => {
    item.rowIndex = index;
  });

  return items;
};

const VirtualScrollingDataSourceAdapterExtender = (function () {
  const updateLoading = function (that) {
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

  const result = {
    init() {
      this.callBase.apply(this, arguments);
      this._items = [];
      this._totalCount = -1;
      this._isLoaded = true;
      this._loadPageCount = 1;

      this._virtualScrollController = new VirtualScrollController(this.component, this._getVirtualScrollDataOptions());
    },
    _getVirtualScrollDataOptions() {
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
    },
    _handleLoadingChanged(isLoading) {
      if (this.option(LEGACY_SCROLLING_MODE) === false) {
        this.callBase.apply(this, arguments);
        return;
      }

      if (!isVirtualMode(this) || this._isLoadingAll) {
        this._isLoading = isLoading;
        this.callBase.apply(this, arguments);
      }

      if (isLoading) {
        this._startLoadTime = new Date();
      } else {
        this._startLoadTime = undefined;
      }
    },
    _handleLoadError() {
      if (this.option(LEGACY_SCROLLING_MODE) !== false) {
        this._isLoading = false;
        this.loadingChanged.fire(false);
      }

      this.callBase.apply(this, arguments);
    },
    _handleDataChanged(e) {
      if (this.option(LEGACY_SCROLLING_MODE) === false) {
        this._items = this._dataSource.items().slice();
        this._totalCount = this._dataSourceTotalCount(true);
        this.callBase.apply(this, arguments);
        return;
      }

      const callBase = this.callBase.bind(this);

      this._virtualScrollController.handleDataChanged(callBase, e);
    },
    _customizeRemoteOperations(options, operationTypes) {
      const newMode = this.option(LEGACY_SCROLLING_MODE) === false;
      let renderAsync = this.option('scrolling.renderAsync');

      if (!isDefined(renderAsync)) {
        renderAsync = this._renderTime >= this.option('scrolling.renderingThreshold');
      }

      if ((isVirtualMode(this) || (isAppendMode(this) && newMode)) && !operationTypes.reload && (operationTypes.skip || newMode) && !renderAsync) {
        options.delay = undefined;
      }

      this.callBase.apply(this, arguments);
    },
    items() {
      return this._items;
    },
    _dataSourceTotalCount(isBase) {
      return this.option(LEGACY_SCROLLING_MODE) === false && isVirtualMode(this) && !isBase ? this._totalCount : this.callBase();
    },
    itemsCount(isBase) {
      if (isBase || this.option(LEGACY_SCROLLING_MODE) === false) {
        return this.callBase();
      }
      return this._virtualScrollController.itemsCount();
    },
    load(loadOptions) {
      if (this.option(LEGACY_SCROLLING_MODE) === false || loadOptions) {
        return this.callBase(loadOptions);
      }
      return this._virtualScrollController.load();
    },
    isLoading() {
      return this.option(LEGACY_SCROLLING_MODE) === false ? this._dataSource.isLoading() : this._isLoading;
    },
    isLoaded() {
      return this._dataSource.isLoaded() && this._isLoaded;
    },
    resetPagesCache(isLiveUpdate) {
      if (!isLiveUpdate) {
        this._virtualScrollController.reset(true);
      }
      this.callBase.apply(this, arguments);
    },
    _changeRowExpandCore() {
      const result = this.callBase.apply(this, arguments);

      if (this.option(LEGACY_SCROLLING_MODE) === false) {
        return result;
      }

      this.resetPagesCache();
      updateLoading(this);

      return result;
    },
    reload() {
      this._dataSource.pageIndex(this.pageIndex());
      const virtualScrollController = this._virtualScrollController;

      if (this.option(LEGACY_SCROLLING_MODE) !== false && virtualScrollController) {
        // @ts-expect-error
        const d = new Deferred();
        this.callBase.apply(this, arguments).done((r) => {
          const delayDeferred = virtualScrollController.getDelayDeferred();
          if (delayDeferred) {
            delayDeferred.done(d.resolve).fail(d.reject);
          } else {
            d.resolve(r);
          }
        }).fail(d.reject);
        return d;
      }
      return this.callBase.apply(this, arguments);
    },
    refresh(options, operationTypes) {
      if (this.option(LEGACY_SCROLLING_MODE) !== false) {
        const { storeLoadOptions } = options;
        const dataSource = this._dataSource;

        if (operationTypes.reload) {
          this._virtualScrollController.reset();
          dataSource.items().length = 0;
          this._isLoaded = false;

          updateLoading(this);
          this._isLoaded = true;

          if (isAppendMode(this)) {
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
        } else if (isAppendMode(this) && storeLoadOptions.skip && this._totalCountCorrection < 0) {
          storeLoadOptions.skip += this._totalCountCorrection;
        }
      }

      return this.callBase.apply(this, arguments);
    },
    dispose() {
      this._virtualScrollController.dispose();
      this.callBase.apply(this, arguments);
    },
    loadPageCount(count) {
      if (!isDefined(count)) {
        return this._loadPageCount;
      }
      this._loadPageCount = count;
    },
    _handleDataLoading(options) {
      const loadPageCount = this.loadPageCount();
      const pageSize = this.pageSize();
      const newMode = this.option(LEGACY_SCROLLING_MODE) === false;
      const { storeLoadOptions } = options;
      const takeIsDefined = isDefined(storeLoadOptions.take);

      options.loadPageCount = loadPageCount;
      if (!options.isCustomLoading && newMode && takeIsDefined && loadPageCount > 1 && pageSize > 0) {
        storeLoadOptions.take = loadPageCount * pageSize;
      }
      this.callBase.apply(this, arguments);
    },
    _loadPageSize() {
      return this.callBase.apply(this, arguments) * this.loadPageCount();
    },
  };

  [
    'beginPageIndex',
    'endPageIndex',
    'pageIndex',
  ].forEach((name) => {
    result[name] = function () {
      if (this.option(LEGACY_SCROLLING_MODE) === false) {
        const dataSource = this._dataSource;
        return dataSource.pageIndex.apply(dataSource, arguments);
      }

      const virtualScrollController = this._virtualScrollController;
      return virtualScrollController[name].apply(virtualScrollController, arguments);
    };
  });

  [
    'virtualItemsCount',
    'getContentOffset',
    'getVirtualContentSize',
    'setContentItemSizes', 'setViewportPosition',
    'getViewportItemIndex', 'setViewportItemIndex', 'getItemIndexByPosition',
    'viewportSize', 'viewportItemSize', 'getItemSize', 'getItemSizes',
    'loadIfNeed',
  ].forEach((name) => {
    result[name] = function () {
      const virtualScrollController = this._virtualScrollController;
      return virtualScrollController[name].apply(virtualScrollController, arguments);
    };
  });

  return result;
}());

const VirtualScrollingRowsViewExtender = (function () {
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

  return {
    init() {
      const dataController = this.getController('data');

      this.callBase();

      dataController.pageChanged.add((pageIndex) => {
        const scrollTop = this._scrollTop;

        this.scrollToPage(pageIndex ?? dataController.pageIndex());

        if (this.option(LEGACY_SCROLLING_MODE) === false && this._scrollTop === scrollTop) {
          dataController.updateViewport();
        }
      });

      dataController.dataSourceChanged.add(() => {
        !this._scrollTop && this._scrollToCurrentPageOnResize();
      });

      dataController.stateLoaded?.add(() => {
        this._scrollToCurrentPageOnResize();
      });

      this._scrollToCurrentPageOnResize();
    },

    _scrollToCurrentPageOnResize() {
      const dataController = this.getController('data');

      if (dataController.pageIndex() > 0) {
        const resizeHandler = () => {
          this.resizeCompleted.remove(resizeHandler);
          this.scrollToPage(dataController.pageIndex());
        };
        this.resizeCompleted.add(resizeHandler);
      }
    },

    scrollToPage(pageIndex) {
      const that = this;
      const dataController = that._dataController;
      const pageSize = dataController ? dataController.pageSize() : 0;
      let scrollPosition;

      if (isVirtualMode(that) || isAppendMode(that)) {
        const itemSize = dataController.getItemSize();
        const itemSizes = dataController.getItemSizes();
        const itemIndex = pageIndex * pageSize;

        scrollPosition = itemIndex * itemSize;

        // eslint-disable-next-line no-restricted-syntax
        for (const index of itemSizes) {
          if (index < itemIndex) {
            scrollPosition += itemSizes[index] - itemSize;
          }
        }
      } else {
        scrollPosition = 0;
      }

      that.scrollTo({ y: scrollPosition, x: that._scrollLeft });
    },

    renderDelayedTemplates() {
      this.waitAsyncTemplates().done(() => {
        this._updateContentPosition(true);
      });
      this.callBase.apply(this, arguments);
    },

    _renderCore(e) {
      const startRenderTime: any = new Date();

      const deferred = this.callBase.apply(this, arguments);

      const dataSource = this._dataController._dataSource;

      if (dataSource && e) {
        const itemCount = e.items ? e.items.length : 20;
        const viewportSize = this._dataController.viewportSize() || 20;

        if (gridCoreUtils.isVirtualRowRendering(this) && itemCount > 0 && this.option(LEGACY_SCROLLING_MODE) !== false) {
          dataSource._renderTime = ((new Date()) as any - startRenderTime) * viewportSize / itemCount;
        } else {
          dataSource._renderTime = ((new Date()) as any - startRenderTime);
        }
      }
      return deferred;
    },

    _getRowElements(tableElement) {
      const $rows = this.callBase(tableElement);

      return $rows && $rows.not(`.${VIRTUAL_ROW_CLASS}`);
    },

    _removeRowsElements(contentTable, removeCount, changeType) {
      let rowElements = this._getRowElements(contentTable).toArray();
      if (changeType === 'append') {
        rowElements = rowElements.slice(0, removeCount);
      } else {
        rowElements = rowElements.slice(-removeCount);
      }

      const errorHandlingController = this.getController('errorHandling');
      rowElements.map((rowElement) => {
        const $rowElement = $(rowElement);
        // @ts-expect-error
        errorHandlingController && errorHandlingController.removeErrorRow($rowElement.next());
        // @ts-expect-error
        $rowElement.remove();
      });
    },

    _updateContent(tableElement, change) {
      let $freeSpaceRowElements;
      const contentElement = this._findContentElement();
      const changeType = change && change.changeType;
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
        this.callBase.apply(this, arguments).done(() => {
          if (changeType === 'update') {
            this._restoreErrorRow(contentTable);
          }
          d.resolve();
        }).fail(d.reject);
      }

      return d.promise().done(() => {
        this._updateBottomLoading();
      });
    },
    _addVirtualRow($table, isFixed, location, position) {
      if (!position) return;

      let $virtualRow = this._createEmptyRow(VIRTUAL_ROW_CLASS, isFixed, position);

      $virtualRow = this._wrapRowIfNeed($table, $virtualRow);

      this._appendEmptyRow($table, $virtualRow, location);
    },
    _updateContentItemSizes() {
      const rowHeights = this._getRowHeights();
      const correctedRowHeights = this._correctRowHeights(rowHeights);

      this._dataController.setContentItemSizes(correctedRowHeights);
    },
    _updateViewportSize(viewportHeight, scrollTop) {
      if (!isDefined(viewportHeight)) {
        viewportHeight = this._hasHeight ? getOuterHeight(this.element()) : getOuterHeight(getWindow());
      }

      this._dataController.viewportHeight(viewportHeight, scrollTop);
    },
    _getRowHeights() {
      const isPopupEditMode = this.getController('editing')?.isPopupEditMode?.();

      let rowElements = this._getRowElements(this._tableElement).toArray();

      if (isPopupEditMode) {
        rowElements = rowElements.filter((row) => !$(row).hasClass(ROW_INSERTED));
      }

      return rowElements.map((row) => getBoundingRect(row).height);
    },
    _correctRowHeights(rowHeights) {
      const dataController = this._dataController;
      const dataSource = dataController._dataSource;
      const correctedRowHeights: any = [];
      const visibleRows = dataController.getVisibleRows();
      let itemSize = 0;
      let firstCountableItem = true;
      let lastLoadIndex = -1;

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
        } else if (isItemCountableByDataSource(currentItem, dataSource)) {
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
    },
    _updateContentPosition(isRender) {
      const dataController = this._dataController;
      const rowHeight = this._rowHeight || 20;

      dataController.viewportItemSize(rowHeight);

      if (isVirtualMode(this) || gridCoreUtils.isVirtualRowRendering(this)) {
        if (!isRender) {
          this._updateContentItemSizes();
        }

        const top = dataController.getContentOffset('begin');
        const bottom = dataController.getContentOffset('end');
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
    },

    _isTableLinesDisplaysCorrect(table) {
      const hasColumnLines = table.find(`.${COLUMN_LINES_CLASS}`).length > 0;
      return hasColumnLines === this.option('showColumnLines');
    },

    _isColumnElementsEqual($columns, $virtualColumns) {
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
    },

    _getCellClasses(column) {
      const classes: any = [];
      const { cssClass } = column;
      const isExpandColumn = column.command === 'expand';

      cssClass && classes.push(cssClass);
      isExpandColumn && classes.push(this.addWidgetPrefix(GROUP_SPACE_CLASS));

      return classes;
    },

    _findBottomLoadPanel($contentElement) {
      const $element = $contentElement || this.element();
      const $bottomLoadPanel = $element && $element.find(`.${this.addWidgetPrefix(BOTTOM_LOAD_PANEL_CLASS)}`);
      if ($bottomLoadPanel && $bottomLoadPanel.length) {
        return $bottomLoadPanel;
      }
    },

    _updateBottomLoading() {
      const that = this;
      const virtualMode = isVirtualMode(this);
      const appendMode = isAppendMode(this);
      const showBottomLoading = !that._dataController.hasKnownLastPage() && that._dataController.isLoaded() && (virtualMode || appendMode);
      const $contentElement = that._findContentElement();
      const bottomLoadPanelElement = that._findBottomLoadPanel($contentElement);

      if (showBottomLoading) {
        if (!bottomLoadPanelElement) {
          $('<div>')
            .addClass(that.addWidgetPrefix(BOTTOM_LOAD_PANEL_CLASS))
            .append(that._createComponent($('<div>'), LoadIndicator).$element())
            .appendTo($contentElement);
        }
      } else if (bottomLoadPanelElement) {
        bottomLoadPanelElement.remove();
      }
    },

    _handleScroll(e) {
      const legacyScrollingMode = this.option(LEGACY_SCROLLING_MODE) === true;
      const zeroTopPosition = e.scrollOffset.top === 0;
      const isScrollTopChanged = this._scrollTop !== e.scrollOffset.top;
      const hasScrolled = isScrollTopChanged || e.forceUpdateScrollPosition;
      const isValidScrollTarget = this._hasHeight || !legacyScrollingMode && zeroTopPosition;

      if (hasScrolled && isValidScrollTarget && this._rowHeight) {
        this._scrollTop = e.scrollOffset.top;
        const isVirtualRowRendering = isVirtualMode(this) || this.option('scrolling.rowRenderingMode') !== 'standard';

        if (isVirtualRowRendering && this.option(LEGACY_SCROLLING_MODE) === false) {
          this._updateContentItemSizes();
          this._updateViewportSize(null, this._scrollTop);
        }

        this._dataController.setViewportPosition(e.scrollOffset.top);
      }
      this.callBase.apply(this, arguments);
    },

    _needUpdateRowHeight(itemsCount) {
      return this.callBase.apply(this, arguments) || (itemsCount > 0
                && (isAppendMode(this) && !gridCoreUtils.isVirtualRowRendering(this))
      );
    },

    _updateRowHeight() {
      this.callBase.apply(this, arguments);

      if (this._rowHeight) {
        this._updateContentPosition();

        const viewportHeight = this._hasHeight ? getOuterHeight(this.element()) : getOuterHeight(getWindow());
        const dataController = this._dataController;

        if (this.option(LEGACY_SCROLLING_MODE) === false) {
          this._updateViewportSize(viewportHeight);
          dataController.updateViewport();
        } else {
          dataController.viewportSize(Math.ceil(viewportHeight / this._rowHeight));
        }
      }
    },

    updateFreeSpaceRowHeight() {
      const result = this.callBase.apply(this, arguments);

      if (result) {
        this._updateContentPosition();
      }

      return result;
    },

    setLoading(isLoading, messageText) {
      const dataController = this._dataController;
      const hasBottomLoadPanel = dataController.pageIndex() > 0 && dataController.isLoaded() && !!this._findBottomLoadPanel();

      if (this.option(LEGACY_SCROLLING_MODE) === false && isLoading && dataController.isViewportChanging()) {
        return;
      }

      if (hasBottomLoadPanel) {
        isLoading = false;
      }

      this.callBase.call(this, isLoading, messageText);
    },

    _resizeCore() {
      const that = this;
      const $element = that.element();

      that.callBase();

      if (that.component.$element() && !that._windowScroll && $element.closest(getWindow().document).length) {
        that._windowScroll = subscribeToExternalScrollers($element, (scrollPos) => {
          if (!that._hasHeight && that._rowHeight) {
            that._dataController.setViewportPosition(scrollPos);
          }
        }, that.component.$element());

        that.on('disposing', () => {
          that._windowScroll.dispose();
        });
      }

      if (this.option(LEGACY_SCROLLING_MODE) !== false) {
        that.loadIfNeed();
      }
    },

    loadIfNeed() {
      const dataController = this._dataController;
      dataController?.loadIfNeed?.();
    },

    setColumnWidths(widths) {
      const scrollable = this.getScrollable();
      let $content;

      this.callBase.apply(this, arguments);

      if (this.option('scrolling.mode') === 'virtual') {
        $content = scrollable ? $(scrollable.content()) : this.element();
        this.callBase(widths, $content.children(`.${this.addWidgetPrefix(CONTENT_CLASS)}`).children(`:not(.${this.addWidgetPrefix(TABLE_CONTENT_CLASS)})`));
      }
    },

    _restoreErrorRow() {
      if (this.option(LEGACY_SCROLLING_MODE) === false) {
        const errorHandling = this.getController('errorHandling');
        errorHandling?.removeErrorRow();
      }

      this.callBase.apply(this, arguments);
    },

    dispose() {
      clearTimeout(this._scrollTimeoutID);
      this.callBase();
    },
  };
}());

export const virtualScrollingModule = {
  defaultOptions() {
    return {
      scrolling: {
        timeout: 300,
        updateTimeout: 300,
        minTimeout: 0,
        renderingThreshold: 100,
        removeInvisiblePages: true,
        rowPageSize: 5,
        prerenderedRowChunkSize: 1,
        mode: 'standard',
        preloadEnabled: false,
        rowRenderingMode: 'standard',
        loadTwoPagesOnStart: false,
        legacyMode: false,
        prerenderedRowCount: 1,
      },
    };
  },
  extenders: {
    dataSourceAdapter: VirtualScrollingDataSourceAdapterExtender,
    controllers: {
      data: (function () {
        const members = {
          _refreshDataSource() {
            // @ts-expect-error
            const baseResult = this.callBase.apply(this, arguments) || new Deferred().resolve().promise();
            baseResult.done(this.initVirtualRows.bind(this));
            return baseResult;
          },
          _loadDataSource() {
            if (this._rowsScrollController && isVirtualPaging(this)) {
              const { loadPageCount } = isDefined(this._loadViewportParams) ? this.getLoadPageParams() : { loadPageCount: undefined };

              loadPageCount >= 1 && this._dataSource?.loadPageCount(loadPageCount);
            }

            return this.callBase.apply(this, arguments);
          },
          getRowPageSize() {
            const rowPageSize = this.option('scrolling.rowPageSize');
            const pageSize = this.pageSize();

            return pageSize && pageSize < rowPageSize ? pageSize : rowPageSize;
          },
          reload() {
            const rowsScrollController = this._rowsScrollController || this._dataSource;
            const itemIndex = rowsScrollController && rowsScrollController.getItemIndexByPosition();
            const result = this.callBase.apply(this, arguments);
            return result && result.done(() => {
              if (isVirtualMode(this) || gridCoreUtils.isVirtualRowRendering(this)) {
                const rowIndexOffset = this.getRowIndexOffset();
                const rowIndex = Math.floor(itemIndex) - rowIndexOffset;
                const { component } = this;
                const scrollable = component.getScrollable && component.getScrollable();
                const isSortingOperation = this.dataSource().operationTypes().sorting;

                if (scrollable && !isSortingOperation && rowIndex >= 0) {
                  const rowElement = component.getRowElement(rowIndex);
                  const $rowElement = rowElement && rowElement[0] && $(rowElement[0]);
                  let top = $rowElement && $rowElement.position().top;
                  const isChromeLatest = browser.chrome && Number(browser.version ?? 0) >= 91;
                  const allowedTopOffset = browser.mozilla || isChromeLatest ? 1 : 0; // T884308
                  if (top > allowedTopOffset) {
                    top = Math.round(top + getOuterHeight($rowElement) * (itemIndex % 1));
                    scrollable.scrollTo({ y: top });
                  }
                }
              }
            });
          },
          initVirtualRows() {
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
                this._dataSource?.setViewportItemIndex(this._rowsScrollController.getViewportItemIndex());
              });
            }

            if (this.option(LEGACY_SCROLLING_MODE) === false) {
              this._updateLoadViewportParams();
            }

            if (this.isLoaded() && this.option(LEGACY_SCROLLING_MODE) !== false) {
              this._rowsScrollController.load();
            }
          },
          isViewportChanging() {
            return this._viewportChanging;
          },
          _getRowsScrollDataOptions() {
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
                if (that._rowsScrollController.pageIndex() >= this.pageCount()) {
                  that._rowPageIndex = this.pageCount() - 1;
                  that._rowsScrollController.pageIndex(that._rowPageIndex);
                }

                if (!this.items().length && this.totalItemsCount()) return;

                that._rowsScrollController.handleDataChanged((change) => {
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
              correctCount(items, count, fromEnd) {
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
          },
          _updateItemsCore(change) {
            const delta = this.getRowIndexDelta();

            this.callBase.apply(this, arguments);
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
          },
          _updateLoadViewportParams() {
            const viewportParams = this._rowsScrollController.getViewportParams();
            const pageSize = this.pageSize();

            if (viewportParams && !isVirtualPaging(this) && pageSize > 0) {
              const pageOffset = this.pageIndex() * pageSize;
              viewportParams.skip += pageOffset;
            }
            this._loadViewportParams = viewportParams;
          },
          _processItems() {
            const newItems = this.callBase.apply(this, arguments);

            if (this.option(LEGACY_SCROLLING_MODE) === false) {
              const dataSource = this._dataSource;
              let currentIndex = dataSource?.lastLoadOptions().skip ?? 0;
              let prevCountable;
              let prevRowType;
              let isPrevRowNew;
              let wasCountableItem = false;

              newItems.forEach((item) => {
                const { rowType } = item;
                const itemCountable = isItemCountableByDataSource(item, dataSource);

                const isNextGroupItem = rowType === 'group' && (prevCountable || itemCountable || (prevRowType !== 'group' && currentIndex > 0));
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

                item.loadIndex = currentIndex;
                prevCountable = itemCountable;
                prevRowType = rowType;
                isPrevRowNew = item.isNewRow;
              });
            }

            return newItems;
          },
          _afterProcessItems(items) {
            this._itemCount = items.filter((item) => isItemCountableByDataSource(item, this._dataSource)).length;
            if (isDefined(this._loadViewportParams)) {
              this._updateLoadViewportParams();

              let result = items;
              this._allItems = items;

              if (items.length) {
                const { skipForCurrentPage } = this.getLoadPageParams(true);
                const skip = items[0].loadIndex + skipForCurrentPage;
                const { take } = this._loadViewportParams;

                result = items.filter((it) => {
                  const isNewRowOnStart = it.isNewRow && it.loadIndex >= skip - 1;
                  const isNewRowInEmptyData = it.isNewRow && it.loadIndex === skip && take === 0;
                  const isLoadIndexGreaterStart = it.loadIndex >= skip || isNewRowOnStart;
                  const isLoadIndexLessEnd = it.loadIndex < skip + take || isNewRowInEmptyData;

                  return isLoadIndexGreaterStart && isLoadIndexLessEnd;
                });
              }

              return result;
            }

            return this.callBase.apply(this, arguments);
          },
          _applyChange(change) {
            const that = this;
            const { items } = change;
            const { changeType } = change;
            let { removeCount } = change;

            if (removeCount) {
              const fromEnd = changeType === 'prepend';
              removeCount = correctCount(that._items, removeCount, fromEnd, (item, isNextAfterLast) => item.rowType === 'data' && !item.isNewRow || (item.rowType === 'group' && (that._dataSource.isGroupItemCountable(item.data) || isNextAfterLast)));

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
                that.callBase(change);
                break;
            }
          },
          items(allItems) {
            return allItems ? this._allItems || this._items : this._visibleItems || this._items;
          },
          getRowIndexDelta() {
            let delta = 0;

            if (this.option(LEGACY_SCROLLING_MODE)) {
              const visibleItems = this._visibleItems;

              if (visibleItems && visibleItems[0]) {
                delta = this._items.indexOf(visibleItems[0]);
              }
            }

            return delta < 0 ? 0 : delta;
          },
          getRowIndexOffset(byLoadedRows) {
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
              offset = dataSource.lastLoadOptions().skip ?? 0;
            } else if (isVirtualMode(this) && dataSource) {
              offset = dataSource.beginPageIndex() * dataSource.pageSize();
            }

            return offset;
          },
          getDataIndex() {
            if (this.option(LEGACY_SCROLLING_MODE) === false) {
              return this.getRowIndexOffset(true);
            }

            return this.callBase.apply(this, arguments);
          },
          viewportSize() {
            const rowsScrollController = this._rowsScrollController;
            const dataSource = this._dataSource;
            const result = rowsScrollController?.viewportSize.apply(rowsScrollController, arguments);

            if (this.option(LEGACY_SCROLLING_MODE) === false) {
              return result;
            }

            return dataSource?.viewportSize.apply(dataSource, arguments);
          },
          viewportHeight(height, scrollTop) {
            this._rowsScrollController?.viewportHeight(height, scrollTop);
          },
          viewportItemSize() {
            const rowsScrollController = this._rowsScrollController;
            const dataSource = this._dataSource;
            const result = rowsScrollController?.viewportItemSize.apply(rowsScrollController, arguments);

            if (this.option(LEGACY_SCROLLING_MODE) === false) {
              return result;
            }

            return dataSource?.viewportItemSize.apply(dataSource, arguments);
          },
          setViewportPosition() {
            const rowsScrollController = this._rowsScrollController;
            const dataSource = this._dataSource;
            this._isPaging = false;

            if (rowsScrollController) {
              rowsScrollController.setViewportPosition.apply(rowsScrollController, arguments);
            } else {
              dataSource?.setViewportPosition.apply(dataSource, arguments);
            }
          },
          setContentItemSizes(sizes) {
            const rowsScrollController = this._rowsScrollController;
            const dataSource = this._dataSource;
            const result = rowsScrollController?.setContentItemSizes(sizes);

            if (this.option(LEGACY_SCROLLING_MODE) === false) {
              return result;
            }

            return dataSource?.setContentItemSizes(sizes);
          },
          getPreloadedRowCount() {
            const preloadCount = this.option('scrolling.preloadedRowCount');
            const preloadEnabled = this.option('scrolling.preloadEnabled');

            if (isDefined(preloadCount)) {
              return preloadCount;
            }

            const viewportSize = this.viewportSize();

            return preloadEnabled ? 2 * viewportSize : viewportSize;
          },
          getLoadPageParams(byLoadedPage) {
            const pageSize = this.pageSize();
            const viewportParams = this._loadViewportParams;
            const lastLoadOptions = this._dataSource?.lastLoadOptions();
            const loadedPageIndex = lastLoadOptions?.pageIndex || 0;
            const loadedTake = lastLoadOptions?.take || 0;

            const isScrollingBack = this._rowsScrollController.isScrollingBack();
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
          },
          _updateVisiblePageIndex(currentPageIndex) {
            if (!this._rowsScrollController) {
              return;
            }
            if (isDefined(currentPageIndex)) {
              this._silentOption(VISIBLE_PAGE_INDEX, currentPageIndex);
              this.pageChanged.fire();
              return;
            }

            const viewPortItemIndex = this._rowsScrollController.getViewportItemIndex();
            const newPageIndex = Math.floor(viewPortItemIndex / this.pageSize());

            if (this.pageIndex() !== newPageIndex) {
              this._silentOption(VISIBLE_PAGE_INDEX, newPageIndex);
              this.updateItems({
                changeType: 'pageIndex',
              });
            }
          },
          _getChangedLoadParams() {
            const loadedPageParams = this.getLoadPageParams(true);
            const { pageIndex, loadPageCount } = this.getLoadPageParams();
            const pageIndexIsValid = this._pageIndexIsValid(pageIndex);
            let result: any = null;

            if (!this._isLoading && pageIndexIsValid && (pageIndex !== loadedPageParams.pageIndex || loadPageCount !== loadedPageParams.loadPageCount)) {
              result = {
                pageIndex,
                loadPageCount,
              };
            }
            return result;
          },
          _pageIndexIsValid(pageIndex) {
            let result = true;

            if (isAppendMode(this) && this.hasKnownLastPage() || isVirtualMode(this)) {
              result = pageIndex * this.pageSize() < this.totalItemsCount();
            }

            return result;
          },
          _loadItems(checkLoading, viewportIsFilled) {
            const virtualPaging = isVirtualPaging(this);
            const dataSourceAdapter = this._dataSource;
            const changedParams = this._getChangedLoadParams();
            const currentLoadPageCount = dataSourceAdapter?.loadPageCount() ?? 0;
            const lastRequiredItemCount = this.pageSize() * currentLoadPageCount;
            const currentPageIndex = dataSourceAdapter?.pageIndex() ?? 0;
            const pageIndexNotChanged = changedParams?.pageIndex === currentPageIndex;
            const allLoadedInAppendMode = isAppendMode(this) && this.totalItemsCount() < lastRequiredItemCount;
            const isRepaintMode = this.option('editing.refreshMode') === 'repaint';
            const pageIndexIncreased = changedParams?.pageIndex > currentPageIndex;
            let result = false;

            if (!dataSourceAdapter || (virtualPaging && checkLoading && ((isRepaintMode && viewportIsFilled) || (pageIndexIncreased || pageIndexNotChanged && allLoadedInAppendMode)))) {
              return result;
            }

            if (virtualPaging && this._isLoading) {
              this._needUpdateViewportAfterLoading = true;
            }

            if (virtualPaging && changedParams) {
              result = true;
              dataSourceAdapter.pageIndex(changedParams.pageIndex);
              dataSourceAdapter.loadPageCount(changedParams.loadPageCount);
              this._repaintChangesOnly = true;
              this._needUpdateDimensions = true;
              const viewportChanging = this._viewportChanging;
              this.load().always(() => {
                this._repaintChangesOnly = undefined;
                this._needUpdateDimensions = undefined;
              }).done(() => {
                const isLastPage = this.pageCount() > 0 && this.pageIndex() === this.pageCount() - 1;
                (viewportChanging || isLastPage) && this._updateVisiblePageIndex();
                if (this._needUpdateViewportAfterLoading) {
                  this._needUpdateViewportAfterLoading = false;
                  this.loadViewport({ checkLoadedParamsOnly: true });
                }
              });
            }

            return result;
          },
          loadViewport(params) {
            const { checkLoadedParamsOnly, checkLoading, viewportIsNotFilled } = params ?? {};
            const virtualPaging = isVirtualPaging(this);
            if (virtualPaging || gridCoreUtils.isVirtualRowRendering(this)) {
              this._updateLoadViewportParams();

              const loadingItemsStarted = this._loadItems(checkLoading, !viewportIsNotFilled);

              const needToUpdateItems = !(loadingItemsStarted
                                || this._isLoading && checkLoading
                                || checkLoadedParamsOnly);

              if (needToUpdateItems) {
                const noPendingChangesInEditing = !this.getController('editing')?.getChanges()?.length;
                this.updateItems({
                  repaintChangesOnly: true,
                  needUpdateDimensions: true,
                  useProcessedItemsCache: noPendingChangesInEditing,
                  cancelEmptyChanges: true,
                });
              }
            }
          },
          updateViewport() {
            const viewportSize = this.viewportSize();
            const itemCount = this.items().length;
            const viewportIsNotFilled = viewportSize > itemCount;
            const currentTake = this._loadViewportParams?.take ?? 0;
            const rowsScrollController = this._rowsScrollController;
            const newTake = rowsScrollController?.getViewportParams().take;

            (viewportIsNotFilled || currentTake < newTake) && !this._isPaging && itemCount && this.loadViewport({
              checkLoading: true,
              viewportIsNotFilled,
            });
          },
          loadIfNeed() {
            if (this.option(LEGACY_SCROLLING_MODE) === false) {
              return;
            }

            const rowsScrollController = this._rowsScrollController;
            rowsScrollController && rowsScrollController.loadIfNeed();

            const dataSource = this._dataSource;
            return dataSource && dataSource.loadIfNeed();
          },
          getItemSize() {
            const rowsScrollController = this._rowsScrollController;

            if (rowsScrollController) {
              return rowsScrollController.getItemSize.apply(rowsScrollController, arguments);
            }

            const dataSource = this._dataSource;
            return dataSource && dataSource.getItemSize.apply(dataSource, arguments);
          },
          getItemSizes() {
            const rowsScrollController = this._rowsScrollController;

            if (rowsScrollController) {
              return rowsScrollController.getItemSizes.apply(rowsScrollController, arguments);
            }

            const dataSource = this._dataSource;
            return dataSource && dataSource.getItemSizes.apply(dataSource, arguments);
          },
          getContentOffset() {
            const rowsScrollController = this._rowsScrollController;

            if (rowsScrollController) {
              return rowsScrollController.getContentOffset.apply(rowsScrollController, arguments);
            }

            const dataSource = this._dataSource;
            return dataSource && dataSource.getContentOffset.apply(dataSource, arguments);
          },
          refresh(options) {
            const dataSource = this._dataSource;

            if (dataSource && options && options.load && isAppendMode(this)) {
              dataSource.resetCurrentTotalCount();
            }

            return this.callBase.apply(this, arguments);
          },
          dispose() {
            const rowsScrollController = this._rowsScrollController;

            rowsScrollController && rowsScrollController.dispose();
            this.callBase.apply(this, arguments);
          },
          topItemIndex() {
            return this._loadViewportParams?.skip;
          },
          bottomItemIndex() {
            const viewportParams = this._loadViewportParams;
            return viewportParams && viewportParams.skip + viewportParams.take;
          },
          virtualItemsCount() {
            const rowsScrollController = this._rowsScrollController;

            if (rowsScrollController) {
              return rowsScrollController.virtualItemsCount.apply(rowsScrollController, arguments);
            }

            const dataSource = this._dataSource;
            return dataSource?.virtualItemsCount.apply(dataSource, arguments);
          },
          pageIndex(pageIndex) {
            const virtualPaging = isVirtualPaging(this);
            const rowsScrollController = this._rowsScrollController;
            if (this.option(LEGACY_SCROLLING_MODE) === false && virtualPaging && rowsScrollController) {
              if (pageIndex === undefined) {
                return this.option(VISIBLE_PAGE_INDEX) ?? 0;
              }
            }
            return this.callBase.apply(this, arguments);
          },
          _fireChanged(e) {
            this.callBase.apply(this, arguments);

            const { operationTypes } = e;
            if (this.option(LEGACY_SCROLLING_MODE) === false && isVirtualPaging(this) && operationTypes) {
              const { fullReload, pageIndex } = operationTypes;

              if (e.isDataChanged && !fullReload && pageIndex) {
                this._updateVisiblePageIndex(this._dataSource.pageIndex());
              }
            }
          },
          _getPagingOptionValue(optionName) {
            let result = this.callBase.apply(this, arguments);

            if (this.option(LEGACY_SCROLLING_MODE) === false && isVirtualPaging(this)) {
              result = this[optionName]();
            }

            return result;
          },
          isEmpty() {
            return this.option(LEGACY_SCROLLING_MODE) === false ? !this.items(true).length : this.callBase(this, arguments);
          },
          isLastPageLoaded() {
            let result = false;

            if (this.option(LEGACY_SCROLLING_MODE) === false && isVirtualPaging(this)) {
              const { pageIndex, loadPageCount } = this.getLoadPageParams(true);
              const pageCount = this.pageCount();

              result = pageIndex + loadPageCount >= pageCount;
            } else {
              result = this.callBase.apply(this, arguments);
            }

            return result;
          },
          reset() {
            this._itemCount = 0;
            this._allItems = null;
            this.callBase.apply(this, arguments);
          },
          _applyFilter() {
            this._dataSource?.loadPageCount(1);
            this.callBase.apply(this, arguments);
          },
        };

        gridCoreUtils.proxyMethod(members, 'getVirtualContentSize');
        gridCoreUtils.proxyMethod(members, 'setViewportItemIndex');

        return members;
      }()),
      resizing: {
        _updateMasterDataGridCore(masterDataGrid) {
          return when(this.callBase.apply(this, arguments)).done((masterDataGridUpdated) => {
            const isNewVirtualMode = isVirtualMode(masterDataGrid) && masterDataGrid.option(LEGACY_SCROLLING_MODE) === false;

            if (!masterDataGridUpdated && isNewVirtualMode) {
              const scrollable = masterDataGrid.getScrollable();

              if (scrollable) {
                masterDataGrid.updateDimensions();
              }
            }
          });
        },

        hasResizeTimeout() {
          return !!this._resizeTimeout;
        },

        resize() {
          const { callBase } = this;
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
                callBase.apply(this).done(result.resolve).fail(result.reject);
                this._lastTime = new Date();
              }, updateTimeout);
              this._lastTime = new Date();
            } else {
              result = callBase.apply(this);
              if (this._dataController.isLoaded()) {
                this._lastTime = new Date();
              }
            }
          } else {
            result = callBase.apply(this);
          }
          return result;
        },
        dispose() {
          this.callBase.apply(this, arguments);
          clearTimeout(this._resizeTimeout);
        },
      },
    },
    views: {
      rowsView: VirtualScrollingRowsViewExtender,
    },
  },
};
