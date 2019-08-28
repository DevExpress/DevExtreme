import { isDefined } from "../../core/utils/type";

const MAX_DIGIT_WIDTH_IN_PIXELS = 7; // Calibri font with 11pt size

export default function exportDataGrid(options) {
    if(!isDefined(options)) return;

    let { customizeCell, component, worksheet, topLeftCell = { row: 1, column: 1 }, excelFilterEnabled, exportColumnWidths = true } = options;

    worksheet.properties.outlineProperties = {
        summaryBelow: false,
        summaryRight: false
    };

    let result = {
        from: { row: topLeftCell.row, column: topLeftCell.column },
        to: { row: topLeftCell.row, column: topLeftCell.column }
    };

    let dataProvider = component.getDataProvider();

    return new Promise((resolve) => {
        dataProvider.ready().done(() => {
            let columns = dataProvider.getColumns();
            let headerRowCount = dataProvider.getHeaderRowCount();
            let dataRowsCount = dataProvider.getRowsCount();

            if(exportColumnWidths) {
                _setColumnsWidth(worksheet, columns, result.from.column);
            }

            for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                const row = worksheet.getRow(result.from.row + rowIndex);
                _exportRow(rowIndex, columns.length, row, result.from.column, dataProvider, customizeCell);

                if(rowIndex >= headerRowCount) {
                    row.outlineLevel = dataProvider.getGroupLevel(rowIndex);
                }
                if(rowIndex >= 1) {
                    result.to.row++;
                }
            }

            result.to.column += columns.length > 0 ? columns.length - 1 : 0;

            if(excelFilterEnabled === true) {
                if(dataRowsCount > 0) worksheet.autoFilter = result;
                worksheet.views = [{ state: 'frozen', ySplit: result.from.row + dataProvider.getFrozenArea().y - 1 }];
            }

            resolve(result);
        });
    });
}

function _exportRow(rowIndex, cellCount, row, startColumnIndex, dataProvider, customizeCell) {
    for(let cellIndex = 0; cellIndex < cellCount; cellIndex++) {
        const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
        const gridCell = cellData.cellSourceData;

        const excelCell = row.getCell(startColumnIndex + cellIndex);
        excelCell.value = cellData.value;

        if(isDefined(customizeCell)) {
            customizeCell({
                cell: excelCell,
                excelCell: excelCell,
                gridCell: gridCell
            });
        }
    }
}

function _setColumnsWidth(worksheet, columns, startColumnIndex) {
    if(columns) {
        for(let i = 0; i < columns.length; i++) {
            worksheet.getColumn(startColumnIndex + i).width = _convertPixelsWidthToExcelWidth(columns[i].width);
        }
    }
}

function _convertPixelsWidthToExcelWidth(pixelsWidth) {
    if(!pixelsWidth || pixelsWidth < 5) {
        pixelsWidth = 100;
    }
    return Math.min(255, Math.floor((pixelsWidth - 5) / MAX_DIGIT_WIDTH_IN_PIXELS * 100 + 0.5) / 100);
}
