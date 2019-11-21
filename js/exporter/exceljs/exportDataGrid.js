import { isDefined, isObject } from "../../core/utils/type";
import excelFormatConverter from "../excel_format_converter";
import { extend } from "../../core/utils/extend";

// docs.microsoft.com/en-us/office/troubleshoot/excel/determine-column-widths - "Description of how column widths are determined in Excel"
const MAX_DIGIT_WIDTH_IN_PIXELS = 7; // Calibri font with 11pt size

// support.office.com/en-us/article/change-the-column-width-and-row-height-72f5e3cc-994d-43e8-ae58-9774a0905f46 - "Column.Max - 255"
// support.office.com/en-us/article/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3 - "Column width limit - 255 characters"
const MAX_EXCEL_COLUMN_WIDTH = 255;

function exportDataGrid(options) {
    if(!isDefined(options)) return;

    let {
        customizeCell,
        component,
        worksheet,
        topLeftCell = { row: 1, column: 1 },
        excelFilterEnabled = undefined,
        keepColumnWidths = true,
        selectedRowsOnly = false
    } = options;

    worksheet.properties.outlineProperties = {
        summaryBelow: false,
        summaryRight: false
    };

    let cellsRange = {
        from: { row: topLeftCell.row, column: topLeftCell.column },
        to: { row: topLeftCell.row, column: topLeftCell.column }
    };

    let dataProvider = component.getDataProvider(selectedRowsOnly);

    return new Promise((resolve) => {
        dataProvider.ready().done(() => {
            let columns = dataProvider.getColumns();
            let headerRowCount = dataProvider.getHeaderRowCount();
            let dataRowsCount = dataProvider.getRowsCount();

            if(keepColumnWidths) {
                _setColumnsWidth(worksheet, columns, cellsRange.from.column);
            }

            let mergedCells = [];
            let mergeRanges = [];

            for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                const row = worksheet.getRow(cellsRange.from.row + rowIndex);

                _exportRow(rowIndex, columns.length, row, cellsRange.from.column, dataProvider, customizeCell, headerRowCount, mergedCells, mergeRanges);

                if(rowIndex >= headerRowCount) {
                    row.outlineLevel = dataProvider.getGroupLevel(rowIndex);
                }
                if(rowIndex >= 1) {
                    cellsRange.to.row++;
                }
            }

            _mergeCells(worksheet, topLeftCell, mergeRanges);

            cellsRange.to.column += columns.length > 0 ? columns.length - 1 : 0;

            if(headerRowCount > 0) {
                _setFrozen(dataProvider, worksheet, cellsRange);
                _setAutoFilter(dataProvider, worksheet, component, cellsRange, excelFilterEnabled);
            }

            resolve(cellsRange);
        });
    });
}

function _exportRow(rowIndex, cellCount, row, startColumnIndex, dataProvider, customizeCell, headerRowCount, mergedCells, mergeRanges) {
    const styles = dataProvider.getStyles();

    for(let cellIndex = 0; cellIndex < cellCount; cellIndex++) {
        const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
        const gridCell = cellData.cellSourceData;

        const excelCell = row.getCell(startColumnIndex + cellIndex);
        excelCell.value = cellData.value;

        if(isDefined(excelCell.value)) {
            const { bold, alignment, wrapText, format, dataType } = styles[dataProvider.getStyleId(rowIndex, cellIndex)];

            let numberFormat = _tryConvertToExcelNumberFormat(format, dataType);
            if(isDefined(numberFormat)) {
                numberFormat = numberFormat.replace(/&quot;/g, '');
            }

            _setNumberFormat(excelCell, numberFormat);
            _setFont(excelCell, bold);
            _setAlignment(excelCell, wrapText, alignment);
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

function _setAutoFilter(dataProvider, worksheet, component, cellsRange, excelFilterEnabled) {
    if(!isDefined(excelFilterEnabled)) {
        excelFilterEnabled = !!component.option("export.excelFilterEnabled");
    }

    if(excelFilterEnabled) {
        if(!isDefined(worksheet.autoFilter) && dataProvider.getRowsCount() > 0) {
            worksheet.autoFilter = cellsRange;
        }
    }
}

function _setFrozen(dataProvider, worksheet, cellsRange) {
    if(worksheet.views.length === 0) {
        worksheet.views = [{ state: 'frozen', ySplit: cellsRange.from.row + dataProvider.getFrozenArea().y - 1 }];
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
    var result = {
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
}

function _setColumnsWidth(worksheet, columns, startColumnIndex) {
    if(!isDefined(columns)) {
        return;
    }
    for(let i = 0; i < columns.length; i++) {
        const columnWidth = columns[i].width;
        if((typeof columnWidth === "number") && isFinite(columnWidth)) {
            worksheet.getColumn(startColumnIndex + i).width =
                Math.min(MAX_EXCEL_COLUMN_WIDTH, Math.floor(columnWidth / MAX_DIGIT_WIDTH_IN_PIXELS * 100) / 100);
        }
    }
}

function _tryGetMergeRange(rowIndex, cellIndex, mergedCells, dataProvider) {
    if(!mergedCells[rowIndex] || !mergedCells[rowIndex][cellIndex]) {
        let cellMerge = dataProvider.getCellMerging(rowIndex, cellIndex);
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

export { exportDataGrid, MAX_EXCEL_COLUMN_WIDTH };
