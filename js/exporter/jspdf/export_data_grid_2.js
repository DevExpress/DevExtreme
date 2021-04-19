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
                    if(isDefined(options.columnWidths)) {
                        const width = options.columnWidths[cellIndex];
                        if(isDefined(width) && !pdfCell.skip && !isDefined(pdfCell.rect.w)) {
                            pdfCell.rect.w = width;
                        } else {
                            // TODO
                        }
                    } else {
                        // TODO
                    }
                    currentRow.push(pdfCell);
                }

                if(options.onRowExporting) {
                    const args = { drawNewTableFromThisRow: {}, rowCells: currentRow };
                    options.onRowExporting(args);
                    const { startNewTable, addPage, tableRect, splitToTablesByColumns } = args.drawNewTableFromThisRow;
                    if(startNewTable === true) {
                        pdfGrid.startNewTable(options.drawTableBorder, tableRect, addPage === true, splitToTablesByColumns);
                    }

                    if(isDefined(args.rowHeight)) {
                        currentRow.forEach(cell => {
                            if(!cell.skip && !cell.rect.h) {
                                cell.rect.h = args.rowHeight;
                            }
                        });
                    }
                }

                pdfGrid.addRow(currentRow);
            }

            pdfGrid.drawTo(doc);
            resolve();
        });
    });
}

export { exportDataGrid };
