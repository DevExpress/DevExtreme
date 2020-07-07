import { isDefined, isString, isDate, isObject } from '../../core/utils/type';
import messageLocalization from '../../localization/message';
import { ExportFormat } from './export_format';
import { extend } from '../../core/utils/extend';
import { isFunction } from 'jquery';

// docs.microsoft.com/en-us/office/troubleshoot/excel/determine-column-widths - "Description of how column widths are determined in Excel"
const MAX_DIGIT_WIDTH_IN_PIXELS = 7; // Calibri font with 11pt size

// support.office.com/en-us/article/change-the-column-width-and-row-height-72f5e3cc-994d-43e8-ae58-9774a0905f46 - "Column.Max - 255"
// support.office.com/en-us/article/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3 - "Column width limit - 255 characters"
const MAX_EXCEL_COLUMN_WIDTH = 255;

const Export = {
    getFullOptions: function(options) {
        const fullOptions = extend({}, options);
        if(!(isDefined(fullOptions.worksheet) && isObject(fullOptions.worksheet))) {
            throw Error('The "worksheet" field must contain an object.');
        }
        if(!isDefined(fullOptions.topLeftCell)) {
            fullOptions.topLeftCell = { row: 1, column: 1 };
        } else if(isString(fullOptions.topLeftCell)) {
            const { row, col } = fullOptions.worksheet.getCell(fullOptions.topLeftCell);
            fullOptions.topLeftCell = { row, column: col };
        }
        if(!isDefined(fullOptions.keepColumnWidths)) {
            fullOptions.keepColumnWidths = true;
        }
        if(!isDefined(fullOptions.loadPanel)) {
            fullOptions.loadPanel = {};
        }
        if(!isDefined(fullOptions.loadPanel.enabled)) {
            fullOptions.loadPanel.enabled = true;
        }
        if(!isDefined(fullOptions.loadPanel.text)) {
            fullOptions.loadPanel.text = messageLocalization.format('dxDataGrid-exporting');
        }

        return fullOptions;
    },

    convertDateForExcelJS: function(date) {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
    },

    setNumberFormat(excelCell, numberFormat) {
        excelCell.numFmt = numberFormat;
    },

    tryConvertToExcelNumberFormat: function(format, dataType) {
        const newFormat = ExportFormat.formatObjectConverter(format, dataType);
        const currency = newFormat.currency;

        format = newFormat.format;
        dataType = newFormat.dataType;

        return ExportFormat.convertFormat(format, newFormat.precision, dataType, currency);
    },

    setAlignment: function(excelCell, wrapText, horizontalAlignment) {
        excelCell.alignment = excelCell.alignment || {};

        if(isDefined(wrapText)) {
            excelCell.alignment.wrapText = wrapText;
        }
        if(isDefined(horizontalAlignment)) {
            excelCell.alignment.horizontal = horizontalAlignment;
        }

        excelCell.alignment.vertical = 'top';
    },

    setColumnsWidth: function(worksheet, columns, startColumnIndex) {
        if(!isDefined(columns)) {
            return;
        }
        for(let i = 0; i < columns.length; i++) {
            const columnWidth = columns[i].width;
            if((typeof columnWidth === 'number') && isFinite(columnWidth)) {
                worksheet.getColumn(startColumnIndex + i).width =
                    Math.min(MAX_EXCEL_COLUMN_WIDTH, Math.floor(columnWidth / MAX_DIGIT_WIDTH_IN_PIXELS * 100) / 100);
            }
        }
    },

    tryGetMergeRange: function(rowIndex, cellIndex, mergedCells, dataProvider) {
        if(!mergedCells[rowIndex] || !mergedCells[rowIndex][cellIndex]) {
            const cellMerge = dataProvider.getCellMerging(rowIndex, cellIndex);
            if(cellMerge.colspan || cellMerge.rowspan) {
                for(let i = rowIndex; i <= rowIndex + cellMerge.rowspan || 0; i++) {
                    for(let j = cellIndex; j <= cellIndex + cellMerge.colspan || 0; j++) {
                        if(!mergedCells[i]) {
                            mergedCells[i] = [];
                        }
                        mergedCells[i][j] = true;
                    }
                }
                return {
                    start: { row: rowIndex, column: cellIndex },
                    end: { row: rowIndex + (cellMerge.rowspan || 0), column: cellIndex + (cellMerge.colspan || 0) }
                };
            }
        }
    },

    mergeCells: function(worksheet, topLeftCell, mergeRanges) {
        mergeRanges.forEach((mergeRange) => {
            worksheet.mergeCells(mergeRange.start.row + topLeftCell.row, mergeRange.start.column + topLeftCell.column, mergeRange.end.row + topLeftCell.row, mergeRange.end.column + topLeftCell.column);
        });
    },

    export: function(options, privateOptions) {
        const {
            customizeCell,
            component,
            worksheet,
            topLeftCell,
            autoFilterEnabled,
            keepColumnWidths,
            selectedRowsOnly,
            loadPanel
        } = options;

        const initialLoadPanelOptions = extend({}, component.option('loadPanel'));
        if('animation' in component.option('loadPanel')) {
            loadPanel.animation = null;
        }
        component.option('loadPanel', loadPanel);

        const wrapText = !!component.option('wordWrapEnabled');

        worksheet.properties.outlineProperties = {
            summaryBelow: false,
            summaryRight: false
        };

        const cellRange = {
            from: { row: topLeftCell.row, column: topLeftCell.column },
            to: { row: topLeftCell.row, column: topLeftCell.column }
        };

        const dataProvider = component.getDataProvider(selectedRowsOnly);

        return new Promise((resolve) => {
            dataProvider.ready().done(() => {
                const columns = dataProvider.getColumns();
                const headerRowCount = isFunction(dataProvider.getHeaderRowCount) ? dataProvider.getHeaderRowCount() : undefined;
                const dataRowsCount = dataProvider.getRowsCount();

                if(keepColumnWidths) {
                    this.setColumnsWidth(worksheet, columns, cellRange.from.column);
                }

                const mergedCells = [];
                const mergeRanges = [];

                for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                    const row = worksheet.getRow(cellRange.from.row + rowIndex);

                    this.exportRow(rowIndex, columns.length, row, cellRange.from.column, dataProvider, customizeCell, headerRowCount, mergedCells, mergeRanges, wrapText, privateOptions);

                    if(rowIndex >= 1) {
                        cellRange.to.row++;
                    }
                }

                this.mergeCells(worksheet, topLeftCell, mergeRanges);

                cellRange.to.column += columns.length > 0 ? columns.length - 1 : 0;

                const worksheetViewSettings = worksheet.views[0] || {};

                if(component.option('rtlEnabled')) {
                    worksheetViewSettings.rightToLeft = true;
                }

                if(!isDefined(headerRowCount) || headerRowCount > 0) {
                    if(Object.keys(worksheetViewSettings).indexOf('state') === -1) {
                        extend(worksheetViewSettings, privateOptions._getWorksheetFrozenState(dataProvider, cellRange));
                    }
                    if(isFunction(privateOptions._setAutoFilter)) {
                        privateOptions._setAutoFilter(dataProvider, worksheet, cellRange, autoFilterEnabled);
                    }
                }

                if(Object.keys(worksheetViewSettings).length > 0) {
                    worksheet.views = [worksheetViewSettings];
                }

                resolve(cellRange);
            }).always(() => {
                component.option('loadPanel', initialLoadPanelOptions);
            });
        });
    },

    exportRow: function(rowIndex, cellCount, row, startColumnIndex, dataProvider, customizeCell, headerRowCount, mergedCells, mergeRanges, wrapText, privateOptions) {
        const styles = dataProvider.getStyles();

        for(let cellIndex = 0; cellIndex < cellCount; cellIndex++) {
            const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
            const cell = cellData.cellSourceData;

            const excelCell = row.getCell(startColumnIndex + cellIndex);

            if(isDate(cellData.value)) {
                excelCell.value = this.convertDateForExcelJS(cellData.value);
            } else {
                excelCell.value = cellData.value;
            }

            if(isDefined(excelCell.value)) {
                const { bold, alignment: horizontalAlignment, format, dataType } = styles[dataProvider.getStyleId(rowIndex, cellIndex)];

                let numberFormat = this.tryConvertToExcelNumberFormat(format, dataType);
                if(isDefined(numberFormat)) {
                    numberFormat = numberFormat.replace(/&quot;/g, '"');
                } else if(isString(excelCell.value) && /^[@=+-]/.test(excelCell.value)) {
                    numberFormat = '@';
                }

                this.setNumberFormat(excelCell, numberFormat);
                privateOptions._setFont(excelCell, bold);
                this.setAlignment(excelCell, wrapText, horizontalAlignment);
            }

            if(isDefined(customizeCell)) {
                customizeCell(privateOptions._getCustomizeCellOptions(excelCell, cell));
            }


            if(privateOptions._needMergeRange(rowIndex, headerRowCount)) {
                const mergeRange = this.tryGetMergeRange(rowIndex, cellIndex, mergedCells, dataProvider);
                if(isDefined(mergeRange)) {
                    mergeRanges.push(mergeRange);
                }
            }
        }

        privateOptions._trySetOutlineLevel(dataProvider, row, rowIndex, headerRowCount);
    }
};

//#DEBUG
Export.__internals = { MAX_EXCEL_COLUMN_WIDTH };
//#ENDDEBUG

export { Export };
