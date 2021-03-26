import Class from '../../core/class';
import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { hasWindow } from '../../core/utils/window';
import { getDefaultAlignment } from '../../core/utils/position';
import formatHelper from '../../format_helper';
import localizationNumber from '../../localization/number';
import { excel as excelExporter, export as exportMethod } from '../../exporter';
import exportMixin from '../grid_core/ui.grid_core.export_mixin';
import { when, Deferred } from '../../core/utils/deferred';

const DEFAULT_DATA_TYPE = 'string';
const DEFAUL_COLUMN_WIDTH = 100;

export const ExportMixin = extend({}, exportMixin, {
    exportToExcel: function() {
        const that = this;

        exportMethod(that.getDataProvider(), {
            fileName: that.option('export.fileName'),
            proxyUrl: that.option('export.proxyUrl'),
            format: 'EXCEL',
            rtlEnabled: that.option('rtlEnabled'),
            ignoreErrors: that.option('export.ignoreExcelErrors'),
            exportingAction: that._actions.onExporting,
            exportedAction: that._actions.onExported,
            fileSavingAction: that._actions.onFileSaving
        }, excelExporter.getData);
    },

    _getLength: function(items) {
        let i;
        const itemCount = items[0].length;
        let cellCount = 0;

        for(i = 0; i < itemCount; i++) {
            cellCount += items[0][i].colspan || 1;
        }

        return cellCount;
    },

    _correctCellsInfoItemLengths: function(cellsInfo, expectedLength) {
        for(let i = 0; i < cellsInfo.length; i++) {
            while(cellsInfo[i].length < expectedLength) {
                cellsInfo[i].push({});
            }
        }
        return cellsInfo;
    },

    _calculateCellInfoItemLength: function(columnsRow) {
        let result = 0;
        for(let columnIndex = 0; columnIndex < columnsRow.length; columnIndex++) {
            result += isDefined(columnsRow[columnIndex].colspan) ? columnsRow[columnIndex].colspan : 1;
        }
        return result;
    },

    _getAllItems: function(columnsInfo, rowsInfoItems, cellsInfo) {
        let cellIndex;
        let rowIndex;
        let correctedCellsInfo = cellsInfo;
        const rowsLength = this._getLength(rowsInfoItems);
        const headerRowsCount = columnsInfo.length;

        if(columnsInfo.length > 0 && columnsInfo[0].length > 0 && cellsInfo.length > 0 && cellsInfo[0].length === 0) {
            const cellInfoItemLength = this._calculateCellInfoItemLength(columnsInfo[0]);
            if(cellInfoItemLength > 0) {
                correctedCellsInfo = this._correctCellsInfoItemLengths(cellsInfo, cellInfoItemLength);
            }
        }
        const sourceItems = columnsInfo.concat(correctedCellsInfo);

        for(rowIndex = 0; rowIndex < rowsInfoItems.length; rowIndex++) {
            for(cellIndex = rowsInfoItems[rowIndex].length - 1; cellIndex >= 0; cellIndex--) {
                if(!isDefined(sourceItems[rowIndex + headerRowsCount])) {
                    sourceItems[rowIndex + headerRowsCount] = [];
                }

                sourceItems[rowIndex + headerRowsCount].splice(0, 0,
                    extend({}, rowsInfoItems[rowIndex][cellIndex]));
            }
        }

        sourceItems[0].splice(0, 0, extend({}, this._getEmptyCell(),
            {
                alignment: getDefaultAlignment(this._options.rtlEnabled),
                colspan: rowsLength,
                rowspan: headerRowsCount
            }));

        return this._prepareItems(sourceItems);
    },

    getDataProvider: function() {
        const that = this;
        const dataController = this._dataController;
        const items = new Deferred();

        dataController.beginLoading();
        setTimeout(function() {
            const columnsInfo = extend(true, [], dataController.getColumnsInfo(true));
            const rowsInfoItems = extend(true, [], dataController.getRowsInfo(true));
            const cellsInfo = dataController.getCellsInfo(true);

            items.resolve(that._getAllItems(columnsInfo, rowsInfoItems, cellsInfo));
            dataController.endLoading();
        });

        return new DataProvider({
            items: items,
            rtlEnabled: this.option('rtlEnabled'),
            dataFields: this.getDataSource().getAreaFields('data'),
            customizeExcelCell: this.option('export.customizeExcelCell'),
            rowsArea: this._rowsArea,
            columnsArea: this._columnsArea
        });
    }
});

