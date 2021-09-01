import { isDefined } from '../../core/utils/type';
import { calculateRowHeight } from './pdf_utils';

function getRows(doc, dataProvider, dataGrid, options) {
    const rows = createRows(options, dataProvider, dataGrid);
    calculateWidths(doc, rows, options);
    calculateHeights(doc, rows, options);

    return rows;
}

function createRows(options, dataProvider, dataGrid) {
    const rows = [];

    let previousRow;
    let currentRow;
    const rowOptions = options.rowOptions || {};
    const rowsCount = dataProvider.getRowsCount();

    const wordWrapEnabled = !!dataGrid.option('wordWrapEnabled');
    for(let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        previousRow = currentRow;
        currentRow = createRow(dataProvider, rowIndex, rowOptions, previousRow, wordWrapEnabled);

        currentRow.cells.forEach(cellInfo => {
            if(options.customizeCell) {
                options.customizeCell({ gridCell: cellInfo.gridCell, pdfCell: cellInfo.pdfCell });
            }
        });

        currentRow.customerHeight = currentRow.rowHeight;
        if(options.onRowExporting) {
            const pdfCells = currentRow.cells.map(cellInfo => cellInfo.pdfCell);
            const args = { rowCells: pdfCells };
            options.onRowExporting(args);
            if(isDefined(args.rowHeight)) {
                currentRow.customerHeight = args.rowHeight;
            }
        }
        rows.push(currentRow);
    }

    return rows;
}

function createRow(dataProvider, rowIndex, rowOptions, previousRow, wordWrapEnabled) {
    const rowType = dataProvider.getCellData(rowIndex, 0, true).cellSourceData.rowType;
    let indentLevel = rowType !== 'header' ? dataProvider.getGroupLevel(rowIndex) : 0;
    if(rowType === 'groupFooter' && previousRow?.rowType === 'groupFooter') {
        indentLevel = previousRow.indentLevel - 1;
    }
    const rowInfo = {
        rowType: rowType,
        indentLevel: indentLevel,
        cells: [],
        customerHeight: rowOptions.rowHeight,
        rowIndex
    };

    const columns = dataProvider.getColumns();
    fillCells(rowInfo, rowOptions, dataProvider, columns, wordWrapEnabled);

    return rowInfo;
}

function fillCells(rowInfo, rowOptions, dataProvider, columns, wordWrapEnabled) {
    for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
        const cellData = dataProvider.getCellData(rowInfo.rowIndex, cellIndex, true);
        const cellInfo = {
            gridCell: cellData.cellSourceData,
            pdfCell: { text: cellData.value, wordWrapEnabled }
        };
        rowInfo.cells.push(cellInfo);
    }
}

function calculateWidths(doc, rows, options) {
    rows.forEach(row => {
        row.cells.forEach((cell, index) => {
            cell.pdfCell._width = options.columnWidths[index];
        });
    });
}

function calculateHeights(doc, rows, options) {
    rows.forEach(row => {
        const pdfCells = row.cells.map(c => c.pdfCell);
        const widths = pdfCells.map(c => c._width);

        row.height = isDefined(row.customerHeight)
            ? row.customerHeight
            : calculateRowHeight(doc, pdfCells, widths);
        pdfCells.forEach(cell => {
            cell._height = row.height;
        });
    });
}

export { getRows };
