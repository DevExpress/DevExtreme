import { isDefined } from '../../core/utils/type';
import { PdfGrid } from './pdf_grid';


function exportDataGrid(doc, dataGrid, options) {
    if(!isDefined(options.rect)) {
        throw 'options.rect is required';
    }
    const dataProvider = dataGrid.getDataProvider();
    return new Promise((resolve) => {
        dataProvider.ready().done(() => {
            const columns = dataProvider.getColumns();
            const pdfGrid = new PdfGrid(options.splitToTablesByColumns, options.columnWidths);

            pdfGrid.startNewTable(options.drawTableBorder, options.rect);

            const dataRowsCount = dataProvider.getRowsCount();

            let groupLevel;
            for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                const currentRow = [];
                for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
                    const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
                    const pdfCell = {
                        text: cellData.value
                    };

                    const rowType = cellData.cellSourceData.rowType;
                    if(rowType !== 'header') {
                        groupLevel = dataProvider.getGroupLevel(rowIndex);
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

                let rowHeight = null; // TODO: Default Value
                if(options.onRowExporting) {
                    const args = { drawNewTableFromThisRow: {}, rowCells: currentRow };
                    options.onRowExporting(args);
                    const { startNewTable, addPage, tableRect, splitToTablesByColumns } = args.drawNewTableFromThisRow;
                    if(startNewTable === true) {
                        pdfGrid.startNewTable(options.drawTableBorder, tableRect, addPage === true, splitToTablesByColumns);
                    }

                    if(isDefined(args.rowHeight)) {
                        rowHeight = args.rowHeight;
                    }
                }

                pdfGrid.addRow(currentRow, rowHeight, groupLevel);
            }

            pdfGrid.mergeCellsBySpanAttributes();

            pdfGrid.drawTo(doc);
            resolve();
        });
    });
}

export { exportDataGrid };
