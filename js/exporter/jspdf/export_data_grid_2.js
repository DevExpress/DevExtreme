import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { PdfGrid } from './pdf_grid';
import { createRowInfo, createPdfCell } from './export_data_grid_row_info';

function _getFullOptions(options) {
    const fullOptions = extend({
        headerStyles: {},
        groupStyles: {},
        totalStyles: {}
    }, options);
    if(!isDefined(fullOptions.topLeft)) {
        throw 'options.topLeft is required';
    }
    if(!isDefined(fullOptions.indent)) {
        fullOptions.indent = 10;
    }

    let assignDefaultStyles = true;
    //#DEBUG
    assignDefaultStyles = fullOptions._assignDefaultStyles === true;
    //#ENDDEBUG

    if(assignDefaultStyles && !isDefined(fullOptions.headerStyles.backgroundColor)) {
        fullOptions.headerStyles.backgroundColor = '#808080';
    }
    if(assignDefaultStyles && !isDefined(fullOptions.groupStyles.backgroundColor)) {
        fullOptions.groupStyles.backgroundColor = '#d3d3d3';
    }
    if(assignDefaultStyles && !isDefined(fullOptions.totalStyles.backgroundColor)) {
        fullOptions.totalStyles.backgroundColor = '#ffffe0';
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

            const { headerStyles, groupStyles, totalStyles } = options;
            const rowStyles = { headerStyles, groupStyles, totalStyles };
            const dataRowsCount = dataProvider.getRowsCount();
            let currentRowInfo;
            let prevRowInfo;

            for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                prevRowInfo = currentRowInfo;
                currentRowInfo = createRowInfo({ dataProvider, rowIndex, rowStyles, prevRowInfo });

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

                let rowHeight = null; // TODO: Default Value
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
