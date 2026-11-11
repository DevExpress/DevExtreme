/* eslint-disable max-classes-per-file */
import '@js/ui/button';
import '@js/ui/drop_down_button';

import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import type { Callback } from '@js/core/utils/callbacks';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getDefaultAlignment } from '@js/core/utils/position';
import { format } from '@js/core/utils/string';
import { isDefined, isFunction } from '@js/core/utils/type';
import type { Export, ExportTexts } from '@js/ui/data_grid';
import errors from '@js/ui/widget/ui.errors';
import type { SummaryDataControllerExtension, SummaryItem } from '@ts/grids/data_grid/summary/types';
import type { Column, ColumnsChanges } from '@ts/grids/grid_core/columns_controller/types';
import { prepareItems } from '@ts/grids/grid_core/export';
import type { ToolbarItem } from '@ts/grids/grid_core/header_panel/types';
import List from '@ts/ui/list/list.edit.search';

import type { ColumnHeadersView } from '../../grid_core/column_headers/column_headers';
import type { ColumnsController } from '../../grid_core/columns_controller/columns_controller';
import type { DataController } from '../../grid_core/data_controller/data_controller';
import type { DataSourceController } from '../../grid_core/data_source/data_source_controller';
import type { EditingController } from '../../grid_core/editing/editing';
import type { HeaderPanel } from '../../grid_core/header_panel/header_panel';
import type { SelectionController } from '../../grid_core/selection/selection';
import type { ModuleType } from '../../grid_core/types';
import type { RowsView } from '../../grid_core/views/rows_view';
import dataGridCore from '../core';
import { isDataColumn } from '../utils';
import type {
  ColumnWidthsByColumnIndex,
  DataProviderOptions,
  ExportableColumn,
  ExportCellData,
  ExportColumn,
  ExportGroupItem,
  ExportGroupSummaryItem,
  ExportItem,
  ExportMenuItem,
  ExportOptionChanged,
  ExportStyle,
  ExportSummaryItem,
} from './types';

const DATAGRID_EXPORT_MENU_CLASS = 'dx-datagrid-export-menu';
const DATAGRID_EXPORT_BUTTON_CLASS = 'dx-datagrid-export-button';
const DATAGRID_EXPORT_TOOLBAR_BUTTON_NAME = 'exportButton';
const DATAGRID_EXPORT_ICON = 'export';
const DATAGRID_EXPORT_EXCEL_ICON = 'xlsxfile';
const DATAGRID_EXPORT_SELECTED_ICON = 'exportselected';

const DATAGRID_PDF_EXPORT_ICON = 'pdffile';

export class DataProvider {
  private readonly _exportController: ExportController;

  private readonly _initialColumnWidthsByColumnIndex: ColumnWidthsByColumnIndex | undefined;

  private readonly _selectedRowsOnly: boolean | undefined;

  private _options!: DataProviderOptions;

  constructor(
    exportController: ExportController,
    initialColumnWidthsByColumnIndex: ColumnWidthsByColumnIndex | undefined,
    selectedRowsOnly: boolean | undefined,
  ) {
    this._exportController = exportController;
    this._initialColumnWidthsByColumnIndex = initialColumnWidthsByColumnIndex;
    this._selectedRowsOnly = selectedRowsOnly;
  }

  private _getGroupValue(item: ExportGroupItem): string {
    const {
      key, data, rowType, groupIndex, summaryCells,
    } = item;
    const groupColumn = this._options.groupColumns[groupIndex];

    const value = dataGridCore.getDisplayValue(
      groupColumn,
      groupColumn.deserializeValue
        ? groupColumn.deserializeValue(key[groupIndex])
        : key[groupIndex],
      data,
      rowType,
    );

    let result = `${groupColumn.caption}: ${dataGridCore.formatValue(value, groupColumn)}`;

    if (summaryCells?.[0]?.length) {
      result += ` ${dataGridCore.getGroupRowSummaryText(summaryCells[0], this._options.summaryTexts)}`;
    }

    return result;
  }

