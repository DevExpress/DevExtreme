import { isDefined, isString, isObject, isDate } from '../../core/utils/type';
import excelFormatConverter from '../excel_format_converter';
import messageLocalization from '../../localization/message';
import { extend } from '../../core/utils/extend';

// docs.microsoft.com/en-us/office/troubleshoot/excel/determine-column-widths - "Description of how column widths are determined in Excel"
const MAX_DIGIT_WIDTH_IN_PIXELS = 7; // Calibri font with 11pt size

// support.office.com/en-us/article/change-the-column-width-and-row-height-72f5e3cc-994d-43e8-ae58-9774a0905f46 - "Column.Max - 255"
// support.office.com/en-us/article/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3 - "Column width limit - 255 characters"
const MAX_EXCEL_COLUMN_WIDTH = 255;

function exportDataGrid(options) {
    if(!isDefined(options)) return;

    const {
        customizeCell,
        component,
        worksheet,
        topLeftCell,
        autoFilterEnabled,
        keepColumnWidths,
        selectedRowsOnly,
        loadPanel
    } = _getFullOptions(options);

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
            const headerRowCount = dataProvider.getHeaderRowCount();
            const dataRowsCount = dataProvider.getRowsCount();

            if(keepColumnWidths) {
                _setColumnsWidth(worksheet, columns, cellRange.from.column);
            }

            const mergedCells = [];
            const mergeRanges = [];

            for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                const row = worksheet.getRow(cellRange.from.row + rowIndex);

                _exportRow(rowIndex, columns.length, row, cellRange.from.column, dataProvider, customizeCell, headerRowCount, mergedCells, mergeRanges, wrapText);

                if(rowIndex >= headerRowCount) {
                    row.outlineLevel = dataProvider.getGroupLevel(rowIndex);
                }
                if(rowIndex >= 1) {
                    cellRange.to.row++;
                }
            }

            _mergeCells(worksheet, topLeftCell, mergeRanges);

            cellRange.to.column += columns.length > 0 ? columns.length - 1 : 0;

            const worksheetViewSettings = worksheet.views[0] || {};

            if(component.option('rtlEnabled')) {
                worksheetViewSettings.rightToLeft = true;
            }

            if(headerRowCount > 0) {
                if(Object.keys(worksheetViewSettings).indexOf('state') === -1) {
                    extend(worksheetViewSettings, { state: 'frozen', ySplit: cellRange.from.row + dataProvider.getFrozenArea().y - 1 });
                }
                _setAutoFilter(dataProvider, worksheet, cellRange, autoFilterEnabled);
            }

            if(Object.keys(worksheetViewSettings).length > 0) {
                worksheet.views = [worksheetViewSettings];
            }

            resolve(cellRange);
        }).always(() => {
            component.option('loadPanel', initialLoadPanelOptions);
        });
    });
}

function _getFullOptions(options) {
    const fullOptions = extend({}, options);
    if(!isDefined(fullOptions.topLeftCell)) {
        fullOptions.topLeftCell = { row: 1, column: 1 };
    } else if(isString(fullOptions.topLeftCell)) {
        const { row, col } = fullOptions.worksheet.getCell(fullOptions.topLeftCell);
        fullOptions.topLeftCell = { row, column: col };
    }
    if(!isDefined(fullOptions.keepColumnWidths)) {
        fullOptions.keepColumnWidths = true;
    }
    if(!isDefined(fullOptions.selectedRowsOnly)) {
        fullOptions.selectedRowsOnly = false;
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
    if(!isDefined(fullOptions.autoFilterEnabled)) {
        fullOptions.autoFilterEnabled = false;
    }

    return fullOptions;
}

function _exportRow(rowIndex, cellCount, row, startColumnIndex, dataProvider, customizeCell, headerRowCount, mergedCells, mergeRanges, wrapText) {
    const styles = dataProvider.getStyles();

    for(let cellIndex = 0; cellIndex < cellCount; cellIndex++) {
        const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
        const gridCell = cellData.cellSourceData;

        const excelCell = row.getCell(startColumnIndex + cellIndex);

        if(isDate(cellData.value)) {
            excelCell.value = _convertDateForExcelJS(cellData.value);
        } else {
            excelCell.value = cellData.value;
        }

        if(isDefined(excelCell.value)) {
            const { bold, alignment: horizontalAlignment, format, dataType } = styles[dataProvider.getStyleId(rowIndex, cellIndex)];

            let numberFormat = _tryConvertToExcelNumberFormat(format, dataType);
            if(isDefined(numberFormat)) {
                numberFormat = numberFormat.replace(/&quot;/g, '');
            } else if(isString(excelCell.value) && /^[@=+-]/.test(excelCell.value)) {
                numberFormat = '@';
            }

            _setNumberFormat(excelCell, numberFormat);
            _setFont(excelCell, bold);
            _setAlignment(excelCell, wrapText, horizontalAlignment);
        }

        if(isDefined(customizeCell)) {
            customizeCell({
                cell: excelCell,
                excelCell: excelCell,
                gridCell: gridCell
            });
        }

        if(rowIndex < headerRowCount) {
            const mergeRange = _tryGetMergeRange(rowIndex, cellIndex, mergedCells, dataProvider);
            if(isDefined(mergeRange)) {
                mergeRanges.push(mergeRange);
            }
        }
    }
}

function _convertDateForExcelJS(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
}

function _setAutoFilter(dataProvider, worksheet, cellRange, autoFilterEnabled) {
    if(autoFilterEnabled) {
        if(!isDefined(worksheet.autoFilter) && dataProvider.getRowsCount() > 0) {
            worksheet.autoFilter = cellRange;
        }
    }
}

function _setNumberFormat(excelCell, numberFormat) {
    excelCell.numFmt = numberFormat;
}

function _tryConvertToExcelNumberFormat(format, dataType) {
    const newFormat = _formatObjectConverter(format, dataType);
    const currency = newFormat.currency;

    format = newFormat.format;
    dataType = newFormat.dataType;

    return excelFormatConverter.convertFormat(format, newFormat.precision, dataType, currency);
}

function _formatObjectConverter(format, dataType) {
    const result = {
        format: format,
        precision: format && format.precision,
        dataType: dataType
    };

    if(isObject(format)) {
        return extend(result, format, {
            format: format.formatter || format.type,
            currency: format.currency
        });
    }

    return result;
}

function _setFont(excelCell, bold) {
    if(isDefined(bold)) {
        excelCell.font = excelCell.font || {};
        excelCell.font.bold = bold;
    }
}

function _setAlignment(excelCell, wrapText, horizontalAlignment) {
    excelCell.alignment = excelCell.alignment || {};

    if(isDefined(wrapText)) {
        excelCell.alignment.wrapText = wrapText;
    }
    if(isDefined(horizontalAlignment)) {
        excelCell.alignment.horizontal = horizontalAlignment;
    }

    excelCell.alignment.vertical = 'top';
}

function _setColumnsWidth(worksheet, columns, startColumnIndex) {
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
}

function _tryGetMergeRange(rowIndex, cellIndex, mergedCells, dataProvider) {
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
}

function _mergeCells(worksheet, topLeftCell, mergeRanges) {
    mergeRanges.forEach((mergeRange) => {
        worksheet.mergeCells(mergeRange.start.row + topLeftCell.row, mergeRange.start.column + topLeftCell.column, mergeRange.end.row + topLeftCell.row, mergeRange.end.column + topLeftCell.column);
    });
}

export { exportDataGrid, MAX_EXCEL_COLUMN_WIDTH, _getFullOptions };
