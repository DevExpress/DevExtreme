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

function calculateColumnWidths(pdfGrid, currentRowInfo) {
    const widthsArray = pdfGrid._currentHorizontalTables.flatMap((table) => table.columnWidths);
    const splitIndexes = pdfGrid._splitByColumns.map(splitInfo => splitInfo.columnIndex).sort();
    return widthsArray
        .map((value, index) => {
            const cell = currentRowInfo.cellsInfo[index];
            const collSpan = cell.colSpan || 0;
            let columnWidth = 0;
            for(let cellIndex = index; cellIndex <= index + collSpan; cellIndex++) {
                columnWidth += widthsArray[cellIndex];
                if(splitIndexes[0] === cellIndex + 1) {
                    splitIndexes.splice(0, 1);
                    break;
                }
            }
            return columnWidth;
        });
}

function exportDataGrid(doc, dataGrid, options) {
    options = extend({}, _getFullOptions(options));

    const dataProvider = dataGrid.getDataProvider();
    return new Promise((resolve) => {
        dataProvider.ready().done(() => {
            const wordWrapEnabled = !!dataGrid.option('wordWrapEnabled');
            const pdfGrid = new PdfGrid(options.splitToTablesByColumns, options.columnWidths, wordWrapEnabled);

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
                    if(options.customizeCell) {
                        options.customizeCell({ gridCell: cellInfo.gridCell, pdfCell });
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
                    : calculateRowHeight(doc, currentRowInfo.cellsInfo, pdfGrid._wordWrapEnabled, calculateColumnWidths(pdfGrid, currentRowInfo));
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
