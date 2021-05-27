export class CellsSelectionController {
    getCellFromNextRowPosition(currentCellPosition, direction, edgeIndices) {
        const {
            cellIndex,
            rowIndex,
        } = currentCellPosition;

        const deltaPosition = direction === 'next' ? 1 : -1;
        const nextRowIndex = rowIndex + deltaPosition;

        const validRowIndex = nextRowIndex >= 0 && nextRowIndex <= edgeIndices.lastRowIndex
            ? nextRowIndex
            : rowIndex;

        return {
            cellIndex,
            rowIndex: validRowIndex,
        };
    }

    getCellFromNextColumnPosition(options) {
        const {
            currentCellPosition,
            direction,
            edgeIndices,
            isRTL,
            isGroupedByDate,
            groupCount,
            isMultiSelection,
        } = options;
        const {
            cellIndex,
            rowIndex,
        } = currentCellPosition;
        const {
            firstCellIndex,
            lastCellIndex,
            firstRowIndex,
            lastRowIndex,
        } = edgeIndices;

        const step = isGroupedByDate && isMultiSelection ? groupCount : 1;

        const sign = isRTL ? -1 : 1;
        const deltaPosition = direction === 'next' ? sign * step : -1 * sign * step;
        const nextCellIndex = cellIndex + deltaPosition;

        const isValidCellIndex = nextCellIndex >= firstCellIndex
            && nextCellIndex <= lastCellIndex;

        if(isValidCellIndex) {
            return {
                cellIndex: nextCellIndex,
                rowIndex,
            };
        }

        let validCellIndex = nextCellIndex;
        let validRowIndex = rowIndex;
        const isLeftEdgeCell = nextCellIndex < firstCellIndex;
        const isRightEdgeCell = nextCellIndex > lastCellIndex;

        if(isLeftEdgeCell) {
            const anotherCellIndex = lastCellIndex - (step - cellIndex % step - 1);
            const nextRowIndex = rowIndex - 1;

            validRowIndex = nextRowIndex >= firstRowIndex ? nextRowIndex : rowIndex;
            validCellIndex = nextRowIndex >= firstRowIndex ? anotherCellIndex : cellIndex;
        }
        if(isRightEdgeCell) {
            const anotherCellIndex = firstCellIndex + cellIndex % step;
            const nextRowIndex = rowIndex + 1;

            validRowIndex = nextRowIndex <= lastRowIndex ? nextRowIndex : rowIndex;
            validCellIndex = nextRowIndex <= lastRowIndex ? anotherCellIndex : cellIndex;
        }


        return {
            cellIndex: validCellIndex,
            rowIndex: validRowIndex,
        };
    }
}