  private _initOptions(): void {
    const exportController = this._exportController;
    const groupColumns = exportController._columnsController.getGroupColumns();
    const isSelectedRowsExport = !!this._selectedRowsOnly || exportController._selectionOnly;

    this._options = {
      columns: exportController._getColumns(this._initialColumnWidthsByColumnIndex),
      groupColumns,
      items: [],
      loadingItems: isSelectedRowsExport
        ? exportController._getSelectedItems()
        : exportController._getAllItems(),
      isHeadersVisible: exportController.option('showColumnHeaders'),
      summaryTexts: exportController.option('summary.texts') ?? {},
      rtlEnabled: exportController.option('rtlEnabled'),
    };
  }

  private getHeaderStyles(): ExportStyle[] {
    return [
      { bold: true, alignment: 'center' },
      { bold: true, alignment: 'left' },
      { bold: true, alignment: 'right' },
    ];
  }

  private getGroupRowStyle(): ExportStyle {
    return {
      bold: true,
      alignment: getDefaultAlignment(this._options.rtlEnabled),
    };
  }

  private getColumnStyles(): ExportStyle[] {
    const columnStyles: ExportStyle[] = [];

    this.getColumns().forEach((column) => {
      columnStyles.push({
        alignment: column.alignment ?? 'left',
        format: column.format,
        dataType: column.dataType,
      });
    });

    return columnStyles;
  }

  public getStyles(): ExportStyle[] {
    return [...this.getHeaderStyles(), ...this.getColumnStyles(), this.getGroupRowStyle()];
  }

  private _getTotalCellStyleId(cellIndex: number): number {
    const alignment = this.getColumns()[cellIndex]?.alignment ?? 'right';
    return this.getHeaderStyles().map((style) => style.alignment).indexOf(alignment);
  }

  public getStyleId(rowIndex: number, cellIndex: number): number {
    if (rowIndex < this.getHeaderRowCount()) {
      return 0;
    }
    if (this.isTotalCell(rowIndex - this.getHeaderRowCount(), cellIndex)) {
      return this._getTotalCellStyleId(cellIndex);
    }
    if (this.isGroupRow(rowIndex - this.getHeaderRowCount())) {
      return this.getHeaderStyles().length + this.getColumns().length;
    }
    return cellIndex + this.getHeaderStyles().length;
  }

  private getColumns(getColumnsByAllRows: true): ExportColumn[][];
  private getColumns(getColumnsByAllRows?: false): ExportColumn[];
  private getColumns(getColumnsByAllRows?: boolean): ExportColumn[] | ExportColumn[][] {
    const { columns } = this._options;

    return getColumnsByAllRows ? columns : columns[columns.length - 1];
  }

  public getColumnsWidths(): (number | string | undefined)[] | undefined {
    const columns = this.getColumns();
    return isDefined(columns)
      ? columns.map((c) => c.width)
      : undefined;
  }

  public getRowsCount(): number {
    return this._options.items.length + this.getHeaderRowCount();
  }

  public getHeaderRowCount(): number {
    if (this.isHeadersVisible()) {
      return this._options.columns.length - 1;
    }
    return 0;
  }

  private isGroupRow(rowIndex: number): boolean {
    return rowIndex < this._options.items.length && this._options.items[rowIndex].rowType === 'group';
  }

  public getGroupLevel(rowIndex: number): number {
    const item = this._options.items[rowIndex - this.getHeaderRowCount()];
    const groupIndex = item?.groupIndex;

    if (item?.rowType === 'totalFooter') {
      return 0;
    }
    return isDefined(groupIndex) ? groupIndex : this._options.groupColumns.length;
  }

  public getCellType(rowIndex: number, cellIndex: number): string | undefined {
    const columns = this.getColumns();

    if (rowIndex < this.getHeaderRowCount()) {
      return 'string';
    }
    const itemIndex = rowIndex - this.getHeaderRowCount();

    if (cellIndex < columns.length) {
      const item = this._options.items.length && this._options.items[itemIndex];
      const column = columns[cellIndex];

      if (item && item.rowType === 'data') {
        const value = item.values[cellIndex];
        if (isFinite(Number(value)) && !isDefined(column.customizeText)) {
          return isDefined(column.lookup) ? column.lookup.dataType : column.dataType;
        }
      }
      return 'string';
    }

    return undefined;
  }

