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
        const deltaCellIndex = direction === 'next' ? sign * step : -1 * sign * step;
        const nextCellIndex = cellIndex + deltaCellIndex;

        const isValidCellIndex = nextCellIndex >= firstCellIndex
            && nextCellIndex <= lastCellIndex;

        if(isValidCellIndex) {
            return {
                cellIndex: nextCellIndex,
                rowIndex,
            };
        }

        return this._processEdgeCell({
            nextCellIndex,
            rowIndex,
            cellIndex,
            firstCellIndex,
            lastCellIndex,
            firstRowIndex,
            lastRowIndex,
            step,
        });
    }

    _processEdgeCell(options) {
        const {
            nextCellIndex,
            rowIndex,
            cellIndex,
            firstCellIndex,
            lastCellIndex,
            firstRowIndex,
            lastRowIndex,
            step,
        } = options;

        let validCellIndex = nextCellIndex;
        let validRowIndex = rowIndex;
        const isLeftEdgeCell = nextCellIndex < firstCellIndex;
        const isRightEdgeCell = nextCellIndex > lastCellIndex;

        if(isLeftEdgeCell) {
            const cellIndexInNextRow = lastCellIndex - (step - cellIndex % step - 1);
            const nextRowIndex = rowIndex - 1;
            const isValidRowIndex = nextRowIndex >= firstRowIndex;

            validRowIndex = isValidRowIndex ? nextRowIndex : rowIndex;
            validCellIndex = isValidRowIndex ? cellIndexInNextRow : cellIndex;
        }

        if(isRightEdgeCell) {
            const cellIndexInNextRow = firstCellIndex + cellIndex % step;
            const nextRowIndex = rowIndex + 1;
            const isValidRowIndex = nextRowIndex <= lastRowIndex;

            validRowIndex = isValidRowIndex ? nextRowIndex : rowIndex;
            validCellIndex = isValidRowIndex ? cellIndexInNextRow : cellIndex;
        }

        return {
            cellIndex: validCellIndex,
            rowIndex: validRowIndex,
        };
    }
}
