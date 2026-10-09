/* eslint-disable max-classes-per-file */
import messageLocalization from '@js/common/core/localization/message';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import type { Callback } from '@js/core/utils/callbacks';
import { deferRender, deferUpdate } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { getBoundingRect } from '@js/core/utils/position';
import { getHeight, getWidth } from '@js/core/utils/size';
import { setHeight } from '@js/core/utils/style';
import { isDefined, isNumeric, isString } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import * as accessibility from '@js/ui/shared/accessibility';
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/m_editor_factory';
import { A11yStatusContainerComponent } from '@ts/grids/grid_core/views/a11y_status_container_component';

import type { FooterView } from '../../data_grid/summary/m_summary';
import type { AdaptiveColumnsController } from '../adaptivity/m_adaptivity';
import type { ColumnHeadersView } from '../column_headers/m_column_headers';
import type { ColumnsController } from '../columns_controller/columns_controller';
import { GROUP_COMMAND_COLUMN_NAME } from '../columns_controller/const';
import type { Column } from '../columns_controller/types';
import type { DataController } from '../data_controller/data_controller';
import type { DataChange } from '../data_controller/types';
import type { DataSourceController } from '../data_source/data_source_controller';
import gridCoreUtils from '../m_utils';
import modules from '../modules/modules';
import type {
  InternalGridOptions, OptionChanged, SelectionRange, Views,
} from '../types';
import { CLASSES } from './const';
import type { ColumnsView } from './m_columns_view';
import type { RowsView } from './m_rows_view';
import type { ColumnWidth, ScrollPosition, ViewDataChange } from './types';

const BORDERS_CLASS = 'borders';
const IMPORTANT_MARGIN_CLASS = 'important-margin';
const GRIDBASE_CONTAINER_CLASS = 'dx-gridbase-container';
const GROUP_ROW_SELECTOR = `tr.${CLASSES.groupRow}`;

const HIDDEN_COLUMNS_WIDTH = 'adaptiveHidden';

const VIEW_NAMES = [
  'columnsSeparatorView',
  'blockSeparatorView',
  'trackerView',
  'headerPanel',
  'columnHeadersView',
  'rowsView',
  'footerView',
  'columnChooserView',
  'filterPanelView',
  'pagerView',
  'draggingHeaderView',
  'contextMenuView',
  'headerFilterView',
  'filterBuilderView',
  'toastView',
  'aiPromptEditorView',
  'aiAssistantView',
] as const;

const E2E_ATTRIBUTES = {
  a11yStatusContainer: 'e2e-a11y-general-status-container',
};

const isPercentWidth = function isPercentWidth(width: ColumnWidth): boolean {
  return isString(width) && width.endsWith('%');
};

const isPixelWidth = function isPixelWidth(width: ColumnWidth): boolean {
  return isString(width) && width.endsWith('px');
};

const calculateFreeWidth = function calculateFreeWidth(
  that: ResizingController,
  widths: ColumnWidth[],
): number {
  // @ts-expect-error the helper reads non-public members of the controller
  const contentWidth = that._rowsView.contentWidth();
  // @ts-expect-error the helper reads non-public members of the controller
  const totalWidth = that._getTotalWidth(widths, contentWidth);

  return contentWidth - totalWidth;
};

const calculateFreeWidthWithCurrentMinWidth = function calculateFreeWidthWithCurrentMinWidth(
  that: ResizingController,
  columnIndex: number,
  currentMinWidth: number,
  widths: ColumnWidth[],
): number {
  return calculateFreeWidth(
    that,
    widths.map((width, index) => (index === columnIndex ? currentMinWidth : width)),
  );
};

const restoreFocus = (focusedElement: Element, selectionRange: SelectionRange): void => {
  accessibility.hiddenFocus(focusedElement, true);
  gridCoreUtils.setSelectionRange(focusedElement, selectionRange);
};

export class ResizingController extends modules.ViewController {
  private _refreshSizesHandler?: (change: DataChange) => void;

  public _dataController!: DataController;

  private dataSourceController!: DataSourceController;

