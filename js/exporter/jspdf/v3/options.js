import { isDefined, isNumeric } from '../../../core/utils/type';

function normalizeOptions(rows) {
    rows.forEach(row => {
        row.cells.forEach(({ pdfCell }) => {
            normalizePadding(pdfCell);
        });
    });
}

function normalizePadding(pdfCell) {
    if(!isDefined(pdfCell.padding)) {
        pdfCell.padding = { top: 0, right: 0, bottom: 0, left: 0 };
    } else {
        if(isNumeric(pdfCell.padding)) {
            const padding = pdfCell.padding;
            pdfCell.padding = {
                top: padding,
                right: padding,
                bottom: padding,
                left: padding
            };
        } else {
            pdfCell.padding.top = pdfCell.padding.top ?? 0;
            pdfCell.padding.right = pdfCell.padding.right ?? 0;
            pdfCell.padding.bottom = pdfCell.padding.bottom ?? 0;
            pdfCell.padding.left = pdfCell.padding.left ?? 0;
        }
    }
}

export { normalizeOptions };
