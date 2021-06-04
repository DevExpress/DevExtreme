export class CellsSelectionController {
    handleArrowClick(options) {
        const {
            key,
            focusedCellPosition,
            edgeIndices,
            getCellDataByPosition,
            isAllDayPanelCell,
        } = options;

        let nextCellIndices;

        switch(key) {
            case 'down':
                nextCellIndices = this.getCellFromNextRowPosition(
                    focusedCellPosition, 'next', edgeIndices,
                );
                break;
            case 'up':
                nextCellIndices = this.getCellFromNextRowPosition(
                    focusedCellPosition, 'prev', edgeIndices,
                );
                break;
            case 'left':
                nextCellIndices = this.getCellFromNextColumnPosition({
                    ...options,
                    direction: 'prev',
                });
                break;
            case 'right':
                nextCellIndices = this.getCellFromNextColumnPosition({
                    ...options,
                    direction: 'next',
                });
                break;
        }

        const currentCellData = getCellDataByPosition(
            nextCellIndices.rowIndex,
            nextCellIndices.cellIndex,
            isAllDayPanelCell,
        );

        return this.moveToCell({
            ...options,
            currentCellData,
        });
    }

    getCellFromNextRowPosition(focusedCellPosition, direction, edgeIndices) {
        const {
            cellIndex,
            rowIndex,
        } = focusedCellPosition;

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
            focusedCellPosition,
            direction,
            edgeIndices,
            isRTL,
            isGroupedByDate,
            groupCount,
            isMultiSelection,
            isDateAndTimeView,
        } = options;
        const {
            cellIndex,
            rowIndex,
        } = focusedCellPosition;
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

        return isDateAndTimeView ? focusedCellPosition : this._processEdgeCell({
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

    moveToCell(options) {
        const {
            isMultiSelection,
            isMultiSelectionAllowed,
            focusedCellData,
            currentCellData,
        } = options;

        const isValidMultiSelection = isMultiSelection && isMultiSelectionAllowed;

        const nextFocusedCellData = isValidMultiSelection
            ? this._getNextCellData(currentCellData, focusedCellData)
            : currentCellData;

        return nextFocusedCellData;
    }

    _getNextCellData(nextFocusedCellData, focusedCellData, isVirtualCell) {
        if(isVirtualCell) {
            return focusedCellData;
        }

        const isValidNextFocusedCell = this._isValidNextFocusedCell(nextFocusedCellData, focusedCellData);

        return isValidNextFocusedCell ? nextFocusedCellData : focusedCellData;
    }

    _isValidNextFocusedCell(nextFocusedCellData, focusedCellData) {
        if(!focusedCellData) {
            return true;
        }

        const { groupIndex, allDay } = focusedCellData;
        const {
            groupIndex: nextGroupIndex,
            allDay: nextAllDay,
        } = nextFocusedCellData;

        return groupIndex === nextGroupIndex && allDay === nextAllDay;
    }
}
