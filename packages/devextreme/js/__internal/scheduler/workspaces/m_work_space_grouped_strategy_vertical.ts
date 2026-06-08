import type { DxElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import { getBoundingRect } from '@js/core/utils/position';
import { calculateDayDuration, getVerticalGroupCountClass } from '@ts/scheduler/r1/utils/index';
import type { CellPositionData, GroupBoundsOffset, GroupedStrategyOptions } from '@ts/scheduler/types';
import type { ResourceLoader } from '@ts/scheduler/utils/loader/resource_loader';
import { WORK_SPACE_BORDER_PX } from '@ts/scheduler/workspaces/const';

import { FIRST_GROUP_CELL_CLASS, LAST_GROUP_CELL_CLASS } from '../classes';
import { Cache } from '../global_cache';

class VerticalGroupedStrategy {
  cache = new Cache();

  private groupBoundsOffset!: GroupBoundsOffset;

  config: GroupedStrategyOptions;

  constructor(options: GroupedStrategyOptions) {
    this.config = options;
  }

  prepareCellIndexes(cellCoordinates: CellPositionData, groupIndex: number, inAllDayRow: boolean)
  : CellPositionData {
    let rowIndex = cellCoordinates.rowIndex + groupIndex * this.config.getRowCount();

    if (this.config.supportAllDayRow() && this.config.showAllDayPanel) {
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
    return Math.floor(rowIndex / this.config.getRowCount());
  }

  calculateHeaderCellRepeatCount(): number {
    return 1;
  }

  insertAllDayRowsIntoDateTable(): boolean {
    return this.config.showAllDayPanel;
  }

  getTotalCellCount(): number {
    return this.config.getCellCount();
  }

  getTotalRowCount(): number {
    return this.config.getRowCount() * this.config.getGroupCount();
  }

  calculateTimeCellRepeatCount(): number {
    return this.config.getGroupCount() || 1;
  }

  getWorkSpaceMinWidth(): number {
    let minWidth = this.config.getWorkSpaceWidth();
    const workSpaceElementWidth = getBoundingRect(this.config.$element().get(0)).width;
    const workspaceContainerWidth = workSpaceElementWidth
      - this.config.getTimePanelWidth()
      - this.config.getGroupTableWidth()
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
    return this.config.getTimePanelWidth() + this.config.getGroupTableWidth();
  }

  getGroupBoundsOffset(groupIndex: number, [$firstCell, $lastCell]: [DxElement, DxElement])
  : GroupBoundsOffset {
    return this.cache.memo(`groupBoundsOffset${groupIndex}`, () => {
      const { startDayHour, endDayHour, hoursInterval } = this.config;

      const dayHeight = (calculateDayDuration(startDayHour, endDayHour) / hoursInterval)
       * this.config.getCellHeight();
      const scrollTop = this.getScrollableScrollTop();
      const headerRowHeight = getBoundingRect(this.config.$headerPanelContainer.get(0)).height;

      let topOffset = groupIndex * dayHeight + headerRowHeight
        + this.config.getHeaderHeight() - scrollTop;

      if (this.config.showAllDayPanel && this.config.supportAllDayRow()) {
        topOffset += this.config.getCellHeight() * (groupIndex + 1);
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
    const offset = this.config.getIndicatorOffset(0);
    const tableOffset = this.config.crossScrollingEnabled ? 0 : this.config.getGroupTableWidth();
    const horizontalOffset = rtlOffset ? rtlOffset - offset : offset;
    let verticalOffset = this.config.getRowCount() * this.config.getCellHeight() * i;

    if (this.config.supportAllDayRow() && this.config.showAllDayPanel) {
      verticalOffset += this.config.getAllDayHeight() * (i + 1);
    }

    $indicator.css('left', horizontalOffset + tableOffset);
    $indicator.css('top', height + verticalOffset);
  }

  getShaderOffset(i: number, width: number): number {
    const offset = this.config.crossScrollingEnabled ? 0 : this.config.getGroupTableWidth();

    if (this.config.rtlEnabled) {
      const containerWidth = getBoundingRect(this.config.getScrollable().$content().get(0)).width;
      return containerWidth - offset - this.config.getWorkSpaceLeftOffset() - width;
    }

    return offset;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getShaderTopOffset(i: number): number {
    return 0;
  }

  getShaderHeight(): number {
    let height = this.config.getIndicationHeight();

    if (this.config.supportAllDayRow() && this.config.showAllDayPanel) {
      height += this.config.getCellHeight();
    }

    return height;
  }

  getShaderMaxHeight(): number {
    let height = this.config.getRowCount() * this.config.getCellHeight();

    if (this.config.supportAllDayRow() && this.config.showAllDayPanel) {
      height += this.config.getCellHeight();
    }

    return height;
  }

  getShaderWidth(): number {
    return this.config.getIndicationWidth();
  }

  getScrollableScrollTop(): number {
    return this.config.getScrollable().scrollTop();
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
    if (index % this.config.getRowCount() === 0) {
      return `${cellClass} ${LAST_GROUP_CELL_CLASS}`;
    }

    return cellClass;
  }

  private addFirstGroupCellClass(cellClass: string, index: number): string {
    if ((index - 1) % this.config.getRowCount() === 0) {
      return `${cellClass} ${FIRST_GROUP_CELL_CLASS}`;
    }

    return cellClass;
  }
}

export default VerticalGroupedStrategy;
