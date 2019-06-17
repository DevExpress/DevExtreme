import Class from "../../core/class";
import { isDefined } from "../../core/utils/type";
import { extend } from "../../core/utils/extend";
import { each } from "../../core/utils/iterator";
import { format } from "../../format_helper";
import { parse } from "../../localization/number";
import clientExporter, { excel as excelExporter } from "../../exporter";
import exportMixin from "../grid_core/ui.grid_core.export_mixin";
import { when, Deferred } from "../../core/utils/deferred";

var DEFAULT_DATA_TYPE = 'string',
    COLUMN_HEADER_STYLE_ID = 0,
    ROW_HEADER_STYLE_ID = 1,
    DATA_STYLE_OFFSET = 2,
    DEFAUL_COLUMN_WIDTH = 100;

exports.ExportMixin = extend({}, exportMixin, {
    /**
    * @name dxPivotGridMethods.exportToExcel
    * @publicName exportToExcel()
    */
    exportToExcel: function() {
        var that = this;

        clientExporter.export(that.getDataProvider(), {
            fileName: that.option("export.fileName"),
            proxyUrl: that.option("export.proxyUrl"),
            format: "EXCEL",
            rtlEnabled: that.option("rtlEnabled"),
            ignoreErrors: that.option("export.ignoreExcelErrors"),
            exportingAction: that._actions.onExporting,
            exportedAction: that._actions.onExported,
            fileSavingAction: that._actions.onFileSaving
        }, excelExporter.getData);
    },

    _getLength: function(items) {
        var i,
            itemCount = items[0].length,
            cellCount = 0;

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
        var cellIndex,
            rowIndex,
            correctedCellsInfo = cellsInfo,
            sourceItems,
            rowsLength = this._getLength(rowsInfoItems),
            headerRowsCount = columnsInfo.length;

        if(columnsInfo.length > 0 && columnsInfo[0].length > 0 && cellsInfo.length > 0 && cellsInfo[0].length === 0) {
            const cellInfoItemLength = this._calculateCellInfoItemLength(columnsInfo[0]);
            if(cellInfoItemLength > 0) {
                correctedCellsInfo = this._correctCellsInfoItemLengths(cellsInfo, cellInfoItemLength);
            }
        }
        sourceItems = columnsInfo.concat(correctedCellsInfo);

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
                alignment: this._options.rtlEnabled ? "right" : "left",
                colspan: rowsLength,
                rowspan: headerRowsCount
            }));

        return this._prepareItems(sourceItems);
    },

    getDataProvider: function() {
        var that = this,
            dataController = this._dataController,
            items = new Deferred();

        dataController.beginLoading();
        setTimeout(function() {
            var columnsInfo = extend(true, [], dataController.getColumnsInfo(true)),
                rowsInfoItems = extend(true, [], dataController.getRowsInfo(true)),
                cellsInfo = dataController.getCellsInfo(true);

            items.resolve(that._getAllItems(columnsInfo, rowsInfoItems, cellsInfo));
            dataController.endLoading();
        });

        return new exports.DataProvider({
            items: items,
            rtlEnabled: this.option("rtlEnabled"),
            dataFields: this.getDataSource().getAreaFields("data"),
            customizeExcelCell: this.option("export.customizeExcelCell"),
        });
    }
});

function getCellDataType(field) {
    if(field && field.customizeText) {
        return "string";
    }

    if(field.dataType) {
        return field.dataType;
    }

    if(field.format) {
        if(parse(format(1, field.format)) === 1) {
            return "number";
        }
        if(format(new Date(), field.format)) {
            return "date";
        }
    }

    return DEFAULT_DATA_TYPE;
}

exports.DataProvider = Class.inherit({
    ctor: function(options) {
        this._options = options;
        this._styles = [];
    },

    ready: function() {
        var that = this,
            options = that._options,
            dataFields = options.dataFields;

        return when(options.items).done(function(items) {
            var headerSize = items[0][0].rowspan,
                columns = items[headerSize - 1],
                dataItemStyle = { alignment: options.rtlEnabled ? "left" : "right" };

            that._styles = [
                { alignment: "center", dataType: "string" },
                { alignment: options.rtlEnabled ? "right" : "left", dataType: "string" }
            ];

            if(dataFields.length) {
                dataFields.forEach(function(dataField) {
                    that._styles.push(extend({}, dataItemStyle, {
                        format: dataField.format,
                        dataType: getCellDataType(dataField)
                    }));
                });
            } else {
                that._styles.push(dataItemStyle);
            }

            each(columns, function(columnIndex, column) {
                column.width = DEFAUL_COLUMN_WIDTH;
            });

            options.columns = columns;
            options.items = items;
        });
    },

    getColumns: function() {
        return this._options.columns;
    },

    getRowsCount: function() {
        return this._options.items.length;
    },

    getGroupLevel: function() {
        return 0;
    },

    getCellMerging: function(rowIndex, cellIndex) {
        var items = this._options.items,
            item = items[rowIndex] && items[rowIndex][cellIndex];

        return item ? {
            colspan: item.colspan - 1,
            rowspan: item.rowspan - 1
        } : { colspan: 0, rowspan: 0 };
    },

    getFrozenArea: function() {
        var items = this._options.items;

        return { x: items[0][0].colspan, y: items[0][0].rowspan };
    },

    getCellType: function(rowIndex, cellIndex) {
        var style = this._styles[this.getStyleId(rowIndex, cellIndex)];
        return style && style.dataType || "string";
    },

    getCellData: function(rowIndex, cellIndex) {
        const result = {};
        var items = this._options.items,
            item = items[rowIndex] && items[rowIndex][cellIndex] || {};

        if(this.getCellType(rowIndex, cellIndex) === "string") {
            result.value = item.text;
        } else {
            result.value = item.value;
        }
        return result;
    },

    getStyles: function() {
        return this._styles;
    },

    getStyleId: function(rowIndex, cellIndex) {
        var items = this._options.items,
            columnHeaderSize = items[0][0].rowspan,
            rowHeaderSize = items[0][0].colspan,
            item = items[rowIndex] && items[rowIndex][cellIndex] || {};

        if(cellIndex === 0 && rowIndex === 0) {
            return COLUMN_HEADER_STYLE_ID;
        } else if(cellIndex >= rowHeaderSize && rowIndex < columnHeaderSize) {
            return COLUMN_HEADER_STYLE_ID;
        } else if(rowIndex >= columnHeaderSize && cellIndex < rowHeaderSize) {
            return ROW_HEADER_STYLE_ID;
        }

        return DATA_STYLE_OFFSET + (item.dataIndex || 0);
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
