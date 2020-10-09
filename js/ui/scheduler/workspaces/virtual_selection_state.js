import dateUtils from '../../../core/utils/date';

export default class VirtualSelectionState {
    constructor(viewDataProvider) {
        this._viewDataProvider = viewDataProvider;

        this._focusedCell = null;
        this._selectedCells = null;

        this._firstSelectedCell = null;
    }

    setFocusedCell(rowIndex, columnIndex, isAllDay) {
        if(rowIndex >= 0) {
            const cell = this._viewDataProvider.getCellData(rowIndex, columnIndex, isAllDay);
            this._focusedCell = cell;
        }
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

    setSelectedCells(lastCellCoordinates, firstCellCoordinates = undefined) {
        const viewDataProvider = this._viewDataProvider;
        const {
            rowIndex: lastRowIndex, columnIndex: lastColumnIndex, allDay: isLastCellAllDay,
        } = lastCellCoordinates;

        if(lastRowIndex < 0) {
            return;
        }

        let firstCell = firstCellCoordinates
            ? viewDataProvider.getCellData(
                firstCellCoordinates.rowIndex,
                firstCellCoordinates.columnIndex,
                firstCellCoordinates.allDay,
            )
            : this._firstSelectedCell;
        let lastCell = viewDataProvider.getCellData(lastRowIndex, lastColumnIndex, isLastCellAllDay);

        this._firstSelectedCell = firstCell;

        if(firstCell.startDate.getTime() > lastCell.startDate.getTime()) {
            [firstCell, lastCell] = [lastCell, firstCell];
        }

        const {
            startDate: firstStartDate, groupIndex: firstGroupIndex,
        } = firstCell;
        const {
            startDate: lastStartDate,
        } = lastCell;

        const cells = viewDataProvider.getCellsByGroupIndexAndAllDay(firstGroupIndex, isLastCellAllDay);

        const filteredCells = cells.reduce((selectedCells, cellsRow) => {
            const filteredRow = this._filterCellsByDate(cellsRow, firstStartDate, lastStartDate);
            selectedCells.push(...filteredRow);

            return selectedCells;
        }, []);

        this._selectedCells = filteredCells.sort(
            (firstCell, secondCell) => firstCell.startDate.getTime() - secondCell.startDate.getTime(),
        );
    }

    getSelectedCells() {
        return this._selectedCells;
    }

    releaseSelectedAndFocusedCells() {
        this.releaseSelectedCells();
        this.releaseFocusedCell();
    }

    releaseSelectedCells() {
        this._selectedCells = null;
        this._firstSelectedCell = null;
    }

    releaseFocusedCell() {
        this._focusedCell = null;
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

    _filterCellsByDate(cellsRow, firstDate, lastDate) {
        const firstTime = firstDate.getTime();
        const lastTime = lastDate.getTime();

        return cellsRow.filter((cell) => {
            const { startDate } = cell;
            const time = startDate.getTime();

            return firstTime <= time && time <= lastTime;
        });
    }
}
