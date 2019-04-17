import typeUtils from "../../core/utils/type";

function exportDataGrid(options) {
    if(!typeUtils.isDefined(options)) return;

    let { customizeCell, dataGrid, worksheet, topLeftCell = { row: 1, column: 1 } } = options;

    worksheet.properties.outlineProperties = {
        summaryBelow: false,
        summaryRight: false,
    };

    let result = {
        from: { row: topLeftCell.row, column: topLeftCell.column },
        to: { row: topLeftCell.row, column: topLeftCell.column }
    };

    let exportController = dataGrid.getController("export");
    let dataProvider = dataGrid.getDataProvider();

    return new Promise((resolve) => {
        dataProvider.ready().done((controllerRows) => {
            let columns = dataProvider.getColumns();

            if(columns.length > 0) {
                result.to.column += columns.length - 1;

                if(dataGrid.option("showColumnHeaders")) {
                    let headerRow = worksheet.getRow(result.to.row);
                    let currentColumnIndex = result.from.column;

                    for(let i = 0; i < columns.length; i++) {
                        let cellData = dataProvider.getCellData(0, i);
                        headerRow.getCell(currentColumnIndex).value = cellData.value;

                        customizeCell && _callCustomizeCell(customizeCell, headerRow.getCell(currentColumnIndex), cellData);

                        currentColumnIndex++;
                    }

                    if(options.excelFilterEnabled === true) {
                        worksheet.autoFilter = {
                            from: {
                                row: result.from.row,
                                column: result.from.column,
                            },
                            to: {
                                row: result.to.row,
                                column: result.from.column + columns.length - 1
                            }
                        };
                        worksheet.views = [{ state: 'frozen', ySplit: result.to.row }];
                    }
                    result.to.row++;
                }
            }

            for(let rowIndex = 0; rowIndex < controllerRows.length; rowIndex++) {
                let dataRow = worksheet.getRow(result.to.row);

                dataRow.outlineLevel = _getRowOutlineLevel(exportController, controllerRows[rowIndex]);

                let currentColumnIndex = result.from.column;
                for(let cellIndex = 0; cellIndex < controllerRows[rowIndex].values.length; cellIndex++) {
                    let cellData = dataProvider.getCellData(rowIndex + dataProvider.getHeaderRowCount(), cellIndex);
                    dataRow.getCell(currentColumnIndex).value = cellData.value;

                    customizeCell && _callCustomizeCell(customizeCell, dataRow.getCell(currentColumnIndex), cellData);

                    currentColumnIndex++;
                }
                result.to.row++;
            }

            if(result.to.row > topLeftCell.row) result.to.row--;

            resolve(result);
        });
    });
}

function _callCustomizeCell(customizeCell, cell, cellData) {
    customizeCell({
        cell: cell,
        gridCell: {
            column: cellData.cellSourceData.column,
            rowType: cellData.cellSourceData.rowType
        },
        value: cellData.value
    });
}

function _getRowOutlineLevel(exportController, controllerRow) {
    if(controllerRow.rowType === "totalFooter") return 0;

    return typeUtils.isDefined(controllerRow.groupIndex) ? controllerRow.groupIndex : exportController._columnsController.getGroupColumns().length;
}

export { exportDataGrid };

