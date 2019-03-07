import { getExcelJS } from "../exceljs/exceljs_importer";
import { isDefined } from "../../core/utils/type";

function exportDataGrid(dataGrid, worksheet, options) {
    if(!isDefined(getExcelJS())) { return; }

    let position = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    if(dataGrid.option("showColumnHeaders") !== false) {
        let columns = dataGrid.getVisibleColumns();
        var headerRow = worksheet.addRow();

        for(let i = 0; i < columns.length; i++) {
            let cell = headerRow.getCell(i + 1);
            cell.value = columns[i].caption;
            worksheet.getColumn(i + 1).width = columns[i].width;
        }
    }

    let dataSource = dataGrid.getDataSource();
    if(dataSource) {
        let allItems = dataSource._items;

        for(let i = 0; i < allItems.length; i++) {
            worksheet.addRow().getCell(1).value = allItems[i];
            // for(let j = 0; j < allItems[i].length; j++) {
            //     let cell = dataRow.getCell(j + 1);
            //     cell.value = allItems[i].values[j];
            // }
        }
    }


    return position;
}

export { exportDataGrid };

