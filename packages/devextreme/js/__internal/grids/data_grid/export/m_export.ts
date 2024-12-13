/* eslint-disable max-classes-per-file */
import '@js/ui/button';
import '@js/ui/drop_down_button';

import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getDefaultAlignment } from '@js/core/utils/position';
import { format } from '@js/core/utils/string';
import { isDefined, isFunction } from '@js/core/utils/type';
import List from '@js/ui/list_light';
import errors from '@js/ui/widget/ui.errors';
import { prepareItems } from '@ts/grids/grid_core/m_export';

import type { ColumnHeadersView } from '../../grid_core/column_headers/m_column_headers';
import type { ColumnsController } from '../../grid_core/columns_controller/m_columns_controller';
import type { DataController } from '../../grid_core/data_controller/m_data_controller';
import type { EditingController } from '../../grid_core/editing/m_editing';
import type { HeaderPanel } from '../../grid_core/header_panel/m_header_panel';
import type { ModuleType } from '../../grid_core/m_types';
import type { SelectionController } from '../../grid_core/selection/m_selection';
import type { RowsView } from '../../grid_core/views/m_rows_view';
import dataGridCore from '../m_core';

const DATAGRID_EXPORT_MENU_CLASS = 'dx-datagrid-export-menu';
const DATAGRID_EXPORT_BUTTON_CLASS = 'dx-datagrid-export-button';
const DATAGRID_EXPORT_TOOLBAR_BUTTON_NAME = 'exportButton';
const DATAGRID_EXPORT_ICON = 'export';
const DATAGRID_EXPORT_EXCEL_ICON = 'xlsxfile';
const DATAGRID_EXPORT_SELECTED_ICON = 'exportselected';

const DATAGRID_PDF_EXPORT_ICON = 'pdffile';

export class DataProvider {
  private readonly _exportController: ExportController;

  private readonly _initialColumnWidthsByColumnIndex: any;

  private readonly _selectedRowsOnly: any;

  private _options!: {
    isHeadersVisible: boolean | undefined;
    rtlEnabled: boolean | undefined;
    summaryTexts: any;
    groupColumns: any;
    items: any;
    columns: any;
  };

  constructor(exportController, initialColumnWidthsByColumnIndex, selectedRowsOnly) {
    this._exportController = exportController;
    this._initialColumnWidthsByColumnIndex = initialColumnWidthsByColumnIndex;
    this._selectedRowsOnly = selectedRowsOnly;
  }

  private _getGroupValue(item) {
    const {
      key, data, rowType, groupIndex, summaryCells,
    } = item;
    const groupColumn = this._options.groupColumns[groupIndex];

    const value = dataGridCore.getDisplayValue(groupColumn, groupColumn.deserializeValue ? groupColumn.deserializeValue(key[groupIndex]) : key[groupIndex], data, rowType);

    let result = `${groupColumn.caption}: ${dataGridCore.formatValue(value, groupColumn)}`;

    if (summaryCells && summaryCells[0] && summaryCells[0].length) {
      result += ` ${dataGridCore.getGroupRowSummaryText(summaryCells[0], this._options.summaryTexts)}`;
    }

    return result;
  }

  private _correctCellIndex(cellIndex) {
    return cellIndex;
  }

  private _initOptions() {
    const exportController = this._exportController;
    const groupColumns = exportController._columnsController.getGroupColumns();

    this._options = {
      columns: exportController._getColumns(this._initialColumnWidthsByColumnIndex),
      groupColumns,
      items: this._selectedRowsOnly || exportController._selectionOnly ? exportController._getSelectedItems() : exportController._getAllItems(),
      isHeadersVisible: exportController.option('showColumnHeaders'),
      summaryTexts: exportController.option('summary.texts'),
      rtlEnabled: exportController.option('rtlEnabled'),
    };
  }

  private getHeaderStyles() {
    return [
      { bold: true, alignment: 'center' },
      { bold: true, alignment: 'left' },
      { bold: true, alignment: 'right' },
    ];
  }