  protected _rowsView!: RowsView;

  private _columnHeadersView!: ColumnHeadersView;

  public _columnsController!: ColumnsController;

  private _footerView!: FooterView;

  private _gridView!: GridView;

  private _prevContentMinHeight!: string | null;

  private _hasWidth?: boolean;

  private _hasHeight?: boolean;

  private _resizeDeferred?: DeferredObj<unknown>;

  public _lastWidth?: number;

  private _devicePixelRatio?: number;

  private _lastHeight?: number;

  protected adaptiveColumnsController!: AdaptiveColumnsController;

  private _editorFactoryController!: EditorFactory;

  protected _updateScrollableTimeoutID?: ReturnType<typeof setTimeout>;

  public resizeCompleted!: Callback;

  private isMaxWidthSet = false;

  protected callbackNames(): string[] {
    return ['resizeCompleted'];
  }

  public init(): void {
    this._prevContentMinHeight = null;
    this._dataController = this.getController('data');
    this.dataSourceController = this.getController('dataSource');
    this._columnsController = this.getController('columns');
    this._columnHeadersView = this.getView('columnHeadersView');
    this.adaptiveColumnsController = this.getController('adaptiveColumns');
    this._editorFactoryController = this.getController('editorFactory');
    this._footerView = this.getView('footerView');
    this._rowsView = this.getView('rowsView');
    this._gridView = this.getView('gridView');
  }

  private _initPostRenderHandlers(): void {
    if (!this._refreshSizesHandler) {
      const refreshSizesHandler = (change: DataChange): void => {
        let resizeDeferred: DeferredObj<unknown> = Deferred<null>().resolve(null);
        const changeType = change?.changeType;
        // @ts-expect-error e.isDelayed is set for virtual scrolling with scrolling.legacyMode
        const isDelayed = change?.isDelayed;
        const needFireContentReady = changeType
          && changeType !== 'updateSelection'
          && changeType !== 'updateFocusedRow'
          && changeType !== 'pageIndex'
          && !isDelayed;

        this._dataController.changed.remove(refreshSizesHandler);

        if (this._checkSize()) {
          resizeDeferred = this._refreshSizes(change);
        }

        if (needFireContentReady) {
          when(resizeDeferred).done(() => {
            this._setAriaLabel(change);
            this.fireContentReadyAction();
          });
        }
      };
      this._refreshSizesHandler = refreshSizesHandler;
      // TODO remove resubscribing
      this._dataController.changed.add(() => {
        this._dataController.changed.add(refreshSizesHandler);
      });
    }
  }

  private _refreshSizes(e: ViewDataChange): DeferredObj<unknown> {
    const changeType = e?.changeType;
    // @ts-expect-error e.isDelayed is set for virtual scrolling with scrolling.legacyMode
    const isDelayed = e?.isDelayed;

    if (!e || (changeType !== undefined && ['refresh', 'prepend', 'append'].includes(changeType))) {
      if (!isDelayed) {
        return this.resize();
      }
    }

    if (changeType === 'update') {
      if (!e.changeTypes?.length) {
        return Deferred<null>().resolve(null);
      }

      const items = this._dataController.items();
      const isHidingNoDataPanel = items.length <= 1 && e.changeTypes[0] === 'insert';
      const isShowingNoDataPanel = items.length === 0 && e.changeTypes[0] === 'remove';

      if (!isHidingNoDataPanel && !isShowingNoDataPanel && !e.needUpdateDimensions) {
        const deferred = Deferred<unknown>();

        this._waitAsyncTemplates().done(() => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
          deferUpdate(() => deferRender(() => deferUpdate(() => {
            this._setScrollerSpacing();
            this._rowsView.resize();
            deferred.resolve();
          })));
          // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
        }).fail(deferred.reject);

        return deferred;
      }

      return this.resize();
    }

