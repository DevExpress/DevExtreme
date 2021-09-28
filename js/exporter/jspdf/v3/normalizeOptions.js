import { isNumeric, isDefined } from '../../../core/utils/type';
import Color from '../../../color';

function normalizeColor(value) {
    const color = new Color(value);
    if(!color.colorIsInvalid) {
        const toHex = (num) => { return num.toString(16).padStart(2, '0'); };
        return '#' + toHex(color.r) + toHex(color.g) + toHex(color.b);
    }
    return undefined;
}

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

function normalizeOptions(options) {
    // TODO: margins
    // TODO: tableWidth
    // TODO: tableLineWidth
    // TODO: tableLineColor
    // ?

    if(isDefined(options.rowOptions)) {
        const headerStyles = options.rowOptions?.headerStyles;
        if(isDefined(headerStyles?.backgroundColor)) {
            headerStyles.backgroundColor = normalizeColor(headerStyles.backgroundColor);
        }
        // TODO: groupStyles, summaryStyles, ... ???
    }
}

function normalizeRowsInfo(rowsInfo) {
    rowsInfo.forEach(row => {
        row.cells.forEach(({ pdfCell }) => {
            pdfCell.padding = normalizeBoundaryValue(pdfCell.padding);
            if(isDefined(pdfCell.textColor)) {
                pdfCell.textColor = normalizeColor(pdfCell.textColor);
            }
            if(isDefined(pdfCell.backgroundColor)) {
                pdfCell.backgroundColor = normalizeColor(pdfCell.backgroundColor);
            }
            if(isDefined(pdfCell.borderColor)) {
                pdfCell.borderColor = normalizeColor(pdfCell.borderColor);
            }
        });
    });
}

export { normalizeOptions, normalizeRowsInfo, normalizeBoundaryValue };
