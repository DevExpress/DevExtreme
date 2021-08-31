import $ from '../../core/renderer';
import Class from '../../core/class';
import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { getDefaultAlignment } from '../../core/utils/position';
import { merge } from '../../core/utils/array';
import dataGridCore from './ui.data_grid.core';
import exportMixin from '../grid_core/ui.grid_core.export_mixin';
import { export as clientExport, excel } from '../../exporter';
import messageLocalization from '../../localization/message';
import Button from '../button';
import DropDownButton from '../drop_down_button';
import List from '../list';
import { when, Deferred } from '../../core/utils/deferred';

export const DataProvider = Class.inherit({
    ctor: function(exportController, initialColumnWidthsByColumnIndex, selectedRowsOnly) {
        this._exportController = exportController;
        this._initialColumnWidthsByColumnIndex = initialColumnWidthsByColumnIndex;
        this._selectedRowsOnly = selectedRowsOnly;
    },

    _getGroupValue: function(item) {
        const { key, data, rowType, groupIndex, summaryCells } = item;
        const groupColumn = this._options.groupColumns[groupIndex];

        const value = dataGridCore.getDisplayValue(groupColumn, groupColumn.deserializeValue ? groupColumn.deserializeValue(key[groupIndex]) : key[groupIndex], data, rowType);

        let result = groupColumn.caption + ': ' + dataGridCore.formatValue(value, groupColumn);

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

    getHeaderStyles() {
        return [
            { bold: true, alignment: 'center', wrapText: true },
            { bold: true, alignment: 'left', wrapText: true },
            { bold: true, alignment: 'right', wrapText: true },
        ];
    },

    getGroupRowStyle() {
        return {
            bold: true,
            wrapText: false,
            alignment: getDefaultAlignment(this._options.rtlEnabled)
        };
    },

    getColumnStyles() {
        const wrapTextEnabled = this._options.wrapTextEnabled;
        const columnStyles = [];

        this.getColumns().forEach((column) => {
            columnStyles.push({
                alignment: column.alignment || 'left',
                format: column.format,
                wrapText: wrapTextEnabled,
                dataType: column.dataType
            });
        });

        return columnStyles;
    },

    getStyles: function() {
        return [...this.getHeaderStyles(), ...this.getColumnStyles(), this.getGroupRowStyle()];
    },

    _getTotalCellStyleId: function(cellIndex) {
        const alignment = this.getColumns()[cellIndex]?.alignment || 'right';
        return this.getHeaderStyles().map(style => style.alignment).indexOf(alignment);
    },

    getStyleId: function(rowIndex, cellIndex) {
        if(rowIndex < this.getHeaderRowCount()) {
            return 0;
        } else if(this.isTotalCell(rowIndex - this.getHeaderRowCount(), cellIndex)) {
            return this._getTotalCellStyleId(cellIndex);
        } else if(this.isGroupRow(rowIndex - this.getHeaderRowCount())) {
            return this.getHeaderStyles().length + this.getColumns().length;
        } else {
            return cellIndex + this.getHeaderStyles().length;
        }
    },

    getColumns: function(getColumnsByAllRows) {
        const { columns } = this._options;

        return getColumnsByAllRows ? columns : columns[columns.length - 1];
    },

    getColumnsWidths: function() {
        const columns = this.getColumns();
        return isDefined(columns)
            ? columns.map(c => c.width)
            : undefined;
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

        that._initOptions();
        const options = that._options;

        return when(options.items).done(function(items) {
            options.customizeExportData && options.customizeExportData(that.getColumns(that.getHeaderRowCount() > 1), items);
            options.items = items;
        }).fail(function() {
            options.items = [];
        });
    },

    _convertFromGridGroupSummaryItems: function(gridGroupSummaryItems) {
        if(isDefined(gridGroupSummaryItems) && gridGroupSummaryItems.length > 0) {
            return gridGroupSummaryItems.map(function(item) { return { value: item.value, name: item.name }; });
        }
    },

    getCellData: function(rowIndex, cellIndex, isExcelJS) {
        let value;
        let column;

        const result = { cellSourceData: {}, value };
        const columns = this.getColumns();
        const correctedCellIndex = this._correctCellIndex(cellIndex);

        if(rowIndex < this.getHeaderRowCount()) {
            const columnsRow = this.getColumns(true)[rowIndex];
            column = columnsRow[cellIndex];
            result.cellSourceData.rowType = 'header';
            result.cellSourceData.column = column && column.gridColumn;
            result.value = column && column.caption;
        } else {
            rowIndex -= this.getHeaderRowCount();

            const item = this._options.items.length && this._options.items[rowIndex];

            if(item) {
                const itemValues = item.values;
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
                            const summaryItems = item.values[correctedCellIndex];
                            if(Array.isArray(summaryItems)) {
                                result.cellSourceData.groupSummaryItems = this._convertFromGridGroupSummaryItems(summaryItems);
                                value = '';
                                for(let i = 0; i < summaryItems.length; i++) {
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

                            if(!isFinite(displayValue) || isDefined(column.customizeText)) { // similar to 'ui.grid_core.rows.js: _getCellOptions'
                                if(isExcelJS && isDefined(column.customizeText) && column.customizeText === this._exportController._columnsController.getCustomizeTextByDataType('boolean')) {
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

export const ExportController = dataGridCore.ViewController.inherit({}).include(exportMixin).inherit({
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
        let columns;
        const columnsController = this._columnsController;
        const rowCount = columnsController.getRowCount();

        for(i = 0; i <= rowCount; i++) {
            const currentHeaderRow = [];
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
            for(let j = 0; j < columns.length; j++) {
                const column = extend({}, columns[j], {
                    dataType: columns[j].dataType === 'datetime' ? 'date' : columns[j].dataType,
                    gridColumn: columns[j],
                });

                if(this._needColumnExporting(column)) {
                    const currentColspan = this._calculateExportColspan(column);
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
        let i = 0;

        do {
            const values = [];
            for(let j = 0; j < summaryCells.length; j++) {
                const summaryCell = summaryCells[j];
                const itemsLength = summaryCell.length;
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
        const groupItems = this.option('summary.groupItems');

        if(isDefined(groupItems)) {
            for(let i = 0; i < groupItems.length; i++) {
                if(groupItems[i].showInGroupFooter) {
                    return true;
                }
            }
        }

        return false;
    },

    _getItemsWithSummaryGroupFooters: function(sourceItems) {
        let result = [];
        let beforeGroupFooterItems = [];
        let groupFooterItems = [];

        for(let i = 0; i < sourceItems.length; i++) {
            const item = sourceItems[i];
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
        let summaryValues = [];

        for(let i = 0; i < sourceItems.length; i++) {
            const item = sourceItems[i];
            const summaryCells = item.summaryCells;
            if(item.rowType === 'group' && summaryCells && summaryCells.length > 1) {
                const groupColumnCount = item.values.length;
                for(let j = 1; j < summaryCells.length; j++) {
                    for(let k = 0; k < summaryCells[j].length; k++) {
                        const summaryItem = summaryCells[j][k];
                        if(summaryItem && summaryItem.alignByColumn) {
                            if(!Array.isArray(summaryValues[j - groupColumnCount])) {
                                summaryValues[j - groupColumnCount] = [];
                            }
                            summaryValues[j - groupColumnCount].push(summaryItem);
                        }
                    }
                }

                if(summaryValues.length > 0) {
                    merge(item.values, summaryValues);
                    summaryValues = [];
                }
            }
        }
    },

    _processUnExportedItems: function(items) {
        const columns = this._columnsController.getVisibleColumns(null, true);
        const groupColumns = this._columnsController.getGroupColumns();
        let values;
        let summaryCells;

        for(let i = 0; i < items.length; i++) {
            const item = items[i];
            let isDetailExpandColumn = false;
            values = [];
            summaryCells = [];

            for(let j = 0; j < columns.length; j++) {
                const column = columns[j];
                isDetailExpandColumn = isDetailExpandColumn || column.type === 'detailExpand';

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
                            const index = j - groupColumns.length + item.groupIndex;

                            summaryCells.push(item.summaryCells[isDetailExpandColumn ? index - 1 : index]);
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

        when(data).done(function(data) {
            dataController.loadAll(data).done(function(sourceItems, totalAggregates) {
                that._updateGroupValuesWithSummaryByColumn(sourceItems);

                if(that._hasSummaryGroupFooters()) {
                    sourceItems = that._getItemsWithSummaryGroupFooters(sourceItems);
                }

                summaryCells = totalItem && totalItem.summaryCells;

                if(isDefined(totalAggregates) && summaryTotalItems) {
                    summaryCells = that._getSummaryCells(summaryTotalItems, totalAggregates);
                }

                const summaryItems = totalItem && that._getFooterSummaryItems(summaryCells, true);
                if(summaryItems) {
                    sourceItems = sourceItems.concat(summaryItems);
                }

                that._processUnExportedItems(sourceItems);
                d.resolve(sourceItems);
            }).fail(d.reject);
        }).fail(d.reject);

        return d;
    },

    _getSummaryCells: function(summaryTotalItems, totalAggregates) {
        const dataController = this.getController('data');
        const columnsController = dataController._columnsController;

        return dataController._calculateSummaryCells(summaryTotalItems, totalAggregates, columnsController.getVisibleColumns(null, true), function(summaryItem, column) {
            return dataController._isDataColumn(column) ? column.index : -1;
        });
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

        return new DataProvider(this, initialColumnWidthsByColumnIndex, selectedRowsOnly);
    },
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
            'export': {
                enabled: false,
                fileName: 'DataGrid',
                excelFilterEnabled: false,
                excelWrapTextEnabled: undefined,
                proxyUrl: undefined,
                allowExportSelectedData: false,
                ignoreExcelErrors: true,
                texts: {
                    exportTo: messageLocalization.format('dxDataGrid-exportTo'),
                    exportAll: messageLocalization.format('dxDataGrid-exportAll'),
                    exportSelectedRows: messageLocalization.format('dxDataGrid-exportSelectedRows')
                }
            }
        };
    },
    controllers: {
        'export': ExportController
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

                    const exportButton = this._getExportToolbarButton();
                    if(exportButton) {
                        items.push(exportButton);
                        this._correctItemsPosition(items);
                    }

                    return items;
                },

                _getExportToolbarButton: function() {
                    const items = this._getExportToolbarItems();

                    if(items.length === 0) {
                        return null;
                    }

                    const toolbarButtonOptions = {
                        name: 'exportButton',
                        location: 'after',
                        locateInMenu: 'auto',
                        sortIndex: 30,
                    };

                    if(items.length === 1) {
                        const widgetOptions = {
                            ...items[0],
                            hint: items[0].text,
                            text: undefined,
                            elementAttr: {
                                class: 'dx-datagrid-export-button'
                            }
                        };

                        toolbarButtonOptions.template = (_data, _index, container) => {
                            this._createComponent($(container), Button, widgetOptions);
                        };
                    } else {
                        toolbarButtonOptions.template = (_data, _index, container) => {
                            this._createComponent($(container), DropDownButton, {
                                icon: 'export',
                                displayExpr: 'text',
                                items: items,
                                hint: 'Export',
                                elementAttr: {
                                    class: 'dx-datagrid-export-button'
                                },
                                dropDownOptions: {
                                    wrapperAttr: { 'class': 'dx-datagrid-export-menu' },
                                    width: 'auto'
                                }
                            });
                        };
                    }

                    toolbarButtonOptions.menuItemTemplate = (_data, _index, container) => {
                        this._createComponent($(container), List, { items });
                    };

                    return toolbarButtonOptions;
                },

                _getExportToolbarItems: function() {
                    const exportOptions = this.option('export');
                    const texts = this.option('export.texts');
                    const items = [];

                    if(exportOptions.enabled) {
                        items.push({
                            text: texts.exportAll,
                            icon: 'xlsxfile',
                            onClick: () => {
                                this._exportController.exportToExcel();
                            }
                        });

                        if(exportOptions.allowExportSelectedData) {
                            items.push({
                                text: texts.exportSelectedRows,
                                icon: 'exportselected',
                                onClick: () => {
                                    this._exportController.exportToExcel(true);
                                }
                            });
                        }
                    }

                    return items;
                },

                _correctItemsPosition: function(items) {
                    items.sort(function(itemA, itemB) {
                        return itemA.sortIndex - itemB.sortIndex;
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
                            icon: 'export-to'
                        };
                    } else {
                        options = {
                            hint: texts.exportAll,
                            icon: 'export-excel-button',
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
