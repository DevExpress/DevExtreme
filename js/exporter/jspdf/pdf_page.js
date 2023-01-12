import { isDefined } from '../../core/utils/type';

export class PdfPage {
    constructor(table) {
        this._tables = isDefined(table) ? [table] : [];
    }

    addTable(table) {
        this._tables.push(table);
    }
}
