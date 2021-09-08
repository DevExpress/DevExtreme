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
            : calculateRowHeight(doc, pdfCells, pdfCells.map(c => c._rect.w));
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

export { initializeCellsWidth, applyColSpans, applyRowSpans, calculateHeights, calculateCoordinates };
