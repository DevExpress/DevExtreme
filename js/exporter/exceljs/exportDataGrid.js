function exportDataGrid(options) {
    let { dataGrid, worksheet, topLeftCell } = options;

    let result = {
        from: { row: topLeftCell.row, column: topLeftCell.column },
        to: { row: 0, column: 0 }
    };

    let columns = dataGrid.getVisibleColumns().filter((item)=>{
        return item.allowExporting;
    });

    if(dataGrid.option("showColumnHeaders") !== false) {
        let headerRow = worksheet.addRow();

        for(let i = 0; i < columns.length; i++) {
            headerRow.getCell(i + 1).value = columns[i].caption;
        }
    }

    if(options && options.excelFilterEnabled === true) {
        worksheet.autoFilter = {
            from: {
                row: 1,
                column: 1
            },
            to: {
                row: 1,
                column: columns.length
            }
        };
        worksheet.views = [{ state: 'frozen', ySplit: 1 }];
    }

    return new Promise((resolve) => {
        dataGrid.getController("data").loadAll().then((items) => {
            for(let i = 0; i < items.length; i++) {
                var dataRow = worksheet.addRow();
                for(let j = 0; j < items[i].values.length; j++) {
                    dataRow.getCell(j + 1).value = items[i].values[j];
                }
            }
            resolve(result);
        });
    });
}

export { exportDataGrid };

