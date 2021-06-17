import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { PdfGrid } from './pdf_grid';

function _getFullOptions(options) {
    const fullOptions = extend({}, options);
    if(!isDefined(fullOptions.topLeft)) {
        throw 'options.topLeft is required';
    }
    if(!isDefined(fullOptions.indent)) {
        fullOptions.indent = 10;
    }

    return fullOptions;
}

function exportDataGrid(doc, dataGrid, options) {
    options = extend({}, _getFullOptions(options));

    const dataProvider = dataGrid.getDataProvider();
    return new Promise((resolve) => {
        dataProvider.ready().done(() => {
            const columns = dataProvider.getColumns();
            const pdfGrid = new PdfGrid(options.splitToTablesByColumns, options.columnWidths);
            const rowsIndents = [];

            pdfGrid.startNewTable(options.drawTableBorder, options.topLeft);

            const dataRowsCount = dataProvider.getRowsCount();

            for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                const rowType = dataProvider.getCellData(rowIndex, 0, true).cellSourceData.rowType;
                const groupLevel = rowType !== 'header' ? dataProvider.getGroupLevel(rowIndex) : 0;

                const currentRow = [];
                for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
                    const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
                    const pdfCell = {
                        text: cellData.value
                    };

                    if(rowType === 'header') {
                        const cellMerging = dataProvider.getCellMerging(rowIndex, cellIndex);
                        if(cellMerging && cellMerging.rowspan > 0) {
                            pdfCell.rowSpan = cellMerging.rowspan;
                        }
                        if(cellMerging && cellMerging.colspan > 0) {
                            pdfCell.colSpan = cellMerging.colspan;
                        }
                    } else if(rowType === 'group') {
                        if(cellIndex > 0) {
                            const prevCellsHaveSummaryItems = currentRow.slice(1).filter(pdfCell => isDefined(pdfCell.text)).length > 0;
                            if(!isDefined(pdfCell.text) && !prevCellsHaveSummaryItems) {
                                for(let i = 0; i < currentRow.length; i++) {
                                    currentRow[i].colSpan = currentRow.length;
                                }
                                pdfCell.colSpan = currentRow.length;
                            } else {
                                const isPrevCellMerged = isDefined(currentRow[currentRow.length - 1].colSpan);
                                if(isPrevCellMerged) {
                                    const mergedCells = currentRow.slice(1).filter(cell => isDefined(cell.colSpan) && cell.drawLeftBorder !== false);
                                    for(let i = 0; i < mergedCells.length; i++) {
                                        mergedCells[i].drawLeftBorder = false;
                                    }
                                }
                                pdfCell.drawLeftBorder = false;
                            }
                        }
                    }

                    if(options.onCellExporting) {
                        options.onCellExporting({ gridCell: { value: cellData.value }, pdfCell });
                    }
                    currentRow.push(pdfCell);
                }

                rowsIndents.push(groupLevel * options.indent);
                const startNewTableWithIndent = rowsIndents.length >= 2 && rowsIndents[rowsIndents.length - 1] !== rowsIndents[rowsIndents.length - 2];
                if(startNewTableWithIndent) {
                    const indent = rowsIndents[rowsIndents.length - 1];
                    const prevTable = pdfGrid._currentHorizontalTables[0];
                    const firstColumnWidth = options.columnWidths[0] - indent;
                    const tableTopLeft = {
                        x: options.topLeft.x + indent,
                        y: prevTable.rect.y + prevTable.rect.h
                    };
                    pdfGrid.startNewTable(options.drawTableBorder, tableTopLeft, null, null, firstColumnWidth);
                }

                let rowHeight = null; // TODO: Default Value
                if(options.onRowExporting) {
                    const args = { drawNewTableFromThisRow: {}, rowCells: currentRow };
                    options.onRowExporting(args);
                    const { startNewTable, addPage, tableTopLeft, splitToTablesByColumns } = args.drawNewTableFromThisRow;
                    if(startNewTable === true) {
                        pdfGrid.startNewTable(options.drawTableBorder, tableTopLeft, addPage === true, splitToTablesByColumns);
                    }

                    if(isDefined(args.rowHeight)) {
                        rowHeight = args.rowHeight;
                    }
                }

                pdfGrid.addRow(currentRow, rowHeight);
            }

            pdfGrid.mergeCellsBySpanAttributes();

            pdfGrid.drawTo(doc);
            resolve();
        });
    });
}

export { exportDataGrid };
