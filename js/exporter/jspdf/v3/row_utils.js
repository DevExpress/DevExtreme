import { isDefined } from '../../../core/utils/type';
import { calculateRowHeight } from './pdf_utils_v3';


function initializeCellsWidth(rows, columnWidths) {
    // TODO: handle colSpan in this method !!!!
    rows.forEach(row => {
        row.cells.forEach(({ gridCell, pdfCell }, index) => {
            pdfCell._rect.w = columnWidths[index];
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
            : calculateRowHeight(doc, row.cells, pdfCells.map(c => c._rect.w));
        pdfCells.forEach(cell => {
            cell._rect.h = row.height;
        });
    });
}

function applyColSpans(rows) {
    for(let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        for(let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
            const cell = row.cells[cellIndex];
            if(isDefined(cell.colSpan) && !isDefined(cell.pdfCell.isMerged)) {
                for(let spanIndex = 1; spanIndex <= cell.colSpan; spanIndex++) {
                    const mergedCell = rows[rowIndex].cells[cellIndex + spanIndex];
                    cell.pdfCell._rect.w += mergedCell.pdfCell._rect.w;
                    mergedCell.pdfCell._rect.w = 0;
                    mergedCell.pdfCell.isMerged = true;
                }
            }
        }
    }
}

function applyRowSpans(rows) {
    for(let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        for(let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
            const cell = row.cells[cellIndex];
            if(isDefined(cell.rowSpan) && !isDefined(cell.pdfCell.isMerged)) {
                for(let spanIndex = 1; spanIndex <= cell.rowSpan; spanIndex++) {
                    const mergedCell = rows[rowIndex + spanIndex].cells[cellIndex];
                    cell.pdfCell._rect.h += mergedCell.pdfCell._rect.h;
                    mergedCell.pdfCell._rect.h = 0;
                    mergedCell.pdfCell.isMerged = true;
                }
            }
        }
    }
}

function resizeFirstColumnByIndentLevel(rows, options) {
    rows.forEach(row => {
        row.cells[0].pdfCell._rect.w -= row.indentLevel * options.indent;
    });
}

function applyBordersConfig(rows) {
    for(let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const cells = rows[rowIndex].cells;
        for(let columnIndex = 0; columnIndex < cells.length; columnIndex++) {
            const pdfCell = cells[columnIndex].pdfCell;
            const leftPdfCell = (columnIndex >= 1) ? cells[columnIndex - 1].pdfCell : null;
            const topPdfCell = (rowIndex >= 1) ? rows[rowIndex - 1].cells[columnIndex].pdfCell : null;

            if(pdfCell.drawLeftBorder === false && !isDefined(cells[columnIndex].colSpan)) { // TODO: Check this logic after implementing splitting to pages
                if(isDefined(leftPdfCell)) {
                    leftPdfCell.drawRightBorder = false;
                }
            } else if(!isDefined(pdfCell.drawLeftBorder)) {
                if(isDefined(leftPdfCell) && leftPdfCell.drawRightBorder === false) {
                    pdfCell.drawLeftBorder = false;
                }
            }

            if(pdfCell.drawTopBorder === false) {
                if(isDefined(topPdfCell)) {
                    topPdfCell.drawBottomBorder = false;
                }
            } else if(!isDefined(pdfCell.drawTopBorder)) {
                if(isDefined(topPdfCell) && topPdfCell.drawBottomBorder === false) {
                    pdfCell.drawTopBorder = false;
                }
            }
        }
    }
}

function calculateCoordinates(doc, rows, options) {
    let y = options?.topLeft?.y ?? 0;
    rows.forEach(row => {
        let x = options?.topLeft?.x ?? 0;
        const intend = row.indentLevel * options.indent;
        row.cells.forEach(cell => {
            cell.pdfCell._rect.x = x + intend;
            cell.pdfCell._rect.y = y;
            x += cell.pdfCell._rect.w;
        });
        y += row.height;
    });
}

function calculateTableSize(doc, rows, options) {
    const topLeft = options?.topLeft;
    const columnWidths = options?.columnWidths;
    const rowHeights = rows.map(row => row.height);

    return {
        x: topLeft?.x ?? 0,
        y: topLeft?.y ?? 0,
        w: columnWidths?.reduce((a, b) => a + b, 0) ?? 0,
        h: rowHeights?.reduce((a, b) => a + b, 0) ?? 0
    };
}

export { initializeCellsWidth, applyColSpans, applyRowSpans, resizeFirstColumnByIndentLevel, applyBordersConfig, calculateHeights, calculateCoordinates, calculateTableSize };
