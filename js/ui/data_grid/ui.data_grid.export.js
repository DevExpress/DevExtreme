import $ from '../../core/renderer';
import Class from '../../core/class';
import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { getDefaultAlignment } from '../../core/utils/position';
import arrayUtils from '../../core/utils/array';
import dataGridCore from './ui.data_grid.core';
import exportMixin from '../grid_core/ui.grid_core.export_mixin';
import { export as clientExport, excel } from '../../exporter';
import messageLocalization from '../../localization/message';
import Button from '../button';
import List from '../list';
import ContextMenu from '../context_menu';
import { when, Deferred } from '../../core/utils/deferred';

const DATAGRID_EXPORT_MENU_CLASS = 'dx-datagrid-export-menu';
const DATAGRID_EXPORT_BUTTON_CLASS = 'dx-datagrid-export-button';
const DATAGRID_EXPORT_ICON = 'export-to';
const DATAGRID_EXPORT_EXCEL_ICON = 'xlsxfile';
const DATAGRID_EXPORT_SELECTED_ICON = 'exportselected';
const DATAGRID_EXPORT_EXCEL_BUTTON_ICON = 'export-excel-button';

const TOOLBAR_ITEM_AUTO_HIDE_CLASS = 'dx-toolbar-item-auto-hide';
const TOOLBAR_HIDDEN_BUTTON_CLASS = 'dx-toolbar-hidden-button';

const BUTTON_CLASS = 'dx-button';

const DATA_STYLE_OFFSET = 3;

