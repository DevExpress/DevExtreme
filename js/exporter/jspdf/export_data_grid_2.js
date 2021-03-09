import { isDefined } from '../../core/utils/type';

const PdfGrid = function() {
    const _startNewTable = function(drawTableBorder, firstTableRect, firstTableOnNewPage, splitByColumns) {
        const newTables = [
            {
                drawTableBorder,
                drawOnNewPage: firstTableOnNewPage,
                rect: firstTableRect,
                columnIndex: 0,
                rows: []
            }
        ];

        if(isDefined(splitByColumns)) {
            splitByColumns.forEach((splitByColumn) => {
                newTables.push({
                    drawTableBorder: drawTableBorder,
                    drawOnNewPage: splitByColumn.drawOnNewPage,
                    rect: splitByColumn.tableRect,
                    columnIndex: splitByColumn.columnIndex,
                    rows: []
                });
            });
        }

        _activeTable = newTables[0];

        _tables.push(newTables);
    };

    const _startNewRow = function() {
        _activeTable.rows.push([]);
    };

    const _addPdfCell = function(cellIndex, pdfCell) {
        const currentRow = _activeTable.rows[_activeTable.rows.length - 1];
        currentRow.push(pdfCell);

        if(pdfCell.drawLeftBorder === false) {
            if(currentRow.length > 1) {
                currentRow[currentRow.length - 2].drawRightBorder = 0;
            }
        } else if(!isDefined(pdfCell.drawLeftBorder)) {
            if(currentRow.length > 1 && currentRow[currentRow.length - 2].drawRightBorder === false) {
                pdfCell.drawLeftBorder = false;
            }
        }

        if(pdfCell.drawTopBorder === false) {
            if(_activeTable.rows.length > 1) {
                _activeTable.rows[_activeTable.rows.length - 2][currentRow.length - 1].drawBottomBorder = false;
            }
        } else if(!isDefined(pdfCell.drawTopBorder)) {
            if(_activeTable.rows.length > 1 && _activeTable.rows[_activeTable.rows.length - 2][currentRow.length - 1].drawBottomBorder === false) {
                pdfCell.drawTopBorder = false;
            }
        }
    };

    const _setActiveTable = function(boundaryColumnIndex) {
        _activeTable = _tables[_tables.length - 1].find((table) => table.columnIndex === boundaryColumnIndex);
    };

    const _getTables = function() {
        return [].concat(..._tables);
    };

    const _tables = [];
    let _activeTable;

    return {
        startNewTable: _startNewTable,
        startNewRow: _startNewRow,
        addPdfCell: _addPdfCell,
        setActiveTable: _setActiveTable,
        getTables: _getTables
    };
};

function exportDataGrid(doc, dataGrid, options) {
    if(!isDefined(options.rect)) {
        throw 'options.rect is required';
    }
    const dataProvider = dataGrid.getDataProvider();
    return new Promise((resolve) => {
        dataProvider.ready().done(() => {
            const columns = dataProvider.getColumns();
            const exportingOptions = {
                columns: columns.map(column => { return { name: column.name }; }),
                splitToPagesByColumns: [],
            };

            if(options.onGridExporting) {
                options.onGridExporting({ exportingOptions });
            }

            const pdfGrid = PdfGrid();
            pdfGrid.startNewTable(options.drawTableBorder, options.rect, false, exportingOptions.splitToPagesByColumns);

            const dataRowsCount = dataProvider.getRowsCount();
            for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                if(options.onRowExporting) {
                    const drawNewTableFromThisRow = {};
                    options.onRowExporting({ drawNewTableFromThisRow });
                    const { startNewTable, addPage, tableRect } = drawNewTableFromThisRow;
                    if(startNewTable === true) {
                        if(!isDefined(tableRect)) {
                            throw 'tableRect is required';
                        }
                        pdfGrid.startNewTable(options.drawTableBorder, tableRect, addPage === true, exportingOptions.splitToPagesByColumns);
                    }
                }
                pdfGrid.setActiveTable(0);
                pdfGrid.startNewRow();

                for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
                    const isBoundaryColumn = exportingOptions.splitToPagesByColumns.find((splitByColumn) => splitByColumn.columnIndex === cellIndex);
                    if(isBoundaryColumn) {
                        pdfGrid.setActiveTable(cellIndex);
                        pdfGrid.startNewRow();
                    }

                    const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
                    const pdfCell = {
                        text: cellData.value
                    };

                    if(options.onCellExporting) {
                        options.onCellExporting({ gridCell: { value: cellData.value }, pdfCell });
                    }

                    pdfGrid.addPdfCell(cellIndex, pdfCell);
                }
            }

            pdfGrid.getTables().forEach((table) => {
                if(table.drawOnNewPage === true) {
                    doc.addPage();
                }
                drawTable(doc, table);
            });
            resolve();
        });
    });
}

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
