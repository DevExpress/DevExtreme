/* eslint-disable max-classes-per-file */
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { getHeight, getWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import type { MasterDetail, Properties as DataGridProperties } from '@js/ui/data_grid';
import { getData } from '@ts/core/element_data';
import type { GroupingDataControllerExtension } from '@ts/grids/data_grid/grouping/types';
import type { ColumnFixingColumnsViewExtension } from '@ts/grids/grid_core/column_fixing/types';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/columns_controller';
import type { Column, ColumnTemplateSource } from '@ts/grids/grid_core/columns_controller/types';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type {
  DataChange,
  GeneratedItem,
  ItemProcessingOptions,
  ProcessedItem,
} from '@ts/grids/grid_core/data_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import { CLASSES as EDITOR_FACTORY_CLASSES } from '@ts/grids/grid_core/editor_factory/const';
import type { ResizingController } from '@ts/grids/grid_core/grid_view/grid_view';
import type {
  InternalGrid, ModuleType, OptionChanged, OptionChangedFor, RowKey,
} from '@ts/grids/grid_core/types';
import gridCoreUtils from '@ts/grids/grid_core/utils';
import { CLASSES as VIEW_CLASSES, ROW_OPTIONS_KEY } from '@ts/grids/grid_core/views/const';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type {
  RowPreparedOptions, RowRenderOptions, ViewCellOptions, ViewRow,
} from '@ts/grids/grid_core/views/types';

import { CLASSES } from './const';
import type {
  MasterDetailDataControllerExtension,
  MasterDetailExpandedItem,
  MasterDetailRowsViewExtension,
} from './types';
import { isDetailRow } from './utils';

const columns = (
  Base: ModuleType<ColumnsController>,
): ModuleType<ColumnsController> => class ColumnsMasterDetailExtender extends Base {
  protected _getExpandColumnsCore(): Column[] {
    const expandColumns = super._getExpandColumnsCore();

    if (this.option('masterDetail.enabled')) {
      expandColumns.push({
        type: 'detailExpand',
        cellTemplate: gridCoreUtils.getExpandCellTemplate(),
      });
    }
    return expandColumns;
  }
};

export const dataMasterDetailExtenderMixin = (
  Base: ModuleType<DataController & GroupingDataControllerExtension>,
): ModuleType<
  DataController & MasterDetailDataControllerExtension
> => class DataMasterDetailExtender extends Base {
  private _isExpandAll?: boolean;

  private _expandedItems!: MasterDetailExpandedItem[];

  public init(): void {
    this.initMasterDetail();
    super.init();
  }

  private initMasterDetail(): void {
    this._expandedItems = [];
    this._isExpandAll = this.option('masterDetail.autoExpandAll');
  }

  public expandAll(groupIndex: number): void {
    if (groupIndex < 0) {
      this._isExpandAll = true;
      this._expandedItems = [];
      this.updateItems();
    } else {
      super.expandAll(groupIndex);
    }
  }

  public collapseAll(groupIndex: number): void {
    if (groupIndex < 0) {
      this._isExpandAll = false;
      this._expandedItems = [];
      this.updateItems();
    } else {
      super.collapseAll(groupIndex);
    }
  }

  public isRowExpandedHack(...args: unknown[]): boolean | undefined {
    // @ts-expect-error TreeList forwards isRowExpanded(key, cache)
    return super.isRowExpanded(...args);
  }

  public isRowExpanded(key: RowKey): boolean {
    const expandIndex = gridCoreUtils.getIndexByKey(key, this._expandedItems);

    if (Array.isArray(key)) {
      return super.isRowExpanded(key);
    }
    return !!this._isExpandAll !== (expandIndex >= 0 && this._expandedItems[expandIndex].visible);
  }

  public getRowIndicesForExpand(key: RowKey): number[] {
    const rowIndex = this.getRowIndexByKey(key);

    return [rowIndex, rowIndex + 1];
  }

  public changeRowExpandCore(key: RowKey): DeferredObj<unknown> {
    if (Array.isArray(key)) {
      return super.changeRowExpandCore(key);
    }

    const expandIndex = gridCoreUtils.getIndexByKey(key, this._expandedItems);
    if (expandIndex >= 0) {
      const { visible } = this._expandedItems[expandIndex];

      this._expandedItems[expandIndex].visible = !visible;
    } else {
      this._expandedItems.push({ key, visible: true });
    }

    this.updateItems({
      changeType: 'update',
      rowIndices: this.getRowIndicesForExpand(key),
    });
    this.resetCachedProcessedItems();

    return Deferred<unknown>().resolve();
  }

  public _processDataItemHack(
    ...args: [GeneratedItem, ItemProcessingOptions]
  ): ProcessedItem {
    return super._processDataItem(...args);
  }

  protected _processDataItem(
    generatedItem: GeneratedItem,
    options: ItemProcessingOptions,
  ): ProcessedItem {
    const processedItem = super._processDataItem(generatedItem, options);

    processedItem.isExpanded = this.isRowExpanded(processedItem.key);

    if (options.detailColumnIndex === undefined) {
      const detailColumnIndex = options.visibleColumns.findIndex(
        (column) => column.command === 'expand' && !isDefined(column.groupIndex),
      );

      options.detailColumnIndex = detailColumnIndex;
    }

    if (options.detailColumnIndex >= 0) {
      processedItem.values[options.detailColumnIndex] = processedItem.isExpanded;
    }

    return processedItem;
  }

  public _processItemsHack(...args: [RawItemData[], DataChange]): ProcessedItem[] {
    return super._processItems(...args);
  }

  protected _processItems(items: RawItemData[], change: DataChange): ProcessedItem[] {
    const { changeType } = change;
    const result: ProcessedItem[] = [];

    const processedItems = super._processItems(items, change);

    if (changeType === 'loadingAll') {
      return processedItems;
    }

    if (changeType === 'refresh') {
      this._expandedItems = this._expandedItems.filter((item) => item.visible);
    }

    processedItems.forEach((item) => {
      result.push(item);
      const expandIndex = gridCoreUtils.getIndexByKey(item.key, this._expandedItems);

      if (item.rowType === 'data' && (item.isExpanded || expandIndex >= 0) && !item.isNewRow) {
        result.push({
          visible: item.isExpanded,
          rowType: 'detail',
          key: item.key,
          data: item.data,
          values: [],
        });
      }
    });

    return result;
  }

  public optionChanged(
    args: OptionChanged | OptionChangedFor<Pick<DataGridProperties, 'masterDetail'>>,
  ): void {
    if (args.name === 'masterDetail') {
      switch (args.fullName) {
        case 'masterDetail': {
          const { value, previousValue } = args;

          if (value?.enabled !== previousValue?.enabled
            || value?.autoExpandAll !== previousValue?.autoExpandAll) {
            this.initMasterDetail();
          }
          break;
        }
        case 'masterDetail.template':
        case 'masterDetail.enabled':
        case 'masterDetail.autoExpandAll':
          this.initMasterDetail();
          break;
        default:
          break;
      }

      args.handled = true;
      this.reset();
      return;
    }

    super.optionChanged(args);
  }
};

const resizing = (
  Base: ModuleType<ResizingController>,
): ModuleType<ResizingController> => class ResizingMasterDetailExtender extends Base {
  public fireContentReadyAction(): void {
    super.fireContentReadyAction();

    this._updateParentDataGrids(this.component.$element());
  }

  private _updateParentDataGrids($element: dxElementWrapper): void {
    const $masterDetailRow = $element.closest(`.${CLASSES.detailRow}`);

    if ($masterDetailRow.length) {
      when(this._updateMasterDataGrid($masterDetailRow, $element)).done(() => {
        this._updateParentDataGrids($masterDetailRow.parent());
      });
    }
  }

  private _updateMasterDataGrid(
    $masterDetailRow: dxElementWrapper,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    $detailElement: dxElementWrapper,
  ): DeferredObj<unknown> | undefined {
    const masterRowOptions = getData($($masterDetailRow), ROW_OPTIONS_KEY);
    const masterDataGrid = $($masterDetailRow)
      .closest(`.${this.getWidgetContainerClass()}`)
      .parent()
      .data<InternalGrid | undefined>('dxDataGrid');

    if (masterRowOptions && masterDataGrid) {
      return this._updateMasterDataGridCore(masterDataGrid, masterRowOptions);
    }

    return undefined;
  }

  public _updateMasterDataGridCore(
    masterDataGrid: InternalGrid,
    masterRowOptions: RowPreparedOptions,
  ): DeferredObj<unknown> | undefined {
    const d = Deferred();
    const masterRowsView: RowsView & Partial<ColumnFixingColumnsViewExtension> = masterDataGrid.getView('rowsView');

    if (masterRowsView?.isFixedColumns?.()) {
      this._updateFixedMasterDetailGrids(
        masterDataGrid,
        // @ts-expect-error the row options of a rendered row have a rowIndex
        masterRowOptions.rowIndex,
        $(masterRowOptions.rowElement),
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
      ).done(d.resolve);
    } else {
      if (masterDataGrid.option('scrolling.useNative') === true) {
        // @ts-expect-error updateDimensions() is typed as void
        masterDataGrid.updateDimensions().done(() => d.resolve(true));
        return undefined;
      }

      const scrollable = masterDataGrid.getScrollable();

      if (scrollable) {
        // T607490
        // @ts-expect-error update() is typed as Promise but returns a Deferred at runtime
        scrollable?.update().done(() => d.resolve());
      } else {
        d.resolve();
      }
    }

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return d.promise();
  }

  private _updateFixedMasterDetailGrids(
    masterDataGrid: InternalGrid,
    masterRowIndex: number,
    $detailElement: dxElementWrapper,
  ): DeferredObj<unknown> {
    const d = Deferred();
    const $rows = $(masterDataGrid.getRowElement(masterRowIndex));
    const $tables = $(masterDataGrid.getView('rowsView').getTableElements());
    const rowsNotEqual = $rows?.length === 2 && getHeight($rows.eq(0)) !== getHeight($rows.eq(1));
    const tablesNotEqual = $tables?.length === 2
      && getHeight($tables.eq(0)) !== getHeight($tables.eq(1));

    if (rowsNotEqual || tablesNotEqual) {
      const detailElementWidth = getWidth($detailElement);
      // @ts-expect-error updateDimensions() is typed as void
      masterDataGrid.updateDimensions().done(() => {
        const isDetailHorizontalScrollCanBeShown = this.option('columnAutoWidth')
          && masterDataGrid.option('scrolling.useNative') === true;
        const isDetailGridWidthChanged = isDetailHorizontalScrollCanBeShown
          && detailElementWidth !== getWidth($detailElement);

        if (isDetailHorizontalScrollCanBeShown && isDetailGridWidthChanged) {
          // @ts-expect-error updateDimensions() returns undefined only for an invisible grid
          this.updateDimensions().done(() => { d.resolve(true); });
        } else {
          d.resolve(true);
        }
      });

      // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
      return d.promise();
    }

    return Deferred().resolve();
  }

  protected _toggleBestFitMode(isBestFit: boolean): void {
    super._toggleBestFitMode(isBestFit);

    const hasMasterDetailTemplate = this.option('masterDetail.template');

    if (!hasMasterDetailTemplate) {
      return;
    }

    const $rowsTable = this._rowsView.getTableElement();

    if ($rowsTable) {
      const detailSelector = `.${this.addWidgetPrefix(CLASSES.detailContainer)}, .${CLASSES.detailCell}`;

      $rowsTable
        .find(detailSelector)
        .css('maxWidth', isBestFit ? 0 : '');
    }
  }
};

const rowsView = (
  Base: ModuleType<RowsView>,
): ModuleType<
  RowsView & MasterDetailRowsViewExtension
> => class RowsViewMasterDetailExtender extends Base {
  protected _getCellTemplate(
    options: ViewCellOptions,
  ): ColumnTemplateSource<ViewCellOptions> | undefined {
    const { column } = options;
    const isEditRow = this._editingController?.isEditRow(options.rowIndex);

    if (column.command === 'detail' && !isEditRow) {
      return this.option('masterDetail.template') || {
        allowRenderToDetachedContainer: false,
        render: this._getDefaultTemplate(column),
      };
    }

    return super._getCellTemplate(options);
  }

  protected _createRow(row?: ViewRow, tag?: string): dxElementWrapper {
    const $row = super._createRow(row, tag);

    if (!isDetailRow(row)) {
      return $row;
    }

    const showRowLines = this.option('showRowLines');

    $row
      .addClass(CLASSES.detailRow)
      .toggleClass(VIEW_CLASSES.rowLines, showRowLines);

    if (isDefined(row.visible)) {
      $row.toggle(row.visible);
    }

    return $row;
  }

  protected _renderCells($row: dxElementWrapper, options: RowRenderOptions): void {
    const { row } = options;

    if (!isDetailRow(row)) {
      super._renderCells($row, options);
      return;
    }

    if (this._needRenderCell(0, options.columnIndices)) {
      this.renderMasterDetailCell($row, row, options);
    }
  }

  public renderMasterDetailCell(
    $row: dxElementWrapper,
    row: ViewRow,
    options: RowRenderOptions,
  ): dxElementWrapper {
    const visibleColumns = this._columnsController.getVisibleColumns();

    const $detailCell = this._renderCell($row, {
      value: null,
      row,
      rowIndex: row.rowIndex,
      column: { command: 'detail' },
      columnIndex: 0,
      change: options.change,
    });

    $detailCell
      .addClass(EDITOR_FACTORY_CLASSES.cellFocusDisabled)
      .addClass(CLASSES.detailCell)
      .attr('colSpan', visibleColumns.length);

    const isEditForm = row.isEditing;

    if (!isEditForm) {
      this.setAria('roledescription', messageLocalization.format('dxDataGrid-masterDetail'), $detailCell);
    }

    return $detailCell;
  }
};

export const masterDetailModule = {
  defaultOptions(): { masterDetail: MasterDetail } {
    return {
      masterDetail: {
        enabled: false,
        autoExpandAll: false,
        // @ts-expect-error masterDetail.template is typed without null
        template: null,
      },
    };
  },
  extenders: {
    controllers: {
      columns,
      data: dataMasterDetailExtenderMixin,
      resizing,
    },
    views: {
      rowsView,
    },
  },
};
