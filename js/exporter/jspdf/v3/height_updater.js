import { isDefined } from '../../../core/utils/type';
import { calculateTextHeight } from './pdf_utils_v3';

function updateRowsAndCellsHeights(doc, rows) {
    const rowsAdditionalHeights = calculateAdditionalRowsHeights(doc, rows);

    rowsAdditionalHeights.forEach((height, rowIndex) => {
        rows[rowIndex].height += height;
    });

    rows.forEach((row) => {
        row.cells.forEach(cell => {
            const rowsCount = (cell.rowSpan ?? 0) + 1;
            cell.pdfCell._rect.h = rows
                .slice(row.rowIndex, row.rowIndex + rowsCount)
                .reduce((accumulator, rowInfo) => rowInfo.height + accumulator, 0);
        });
    });
}

function calculateAdditionalRowsHeights(doc, rows) {
    const rowsAdditionalHeights = Array.from({ length: rows.length }, () => 0);

    const sortedRows = sortRowsByMaxRowSpanAsc(rows);
    sortedRows.forEach(row => {
        const cellsWithRowSpan = row.cells
            .filter(cell => isDefined(cell.rowSpan));

        cellsWithRowSpan.forEach(cell => {
            const cellTextHeight = calculateTextHeight(doc, cell.pdfCell.text, cell.pdfCell.font, {
                wordWrapEnabled: cell.pdfCell.wordWrapEnabled,
                columnWidth: cell.pdfCell._rect.w
            });
            const rowsCount = (cell.rowSpan ?? 0) + 1;
            const summaryRowsHeight = calculateSummaryRowsHeight(rows, rowsAdditionalHeights, row.rowIndex, rowsCount);
            if(cellTextHeight > summaryRowsHeight) {
                const delta = (cellTextHeight - summaryRowsHeight) / rowsCount;
                for(let spanIndex = row.rowIndex; spanIndex < row.rowIndex + rowsCount; spanIndex++) {
                    rowsAdditionalHeights[spanIndex] += delta;
                }
            }
        });
    });

    return rowsAdditionalHeights;
}

function calculateSummaryRowsHeight(rows, rowsAdditionalHeights, rowFromIndex, rowsCount) {
    return rows
        .slice(rowFromIndex, rowFromIndex + rowsCount)
        .reduce((accumulator, row) => accumulator + row.height + rowsAdditionalHeights[row.rowIndex], 0);
}

function sortRowsByMaxRowSpanAsc(rows) {
    const getMaxRowSpan = (row) => {
        const rowSpansArray = row.cells.map(cell => cell.rowSpan ?? 0);
        return Math.max(...rowSpansArray, 0);
    };

    const sortByMaxRowSpan = (row1, row2) => {
        const row1RowSpan = getMaxRowSpan(row1);
        const row2RowSpan = getMaxRowSpan(row2);
        if(row1RowSpan > row2RowSpan) {
            return 1;
        }
        if(row2RowSpan > row1RowSpan) {
            return -1;
        }
        return 0;
    };

    return [...rows].sort(sortByMaxRowSpan);
}

export { updateRowsAndCellsHeights };
