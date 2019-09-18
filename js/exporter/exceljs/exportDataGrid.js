import { isDefined } from "../../core/utils/type";

// docs.microsoft.com/en-us/office/troubleshoot/excel/determine-column-widths - "Description of how column widths are determined in Excel"
const MAX_DIGIT_WIDTH_IN_PIXELS = 7; // Calibri font with 11pt size

// support.office.com/en-us/article/change-the-column-width-and-row-height-72f5e3cc-994d-43e8-ae58-9774a0905f46 - "Column.Max - 255"
// support.office.com/en-us/article/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3 - "Column width limit - 255 characters"
const MAX_EXCEL_COLUMN_WIDTH = 255;

function exportDataGrid(options) {
    if(!isDefined(options)) return;

    let { customizeCell, component, worksheet, topLeftCell = { row: 1, column: 1 }, excelFilterEnabled, keepColumnWidths = true, selectedRowsOnly = false } = options;

    worksheet.properties.outlineProperties = {
        summaryBelow: false,
        summaryRight: false
    };

    let result = {
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

export { exportDataGrid, MAX_EXCEL_COLUMN_WIDTH };
