import { isDefined } from '../../core/utils/type';

function exportDataGrid(doc, dataGrid, options) {
    if(!isDefined(options.rect)) {
        throw 'options.rect is required';
    }
    const dataProvider = dataGrid.getDataProvider();
    return new Promise((resolve) => {
        dataProvider.ready().done(() => {
            const table = {
                rect: options.rect,
                drawTableBorder: options.drawTableBorder,
                rows: []
            };
            const _tables = [];
            _tables.push(table);

            const columns = dataProvider.getColumns();
            const dataRowsCount = dataProvider.getRowsCount();
            for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                if(options.onRowExporting) {
                    const drawNewTableFromThisRow = {};
                    options.onRowExporting({ drawNewTableFromThisRow });
                    const { addPage, tableRect } = drawNewTableFromThisRow;
                    if(addPage === true) {
                        if(!isDefined(tableRect)) {
                            throw 'tableRect is required';
                        }
                        _tables.push({
                            rect: tableRect,
                            drawTableBorder: options.drawTableBorder,
                            rows: []
                        });
                    }
                }

                const row = [];
                const lastTable = _tables[_tables.length - 1];
                lastTable.rows.push(row);

                for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
                    const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
                    const pdfCell = {
                        text: cellData.value
                    };

                    if(options.onCellExporting) {
                        options.onCellExporting({ gridCell: { value: cellData.value }, pdfCell });
                    }

                    row.push(pdfCell);

                    if(pdfCell.drawLeftBorder === false) {
                        if(row.length > 1) {
                            row[row.length - 2].drawRightBorder = 0;
                        }
                    } else if(!isDefined(pdfCell.drawLeftBorder)) {
                        if(row.length > 1 && row[row.length - 2].drawRightBorder === false) {
                            pdfCell.drawLeftBorder = false;
                        }
                    }

                    if(pdfCell.drawTopBorder === false) {
                        if(lastTable.rows.length > 1) {
                            lastTable.rows[lastTable.rows.length - 2][row.length - 1].drawBottomBorder = false;
                        }
                    } else if(!isDefined(pdfCell.drawTopBorder)) {
                        if(lastTable.rows.length > 1 && lastTable.rows[lastTable.rows.length - 2][row.length - 1].drawBottomBorder === false) {
                            pdfCell.drawTopBorder = false;
                        }
                    }
                }
            }

            _tables.forEach((_table, index) => {
                if(index > 0) {
                    doc.addPage();
                }
                drawTable(doc, _table);
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
            const row = table.rows[rowIndex];
            if(row.newPage === true) {
                if(!isDefined(row.tableRect)) {
                    throw 'row.tableRect is required';
                }
                if(isDefined(table.drawTableBorder) ? table.drawTableBorder : (isDefined(table.rows) && table.rows.length === 0)) {
                    drawBorder(table.rect);
                }
                table.rect = row.tableRect;
                doc.addPage();
            }
            drawRow(row);
        }
    }

    if(isDefined(table.drawTableBorder) ? table.drawTableBorder : (isDefined(table.rows) && table.rows.length === 0)) {
        drawBorder(table.rect);
    }
}

export { exportDataGrid };
