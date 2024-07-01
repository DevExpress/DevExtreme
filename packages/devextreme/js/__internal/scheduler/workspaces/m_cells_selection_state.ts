export default class CellsSelectionState {
  _focusedCell: any = null;

  _selectedCells: any = null;

  _firstSelectedCell: any = null;

  _prevFocusedCell: any = null;

  _prevFirstSelectedCell: any;

  _prevSelectedCells: any = null;

  constructor(public _viewDataProvider) {
  }

  get viewDataProvider() { return this._viewDataProvider; }

  get focusedCell() {
    const focusedCell = this._focusedCell;

    if (!focusedCell) {
      return undefined;
    }

    const { groupIndex, startDate, allDay } = focusedCell;
    const cellInfo = {
      groupIndex, startDate, isAllDay: allDay, index: focusedCell.index,
    };
    const cellPosition = this.viewDataProvider.findCellPositionInMap(cellInfo);

    return { coordinates: cellPosition, cellData: focusedCell };
  }

  setFocusedCell(rowIndex, columnIndex, isAllDay) {
    if (rowIndex >= 0) {
      const cell = this._viewDataProvider.getCellData(rowIndex, columnIndex, isAllDay);
      this._focusedCell = cell;
    }
  }

  setSelectedCells(lastCellCoordinates, firstCellCoordinates: any = undefined) {
    const viewDataProvider = this._viewDataProvider;
    const {
      rowIndex: lastRowIndex, columnIndex: lastColumnIndex, allDay: isLastCellAllDay,
    } = lastCellCoordinates;

    if (lastRowIndex < 0) {
      return;
    }

    const firstCell = firstCellCoordinates
      ? viewDataProvider.getCellData(
        firstCellCoordinates.rowIndex,
        firstCellCoordinates.columnIndex,
        firstCellCoordinates.allDay,
      )
      : this._firstSelectedCell;
    const lastCell = viewDataProvider.getCellData(lastRowIndex, lastColumnIndex, isLastCellAllDay);

    this._firstSelectedCell = firstCell;

    this._selectedCells = this._viewDataProvider.getCellsBetween(firstCell, lastCell);
  }

  setSelectedCellsByData(selectedCellsData) {
    this._selectedCells = selectedCellsData;
  }

  getSelectedCells() {
    return this._selectedCells;
  }

  releaseSelectedAndFocusedCells() {
    this.releaseSelectedCells();
    this.releaseFocusedCell();
  }

  releaseSelectedCells() {
    this._prevSelectedCells = this._selectedCells;
    this._prevFirstSelectedCell = this._firstSelectedCell;

    this._selectedCells = null;
    this._firstSelectedCell = null;
  }

  releaseFocusedCell() {
    this._prevFocusedCell = this._focusedCell;
    this._focusedCell = null;
  }

  restoreSelectedAndFocusedCells() {
    this._selectedCells = this._selectedCells || this._prevSelectedCells;
    this._focusedCell = this._focusedCell || this._prevFocusedCell;
    this._firstSelectedCell = this._firstSelectedCell || this._prevFirstSelectedCell;

    this._prevSelectedCells = null;
    this._prevFirstSelectedCell = null;
    this._prevFocusedCell = null;
  }

  clearSelectedAndFocusedCells() {
    this._prevSelectedCells = null;
    this._selectedCells = null;

    this._prevFocusedCell = null;
    this._focusedCell = null;
  }
}
