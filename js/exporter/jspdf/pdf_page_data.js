export class PdfPageData {
    constructor() {
        this._tables = [];
    }

    addPage(table) {
        this._tables.push(table);
    }

    draw(doc) {
        for(let tableIndex = 0; tableIndex < this._tables.length; tableIndex++) {
            this._tables[tableIndex].draw(doc);
        }
    }
}

function getPdfPageData(tablesData, options) {
    const pageData = new PdfPageData();
    tablesData.forEach(table => pageData.addPage(table));

    return [ pageData ];
}

export { getPdfPageData };
