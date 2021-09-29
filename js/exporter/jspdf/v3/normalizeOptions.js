import { isNumeric } from '../../../core/utils/type';

function normalizeBoundaryValue(value) {
    if(isNumeric(value)) {
        return {
            top: value,
            right: value,
            bottom: value,
            left: value
        };
    }
    return {
        top: value?.top ?? 0,
        right: value?.right ?? 0,
        bottom: value?.bottom ?? 0,
        left: value?.left ?? 0,
    };
}

function normalizeRowsInfo(rowsInfo) {
    rowsInfo.forEach(row => {
        row.cells.forEach(({ pdfCell }) => {
            pdfCell.padding = normalizeBoundaryValue(pdfCell.padding);
        });
    });
}

export { normalizeRowsInfo, normalizeBoundaryValue };
