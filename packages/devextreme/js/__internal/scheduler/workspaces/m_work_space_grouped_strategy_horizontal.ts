import { getBoundingRect } from '@js/core/utils/position';
import { WORK_SPACE_BORDER_PX } from '@ts/scheduler/workspaces/const';

import { FIRST_GROUP_CELL_CLASS, LAST_GROUP_CELL_CLASS } from '../classes';

class HorizontalGroupedStrategy {
  // TODO: make private once external usages in current_time_shader.ts, current_time_shader_horizontal.ts are removed
  constructor(public _workSpace) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prepareCellIndexes(cellCoordinates, groupIndex, inAllDay?: any) {
    const groupByDay = this._workSpace.isGroupedByDate();

    if (!groupByDay) {
      return {
        rowIndex: cellCoordinates.rowIndex,
        columnIndex: cellCoordinates.columnIndex + groupIndex * this._workSpace.getCellCount(),
      };
    }
    return {
      rowIndex: cellCoordinates.rowIndex,
      columnIndex: cellCoordinates.columnIndex * this._workSpace.getGroupCount() + groupIndex,
    };
  }

  getGroupIndex(rowIndex, columnIndex) {
    const groupByDay = this._workSpace.isGroupedByDate();
    const groupCount = this._workSpace.getGroupCount();

    if (groupByDay) {
      return columnIndex % groupCount;
    }
    return Math.floor(columnIndex / this._workSpace.getCellCount());
  }

  calculateHeaderCellRepeatCount() {
    return this._workSpace.getGroupCount() || 1;
  }

  insertAllDayRowsIntoDateTable() {
    return false;
  }

  getTotalCellCount(groupCount) {
    groupCount = groupCount || 1;

    return this._workSpace.getCellCount() * groupCount;
  }

  getTotalRowCount() {
    return this._workSpace.getRowCount();
  }

  calculateTimeCellRepeatCount() {
    return 1;
  }

  getWorkSpaceMinWidth() {
    const workSpaceElementWidth = getBoundingRect(this._workSpace.$element().get(0)).width;
    return workSpaceElementWidth
      - this._workSpace.getTimePanelWidth()
      - 2 * WORK_SPACE_BORDER_PX;
  }

