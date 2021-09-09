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

    const getRowsCount = (rowSpan) => rowSpan + 1;
    const calculateSummaryRowsHeightWithAdditionalHeights = (rowFromIndex, rowSpan) => {
        return rows
            .slice(rowFromIndex, rowFromIndex + getRowsCount(rowSpan))
            .reduce((accumulator, row) => accumulator + row.height + rowsAdditionalHeights[row.rowIndex], 0);
    };
    const getMaxRowSpanValue = (row) => {
        const rowSpans = row.cells.map(cell => cell.rowSpan ?? 0);
        return Math.max(...rowSpans, 0);
    };
    const sortByMaxRowSpanAsc = (a, b) => getMaxRowSpanValue(a) > getMaxRowSpanValue(b) ? 1 : getMaxRowSpanValue(b) > getMaxRowSpanValue(a) ? -1 : 0;

    [...rows].sort(sortByMaxRowSpanAsc)
        .forEach(row => {
            const cellsWithRowSpan = row.cells
                .filter(cell => isDefined(cell.rowSpan));

            cellsWithRowSpan.forEach(cell => {
                const textHeight = calculateTextHeight(doc, cell.pdfCell.text, cell.pdfCell.font, {
                    wordWrapEnabled: cell.pdfCell.wordWrapEnabled,
                    columnWidth: cell.pdfCell._rect.w
                });
                const summaryRowHeight = calculateSummaryRowsHeightWithAdditionalHeights(row.rowIndex, cell.rowSpan);
                if(textHeight > summaryRowHeight) {
                    const delta = (textHeight - summaryRowHeight) / getRowsCount(cell.rowSpan);
                    for(let spanIndex = row.rowIndex; spanIndex < row.rowIndex + getRowsCount(cell.rowSpan); spanIndex++) {
                        rowsAdditionalHeights[spanIndex] += delta;
                    }
                }
            });
        });

    rowsAdditionalHeights.forEach((additionalHeight, rowIndex) => {
        rows[rowIndex].height += additionalHeight;
    });

    rows.forEach((currentRow, rowIndex) => {
        currentRow.cells.forEach(cell => {
            cell.pdfCell._rect.h = rows
                .slice(rowIndex, rowIndex + getRowsCount(cell.rowSpan ?? 0))
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
