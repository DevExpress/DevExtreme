/* eslint-disable max-classes-per-file */
import messageLocalization from '@js/common/core/localization/message';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import { deferRender, deferUpdate } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { getBoundingRect } from '@js/core/utils/position';
import { getHeight, getWidth } from '@js/core/utils/size';
import { isDefined, isNumeric, isString } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import * as accessibility from '@js/ui/shared/accessibility';
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/m_editor_factory';
import { A11yStatusContainerComponent } from '@ts/grids/grid_core/views/a11y_status_container_component';

import type { FooterView } from '../../data_grid/summary/m_summary';
import type { AdaptiveColumnsController } from '../adaptivity/m_adaptivity';
import type { ColumnHeadersView } from '../column_headers/m_column_headers';
import type { ColumnsController } from '../columns_controller/m_columns_controller';
import type { DataController } from '../data_controller/m_data_controller';
import modules from '../m_modules';
import gridCoreUtils from '../m_utils';
import type { RowsView } from './m_rows_view';

const BORDERS_CLASS = 'borders';
const TABLE_FIXED_CLASS = 'table-fixed';
const IMPORTANT_MARGIN_CLASS = 'important-margin';
const GRIDBASE_CONTAINER_CLASS = 'dx-gridbase-container';
const GROUP_ROW_SELECTOR = 'tr.dx-group-row';

const HIDDEN_COLUMNS_WIDTH = 'adaptiveHidden';

const VIEW_NAMES = ['columnsSeparatorView', 'blockSeparatorView', 'trackerView', 'headerPanel', 'columnHeadersView', 'rowsView', 'footerView', 'columnChooserView', 'filterPanelView', 'pagerView', 'draggingHeaderView', 'contextMenuView', 'errorView', 'headerFilterView', 'filterBuilderView'];

const E2E_ATTRIBUTES = {
  a11yStatusContainer: 'e2e-a11y-general-status-container',
};

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
  accessibility.hiddenFocus(focusedElement, true);
  gridCoreUtils.setSelectionRange(focusedElement, selectionRange);
};

export class ResizingController extends modules.ViewController {
  private _refreshSizesHandler: any;

  public _dataController!: DataController;

  protected _rowsView!: RowsView;

  private _columnHeadersView!: ColumnHeadersView;

  public _columnsController!: ColumnsController;

  private _footerView!: FooterView;

  private _gridView!: GridView;

  private _prevContentMinHeight: any;

  private _maxWidth: any;

  private _hasWidth: any;

  private _hasHeight: any;

  private _resizeDeferred: any;

  public _lastWidth: any;

  private _devicePixelRatio: any;

  private _lastHeight: any;

  protected _adaptiveColumnsController!: AdaptiveColumnsController;

  private _editorFactoryController!: EditorFactory;

  protected _updateScrollableTimeoutID: any;

  public init() {
    this._prevContentMinHeight = null;
    this._dataController = this.getController('data');
    this._columnsController = this.getController('columns');
    this._columnHeadersView = this.getView('columnHeadersView');
    this._adaptiveColumnsController = this.getController('adaptiveColumns');
    this._editorFactoryController = this.getController('editorFactory');
    this._footerView = this.getView('footerView');
    this._rowsView = this.getView('rowsView');
    this._gridView = this.getView('gridView');
  }

  private _initPostRenderHandlers() {
    if (!this._refreshSizesHandler) {
      this._refreshSizesHandler = (e) => {
        // @ts-expect-error
        let resizeDeferred = new Deferred<null>().resolve(null);
        const changeType = e?.changeType;
        const isDelayed = e?.isDelayed;
        const needFireContentReady = changeType
          && changeType !== 'updateSelection'
          && changeType !== 'updateFocusedRow'
          && changeType !== 'pageIndex'
          && !isDelayed;

        this._dataController.changed.remove(this._refreshSizesHandler);

        if (this._checkSize()) {
          resizeDeferred = this._refreshSizes(e);
        }

        if (needFireContentReady) {
          when(resizeDeferred).done(() => {
            this._setAriaLabel();
            this.fireContentReadyAction();
          });
        }
      };
      // TODO remove resubscribing
      this._dataController.changed.add(() => {
        this._dataController.changed.add(this._refreshSizesHandler);
      });
    }
  }