  public ready(): DeferredObj<ExportItem[]> {
    this._initOptions();
    const options = this._options;

    return when(options.loadingItems).done((items) => {
      options.items = items;
    }).fail(() => {
      options.items = [];
    });
  }

  private _convertFromGridGroupSummaryItems(
    gridGroupSummaryItems: ExportSummaryItem[] | undefined,
  ): ExportGroupSummaryItem[] | undefined {
    if (isDefined(gridGroupSummaryItems) && gridGroupSummaryItems.length > 0) {
      return gridGroupSummaryItems.map((item) => ({ value: item.value, name: item.name }));
    }

    return undefined;
  }

  public getCellData(rowIndex: number, cellIndex: number, isExcelJS?: boolean): ExportCellData {
    const result: ExportCellData = { cellSourceData: {}, value: undefined };
    const columns = this.getColumns();

    if (rowIndex < this.getHeaderRowCount()) {
      const columnsRow = this.getColumns(true)[rowIndex];
      const column = columnsRow[cellIndex];
      result.cellSourceData.rowType = 'header';
      result.cellSourceData.column = column && column.gridColumn;
      result.value = column && column.caption;
      return result;
    }

    const itemIndex = rowIndex - this.getHeaderRowCount();
    const item = this._options.items.length && this._options.items[itemIndex];

    if (!item) {
      return result;
    }

    const itemValues = item.values;
    result.cellSourceData.rowType = item.rowType;
    result.cellSourceData.column = columns[cellIndex] && columns[cellIndex].gridColumn;
    switch (item.rowType) {
      case 'groupFooter':
      case 'totalFooter':
        if (cellIndex < itemValues.length) {
          const value = item.values[cellIndex];
          if (isDefined(value)) {
            result.cellSourceData.value = value.value;
            result.cellSourceData.totalSummaryItemName = value.name;
            result.value = dataGridCore.getSummaryText(value, this._options.summaryTexts);
          } else {
            result.cellSourceData.value = undefined;
          }
        }
        break;
      case 'group': {
        result.cellSourceData.groupIndex = item.groupIndex;
        if (cellIndex < 1) {
          result.cellSourceData.column = this._options.groupColumns[item.groupIndex];
          result.cellSourceData.value = item.key[item.groupIndex];
          result.cellSourceData.groupSummaryItems = this._convertFromGridGroupSummaryItems(
            item.summaryCells[0],
          );
          result.value = this._getGroupValue(item);
          break;
        }
        const summaryItems = item.values[cellIndex];
        if (!Array.isArray(summaryItems)) {
          result.cellSourceData.value = undefined;
          break;
        }
        result.cellSourceData.groupSummaryItems = this._convertFromGridGroupSummaryItems(
          summaryItems,
        );
        let summaryText = '';
        const separator = isExcelJS ? '\n' : ' \n ';
        for (let i = 0; i < summaryItems.length; i += 1) {
          summaryText += (i > 0 ? separator : '')
            + dataGridCore.getSummaryText(summaryItems[i], this._options.summaryTexts);
        }
        result.value = summaryText;
        break;
      }
      default: {
        const column = columns[cellIndex];
        if (column) {
          const value = itemValues[cellIndex];
          // from 'ui.grid_core.rows.js: _getCellOptions'
          const displayValue = dataGridCore.getDisplayValue(column, value, item.data, item.rowType);
          // similar to 'ui.grid_core.rows.js: _getCellOptions'
          const isFormatted = !isFinite(displayValue) || isDefined(column.customizeText);
          const isBooleanCustomizeText = isDefined(column.customizeText)
            && column.customizeText === this._exportController._columnsController.getCustomizeTextByDataType('boolean');

          if (isFormatted && isExcelJS && isBooleanCustomizeText) {
            result.value = displayValue;
          } else if (isFormatted) {
            result.value = dataGridCore.formatValue(displayValue, column);
          } else {
            result.value = displayValue;
          }

          result.cellSourceData.value = value;
        }
        result.cellSourceData.data = item.data;
      }
    }
    return result;
  }

  private isHeadersVisible(): boolean | undefined {
    return this._options.isHeadersVisible;
  }

