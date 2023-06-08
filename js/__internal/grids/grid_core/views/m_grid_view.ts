import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import { deferRender, deferUpdate } from '@js/core/utils/common';
import { Deferred, when } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { getBoundingRect } from '@js/core/utils/position';
import {
  getHeight,
  getInnerWidth, getOuterWidth, getWidth,
} from '@js/core/utils/size';
import { isDefined, isNumeric, isString } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import messageLocalization from '@js/localization/message';
import * as accessibility from '@js/ui/shared/accessibility';

import modules from '../m_modules';
import gridCoreUtils from '../m_utils';

const BORDERS_CLASS = 'borders';
const TABLE_FIXED_CLASS = 'table-fixed';
const IMPORTANT_MARGIN_CLASS = 'important-margin';
const GRIDBASE_CONTAINER_CLASS = 'dx-gridbase-container';
const GROUP_ROW_SELECTOR = 'tr.dx-group-row';

const HIDDEN_COLUMNS_WIDTH = 'adaptiveHidden';

const VIEW_NAMES = ['columnsSeparatorView', 'blockSeparatorView', 'trackerView', 'headerPanel', 'columnHeadersView', 'rowsView', 'footerView', 'columnChooserView', 'filterPanelView', 'pagerView', 'draggingHeaderView', 'contextMenuView', 'errorView', 'headerFilterView', 'filterBuilderView'];

const isPercentWidth = function (width) {
  return isString(width) && width.endsWith('%');
};

const isPixelWidth = function (width) {
  return isString(width) && width.endsWith('px');
};

const calculateFreeWidth = function (that, widths) {
  const contentWidth = that._rowsView.contentWidth();
  const totalWidth = that._getTotalWidth(widths, contentWidth);

  return contentWidth - totalWidth;
};

const calculateFreeWidthWithCurrentMinWidth = function (that, columnIndex, currentMinWidth, widths) {
  return calculateFreeWidth(that, widths.map((width, index) => (index === columnIndex ? currentMinWidth : width)));
};

const restoreFocus = function (focusedElement, selectionRange) {
  accessibility.hiddenFocus(focusedElement);
  gridCoreUtils.setSelectionRange(focusedElement, selectionRange);
};

