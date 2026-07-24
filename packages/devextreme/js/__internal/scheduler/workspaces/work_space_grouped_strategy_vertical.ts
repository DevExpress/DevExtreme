import type { dxElementWrapper } from '@js/core/renderer';
import { getBoundingRect } from '@js/core/utils/position';
import { calculateDayDuration } from '@ts/scheduler/r1/utils/index';
import type { CellPositionData, GroupBoundsOffset } from '@ts/scheduler/types';
import { WORK_SPACE_BORDER_PX } from '@ts/scheduler/workspaces/const';

import { FIRST_GROUP_CELL_CLASS, LAST_GROUP_CELL_CLASS } from '../classes';
import { Cache } from '../global_cache';
import type { ResourceLoader } from '../utils/loader/resource_loader';
import type { GroupedStrategyConfig } from './work_space_grouped_strategy_config';

class VerticalGroupedStrategy {
  cache = new Cache();

  private groupBoundsOffset!: GroupBoundsOffset;

  constructor(private readonly config: GroupedStrategyConfig) {}

  prepareCellIndexes(cellCoordinates: CellPositionData, groupIndex: number, inAllDayRow: boolean)
  : CellPositionData {
    let rowIndex = cellCoordinates.rowIndex + groupIndex * this.config.getRowCount();

    if (this.config.supportAllDayRow() && this.config.showAllDayPanel()) {
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
    return this.config.showAllDayPanel();
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
    const workSpaceElementWidth = getBoundingRect(this.config.getElement()).width;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getGroupCountClass(groups: ResourceLoader[]): string | undefined {
    return undefined;
  }

  getLeftOffset(): number {
    return this.config.getTimePanelWidth() + this.config.getGroupTableWidth();
  }

  private getDefaultGroupHeight(): number {
    const startDayHour = this.config.startDayHour();
    const endDayHour = this.config.endDayHour();
    const hoursInterval = this.config.hoursInterval();

    return (calculateDayDuration(startDayHour, endDayHour) / hoursInterval)
      * this.config.getCellHeight();
  }

  private getGroupHeight(groupIndex: number): number {
    return this.config.getGroupHeights?.()?.[groupIndex] ?? this.getDefaultGroupHeight();
  }

  private getCumulativeGroupOffset(groupIndex: number): number {
    let offset = 0;

    for (let i = 0; i < groupIndex; i += 1) {
      offset += this.getGroupHeight(i);
    }

    return offset;
  }

  getGroupBoundsOffset(groupIndex: number, [$firstCell, $lastCell]: [Element, Element])
  : GroupBoundsOffset {
    const groupHeightsKey = this.config.getGroupHeights?.()?.join('.') ?? '';

    return this.cache.memo(`groupBoundsOffset${groupIndex}.${groupHeightsKey}`, () => {
      const groupHeight = this.getGroupHeight(groupIndex);
      const scrollTop = this.getScrollableScrollTop();
      const headerRowHeight = getBoundingRect(this.config.getHeaderPanelContainerElement()).height;

      let topOffset = this.getCumulativeGroupOffset(groupIndex) + headerRowHeight
        + this.config.getHeaderHeight() - scrollTop;

      if (this.config.showAllDayPanel() && this.config.supportAllDayRow()) {
        topOffset += this.config.getCellHeight() * (groupIndex + 1);
      }

      const bottomOffset = topOffset + groupHeight;

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
    const offset = this.config.getIndicatorOffset();
    const tableOffset = this.config.crossScrollingEnabled() ? 0 : this.config.getGroupTableWidth();
    const horizontalOffset = rtlOffset ? rtlOffset - offset : offset;
    let verticalOffset = this.getCumulativeGroupOffset(i);

    if (this.config.supportAllDayRow() && this.config.showAllDayPanel()) {
      verticalOffset += this.config.getAllDayHeight() * (i + 1);
    }

    $indicator.css('left', horizontalOffset + tableOffset);
    $indicator.css('top', height + verticalOffset);
  }

  getShaderOffset(i: number, width: number): number {
    const offset = this.config.crossScrollingEnabled() ? 0 : this.config.getGroupTableWidth();

    if (this.config.rtlEnabled()) {
      const containerWidth = getBoundingRect(
        this.config.getScrollableContentElement(),
      ).width;
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

    if (this.config.supportAllDayRow() && this.config.showAllDayPanel()) {
      height += this.config.getCellHeight();
    }

    return height;
  }

  getShaderMaxHeight(groupIndex = 0): number {
    let height = this.getGroupHeight(groupIndex);

    if (this.config.supportAllDayRow() && this.config.showAllDayPanel()) {
      height += this.config.getCellHeight();
    }

    return height;
  }

  getShaderWidth(): number {
    return this.config.getIndicationWidth();
  }

  getScrollableScrollTop(): number {
    return this.config.getScrollableScrollTop();
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