  private _refreshSizes(e) {
    // @ts-expect-error
    let resizeDeferred = new Deferred<null>().resolve(null);
    const changeType = e?.changeType;
    const isDelayed = e?.isDelayed;
    const items = this._dataController.items();

    if (!e || changeType === 'refresh' || changeType === 'prepend' || changeType === 'append') {
      if (!isDelayed) {
        resizeDeferred = this.resize();
      }
    } else if (changeType === 'update') {
      if (e.changeTypes?.length === 0) {
        return resizeDeferred;
      }
      if ((items.length > 1 || e.changeTypes[0] !== 'insert')
                && !(items.length === 0 && e.changeTypes[0] === 'remove') && !e.needUpdateDimensions) {
        // @ts-expect-error
        resizeDeferred = new Deferred();

        this._waitAsyncTemplates().done(() => {
          deferUpdate(() => deferRender(() => deferUpdate(() => {
            this._setScrollerSpacing();
            this._rowsView.resize();
            resizeDeferred.resolve();
          })));
        }).fail(resizeDeferred.reject);
      } else {
        resizeDeferred = this.resize();
      }
    }

    return resizeDeferred;
  }

  /**
   * @extended: master_detail
   */
  public fireContentReadyAction() {
    this.component._fireContentReadyAction();
  }

  protected _getWidgetAriaLabel() {
    return 'dxDataGrid-ariaDataGrid';
  }

  private _setAriaLabel(): void {
    const columnCount = this._columnsController?._columns?.filter(({ visible }) => !!visible).length ?? 0;
    const totalItemsCount = Math.max(0, this._dataController.totalItemsCount());
    const widgetAriaLabel = this._getWidgetAriaLabel();
    const widgetStatusText = messageLocalization
    // @ts-expect-error Badly typed format method
      .format(widgetAriaLabel, totalItemsCount, columnCount);
    // @ts-expect-error Badly typed dxElementWrapper
    const $ariaLabelElement = this.component.$element().children(`.${GRIDBASE_CONTAINER_CLASS}`);
    // @ts-expect-error Treelist Variable
    const expandableWidgetAriaLabel = messageLocalization.format(this._expandableWidgetAriaId);
    const labelParts = [widgetStatusText];
    if (expandableWidgetAriaLabel) {
      labelParts.push(expandableWidgetAriaLabel);
    }
    this.component.setAria('label', labelParts.join('. '), $ariaLabelElement);
    this._gridView.setWidgetA11yStatusText(widgetStatusText);
  }

  private _getBestFitWidths() {
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
  }

  private _setVisibleWidths(visibleColumns, widths) {
    const columnsController = this._columnsController;
    columnsController.beginUpdate();
    each(visibleColumns, (index, column) => {
      const columnId = columnsController.getColumnId(column);
      columnsController.columnOption(columnId, 'visibleWidth', widths[index]);
    });
    columnsController.endUpdate();
  }

  private _toggleBestFitModeForView(view, className, isBestFit) {
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
  }

