export class CellsSelectionController {
    getCellFromNextRowPosition(currentCellPosition, direction, viewDimensions) {
        const {
            cellIndex,
            rowIndex,
        } = currentCellPosition;

        const deltaPosition = direction === 'next' ? 1 : -1;
        const nextRowIndex = rowIndex + deltaPosition;

        const validRowIndex = nextRowIndex >= 0 && nextRowIndex < viewDimensions.rowsCount
            ? nextRowIndex
            : rowIndex;

        return {
            cellIndex,
            rowIndex: validRowIndex,
        };
    }

    getCellFromNextColumnPosition(currentCellPosition, direction, viewDimensions, step, isRTL) {
        const {
            cellIndex,
            rowIndex,
        } = currentCellPosition;

        const sign = isRTL ? -1 : 1;
        const deltaPosition = direction === 'next' ? sign * step : -1 * sign * step;
        const nextCellIndex = cellIndex + deltaPosition;

        const isValidCellIndex = nextCellIndex >= 0 && nextCellIndex < viewDimensions.columnsCount;

        let validCellIndex = nextCellIndex;
        let validRowIndex = rowIndex;

        if(!isValidCellIndex) {
            const isLeftEdgeCell = nextCellIndex < 0;
            const isRightEdgeCell = nextCellIndex === viewDimensions.columnsCount;

            if(isLeftEdgeCell) {
                const anotherCellIndex = viewDimensions.columnsCount - 1;
                const nextRowIndex = rowIndex - 1;

                validRowIndex = nextRowIndex >= 0 ? nextRowIndex : rowIndex;
                validCellIndex = nextRowIndex >= 0 ? anotherCellIndex : cellIndex;
            }
            if(isRightEdgeCell) {
                const anotherCellIndex = 0;
                const nextRowIndex = rowIndex + 1;

                validRowIndex = nextRowIndex < viewDimensions.rowsCount ? nextRowIndex : rowIndex;
                validCellIndex = nextRowIndex < viewDimensions.rowsCount ? anotherCellIndex : cellIndex;
            }
        }


        return {
            cellIndex: validCellIndex,
            rowIndex: validRowIndex,
        };
    }
}
