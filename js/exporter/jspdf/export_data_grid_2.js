import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { PdfGrid } from './pdf_grid';
import { createRowInfo, createPdfCell } from './export_data_grid_row_info';
import { calculateRowHeight } from './pdf_utils';

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
            const pdfGrid = new PdfGrid(options.splitToTablesByColumns, options.columnWidths);

            pdfGrid.startNewTable(options.drawTableBorder, options.topLeft);

            const dataRowsCount = dataProvider.getRowsCount();
            const rowOptions = options.rowOptions || {};
            let currentRowInfo;
            let prevRowInfo;

            for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                prevRowInfo = currentRowInfo;
                currentRowInfo = createRowInfo({ dataProvider, rowIndex, rowOptions, prevRowInfo });

                const currentRowPdfCells = [];
                currentRowInfo.cellsInfo.forEach(cellInfo => {
                    const pdfCell = createPdfCell(cellInfo);
                    if(options.onCellExporting) {
                        options.onCellExporting({ gridCell: { value: cellInfo.value }, pdfCell });
                    }
                    currentRowPdfCells.push(pdfCell);
                });

                if(currentRowInfo.startNewTableWithIndent) {
                    const indent = currentRowInfo.indentLevel * options.indent;
                    const prevTable = pdfGrid._currentHorizontalTables[0];
                    const firstColumnWidth = options.columnWidths[0] - indent;
                    const tableTopLeft = {
                        x: options.topLeft.x + indent,
                        y: prevTable.rect.y + prevTable.rect.h
                    };
                    // TODO: should it be controlled from onRowExporting ?
                    pdfGrid.startNewTable(options.drawTableBorder, tableTopLeft, null, null, firstColumnWidth);
                }

                let rowHeight = isDefined(currentRowInfo.rowHeight)
                    ? currentRowInfo.rowHeight
                    : calculateRowHeight(doc, currentRowInfo.cellsInfo, options.columnWidths);


                if(options.onRowExporting) {
                    const args = { drawNewTableFromThisRow: {}, rowCells: currentRowPdfCells };
                    options.onRowExporting(args);
                    const { startNewTable, addPage, tableTopLeft, splitToTablesByColumns } = args.drawNewTableFromThisRow;
                    if(startNewTable === true) {
                        pdfGrid.startNewTable(options.drawTableBorder, tableTopLeft, addPage === true, splitToTablesByColumns);
                    }

                    if(isDefined(args.rowHeight)) {
                        rowHeight = args.rowHeight;
                    }
                }

                pdfGrid.addRow(currentRowPdfCells, rowHeight);
            }

            pdfGrid.mergeCellsBySpanAttributes();

            pdfGrid.drawTo(doc);
            resolve();
        });
    });
}

export { exportDataGrid };
