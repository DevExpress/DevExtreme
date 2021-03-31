import { isDefined } from '../../core/utils/type';

class PdfTable {
    constructor(drawTableBorder, rect) {
        this.drawTableBorder = drawTableBorder;
        this.rect = rect;
        this.rows = [];
    }

    addRow(cells) {
        if(!isDefined(cells)) {
            throw 'cells is required';
        }
        this.rows.push(cells);
        for(let i = 0; i < cells.length; i++) {
            const currentCell = cells[i];
            if(currentCell.drawLeftBorder === false) {
                if(i >= 1) {
                    cells[i - 1].drawRightBorder = false;
                }
            } else if(!isDefined(currentCell.drawLeftBorder)) {
                if(i >= 1 && cells[i - 1].drawRightBorder === false) {
                    currentCell.drawLeftBorder = false;
                }
            }

            if(currentCell.drawTopBorder === false) {
                if(this.rows.length >= 2) {
                    this.rows[this.rows.length - 2][i].drawBottomBorder = false;
                }
            } else if(!isDefined(currentCell.drawTopBorder)) {
                if(this.rows.length >= 2 && this.rows[this.rows.length - 2][i].drawBottomBorder === false) {
                    currentCell.drawTopBorder = false;
                }
            }
        }
    }

    drawTo(doc) {
        drawTable(doc, this);
    }
}

class PdfGrid {
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

function exportDataGrid(doc, dataGrid, options) {
    if(!isDefined(options.rect)) {
        throw 'options.rect is required';
    }
    const dataProvider = dataGrid.getDataProvider();
    return new Promise((resolve) => {
        dataProvider.ready().done(() => {
            const columns = dataProvider.getColumns();
            const pdfGrid = new PdfGrid(options.splitToTablesByColumns);

            pdfGrid.startNewTable(options.drawTableBorder, options.rect);

            const dataRowsCount = dataProvider.getRowsCount();

            for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                const currentRow = [];
                for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
                    const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
                    const pdfCell = {
                        text: cellData.value
                    };
                    if(options.onCellExporting) {
                        options.onCellExporting({ gridCell: { value: cellData.value }, pdfCell });
                    }
                    currentRow.push(pdfCell);
                }

                if(options.onRowExporting) {
                    const drawNewTableFromThisRow = {};
                    options.onRowExporting({ drawNewTableFromThisRow, row: currentRow });
                    const { startNewTable, addPage, tableRect, splitToTablesByColumns } = drawNewTableFromThisRow;
                    if(startNewTable === true) {
                        pdfGrid.startNewTable(options.drawTableBorder, tableRect, addPage === true, splitToTablesByColumns);
                    }
                }

                if(!isDefined(currentRow.height)) {
                    throw 'row.height is required';
                }
                currentRow.forEach(cell => {
                    if(!cell.skip && !cell.rect.h) {
                        cell.rect.h = currentRow.height;
                    }
                });

                pdfGrid.addRow(currentRow);
            }

            pdfGrid.drawTo(doc);
            resolve();
        });
    });
}

// this function is large and will grow
function drawTable(doc, table) {
    if(!isDefined(doc)) {
        throw 'doc is required';
    }

    function drawBorder(rect, drawLeftBorder = true, drawRightBorder = true, drawTopBorder = true, drawBottomBorder = true) {
        if(!isDefined(rect)) {
            throw 'rect is required';
        }

        const defaultBorderLineWidth = 1;
        if(!drawLeftBorder && !drawRightBorder && !drawTopBorder && !drawBottomBorder) {
            return;
        } else if(drawLeftBorder && drawRightBorder && drawTopBorder && drawBottomBorder) {
            doc.setLineWidth(defaultBorderLineWidth);
            doc.rect(rect.x, rect.y, rect.w, rect.h);
        } else {
            doc.setLineWidth(defaultBorderLineWidth);

            if(drawTopBorder) {
                doc.line(rect.x, rect.y, rect.x + rect.w, rect.y); // top
            }

            if(drawLeftBorder) {
                doc.line(rect.x, rect.y, rect.x, rect.y + rect.h); // left
            }

            if(drawRightBorder) {
                doc.line(rect.x + rect.w, rect.y, rect.x + rect.w, rect.y + rect.h); // right
            }

            if(drawBottomBorder) {
                doc.line(rect.x, rect.y + rect.h, rect.x + rect.w, rect.y + rect.h); // bottom
            }
        }
    }

    function drawRow(rowCells) {
        if(!isDefined(rowCells)) {
            throw 'rowCells is required';
        }
        rowCells.forEach(cell => {
            if(cell.skip === true) {
                return;
            }
            if(!isDefined(cell.rect)) {
                throw 'cell.rect is required';
            }
            if(isDefined(cell.text) && cell.text !== '') { // TODO: use cell.text.trim() ?
                const textY = cell.rect.y + (cell.rect.h / 2);
                doc.text(cell.text, cell.rect.x, textY, { baseline: 'middle' }); // align by vertical 'middle', https://github.com/MrRio/jsPDF/issues/1573
            }
            drawBorder(cell.rect, cell.drawLeftBorder, cell.drawRightBorder, cell.drawTopBorder, cell.drawBottomBorder);
        });
    }

    if(!isDefined(table)) {
        return Promise.resolve();
    }
    if(!isDefined(table.rect)) {
        throw 'table.rect is required';
    }

    if(isDefined(table.rows)) {
        for(let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
            drawRow(table.rows[rowIndex]);
        }
    }

    if(isDefined(table.drawTableBorder) ? table.drawTableBorder : (isDefined(table.rows) && table.rows.length === 0)) {
        drawBorder(table.rect);
    }
}

export { exportDataGrid };
