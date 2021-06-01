import { isDefined } from '../../core/utils/type';
import { PdfGrid } from './pdf_grid';


function exportDataGrid(doc, dataGrid, options) {
    if(!isDefined(options.topLeft)) {
        throw 'options.topLeft is required';
    }
    const dataProvider = dataGrid.getDataProvider();
    return new Promise((resolve) => {
        dataProvider.ready().done(() => {
            const columns = dataProvider.getColumns();
            const pdfGrid = new PdfGrid(options.splitToTablesByColumns, options.columnWidths);
            const rowsIndents = [];

            pdfGrid.startNewTable(options.drawTableBorder, options.topLeft);

            const dataRowsCount = dataProvider.getRowsCount();

            for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                const currentRow = [];
                let groupLevel = 0;
                let rowType;
                for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
                    const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
                    const pdfCell = {
                        text: cellData.value
                    };

                    rowType = cellData.cellSourceData.rowType;
                    if(rowType !== 'header') {
                        groupLevel = dataProvider.getGroupLevel(rowIndex, true);
                    }

                    if(rowType === 'header') {
                        const cellMerging = dataProvider.getCellMerging(rowIndex, cellIndex);
                        if(cellMerging && cellMerging.rowspan > 0) {
                            pdfCell.rowSpan = cellMerging.rowspan;
                        }
                        if(cellMerging && cellMerging.colspan > 0) {
                            pdfCell.colSpan = cellMerging.colspan;
                        }
                    } else if(rowType === 'group') {
                        const prevCellsHaveSummaryItems = currentRow.slice(1).filter(pdfCell => isDefined(pdfCell.text)).length > 0;
                        const cellHasSummaryItems = cellData.cellSourceData.groupSummaryItems?.length > 0;
                        const isNeedMergeCells = !prevCellsHaveSummaryItems && !cellHasSummaryItems && currentRow.length > 0;
                        if(isNeedMergeCells) {
                            currentRow.forEach(pdfCell => pdfCell.colSpan = currentRow.length);
                            pdfCell.colSpan = currentRow.length;
                        } else {
                            const mergedCellsRequiringVerticalBorderRemoval = currentRow.slice(1).filter((cell) => { return isDefined(cell.colSpan) && cell.drawLeftBorder !== false; });
                            if(mergedCellsRequiringVerticalBorderRemoval.length > 0) {
                                mergedCellsRequiringVerticalBorderRemoval.forEach(pdfCell => pdfCell.drawLeftBorder = false);
                            }

                            if(cellIndex > 0) {
                                pdfCell.drawLeftBorder = false;
                            }
                        }
                    }

                    if(options.onCellExporting) {
                        options.onCellExporting({ gridCell: { value: cellData.value }, pdfCell });
                    }
                    currentRow.push(pdfCell);
                }

                rowsIndents.push(groupLevel * 10); // TODO: Default value for horizontalIndent : 10
                let startNewTableWithIndent = rowsIndents.length >= 2 && rowsIndents[rowsIndents.length - 1] !== rowsIndents[rowsIndents.length - 2];

                let rowHeight = null; // TODO: Default Value
                if(options.onRowExporting) {
                    const args = { drawNewTableFromThisRow: {}, rowCells: currentRow };
                    options.onRowExporting(args);
                    const { startNewTable, addPage, tableTopLeft, splitToTablesByColumns } = args.drawNewTableFromThisRow;
                    if(startNewTable === true) {
                        pdfGrid.startNewTable(options.drawTableBorder, tableTopLeft, addPage === true, splitToTablesByColumns);
                        startNewTableWithIndent = false;
                    }

                    if(isDefined(args.rowHeight)) {
                        rowHeight = args.rowHeight;
                    }
                }

                if(startNewTableWithIndent) {
                    const offset = rowsIndents[rowsIndents.length - 1] - rowsIndents[rowsIndents.length - 2];
                    const firstTable = pdfGrid._currentHorizontalTables[0];
                    const firstColumnWidth = firstTable.columnWidths[0] - offset;
                    const tableTopLeft = {
                        x: firstTable.rect.x + offset,
                        y: firstTable.rect.y + firstTable.rect.h
                    };
                    pdfGrid.startNewTable(options.drawTableBorder, tableTopLeft, null, null, firstColumnWidth);
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
