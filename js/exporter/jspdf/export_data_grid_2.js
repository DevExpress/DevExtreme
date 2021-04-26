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
            const mergedCells = [];
            const pdfGrid = new PdfGrid(options.splitToTablesByColumns, options.columnWidths);

            pdfGrid.startNewTable(options.drawTableBorder, options.rect);

            const dataRowsCount = dataProvider.getRowsCount();

            for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                const currentRow = [];
                for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
                    const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
                    const pdfCell = {
                        text: cellData.value
                    };

                    if(cellData.cellSourceData.rowType === 'header') {
                        const mergedRange = _tryGetMergeRange(rowIndex, cellIndex, mergedCells, dataProvider);
                        if(mergedRange && mergedRange.rowSpan > 0) {
                            pdfCell.rowSpan = mergedRange.rowSpan + 1;
                        }
                        if(mergedRange && mergedRange.colSpan > 0) {
                            pdfCell.colSpan = mergedRange.colSpan + 1;
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

                pdfGrid.addRow(currentRow, rowHeight);
            }

            pdfGrid.mergeCellsBySpanAttributes();

            pdfGrid.drawTo(doc);
            resolve();
        });
    });
}

function _tryGetMergeRange(rowIndex, cellIndex, mergedCells, dataProvider) {
    if(!mergedCells[rowIndex] || !mergedCells[rowIndex][cellIndex]) {
        const { colspan, rowspan } = dataProvider.getCellMerging(rowIndex, cellIndex);
        if(colspan || rowspan) {
            for(let i = rowIndex; i <= rowIndex + rowspan || 0; i++) {
                for(let j = cellIndex; j <= cellIndex + colspan || 0; j++) {
                    if(!mergedCells[i]) {
                        mergedCells[i] = [];
                    }
                    mergedCells[i][j] = true;
                }
            }
            return { rowSpan: rowspan, colSpan: colspan };
        }
    }
}

export { exportDataGrid };