export const DataProvider = Class.inherit({
    ctor: function(options) {
        this._options = options;
    },

    ready: function() {
        const options = this._options;

        return when(options.items).done((items) => {
            const headerSize = items[0][0].rowspan;
            const columns = items[headerSize - 1];

            each(columns, (columnIndex, column) => {
                column.width = DEFAUL_COLUMN_WIDTH;
            });

            options.columns = columns;
            options.items = items;
        });
    },

    getColumns: function() {
        return this._options.columns;
    },

    getColumnsWidths: function() {
        const colsArea = this._options.columnsArea;
        const rowsArea = this._options.rowsArea;
        const columns = this._options.columns;
        const useDefaultWidth = !hasWindow() || colsArea.option('scrolling.mode') === 'virtual' || colsArea.element().is(':hidden');
        return useDefaultWidth
            ? columns.map(_ => DEFAUL_COLUMN_WIDTH)
            : rowsArea.getColumnsWidth().concat(colsArea.getColumnsWidth());
    },

    getRowsCount: function() {
        return this._options.items.length;
    },

    getGroupLevel: function() {
        return 0;
    },

    getCellMerging: function(rowIndex, cellIndex) {
        const items = this._options.items;
        const item = items[rowIndex] && items[rowIndex][cellIndex];

        return item ? {
            colspan: item.colspan - 1,
            rowspan: item.rowspan - 1
        } : { colspan: 0, rowspan: 0 };
    },

    getFrozenArea: function() {
        return { x: this.getRowAreaColCount(), y: this.getColumnAreaRowCount() };
    },

    getCellType: function(rowIndex, cellIndex) {
        const style = this.getStyles()[this.getStyleId(rowIndex, cellIndex)];
        return style && style.dataType || 'string';
    },

    getCellData: function(rowIndex, cellIndex, isExcelJS) {
        const result = {};
        const items = this._options.items;
        const item = items[rowIndex] && items[rowIndex][cellIndex] || {};

        if(isExcelJS) {
            result.cellSourceData = item;
            const areaName = this._tryGetAreaName(item, rowIndex, cellIndex);
            if(areaName) {
                result.cellSourceData.area = areaName;
            }
            result.cellSourceData.rowIndex = rowIndex;
            result.cellSourceData.columnIndex = cellIndex;
        }

        if(this.getCellType(rowIndex, cellIndex) === 'string') {
            result.value = item.text;
        } else {
            result.value = item.value;
        }

        if(result.cellSourceData && result.cellSourceData.isWhiteSpace) {
            result.value = '';
        }

        return result;
    },

    _tryGetAreaName(item, rowIndex, cellIndex) {
        if(this.isColumnAreaCell(rowIndex, cellIndex)) {
            return 'column';
        } else if(this.isRowAreaCell(rowIndex, cellIndex)) {
            return 'row';
        } else if(isDefined(item.dataIndex)) {
            return 'data';
        }
    },

    isRowAreaCell(rowIndex, cellIndex) {
        return rowIndex >= this.getColumnAreaRowCount() && cellIndex < this.getRowAreaColCount();
    },

    isColumnAreaCell(rowIndex, cellIndex) {
        return cellIndex >= this.getRowAreaColCount() && rowIndex < this.getColumnAreaRowCount();
    },

    getColumnAreaRowCount() {
        return this._options.items[0][0].rowspan;
    },

    getRowAreaColCount() {
        return this._options.items[0][0].colspan;
    },

    getHeaderStyles() {
        return [
            { alignment: 'center', dataType: 'string' },
            { alignment: getDefaultAlignment(this._options.rtlEnabled), dataType: 'string' }
        ];
    },

    getDataFieldStyles() {
        const dataFields = this._options.dataFields;
        const dataItemStyle = { alignment: this._options.rtlEnabled ? 'left' : 'right' };
        const dataFieldStyles = [];

        if(dataFields.length) {
            dataFields.forEach((dataField) => {
                dataFieldStyles.push({
                    ...dataItemStyle,
                    ...{ format: dataField.format, dataType: this.getCellDataType(dataField) }
                });
            });

            return dataFieldStyles;
        }

        return [dataItemStyle];
    },

    getStyles: function() {
        if(this._styles) {
            return this._styles;
        }

        this._styles = [...this.getHeaderStyles(), ...this.getDataFieldStyles()];

        return this._styles;
    },

    getCellDataType: function(field) {
        if(field && field.customizeText) {
            return 'string';
        }

        if(field.dataType) {
            return field.dataType;
        }

        if(field.format) {
            if(localizationNumber.parse(formatHelper.format(1, field.format)) === 1) {
                return 'number';
            }
            if(formatHelper.format(new Date(), field.format)) {
                return 'date';
            }
        }

        return DEFAULT_DATA_TYPE;
    },

    getStyleId: function(rowIndex, cellIndex) {
        const items = this._options.items;
        const item = items[rowIndex] && items[rowIndex][cellIndex] || {};

        if((cellIndex === 0 && rowIndex === 0) || this.isColumnAreaCell(rowIndex, cellIndex)) {
            return 0;
        } else if(this.isRowAreaCell(rowIndex, cellIndex)) {
            return 1;
        }

        return this.getHeaderStyles().length + (item.dataIndex || 0);
    },

    hasCustomizeExcelCell: function() {
        return isDefined(this._options.customizeExcelCell);
    },

    customizeExcelCell: function(e) {
        if(this._options.customizeExcelCell) {
            this._options.customizeExcelCell(e);
        }
    },
});

//#DEBUG
export const PivotGridExport = {
    DEFAUL_COLUMN_WIDTH
};
//#ENDDEBUG
