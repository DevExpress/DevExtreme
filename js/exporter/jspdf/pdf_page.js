export class PdfPage {
    constructor(tables) {
        this._tables = tables ?? [];
    }

    addTable(table) {
        this._tables.push(table);
    }
}
