import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { PdfGrid } from './pdf_grid';
import { DataGridRowExporter } from './export_data_grid_row_exporter';

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

            pdfGrid.startNewTable(options.drawTableBorder, options.topLeft);

            const dataRowsCount = dataProvider.getRowsCount();
            let currentRowInfo;
            let prevRowInfo;

            for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                prevRowInfo = currentRowInfo;
                currentRowInfo = DataGridRowExporter.createRowInfo({ dataProvider, rowIndex, prevRowInfo });

                for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
                    const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
                    const pdfCell = DataGridRowExporter.createPdfCell({ dataProvider, rowIndex, cellIndex, targetRowInfo: currentRowInfo, value: cellData.value });
                    if(options.onCellExporting) {
                        options.onCellExporting({ gridCell: { value: cellData.value }, pdfCell });
                    }
                    currentRowInfo.pdfCells.push(pdfCell);
                }
                DataGridRowExporter.updatePdfCells(currentRowInfo);

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
                    const args = { drawNewTableFromThisRow: {}, rowCells: currentRowInfo.pdfCells };
                    options.onRowExporting(args);
                    const { startNewTable, addPage, tableTopLeft, splitToTablesByColumns } = args.drawNewTableFromThisRow;
                    if(startNewTable === true) {
                        pdfGrid.startNewTable(options.drawTableBorder, tableTopLeft, addPage === true, splitToTablesByColumns);
                    }

                    if(isDefined(args.rowHeight)) {
                        rowHeight = args.rowHeight;
                    }
                }

                pdfGrid.addRow(currentRowInfo.pdfCells, rowHeight);
            }

            pdfGrid.mergeCellsBySpanAttributes();

            pdfGrid.drawTo(doc);
            resolve();
        });
    });
}

export { exportDataGrid };
