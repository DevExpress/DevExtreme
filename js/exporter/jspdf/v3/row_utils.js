import { isDefined } from '../../../core/utils/type';
import { calculateRowHeight, calculateTextHeight } from './pdf_utils_v3';


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

function recalculateHeightForMergedRows(doc, rows) {
    const rowsAdditionalHeights = Array.from({ length: rows.length }, () => 0);
    const calculateSummaryRowsHeightWithAdditionalHeights = (rowFromIndex, rowSpan) => {
        let height = 0;
        for(let rowIndex = rowFromIndex; rowIndex <= rowFromIndex + rowSpan; rowIndex++) {
            height += rows[rowIndex].height + rowsAdditionalHeights[rowIndex];
        }
        return height;
    };

    const sortByRowSpanAsc = (a, b) => a.rowSpan > b.rowSpan ? 1 : b.rowSpan > a.rowSpan ? -1 : 0;
    for(let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const orderedCellsWithRowSpan = rows[rowIndex].cells
            .filter(cell => isDefined(cell.rowSpan))
            .sort(sortByRowSpanAsc);

        orderedCellsWithRowSpan.forEach(cell => {
            const pdfCell = cell.pdfCell;
            const textHeight = calculateTextHeight(doc, pdfCell.text, pdfCell.font, {
                wordWrapEnabled: pdfCell.wordWrapEnabled,
                columnWidth: pdfCell._rect.w
            });
            const summaryHeight = calculateSummaryRowsHeightWithAdditionalHeights(rowIndex, cell.rowSpan);
            if(textHeight > summaryHeight) {
                const delta = (textHeight - summaryHeight) / (cell.rowSpan + 1);
                for(let spanIndex = rowIndex; spanIndex <= rowIndex + cell.rowSpan; spanIndex++) {
                    if(delta > rowsAdditionalHeights[spanIndex]) {
                        rowsAdditionalHeights[spanIndex] = delta;
                    }
                }
            }
        });
    }

    rowsAdditionalHeights.forEach((additionalHeight, rowIndex) => {
        rows[rowIndex].height += additionalHeight;
    });

    rows.forEach((currentRow, rowIndex) => {
        currentRow.cells.forEach(cell => {
            cell.pdfCell._rect.h = rows
                .slice(rowIndex, rowIndex + (isDefined(cell.rowSpan) ? cell.rowSpan + 1 : 1))
                .reduce((accumulator, row) => row.height + accumulator, 0);
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

export { initializeCellsWidth, applyColSpans, applyRowSpans, calculateHeights, recalculateHeightForMergedRows, calculateCoordinates };
