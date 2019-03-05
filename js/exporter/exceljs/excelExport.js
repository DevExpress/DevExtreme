
// var $ = require("../core/renderer"),
//     domAdapter = require("../core/dom_adapter"),
//     windowUtils = require("../core/utils/window"),
//     window = windowUtils.getWindow(),
//     navigator = windowUtils.getNavigator(),
//     eventsEngine = require("../events/core/events_engine"),
//     errors = require("../ui/widget/ui.errors"),
//     typeUtils = require("../core/utils/type"),

//     FILE_EXTESIONS = {
//         EXCEL: "xlsx",
//         CSS: "css",
//         PNG: "png",
//         JPEG: "jpeg",
//         GIF: "gif",
//         SVG: "svg",
//         PDF: "pdf"
//     };

// var MIME_TYPES = exports.MIME_TYPES = {
//     CSS: "text/css",
//     EXCEL: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     PNG: "image/png",
//     JPEG: "image/jpeg",
//     GIF: "image/gif",
//     SVG: "image/svg+xml",
//     PDF: "application/pdf"
// };

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
        var headerRow = worksheet.getRow(4);
        headerRow.font = { bold: true };

        for(let i = 0; i < columns.length; i++) {
            let cell = headerRow.getCell(i + 1);
            cell.value = columns[i].caption;
        }


        component.getController("data").loadAll().then(
            function(allItems) {
                for(let i = 0; i < allItems.length; i++) {
                    var dataRow = worksheet.addRow();
                    for(let j = 0; j < allItems[i].values.length; j++) {
                        let cell = dataRow.getCell(j + 1);
                        cell.value = allItems[i].values[j];
                    }
                }
            }
        ).then(function() {
            return position;
        });

    }
};

