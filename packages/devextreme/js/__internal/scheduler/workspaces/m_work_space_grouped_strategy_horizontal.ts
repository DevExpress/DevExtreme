import type { dxElementWrapper } from '@js/core/renderer';
import { getBoundingRect } from '@js/core/utils/position';
import type {
  CellInfo,
  CellPositionData,
  GroupBoundsOffset,
  GroupedStrategyOptions,
} from '@ts/scheduler/types';
import { WORK_SPACE_BORDER_PX } from '@ts/scheduler/workspaces/const';

import { FIRST_GROUP_CELL_CLASS, LAST_GROUP_CELL_CLASS } from '../classes';
import type { ResourceLoader } from '../utils/loader/resource_loader';

class HorizontalGroupedStrategy {
  config!: GroupedStrategyOptions;

  constructor(options: GroupedStrategyOptions) {
    this.config = options;
  }

  prepareCellIndexes(
    cellCoordinates: CellPositionData,
    groupIndex: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    inAllDay?: boolean,
  ): CellPositionData {
    const groupByDay = this.config.isGroupedByDate();

    if (!groupByDay) {
      return {
        rowIndex: cellCoordinates.rowIndex,
        columnIndex: cellCoordinates.columnIndex + groupIndex * this.config.getCellCount(),
      };
    }
    return {
      rowIndex: cellCoordinates.rowIndex,
      columnIndex: cellCoordinates.columnIndex * this.config.getGroupCount() + groupIndex,
    };
  }

  getGroupIndex(rowIndex: number, columnIndex: number): number {
    const groupByDay = this.config.isGroupedByDate();
    const groupCount = this.config.getGroupCount();

    if (groupByDay) {
      return columnIndex % groupCount;
    }
    return Math.floor(columnIndex / this.config.getCellCount());
  }

  calculateHeaderCellRepeatCount(): number {
    return this.config.getGroupCount() || 1;
  }

  insertAllDayRowsIntoDateTable(): boolean {
    return false;
  }

  getTotalCellCount(groupCount: number): number {
    const effectiveGroupCount = groupCount || 1;

    return this.config.getCellCount() * effectiveGroupCount;
  }

  getTotalRowCount(): number {
    return this.config.getRowCount();
  }

  calculateTimeCellRepeatCount(): number {
    return 1;
  }

  getWorkSpaceMinWidth(): number {
    const workSpaceElementWidth = getBoundingRect(this.config.$element().get(0)).width;
    return workSpaceElementWidth
      - this.config.getTimePanelWidth()
      - 2 * WORK_SPACE_BORDER_PX;
  }

