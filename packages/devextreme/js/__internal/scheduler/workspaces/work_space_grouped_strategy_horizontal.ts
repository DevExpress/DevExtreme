import type { dxElementWrapper } from '@js/core/renderer';
import { getBoundingRect } from '@js/core/utils/position';
import type {
  CellInfo,
  CellPositionData,
  GroupBoundsOffset,
} from '@ts/scheduler/types';
import { WORK_SPACE_BORDER_PX } from '@ts/scheduler/workspaces/const';
import type SchedulerWorkSpace from '@ts/scheduler/workspaces/work_space';

import { FIRST_GROUP_CELL_CLASS, LAST_GROUP_CELL_CLASS } from '../classes';
import type { ResourceLoader } from '../utils/loader/resource_loader';

class HorizontalGroupedStrategy {
  constructor(private readonly workspace: SchedulerWorkSpace) {}

  prepareCellIndexes(
    cellCoordinates: CellPositionData,
    groupIndex: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    inAllDay?: boolean,
  ): CellPositionData {
    const groupByDay = this.workspace.isGroupedByDate();

    if (!groupByDay) {
      return {
        rowIndex: cellCoordinates.rowIndex,
        // @ts-expect-error
        columnIndex: cellCoordinates.columnIndex + groupIndex * this.workspace.getCellCount(),
      };
    }
    return {
      rowIndex: cellCoordinates.rowIndex,
      // @ts-expect-error
      columnIndex: cellCoordinates.columnIndex * this.workspace.getGroupCount() + groupIndex,
    };
  }

  getGroupIndex(rowIndex: number, columnIndex: number): number {
    const groupByDay = this.workspace.isGroupedByDate();
    // @ts-expect-error
    const groupCount = this.workspace.getGroupCount();

    if (groupByDay) {
      return columnIndex % groupCount;
    }
    // @ts-expect-error
    return Math.floor(columnIndex / this.workspace.getCellCount());
  }

  calculateHeaderCellRepeatCount(): number {
    // @ts-expect-error
    return this.workspace.getGroupCount() || 1;
  }

  insertAllDayRowsIntoDateTable(): boolean {
    return false;
  }

  getTotalCellCount(groupCount: number): number {
    const effectiveGroupCount = groupCount || 1;

    // @ts-expect-error
    return this.workspace.getCellCount() * effectiveGroupCount;
  }

  getTotalRowCount(): number {
    // @ts-expect-error
    return this.workspace.getRowCount();
  }

  calculateTimeCellRepeatCount(): number {
    return 1;
  }

  getWorkSpaceMinWidth(): number {
    const workSpaceElementWidth = getBoundingRect(this.workspace.$element().get(0)).width;
    return workSpaceElementWidth
      - this.workspace.getTimePanelWidth()
      - 2 * WORK_SPACE_BORDER_PX;
  }

  getAllDayOffset(): number {
    return this.workspace.getAllDayHeight();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getGroupCountClass(groups: ResourceLoader[]): string | undefined {
    return undefined;
  }

  getLeftOffset(): number {
    return this.workspace.getTimePanelWidth();
  }

  private createGroupBoundOffset(
    startCell: dxElementWrapper | undefined,
    endCell: dxElementWrapper | undefined,
    cellWidth: number,
  ): GroupBoundsOffset {
    const extraOffset = cellWidth / 2;
    const startLeft = startCell?.length ? (startCell.offset()?.left ?? 0) : undefined;
    const endLeft = endCell?.length ? (endCell.offset()?.left ?? 0) : undefined;

    return {
      left: startLeft !== undefined ? startLeft - extraOffset : 0,
      right: endLeft !== undefined ? endLeft + cellWidth + extraOffset : 0,
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
    coordinates: { top: number; left: number; groupIndex?: number },
    groupedDataMap: { dateTableGroupedMap: CellInfo[][][] },
  ): GroupBoundsOffset {
    if (this.workspace.isGroupedByDate()) {
      return this.getGroupedByDateBoundOffset($cells, cellWidth);
    }

    const cellIndex = this.workspace.getCellIndexByCoordinates(coordinates);
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
    const groupByDay = this.workspace.isGroupedByDate();

    return groupByDay
      ? this.calculateGroupByDateOffset(groupIndex)
      : this.calculateOffset(groupIndex);
  }

  private calculateOffset(groupIndex: number): number {
    // @ts-expect-error
    const indicatorStartPosition = this.workspace.getIndicatorOffset(groupIndex) as number;
    // @ts-expect-error
    const offset = this.workspace.getCellCount() * this.workspace.getCellWidth() * groupIndex;

    return indicatorStartPosition + offset;
  }

  private calculateGroupByDateOffset(groupIndex: number): number {
    // @ts-expect-error
    return this.workspace.getIndicatorOffset(0) * this.workspace.getGroupCount()
      + this.workspace.getCellWidth() * groupIndex;
  }

  getShaderOffset(i: number, width: number): number {
    // @ts-expect-error
    const offset = this.workspace.getCellCount() * this.workspace.getCellWidth() * i;

    if (this.workspace.option('rtlEnabled')) {
      const containerWidth = getBoundingRect(
        this.workspace.getScrollable().$content().get(0),
      ).width;
      return containerWidth - offset - this.workspace.getTimePanelWidth() - width;
    }

    return offset;
  }

  getShaderTopOffset(i: number): number {
    return -this.getShaderMaxHeight() * (i > 0 ? 1 : 0);
  }

  getShaderHeight(): number {
    // @ts-expect-error
    return this.workspace.getIndicationHeight() as number;
  }

  getShaderMaxHeight(): number {
    return (getBoundingRect(this.workspace.getScrollable().$content().get(0)) as DOMRect).height;
  }

  getShaderWidth(): number {
    // @ts-expect-error
    return this.workspace.getIndicationWidth() as number;
  }

  getScrollableScrollTop(allDay: boolean): number {
    return !allDay ? this.workspace.getScrollable().scrollTop() : 0;
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

    const groupByDate = this.workspace.isGroupedByDate();

    if (groupByDate) {
      // @ts-expect-error
      if (index % this.workspace.getGroupCount() === 0) {
        return `${cellClass} ${LAST_GROUP_CELL_CLASS}`;
      }
      // @ts-expect-error
    } else if (index % this.workspace.getCellCount() === 0) {
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

    const groupByDate = this.workspace.isGroupedByDate();

    if (groupByDate) {
      // @ts-expect-error
      if ((index - 1) % this.workspace.getGroupCount() === 0) {
        return `${cellClass} ${FIRST_GROUP_CELL_CLASS}`;
      }
      // @ts-expect-error
    } else if ((index - 1) % this.workspace.getCellCount() === 0) {
      return `${cellClass} ${FIRST_GROUP_CELL_CLASS}`;
    }

    return cellClass;
  }
}

export default HorizontalGroupedStrategy;
