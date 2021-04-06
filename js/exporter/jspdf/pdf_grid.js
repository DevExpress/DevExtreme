import { isDefined } from '../../core/utils/type';
import { PdfTable } from './pdf_table';

export class PdfGrid {
    constructor(splitByColumns) {
        this._splitByColumns = splitByColumns ?? [];
        this._newPageTables = [];
        this._tables = [];
        this._currentHorizontalTables = null;
    }

    _addLastTableToNewPages() {
        this._newPageTables.push(this._currentHorizontalTables[this._currentHorizontalTables.length - 1]);
    }

    startNewTable(drawTableBorder, firstTableRect, firstTableOnNewPage, splitByColumns) {
        this._currentHorizontalTables = [
            new PdfTable(drawTableBorder, firstTableRect)
        ];
        if(firstTableOnNewPage) {
            this._addLastTableToNewPages();
        }

        if(isDefined(splitByColumns)) {
            this._splitByColumns = splitByColumns;
        }

        if(isDefined(this._splitByColumns)) {
            this._splitByColumns.forEach((splitByColumn) => {
                this._currentHorizontalTables.push(
                    new PdfTable(drawTableBorder, splitByColumn.tableRect)
                );
                if(splitByColumn.drawOnNewPage) {
                    this._addLastTableToNewPages();
                }
            });
        }

        this._tables.push(...this._currentHorizontalTables);
    }

    addRow(cells) {
        let currentTableIndex = 0;
        let currentTableCells = [];
        for(let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
            const isNewTableColumn = this._splitByColumns.filter((splitByColumn) => splitByColumn.columnIndex === cellIndex)[0];
            if(isNewTableColumn) {
                this._currentHorizontalTables[currentTableIndex].addRow(currentTableCells);
                currentTableIndex++;
                currentTableCells = [];
            }
            currentTableCells.push(cells[cellIndex]);
        }
        this._currentHorizontalTables[currentTableIndex].addRow(currentTableCells);
    }

    drawTo(doc) {
        this._tables.forEach((table) => {
            if(this._newPageTables.indexOf(table) !== -1) {
                doc.addPage();
            }
            table.drawTo(doc);
        });
    }
}
