import type { dxElementWrapper } from '@js/core/renderer';
import { getBoundingRect } from '@js/core/utils/position';
import { calculateDayDuration, getVerticalGroupCountClass } from '@ts/scheduler/r1/utils/index';
import type { CellPositionData, GroupBoundsOffset } from '@ts/scheduler/types';
import { WORK_SPACE_BORDER_PX } from '@ts/scheduler/workspaces/const';

import { FIRST_GROUP_CELL_CLASS, LAST_GROUP_CELL_CLASS } from '../classes';
import { Cache } from '../global_cache';
import type { ResourceLoader } from '../utils/loader/resource_loader';
import type SchedulerWorkSpace from './work_space';

class VerticalGroupedStrategy {
  cache = new Cache();

  private groupBoundsOffset!: GroupBoundsOffset;

  constructor(private readonly workspace: SchedulerWorkSpace) {}

  prepareCellIndexes(cellCoordinates: CellPositionData, groupIndex: number, inAllDayRow: boolean)
  : CellPositionData {
    // @ts-expect-error
    let rowIndex = cellCoordinates.rowIndex + groupIndex * this.workspace.getRowCount();

    if (this.workspace.supportAllDayRow() && this.workspace.option('showAllDayPanel')) {
      rowIndex += groupIndex;

      if (!inAllDayRow) {
        rowIndex += 1;
      }
    }

    return {
      rowIndex,
      columnIndex: cellCoordinates.columnIndex,
    };
  }

  getGroupIndex(rowIndex: number): number {
    // @ts-expect-error
    return Math.floor(rowIndex / this.workspace.getRowCount());
  }

  calculateHeaderCellRepeatCount(): number {
    return 1;
  }

  insertAllDayRowsIntoDateTable(): boolean {
    return this.workspace.option().showAllDayPanel;
  }

  getTotalCellCount(): number {
    // @ts-expect-error
    return this.workspace.getCellCount();
  }

  getTotalRowCount(): number {
    // @ts-expect-error
    return this.workspace.getRowCount() * this.workspace.getGroupCount();
  }

  calculateTimeCellRepeatCount(): number {
    // @ts-expect-error
    return this.workspace.getGroupCount() || 1;
  }

  getWorkSpaceMinWidth(): number {
    // @ts-expect-error
    let minWidth = this.workspace.getWorkSpaceWidth();
    const workSpaceElementWidth = getBoundingRect(this.workspace.$element().get(0)).width;
    const workspaceContainerWidth = workSpaceElementWidth
      - this.workspace.getTimePanelWidth()
      - this.workspace.getGroupTableWidth()
      - 2 * WORK_SPACE_BORDER_PX;

    if (minWidth < workspaceContainerWidth) {
      minWidth = workspaceContainerWidth;
    }

    return minWidth;
  }

  getAllDayOffset(): number {
    return 0;
  }

  getGroupCountClass(groups: ResourceLoader[]): string | undefined {
    return getVerticalGroupCountClass(groups);
  }

  getLeftOffset(): number {
    return this.workspace.getTimePanelWidth() + this.workspace.getGroupTableWidth();
  }

  getGroupBoundsOffset(groupIndex: number, [$firstCell, $lastCell]: [Element, Element])
  : GroupBoundsOffset {
    return this.cache.memo(`groupBoundsOffset${groupIndex}`, () => {
      const {
        startDayHour, endDayHour, hoursInterval, getHeaderHeight, showAllDayPanel,
      } = this.workspace.option();

      const dayHeight = (calculateDayDuration(startDayHour, endDayHour) / hoursInterval)
       * this.workspace.getCellHeight();
      const scrollTop = this.getScrollableScrollTop();
      // @ts-expect-error
      const headerRowHeight = getBoundingRect(this.workspace.$headerPanelContainer.get(0)).height;

      let topOffset = groupIndex * dayHeight + headerRowHeight + getHeaderHeight() - scrollTop;

      if (showAllDayPanel && this.workspace.supportAllDayRow()) {
        topOffset += this.workspace.getCellHeight() * (groupIndex + 1);
      }

      const bottomOffset = topOffset + dayHeight;

      const { left } = $firstCell.getBoundingClientRect();
      const { right } = $lastCell.getBoundingClientRect();
      this.groupBoundsOffset = {
        left,
        right,
        top: topOffset,
        bottom: bottomOffset,
      };

      return this.groupBoundsOffset;
    });
  }

  shiftIndicator($indicator: dxElementWrapper, height: number, rtlOffset: number, i: number): void {
    // @ts-expect-error
    const offset = this.workspace.getIndicatorOffset(0);
    const tableOffset = this.workspace.option('crossScrollingEnabled') ? 0 : this.workspace.getGroupTableWidth();
    const horizontalOffset = rtlOffset ? rtlOffset - offset : offset;
    // @ts-expect-error
    let verticalOffset = this.workspace.getRowCount() * this.workspace.getCellHeight() * i;

    if (this.workspace.supportAllDayRow() && this.workspace.option('showAllDayPanel')) {
      verticalOffset += this.workspace.getAllDayHeight() * (i + 1);
    }

    $indicator.css('left', horizontalOffset + tableOffset);
    $indicator.css('top', height + verticalOffset);
  }

  getShaderOffset(i: number, width: number): number {
    const offset = this.workspace.option('crossScrollingEnabled') ? 0 : this.workspace.getGroupTableWidth();

    if (this.workspace.option('rtlEnabled')) {
      const containerWidth = getBoundingRect(
        this.workspace.getScrollable().$content().get(0),
      ).width;
      return containerWidth - offset - this.workspace.getWorkSpaceLeftOffset() - width;
    }

    return offset;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getShaderTopOffset(i: number): number {
    return 0;
  }

  getShaderHeight(): number {
    // @ts-expect-error
    let height = this.workspace.getIndicationHeight() as number;

    if (this.workspace.supportAllDayRow() && this.workspace.option('showAllDayPanel')) {
      height += this.workspace.getCellHeight();
    }

    return height;
  }

  getShaderMaxHeight(): number {
    // @ts-expect-error
    let height = this.workspace.getRowCount() * this.workspace.getCellHeight();

    if (this.workspace.supportAllDayRow() && this.workspace.option('showAllDayPanel')) {
      height += this.workspace.getCellHeight();
    }

    return height;
  }

  getShaderWidth(): number {
    // @ts-expect-error
    return this.workspace.getIndicationWidth() as number;
  }

  getScrollableScrollTop(): number {
    return this.workspace.getScrollable().scrollTop();
  }

  // ------------
  // We do not need these methods in renovation
  // ------------

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addAdditionalGroupCellClasses(cellClass: string, index: number, i: number, j: number): string {
    const newCellClass = this.addLastGroupCellClass(cellClass, i + 1);

    return this.addFirstGroupCellClass(newCellClass, i + 1);
  }

  private addLastGroupCellClass(cellClass: string, index: number): string {
    // @ts-expect-error
    if (index % this.workspace.getRowCount() === 0) {
      return `${cellClass} ${LAST_GROUP_CELL_CLASS}`;
    }

    return cellClass;
  }

  private addFirstGroupCellClass(cellClass: string, index: number): string {
    // @ts-expect-error
    if ((index - 1) % this.workspace.getRowCount() === 0) {
      return `${cellClass} ${FIRST_GROUP_CELL_CLASS}`;
    }

    return cellClass;
  }
}

export default VerticalGroupedStrategy;
