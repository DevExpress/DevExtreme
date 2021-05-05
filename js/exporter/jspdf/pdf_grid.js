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
            const currentCell = cells[cellIndex];
            const isNewTableColumn = this._splitByColumns.filter((splitByColumn) => splitByColumn.columnIndex === cellIndex)[0];
            if(isNewTableColumn) {
                this._currentHorizontalTables[currentTableIndex].addRow(currentTableCells, rowHeight);
                if(currentCell.colSpan > 0) {
                    this._splitColSpanArea(cells, cellIndex);
                }
                currentTableIndex++;
                currentTableCells = [];
            }
            currentTableCells.push(currentCell);
        }
        this._currentHorizontalTables[currentTableIndex].addRow(currentTableCells, rowHeight);
    }

    _splitColSpanArea(cells, splitIndex) {
        const { startColSpanCellIndex, endColSpanCellIndex, colSpanCellText } = this._getColSpanArea(cells, splitIndex);

        if(startColSpanCellIndex !== -1 && endColSpanCellIndex !== -1) {
            const leftSpanCells = splitIndex - startColSpanCellIndex - 1;
            for(let index = startColSpanCellIndex; index < splitIndex; index++) {
                if(leftSpanCells > 0) {
                    cells[index].colSpan = leftSpanCells;
                } else {
                    delete cells[index].colSpan;
                }
            }
            cells[splitIndex].text = colSpanCellText;
            const rightSpanCells = endColSpanCellIndex - splitIndex;
            for(let index = splitIndex; index <= endColSpanCellIndex; index++) {
                if(rightSpanCells > 0) {
                    cells[index].colSpan = rightSpanCells;
                } else {
                    delete cells[index].colSpan;
                }
            }
        }
    }

    _getColSpanArea(cells, cellIndex) {
        let colSpanValue = -1;
        let colSpanCellText = '';
        let startColSpanCellIndex = -1;
        let endColSpanCellIndex = -1;

        for(let index = 0; index < cells.length; index++) {
            if(cells[index].colSpan > 0 && startColSpanCellIndex === -1) {
                colSpanValue = cells[index].colSpan;
                colSpanCellText = cells[index].text;
                startColSpanCellIndex = index;
                endColSpanCellIndex = index;
            }

            if(startColSpanCellIndex !== -1) {
                endColSpanCellIndex = index;
                if(endColSpanCellIndex - startColSpanCellIndex >= colSpanValue) {
                    if(startColSpanCellIndex < cellIndex && cellIndex <= endColSpanCellIndex) {
                        break;
                    } else {
                        colSpanValue = -1;
                        colSpanCellText = '';
                        startColSpanCellIndex = -1;
                        endColSpanCellIndex = -1;
                    }
                }
            }
        }

        return {
            startColSpanCellIndex,
            endColSpanCellIndex,
            colSpanCellText
        };
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
