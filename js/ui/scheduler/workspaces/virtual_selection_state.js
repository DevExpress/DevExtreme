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
        const cellInfo = { groupIndex, startDate, isAllDay: allDay, index: focusedCell.index };
        const cellPosition = this.viewDataProvider.findCellPositionInMap(cellInfo);

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
            const filterData = {
                firstDate: firstStartDate, lastDate: lastStartDate,
                firstIndex: firstCellIndex, lastIndex: lastCellIndex
            };
            const filteredRow = this._filterCellsByDateAndIndex(cellsRow, filterData);
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

    _filterCellsByDateAndIndex(cellsRow, filterData) {
        const {
            firstDate, lastDate,
            firstIndex, lastIndex
        } = filterData;

        const firstDay = dateUtils.trimTime(firstDate).getTime();
        const lastDay = dateUtils.trimTime(lastDate).getTime();

        return cellsRow.filter((cell) => {
            const { startDate, index } = cell;
            const day = dateUtils.trimTime(startDate).getTime();
            const daysAndIndexes = {
                day, index,
                firstDay, firstIndex,
                lastDay, lastIndex
            };

            return this._compareCellsByDateAndIndex(daysAndIndexes);
        });
    }

    _compareCellsByDateAndIndex(daysAndIndexes) {
        const {
            day, index,
            firstDay, firstIndex,
            lastDay, lastIndex
        } = daysAndIndexes;

        if(firstDay === lastDay) {
            let validFirstIndex = firstIndex;
            let validLastIndex = lastIndex;
            if(validFirstIndex > validLastIndex) {
                [validFirstIndex, validLastIndex] = [validLastIndex, validFirstIndex];
            }

            return firstDay === day && index >= validFirstIndex && index <= validLastIndex;
        } else {
            return (day === firstDay && index >= firstIndex)
                || (day === lastDay && index <= lastIndex)
                || (firstDay < day && day < lastDay);
        }
    }
}
