export default class VirtualSelectionState {
    constructor(workspace, viewDataProvider) {
        this._workspace = workspace;
        this._viewDataProvider = viewDataProvider;

        this._focusedCell = null;
        this._selectedCells = null;

        this._firstSelectedCellCoordinates = null;
        this._lastSelectedCellCoordinates = null;
    }

    setFocusedCell(rowIndex, columnIndex, isAllDay) {
        const cell = this._viewDataProvider.getCellData(rowIndex, columnIndex, isAllDay);
        this._focusedCell = cell;
    }

    getFocusedCell() {
        const { _focusedCell } = this;
        if(!_focusedCell) {
            return {};
        }

        const columnIndex = this._getColumnIndexByCellData(_focusedCell);
        const rowIndex = this._getRowIndexByColumnAndData(_focusedCell, columnIndex);

        return { coordinates: { cellIndex: columnIndex, rowIndex }, cellData: _focusedCell };
    }

    setSelectedCells(firstCellCoordinates, lastCellCoordinates) {
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

    _getColumnIndexByCellData(cellData) {
        const isVerticalGrouping = this._workspace._isVerticalGroupedWorkSpace();
        const { viewDataMap } = this._viewDataProvider;
        const { startDate, groupIndex } = cellData;

        return viewDataMap[0].findIndex(({
            cellData: { startDate: currentStartDate, groupIndex: currentGroupIndex },
        }) => {
            return startDate.getDate() === currentStartDate.getDate()
              && ((groupIndex === currentGroupIndex) || isVerticalGrouping);
        });
    }

    _getRowIndexByColumnAndData(cellData, columnIndex) {
        const { viewDataMap } = this._viewDataProvider;
        const { startDate, groupIndex } = cellData;

        return viewDataMap.findIndex((cellsRow) => {
            const { cellData: currentCellData } = cellsRow[columnIndex];
            const {
                startDate: currentStartDate,
                groupIndex: currentGroupIndex,
            } = currentCellData;

            return startDate.getTime() === currentStartDate.getTime()
              && groupIndex === currentGroupIndex;
        });
    }
}