  private isTotalCell(rowIndex: number, cellIndex: number): boolean | undefined {
    const { items } = this._options;
    const item = items[rowIndex];
    const isSummaryAlignByColumn = item.summaryCells
      && item.summaryCells[cellIndex]
      && item.summaryCells[cellIndex].length > 0
      && item.summaryCells[cellIndex][0].alignByColumn;

    return item?.rowType === 'groupFooter'
      || item.rowType === 'totalFooter'
      || isSummaryAlignByColumn;
  }

  public getCellMerging(
    rowIndex: number,
    cellIndex: number,
  ): { colspan: number; rowspan: number } {
    const { columns } = this._options;
    const column = columns[rowIndex]?.[cellIndex];

    return column ? {
      colspan: (column.exportColspan || 1) - 1,
      rowspan: (column.rowspan || 1) - 1,
    } : { colspan: 0, rowspan: 0 };
  }

  public getFrozenArea(): { x: number; y: number } {
    return { x: 0, y: this.getHeaderRowCount() };
  }
}

export class ExportController extends dataGridCore.ViewController {
  public _columnsController!: ColumnsController;

  private _dataController!: DataController & SummaryDataControllerExtension;

  private dataSourceController!: DataSourceController;

  private _selectionController!: SelectionController;

  private _headersView!: ColumnHeadersView;

  private _rowsView!: RowsView;

  public _selectionOnly?: boolean;

  private _isSelectedRows?: boolean;

  private readonly selectionOnlyChanged!: Callback<[]>;

  public init(): void {
    this.throwWarningIfNoOnExportingEvent();
    this._columnsController = this.getController('columns');
    // @ts-expect-error the controller assumes the summary extension of DataController
    this._dataController = this.getController('data');
    this.dataSourceController = this.getController('dataSource');
    this._selectionController = this.getController('selection');
    this._rowsView = this.getView('rowsView');
    this._headersView = this.getView('columnHeadersView');

    this.createAction('onExporting', { excludeValidators: ['disabled', 'readOnly'] });
  }

  private _getEmptyCell(): { caption: string; colspan: number; rowspan: number } {
    return {
      caption: '',
      colspan: 1,
      rowspan: 1,
    };
  }

  /**
   * @extended: adaptivity
   */
  protected _updateColumnWidth(column: ExportColumn, width: number | undefined): void {
    column.width = width;
  }

  public _getColumns(
    initialColumnWidthsByColumnIndex: ColumnWidthsByColumnIndex | undefined,
  ): ExportColumn[][] {
    let result: ExportColumn[][] = [];
    const columnsController = this._columnsController;
    const rowCount = columnsController.getRowCount();

    for (let i = 0; i <= rowCount; i += 1) {
      const currentHeaderRow: ExportColumn[] = [];
      const columns = columnsController.getVisibleColumns(i, true);
      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if below
      let columnWidthsByColumnIndex: ColumnWidthsByColumnIndex | undefined;
      if (i === rowCount) {
        if (this._updateLockCount) {
          columnWidthsByColumnIndex = initialColumnWidthsByColumnIndex;
        } else {
          const columnWidths = this._getColumnWidths(this._headersView, this._rowsView);
          // eslint-disable-next-line max-depth -- nested in the per-row loop
          if (columnWidths?.length) {
            columnWidthsByColumnIndex = {};
            // eslint-disable-next-line max-depth -- nested in the per-row loop
            for (let columnIndex = 0; columnIndex < columns.length; columnIndex += 1) {
              const { index } = columns[columnIndex];
              // eslint-disable-next-line max-depth -- nested in the per-row loop
              if (isDefined(index)) {
                columnWidthsByColumnIndex[index] = columnWidths[columnIndex];
              }
            }
          }
        }
      }

      for (const sourceColumn of columns) {
        const column: ExportColumn = extend({}, sourceColumn, {
          dataType: sourceColumn.dataType === 'datetime' ? 'date' : sourceColumn.dataType,
          gridColumn: sourceColumn,
        });

        if (this._needColumnExporting(column)) {
          const currentColspan = this._calculateExportColspan(column);
          // eslint-disable-next-line max-depth -- nested in the per-row loop
          if (isDefined(currentColspan)) {
            column.exportColspan = currentColspan;
          }
          // eslint-disable-next-line max-depth -- nested in the per-row loop
          if (columnWidthsByColumnIndex) {
            this._updateColumnWidth(
              column,
              isDefined(column.index) ? columnWidthsByColumnIndex[column.index] : undefined,
            );
          }
          currentHeaderRow.push(column);
        }
      }
      result.push(currentHeaderRow);
    }

    const lastRowColumns = result[rowCount];
    result = prepareItems(result.slice(0, -1), this._getEmptyCell());
    result.push(lastRowColumns);

    return result;
  }

