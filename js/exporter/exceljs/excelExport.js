import { getExcelJS } from "../exceljs/exceljs_importer";
import { isDefined } from "../../core/utils/type";

export default {
    excelExport(component, worksheet, options) {
        if(!isDefined(getExcelJS())) { return; }

        let position = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        };

        let columns = component.getVisibleColumns();
        var headerRow = worksheet.getRow(0);

        for(let i = 0; i < columns.length; i++) {
            let cell = headerRow.getCell(i + 1);
            cell.value = columns[i].caption;
        }

        // component.getController("data").loadAll().then(
        //     function(allItems) {
        //         for(let i = 0; i < allItems.length; i++) {
        //             var dataRow = worksheet.addRow();
        //             for(let j = 0; j < allItems[i].values.length; j++) {
        //                 let cell = dataRow.getCell(j + 1);
        //                 cell.value = allItems[i].values[j];
        //             }
        //         }
        //     }
        // );

        return position;

    }
};