  /**
   * @extended: adaptivity, master_detail
   */
  protected _toggleBestFitMode(isBestFit) {
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
      // @ts-expect-error
      $rowsTable.get(0).style.width = isBestFit ? 'auto' : '';
    }
  }

  private _toggleContentMinHeight(value) {
    const scrollable = this._rowsView.getScrollable();
    const $contentElement = this._rowsView._findContentElement();

    if (scrollable?.option('useNative') === false) {
      if (value === true) {
        this._prevContentMinHeight = $contentElement.get(0).style.minHeight;
      }

      if (isDefined(this._prevContentMinHeight)) {
        $contentElement.css({ minHeight: value ? gridCoreUtils.getContentHeightLimit(browser) : this._prevContentMinHeight });
      }
    }
  }

  private _synchronizeColumns() {
    const columnsController = this._columnsController;
    const visibleColumns = columnsController.getVisibleColumns();
    const columnAutoWidth = this.option('columnAutoWidth');
    const wordWrapEnabled = this.option('wordWrapEnabled');
    const hasUndefinedColumnWidth = visibleColumns.some((column) => !isDefined(column.width));
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
      // @ts-expect-error
      focusedElement = domAdapter.getActiveElement($element.get(0));
      selectionRange = gridCoreUtils.getSelectionRange(focusedElement);
      this._toggleBestFitMode(true);
      resetBestFitMode = true;
    }

    this._toggleContentMinHeight(wordWrapEnabled); // T1047239

    // @ts-expect-error
    if ($element && $element.get(0) && this._maxWidth) {
      delete this._maxWidth;
      $element[0].style.maxWidth = '';
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
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

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      deferRender(() => {
        if (needBestFit || isColumnWidthsCorrected || hasUndefinedColumnWidth) {
          this._setVisibleWidths(visibleColumns, resultWidths);
        }

        if (wordWrapEnabled) {
          this._toggleContentMinHeight(false);
        }
      });
    });
  }

  /**
   * @extended: adaptivity
   */
  protected _needBestFit() {
    return this.option('columnAutoWidth');
  }

  /**
   * @extended: adaptivity
   */
  protected _needStretch() {
    return this._columnsController.getVisibleColumns().some((c) => c.width === 'auto' && !c.command);
  }

  private _getAverageColumnsWidth(resultWidths) {
    const freeWidth = calculateFreeWidth(this, resultWidths);
    const columnCountWithoutWidth = resultWidths.filter((width) => width === undefined).length;

    return freeWidth / columnCountWithoutWidth;
  }

  /**
   * @extended: adaptivity
   */
  protected _correctColumnWidths(resultWidths, visibleColumns) {
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
            const borderWidth = gridCoreUtils.getComponentBorderWidth(this, $rowsViewElement);

            that._maxWidth = totalWidth + scrollbarWidth + borderWidth;
            // @ts-expect-error
            $element.css('maxWidth', that._maxWidth);
          }
        }
      }
    }
    return isColumnWidthsCorrected;
  }

  private _processStretch(resultSizes, visibleColumns) {
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
  }

  private _getRealColumnWidth(columnIndex, columnWidths, groupWidth?) {
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
  }

  private _getTotalWidth(widths, groupWidth) {
    let result = 0;

    for (let i = 0; i < widths.length; i++) {
      const width = widths[i];
      if (width && width !== HIDDEN_COLUMNS_WIDTH) {
        result += this._getRealColumnWidth(i, widths, groupWidth);
      }
    }

    return Math.ceil(result);
  }

  private _getGroupElement() {
    // @ts-expect-error
    return this.component.$element().children().get(0);
  }

  public updateSize(rootElement) {
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
  }

  public publicMethods() {
    return ['resize', 'updateDimensions'];
  }

  private _waitAsyncTemplates() {
    return when(
      this._columnHeadersView?.waitAsyncTemplates(true),
      this._rowsView?.waitAsyncTemplates(true),
      this._footerView?.waitAsyncTemplates(true),
    );
  }

  /**
   * @extended: virtual_scrolling
   */
  public resize(): DeferredObj<unknown> {
    if (this.component._requireResize) {
      // @ts-expect-error
      return new Deferred().resolve();
    }

    // @ts-expect-error
    const d = new Deferred();

    this._waitAsyncTemplates().done(() => {
      when(this.updateDimensions())
        .done(d.resolve)
        .fail(d.reject);
    }).fail(d.reject);

    return d.promise();
  }

  public updateDimensions(checkSize?) {
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
        // @ts-expect-error
      }).done(result.resolve).fail(result.reject);
    });

    return result.promise();
  }

  private _resetGroupElementHeight() {
    const groupElement = this._getGroupElement();
    const scrollable = this._rowsView.getScrollable();

    if (groupElement && groupElement.style.height && (!scrollable || !scrollable.scrollTop())) {
      groupElement.style.height = '';
    }
  }

  private _checkSize(checkSize?) {
    const $rootElement = this.component.$element();
    // @ts-expect-error
    const isWidgetVisible = $rootElement.is(':visible');
    const isGridSizeChanged = this._lastWidth !== getWidth($rootElement)
          || this._lastHeight !== getHeight($rootElement)
          || this._devicePixelRatio !== getWindow().devicePixelRatio;

    return isWidgetVisible && (!checkSize || isGridSizeChanged);
  }

  private _setScrollerSpacingCore() {
    const that = this;
    const vScrollbarWidth = that._rowsView.getScrollbarWidth();
    const hScrollbarWidth = that._rowsView.getScrollbarWidth(true);

    deferRender(() => {
      that._columnHeadersView && that._columnHeadersView.setScrollerSpacing(vScrollbarWidth);
      that._footerView && that._footerView.setScrollerSpacing(vScrollbarWidth);
      that._rowsView.setScrollerSpacing(vScrollbarWidth, hScrollbarWidth);
    });
  }

  private _setScrollerSpacing() {
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
  }

  /**
   * @extended: column_fixing
   */
  protected _setAriaOwns() {
    const headerTable = this._columnHeadersView?.getTableElement();
    const footerTable = this._footerView?.getTableElement();

    // @ts-expect-error
    this._rowsView?.setAriaOwns(headerTable?.attr('id'), footerTable?.attr('id'));
  }

  /**
   * @extended: header_panel
   */
  protected _updateDimensionsCore() {
    const that = this;

    const dataController = that._dataController;
    const rowsView = that._rowsView;

    const $rootElement = that.component.$element();
    const groupElement = this._getGroupElement();

    const rootElementHeight = getHeight($rootElement);
    // @ts-expect-error
    const height = that.option('height') ?? $rootElement.get(0).style.height;
    const isHeightSpecified = !!height && height !== 'auto';

    // @ts-expect-error
    // eslint-disable-next-line radix
    const maxHeight = parseInt($rootElement.css('maxHeight'));
    const maxHeightHappened = maxHeight && rootElementHeight >= maxHeight;
    const isMaxHeightApplied = groupElement && groupElement.scrollHeight === groupElement.offsetHeight;

    that.updateSize($rootElement);

    deferRender(() => {
      const hasHeight = that._hasHeight || !!maxHeight || isHeightSpecified;
      rowsView.hasHeight(hasHeight);

      this._setAriaOwns();

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
          // TODO getView
          const view = that.getView(viewName);
          if (view) {
            view.resize();
          }
        });

        this._editorFactoryController && this._editorFactoryController.resize();
      });
    });
  }

  private _updateLastSizes($rootElement) {
    this._lastWidth = getWidth($rootElement);
    this._lastHeight = getHeight($rootElement);
    this._devicePixelRatio = getWindow().devicePixelRatio;
  }

  public optionChanged(args) {
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
        super.optionChanged(args);
    }
  }
}

