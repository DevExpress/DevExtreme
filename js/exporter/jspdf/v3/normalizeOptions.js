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

function normalizeOptions(rows) {
    rows.forEach(row => {
        row.cells.forEach(({ pdfCell }) => {
            pdfCell.padding = normalizeBoundaryValue(pdfCell.padding);
            // TODO: normalizeTextColor()
            // TODO: normalizeBackgroundColor()
            // TODO: ...
        });
    });
}

export { normalizeOptions, normalizeBoundaryValue };