  private _calculateExportColspan(column: ExportableColumn): number | undefined {
    if (!column.isBand) {
      return undefined;
    }
    const childColumns = this._columnsController.getChildrenByBandColumn(column.index, true);
    if (!isDefined(childColumns)) {
      return undefined;
    }
    return childColumns.reduce((result, childColumn) => {
      if (this._needColumnExporting(childColumn)) {
        return result + (this._calculateExportColspan(childColumn) || 1);
      }
      return result;
    }, 0);
  }

  private _needColumnExporting(column: ExportableColumn): boolean {
    return !column.command && (!!column.allowExporting || column.allowExporting === undefined);
  }

  private _getFooterSummaryItems(
    summaryCells: ExportSummaryItem[][],
    isTotal?: boolean,
  ): ExportItem[] {
    const result: ExportItem[] = [];
    let estimatedItemsCount = 1;
    let i = 0;

    do {
      const values: ExportSummaryItem[] = [];
      for (const summaryCell of summaryCells) {
        const itemsLength = summaryCell.length;
        if (estimatedItemsCount < itemsLength) {
          estimatedItemsCount = itemsLength;
        }
        values.push(summaryCell[i]);
      }
      result.push({ values, rowType: isTotal ? 'totalFooter' : 'groupFooter' });
      i += 1;
    } while (i < estimatedItemsCount);

    return result;
  }

  private _hasSummaryGroupFooters(): boolean {
    const groupItems = this.option('summary.groupItems');

    if (isDefined(groupItems)) {
      for (const groupItem of groupItems) {
        if (groupItem.showInGroupFooter) {
          return true;
        }
      }
    }

    return false;
  }

  private _getItemsWithSummaryGroupFooters(sourceItems: ExportItem[]): ExportItem[] {
    let result: ExportItem[] = [];
    let beforeGroupFooterItems: ExportItem[] = [];
    let groupFooterItems: ExportItem[] = [];

    for (const item of sourceItems) {
      if (item.rowType === 'groupFooter') {
        groupFooterItems = this._getFooterSummaryItems(item.summaryCells ?? []);
        result = result.concat(beforeGroupFooterItems, groupFooterItems);
        beforeGroupFooterItems = [];
      } else {
        beforeGroupFooterItems.push(item);
      }
    }

    return result.length ? result : beforeGroupFooterItems;
  }

  private _updateGroupValuesWithSummaryByColumn(sourceItems: ExportItem[]): void {
    let summaryValues: ExportSummaryItem[][] = [];

    for (const item of sourceItems) {
      const { summaryCells } = item;
      if (item.rowType === 'group' && summaryCells && summaryCells.length > 1) {
        const groupColumnCount = item.values.length;
        for (let j = 1; j < summaryCells.length; j += 1) {
          // eslint-disable-next-line max-depth -- nested in the per-item loop
          for (const summaryItem of summaryCells[j]) {
            // eslint-disable-next-line max-depth -- nested in the per-item loop
            if (summaryItem?.alignByColumn) {
              // eslint-disable-next-line max-depth -- nested in the per-item loop
              if (!Array.isArray(summaryValues[j - groupColumnCount])) {
                summaryValues[j - groupColumnCount] = [];
              }
              summaryValues[j - groupColumnCount].push(summaryItem);
            }
          }
        }

        if (summaryValues.length > 0) {
          item.values.push(...summaryValues);
          summaryValues = [];
        }
      }
    }
  }

