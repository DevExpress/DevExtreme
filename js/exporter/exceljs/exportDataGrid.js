function exportDataGrid(options) {
    if(!options) return;

    let { dataGrid, worksheet, topLeftCell = { row: 1, column: 1 } } = options;

    let result = {
        from: { row: topLeftCell.row, column: topLeftCell.column },
        to: { row: topLeftCell.row, column: topLeftCell.column }
    };

    let columns = dataGrid.getVisibleColumns().filter(item => item.allowExporting);
    let currentColumnIndex = result.from.column;

    if(dataGrid.option("showColumnHeaders") && columns.length > 0) {
        let headerRow = worksheet.getRow(result.to.row);

        for(let i = 0; i < columns.length; i++) {
            headerRow.getCell(currentColumnIndex).value = columns[i].caption;
            currentColumnIndex++;
        }

        if(columns.length > 0) {
            result.to.column += columns.length - 1;
        }

        if(options.excelFilterEnabled === true) {
            worksheet.autoFilter = {
                from: {
                    row: result.from.row,
                    column: result.from.column,
                },
                to: {
                    row: result.to.row,
                    column: result.to.column
                }
            };
            worksheet.views = [{ state: 'frozen', ySplit: result.to.row }];
        }
    }

    result.to.row++;

    return new Promise((resolve) => {
        dataGrid.getController("data").loadAll().then((items) => {
            for(let i = 0; i < items.length; i++) {
                var dataRow = worksheet.getRow(result.to.row);
                currentColumnIndex = result.from.column;
                for(let j = 0; j < items[i].values.length; j++) {
                    dataRow.getCell(currentColumnIndex).value = items[i].values[j];
                    currentColumnIndex++;
                }
                result.to.row++;
            }
            result.to.row--;
            resolve(result);
        });
    });
}

export { exportDataGrid };

