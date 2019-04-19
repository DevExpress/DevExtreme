import typeUtils from "../../core/utils/type";

function exportDataGrid(options) {
    if(!typeUtils.isDefined(options)) return;

    let { customizeCell, dataGrid, worksheet, topLeftCell = { row: 1, column: 1 }, excelFilterEnabled } = options;

    worksheet.properties.outlineProperties = {
        summaryBelow: false,
        summaryRight: false
    };

    let result = {
        from: { row: topLeftCell.row, column: topLeftCell.column },
        to: { row: topLeftCell.row, column: topLeftCell.column }
    };

    let dataProvider = dataGrid.getDataProvider();

    return new Promise((resolve) => {
        dataProvider.ready().done((controllerRows) => {
            let columns = dataProvider.getColumns();
            let headerRowCount = dataProvider.getHeaderRowCount();
            let dataRowsCount = dataProvider.getRowsCount();

            for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                const row = worksheet.getRow(result.to.row);
                if(rowIndex < headerRowCount) {
                    _exportRow(rowIndex, columns.length, row, result.from.column, dataProvider, customizeCell);
                } else {
                    _exportRow(rowIndex, controllerRows[rowIndex - headerRowCount].values.length, row, result.from.column, dataProvider, customizeCell);
                    row.outlineLevel = dataProvider.getGroupLevel(rowIndex);
                }
                result.to.row++;
            }

            result.to.column += columns.length > 0 ? columns.length - 1 : 0;
            result.to.row -= controllerRows.length > 0 || (controllerRows.length === 0 && headerRowCount > 0) ? 1 : 0;

            if(excelFilterEnabled === true) {
                if(dataRowsCount > 0) worksheet.autoFilter = result;
                worksheet.views = [{ state: 'frozen', ySplit: result.from.row + dataProvider.getFrozenArea().y - 1 }];
            }

            resolve(result);
        });
    });
}

function _exportRow(rowIndex, cellCount, row, currentColumnIndex, dataProvider, customizeCell) {
    for(let cellIndex = 0; cellIndex < cellCount; cellIndex++) {
        const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
        const cell = row.getCell(currentColumnIndex);

        cell.value = cellData.value;

        if(typeUtils.isDefined(customizeCell)) {
            customizeCell({
                cell: cell,
                gridCell: {
                    column: cellData.cellSourceData.column,
                    rowType: cellData.cellSourceData.rowType,
                    data: cellData.cellSourceData.data,
                    value: cellData.value,
                    groupIndex: cellData.cellSourceData.groupIndex
                }
            });
        }
        currentColumnIndex++;
    }
}

export { exportDataGrid };