  private _processUnExportedItems(items: ExportItem[]): void {
    const columns = this._columnsController.getVisibleColumns(null, true);
    const groupColumns = this._columnsController.getGroupColumns();

    for (const item of items) {
      let isCommand = false;
      const values: unknown[] = [];
      const summaryCells: ExportSummaryItem[][] = [];

      for (let j = 0; j < columns.length; j += 1) {
        const column = columns[j];
        isCommand ||= ['detailExpand', 'buttons'].includes(column.type ?? '');

        if (this._needColumnExporting(column)) {
          // eslint-disable-next-line max-depth -- nested in the per-item loop
          if (item.values) {
            // eslint-disable-next-line max-depth -- nested in the per-item loop
            if (item.rowType === 'group' && !values.length) {
              values.push(item.key[item.groupIndex]);
            } else {
              values.push(item.values[j]);
            }
          }
          // eslint-disable-next-line max-depth -- nested in the per-item loop
          if (item.summaryCells) {
            // eslint-disable-next-line max-depth -- nested in the per-item loop
            if (item.rowType === 'group' && !summaryCells.length) {
              const index = j - groupColumns.length + item.groupIndex;

              summaryCells.push(item.summaryCells[isCommand ? index : index + 1]);
            } else {
              summaryCells.push(item.summaryCells[j]);
            }
          }
        }
      }

      if (values.length) {
        item.values = values;
      }
      if (summaryCells.length) {
        item.summaryCells = summaryCells;
      }
    }
  }

  public _getAllItems(data?: unknown, skipFilter = false): DeferredObj<ExportItem[]> {
    const d = Deferred<ExportItem[]>();
    const footerItems = this._dataController.footerItems();
    const totalItem = footerItems.length && footerItems[0];
    const summaryTotalItems = this.option('summary.totalItems');

    when(data).done((loadedData) => {
      // @ts-expect-error when() passes the data on untyped
      this._dataController.loadAllItems(loadedData, skipFilter).done((items, totalAggregates) => {
        // @ts-expect-error loadAllItems() types group rows as ProcessedItem
        let sourceItems: ExportItem[] = items;
        this._updateGroupValuesWithSummaryByColumn(sourceItems);

        if (this._hasSummaryGroupFooters()) {
          sourceItems = this._getItemsWithSummaryGroupFooters(sourceItems);
        }

        let summaryCells = totalItem && totalItem.summaryCells;

        if (isDefined(totalAggregates) && summaryTotalItems) {
          summaryCells = this._getSummaryCells(summaryTotalItems, totalAggregates);
        }

        if (totalItem && summaryCells) {
          const footerSummaryItems = this._getFooterSummaryItems(summaryCells, true);
          sourceItems = sourceItems.concat(footerSummaryItems);
        }

        this._processUnExportedItems(sourceItems);
        d.resolve(sourceItems);
      // @ts-expect-error reject() is typed with the resolved value type
      }).fail((...args: unknown[]) => { d.reject(...args); });
      // @ts-expect-error reject() is typed with the resolved value type
    }).fail((...args: unknown[]) => { d.reject(...args); });

    return d;
  }

  private _getSummaryCells(
    summaryTotalItems: SummaryItem[],
    totalAggregates: unknown[],
  ): ExportSummaryItem[][] {
    return this._dataController.calculateSummaryCells({
      summaryItems: summaryTotalItems,
      aggregates: totalAggregates,
      visibleColumns: this._columnsController.getVisibleColumns(null, true),
      calculateTargetColumnIndex: (summaryItem: SummaryItem, column?: Column): number => (
        isDataColumn(column) ? (column?.index ?? -1) : -1
      ),
    });
  }

  public _getSelectedItems(): DeferredObj<ExportItem[]> {
    if (this.needLoadItemsOnExportingSelectedItems()) {
      return this._getAllItems(
        this._selectionController.loadSelectedItemsWithFilter(),
        true,
      );
    }
    return this._getAllItems(
      this._selectionController.getSelectedRowsData(),
    );
  }

  private _getColumnWidths(
    headersView: ColumnHeadersView | undefined,
    rowsView: RowsView,
  ): number[] {
    return headersView?.isVisible()
      ? headersView.getColumnWidths()
      : rowsView.getColumnWidths();
  }