  private getGroupRowStyle() {
    return {
      bold: true,
      alignment: getDefaultAlignment(this._options.rtlEnabled),
    };
  }

  private getColumnStyles() {
    const columnStyles: any[] = [];

    this.getColumns().forEach((column) => {
      columnStyles.push({
        alignment: column.alignment || 'left',
        format: column.format,
        dataType: column.dataType,
      });
    });

    return columnStyles;
  }

  private getStyles() {
    return [...this.getHeaderStyles(), ...this.getColumnStyles(), this.getGroupRowStyle()];
  }

  private _getTotalCellStyleId(cellIndex) {
    const alignment = this.getColumns()[cellIndex]?.alignment || 'right';
    return this.getHeaderStyles().map((style) => style.alignment).indexOf(alignment);
  }

  private getStyleId(rowIndex, cellIndex) {
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

  private getColumns(getColumnsByAllRows?) {
    const { columns } = this._options;

    return getColumnsByAllRows ? columns : columns[columns.length - 1];
  }

  private getColumnsWidths() {
    const columns = this.getColumns();
    return isDefined(columns)
      ? columns.map((c) => c.width)
      : undefined;
  }

  private getRowsCount() {
    return this._options.items.length + this.getHeaderRowCount();
  }

  private getHeaderRowCount() {
    if (this.isHeadersVisible()) {
      return this._options.columns.length - 1;
    }
    return 0;
  }

  private isGroupRow(rowIndex) {
    return rowIndex < this._options.items.length && this._options.items[rowIndex].rowType === 'group';
  }

  private getGroupLevel(rowIndex) {
    const item = this._options.items[rowIndex - this.getHeaderRowCount()];
    const groupIndex = item && item.groupIndex;

    if (item && item.rowType === 'totalFooter') {
      return 0;
    }
    return isDefined(groupIndex) ? groupIndex : this._options.groupColumns.length;
  }

  private getCellType(rowIndex, cellIndex) {
    const columns = this.getColumns();

    if (rowIndex < this.getHeaderRowCount()) {
      return 'string';
    }
    rowIndex -= this.getHeaderRowCount();

    if (cellIndex < columns.length) {
      const item = this._options.items.length && this._options.items[rowIndex];
      const column = columns[cellIndex];

      if (item && item.rowType === 'data') {
        if (isFinite(item.values[this._correctCellIndex(cellIndex)]) && !isDefined(column.customizeText)) {
          return isDefined(column.lookup) ? column.lookup.dataType : column.dataType;
        }
      }
      return 'string';
    }
  }

  private ready() {
    const that = this;

    that._initOptions();
    const options = that._options;

    return when(options.items).done((items) => {
      options.items = items;
    }).fail(() => {
      options.items = [];
    });
  }

  private _convertFromGridGroupSummaryItems(gridGroupSummaryItems) {
    if (isDefined(gridGroupSummaryItems) && gridGroupSummaryItems.length > 0) {
      return gridGroupSummaryItems.map((item) => ({ value: item.value, name: item.name }));
    }
  }

  private getCellData(rowIndex, cellIndex, isExcelJS) {
    let value;
    let column;

    const result: any = { cellSourceData: {}, value };
    const columns = this.getColumns();
    const correctedCellIndex = this._correctCellIndex(cellIndex);

    if (rowIndex < this.getHeaderRowCount()) {
      const columnsRow = this.getColumns(true)[rowIndex];
      column = columnsRow[cellIndex];
      result.cellSourceData.rowType = 'header';
      result.cellSourceData.column = column && column.gridColumn;
      result.value = column && column.caption;
    } else {
      rowIndex -= this.getHeaderRowCount();

      const item = this._options.items.length && this._options.items[rowIndex];

      if (item) {
        const itemValues = item.values;
        result.cellSourceData.rowType = item.rowType;
        result.cellSourceData.column = columns[cellIndex] && columns[cellIndex].gridColumn;
        switch (item.rowType) {
          case 'groupFooter':
          case 'totalFooter':
            if (correctedCellIndex < itemValues.length) {
              value = itemValues[correctedCellIndex];
              if (isDefined(value)) {
                result.cellSourceData.value = value.value;
                result.cellSourceData.totalSummaryItemName = value.name;
                result.value = dataGridCore.getSummaryText(value, this._options.summaryTexts);
              } else {
                result.cellSourceData.value = undefined;
              }
            }
            break;
          case 'group':
            result.cellSourceData.groupIndex = item.groupIndex;
            if (cellIndex < 1) {
              result.cellSourceData.column = this._options.groupColumns[item.groupIndex];
              result.cellSourceData.value = item.key[item.groupIndex];
              result.cellSourceData.groupSummaryItems = this._convertFromGridGroupSummaryItems(item.summaryCells[0]);
              result.value = this._getGroupValue(item);
            } else {
              const summaryItems = item.values[correctedCellIndex];
              if (Array.isArray(summaryItems)) {
                result.cellSourceData.groupSummaryItems = this._convertFromGridGroupSummaryItems(summaryItems);
                value = '';
                for (let i = 0; i < summaryItems.length; i++) {
                  value += (i > 0 ? isExcelJS ? '\n' : ' \n ' : '') + dataGridCore.getSummaryText(summaryItems[i], this._options.summaryTexts);
                }
                result.value = value;
              } else {
                result.cellSourceData.value = undefined;
              }
            }
            break;
          default:
            column = columns[cellIndex];
            if (column) {
              const value = itemValues[correctedCellIndex];
              const displayValue = dataGridCore.getDisplayValue(column, value, item.data, item.rowType); // from 'ui.grid_core.rows.js: _getCellOptions'

              if (!isFinite(displayValue) || isDefined(column.customizeText)) { // similar to 'ui.grid_core.rows.js: _getCellOptions'
                if (isExcelJS && isDefined(column.customizeText) && column.customizeText === this._exportController._columnsController.getCustomizeTextByDataType('boolean')) {
                  result.value = displayValue;
                } else {
                  result.value = dataGridCore.formatValue(displayValue, column);
                }
              } else {
                result.value = displayValue;
              }

              result.cellSourceData.value = value;
            }
            result.cellSourceData.data = item.data;
        }
      }
    }
    return result;
  }

  private isHeadersVisible() {
    return this._options.isHeadersVisible;
  }

  private isTotalCell(rowIndex, cellIndex) {
    const { items } = this._options;
    const item = items[rowIndex];
    const correctCellIndex = this._correctCellIndex(cellIndex);
    const isSummaryAlignByColumn = item.summaryCells && item.summaryCells[correctCellIndex] && item.summaryCells[correctCellIndex].length > 0 && item.summaryCells[correctCellIndex][0].alignByColumn;

    return item && item.rowType === 'groupFooter' || item.rowType === 'totalFooter' || isSummaryAlignByColumn;
  }

  private getCellMerging(rowIndex, cellIndex) {
    const { columns } = this._options;
    const column = columns[rowIndex] && columns[rowIndex][cellIndex];

    return column ? {
      colspan: (column.exportColspan || 1) - 1,
      rowspan: (column.rowspan || 1) - 1,
    } : { colspan: 0, rowspan: 0 };
  }

  private getFrozenArea() {
    const that = this;

    return { x: 0, y: that.getHeaderRowCount() };
  }
}

export class ExportController extends dataGridCore.ViewController {
  public _columnsController!: ColumnsController;

