import type { CellPositionData, ViewCellData } from '@ts/scheduler/types';

import type { CellPosition } from './view_model/m_types';
import type ViewDataProvider from './view_model/m_view_data_provider';

export default class CellsSelectionState {
  private focusedCell: ViewCellData | null = null;

  private selectedCells: ViewCellData[] | null = null;

  private firstSelectedCell: ViewCellData | null = null;

  private prevFocusedCell: ViewCellData | null = null;

  private prevFirstSelectedCell: ViewCellData | null | undefined;

  private prevSelectedCells: ViewCellData[] | null = null;

  constructor(public viewDataProvider: ViewDataProvider) {}

  getFocusedCell(): {
    coordinates: CellPositionData | undefined,
    cellData: ViewCellData,
  } | undefined {
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

  setFocusedCell(rowIndex: number, columnIndex: number, isAllDay: boolean): void {
    if (rowIndex >= 0) {
      this.focusedCell = this.viewDataProvider.getCellData(rowIndex, columnIndex, isAllDay);
    }
  }

  setSelectedCells(
    lastCellCoordinates: CellPosition,
    firstCellCoordinates?: CellPosition,
  ): void {
    const { viewDataProvider } = this;
    const {
      rowIndex: lastRowIndex, columnIndex: lastColumnIndex, allDay: isLastCellAllDay,
    } = lastCellCoordinates;

    if (lastRowIndex < 0) {
      return;
    }

    const lastCell = viewDataProvider.getCellData(
      lastRowIndex,
      lastColumnIndex,
      isLastCellAllDay,
    );

    const firstCell = firstCellCoordinates
      ? viewDataProvider.getCellData(
        firstCellCoordinates.rowIndex,
        firstCellCoordinates.columnIndex,
        firstCellCoordinates.allDay,
      )
      : (this.firstSelectedCell ?? lastCell);

    this.firstSelectedCell = firstCell;

    this.selectedCells = this.viewDataProvider.getCellsBetween(
      firstCell,
      lastCell,
    );
  }

  setSelectedCellsByData(selectedCellsData: ViewCellData[]): void {
    this.selectedCells = selectedCellsData;
  }

  getSelectedCells(): ViewCellData[] | null {
    return this.selectedCells;
  }

  releaseSelectedAndFocusedCells(): void {
    this.releaseSelectedCells();
    this.releaseFocusedCell();
  }

  releaseSelectedCells(): void {
    this.prevSelectedCells = this.selectedCells;
    this.prevFirstSelectedCell = this.firstSelectedCell;

    this.selectedCells = null;
    this.firstSelectedCell = null;
  }

  releaseFocusedCell(): void {
    this.prevFocusedCell = this.focusedCell;
    this.focusedCell = null;
  }

  restoreSelectedAndFocusedCells(): void {
    this.selectedCells = this.selectedCells ?? this.prevSelectedCells;
    this.focusedCell = this.focusedCell ?? this.prevFocusedCell;
    this.firstSelectedCell = this.firstSelectedCell ?? this.prevFirstSelectedCell ?? null;

    this.prevSelectedCells = null;
    this.prevFirstSelectedCell = null;
    this.prevFocusedCell = null;
  }

  clearSelectedAndFocusedCells(): void {
    this.prevSelectedCells = null;
    this.selectedCells = null;

    this.prevFocusedCell = null;
    this.focusedCell = null;
  }
}
