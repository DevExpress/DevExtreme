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


    let columns = dataGrid.getVisibleColumns().filter((item)=>{
        return item.allowExporting;
    });

    if(dataGrid.option("showColumnHeaders") !== false) {
        var headerRow = worksheet.addRow();

        for(let i = 0; i < columns.length; i++) {
            headerRow.getCell(i + 1).value = columns[i].caption;
        }
    }

    for(let i = 0; i < columns.length; i++) {
        worksheet.getColumn(i + 1).width = columns[i].width;
    }

    if(dataGrid.option().export.excelFilterEnabled === true) {
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

    dataGrid.getController("data").loadAll().then((items) => {
        for(let i = 0; i < items.length; i++) {
            var dataRow = worksheet.addRow();
            for(let j = 0; j < items[i].values.length; j++) {
                dataRow.getCell(j + 1).value = items[i].values[j];
            }
        }
    });

    return position;
}

export { exportDataGrid };

