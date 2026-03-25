import type ViewDataProvider from './view_model/m_view_data_provider';

export default class CellsSelectionState {
  private focusedCell: any = null;

  private selectedCells: any = null;

  private firstSelectedCell: any = null;

  private prevFocusedCell: any = null;

  private prevFirstSelectedCell: any;

  private prevSelectedCells: any = null;

  constructor(public viewDataProvider: ViewDataProvider) {}

  getFocusedCell() {
    const { focusedCell } = this;

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
      const cell = this.viewDataProvider.getCellData(rowIndex, columnIndex, isAllDay);
      this.focusedCell = cell;
    }
  }

  setSelectedCells(lastCellCoordinates, firstCellCoordinates: any = undefined) {
    const { viewDataProvider } = this;
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
      : this.firstSelectedCell;
    const lastCell = viewDataProvider.getCellData(lastRowIndex, lastColumnIndex, isLastCellAllDay);

    this.firstSelectedCell = firstCell;

    this.selectedCells = this.viewDataProvider.getCellsBetween(firstCell, lastCell);
  }

  setSelectedCellsByData(selectedCellsData) {
    this.selectedCells = selectedCellsData;
  }

  getSelectedCells() {
    return this.selectedCells;
  }

  releaseSelectedAndFocusedCells() {
    this.releaseSelectedCells();
    this.releaseFocusedCell();
  }

  releaseSelectedCells() {
    this.prevSelectedCells = this.selectedCells;
    this.prevFirstSelectedCell = this.firstSelectedCell;

    this.selectedCells = null;
    this.firstSelectedCell = null;
  }

  releaseFocusedCell() {
    this.prevFocusedCell = this.focusedCell;
    this.focusedCell = null;
  }

  restoreSelectedAndFocusedCells() {
    this.selectedCells = this.selectedCells || this.prevSelectedCells;
    this.focusedCell = this.focusedCell || this.prevFocusedCell;
    this.firstSelectedCell = this.firstSelectedCell || this.prevFirstSelectedCell;

    this.prevSelectedCells = null;
    this.prevFirstSelectedCell = null;
    this.prevFocusedCell = null;
  }

  clearSelectedAndFocusedCells() {
    this.prevSelectedCells = null;
    this.selectedCells = null;

    this.prevFocusedCell = null;
    this.focusedCell = null;
  }
}