  private _dataController!: DataController;

  private _selectionController!: SelectionController;

  private _headersView!: ColumnHeadersView;

  private _rowsView!: RowsView;

  public _selectionOnly: any;

  private _isSelectedRows: any;

  private readonly selectionOnlyChanged: any;

  public init() {
    this.throwWarningIfNoOnExportingEvent();
    this._columnsController = this.getController('columns');
    this._dataController = this.getController('data');
    this._selectionController = this.getController('selection');
    this._rowsView = this.getView('rowsView');
    this._headersView = this.getView('columnHeadersView');

    this.createAction('onExporting', { excludeValidators: ['disabled', 'readOnly'] });
  }

  private _getEmptyCell() {
    return {
      caption: '',
      colspan: 1,
      rowspan: 1,
    };
  }

  /**
   * @extended: adaptivity
   */
  protected _updateColumnWidth(column, width): void {
    column.width = width;
  }

  public _getColumns(initialColumnWidthsByColumnIndex) {
    let result: any[] = [];
    let i;
    let columns;
    const columnsController = this._columnsController;
    const rowCount = columnsController.getRowCount();

    for (i = 0; i <= rowCount; i++) {
      const currentHeaderRow: any[] = [];
      columns = columnsController.getVisibleColumns(i, true);
      let columnWidthsByColumnIndex;
      if (i === rowCount) {
        if (this._updateLockCount) {
          columnWidthsByColumnIndex = initialColumnWidthsByColumnIndex;
        } else {
          const columnWidths = this._getColumnWidths(this._headersView, this._rowsView);
          if (columnWidths && columnWidths.length) {
            columnWidthsByColumnIndex = {};
            for (let i = 0; i < columns.length; i++) {
              columnWidthsByColumnIndex[columns[i].index] = columnWidths[i];
            }
          }
        }
      }
      for (let j = 0; j < columns.length; j++) {
        const column = extend({}, columns[j], {
          dataType: columns[j].dataType === 'datetime' ? 'date' : columns[j].dataType,
          gridColumn: columns[j],
        });

        if (this._needColumnExporting(column)) {
          const currentColspan = this._calculateExportColspan(column);
          if (isDefined(currentColspan)) {
            column.exportColspan = currentColspan;
          }
          if (columnWidthsByColumnIndex) {
            this._updateColumnWidth(column, columnWidthsByColumnIndex[column.index]);
          }
          currentHeaderRow.push(column);
        }
      }
      result.push(currentHeaderRow);
    }

    columns = result[rowCount];
    result = prepareItems(result.slice(0, -1), this._getEmptyCell());
    result.push(columns);

    return result;
  }