  private throwWarningIfNoOnExportingEvent(): void {
    const hasOnExporting = this.component.hasActionSubscription?.('onExporting');

    if (this.option('export.enabled') && !hasOnExporting) {
      errors.log('W1024');
    }
  }

  protected callbackNames(): string[] {
    return ['selectionOnlyChanged'];
  }

  private getDataProvider(selectedRowsOnly?: boolean): DataProvider {
    const columnWidths = this._getColumnWidths(this._headersView, this._rowsView);
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if below
    let initialColumnWidthsByColumnIndex: ColumnWidthsByColumnIndex | undefined;
    if (columnWidths?.length) {
      initialColumnWidthsByColumnIndex = {};
      const columnsLastRowVisibleColumns = this._columnsController.getVisibleColumns(
        this._columnsController.getRowCount(),
        true,
      );
      for (let i = 0; i < columnsLastRowVisibleColumns.length; i += 1) {
        const columnIndex = columnsLastRowVisibleColumns[i].index;
        if (isDefined(columnIndex)) {
          initialColumnWidthsByColumnIndex[columnIndex] = columnWidths[i];
        }
      }
    }

    return new DataProvider(this, initialColumnWidthsByColumnIndex, selectedRowsOnly);
  }

  public exportTo(selectedRowsOnly: boolean, exportFormat: string): void {
    this._selectionOnly = selectedRowsOnly;

    const onExporting = this.getAction('onExporting');
    const eventArgs = {
      rtlEnabled: this.option('rtlEnabled'),
      selectedRowsOnly: !!selectedRowsOnly,
      format: exportFormat,
      fileName: 'DataGrid',
      cancel: false,
    };

    if (isFunction(onExporting)) {
      onExporting(eventArgs);
    }
  }

  public publicMethods(): string[] {
    return ['getDataProvider'];
  }

  public selectionOnly(value?: boolean): boolean | undefined {
    if (isDefined(value)) {
      this._isSelectedRows = value;
      this.selectionOnlyChanged.fire();
      return undefined;
    }
    return this._isSelectedRows;
  }

  public optionChanged(args: ExportOptionChanged): void {
    // @ts-expect-error super.optionChanged() is typed without the export option
    super.optionChanged(args);
    if (args.name === 'export') {
      this.throwWarningIfNoOnExportingEvent();
    }
  }

  private needLoadItemsOnExportingSelectedItems(): boolean {
    return this.option('loadItemsOnExportingSelectedItems')
      ?? (this.dataSourceController.remoteOperations().filtering ?? false);
  }
}

const editing = (
  Base: ModuleType<EditingController>,
): ModuleType<EditingController> => class ExportEditingControllerExtender extends Base {
  protected callbackNames(): string[] {
    const callbackList = super.callbackNames() ?? [];
    return [...callbackList, 'editingButtonsUpdated'];
  }

  protected _updateEditButtons(): void {
    super._updateEditButtons();

    // @ts-expect-error editingButtonsUpdated is added by callbackNames()
    this.editingButtonsUpdated.fire();
  }
};

