import { isDateAndTimeView } from '@ts/scheduler/r1/utils/index';
import type { ViewCellData, ViewType } from '@ts/scheduler/types';

interface GridPosition {
  rowIndex: number;
  columnIndex: number;
}

interface EdgeIndices {
  firstColumnIndex: number;
  lastColumnIndex: number;
  firstRowIndex: number;
  lastRowIndex: number;
}

interface ArrowClickOptions {
  key: 'up' | 'down' | 'left' | 'right';
  focusedCellPosition?: GridPosition;
  focusedCellData: ViewCellData;
  edgeIndices: EdgeIndices;
  getCellDataByPosition: (rowIndex: number, columnIndex: number, isAllDay: boolean) => ViewCellData;
  isAllDayPanelCell: boolean;
  isRTL: boolean;
  isGroupedByDate: boolean;
  groupCount: number;
  isMultiSelection: boolean;
  isMultiSelectionAllowed: boolean;
  viewType: ViewType;
}

interface NextColumnPositionOptions extends ArrowClickOptions {
  direction: 'next' | 'prev';
  focusedCellPosition: GridPosition;
}

interface ProcessEdgeCellOptions {
  nextColumnIndex: number;
  rowIndex: number;
  columnIndex: number;
  firstColumnIndex: number;
  lastColumnIndex: number;
  firstRowIndex: number;
  lastRowIndex: number;
  step: number;
}

interface MoveToCellOptions {
  isMultiSelection: boolean;
  isMultiSelectionAllowed: boolean;
  focusedCellData: ViewCellData;
  currentCellData: ViewCellData;
  isVirtualCell?: boolean;
}

export class CellsSelectionController {
  handleArrowClick(options: ArrowClickOptions): ViewCellData {
    const {
      key,
      focusedCellPosition,
      edgeIndices,
      getCellDataByPosition,
      isAllDayPanelCell,
      focusedCellData,
    } = options;

    if (!focusedCellPosition) {
      return focusedCellData;
    }

    let nextCellIndices: GridPosition = focusedCellPosition;

    switch (key) {
      case 'down':
        nextCellIndices = this.getCellFromNextRowPosition(focusedCellPosition, 'next', edgeIndices);
        break;
      case 'up':
        nextCellIndices = this.getCellFromNextRowPosition(focusedCellPosition, 'prev', edgeIndices);
        break;
      case 'left':
        nextCellIndices = this.getCellFromNextColumnPosition({
          ...options,
          focusedCellPosition,
          direction: 'prev',
        });
        break;
      case 'right':
        nextCellIndices = this.getCellFromNextColumnPosition({
          ...options,
          focusedCellPosition,
          direction: 'next',
        });
        break;
      default:
        break;
    }

    const currentCellData = getCellDataByPosition(
      nextCellIndices.rowIndex,
      nextCellIndices.columnIndex,
      isAllDayPanelCell,
    );

    return this.moveToCell({
      ...options,
      currentCellData,
    });
  }

  getCellFromNextRowPosition(
    focusedCellPosition: GridPosition,
    direction: 'next' | 'prev',
    edgeIndices: EdgeIndices,
  ): GridPosition {
    const {
      columnIndex,
      rowIndex,
    } = focusedCellPosition;

    const deltaPosition = direction === 'next' ? 1 : -1;
    const nextRowIndex = rowIndex + deltaPosition;

    const validRowIndex = nextRowIndex >= 0 && nextRowIndex <= edgeIndices.lastRowIndex
      ? nextRowIndex
      : rowIndex;

    return {
      columnIndex,
      rowIndex: validRowIndex,
    };
  }

  getCellFromNextColumnPosition(options: NextColumnPositionOptions): GridPosition {
    const {
      focusedCellPosition,
      direction,
      edgeIndices,
      isRTL,
      isGroupedByDate,
      groupCount,
      isMultiSelection,
      viewType,
    } = options;
    const {
      columnIndex,
      rowIndex,
    } = focusedCellPosition;
    const {
      firstColumnIndex,
      lastColumnIndex,
      firstRowIndex,
      lastRowIndex,
    } = edgeIndices;

    const step = isGroupedByDate && isMultiSelection ? groupCount : 1;
    const sign = isRTL ? -1 : 1;
    const deltaColumnIndex = direction === 'next' ? sign * step : -1 * sign * step;
    const nextColumnIndex = columnIndex + deltaColumnIndex;

    const isValidColumnIndex = nextColumnIndex >= firstColumnIndex
            && nextColumnIndex <= lastColumnIndex;

    if (isValidColumnIndex) {
      return {
        columnIndex: nextColumnIndex,
        rowIndex,
      };
    }

    return isDateAndTimeView(viewType) ? focusedCellPosition : this.processEdgeCell({
      nextColumnIndex,
      rowIndex,
      columnIndex,
      firstColumnIndex,
      lastColumnIndex,
      firstRowIndex,
      lastRowIndex,
      step,
    });
  }

  private processEdgeCell(options: ProcessEdgeCellOptions): GridPosition {
    const {
      nextColumnIndex,
      rowIndex,
      columnIndex,
      firstColumnIndex,
      lastColumnIndex,
      firstRowIndex,
      lastRowIndex,
      step,
    } = options;

    let validColumnIndex = nextColumnIndex;
    let validRowIndex = rowIndex;
    const isLeftEdgeCell = nextColumnIndex < firstColumnIndex;
    const isRightEdgeCell = nextColumnIndex > lastColumnIndex;

    if (isLeftEdgeCell) {
      const columnIndexInNextRow = lastColumnIndex - (step - (columnIndex % step) - 1);
      const nextRowIndex = rowIndex - 1;
      const isValidRowIndex = nextRowIndex >= firstRowIndex;

      validRowIndex = isValidRowIndex ? nextRowIndex : rowIndex;
      validColumnIndex = isValidRowIndex ? columnIndexInNextRow : columnIndex;
    }

    if (isRightEdgeCell) {
      const columnIndexInNextRow = firstColumnIndex + (columnIndex % step);
      const nextRowIndex = rowIndex + 1;
      const isValidRowIndex = nextRowIndex <= lastRowIndex;

      validRowIndex = isValidRowIndex ? nextRowIndex : rowIndex;
      validColumnIndex = isValidRowIndex ? columnIndexInNextRow : columnIndex;
    }

    return {
      columnIndex: validColumnIndex,
      rowIndex: validRowIndex,
    };
  }

  moveToCell(options: MoveToCellOptions): ViewCellData {
    const {
      isMultiSelection,
      isMultiSelectionAllowed,
      focusedCellData,
      currentCellData,
      isVirtualCell,
    } = options;

    const isValidMultiSelection = isMultiSelection && isMultiSelectionAllowed;

    const nextFocusedCellData = isValidMultiSelection
      ? this.getNextCellData(currentCellData, focusedCellData, isVirtualCell)
      : currentCellData;

    return nextFocusedCellData;
  }

  private getNextCellData(
    nextFocusedCellData: ViewCellData,
    focusedCellData: ViewCellData,
    isVirtualCell?: boolean,
  ): ViewCellData {
    if (isVirtualCell) {
      return focusedCellData;
    }

    const isValidNextFocusedCell = this.isValidNextFocusedCell(
      nextFocusedCellData,
      focusedCellData,
    );

    return isValidNextFocusedCell ? nextFocusedCellData : focusedCellData;
  }

  private isValidNextFocusedCell(
    nextFocusedCellData: ViewCellData,
    focusedCellData: ViewCellData | null | undefined,
  ): boolean {
    if (!focusedCellData) {
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
