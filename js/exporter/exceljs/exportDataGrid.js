import typeUtils from "../../core/utils/type";
import dataGridCore from "../../ui/data_grid/ui.data_grid.core";

function exportDataGrid(options) {
    if(!typeUtils.isDefined(options)) return;

    let { dataGrid, worksheet, topLeftCell = { row: 1, column: 1 } } = options;

    worksheet.properties.outlineProperties = {
        summaryBelow: false,
        summaryRight: false,
    };

    let result = {
        from: { row: topLeftCell.row, column: topLeftCell.column },
        to: { row: topLeftCell.row, column: topLeftCell.column }
    };

    let exportController = dataGrid.getController("export");

    let headerRowCount = dataGrid.option("showColumnHeaders") ? exportController._getColumns().length - 1 : 0;
    let columns = exportController._getColumns()[0];

    if(dataGrid.option("showColumnHeaders") && columns.length > 0) {
        let headerRow = worksheet.getRow(result.to.row);
        let currentColumnIndex = result.from.column;

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
        var items = exportController._getAllItems();

        items.done((items) => {
            for(let rowIndex = 0; rowIndex < items.length; rowIndex++) {
                let dataRow = worksheet.getRow(result.to.row);

                dataRow.outlineLevel = _getOutlineLevel(exportController, items[rowIndex], rowIndex, headerRowCount);

                let currentColumnIndex = result.from.column;
                for(let cellIndex = 0; cellIndex < items[rowIndex].values.length; cellIndex++) {

                    switch(items[rowIndex].rowType) {
                        case "group":
                            if(cellIndex < 1) {
                                dataRow.getCell(currentColumnIndex).value = _getGroupValue(exportController, items[rowIndex]);
                            } else {
                                dataRow.getCell(currentColumnIndex).value = null;
                            }
                            break;
                        case "totalFooter":
                        case "groupFooter":
                            if(cellIndex < items[rowIndex].values.length) {
                                let value = items[rowIndex].values[cellIndex];

                                if(typeUtils.isDefined(value)) {
                                    dataRow.getCell(currentColumnIndex).value = dataGridCore.getSummaryText(value, exportController.option("summary.texts"));
                                } else {
                                    dataRow.getCell(currentColumnIndex).value = null;
                                }
                            }
                            break;
                        default:
                            dataRow.getCell(currentColumnIndex).value = items[rowIndex].values[cellIndex];
                    }

                    currentColumnIndex++;
                }
                result.to.row++;
            }
            result.to.row--;
            resolve(result);
        });
    });
}

function _getOutlineLevel(exportController, item, rowIndex, headerRowCount) {
    if(rowIndex < headerRowCount || item.rowType === "totalFooter") return 0;

    return typeUtils.isDefined(item.groupIndex) ? item.groupIndex : exportController._columnsController.getGroupColumns().length;
}

function _getGroupValue(exportController, item) {
    var groupColumn = exportController._columnsController.getGroupColumns()[item.groupIndex],
        value = dataGridCore.getDisplayValue(groupColumn, item.key[item.groupIndex], item.data, item.rowType),
        result = groupColumn.caption + ": " + dataGridCore.formatValue(value, groupColumn);

    var summaryCells = item.summaryCells;
    if(summaryCells && summaryCells[0] && summaryCells[0].length) {
        result += " " + dataGridCore.getGroupRowSummaryText(summaryCells[0], exportController.option("summary.texts"));
    }

    return result;
}

export { exportDataGrid };

