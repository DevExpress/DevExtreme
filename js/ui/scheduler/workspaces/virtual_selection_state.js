import dateUtils from '../../../core/utils/date';

export default class VirtualSelectionState {
    constructor(viewDataProvider) {
        this._viewDataProvider = viewDataProvider;

        this._focusedCell = null;
        this._selectedCells = null;

        this._firstSelectedCell = null;
    }

    get viewDataProvider() { return this._viewDataProvider; }

    get focusedCell() { return this._focusedCell; }

    setFocusedCell(rowIndex, columnIndex, isAllDay) {
        if(rowIndex >= 0) {
            const cell = this._viewDataProvider.getCellData(rowIndex, columnIndex, isAllDay);
            this._focusedCell = cell;
        }
    }

    getFocusedCell() {
        const { focusedCell } = this;
        if(!focusedCell) {
            return undefined;
        }

        const { groupIndex, startDate, allDay } = focusedCell;
        const cellPosition = this.viewDataProvider.findCellPositionInMap(groupIndex, startDate, allDay, focusedCell.index);

        return { coordinates: cellPosition, cellData: focusedCell };
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
            startDate: firstStartDate, groupIndex: firstGroupIndex, index: firstCellIndex
        } = firstCell;
        const {
            startDate: lastStartDate, index: lastCellIndex
        } = lastCell;

        const cells = viewDataProvider.getCellsByGroupIndexAndAllDay(firstGroupIndex, isLastCellAllDay);

        const filteredCells = cells.reduce((selectedCells, cellsRow) => {
            const filteredRow = this._filterCellsByDateAndIndex(
                cellsRow
                , firstStartDate
                , lastStartDate
                , firstCellIndex
                , lastCellIndex);
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

    _filterCellsByDateAndIndex(cellsRow, firstDate, lastDate, firstIndex, lastIndex) {
        const firstDay = dateUtils.trimTime(firstDate).getTime();
        const lastDay = dateUtils.trimTime(lastDate).getTime();

        return cellsRow.filter((cell) => {
            const { startDate, index } = cell;
            const day = dateUtils.trimTime(startDate).getTime();

            return this._compareCellsByDateAndIndex(day, index, firstDay, firstIndex, lastDay, lastIndex);
        });
    }

    _compareCellsByDateAndIndex(day, index, firstDay, firstIndex, lastDay, lastIndex) {
        if(firstDay === lastDay) {
            let _firstIndex = firstIndex;
            let _lastIndex = lastIndex;
            if(_firstIndex > _lastIndex) {
                [_firstIndex, _lastIndex] = [_lastIndex, _firstIndex];
            }

            return firstDay === day && index >= _firstIndex && index <= _lastIndex;
        } else {
            return (day === firstDay && index >= firstIndex)
                || (day === lastDay && index <= lastIndex)
                || (firstDay < day && day < lastDay);
        }
    }
}