  private _calculateExportColspan(column) {
    if (!column.isBand) {
      return;
    }
    const childColumns = this._columnsController.getChildrenByBandColumn(column.index, true);
    if (!isDefined(childColumns)) {
      return;
    }
    return childColumns.reduce((result, childColumn) => {
      if (this._needColumnExporting(childColumn)) {
        return result + (this._calculateExportColspan(childColumn) || 1);
      }
      return result;
    }, 0);
  }

  private _needColumnExporting(column) {
    return !column.command && (column.allowExporting || column.allowExporting === undefined);
  }

  private _getFooterSummaryItems(summaryCells, isTotal?) {
    const result: any[] = [];
    let estimatedItemsCount = 1;
    let i = 0;

    do {
      const values: any[] = [];
      for (let j = 0; j < summaryCells.length; j++) {
        const summaryCell = summaryCells[j];
        const itemsLength = summaryCell.length;
        if (estimatedItemsCount < itemsLength) {
          estimatedItemsCount = itemsLength;
        }
        values.push(summaryCell[i]);
      }
      result.push({ values, rowType: isTotal ? 'totalFooter' : 'groupFooter' });
    } while (i++ < estimatedItemsCount - 1);

    return result;
  }

  private _hasSummaryGroupFooters() {
    const groupItems: any = this.option('summary.groupItems');

    if (isDefined(groupItems)) {
      for (let i = 0; i < groupItems.length; i++) {
        if (groupItems[i].showInGroupFooter) {
          return true;
        }
      }
    }

    return false;
  }