  getAllDayOffset(): number {
    return this.config.getAllDayHeight();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getGroupCountClass(groups: ResourceLoader[]): string | undefined {
    return undefined;
  }

  getLeftOffset(): number {
    return this.config.getTimePanelWidth();
  }

  private createGroupBoundOffset(
    startCell: dxElementWrapper | undefined,
    endCell: dxElementWrapper | undefined,
    cellWidth: number,
  ): GroupBoundsOffset {
    const extraOffset = cellWidth / 2;

    const startOffset = startCell ? (startCell.offset()?.left ?? 0) - extraOffset : 0;
    const endOffset = endCell ? (endCell.offset()?.left ?? 0) + cellWidth + extraOffset : 0;

    return {
      left: startOffset,
      right: endOffset,
      top: 0,
      bottom: 0,
    };
  }

  private getGroupedByDateBoundOffset(
    $cells: dxElementWrapper,
    cellWidth: number,
  ): GroupBoundsOffset {
    const firstCellIndex = 0;
    const lastCellIndex = $cells.length - 1;

    const startCell = $cells.eq(firstCellIndex);
    const endCell = $cells.eq(lastCellIndex);

    return this.createGroupBoundOffset(startCell, endCell, cellWidth);
  }

  getGroupBoundsOffset(
    cellCount: number,
    $cells: dxElementWrapper,
    cellWidth: number,
    coordinates: CellPositionData & { groupIndex?: number },
    groupedDataMap: { dateTableGroupedMap: CellInfo[][][] },
  ): GroupBoundsOffset {
    if (this.config.isGroupedByDate()) {
      return this.getGroupedByDateBoundOffset($cells, cellWidth);
    }

    const cellIndex = this.config.getCellIndexByCoordinates(coordinates);
    const groupIndex = coordinates.groupIndex ?? Math.floor(cellIndex / cellCount);

    const currentCellGroup = groupedDataMap.dateTableGroupedMap[groupIndex];

    if (!currentCellGroup) {
      return this.createGroupBoundOffset(undefined, undefined, cellWidth);
    }

    const groupRowLength = currentCellGroup[0].length;
    const groupStartPosition = currentCellGroup[0][0].position;
    const groupEndPosition = currentCellGroup[0][groupRowLength - 1].position;

    const startCell = $cells.eq(groupStartPosition.columnIndex);
    const endCell = $cells.eq(groupEndPosition.columnIndex);

    return this.createGroupBoundOffset(startCell, endCell, cellWidth);
  }

  shiftIndicator(
    $indicator: dxElementWrapper,
    height: number,
    rtlOffset: number,
    groupIndex: number,
  ): void {
    const offset = this.getIndicatorOffset(groupIndex);

    const horizontalOffset = rtlOffset ? rtlOffset - offset : offset;

    $indicator.css('left', horizontalOffset);
    $indicator.css('top', height);
  }

  private getIndicatorOffset(groupIndex: number): number {
    const groupByDay = this.config.isGroupedByDate();

    return groupByDay
      ? this.calculateGroupByDateOffset(groupIndex)
      : this.calculateOffset(groupIndex);
  }

  private calculateOffset(groupIndex: number): number {
    const indicatorStartPosition = this.config.getIndicatorOffset(groupIndex);
    const offset = this.config.getCellCount() * this.config.getCellWidth() * groupIndex;

    return indicatorStartPosition + offset;
  }

  private calculateGroupByDateOffset(groupIndex: number): number {
    return this.config.getIndicatorOffset(0) * this.config.getGroupCount()
      + this.config.getCellWidth() * groupIndex;
  }

  getShaderOffset(i: number, width: number): number {
    const offset = this.config.getCellCount() * this.config.getCellWidth() * i;

    if (this.config.rtlEnabled) {
      const containerWidth = getBoundingRect(this.config.getScrollable().$content().get(0)).width;
      return containerWidth - offset - this.config.getTimePanelWidth() - width;
    }

    return offset;
  }

  getShaderTopOffset(i: number): number {
    return -this.getShaderMaxHeight() * (i > 0 ? 1 : 0);
  }

  getShaderHeight(): number {
    return this.config.getIndicationHeight();
  }

  getShaderMaxHeight(): number {
    return (getBoundingRect(this.config.getScrollable().$content().get(0)) as DOMRect).height;
  }

  getShaderWidth(): number {
    return this.config.getIndicationWidth();
  }

  getScrollableScrollTop(allDay: boolean): number {
    return !allDay ? this.config.getScrollable().scrollTop() : 0;
  }

  // ---------------
  // We do not need these methods in renovation
  // ---------------

  addAdditionalGroupCellClasses(
    cellClass: string,
    index: number,
    i: number,
    j: number,
    applyUnconditionally = false,
  ): string {
    const lastGroupCellClass = this.addLastGroupCellClass(cellClass, index, applyUnconditionally);

    return this.addFirstGroupCellClass(lastGroupCellClass, index, applyUnconditionally);
  }

  private addLastGroupCellClass(
    cellClass: string,
    index: number,
    applyUnconditionally: boolean,
  ): string {
    if (applyUnconditionally) {
      return `${cellClass} ${LAST_GROUP_CELL_CLASS}`;
    }

    const groupByDate = this.config.isGroupedByDate();

    if (groupByDate) {
      if (index % this.config.getGroupCount() === 0) {
        return `${cellClass} ${LAST_GROUP_CELL_CLASS}`;
      }
    } else if (index % this.config.getCellCount() === 0) {
      return `${cellClass} ${LAST_GROUP_CELL_CLASS}`;
    }

    return cellClass;
  }

  private addFirstGroupCellClass(
    cellClass: string,
    index: number,
    applyUnconditionally: boolean,
  ): string {
    if (applyUnconditionally) {
      return `${cellClass} ${FIRST_GROUP_CELL_CLASS}`;
    }

    const groupByDate = this.config.isGroupedByDate();

    if (groupByDate) {
      if ((index - 1) % this.config.getGroupCount() === 0) {
        return `${cellClass} ${FIRST_GROUP_CELL_CLASS}`;
      }
    } else if ((index - 1) % this.config.getCellCount() === 0) {
      return `${cellClass} ${FIRST_GROUP_CELL_CLASS}`;
    }

    return cellClass;
  }
}

export default HorizontalGroupedStrategy;