export class SynchronizeScrollingController extends modules.ViewController {
  private _scrollChangedHandler(views, pos, viewName) {
    for (let j = 0; j < views.length; j++) {
      if (views[j] && views[j].name !== viewName) {
        views[j].scrollTo({ left: pos.left, top: pos.top });
      }
    }
  }

  public init() {
    const views = [this.getView('columnHeadersView'), this.getView('footerView'), this.getView('rowsView')];

    for (let i = 0; i < views.length; i++) {
      const view = views[i];
      if (view) {
        view.scrollChanged.add(this._scrollChangedHandler.bind(this, views));
      }
    }
  }
}

export class GridView extends modules.View {
  private _resizingController!: ResizingController;

  private _dataController!: DataController;

  private _groupElement: any;

  private _rootElement: any;

  private _a11yGeneralStatusElement!: dxElementWrapper;

  public init(): void {
    this._resizingController = this.getController('resizing');
    this._dataController = this.getController('data');
  }

  protected _endUpdateCore() {
    if (this.component._requireResize) {
      this.component._requireResize = false;
      this._resizingController.resize();
    }
  }

  public getView(name) {
    return this.component._views[name];
  }

  public element() {
    return this._groupElement;
  }

  public optionChanged(args) {
    const that = this;

    if (isDefined(that._groupElement) && args.name === 'showBorders') {
      that._groupElement.toggleClass(that.addWidgetPrefix(BORDERS_CLASS), !!args.value);
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }

  private _renderViews($groupElement) {
    const that = this;

    each(VIEW_NAMES, (index, viewName) => {
      // TODO getView
      const view = that.getView(viewName);
      if (view) {
        view.render($groupElement);
      }
    });
  }

  private _getTableRoleName() {
    return 'group';
  }

  public render($rootElement) {
    const isFirstRender = !this._groupElement;
    const $groupElement = this._groupElement || $('<div>').addClass(this.getWidgetContainerClass());

    $groupElement.addClass(GRIDBASE_CONTAINER_CLASS);
    $groupElement.toggleClass(this.addWidgetPrefix(BORDERS_CLASS), !!this.option('showBorders'));

    this.setAria('role', 'presentation', $rootElement);

    this.component.setAria('role', this._getTableRoleName(), $groupElement);

    this._rootElement = $rootElement || this._rootElement;

    if (isFirstRender) {
      this._groupElement = $groupElement;
      hasWindow() && this._resizingController.updateSize($rootElement);
      $groupElement.appendTo($rootElement);
    }

    if (!this._a11yGeneralStatusElement) {
      this._a11yGeneralStatusElement = A11yStatusContainerComponent({});
      this._a11yGeneralStatusElement.attr(E2E_ATTRIBUTES.a11yStatusContainer, 'true');
      $groupElement.append(this._a11yGeneralStatusElement);
    }

    this._renderViews($groupElement);
  }

  public update() {
    const that = this;
    const $rootElement = that._rootElement;
    const $groupElement = that._groupElement;

    if ($rootElement && $groupElement) {
      this._resizingController.resize();
      if (that._dataController.isLoaded()) {
        that._resizingController.fireContentReadyAction();
      }
    }
  }

  public setWidgetA11yStatusText(statusText: string): void {
    this._a11yGeneralStatusElement?.text(statusText);
  }
}

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