const resizingControllerMembers = {
  _initPostRenderHandlers() {
    const dataController = this._dataController;

    if (!this._refreshSizesHandler) {
      this._refreshSizesHandler = (e) => {
        dataController.changed.remove(this._refreshSizesHandler);

        this._refreshSizes(e);
      };
      // TODO remove resubscribing
      dataController.changed.add(() => {
        dataController.changed.add(this._refreshSizesHandler);
      });
    }
  },

  _refreshSizes(e) {
    let resizeDeferred;
    const that = this;
    const changeType = e && e.changeType;
    const isDelayed = e && e.isDelayed;
    const items = that._dataController.items();

    if (!e || changeType === 'refresh' || changeType === 'prepend' || changeType === 'append') {
      if (!isDelayed) {
        resizeDeferred = that.resize();
      }
    } else if (changeType === 'update') {
      if (e.changeTypes?.length === 0) {
        return;
      }
      if ((items.length > 1 || e.changeTypes[0] !== 'insert')
                && !(items.length === 0 && e.changeTypes[0] === 'remove') && !e.needUpdateDimensions) {
        // @ts-expect-error
        resizeDeferred = new Deferred();

        this._waitAsyncTemplates().done(() => {
          deferUpdate(() => deferRender(() => deferUpdate(() => {
            that._setScrollerSpacing();
            that._rowsView.resize();
            resizeDeferred.resolve();
          })));
        }).fail(resizeDeferred.reject);
      } else {
        resizeDeferred = that.resize();
      }
    }

    if (changeType && changeType !== 'updateSelection' && changeType !== 'updateFocusedRow' && changeType !== 'pageIndex' && !isDelayed) {
      when(resizeDeferred).done(() => {
        that._setAriaRowColCount();
        that.fireContentReadyAction();
      });
    }
  },

  fireContentReadyAction() {
    this.component._fireContentReadyAction();
  },

  _setAriaRowColCount() {
    const { component } = this;
    component.setAria({
      rowCount: this._dataController.totalItemsCount(),
      colCount: component.columnCount(),
    }, component.$element().children(`.${GRIDBASE_CONTAINER_CLASS}`));
  },

  _getBestFitWidths() {
    const rowsView = this._rowsView;
    const columnHeadersView = this._columnHeadersView;
    let widths = rowsView.getColumnWidths();

    if (!widths?.length) {
      const headersTableElement = columnHeadersView.getTableElement();
      columnHeadersView.setTableElement(rowsView.getTableElement()?.children('.dx-header'));
      widths = columnHeadersView.getColumnWidths();
      columnHeadersView.setTableElement(headersTableElement);
    }

    return widths;
  },

  _setVisibleWidths(visibleColumns, widths) {
    const columnsController = this._columnsController;
    columnsController.beginUpdate();
    each(visibleColumns, (index, column) => {
      const columnId = columnsController.getColumnId(column);
      columnsController.columnOption(columnId, 'visibleWidth', widths[index]);
    });
    columnsController.endUpdate();
  },

  _toggleBestFitModeForView(view, className, isBestFit) {
    if (!view || !view.isVisible()) return;

    const $rowsTables = this._rowsView.getTableElements();
    const $viewTables = view.getTableElements();

    each($rowsTables, (index, tableElement) => {
      let $tableBody;
      const $rowsTable = $(tableElement);
      const $viewTable = $viewTables.eq(index);

      if ($viewTable && $viewTable.length) {
        if (isBestFit) {
          $tableBody = $viewTable.children('tbody').appendTo($rowsTable);
        } else {
          $tableBody = $rowsTable.children(`.${className}`).appendTo($viewTable);
        }
        $tableBody.toggleClass(className, isBestFit);
        $tableBody.toggleClass(this.addWidgetPrefix('best-fit'), isBestFit);
      }
    });
  },

  _toggleBestFitMode(isBestFit) {
    const $rowsTable = this._rowsView.getTableElement();
    const $rowsFixedTable = this._rowsView.getTableElements().eq(1);

    if (!$rowsTable) return;

    $rowsTable.css('tableLayout', isBestFit ? 'auto' : 'fixed');
    $rowsTable.children('colgroup').css('display', isBestFit ? 'none' : '');

    // NOTE T1156153: Hide group row column to get correct fixed column widths.
    each($rowsFixedTable.find(GROUP_ROW_SELECTOR), (idx, item) => {
      $(item).css('display', isBestFit ? 'none' : '');
    });

    $rowsFixedTable.toggleClass(this.addWidgetPrefix(TABLE_FIXED_CLASS), !isBestFit);

    this._toggleBestFitModeForView(this._columnHeadersView, 'dx-header', isBestFit);
    this._toggleBestFitModeForView(this._footerView, 'dx-footer', isBestFit);

    if (this._needStretch()) {
      $rowsTable.get(0).style.width = isBestFit ? 'auto' : '';
    }
  },

  _toggleContentMinHeight(value) {
    const scrollable = this._rowsView.getScrollable();
    const $contentElement = this._rowsView._findContentElement();

    if (scrollable?.option('useNative') === false) {
      $contentElement.css({ minHeight: value ? gridCoreUtils.getContentHeightLimit(browser) : '' });
    }
  },

  _synchronizeColumns() {
    const columnsController = this._columnsController;
    const visibleColumns = columnsController.getVisibleColumns();
    const columnAutoWidth = this.option('columnAutoWidth');
    const wordWrapEnabled = this.option('wordWrapEnabled');
    let needBestFit = this._needBestFit();
    let hasMinWidth = false;
    let resetBestFitMode;
    let isColumnWidthsCorrected = false;
    let resultWidths: any[] = [];
    let focusedElement;
    let selectionRange;

    const normalizeWidthsByExpandColumns = function () {
      let expandColumnWidth;

      each(visibleColumns, (index, column) => {
        if (column.type === 'groupExpand') {
          expandColumnWidth = resultWidths[index];
        }
      });

      each(visibleColumns, (index, column) => {
        if (column.type === 'groupExpand' && expandColumnWidth) {
          resultWidths[index] = expandColumnWidth;
        }
      });
    };

    !needBestFit && each(visibleColumns, (index, column) => {
      if (column.width === 'auto') {
        needBestFit = true;
        return false;
      }
      return undefined;
    });

    each(visibleColumns, (index, column) => {
      if (column.minWidth) {
        hasMinWidth = true;
        return false;
      }
      return undefined;
    });

    this._setVisibleWidths(visibleColumns, []);

    const $element = this.component.$element();

    if (needBestFit) {
      focusedElement = domAdapter.getActiveElement($element.get(0));
      selectionRange = gridCoreUtils.getSelectionRange(focusedElement);
      this._toggleBestFitMode(true);
      resetBestFitMode = true;
    }

    this._toggleContentMinHeight(wordWrapEnabled); // T1047239

    if ($element && $element.get(0) && this._maxWidth) {
      delete this._maxWidth;
      $element[0].style.maxWidth = '';
    }

    deferUpdate(() => {
      if (needBestFit) {
        resultWidths = this._getBestFitWidths();

        each(visibleColumns, (index, column) => {
          const columnId = columnsController.getColumnId(column);
          columnsController.columnOption(columnId, 'bestFitWidth', resultWidths[index], true);
        });
      } else if (hasMinWidth) {
        resultWidths = this._getBestFitWidths();
      }

      each(visibleColumns, function (index) {
        const { width } = this;
        if (width !== 'auto') {
          if (isDefined(width)) {
            resultWidths[index] = isNumeric(width) || isPixelWidth(width) ? parseFloat(width) : width;
          } else if (!columnAutoWidth) {
            resultWidths[index] = undefined;
          }
        }
      });

      if (resetBestFitMode) {
        this._toggleBestFitMode(false);
        resetBestFitMode = false;
        if (focusedElement && focusedElement !== domAdapter.getActiveElement()) {
          const isFocusOutsideWindow = getBoundingRect(focusedElement).bottom < 0;
          if (!isFocusOutsideWindow) {
            restoreFocus(focusedElement, selectionRange);
          }
        }
      }

      isColumnWidthsCorrected = this._correctColumnWidths(resultWidths, visibleColumns);

      if (columnAutoWidth) {
        normalizeWidthsByExpandColumns();
        if (this._needStretch()) {
          this._processStretch(resultWidths, visibleColumns);
        }
      }

      deferRender(() => {
        if (needBestFit || isColumnWidthsCorrected) {
          this._setVisibleWidths(visibleColumns, resultWidths);
        }

        if (wordWrapEnabled) {
          this._toggleContentMinHeight(false);
        }
      });
    });
  },

  _needBestFit() {
    return this.option('columnAutoWidth');
  },

  _needStretch() {
    return this._columnsController.getVisibleColumns().some((c) => c.width === 'auto' && !c.command);
  },

  _getAverageColumnsWidth(resultWidths) {
    const freeWidth = calculateFreeWidth(this, resultWidths);
    const columnCountWithoutWidth = resultWidths.filter((width) => width === undefined).length;

    return freeWidth / columnCountWithoutWidth;
  },

  _correctColumnWidths(resultWidths, visibleColumns) {
    const that = this;
    let i;
    let hasPercentWidth = false;
    let hasAutoWidth = false;
    let isColumnWidthsCorrected = false;
    const $element = that.component.$element();
    const hasWidth = that._hasWidth;

    for (i = 0; i < visibleColumns.length; i++) {
      const index = i;
      const column = visibleColumns[index];
      const isHiddenColumn = resultWidths[index] === HIDDEN_COLUMNS_WIDTH;
      let width = resultWidths[index];
      const { minWidth } = column;

      if (minWidth) {
        if (width === undefined) {
          const averageColumnsWidth = that._getAverageColumnsWidth(resultWidths);
          width = averageColumnsWidth;
        } else if (isPercentWidth(width)) {
          const freeWidth = calculateFreeWidthWithCurrentMinWidth(that, index, minWidth, resultWidths);

          if (freeWidth < 0) {
            width = -1;
          }
        }
      }

      const realColumnWidth = that._getRealColumnWidth(index, resultWidths.map((columnWidth, columnIndex) => (index === columnIndex ? width : columnWidth)));

      if (minWidth && !isHiddenColumn && realColumnWidth < minWidth) {
        resultWidths[index] = minWidth;
        isColumnWidthsCorrected = true;
        i = -1;
      }
      if (!isDefined(column.width)) {
        hasAutoWidth = true;
      }
      if (isPercentWidth(column.width)) {
        hasPercentWidth = true;
      }
    }

    if (!hasAutoWidth && resultWidths.length) {
      const $rowsViewElement = that._rowsView.element();
      const contentWidth = that._rowsView.contentWidth();
      const scrollbarWidth = that._rowsView.getScrollbarWidth();
      const totalWidth = that._getTotalWidth(resultWidths, contentWidth);

      if (totalWidth < contentWidth) {
        const lastColumnIndex = gridCoreUtils.getLastResizableColumnIndex(visibleColumns, resultWidths);

        if (lastColumnIndex >= 0) {
          resultWidths[lastColumnIndex] = 'auto';
          isColumnWidthsCorrected = true;
          if (hasWidth === false && !hasPercentWidth) {
            const borderWidth = that.option('showBorders')
              ? Math.ceil(getOuterWidth($rowsViewElement) - getInnerWidth($rowsViewElement))
              : 0;

            that._maxWidth = totalWidth + scrollbarWidth + borderWidth;
            $element.css('maxWidth', that._maxWidth);
          }
        }
      }
    }
    return isColumnWidthsCorrected;
  },

  _processStretch(resultSizes, visibleColumns) {
    const groupSize = this._rowsView.contentWidth();
    const tableSize = this._getTotalWidth(resultSizes, groupSize);
    const unusedIndexes = { length: 0 };

    if (!resultSizes.length) return;

    each(visibleColumns, function (index) {
      if (this.width || resultSizes[index] === HIDDEN_COLUMNS_WIDTH) {
        unusedIndexes[index] = true;
        unusedIndexes.length++;
      }
    });

    const diff = groupSize - tableSize;
    const diffElement = Math.floor(diff / (resultSizes.length - unusedIndexes.length));
    let onePixelElementsCount = diff - diffElement * (resultSizes.length - unusedIndexes.length);
    if (diff >= 0) {
      for (let i = 0; i < resultSizes.length; i++) {
        if (unusedIndexes[i]) {
          continue;
        }
        resultSizes[i] += diffElement;
        if (onePixelElementsCount > 0) {
          if (onePixelElementsCount < 1) {
            resultSizes[i] += onePixelElementsCount;
            onePixelElementsCount = 0;
          } else {
            resultSizes[i]++;
            onePixelElementsCount--;
          }
        }
      }
    }
  },

  _getRealColumnWidth(columnIndex, columnWidths, groupWidth) {
    let ratio = 1;
    const width = columnWidths[columnIndex];

    if (!isPercentWidth(width)) {
      return parseFloat(width);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const percentTotalWidth = columnWidths.reduce((sum, width, index) => {
      if (!isPercentWidth(width)) {
        return sum;
      }

      return sum + parseFloat(width);
    }, 0);
    const pixelTotalWidth = columnWidths.reduce((sum, width) => {
      if (!width || width === HIDDEN_COLUMNS_WIDTH || isPercentWidth(width)) {
        return sum;
      }

      return sum + parseFloat(width);
    }, 0);

    groupWidth = groupWidth || this._rowsView.contentWidth();

    const freeSpace = groupWidth - pixelTotalWidth;
    const percentTotalWidthInPixel = percentTotalWidth * groupWidth / 100;

    if (pixelTotalWidth > 0 && (percentTotalWidthInPixel + pixelTotalWidth) >= groupWidth) {
      ratio = percentTotalWidthInPixel > freeSpace ? freeSpace / percentTotalWidthInPixel : 1;
    }

    return parseFloat(width) * groupWidth * ratio / 100;
  },

  _getTotalWidth(widths, groupWidth) {
    let result = 0;

    for (let i = 0; i < widths.length; i++) {
      const width = widths[i];
      if (width && width !== HIDDEN_COLUMNS_WIDTH) {
        result += this._getRealColumnWidth(i, widths, groupWidth);
      }
    }

    return Math.ceil(result);
  },

  _getGroupElement() {
    return this.component.$element().children().get(0);
  },

  updateSize(rootElement) {
    const that = this;
    const $rootElement = $(rootElement);
    const importantMarginClass = that.addWidgetPrefix(IMPORTANT_MARGIN_CLASS);

    if (that._hasHeight === undefined && $rootElement && $rootElement.is(':visible') && getWidth($rootElement)) {
      const $groupElement = $rootElement.children(`.${that.getWidgetContainerClass()}`);

      if ($groupElement.length) {
        $groupElement.detach();
      }

      that._hasHeight = !!getHeight($rootElement);

      const width = getWidth($rootElement);
      $rootElement.addClass(importantMarginClass);
      that._hasWidth = getWidth($rootElement) === width;
      $rootElement.removeClass(importantMarginClass);

      if ($groupElement.length) {
        $groupElement.appendTo($rootElement);
      }
    }
  },

  publicMethods() {
    return ['resize', 'updateDimensions'];
  },

  _waitAsyncTemplates() {
    return when(
      this._columnHeadersView?.waitAsyncTemplates(),
      this._rowsView?.waitAsyncTemplates(),
      this._footerView?.waitAsyncTemplates(),
    );
  },

  resize() {
    if (this.component._requireResize) {
      return;
    }

    // @ts-expect-error
    const d = new Deferred();

    this._waitAsyncTemplates().done(() => {
      when(this.updateDimensions())
        .done(d.resolve)
        .fail(d.reject);
    }).fail(d.reject);

    return d.promise();
  },

  updateDimensions(checkSize) {
    const that = this;

    that._initPostRenderHandlers();

    // T335767
    if (!that._checkSize(checkSize)) {
      return;
    }

    const prevResult = that._resizeDeferred;
    // @ts-expect-error
    const result = that._resizeDeferred = new Deferred();

    when(prevResult).always(() => {
      deferRender(() => {
        if (that._dataController.isLoaded()) {
          that._synchronizeColumns();
        }
        // IE11
        that._resetGroupElementHeight();

        deferUpdate(() => {
          deferRender(() => {
            deferUpdate(() => {
              that._updateDimensionsCore();
            });
          });
        });
      }).done(result.resolve).fail(result.reject);
    });

    return result.promise();
  },
  _resetGroupElementHeight() {
    const groupElement = this._getGroupElement();
    const scrollable = this._rowsView.getScrollable();

    if (groupElement && groupElement.style.height && (!scrollable || !scrollable.scrollTop())) {
      groupElement.style.height = '';
    }
  },
  _checkSize(checkSize) {
    const $rootElement = this.component.$element();

    if (checkSize && (
      this._lastWidth === getWidth($rootElement)
            && this._lastHeight === getHeight($rootElement)
            && this._devicePixelRatio === getWindow().devicePixelRatio
            || !$rootElement.is(':visible')
    )) {
      return false;
    }
    return true;
  },
  _setScrollerSpacingCore() {
    const that = this;
    const vScrollbarWidth = that._rowsView.getScrollbarWidth();
    const hScrollbarWidth = that._rowsView.getScrollbarWidth(true);

    deferRender(() => {
      that._columnHeadersView && that._columnHeadersView.setScrollerSpacing(vScrollbarWidth);
      that._footerView && that._footerView.setScrollerSpacing(vScrollbarWidth);
      that._rowsView.setScrollerSpacing(vScrollbarWidth, hScrollbarWidth);
    });
  },
  _setScrollerSpacing() {
    const scrollable = this._rowsView.getScrollable();
    // T722415, T758955
    const isNativeScrolling = this.option('scrolling.useNative') === true;

    if (!scrollable || isNativeScrolling) {
      deferRender(() => {
        deferUpdate(() => {
          this._setScrollerSpacingCore();
        });
      });
    } else { this._setScrollerSpacingCore(); }
  },
  _updateDimensionsCore() {
    const that = this;

    const dataController = that._dataController;
    const editorFactory = that.getController('editorFactory');
    const rowsView = that._rowsView;

    const $rootElement = that.component.$element();
    const groupElement = this._getGroupElement();

    const rootElementHeight = getHeight($rootElement);
    const height = that.option('height') || $rootElement.get(0).style.height;
    const isHeightSpecified = !!height && height !== 'auto';

    // eslint-disable-next-line radix
    const maxHeight = parseInt($rootElement.css('maxHeight'));
    const maxHeightHappened = maxHeight && rootElementHeight >= maxHeight;
    const isMaxHeightApplied = groupElement && groupElement.scrollHeight === groupElement.offsetHeight;

    that.updateSize($rootElement);

    deferRender(() => {
      const hasHeight = that._hasHeight || !!maxHeight || isHeightSpecified;
      rowsView.hasHeight(hasHeight);

      // IE11
      if (maxHeightHappened && !isMaxHeightApplied) {
        $(groupElement).css('height', maxHeight);
      }

      if (!dataController.isLoaded()) {
        rowsView.setLoading(dataController.isLoading());
        return;
      }
      deferUpdate(() => {
        that._updateLastSizes($rootElement);
        that._setScrollerSpacing();

        each(VIEW_NAMES, (index, viewName) => {
          const view = that.getView(viewName);
          if (view) {
            view.resize();
          }
        });

        editorFactory && editorFactory.resize();
      });
    });
  },

  _updateLastSizes($rootElement) {
    this._lastWidth = getWidth($rootElement);
    this._lastHeight = getHeight($rootElement);
    this._devicePixelRatio = getWindow().devicePixelRatio;
  },

  optionChanged(args) {
    switch (args.name) {
      case 'width':
      case 'height':
        this.component._renderDimensions();
        this.resize();
        /* falls through */
      case 'renderAsync':
        args.handled = true;
        return;
      default:
        this.callBase(args);
    }
  },

  init() {
    const that = this;

    that._dataController = that.getController('data');
    that._columnsController = that.getController('columns');
    that._columnHeadersView = that.getView('columnHeadersView');
    that._footerView = that.getView('footerView');
    that._rowsView = that.getView('rowsView');
  },
};

const ResizingController = modules.ViewController.inherit(resizingControllerMembers);

const SynchronizeScrollingController = modules.ViewController.inherit({
  _scrollChangedHandler(views, pos, viewName) {
    for (let j = 0; j < views.length; j++) {
      if (views[j] && views[j].name !== viewName) {
        views[j].scrollTo({ left: pos.left, top: pos.top });
      }
    }
  },

  init() {
    const views = [this.getView('columnHeadersView'), this.getView('footerView'), this.getView('rowsView')];

    for (let i = 0; i < views.length; i++) {
      const view = views[i];
      if (view) {
        view.scrollChanged.add(this._scrollChangedHandler.bind(this, views));
      }
    }
  },
});

const GridView = modules.View.inherit({
  _endUpdateCore() {
    if (this.component._requireResize) {
      this.component._requireResize = false;
      this._resizingController.resize();
    }
  },

  _getWidgetAriaLabel() {
    return 'dxDataGrid-ariaDataGrid';
  },

  init() {
    const that = this;
    that._resizingController = that.getController('resizing');
    that._dataController = that.getController('data');
  },

  getView(name) {
    return this.component._views[name];
  },

  element() {
    return this._groupElement;
  },

  optionChanged(args) {
    const that = this;

    if (isDefined(that._groupElement) && args.name === 'showBorders') {
      that._groupElement.toggleClass(that.addWidgetPrefix(BORDERS_CLASS), !!args.value);
      args.handled = true;
    } else {
      that.callBase(args);
    }
  },

  _renderViews($groupElement) {
    const that = this;

    each(VIEW_NAMES, (index, viewName) => {
      const view = that.getView(viewName);
      if (view) {
        view.render($groupElement);
      }
    });
  },

  _getTableRoleName() {
    return 'grid';
  },

  render($rootElement) {
    const that = this;
    const isFirstRender = !that._groupElement;
    const $groupElement = that._groupElement || $('<div>').addClass(that.getWidgetContainerClass());

    $groupElement.addClass(GRIDBASE_CONTAINER_CLASS);
    $groupElement.toggleClass(that.addWidgetPrefix(BORDERS_CLASS), !!that.option('showBorders'));

    that.setAria('role', 'presentation', $rootElement);

    that.component.setAria({
      role: this._getTableRoleName(),
      label: messageLocalization.format(that._getWidgetAriaLabel()),
    }, $groupElement);

    that._rootElement = $rootElement || that._rootElement;

    if (isFirstRender) {
      that._groupElement = $groupElement;
      hasWindow() && that.getController('resizing').updateSize($rootElement);
      $groupElement.appendTo($rootElement);
    }

    that._renderViews($groupElement);
  },

  update() {
    const that = this;
    const $rootElement = that._rootElement;
    const $groupElement = that._groupElement;
    const resizingController = that.getController('resizing');

    if ($rootElement && $groupElement) {
      resizingController.resize();
      if (that._dataController.isLoaded()) {
        that._resizingController.fireContentReadyAction();
      }
    }
  },
});

export const gridViewModule = {
  defaultOptions() {
    return {
      showBorders: false,
      renderAsync: false,
    };
  },
  controllers: {
    resizing: ResizingController,
    synchronizeScrolling: SynchronizeScrollingController,
  },
  views: {
    gridView: GridView,
  },

  VIEW_NAMES,
};
