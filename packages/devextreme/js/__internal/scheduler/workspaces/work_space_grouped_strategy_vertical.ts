import type { DxElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import { getBoundingRect } from '@js/core/utils/position';
import { calculateDayDuration, getVerticalGroupCountClass } from '@ts/scheduler/r1/utils/index';
import type { CellPositionData, GroupBoundsOffset } from '@ts/scheduler/types';
import { WORK_SPACE_BORDER_PX } from '@ts/scheduler/workspaces/const';

import { FIRST_GROUP_CELL_CLASS, LAST_GROUP_CELL_CLASS } from '../classes';
import { Cache } from '../global_cache';
import type { ResourceLoader } from '../utils/loader/resource_loader';
import type SchedulerWorkSpace from './m_work_space';

class VerticalGroupedStrategy {
  cache = new Cache();

  private groupBoundsOffset!: GroupBoundsOffset;

  constructor(private readonly options: SchedulerWorkSpace) {}

  prepareCellIndexes(cellCoordinates: CellPositionData, groupIndex: number, inAllDayRow: boolean)
  : CellPositionData {
    // @ts-expect-error
    let rowIndex = cellCoordinates.rowIndex + groupIndex * this.options.getRowCount();
    // @ts-expect-error

    if (this.options.supportAllDayRow() && this.options.showAllDayPanel) {
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
    return Math.floor(rowIndex / this.options.getRowCount());
  }

  calculateHeaderCellRepeatCount(): number {
    return 1;
  }

  insertAllDayRowsIntoDateTable(): boolean {
    return this.options.option('showAllDayPanel');
  }

  getTotalCellCount(): number {
    // @ts-expect-error
    return this.options.getCellCount();
  }

  getTotalRowCount(): number {
    // @ts-expect-error
    return this.options.getRowCount() * this.options.getGroupCount();
  }

  calculateTimeCellRepeatCount(): number {
    // @ts-expect-error
    return this.options.getGroupCount() || 1;
  }

  getWorkSpaceMinWidth(): number {
    // @ts-expect-error
    let minWidth = this.options.getWorkSpaceWidth();
    const workSpaceElementWidth = getBoundingRect(this.options.$element().get(0)).width;
    const workspaceContainerWidth = workSpaceElementWidth
      - this.options.getTimePanelWidth()
      - this.options.getGroupTableWidth()
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
    return this.options.getTimePanelWidth() + this.options.getGroupTableWidth();
  }

  getGroupBoundsOffset(groupIndex: number, [$firstCell, $lastCell]: [DxElement, DxElement])
  : GroupBoundsOffset {
    return this.cache.memo(`groupBoundsOffset${groupIndex}`, () => {
      const startDayHour = this.options.option('startDayHour');
      const endDayHour = this.options.option('endDayHour');
      const hoursInterval = this.options.option('hoursInterval');

      const dayHeight = (calculateDayDuration(startDayHour, endDayHour) / hoursInterval)
       * this.options.getCellHeight();
      const scrollTop = this.getScrollableScrollTop();
      // @ts-expect-error
      const headerRowHeight = getBoundingRect(this.options.$headerPanelContainer.get(0)).height;

      let topOffset = groupIndex * dayHeight + headerRowHeight + this.options.option('getHeaderHeight')() - scrollTop;

      if (this.options.option('showAllDayPanel') && this.options.supportAllDayRow()) {
        topOffset += this.options.getCellHeight() * (groupIndex + 1);
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
    const offset = this.options.getIndicatorOffset(0);
    const tableOffset = this.options.option('crossScrollingEnabled') ? 0 : this.options.getGroupTableWidth();
    const horizontalOffset = rtlOffset ? rtlOffset - offset : offset;
    // @ts-expect-error
    let verticalOffset = this.options.getRowCount() * this.options.getCellHeight() * i;

    if (this.options.supportAllDayRow() && this.options.option('showAllDayPanel')) {
      verticalOffset += this.options.getAllDayHeight() * (i + 1);
    }

    $indicator.css('left', horizontalOffset + tableOffset);
    $indicator.css('top', height + verticalOffset);
  }

  getShaderOffset(i: number, width: number): number {
    const offset = this.options.option('crossScrollingEnabled') ? 0 : this.options.getGroupTableWidth();

    if (this.options.option('rtlEnabled')) {
      const containerWidth = getBoundingRect(this.options.getScrollable().$content().get(0)).width;
      return containerWidth - offset - this.options.getWorkSpaceLeftOffset() - width;
    }

    return offset;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getShaderTopOffset(i: number): number {
    return 0;
  }

  getShaderHeight(): number {
    // @ts-expect-error
    let height = this.options.getIndicationHeight() as number;

    if (this.options.supportAllDayRow() && this.options.option('showAllDayPanel')) {
      height += this.options.getCellHeight();
    }

    return height;
  }

  getShaderMaxHeight(): number {
    // @ts-expect-error
    let height = this.options.getRowCount() * this.options.getCellHeight();

    if (this.options.supportAllDayRow() && this.options.option('showAllDayPanel')) {
      height += this.options.getCellHeight();
    }

    return height;
  }

  getShaderWidth(): number {
    // @ts-expect-error
    return this.options.getIndicationWidth() as number;
  }

  getScrollableScrollTop(): number {
    return this.options.getScrollable().scrollTop();
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
    if (index % this.options.getRowCount() === 0) {
      return `${cellClass} ${LAST_GROUP_CELL_CLASS}`;
    }

    return cellClass;
  }

  private addFirstGroupCellClass(cellClass: string, index: number): string {
    // @ts-expect-error
    if ((index - 1) % this.options.getRowCount() === 0) {
      return `${cellClass} ${FIRST_GROUP_CELL_CLASS}`;
    }

    return cellClass;
  }
}

export default VerticalGroupedStrategy;