exports.DataProvider = Class.inherit({
    _getGroupValue: function(item) {
        const groupColumn = this._options.groupColumns[item.groupIndex];
        const value = dataGridCore.getDisplayValue(groupColumn, item.key[item.groupIndex], item.data, item.rowType);
        let result = groupColumn.caption + ': ' + dataGridCore.formatValue(value, groupColumn);

        const summaryCells = item.summaryCells;
        if(summaryCells && summaryCells[0] && summaryCells[0].length) {
            result += ' ' + dataGridCore.getGroupRowSummaryText(summaryCells[0], this._options.summaryTexts);
        }

        return result;
    },

    _correctCellIndex: function(cellIndex) {
        return cellIndex;
    },

    _initOptions: function() {
        const exportController = this._exportController;
        const groupColumns = exportController._columnsController.getGroupColumns();
        const excelWrapTextEnabled = exportController.option('export.excelWrapTextEnabled');
        this._options = {
            columns: exportController._getColumns(this._initialColumnWidthsByColumnIndex),
            groupColumns: groupColumns,
            items: this._selectedRowsOnly || exportController._selectionOnly ? exportController._getSelectedItems() : exportController._getAllItems(),
            getVisibleIndex: exportController._columnsController.getVisibleIndex.bind(exportController._columnsController),
            isHeadersVisible: exportController.option('showColumnHeaders'),
            summaryTexts: exportController.option('summary.texts'),
            customizeExportData: exportController.option('customizeExportData'),
            rtlEnabled: exportController.option('rtlEnabled'),
            wrapTextEnabled: isDefined(excelWrapTextEnabled) ? excelWrapTextEnabled : !!exportController.option('wordWrapEnabled'),
            customizeExcelCell: exportController.option('export.customizeExcelCell'),
        };
    },

    hasCustomizeExcelCell: function() {
        return isDefined(this._options.customizeExcelCell);
    },

    customizeExcelCell: function(e, cellSourceData) {
        if(this._options.customizeExcelCell) {
            e.gridCell = cellSourceData;
            if(isDefined(this._exportController) && isDefined(this._exportController.component)) {
                e.component = this._exportController.component;
            }
            this._options.customizeExcelCell(e);
        }
    },

    ctor: function(exportController, initialColumnWidthsByColumnIndex, selectedRowsOnly) {
        this._exportController = exportController;
        this._initialColumnWidthsByColumnIndex = initialColumnWidthsByColumnIndex;
        this._selectedRowsOnly = selectedRowsOnly;
    },

    getStyles: function() {
        const wrapTextEnabled = this._options.wrapTextEnabled;
        const styles = ['center', 'left', 'right'].map(function(alignment) {
            return {
                // Header, Total styles
                bold: true,
                alignment: alignment,
                wrapText: true
            };
        });

        this.getColumns().forEach(function(column) {
            styles.push({
                // column styles
                alignment: column.alignment || 'left',
                format: column.format,
                wrapText: wrapTextEnabled,
                dataType: column.dataType
            });
        });

        styles.push({
            // Group row style
            bold: true,
            wrapText: false,
            alignment: getDefaultAlignment(this._options.rtlEnabled)
        });

        return styles;
    },

    _getTotalCellStyleId: function(cellIndex) {
        const alignment = this.getColumns()[cellIndex] && this.getColumns()[cellIndex].alignment || 'right';
        return ['center', 'left', 'right'].indexOf(alignment);
    },

    getStyleId: function(rowIndex, cellIndex) {
        if(rowIndex < this.getHeaderRowCount()) {
            return 0;
        } else if(this.isTotalCell(rowIndex - this.getHeaderRowCount(), cellIndex)) {
            return this._getTotalCellStyleId(cellIndex);
        } else if(this.isGroupRow(rowIndex - this.getHeaderRowCount())) {
            return DATA_STYLE_OFFSET + this.getColumns().length;
        } else {
            return cellIndex + DATA_STYLE_OFFSET;// header style offset
        }
    },

    getColumns: function(getColumnsByAllRows) {
        const columns = this._options.columns;

        return getColumnsByAllRows ? columns : columns[columns.length - 1];
    },

    getRowsCount: function() {
        return this._options.items.length + this.getHeaderRowCount();
    },

    getHeaderRowCount: function() {
        if(this.isHeadersVisible()) {
            return this._options.columns.length - 1;
        }
        return 0;
    },

    isGroupRow: function(rowIndex) {
        return rowIndex < this._options.items.length && this._options.items[rowIndex].rowType === 'group';
    },

    getGroupLevel: function(rowIndex) {
        const item = this._options.items[rowIndex - this.getHeaderRowCount()];
        const groupIndex = item && item.groupIndex;

        if(item && item.rowType === 'totalFooter') {
            return 0;
        }
        return isDefined(groupIndex) ? groupIndex : this._options.groupColumns.length;
    },

    getCellType: function(rowIndex, cellIndex) {
        const columns = this.getColumns();

        if(rowIndex < this.getHeaderRowCount()) {
            return 'string';
        } else {
            rowIndex -= this.getHeaderRowCount();
        }

        if(cellIndex < columns.length) {
            const item = this._options.items.length && this._options.items[rowIndex];
            const column = columns[cellIndex];

            if(item && item.rowType === 'data') {
                if(isFinite(item.values[this._correctCellIndex(cellIndex)]) && !isDefined(column.customizeText)) {
                    return isDefined(column.lookup) ? column.lookup.dataType : column.dataType;
                }
            }
            return 'string';
        }
    },

    ready: function() {
        const that = this;
        let options;

        that._initOptions();
        options = this._options;

        return when(options.items).done(function(items) {
            options.customizeExportData && options.customizeExportData(that.getColumns(that.getHeaderRowCount() > 1), items);
            options.items = items;
        }).fail(function() {
            options.items = [];
        });
    },

    _convertFromGridGroupSummaryItems: function(gridGroupSummaryItems) {
        let result;
        if(isDefined(gridGroupSummaryItems) && gridGroupSummaryItems.length > 0) {
            result = gridGroupSummaryItems.map(function(item) { return { value: item.value, name: item.name }; });
        }
        return result;
    },

    getCellData: function(rowIndex, cellIndex, isExcelJS) {
        const result = { cellSourceData: {}, value };
        let column;
        let value;
        let i;
        let summaryItems;
        const columns = this.getColumns();
        const correctedCellIndex = this._correctCellIndex(cellIndex);
        let itemValues;
        let item;

        if(rowIndex < this.getHeaderRowCount()) {
            const columnsRow = this.getColumns(true)[rowIndex];
            column = columnsRow[cellIndex];
            result.cellSourceData.rowType = 'header';
            result.cellSourceData.column = column && column.gridColumn;
            result.value = column && column.caption;
        } else {
            rowIndex -= this.getHeaderRowCount();

            item = this._options.items.length && this._options.items[rowIndex];

            if(item) {
                itemValues = item.values;
                result.cellSourceData.rowType = item.rowType;
                result.cellSourceData.column = columns[cellIndex] && columns[cellIndex].gridColumn;
                switch(item.rowType) {
                    case 'groupFooter':
                    case 'totalFooter':
                        if(correctedCellIndex < itemValues.length) {
                            value = itemValues[correctedCellIndex];
                            if(isDefined(value)) {
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
                        if(cellIndex < 1) {
                            result.cellSourceData.column = this._options.groupColumns[item.groupIndex];
                            result.cellSourceData.value = item.key[item.groupIndex];
                            result.cellSourceData.groupSummaryItems = this._convertFromGridGroupSummaryItems(item.summaryCells[0]);
                            result.value = this._getGroupValue(item);
                        } else {
                            summaryItems = item.values[correctedCellIndex];
                            if(Array.isArray(summaryItems)) {
                                result.cellSourceData.groupSummaryItems = this._convertFromGridGroupSummaryItems(summaryItems);
                                value = '';
                                for(i = 0; i < summaryItems.length; i++) {
                                    value += (i > 0 ? (isExcelJS ? '\n' : ' \n ') : '') + dataGridCore.getSummaryText(summaryItems[i], this._options.summaryTexts);
                                }
                                result.value = value;
                            } else {
                                result.cellSourceData.value = undefined;
                            }
                        }
                        break;
                    default:
                        column = columns[cellIndex];
                        if(column) {
                            const value = itemValues[correctedCellIndex];
                            const displayValue = dataGridCore.getDisplayValue(column, value, item.data, item.rowType); // from 'ui.grid_core.rows.js: _getCellOptions'
                            result.value = !isFinite(displayValue) || column.customizeText ? dataGridCore.formatValue(displayValue, column) : displayValue; // similar to 'ui.grid_core.rows.js: _getCellOptions'
                            result.cellSourceData.value = value;
                        }
                        result.cellSourceData.data = item.data;
                }
            }
        }
        return result;
    },

    isHeadersVisible: function() {
        return this._options.isHeadersVisible;
    },

    isTotalCell: function(rowIndex, cellIndex) {
        const items = this._options.items;
        const item = items[rowIndex];
        const correctCellIndex = this._correctCellIndex(cellIndex);
        const isSummaryAlignByColumn = item.summaryCells && item.summaryCells[correctCellIndex] && item.summaryCells[correctCellIndex].length > 0 && item.summaryCells[correctCellIndex][0].alignByColumn;

        return item && item.rowType === 'groupFooter' || item.rowType === 'totalFooter' || isSummaryAlignByColumn;
    },

    getCellMerging: function(rowIndex, cellIndex) {
        const columns = this._options.columns;
        const column = columns[rowIndex] && columns[rowIndex][cellIndex];

        return column ? {
            colspan: (column.exportColspan || 1) - 1,
            rowspan: (column.rowspan || 1) - 1
        } : { colspan: 0, rowspan: 0 };
    },

    getFrozenArea: function() {
        const that = this;

        return { x: 0, y: that.getHeaderRowCount() };
    }
});

exports.ExportController = dataGridCore.ViewController.inherit({}).include(exportMixin).inherit({
    _getEmptyCell: function() {
        return {
            caption: '',
            colspan: 1,
            rowspan: 1
        };
    },

    _updateColumnWidth: function(column, width) { // this function is overridden in 'ui.grid_core.adaptivity.js'
        column.width = width;
    },

    _getColumns: function(initialColumnWidthsByColumnIndex) {
        let result = [];
        let i;
        let j;
        let column;
        let columns;
        const columnsController = this._columnsController;
        const rowCount = columnsController.getRowCount();
        let currentHeaderRow;
        let currentColspan;

        for(i = 0; i <= rowCount; i++) {
            currentHeaderRow = [];
            columns = columnsController.getVisibleColumns(i, true);
            let columnWidthsByColumnIndex;
            if(i === rowCount) {
                if(this._updateLockCount) {
                    columnWidthsByColumnIndex = initialColumnWidthsByColumnIndex;
                } else {
                    const columnWidths = this._getColumnWidths(this._headersView, this._rowsView);
                    if(columnWidths && columnWidths.length) {
                        columnWidthsByColumnIndex = {};
                        for(let i = 0; i < columns.length; i++) {
                            columnWidthsByColumnIndex[columns[i].index] = columnWidths[i];
                        }
                    }
                }
            }
            for(j = 0; j < columns.length; j++) {
                column = extend({}, columns[j], {
                    dataType: columns[j].dataType === 'datetime' ? 'date' : columns[j].dataType,
                    gridColumn: columns[j],
                });

                if(this._needColumnExporting(column)) {
                    currentColspan = this._calculateExportColspan(column);
                    if(isDefined(currentColspan)) {
                        column.exportColspan = currentColspan;
                    }
                    if(columnWidthsByColumnIndex) {
                        this._updateColumnWidth(column, columnWidthsByColumnIndex[column.index]);
                    }
                    currentHeaderRow.push(column);
                }
            }
            result.push(currentHeaderRow);
        }

        columns = result[rowCount];
        result = this._prepareItems(result.slice(0, -1));
        result.push(columns);

        return result;
    },

    _calculateExportColspan: function(column) {
        if(!column.isBand) {
            return;
        }
        const childColumns = this._columnsController.getChildrenByBandColumn(column.index, true);
        if(!isDefined(childColumns)) {
            return;
        }
        return childColumns.reduce((result, childColumn) => {
            if(this._needColumnExporting(childColumn)) {
                return result + (this._calculateExportColspan(childColumn) || 1);
            } else {
                return result;
            }
        }, 0);
    },

    _needColumnExporting: function(column) {
        return !column.command && (column.allowExporting || column.allowExporting === undefined);
    },

    _getFooterSummaryItems: function(summaryCells, isTotal) {
        const result = [];
        let estimatedItemsCount = 1;
        let values;
        let itemsLength;
        let summaryCell;
        let j;
        let i = 0;

        do {
            values = [];
            for(j = 0; j < summaryCells.length; j++) {
                summaryCell = summaryCells[j];
                itemsLength = summaryCell.length;
                if(estimatedItemsCount < itemsLength) {
                    estimatedItemsCount = itemsLength;
                }
                values.push(summaryCell[i]);
            }
            result.push({ values: values, rowType: isTotal ? 'totalFooter' : 'groupFooter' });
        } while(i++ < estimatedItemsCount - 1);

        return result;
    },

    _hasSummaryGroupFooters: function() {
        let i;
        const groupItems = this.option('summary.groupItems');

        if(isDefined(groupItems)) {
            for(i = 0; i < groupItems.length; i++) {
                if(groupItems[i].showInGroupFooter) {
                    return true;
                }
            }
        }

        return false;
    },

    _getItemsWithSummaryGroupFooters: function(sourceItems) {
        let item;
        let result = [];
        let beforeGroupFooterItems = [];
        let groupFooterItems = [];
        let i;

        for(i = 0; i < sourceItems.length; i++) {
            item = sourceItems[i];
            if(item.rowType === 'groupFooter') {
                groupFooterItems = this._getFooterSummaryItems(item.summaryCells);
                result = result.concat(beforeGroupFooterItems, groupFooterItems);
                beforeGroupFooterItems = [];
            } else {
                beforeGroupFooterItems.push(item);
            }
        }

        return result.length ? result : beforeGroupFooterItems;
    },

    _updateGroupValuesWithSummaryByColumn: function(sourceItems) {
        let item;
        let summaryCells;
        let summaryItem;
        let summaryValues = [];
        let groupColumnCount;
        let k;
        let j;
        let i;

        for(i = 0; i < sourceItems.length; i++) {
            item = sourceItems[i];
            summaryCells = item.summaryCells;
            if(item.rowType === 'group' && summaryCells && summaryCells.length > 1) {
                groupColumnCount = item.values.length;
                for(j = 1; j < summaryCells.length; j++) {
                    for(k = 0; k < summaryCells[j].length; k++) {
                        summaryItem = summaryCells[j][k];
                        if(summaryItem && summaryItem.alignByColumn) {
                            if(!Array.isArray(summaryValues[j - groupColumnCount])) {
                                summaryValues[j - groupColumnCount] = [];
                            }
                            summaryValues[j - groupColumnCount].push(summaryItem);
                        }
                    }
                }

                if(summaryValues.length > 0) {
                    arrayUtils.merge(item.values, summaryValues);
                    summaryValues = [];
                }
            }
        }
    },

    _processUnExportedItems: function(items) {
        const columns = this._columnsController.getVisibleColumns(null, true);
        const groupColumns = this._columnsController.getGroupColumns();
        let item;
        let column;
        let values;
        let summaryCells;
        let i;
        let j;

        for(i = 0; i < items.length; i++) {
            item = items[i];
            values = [];
            summaryCells = [];

            for(j = 0; j < columns.length; j++) {
                column = columns[j];
                if(this._needColumnExporting(column)) {
                    if(item.values) {
                        if(item.rowType === 'group' && !values.length) {
                            values.push(item.key[item.groupIndex]);
                        } else {
                            values.push(item.values[j]);
                        }
                    }
                    if(item.summaryCells) {
                        if(item.rowType === 'group' && !summaryCells.length) {
                            summaryCells.push(item.summaryCells[j - groupColumns.length + item.groupIndex]);
                        } else {
                            summaryCells.push(item.summaryCells[j]);
                        }
                    }
                }
            }

            if(values.length) {
                item.values = values;
            }
            if(summaryCells.length) {
                item.summaryCells = summaryCells;
            }
        }
    },

    _getAllItems: function(data) {
        const that = this;
        const d = new Deferred();
        const dataController = this.getController('data');
        const footerItems = dataController.footerItems();
        const totalItem = footerItems.length && footerItems[0];
        const summaryTotalItems = that.option('summary.totalItems');
        let summaryCells;
        let summaryItems;

        when(data).done(function(data) {
            dataController.loadAll(data).done(function(sourceItems, totalAggregates) {
                that._updateGroupValuesWithSummaryByColumn(sourceItems);

                if(that._hasSummaryGroupFooters()) {
                    sourceItems = that._getItemsWithSummaryGroupFooters(sourceItems);
                }

                summaryCells = totalItem && totalItem.summaryCells;

                if(isDefined(totalAggregates) && summaryTotalItems) {
                    summaryCells = dataController._getSummaryCells(summaryTotalItems, totalAggregates);
                }

                summaryItems = totalItem && that._getFooterSummaryItems(summaryCells, true);
                if(summaryItems) {
                    sourceItems = sourceItems.concat(summaryItems);
                }

                that._processUnExportedItems(sourceItems);
                d.resolve(sourceItems);
            }).fail(d.reject);
        }).fail(d.reject);

        return d;
    },

    _getSelectedItems: function() {
        const selectionController = this.getController('selection');
        const selectedRowData = selectionController.getSelectedRowsData();

        return this._getAllItems(selectedRowData);
    },

    _getColumnWidths: function(headersView, rowsView) {
        return (headersView && headersView.isVisible()) ? headersView.getColumnWidths() : rowsView.getColumnWidths();
    },

    init: function() {
        this._columnsController = this.getController('columns');
        this._rowsView = this.getView('rowsView');
        this._headersView = this.getView('columnHeadersView');

        this.createAction('onExporting', { excludeValidators: ['disabled', 'readOnly'] });
        this.createAction('onExported', { excludeValidators: ['disabled', 'readOnly'] });
        this.createAction('onFileSaving', { excludeValidators: ['disabled', 'readOnly'] });
    },

    callbackNames: function() {
        return ['selectionOnlyChanged'];
    },

    getExportFormat: function() { return ['EXCEL']; },

    getDataProvider: function(selectedRowsOnly) {
        const columnWidths = this._getColumnWidths(this._headersView, this._rowsView);
        let initialColumnWidthsByColumnIndex;
        if(columnWidths && columnWidths.length) {
            initialColumnWidthsByColumnIndex = {};
            const columnsLastRowVisibleColumns = this._columnsController.getVisibleColumns(this._columnsController.getRowCount(), true);
            for(let i = 0; i < columnsLastRowVisibleColumns.length; i++) {
                initialColumnWidthsByColumnIndex[columnsLastRowVisibleColumns[i].index] = columnWidths[i];
            }
        }

        return new exports.DataProvider(this, initialColumnWidthsByColumnIndex, selectedRowsOnly);
    },
    /**
    * @name dxDataGridMethods.exportToExcel
    * @publicName exportToExcel(selectionOnly)
    * @param1 selectionOnly:boolean
    */
    exportToExcel: function(selectionOnly) {
        const that = this;

        that._selectionOnly = selectionOnly;

        clientExport(that.component.getDataProvider(), {
            fileName: that.option('export.fileName'),
            proxyUrl: that.option('export.proxyUrl'),
            format: 'EXCEL',
            autoFilterEnabled: !!that.option('export.excelFilterEnabled'),
            rtlEnabled: that.option('rtlEnabled'),
            ignoreErrors: that.option('export.ignoreExcelErrors'),
            exportingAction: that.getAction('onExporting'),
            exportedAction: that.getAction('onExported'),
            fileSavingAction: that.getAction('onFileSaving')
        }, excel.getData);
    },

    publicMethods: function() {
        return ['getDataProvider', 'getExportFormat', 'exportToExcel'];
    },

    selectionOnly: function(value) {
        if(isDefined(value)) {
            this._isSelectedRows = value;
            this.selectionOnlyChanged.fire();
        } else {
            return this._isSelectedRows;
        }
    }
});

dataGridCore.registerModule('export', {
    defaultOptions: function() {
        return {
            /**
            * @name dxDataGridOptions.export
            * @type object
            */
            'export': {
                /**
                 * @name dxDataGridOptions.export.enabled
                 * @type boolean
                 * @default false
                 */
                enabled: false,
                /**
                 * @name dxDataGridOptions.export.fileName
                 * @type string
                 * @default "DataGrid"
                 */
                fileName: 'DataGrid',
                /**
                 * @name dxDataGridOptions.export.excelFilterEnabled
                 * @type boolean
                 * @default false
                 */
                excelFilterEnabled: false,
                /**
                 * @name dxDataGridOptions.export.excelWrapTextEnabled
                 * @type boolean
                 * @default undefined
                 */
                excelWrapTextEnabled: undefined,
                /**
                 * @name dxDataGridOptions.export.proxyUrl
                 * @type string
                 * @default undefined
                 * @deprecated
                 */
                proxyUrl: undefined,
                /**
                 * @name dxDataGridOptions.export.allowExportSelectedData
                 * @type boolean
                 * @default false
                 */
                allowExportSelectedData: false,
                /**
                * @name dxDataGridOptions.export.ignoreExcelErrors
                * @type boolean
                * @default true
                */
                ignoreExcelErrors: true,
                /**
                 * @name dxDataGridOptions.export.texts
                 * @type object
                 */
                texts: {
                    /**
                     * @name dxDataGridOptions.export.texts.exportTo
                     * @type string
                     * @default "Export"
                     */
                    exportTo: messageLocalization.format('dxDataGrid-exportTo'),
                    /**
                     * @name dxDataGridOptions.export.texts.exportAll
                     * @type string
                     * @default "Export all data"
                     */
                    exportAll: messageLocalization.format('dxDataGrid-exportAll'),
                    /**
                     * @name dxDataGridOptions.export.texts.exportSelectedRows
                     * @type string
                     * @default "Export selected rows"
                     */
                    exportSelectedRows: messageLocalization.format('dxDataGrid-exportSelectedRows')
                }
                /**
                 * @name dxDataGridOptions.export.customizeExcelCell
                 * @type function(options)
                 * @type_function_param1 options:object
                 * @type_function_param1_field1 component:dxDataGrid
                 * @type_function_param1_field2 horizontalAlignment:Enums.ExcelCellHorizontalAlignment
                 * @type_function_param1_field3 verticalAlignment:Enums.ExcelCellVerticalAlignment
                 * @type_function_param1_field4 wrapTextEnabled:boolean
                 * @type_function_param1_field5 backgroundColor:string
                 * @type_function_param1_field6 fillPatternType:Enums.ExcelCellPatternType
                 * @type_function_param1_field7 fillPatternColor:string
                 * @type_function_param1_field8 font:ExcelFont
                 * @type_function_param1_field9 value:string|number|date
                 * @type_function_param1_field10 numberFormat:string
                 * @type_function_param1_field11 gridCell:ExcelDataGridCell
                 */
            }
            /**
             * @name dxDataGridOptions.onExporting
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 fileName:string
             * @type_function_param1_field5 cancel:boolean
             * @extends Action
             * @action
             */
            /**
            * @name dxDataGridOptions.onFileSaving
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field3 fileName:string
            * @type_function_param1_field4 format:string
            * @type_function_param1_field5 data:BLOB
            * @type_function_param1_field6 cancel:boolean
            * @extends Action
            * @action
            */
            /**
             * @name dxDataGridOptions.onExported
             * @extends Action
             * @action
             */
            /**
             * @name dxDataGridOptions.customizeExportData
             * @type function(columns, rows)
             * @type_function_param1 columns:Array<dxDataGridColumn>
             * @type_function_param2 rows:Array<dxDataGridRowObject>
             */
        };
    },
    controllers: {
        'export': exports.ExportController
    },
    extenders: {
        controllers: {
            editing: {
                callbackNames: function() {
                    const callbackList = this.callBase();
                    return isDefined(callbackList) ? callbackList.push('editingChanged') : ['editingChanged'];
                },

                _updateEditButtons: function() {
                    this.callBase();
                    this.editingChanged.fire(this.hasChanges());
                }
            }
        },
        views: {
            headerPanel: {
                _getToolbarItems: function() {
                    const items = this.callBase();

                    return this._appendExportItems(items);
                },

                _appendExportItems: function(items) {
                    const that = this;
                    const exportOptions = that.option('export');

                    if(exportOptions.enabled) {
                        const exportItems = [];

                        if(exportOptions.allowExportSelectedData) {
                            exportItems.push({
                                template: function(data, index, container) {
                                    const $container = $(container);
                                    that._renderButton(data, $container);
                                    that._renderExportMenu($container);
                                },
                                menuItemTemplate: function(data, index, container) {
                                    that._renderList(data, $(container));
                                },
                                name: 'exportButton',
                                allowExportSelected: true,
                                location: 'after',
                                locateInMenu: 'auto',
                                sortIndex: 30
                            });

                        } else {
                            exportItems.push({
                                template: function(data, index, container) {
                                    that._renderButton(data, $(container));
                                },
                                menuItemTemplate: function(data, index, container) {
                                    that._renderButton(data, $(container), true);
                                },
                                name: 'exportButton',
                                location: 'after',
                                locateInMenu: 'auto',
                                sortIndex: 30
                            });
                        }
                        items = items.concat(exportItems);
                        that._correctItemsPosition(items);
                    }

                    return items;
                },

                _renderButton: function(data, $container, withText) {
                    const that = this;
                    const buttonOptions = that._getButtonOptions(data.allowExportSelected);
                    const $buttonContainer = that._getButtonContainer()
                        .addClass(DATAGRID_EXPORT_BUTTON_CLASS)
                        .appendTo($container);

                    if(withText) {
                        const wrapperNode = $('<div>').addClass(TOOLBAR_ITEM_AUTO_HIDE_CLASS);
                        $container
                            .wrapInner(wrapperNode)
                            .parent()
                            .addClass('dx-toolbar-menu-action dx-toolbar-menu-button ' + TOOLBAR_HIDDEN_BUTTON_CLASS);
                        buttonOptions.text = buttonOptions.hint;
                    }

                    that._createComponent(
                        $buttonContainer,
                        Button,
                        buttonOptions
                    );
                },

                _renderList: function(data, $container) {
                    const that = this;
                    const texts = that.option('export.texts');
                    const items = [{
                        template: function(data, index, container) {
                            that._renderFakeButton(data, $(container), DATAGRID_EXPORT_EXCEL_ICON);
                        },
                        text: texts.exportAll
                    }, {
                        template: function(data, index, container) {
                            that._renderFakeButton(data, $(container), DATAGRID_EXPORT_SELECTED_ICON);
                        },
                        text: texts.exportSelectedRows,
                        exportSelected: true
                    }];

                    that._createComponent(
                        $container,
                        List,
                        {
                            items: items,
                            onItemClick: function(e) {
                                that._exportController.exportToExcel(e.itemData.exportSelected);
                            },
                            scrollingEnabled: false
                        }
                    );
                },

                _renderFakeButton: function(data, $container, iconName) {
                    const $icon = $('<div>')
                        .addClass('dx-icon dx-icon-' + iconName);
                    const $text = $('<span>')
                        .addClass('dx-button-text')
                        .text(data.text);
                    const $content = $('<div>')
                        .addClass('dx-button-content')
                        .append($icon)
                        .append($text);
                    const $button = $('<div>')
                        .addClass(BUTTON_CLASS + ' dx-button-has-text dx-button-has-icon dx-datagrid-toolbar-button')
                        .append($content);
                    const $toolbarItem = $('<div>')
                        .addClass(TOOLBAR_ITEM_AUTO_HIDE_CLASS)
                        .append($button);

                    $container
                        .append($toolbarItem)
                        .parent()
                        .addClass('dx-toolbar-menu-custom ' + TOOLBAR_HIDDEN_BUTTON_CLASS);
                },

                _correctItemsPosition: function(items) {
                    items.sort(function(itemA, itemB) {
                        return itemA.sortIndex - itemB.sortIndex;
                    });
                },

                _renderExportMenu: function($buttonContainer) {
                    const that = this;
                    const $button = $buttonContainer.find('.' + BUTTON_CLASS);
                    const texts = that.option('export.texts');
                    const menuItems = [
                        {
                            text: texts.exportAll,
                            icon: DATAGRID_EXPORT_EXCEL_ICON
                        },
                        {
                            text: texts.exportSelectedRows,
                            exportSelected: true,
                            icon: DATAGRID_EXPORT_SELECTED_ICON
                        }
                    ];
                    const $menuContainer = $('<div>').appendTo($buttonContainer);

                    that._contextMenu = that._createComponent($menuContainer, ContextMenu, {
                        showEvent: 'dxclick',
                        items: menuItems,
                        cssClass: DATAGRID_EXPORT_MENU_CLASS,
                        onItemClick: function(e) {
                            that._exportController.exportToExcel(e.itemData.exportSelected);
                        },
                        target: $button,
                        position: {
                            at: 'left bottom',
                            my: 'left top',
                            offset: '0 3',
                            collision: 'fit',
                            boundary: that._$parent,
                            boundaryOffset: '1 1'
                        }
                    });
                },

                _isExportButtonVisible: function() {
                    return this.option('export.enabled');
                },

                _getButtonOptions: function(allowExportSelected) {
                    const that = this;
                    const texts = that.option('export.texts');
                    let options;

                    if(allowExportSelected) {
                        options = {
                            hint: texts.exportTo,
                            icon: DATAGRID_EXPORT_ICON
                        };
                    } else {
                        options = {
                            hint: texts.exportAll,
                            icon: DATAGRID_EXPORT_EXCEL_BUTTON_ICON,
                            onClick: function() {
                                that._exportController.exportToExcel();
                            }
                        };
                    }

                    return options;
                },

                optionChanged: function(args) {
                    this.callBase(args);
                    if(args.name === 'export') {
                        args.handled = true;
                        this._invalidate();
                    }
                },

                init: function() {
                    const that = this;
                    this.callBase();
                    this._exportController = this.getController('export');
                    this._editingController = this.getController('editing');
                    this._editingController.editingChanged.add(function(hasChanges) {
                        that.setToolbarItemDisabled('exportButton', hasChanges);
                    });
                },

                isVisible: function() {
                    return this.callBase() || this._isExportButtonVisible();
                }
            }
        }
    }
});