  getAllDayOffset() {
    return this._workSpace.getAllDayHeight();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getGroupCountClass(groups: any) {
    return undefined;
  }

  getLeftOffset() {
    return this._workSpace.getTimePanelWidth();
  }

  private createGroupBoundOffset(startCell, endCell, cellWidth) {
    const extraOffset = cellWidth / 2;

    const startOffset = startCell ? startCell.offset().left - extraOffset : 0;
    const endOffset = endCell ? endCell.offset().left + cellWidth + extraOffset : 0;

    return {
      left: startOffset,
      right: endOffset,
      top: 0,
      bottom: 0,
    };
  }

  private getGroupedByDateBoundOffset($cells, cellWidth) {
    const firstCellIndex = 0;
    const lastCellIndex = $cells.length - 1;

    const startCell = $cells.eq(firstCellIndex);
    const endCell = $cells.eq(lastCellIndex);

    return this.createGroupBoundOffset(startCell, endCell, cellWidth);
  }

  getGroupBoundsOffset(cellCount, $cells, cellWidth, coordinates, groupedDataMap) {
    if (this._workSpace.isGroupedByDate()) {
      return this.getGroupedByDateBoundOffset($cells, cellWidth);
    }

    let startCell;
    let endCell;

    const cellIndex = this._workSpace.getCellIndexByCoordinates(coordinates);
    const groupIndex = coordinates.groupIndex || Math.floor(cellIndex / cellCount);

    const currentCellGroup = groupedDataMap.dateTableGroupedMap[groupIndex];

    if (currentCellGroup) {
      const groupRowLength = currentCellGroup[0].length;

      const groupStartPosition = currentCellGroup[0][0].position;
      const groupEndPosition = currentCellGroup[0][groupRowLength - 1].position;

      startCell = $cells.eq(groupStartPosition.columnIndex);
      endCell = $cells.eq(groupEndPosition.columnIndex);
    }

    return this.createGroupBoundOffset(startCell, endCell, cellWidth);
  }

  shiftIndicator($indicator, height, rtlOffset, groupIndex) {
    const offset = this.getIndicatorOffset(groupIndex);

    const horizontalOffset = rtlOffset ? rtlOffset - offset : offset;

    $indicator.css('left', horizontalOffset);
    $indicator.css('top', height);
  }

  private getIndicatorOffset(groupIndex) {
    const groupByDay = this._workSpace.isGroupedByDate();

    return groupByDay ? this.calculateGroupByDateOffset(groupIndex) : this.calculateOffset(groupIndex);
  }

  private calculateOffset(groupIndex) {
    const indicatorStartPosition = this._workSpace.getIndicatorOffset(groupIndex);
    const offset = this._workSpace.getCellCount() * this._workSpace.getCellWidth() * groupIndex;

    return indicatorStartPosition + offset;
  }

  private calculateGroupByDateOffset(groupIndex) {
    return this._workSpace.getIndicatorOffset(0) * this._workSpace.getGroupCount() + this._workSpace.getCellWidth() * groupIndex;
  }

  getShaderOffset(i, width) {
    const offset = this._workSpace.getCellCount() * this._workSpace.getCellWidth() * i;
    return this._workSpace.option('rtlEnabled') ? getBoundingRect(this._workSpace.$dateTableScrollable.$content().get(0)).width - offset - this._workSpace.getTimePanelWidth() - width : offset;
  }

  getShaderTopOffset(i) {
    return -this.getShaderMaxHeight() * (i > 0 ? 1 : 0);
  }

  getShaderHeight() {
    const height = this._workSpace.getIndicationHeight();

    return height;
  }

  getShaderMaxHeight() {
    return getBoundingRect(this._workSpace.$dateTableScrollable.$content().get(0)).height;
  }

  getShaderWidth() {
    return this._workSpace.getIndicationWidth();
  }

  getScrollableScrollTop(allDay) {
    return !allDay ? this._workSpace.getScrollable().scrollTop() : 0;
  }

  // ---------------
  // We do not need these nethods in renovation
  // ---------------

  addAdditionalGroupCellClasses(cellClass, index, i, j, applyUnconditionally = false) {
    cellClass = this.addLastGroupCellClass(cellClass, index, applyUnconditionally);

    return this.addFirstGroupCellClass(cellClass, index, applyUnconditionally);
  }

  private addLastGroupCellClass(cellClass, index, applyUnconditionally) {
    if (applyUnconditionally) {
      return `${cellClass} ${LAST_GROUP_CELL_CLASS}`;
    }

    const groupByDate = this._workSpace.isGroupedByDate();

    if (groupByDate) {
      if (index % this._workSpace.getGroupCount() === 0) {
        return `${cellClass} ${LAST_GROUP_CELL_CLASS}`;
      }
    } else if (index % this._workSpace.getCellCount() === 0) {
      return `${cellClass} ${LAST_GROUP_CELL_CLASS}`;
    }

    return cellClass;
  }

  private addFirstGroupCellClass(cellClass, index, applyUnconditionally) {
    if (applyUnconditionally) {
      return `${cellClass} ${FIRST_GROUP_CELL_CLASS}`;
    }

    const groupByDate = this._workSpace.isGroupedByDate();

    if (groupByDate) {
      if ((index - 1) % this._workSpace.getGroupCount() === 0) {
        return `${cellClass} ${FIRST_GROUP_CELL_CLASS}`;
      }
    } else if ((index - 1) % this._workSpace.getCellCount() === 0) {
      return `${cellClass} ${FIRST_GROUP_CELL_CLASS}`;
    }

    return cellClass;
  }
}

export default HorizontalGroupedStrategy;