    return Deferred<null>().resolve(null);
  }

  /**
   * @extended: master_detail
   */
  public fireContentReadyAction(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
    this.component._fireContentReadyAction();
  }

  protected _getWidgetAriaLabel(): string {
    return 'dxDataGrid-ariaDataGrid';
  }

  private _setAriaLabel(e?: DataChange): void {
    let widgetStatusText = '';
    let labelParts: string[] = [];

    const columnCount = this._columnsController?._columns
      ?.filter(({ visible }) => !!visible).length ?? 0;
    const totalItemsCount = Math.max(0, this.dataSourceController.totalItemsCount());
    const widgetAriaLabel = this._getWidgetAriaLabel();
    widgetStatusText = messageLocalization
      // @ts-expect-error Badly typed format method
      .format(widgetAriaLabel, totalItemsCount, columnCount);

    // @ts-expect-error Treelist Variable
    const expandableWidgetAriaLabel = messageLocalization.format(this._expandableWidgetAriaId);
    labelParts = [widgetStatusText];
    if (expandableWidgetAriaLabel) {
      labelParts.push(expandableWidgetAriaLabel);
    }

    const $ariaLabelElement = this.component.$element().children(`.${GRIDBASE_CONTAINER_CLASS}`);

    this.component.setAria('label', labelParts.join('. '), $ariaLabelElement);
    if (!e?.isFirstRender) {
      this._gridView.setWidgetA11yStatusText(widgetStatusText);
    }
  }

  private _getBestFitWidths(): number[] {
    const rowsView = this._rowsView;
    const columnHeadersView = this._columnHeadersView;
    let widths = rowsView.getColumnWidths();

    if (!widths?.length) {
      const headersTableElement = columnHeadersView.getTableElement();
      columnHeadersView.setTableElement(rowsView.getTableElement()?.children(`.${CLASSES.headerBody}`));
      widths = columnHeadersView.getColumnWidths();
      columnHeadersView.setTableElement(headersTableElement);
    }

    return widths;
  }

  private _setVisibleWidths(visibleColumns: Column[], widths: ColumnWidth[]): void {
    const columnsController = this._columnsController;
    columnsController.beginUpdate();
    each(visibleColumns, (index, column) => {
      const columnId = columnsController.getColumnId(column);
      columnsController.columnOption(columnId, 'visibleWidth', widths[index]);
    });
    columnsController.endUpdate();
  }

  private _toggleBestFitModeForView(
    view: ColumnsView | undefined,
    className: string,
    isBestFit: boolean,
  ): void {
    if (!view?.isVisible()) {
      return;
    }

    const $rowsTables = this._rowsView.getTableElements();
    const $viewTables = view.getTableElements();

    each($rowsTables, (index, tableElement) => {
      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if/else
      let $tableBody: dxElementWrapper;
      const $rowsTable = $(tableElement);
      const $viewTable = $viewTables.eq(index);

      if ($viewTable?.length) {
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
  protected _toggleBestFitMode(isBestFit: boolean): void {
    const $rowsTable = this._rowsView.getTableElement();
    const $rowsFixedTable = this._rowsView.getTableElements().eq(1);

    if (!$rowsTable) return;

    $rowsTable.css('tableLayout', isBestFit ? 'auto' : 'fixed');
    $rowsTable.children('colgroup').css('display', isBestFit ? 'none' : '');

    // NOTE T1156153: Hide group row column to get correct fixed column widths.
    each($rowsFixedTable.find(GROUP_ROW_SELECTOR), (idx, item) => {
      $(item).css('display', isBestFit ? 'none' : '');
    });

    $rowsFixedTable.toggleClass(this.addWidgetPrefix(CLASSES.tableFixed), !isBestFit);

    this._toggleBestFitModeForView(this._columnHeadersView, CLASSES.headerBody, isBestFit);
    this._toggleBestFitModeForView(this._footerView, CLASSES.footerBody, isBestFit);

    if (this._needStretch()) {
      // @ts-expect-error
      $rowsTable.get(0).style.width = isBestFit ? 'auto' : '';
    }
  }

  private _toggleContentMinHeight(value: boolean | undefined): void {
    const $contentElement = this._rowsView._findContentElement();

    if (value === true) {
      this._prevContentMinHeight = $contentElement.get(0).style.minHeight;
    }

    if (isDefined(this._prevContentMinHeight)) {
      $contentElement.css({
        minHeight: value
          ? gridCoreUtils.getContentHeightLimit(browser)
          : this._prevContentMinHeight,
      });
    }
  }

  private setMaxWidth(value: number): void {
    this.isMaxWidthSet = true;
    this.component.$element().css('maxWidth', value);
  }

  private _clearMaxWidth(): void {
    if (!this.isMaxWidthSet) {
      return;
    }

    this.isMaxWidthSet = false;

    const element = this.component.$element().get(0) as HTMLElement | undefined;

    if (element) {
      element.style.maxWidth = '';
    }
  }

  private enableTemporaryBestFitMode(): () => void {
    const $element = this.component.$element();
    const focusedElement = domAdapter.getActiveElement($element.get(0) as HTMLElement | null);
    const selectionRange = gridCoreUtils.getSelectionRange(focusedElement);

    this._toggleBestFitMode(true);

    return (): void => {
      this._toggleBestFitMode(false);

      if (focusedElement && focusedElement !== domAdapter.getActiveElement()) {
        const isFocusOutsideWindow = getBoundingRect(focusedElement).bottom < 0;

        if (!isFocusOutsideWindow) {
          restoreFocus(focusedElement, selectionRange);
        }
      }
    };
  }

  private synchronizeColumns(): void {
    const columnsController = this._columnsController;
    const visibleColumns = columnsController.getVisibleColumns();
    const columnAutoWidth = this.option('columnAutoWidth') as boolean;
    const hasUndefinedColumnWidth = visibleColumns.some((column) => !isDefined(column.width));
    const needBestFit = !!this._needBestFit() || visibleColumns.some((column) => column.width === 'auto');
    const hasMinWidth = visibleColumns.some((column) => !!column.minWidth);

    this._toggleContentMinHeight(this._hasHeight); // T1047239, T1270354
    this._setVisibleWidths(visibleColumns, []);
    const restoreAfterBestFitMode = needBestFit && this.enableTemporaryBestFitMode();
    this._clearMaxWidth();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    deferUpdate(() => {
      let resultWidths: ColumnWidth[] = [];

      if (needBestFit || hasMinWidth) {
        resultWidths = this._getBestFitWidths();
      }

      each(visibleColumns, (index, column) => {
        if (needBestFit) {
          const columnId = columnsController.getColumnId(column);
          columnsController.columnOption(columnId, 'bestFitWidth', resultWidths[index], true);
        }

        const { width } = column;
        if (width !== 'auto') {
          if (isDefined(width)) {
            resultWidths[index] = isNumeric(width) || isPixelWidth(width)
              ? parseFloat(String(width))
              : width;
          } else if (!columnAutoWidth) {
            resultWidths[index] = undefined;
          }
        }
      });

      if (restoreAfterBestFitMode) {
        restoreAfterBestFitMode();
      }

      const isColumnWidthsCorrected = this._correctColumnWidths(resultWidths, visibleColumns);

      if (columnAutoWidth) {
        this.normalizeWidthsByExpandColumns(resultWidths, visibleColumns);
        if (this._needStretch()) {
          this._processStretch(resultWidths, visibleColumns);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      deferRender(() => {
        if (needBestFit || isColumnWidthsCorrected || hasUndefinedColumnWidth) {
          this._setVisibleWidths(visibleColumns, resultWidths);
        }

        this._toggleContentMinHeight(false);
      });
    });
  }

  /**
   * @extended: adaptivity
   */
  protected _needBestFit(): boolean | undefined {
    return this.option('columnAutoWidth');
  }

  /**
   * @extended: adaptivity
   */
  protected _needStretch(): boolean {
    return this._columnsController.getVisibleColumns().some((c) => c.width === 'auto' && !c.command);
  }

  private _getAverageColumnsWidth(resultWidths: ColumnWidth[]): number {
    const freeWidth = calculateFreeWidth(this, resultWidths);
    const columnCountWithoutWidth = resultWidths.filter((width) => width === undefined).length;

    return freeWidth / columnCountWithoutWidth;
  }

  private normalizeWidthsByExpandColumns(
    resultWidths: ColumnWidth[],
    visibleColumns: Column[],
  ): void {
    const isExpandColumn = (column: Column): boolean => column.type === GROUP_COMMAND_COLUMN_NAME;

    const lastExpandColumnIndex = visibleColumns.reduce(
      (result, column, index) => (isExpandColumn(column) ? index : result),
      -1,
    );

    if (lastExpandColumnIndex < 0) {
      return;
    }

    const expandColumnWidth = resultWidths[lastExpandColumnIndex];

    if (!expandColumnWidth) {
      return;
    }

    visibleColumns.forEach((column, index) => {
      if (isExpandColumn(column)) {
        resultWidths[index] = expandColumnWidth;
      }
    });
  }

  /**
   * @extended: adaptivity
   */
  protected _correctColumnWidths(resultWidths: ColumnWidth[], visibleColumns: Column[]): boolean {
    let hasPercentWidth = false;
    let hasAutoWidth = false;
    let isColumnWidthsCorrected = false;
    const hasWidth = this._hasWidth;

    for (let i = 0; i < visibleColumns.length; i += 1) {
      const index = i;
      const column = visibleColumns[index];
      const isHiddenColumn = resultWidths[index] === HIDDEN_COLUMNS_WIDTH;
      let width = resultWidths[index];
      const { minWidth } = column;

      if (minWidth && width === undefined) {
        const averageColumnsWidth = this._getAverageColumnsWidth(resultWidths);
        width = averageColumnsWidth;
      } else if (minWidth && isPercentWidth(width)) {
        const freeWidth = calculateFreeWidthWithCurrentMinWidth(
          this,
          index,
          minWidth,
          resultWidths,
        );

        if (freeWidth < 0) {
          width = -1;
        }
      }

      const realColumnWidth = this._getRealColumnWidth(
        index,
        resultWidths.map(
          (columnWidth, columnIndex) => (index === columnIndex ? width : columnWidth),
        ),
      );

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
      const $rowsViewElement = this._rowsView.element();
      const contentWidth = this._rowsView.contentWidth();
      const scrollbarWidth = this._rowsView.getScrollbarWidth();
      const totalWidth = this._getTotalWidth(resultWidths, contentWidth);

      if (totalWidth < contentWidth) {
        const lastColumnIndex = gridCoreUtils.getLastResizableColumnIndex(
          visibleColumns,
          resultWidths,
        );

        if (lastColumnIndex >= 0) {
          resultWidths[lastColumnIndex] = 'auto';
          isColumnWidthsCorrected = true;
          if (hasWidth === false && !hasPercentWidth) {
            const borderWidth = gridCoreUtils.getComponentBorderWidth(this, $rowsViewElement);

            this.setMaxWidth(totalWidth + scrollbarWidth + borderWidth);
          }
        }
      }
    }
    return isColumnWidthsCorrected;
  }

  private _processStretch(resultSizes: ColumnWidth[], visibleColumns: Column[]): void {
    const groupSize = this._rowsView.contentWidth();
    const tableSize = this._getTotalWidth(resultSizes, groupSize);
    const unusedIndexes = { length: 0 };

    if (!resultSizes.length) return;

    each(visibleColumns, function markUnusedIndex(this: Column, index: number) {
      if (this.width || resultSizes[index] === HIDDEN_COLUMNS_WIDTH) {
        unusedIndexes[index] = true;
        unusedIndexes.length += 1;
      }
    });

    const diff = groupSize - tableSize;
    const diffElement = Math.floor(diff / (resultSizes.length - unusedIndexes.length));
    let onePixelElementsCount = diff - diffElement * (resultSizes.length - unusedIndexes.length);
    if (diff >= 0) {
      for (let i = 0; i < resultSizes.length; i += 1) {
        if (unusedIndexes[i]) {
          // eslint-disable-next-line no-continue -- an inverted if would exceed max-depth
          continue;
        }
        // @ts-expect-error columns without a width have best-fit widths here
        resultSizes[i] += diffElement;
        if (onePixelElementsCount > 0 && onePixelElementsCount < 1) {
          // @ts-expect-error columns without a width have best-fit widths here
          resultSizes[i] += onePixelElementsCount;
          onePixelElementsCount = 0;
        } else if (onePixelElementsCount > 0) {
          resultSizes[i] = Number(resultSizes[i]) + 1;
          onePixelElementsCount -= 1;
        }
      }
    }
  }

  private _getRealColumnWidth(
    columnIndex: number,
    columnWidths: ColumnWidth[],
    groupWidth?: number,
  ): number {
    let ratio = 1;
    const width = columnWidths[columnIndex];

    if (!isPercentWidth(width)) {
      return parseFloat(String(width));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const percentTotalWidth = columnWidths.reduce<number>((sum, columnWidth, index) => {
      if (!isPercentWidth(columnWidth)) {
        return sum;
      }

      return sum + parseFloat(String(columnWidth));
    }, 0);
    const pixelTotalWidth = columnWidths.reduce<number>((sum, columnWidth) => {
      if (!columnWidth || columnWidth === HIDDEN_COLUMNS_WIDTH || isPercentWidth(columnWidth)) {
        return sum;
      }

      return sum + parseFloat(String(columnWidth));
    }, 0);

    const currentGroupWidth = groupWidth || this._rowsView.contentWidth();

    const freeSpace = currentGroupWidth - pixelTotalWidth;
    const percentTotalWidthInPixel = (percentTotalWidth * currentGroupWidth) / 100;

    if (pixelTotalWidth > 0 && (percentTotalWidthInPixel + pixelTotalWidth) >= currentGroupWidth) {
      ratio = percentTotalWidthInPixel > freeSpace ? freeSpace / percentTotalWidthInPixel : 1;
    }

    return (parseFloat(String(width)) * currentGroupWidth * ratio) / 100;
  }

  private _getTotalWidth(widths: ColumnWidth[], groupWidth: number): number {
    let result = 0;

    for (let i = 0; i < widths.length; i += 1) {
      const width = widths[i];
      if (width && width !== HIDDEN_COLUMNS_WIDTH) {
        result += this._getRealColumnWidth(i, widths, groupWidth);
      }
    }

    return Math.ceil(result);
  }

  private _getGroupElement(): HTMLElement | undefined {
    return this.component.$element().children().get(0) as HTMLElement | undefined;
  }

  public updateSize(rootElement: dxElementWrapper): void {
    const $rootElement = $(rootElement);
    const importantMarginClass = this.addWidgetPrefix(IMPORTANT_MARGIN_CLASS);

    if (this._hasHeight === undefined && $rootElement && $rootElement.is(':visible') && getWidth($rootElement)) {
      const $groupElement = $rootElement.children(`.${this.getWidgetContainerClass()}`);

      if ($groupElement.length) {
        $groupElement.detach();
      }

      this._hasHeight = !!getHeight($rootElement);

      const width = getWidth($rootElement);
      $rootElement.addClass(importantMarginClass);
      this._hasWidth = getWidth($rootElement) === width;
      $rootElement.removeClass(importantMarginClass);

      if ($groupElement.length) {
        $groupElement.appendTo($rootElement);
      }
    }
  }

  public publicMethods(): string[] {
    return ['resize', 'updateDimensions'];
  }

  private _waitAsyncTemplates(): DeferredObj<unknown> {
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
      return Deferred<unknown>().resolve();
    }

    const d = Deferred<unknown>();

    this._waitAsyncTemplates().done(() => {
      when(this.updateDimensions())
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
        .done(d.resolve)
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
        .fail(d.reject);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    }).fail(d.reject);

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    const promise: DeferredObj<unknown> = d.promise();

    return promise.done(() => {
      this.resizeCompleted.fire();
    });
  }

  public updateDimensions(checkSize?: boolean): DeferredObj<unknown> | undefined {
    this._initPostRenderHandlers();

    // T335767
    if (!this._checkSize(checkSize)) {
      return undefined;
    }

    const prevResult = this._resizeDeferred;
    const result = Deferred<unknown>();
    this._resizeDeferred = result;

    when(prevResult).always(() => {
      deferRender(() => {
        if (this._dataController.isLoaded()) {
          this.synchronizeColumns();
        }
        // IE11
        this._resetGroupElementHeight();

        // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
        deferUpdate(() => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
          deferRender(() => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
            deferUpdate(() => {
              this._updateDimensionsCore();
            });
          });
        });
        // @ts-expect-error
      }).done(result.resolve).fail(result.reject);
    });

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return result.promise();
  }

  private _resetGroupElementHeight(): void {
    const groupElement = this._getGroupElement();
    const scrollable = this._rowsView.getScrollable();
    if (groupElement?.style.height && !scrollable?.scrollTop()) {
      groupElement.style.height = '';
    }
  }

  private _checkSize(checkSize?: boolean): boolean {
    const $rootElement = this.component.$element();
    const isWidgetVisible = $rootElement.is(':visible');
    const isGridSizeChanged = this._lastWidth !== getWidth($rootElement)
          || this._lastHeight !== getHeight($rootElement)
          || this._devicePixelRatio !== getWindow().devicePixelRatio;

    return isWidgetVisible && (!checkSize || isGridSizeChanged);
  }

  private _setScrollerSpacingCore(): void {
    const vScrollbarWidth = this._rowsView.getScrollbarWidth();
    const hScrollbarWidth = this._rowsView.getScrollbarWidth(true);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
    deferRender(() => {
      this._columnHeadersView?.setScrollerSpacing(vScrollbarWidth);
      this._footerView?.setScrollerSpacing(vScrollbarWidth);
      this._rowsView.setScrollerSpacing(vScrollbarWidth, hScrollbarWidth);
    });
  }

  private _setScrollerSpacing(): void {
    const scrollable = this._rowsView.getScrollable();
    // T722415, T758955
    const isNativeScrolling = this.option('scrolling.useNative') === true;

    if (!scrollable || isNativeScrolling) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
      deferRender(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
        deferUpdate(() => {
          this._setScrollerSpacingCore();
        });
      });
    } else { this._setScrollerSpacingCore(); }
  }

  /**
   * @extended: column_fixing
   */
  protected _setAriaOwns(): void {
    const headerTable = this._columnHeadersView?.getTableElement();
    const footerTable = this._footerView?.getTableElement();

    // @ts-expect-error
    this._rowsView?.setAriaOwns(headerTable?.attr('id'), footerTable?.attr('id'));
  }

  /**
   * @extended: header_panel
   */
  protected _updateDimensionsCore(): void {
    const dataController = this._dataController;
    const rowsView = this._rowsView;

    const $rootElement = this.component.$element();
    const groupElement = this._getGroupElement();

    const rootElementHeight = getHeight($rootElement);
    // @ts-expect-error
    const height = this.option('height') ?? $rootElement.get(0).style.height;
    const isHeightSpecified = !!height && height !== 'auto';

    // @ts-expect-error
    // eslint-disable-next-line radix
    const maxHeight = parseInt($rootElement.css('maxHeight'));
    const maxHeightHappened = maxHeight && rootElementHeight >= maxHeight;
    const isMaxHeightApplied = groupElement
      && groupElement.scrollHeight === groupElement.offsetHeight;

    this.updateSize($rootElement);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
    deferRender(() => {
      const hasHeight = !!this._hasHeight || !!maxHeight || isHeightSpecified;
      rowsView.hasHeight(hasHeight);

      this._setAriaOwns();

      // IE11
      if (maxHeightHappened && !isMaxHeightApplied) {
        setHeight($(groupElement), maxHeight);
      }

      if (!dataController.isLoaded()) {
        rowsView.setLoading(dataController.isLoading());
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
      deferUpdate(() => {
        this._updateLastSizes($rootElement);
        this._setScrollerSpacing();

        each(VIEW_NAMES, (index, viewName) => {
          // TODO getView
          const view = this.getView(viewName);
          if (view) {
            view.resize();
          }
        });

        this._editorFactoryController?.resize();
      });
    });
  }

  private _updateLastSizes($rootElement: dxElementWrapper): void {
    this._lastWidth = getWidth($rootElement);
    this._lastHeight = getHeight($rootElement);
    this._devicePixelRatio = getWindow().devicePixelRatio;
  }

  public optionChanged(args: OptionChanged): void {
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

  /**
   * @extended: virtual_scrolling
   */
  public resetLastResizeTime(): void {}
}

export class SynchronizeScrollingController extends modules.ViewController {
  private _scrollChangedHandler(
    views: ColumnsView[],
    pos: ScrollPosition,
    viewName: string,
  ): void {
    for (const view of views) {
      if (view && view.name !== viewName) {
        view.scrollTo({ left: pos.left, top: pos.top });
      }
    }
  }

  public init(): void {
    const views = [this.getView('columnHeadersView'), this.getView('footerView'), this.getView('rowsView')];

    for (const view of views) {
      if (view) {
        view.scrollChanged.add(this._scrollChangedHandler.bind(this, views));
      }
    }
  }
}

export class GridView extends modules.View {
  private _resizingController!: ResizingController;

  private _dataController!: DataController;

  private _groupElement?: dxElementWrapper;

  private _rootElement?: dxElementWrapper;

  private _a11yGeneralStatusElement!: dxElementWrapper;

  public init(): void {
    this._resizingController = this.getController('resizing');
    this._dataController = this.getController('data');
  }

  protected _endUpdateCore(): void {
    if (this.component._requireResize) {
      this.component._requireResize = false;
      this._resizingController.resize();
    }
  }

  public getView<T extends keyof Views>(name: T): Views[T] {
    return this.component._views[name];
  }

  public element(): dxElementWrapper | undefined {
    return this._groupElement;
  }

  public optionChanged(args: OptionChanged): void {
    if (isDefined(this._groupElement) && args.name === 'showBorders') {
      this._groupElement.toggleClass(this.addWidgetPrefix(BORDERS_CLASS), !!args.value);
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }

  private _renderViews($groupElement: dxElementWrapper): void {
    each(VIEW_NAMES, (index, viewName) => {
      // TODO getView
      const view = this.getView(viewName);
      if (view) {
        view.render($groupElement);
      }
    });
  }

  private _getTableRoleName(): string {
    return 'group';
  }

  public render($rootElement: dxElementWrapper): void {
    const isFirstRender = !this._groupElement;
    const $groupElement = this._groupElement ?? $('<div>').addClass(this.getWidgetContainerClass());

    $groupElement.addClass(GRIDBASE_CONTAINER_CLASS);
    $groupElement.toggleClass(this.addWidgetPrefix(BORDERS_CLASS), !!this.option('showBorders'));

    this.setAria('role', 'presentation', $rootElement);

    this.component.setAria('role', this._getTableRoleName(), $groupElement);

    this._rootElement = $rootElement || this._rootElement;

    if (isFirstRender) {
      this._groupElement = $groupElement;
      if (hasWindow()) {
        this._resizingController.updateSize($rootElement);
      }
      $groupElement.appendTo($rootElement);
    }

    if (!this._a11yGeneralStatusElement) {
      this._a11yGeneralStatusElement = A11yStatusContainerComponent({});
      this._a11yGeneralStatusElement.attr(E2E_ATTRIBUTES.a11yStatusContainer, 'true');
      $groupElement.append(this._a11yGeneralStatusElement);
    }

    this._renderViews($groupElement);
  }

  public update(): void {
    const $rootElement = this._rootElement;
    const $groupElement = this._groupElement;

    if ($rootElement && $groupElement) {
      this._resizingController.resize();
      if (this._dataController.isLoaded()) {
        this._resizingController.fireContentReadyAction();
      }
    }
  }

  public setWidgetA11yStatusText(statusText: string): void {
    this._a11yGeneralStatusElement?.text(statusText);
  }
}

export const gridViewModule = {
  defaultOptions(): Pick<InternalGridOptions, 'showBorders' | 'renderAsync'> {
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
