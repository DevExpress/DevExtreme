function exportDataGrid(options) {
    checkAssignPolyfill();

    let { dataGrid, worksheet, topLeftCell = { row: 0, column: 0 } } = options;

    let result = {
        from: { row: topLeftCell.row, column: topLeftCell.column },
        to: { row: 0, column: 0 }
    };

    let columns = dataGrid.getVisibleColumns().filter(item => item.allowExporting);

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

function checkAssignPolyfill() {
    if(typeof Object.assign !== 'function') {
        Object.defineProperty(Object, "assign", {
            value: function assign(target) {
                if(target == null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                let to = Object(target);

                for(let index = 1; index < arguments.length; index++) {
                    let nextSource = arguments[index];

                    if(nextSource != null) {
                        for(let nextKey in nextSource) {
                            if(Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            },
            writable: true,
            configurable: true
        });
    }
}

export { exportDataGrid, checkAssignPolyfill };

