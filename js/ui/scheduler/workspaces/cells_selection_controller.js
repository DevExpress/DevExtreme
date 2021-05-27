export class CellsSelectionController {
    getCellFromNextRowPosition(currentCellPosition, direction, viewDimensions) {
        const {
            cellIndex,
            rowIndex,
        } = currentCellPosition;

        const deltaPosition = direction === 'next' ? 1 : -1;
        const nextRowIndex = rowIndex + deltaPosition;

        const validRowIndex = nextRowIndex >= 0 && nextRowIndex <= viewDimensions.lastRowIndex
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

        const isValidCellIndex = nextCellIndex >= viewDimensions.firstCellIndex
            && nextCellIndex <= viewDimensions.lastCellIndex;

        let validCellIndex = nextCellIndex;
        let validRowIndex = rowIndex;

        if(!isValidCellIndex) {
            const isLeftEdgeCell = nextCellIndex < viewDimensions.firstCellIndex;
            const isRightEdgeCell = nextCellIndex > viewDimensions.lastCellIndex;

            if(isLeftEdgeCell) {
                const anotherCellIndex = viewDimensions.lastCellIndex - (step - cellIndex % step - 1);
                const nextRowIndex = rowIndex - 1;

                validRowIndex = nextRowIndex >= 0 ? nextRowIndex : rowIndex;
                validCellIndex = nextRowIndex >= 0 ? anotherCellIndex : cellIndex;
            }
            if(isRightEdgeCell) {
                const anotherCellIndex = viewDimensions.firstCellIndex + cellIndex % step;
                const nextRowIndex = rowIndex + 1;

                validRowIndex = nextRowIndex <= viewDimensions.lastRowIndex ? nextRowIndex : rowIndex;
                validCellIndex = nextRowIndex <= viewDimensions.lastRowIndex ? anotherCellIndex : cellIndex;
            }
        }


        return {
            cellIndex: validCellIndex,
            rowIndex: validRowIndex,
        };
    }
}
