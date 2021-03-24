import { isDefined, isString, isDate, isObject, isFunction } from '../../core/utils/type';
import messageLocalization from '../../localization/message';
import { ExportFormat } from './export_format';
import { extend } from '../../core/utils/extend';
import { hasWindow } from '../../core/utils/window';

// docs.microsoft.com/en-us/office/troubleshoot/excel/determine-column-widths - "Description of how column widths are determined in Excel"
const MAX_DIGIT_WIDTH_IN_PIXELS = 7; // Calibri font with 11pt size

// support.office.com/en-us/article/change-the-column-width-and-row-height-72f5e3cc-994d-43e8-ae58-9774a0905f46 - "Column.Max - 255"
// support.office.com/en-us/article/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3 - "Column width limit - 255 characters"
const MAX_EXCEL_COLUMN_WIDTH = 255;

export const Export = {
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

    getCellStyles: function(dataProvider) {
        const styles = dataProvider.getStyles();

        styles.forEach((style) => {
            let numberFormat = this.tryConvertToExcelNumberFormat(style.format, style.dataType);

            if(isDefined(numberFormat)) {
                numberFormat = numberFormat.replace(/&quot;/g, '"');
            }

            style.numberFormat = numberFormat;
        });

        return styles;
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

    setColumnsWidth: function(worksheet, widths, startColumnIndex) {
        if(!isDefined(widths)) {
            return;
        }
        for(let i = 0; i < widths.length; i++) {
            const columnWidth = widths[i];
            if((typeof columnWidth === 'number') && isFinite(columnWidth)) {
                worksheet.getColumn(startColumnIndex + i).width =
                    Math.min(MAX_EXCEL_COLUMN_WIDTH, Math.floor(columnWidth / MAX_DIGIT_WIDTH_IN_PIXELS * 100) / 100);
            }
        }
    },

    tryGetMergeRange: function(excelCell, mergedCells, rowIndex, cellIndex, dataProvider, mergeRowFieldValues, mergeColumnFieldValues, privateOptions) {
        const { rowspan, colspan } = dataProvider.getCellMerging(rowIndex, cellIndex);

        if(colspan || rowspan) {
            const needMergeRange = privateOptions._isRangeMerged(dataProvider, rowIndex, cellIndex, rowspan, colspan, mergeRowFieldValues, mergeColumnFieldValues);
            this.updateMergedCells(excelCell, mergedCells, rowIndex, cellIndex, rowspan, colspan, needMergeRange);

            if(needMergeRange) {
                return {
                    masterCell: excelCell,
                    ...{ rowspan, colspan }
                };
            }
        }
    },

    cellInMergeRanges(mergedCells, rowIndex, cellIndex) {
        return mergedCells[rowIndex] && mergedCells[rowIndex][cellIndex];
    },

    updateMergedCells(excelCell, mergedCells, rowIndex, cellIndex, rowspan, colspan, needMergeRange) {
        for(let i = rowIndex; i <= rowIndex + rowspan; i++) {
            for(let j = cellIndex; j <= cellIndex + colspan; j++) {
                if(!mergedCells[i]) {
                    mergedCells[i] = [];
                }
                mergedCells[i][j] = {
                    masterCell: excelCell,
                    merged: needMergeRange
                };
            }
        }
    },

    mergeCells: function(worksheet, topLeftCell, mergeRanges) {
        mergeRanges.forEach((mergeRange) => {
            const startRowIndex = mergeRange.masterCell.fullAddress.row;
            const startColumnIndex = mergeRange.masterCell.fullAddress.col;
            const endRowIndex = startRowIndex + mergeRange.rowspan;
            const endColumnIndex = startColumnIndex + mergeRange.colspan;

            worksheet.mergeCells(startRowIndex, startColumnIndex, endRowIndex, endColumnIndex);
        });
    },

    setLoadPanelOptions: function(component, options, privateOptions) {
        if(!hasWindow()) {
            return;
        }

        component._setOptionWithoutOptionChange('loadPanel', options);
        privateOptions._renderLoadPanel(component);
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
            loadPanel,
            mergeRowFieldValues,
            mergeColumnFieldValues,
        } = options;

        const initialLoadPanelOptions = extend({}, component.option('loadPanel'));
        if('animation' in component.option('loadPanel')) {
            loadPanel.animation = null;
        }

        this.setLoadPanelOptions(component, loadPanel, privateOptions);

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
                const headerRowCount = isFunction(dataProvider.getHeaderRowCount) ? dataProvider.getHeaderRowCount() : 1;
                const dataRowsCount = dataProvider.getRowsCount();

                if(keepColumnWidths) {
                    this.setColumnsWidth(worksheet, dataProvider.getColumnsWidths(), cellRange.from.column);
                }

                const mergedCells = [];
                const mergeRanges = [];
                const styles = this.getCellStyles(dataProvider);

                for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                    const row = worksheet.getRow(cellRange.from.row + rowIndex);

                    this.exportRow(rowIndex, columns.length, row, cellRange.from.column, dataProvider, customizeCell,
                        mergedCells, mergeRanges, mergeRowFieldValues, mergeColumnFieldValues, wrapText, styles, privateOptions);

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

                if(headerRowCount > 0) {
                    if(Object.keys(worksheetViewSettings).indexOf('state') === -1) {
                        extend(worksheetViewSettings, privateOptions._getWorksheetFrozenState(dataProvider, cellRange));
                    }
                    privateOptions._trySetAutoFilter(dataProvider, worksheet, cellRange, autoFilterEnabled);
                }

                if(Object.keys(worksheetViewSettings).length > 0) {
                    worksheet.views = [worksheetViewSettings];
                }

                resolve(cellRange);
            }).always(() => {
                this.setLoadPanelOptions(component, initialLoadPanelOptions, privateOptions);
            });
        });
    },

    exportRow: function(rowIndex, cellCount, row, startColumnIndex, dataProvider, customizeCell, mergedCells, mergeRanges,
        mergeRowFieldValues, mergeColumnFieldValues, wrapText, styles, privateOptions) {
        privateOptions._trySetOutlineLevel(dataProvider, row, rowIndex);

        for(let cellIndex = 0; cellIndex < cellCount; cellIndex++) {
            const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
            const excelCell = row.getCell(startColumnIndex + cellIndex);

            if(isDate(cellData.value)) {
                excelCell.value = this.convertDateForExcelJS(cellData.value);
            } else {
                excelCell.value = cellData.value;
            }

            if(isDefined(excelCell.value)) {
                const { bold, alignment: horizontalAlignment, numberFormat } = styles[dataProvider.getStyleId(rowIndex, cellIndex)];

                if(isDefined(numberFormat)) {
                    this.setNumberFormat(excelCell, numberFormat);
                } else if(isString(excelCell.value) && /^[@=+-]/.test(excelCell.value)) {
                    this.setNumberFormat(excelCell, '@');
                }

                privateOptions._trySetFont(excelCell, bold);
                this.setAlignment(excelCell, wrapText, horizontalAlignment);
            }

            if(privateOptions._isHeaderCell(dataProvider, rowIndex, cellIndex)) {
                if(this.cellInMergeRanges(mergedCells, rowIndex, cellIndex)) {
                    const cell = mergedCells[rowIndex][cellIndex];
                    if(cell.merged === false) {
                        excelCell.style = cell.masterCell.style;
                        excelCell.value = cell.masterCell.value;
                    }
                } else {
                    const mergeRange = this.tryGetMergeRange(excelCell, mergedCells, rowIndex, cellIndex, dataProvider, mergeRowFieldValues, mergeColumnFieldValues, privateOptions);

                    if(isDefined(mergeRange)) {
                        mergeRanges.push(mergeRange);
                    }
                }


            }

            if(isFunction(customizeCell)) {
                customizeCell(privateOptions._getCustomizeCellOptions(excelCell, cellData.cellSourceData));
            }
        }
    }
};

//#DEBUG
Export.__internals = { MAX_EXCEL_COLUMN_WIDTH, MAX_DIGIT_WIDTH_IN_PIXELS };
//#ENDDEBUG
