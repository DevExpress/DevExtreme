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

    startNewTable(drawTableBorder, firstTableTopLeft, firstTableOnNewPage, splitByColumns, firstColumnWidth) {
        if(isDefined(splitByColumns)) {
            this._splitByColumns = splitByColumns;
        }

        const firstTableEndColumnIndex = this._splitByColumns[0]?.columnIndex ?? this._columnWidths.length;
        this._currentHorizontalTables = [
            new PdfTable(drawTableBorder, firstTableTopLeft, this._columnWidths.slice(0, firstTableEndColumnIndex), firstColumnWidth)
        ];
        if(firstTableOnNewPage) {
            this._addLastTableToNewPages();
        }

        if(isDefined(this._splitByColumns)) {
            for(let i = 0; i < this._splitByColumns.length; i++) {
                const beginColumnIndex = this._splitByColumns[i].columnIndex;
                const endColumnIndex = this._splitByColumns[i + 1]?.columnIndex ?? this._columnWidths.length;

                this._currentHorizontalTables.push(
                    new PdfTable(drawTableBorder, this._splitByColumns[i].tableTopLeft, this._columnWidths.slice(beginColumnIndex, endColumnIndex))
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
                this._trySplitColSpanArea(cells, cellIndex);
                currentTableIndex++;
                currentTableCells = [];
            }
            currentTableCells.push(cells[cellIndex]);
        }
        this._currentHorizontalTables[currentTableIndex].addRow(currentTableCells, rowHeight);
    }

    _trySplitColSpanArea(cells, splitIndex) {
        const colSpanArea = this._findColSpanArea(cells, splitIndex);
        if(isDefined(colSpanArea)) {
            const leftAreaColSpan = splitIndex - colSpanArea.startIndex - 1;
            const rightAreaColSpan = colSpanArea.endIndex - splitIndex;

            cells[splitIndex].text = cells[colSpanArea.startIndex].text;
            for(let index = colSpanArea.startIndex; index <= colSpanArea.endIndex; index++) {
                const colSpan = (index < splitIndex) ? leftAreaColSpan : rightAreaColSpan;
                if(colSpan > 0) {
                    cells[index].colSpan = colSpan;
                } else {
                    delete cells[index].colSpan;
                }
            }
        }
    }

    _findColSpanArea(cells, targetCellIndex) {
        for(let index = 0; index < cells.length; index++) {
            if(cells[index].colSpan > 0) {
                const colSpan = cells[index].colSpan;
                const startIndex = index;
                const endIndex = startIndex + colSpan;

                if(startIndex < targetCellIndex && targetCellIndex <= endIndex) {
                    return { colSpan, startIndex, endIndex };
                } else {
                    index = endIndex;
                }
            }
        }
        return null;
    }

    mergeCellsBySpanAttributes() {
        this._tables.forEach((table) => {
            for(let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
                for(let cellIndex = 0; cellIndex < table.rows[rowIndex].length; cellIndex++) {
                    const cell = table.rows[rowIndex][cellIndex];
                    if(!cell.skip) {
                        if(isDefined(cell.rowSpan)) {
                            for(let i = 1; i <= cell.rowSpan; i++) {
                                const mergedCell = table.rows[rowIndex + i][cellIndex];
                                if(isDefined(mergedCell)) {
                                    cell._rect.h += mergedCell._rect.h;
                                    mergedCell.skip = true;
                                }
                            }
                        }
                        if(isDefined(cell.colSpan)) {
                            for(let i = 1; i <= cell.colSpan; i++) {
                                const mergedCell = table.rows[rowIndex][cellIndex + i];
                                if(isDefined(mergedCell)) {
                                    cell._rect.w += mergedCell._rect.w;
                                    mergedCell.skip = true;
                                }
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
