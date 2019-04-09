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

    let columns = exportController._getColumns()[0];

    if(columns.length > 0) {
        result.to.column += columns.length - 1;

        if(dataGrid.option("showColumnHeaders")) {
            let headerRow = worksheet.getRow(result.to.row);
            let currentColumnIndex = result.from.column;

            for(let i = 0; i < columns.length; i++) {
                headerRow.getCell(currentColumnIndex).value = columns[i].caption;
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

    return new Promise((resolve) => {
        var items = exportController._getAllItems();

        items.done((items) => {
            for(let rowIndex = 0; rowIndex < items.length; rowIndex++) {
                let dataRow = worksheet.getRow(result.to.row);

                dataRow.outlineLevel = _getDataRowOutlineLevel(exportController, items[rowIndex]);

                let currentColumnIndex = result.from.column;
                for(let cellIndex = 0; cellIndex < items[rowIndex].values.length; cellIndex++) {
                    dataRow.getCell(currentColumnIndex).value = _getDataRowCellValue(exportController, items[rowIndex], cellIndex);

                    currentColumnIndex++;
                }
                result.to.row++;
            }

            if(result.to.row > topLeftCell.row) result.to.row--;

            resolve(result);
        });
    });
}

function _getDataRowCellValue(exportController, dataRow, cellIndex) {
    switch(dataRow.rowType) {
        case "group":
            if(cellIndex === 0) {
                return _getGroupCellValue(exportController, dataRow);
            }

            return _getGroupSummaryCellValue(exportController, dataRow.values[cellIndex]);
        case "totalFooter":
        case "groupFooter":
            if(cellIndex < dataRow.values.length) {
                let value = dataRow.values[cellIndex];

                if(typeUtils.isDefined(value)) {
                    return dataGridCore.getSummaryText(value, exportController.option("summary.texts"));
                } else {
                    return null;
                }
            }
            break;
        default:
            return dataRow.values[cellIndex];
    }
}

function _getGroupSummaryCellValue(exportController, summaryItems) {
    if(Array.isArray(summaryItems)) {
        let value = "";
        for(let i = 0; i < summaryItems.length; i++) {
            value += (i > 0 ? "\n" : "") + dataGridCore.getSummaryText(summaryItems[i], exportController.option("summary.texts"));
        }
        return value;
    }
    return null;
}

function _getDataRowOutlineLevel(exportController, item) {
    if(item.rowType === "totalFooter") return 0;

    return typeUtils.isDefined(item.groupIndex) ? item.groupIndex : exportController._columnsController.getGroupColumns().length;
}

function _getGroupCellValue(exportController, item) {
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

