import { isDefined } from '../../core/utils/type';
import { calculateRowHeight } from './pdf_utils';

function getRows(doc, dataProvider, dataGrid, options) {
    const rows = [];

    let previousRow;
    let currentRow;
    const rowsCount = dataProvider.getRowsCount();
    const wordWrapEnabled = !!dataGrid.option('wordWrapEnabled');

    for(let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        previousRow = currentRow;
        currentRow = createRow(dataProvider, rowIndex, previousRow, wordWrapEnabled);

        if(options.customizeCell) {
            currentRow.cells.forEach(cellInfo => {
                options.customizeCell({ gridCell: cellInfo.gridCell, pdfCell: cellInfo.pdfCell });
            });
        }

        rows.push(currentRow);
    }

    return rows;
}

function createRow(dataProvider, rowIndex, previousRow, wordWrapEnabled) {
    const rowType = dataProvider.getCellData(rowIndex, 0, true).cellSourceData.rowType;
    let indentLevel = rowType !== 'header' ? dataProvider.getGroupLevel(rowIndex) : 0;
    if(rowType === 'groupFooter' && previousRow?.rowType === 'groupFooter') {
        indentLevel = previousRow.indentLevel - 1;
    }
    const rowInfo = {
        rowType: rowType,
        indentLevel: indentLevel,
        cells: [],
        rowIndex
    };

    const columns = dataProvider.getColumns();
    fillCells(rowInfo, dataProvider, columns, wordWrapEnabled);

    return rowInfo;
}

function fillCells(rowInfo, dataProvider, columns, wordWrapEnabled) {
    for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
        const cellData = dataProvider.getCellData(rowInfo.rowIndex, cellIndex, true);
        const cellInfo = {
            gridCell: cellData.cellSourceData,
            pdfCell: { text: cellData.value, wordWrapEnabled, _rect: {} }
        };
        rowInfo.cells.push(cellInfo);
    }
}

function calculateWidths(doc, rows, options) {
    rows.forEach(row => {
        row.cells.forEach((cell, index) => {
            cell.pdfCell._rect.w = options.columnWidths[index];
        });
    });
}

function calculateHeights(doc, rows, options) {
    rows.forEach(row => {
        const pdfCells = row.cells.map(c => c.pdfCell);

        let customerHeight;
        if(options.onRowExporting) {
            const args = { rowCells: pdfCells };
            options.onRowExporting(args);
            if(isDefined(args.rowHeight)) {
                customerHeight = args.rowHeight;
            }
        }

        row.height = isDefined(customerHeight)
            ? customerHeight
            : calculateRowHeight(doc, pdfCells, pdfCells.map(c => c._rect.w));
        pdfCells.forEach(cell => {
            cell._rect.h = row.height;
        });
    });
}

function calculateCoordinates(doc, rows, options) {
    let y = options?.topLeft?.y ?? 0;
    rows.forEach(row => {
        let x = options?.topLeft?.x ?? 0;
        row.cells.forEach(cell => {
            cell.pdfCell._rect.x = x;
            cell.pdfCell._rect.y = y;
            x += cell.pdfCell._rect.w;
        });
        y += row.height;
    });
}

export { getRows, calculateWidths, calculateHeights, calculateCoordinates };