const headerPanel = (
  Base: ModuleType<HeaderPanel>,
): ModuleType<HeaderPanel> => class ExportHeaderPanelExtender extends Base {
  private _exportController!: ExportController;

  protected _getToolbarItems(): ToolbarItem[] {
    const items = super._getToolbarItems();

    const exportButton = this._getExportToolbarButton();

    if (exportButton) {
      items.push(exportButton);
    }

    return items;
  }

  private _getExportToolbarButton(): ToolbarItem | null {
    const items = this._getExportToolbarItems();

    if (items.length === 0) {
      return null;
    }

    const disabled = this._needDisableExportButton();

    const toolbarButtonOptions: ToolbarItem = {
      name: DATAGRID_EXPORT_TOOLBAR_BUTTON_NAME,
      location: 'after',
      locateInMenu: 'auto',
      sortIndex: 30,
      options: { items },
      disabled,
    };

    if (items.length === 1) {
      const widgetOptions = {
        ...items[0],
        hint: items[0].text,
        elementAttr: {
          class: DATAGRID_EXPORT_BUTTON_CLASS,
        },
      };

      toolbarButtonOptions.widget = 'dxButton';
      toolbarButtonOptions.showText = 'inMenu';
      toolbarButtonOptions.options = widgetOptions;
    } else {
      const widgetOptions = {
        icon: DATAGRID_EXPORT_ICON,
        displayExpr: 'text',
        items,
        hint: this.option('export.texts.exportTo'),
        elementAttr: {
          class: DATAGRID_EXPORT_BUTTON_CLASS,
        },
        dropDownOptions: {
          width: 'auto',
          _wrapperClassExternal: DATAGRID_EXPORT_MENU_CLASS,
        },
      };

      toolbarButtonOptions.options = widgetOptions;
      toolbarButtonOptions.widget = 'dxDropDownButton';

      toolbarButtonOptions.menuItemTemplate = (_data, _index, container): void => {
        this._createComponent($(container), List, { items });
      };
    }

    return toolbarButtonOptions;
  }

  private _getExportToolbarItems(): ExportMenuItem[] {
    const exportOptions: Export = this.option('export');
    const texts: ExportTexts = this.option('export.texts');
    const formats: string[] = this.option('export.formats') ?? [];

    if (!exportOptions.enabled) {
      return [];
    }

    const items: ExportMenuItem[] = [];

    formats.forEach((formatType) => {
      let formatName = formatType.toUpperCase();
      let exportAllIcon = DATAGRID_EXPORT_ICON;
      const exportSelectedIcon = DATAGRID_EXPORT_SELECTED_ICON;

      if (formatType === 'xlsx') {
        formatName = 'Excel';
        exportAllIcon = DATAGRID_EXPORT_EXCEL_ICON;
      }

      if (formatType === 'pdf') {
        exportAllIcon = DATAGRID_PDF_EXPORT_ICON;
      }

      items.push({
        text: format(texts.exportAll, formatName),
        icon: exportAllIcon,
        onClick: () => {
          this._exportController.exportTo(false, formatType);
        },
      });

      if (exportOptions.allowExportSelectedData) {
        items.push({
          text: format(texts.exportSelectedRows, formatName),
          icon: exportSelectedIcon,
          onClick: () => {
            this._exportController.exportTo(true, formatType);
          },
        });
      }
    });

    return items;
  }

  public optionChanged(args: ExportOptionChanged): void {
    // @ts-expect-error super.optionChanged() is typed without the export option
    super.optionChanged(args);
    if (args.name === 'export') {
      args.handled = true;
      this._invalidate();
    }
  }

  private _needDisableExportButton(): boolean {
    const isDataColumnsInvisible = !this._columnsController.hasVisibleDataColumns();
    const hasUnsavedChanges = this._editingController.hasChanges();

    return isDataColumnsInvisible || hasUnsavedChanges;
  }

  protected _columnOptionChanged(e: ColumnsChanges): void {
    super._columnOptionChanged(e);

    const isColumnLocationChanged = dataGridCore.checkChanges(e.optionNames, ['groupIndex', 'visible', 'all']);

    if (isColumnLocationChanged) {
      const disabled = this._needDisableExportButton();

      this.setToolbarItemDisabled('exportButton', disabled);
    }
  }

  public init(): void {
    super.init();

    this._exportController = this.getController('export');

    // @ts-expect-error editingButtonsUpdated is added by the export editing extender
    this._editingController.editingButtonsUpdated.add(() => {
      const disabled = this._needDisableExportButton();

      this.setToolbarItemDisabled('exportButton', disabled);
    });
  }
};

dataGridCore.registerModule('export', {
  defaultOptions() {
    return {
      export: {
        enabled: false,
        fileName: 'DataGrid',
        formats: ['xlsx'],
        allowExportSelectedData: false,
        texts: {
          exportTo: messageLocalization.format('dxDataGrid-exportTo'),
          exportAll: messageLocalization.format('dxDataGrid-exportAll'),
          exportSelectedRows: messageLocalization.format('dxDataGrid-exportSelectedRows'),
        },
      },
    };
  },
  controllers: {
    export: ExportController,
  },
  extenders: {
    controllers: {
      editing,
    },
    views: {
      headerPanel,
    },
  },
});
