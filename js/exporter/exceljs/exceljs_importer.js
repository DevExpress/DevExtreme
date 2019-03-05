import Errors from "../../ui/widget/ui.errors";
import { getWindow } from "../../core/utils/window";
let ExcelJS;

function getExcelJS() {
    if(!ExcelJS) {
        ExcelJS = requestExcelJS();
    }

    return ExcelJS;
}

function requestExcelJS() {
    const window = getWindow();
    const excel = window && window.ExcelJS;

    if(!excel) {
        throw Errors.Error("E1041", "ExcelJS");
    }

    return excel;
}

export { getExcelJS };
