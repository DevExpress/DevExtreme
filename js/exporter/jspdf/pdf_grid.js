import { isDefined } from '../../core/utils/type';
import { PdfTable } from './pdf_table';

export class PdfGrid {
    constructor(splitByColumns, columnWidths) {
        this._splitByColumns = splitByColumns ?? [];
        this._columnWidths = columnWidths ?? [];
        this._newPageTables = [];
        this._tables = [];
        this._currentHorizontalTables = null;
    }

    _addLastTableToNewPages() {
        this._newPageTables.push(this._currentHorizontalTables[this._currentHorizontalTables.length - 1]);
    }

    startNewTable(drawTableBorder, firstTableRect, firstTableOnNewPage, splitByColumns) {
        if(isDefined(splitByColumns)) {
            this._splitByColumns = splitByColumns;
        }

        const firstTableEndColumnIndex = this._splitByColumns[0]?.columnIndex ?? this._columnWidths.length;
        this._currentHorizontalTables = [
            new PdfTable(drawTableBorder, firstTableRect, this._columnWidths.slice(0, firstTableEndColumnIndex))
        ];
        if(firstTableOnNewPage) {
            this._addLastTableToNewPages();
        }

        if(isDefined(this._splitByColumns)) {
            for(let i = 0; i < this._splitByColumns.length; i++) {
                const beginColumnIndex = this._splitByColumns[i].columnIndex;
                const endColumnIndex = this._splitByColumns[i + 1]?.columnIndex ?? this._columnWidths.length;

                this._currentHorizontalTables.push(
                    new PdfTable(drawTableBorder, this._splitByColumns[i].tableRect, this._columnWidths.slice(beginColumnIndex, endColumnIndex))
                );
                if(this._splitByColumns[i].drawOnNewPage) {
                    this._addLastTableToNewPages();
                }
            }
        }

        this._tables.push(...this._currentHorizontalTables);
    }

    addRow(cells, rowHeight) {
        let currentTableIndex = 0;
        let currentTableCells = [];
        for(let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
            const isNewTableColumn = this._splitByColumns.filter((splitByColumn) => splitByColumn.columnIndex === cellIndex)[0];
            if(isNewTableColumn) {
                this._currentHorizontalTables[currentTableIndex].addRow(currentTableCells, rowHeight);
                currentTableIndex++;
                currentTableCells = [];
            }
            currentTableCells.push(cells[cellIndex]);
        }
        this._currentHorizontalTables[currentTableIndex].addRow(currentTableCells, rowHeight);
    }

    mergeCellsBySpanAttributes() {
        this._tables.forEach((table) => {
            for(let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
                for(let cellIndex = 0; cellIndex < table.rows[rowIndex].length; cellIndex++) {
                    const cell = table.rows[rowIndex][cellIndex];
                    if(isDefined(cell.rowSpan)) {
                        for(let i = 1; i < cell.rowSpan; i++) {
                            const mergeCell = table.rows[rowIndex + i][cellIndex];
                            if(isDefined(mergeCell)) {
                                cell._rect.h += mergeCell._rect.h;
                                mergeCell._rect.h = 0;
                                mergeCell.skip = true;
                            }
                        }
                    }
                    if(isDefined(cell.colSpan)) {
                        for(let i = 1; i < cell.colSpan; i++) {
                            const mergeCell = table.rows[rowIndex][cellIndex + i];
                            if(isDefined(mergeCell)) {
                                cell._rect.w += mergeCell._rect.w;
                                mergeCell._rect.w = 0;
                                mergeCell.skip = true;
                            }
                        }
                    }
                }
            }
        });
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
