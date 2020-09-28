import dateUtils from '../../../core/utils/date';

export default class VirtualSelectionState {
    constructor(viewDataProvider) {
        this._viewDataProvider = viewDataProvider;

        this._focusedCell = null;
        this._selectedCells = null;

        this._firstSelectedCellCoordinates = null;
        this._lastSelectedCellCoordinates = null;

        this._firstSelectedCell = null;
    }

    setFocusedCell(rowIndex, columnIndex, isAllDay) {
        const cell = this._viewDataProvider.getCellData(rowIndex, columnIndex, isAllDay);
        this._focusedCell = cell;
    }

    getFocusedCell(isVerticalGroupOrientation) {
        const { _focusedCell } = this;
        if(!_focusedCell) {
            return undefined;
        }

        const columnIndex = this._getColumnIndexByCellData(_focusedCell, isVerticalGroupOrientation);
        const rowIndex = this._getRowIndexByColumnAndData(_focusedCell, columnIndex, isVerticalGroupOrientation);

        return { coordinates: { cellIndex: columnIndex, rowIndex }, cellData: _focusedCell };
    }

    setSelectedCells(lastCellCoordinates, firstCellCoordinates) {
        this._firstSelectedCellCoordinates = firstCellCoordinates || this._firstSelectedCellCoordinates;
        this._lastSelectedCellCoordinates = lastCellCoordinates || this._lastSelectedCellCoordinates;

        const viewDataProvider = this._viewDataProvider;

        const {
            rowIndex: firstRowIndex, columnIndex: firstColumnIndex, allDay: isFirstCellAllDay,
        } = this._firstSelectedCellCoordinates;
        const {
            rowIndex: lastRowIndex, columnIndex: lastColumnIndex, allDay: isLastCellAllDay,
        } = this._lastSelectedCellCoordinates;

        let firstCell = viewDataProvider.getCellData(firstRowIndex, firstColumnIndex, isFirstCellAllDay);
        let lastCell = viewDataProvider.getCellData(lastRowIndex, lastColumnIndex, isLastCellAllDay);

        this._firstSelectedCell = firstCellCoordinates ? firstCell : this._firstSelectedCell;

        firstCell = this._firstSelectedCell;

        if(firstCell.startDate.getTime() > lastCell.startDate.getTime()) {
            [firstCell, lastCell] = [lastCell, firstCell];
        }

        const {
            startDate: firstStartDate, groupIndex: firstGroupIndex,
        } = firstCell;
        const {
            startDate: lastStartDate,
        } = lastCell;
        const firstTime = firstStartDate.getTime();
        const lastTime = lastStartDate.getTime();

        const cells = viewDataProvider.getCellsByGroupIndexAndAllDay(firstGroupIndex, isFirstCellAllDay);

        this._selectedCells = cells.reduce((selectedCells, cellsRow) => {
            selectedCells.push(...cellsRow.reduce((cellsFromRow, cell) => {
                const { startDate, groupIndex } = cell;
                const time = startDate.getTime();
                if(firstTime <= time && time <= lastTime && groupIndex === firstGroupIndex) {
                    cellsFromRow.push(cell);
                }

                return cellsFromRow;
            }, []));

            return selectedCells;
        }, [])
            .sort((firstCell, secondCell) => firstCell.startDate.getTime() - secondCell.startDate.getTime());
    }

    getSelectedCells() {
        return this._selectedCells;
    }

    releaseSelectedAndFocusedCells() {
        this.releaseSelectedCells();
        this.releaseFocusedCell();
    }

    releaseSelectedCells() {
        delete this._selectedCells;
        delete this._firstSelectedCell;
        delete this._firstSelectedCellCoordinates;
        delete this._lastSelectedCellCoordinates;
    }

    releaseFocusedCell() {
        delete this._focusedCell;
    }

    isValidFocusedCell(nextFocusedCellData) {
        const focusedCell = this._focusedCell;

        if(!focusedCell) {
            return true;
        }

        const { groupIndex, allDay } = focusedCell;
        const {
            groupIndex: nextGroupIndex,
            allDay: nextAllDay,
        } = nextFocusedCellData;

        return groupIndex === nextGroupIndex && allDay === nextAllDay;
    }

    _getColumnIndexByCellData(cellData, isVerticalGroupOrientation) {
        const { viewDataMap } = this._viewDataProvider;
        const { startDate, groupIndex } = cellData;
        const firstRow = viewDataMap[0];
        const startTime = dateUtils.trimTime(startDate).getTime();

        for(let columnIndex = 0; columnIndex < firstRow.length; columnIndex += 1) {
            const {
                cellData: { startDate: currentStartDate, groupIndex: currentGroupIndex },
            } = firstRow[columnIndex];

            if(startTime === dateUtils.trimTime(currentStartDate).getTime()
                && ((groupIndex === currentGroupIndex) || isVerticalGroupOrientation)) {
                return columnIndex;
            }
        }
    }

    _getRowIndexByColumnAndData(cellData, columnIndex, isVerticalGroupOrientation) {
        const { viewDataMap } = this._viewDataProvider;
        const { startDate, groupIndex, allDay } = cellData;

        if(allDay && !isVerticalGroupOrientation) {
            return 0;
        }

        for(let rowIndex = 0; rowIndex < viewDataMap.length; rowIndex += 1) {
            const { cellData: currentCellData } = viewDataMap[rowIndex][columnIndex];
            const {
                startDate: currentStartDate,
                groupIndex: currentGroupIndex,
                allDay: currentAllDay
            } = currentCellData;

            if(startDate.getTime() === currentStartDate.getTime()
                && groupIndex === currentGroupIndex
                && allDay === currentAllDay) {
                return rowIndex;
            }
        }
    }
}