  private _getItemsWithSummaryGroupFooters(sourceItems) {
    let result: any[] = [];
    let beforeGroupFooterItems: any[] = [];
    let groupFooterItems: any[] = [];

    for (let i = 0; i < sourceItems.length; i++) {
      const item = sourceItems[i];
      if (item.rowType === 'groupFooter') {
        groupFooterItems = this._getFooterSummaryItems(item.summaryCells);
        result = result.concat(beforeGroupFooterItems, groupFooterItems);
        beforeGroupFooterItems = [];
      } else {
        beforeGroupFooterItems.push(item);
      }
    }

    return result.length ? result : beforeGroupFooterItems;
  }

  private _updateGroupValuesWithSummaryByColumn(sourceItems) {
    let summaryValues: any[] = [];

    for (let i = 0; i < sourceItems.length; i++) {
      const item = sourceItems[i];
      const { summaryCells } = item;
      if (item.rowType === 'group' && summaryCells && summaryCells.length > 1) {
        const groupColumnCount = item.values.length;
        for (let j = 1; j < summaryCells.length; j++) {
          for (let k = 0; k < summaryCells[j].length; k++) {
            const summaryItem = summaryCells[j][k];
            if (summaryItem && summaryItem.alignByColumn) {
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

  private _processUnExportedItems(items) {
    const columns = this._columnsController.getVisibleColumns(null, true);
    const groupColumns = this._columnsController.getGroupColumns();
    let values;
    let summaryCells;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let isCommand = false;
      values = [];
      summaryCells = [];

      for (let j = 0; j < columns.length; j++) {
        const column = columns[j];
        isCommand ||= ['detailExpand', 'buttons'].includes(column.type);

        if (this._needColumnExporting(column)) {
          if (item.values) {
            if (item.rowType === 'group' && !values.length) {
              values.push(item.key[item.groupIndex]);
            } else {
              values.push(item.values[j]);
            }
          }
          if (item.summaryCells) {
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

  public _getAllItems(data?, skipFilter = false) {
    const that = this;
    // @ts-expect-error
    const d = new Deferred();
    // @ts-expect-error
    const footerItems = this._dataController.footerItems();
    const totalItem = footerItems.length && footerItems[0];
    const summaryTotalItems = that.option('summary.totalItems');
    let summaryCells;

    when(data).done((data) => {
      this._dataController.loadAll(data, skipFilter).done((sourceItems, totalAggregates) => {
        that._updateGroupValuesWithSummaryByColumn(sourceItems);

        if (that._hasSummaryGroupFooters()) {
          sourceItems = that._getItemsWithSummaryGroupFooters(sourceItems);
        }

        summaryCells = totalItem && totalItem.summaryCells;

        if (isDefined(totalAggregates) && summaryTotalItems) {
          summaryCells = that._getSummaryCells(summaryTotalItems, totalAggregates);
        }

        const summaryItems = totalItem && that._getFooterSummaryItems(summaryCells, true);
        if (summaryItems) {
          sourceItems = sourceItems.concat(summaryItems);
        }

        that._processUnExportedItems(sourceItems);
        d.resolve(sourceItems);
      }).fail(d.reject);
    }).fail(d.reject);

    return d;
  }

  private _getSummaryCells(summaryTotalItems, totalAggregates) {
    // @ts-expect-error
    return this._dataController._calculateSummaryCells(
      summaryTotalItems,
      totalAggregates,
      this._columnsController.getVisibleColumns(null, true),
      // @ts-expect-error
      (summaryItem, column) => (this._dataController._isDataColumn(column) ? column.index : -1),
    );
  }

  public _getSelectedItems() {
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

  private _getColumnWidths(headersView, rowsView) {
    return headersView && headersView.isVisible() ? headersView.getColumnWidths() : rowsView.getColumnWidths();
  }

  private throwWarningIfNoOnExportingEvent(): void {
    const hasOnExporting = (this.component as any).hasActionSubscription?.('onExporting');

    if (this.option('export.enabled') && !hasOnExporting) {
      errors.log('W1024');
    }
  }

  protected callbackNames() {
    return ['selectionOnlyChanged'];
  }

  private getDataProvider(selectedRowsOnly) {
    const columnWidths = this._getColumnWidths(this._headersView, this._rowsView);
    let initialColumnWidthsByColumnIndex;
    if (columnWidths && columnWidths.length) {
      initialColumnWidthsByColumnIndex = {};
      const columnsLastRowVisibleColumns = this._columnsController.getVisibleColumns(this._columnsController.getRowCount(), true);
      for (let i = 0; i < columnsLastRowVisibleColumns.length; i++) {
        initialColumnWidthsByColumnIndex[columnsLastRowVisibleColumns[i].index] = columnWidths[i];
      }
    }

    return new DataProvider(this, initialColumnWidthsByColumnIndex, selectedRowsOnly);
  }

  public exportTo(selectedRowsOnly, format) {
    this._selectionOnly = selectedRowsOnly;

    const onExporting = this.getAction('onExporting');
    const eventArgs = {
      rtlEnabled: this.option('rtlEnabled'),
      selectedRowsOnly: !!selectedRowsOnly,
      format,
      fileName: 'DataGrid',
      cancel: false,
    };

    isFunction(onExporting) && onExporting(eventArgs);
  }

  public publicMethods() {
    return ['getDataProvider'];
  }

  public selectionOnly(value) {
    if (isDefined(value)) {
      this._isSelectedRows = value;
      this.selectionOnlyChanged.fire();
    } else {
      return this._isSelectedRows;
    }
  }

  public optionChanged(args) {
    super.optionChanged(args);
    if (args.name === 'export') {
      this.throwWarningIfNoOnExportingEvent();
    }
  }

  private needLoadItemsOnExportingSelectedItems(): boolean {
    return this.option('loadItemsOnExportingSelectedItems')
      ?? this._dataController._dataSource.remoteOperations().filtering;
  }
}

const editing = (Base: ModuleType<EditingController>) => class ExportEditingControllerExtender extends Base {
  // @ts-expect-error
  private callbackNames() {
    const callbackList = super.callbackNames();

    return isDefined(callbackList) ? callbackList.push('editingButtonsUpdated') : ['editingButtonsUpdated'];
  }

  protected _updateEditButtons() {
    super._updateEditButtons();

    // @ts-expect-error
    this.editingButtonsUpdated.fire();
  }
};

const headerPanel = (Base: ModuleType<HeaderPanel>) => class ExportHeaderPanelExtender extends Base {
  private _exportController!: ExportController;

  protected _getToolbarItems() {
    const items = super._getToolbarItems();

    const exportButton = this._getExportToolbarButton();

    if (exportButton) {
      items.push(exportButton);
      this._correctItemsPosition(items);
    }

    return items;
  }

  private _getExportToolbarButton() {
    const items = this._getExportToolbarItems();

    if (items.length === 0) {
      return null;
    }

    const disabled = this._needDisableExportButton();

    const toolbarButtonOptions: any = {
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

      toolbarButtonOptions.menuItemTemplate = (_data, _index, container) => {
        this._createComponent($(container), List, { items });
      };
    }

    return toolbarButtonOptions;
  }

  private _getExportToolbarItems() {
    const exportOptions: any = this.option('export');
    const texts: any = this.option('export.texts');
    const formats: any[] = this.option('export.formats') ?? [];

    if (!exportOptions.enabled) {
      return [];
    }

    const items: any[] = [];

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

  private _correctItemsPosition(items) {
    items.sort((itemA, itemB) => itemA.sortIndex - itemB.sortIndex);
  }

  private _isExportButtonVisible() {
    return this.option('export.enabled');
  }

  public optionChanged(args) {
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

  protected _columnOptionChanged(e?) {
    // @ts-expect-error
    super._columnOptionChanged(e);

    const isColumnLocationChanged = dataGridCore.checkChanges(e.optionNames, ['groupIndex', 'visible', 'all']);

    if (isColumnLocationChanged) {
      const disabled = this._needDisableExportButton();

      this.setToolbarItemDisabled('exportButton', disabled);
    }
  }

  public init() {
    super.init();

    this._exportController = this.getController('export');

    // @ts-expect-error
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
