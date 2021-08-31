import { isDefined } from '../../core/utils/type';
import { drawRect } from './pdf_utils';

export class PdfTableData {
    constructor(rows, topLeft) {
        this._rows = [];
        this._rect = {
            x: topLeft.x,
            y: topLeft.y,
            h: 0,
            w: 0
        };
    }

    draw(doc) {
        if(!isDefined(doc)) {
            throw 'doc is required';
        }

        doc.setLineWidth(1);
        drawRect(doc, this._rect.x, this._rect.y, this._rect.w, this._rect.h);
    }
}

function getPdfTableData(rowsInitialData, options) {
    return [
        new PdfTableData([], options.topLeft)
    ];
}

export { getPdfTableData };
