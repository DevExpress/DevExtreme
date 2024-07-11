"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _position = require("../../../core/utils/position");
var _const = require("../../scheduler/workspaces/const");
var _m_classes = require("../m_classes");
class HorizontalGroupedStrategy {
  constructor(_workSpace) {
    this._workSpace = _workSpace;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prepareCellIndexes(cellCoordinates, groupIndex, inAllDay) {
    const groupByDay = this._workSpace.isGroupedByDate();
    if (!groupByDay) {
      return {
        rowIndex: cellCoordinates.rowIndex,
        columnIndex: cellCoordinates.columnIndex + groupIndex * this._workSpace._getCellCount()
      };
    }
    return {
      rowIndex: cellCoordinates.rowIndex,
      columnIndex: cellCoordinates.columnIndex * this._workSpace._getGroupCount() + groupIndex
    };
  }
  getGroupIndex(rowIndex, columnIndex) {
    const groupByDay = this._workSpace.isGroupedByDate();
    const groupCount = this._workSpace._getGroupCount();
    if (groupByDay) {
      return columnIndex % groupCount;
    }
    return Math.floor(columnIndex / this._workSpace._getCellCount());
  }
  calculateHeaderCellRepeatCount() {
    return this._workSpace._getGroupCount() || 1;
  }
  insertAllDayRowsIntoDateTable() {
    return false;
  }
  getTotalCellCount(groupCount) {
    groupCount = groupCount || 1;
    return this._workSpace._getCellCount() * groupCount;
  }
  getTotalRowCount() {
    return this._workSpace._getRowCount();
  }
  calculateTimeCellRepeatCount() {
    return 1;
  }
  getWorkSpaceMinWidth() {
    const workSpaceElementWidth = (0, _position.getBoundingRect)(this._workSpace.$element().get(0)).width;
    return workSpaceElementWidth - this._workSpace.getTimePanelWidth() - 2 * _const.WORK_SPACE_BORDER_PX;
  }
  getAllDayOffset() {
    return this._workSpace.getAllDayHeight();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getGroupCountClass(groups) {
    return undefined;
  }
  getLeftOffset() {
    return this._workSpace.getTimePanelWidth();
  }
  _createGroupBoundOffset(startCell, endCell, cellWidth) {
    const extraOffset = cellWidth / 2;
    const startOffset = startCell ? startCell.offset().left - extraOffset : 0;
    const endOffset = endCell ? endCell.offset().left + cellWidth + extraOffset : 0;
    return {
      left: startOffset,
      right: endOffset,
      top: 0,
      bottom: 0
    };
  }
  _getGroupedByDateBoundOffset($cells, cellWidth) {
    const firstCellIndex = 0;
    const lastCellIndex = $cells.length - 1;
    const startCell = $cells.eq(firstCellIndex);
    const endCell = $cells.eq(lastCellIndex);
    return this._createGroupBoundOffset(startCell, endCell, cellWidth);
  }
  getGroupBoundsOffset(cellCount, $cells, cellWidth, coordinates, groupedDataMap) {
    if (this._workSpace.isGroupedByDate()) {
      return this._getGroupedByDateBoundOffset($cells, cellWidth);
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
    return this._createGroupBoundOffset(startCell, endCell, cellWidth);
  }
  shiftIndicator($indicator, height, rtlOffset, groupIndex) {
    const offset = this._getIndicatorOffset(groupIndex);
    const horizontalOffset = rtlOffset ? rtlOffset - offset : offset;
    $indicator.css('left', horizontalOffset);
    $indicator.css('top', height);
  }
  _getIndicatorOffset(groupIndex) {
    const groupByDay = this._workSpace.isGroupedByDate();
    return groupByDay ? this._calculateGroupByDateOffset(groupIndex) : this._calculateOffset(groupIndex);
  }
  _calculateOffset(groupIndex) {
    const indicatorStartPosition = this._workSpace.getIndicatorOffset(groupIndex);
    const offset = this._workSpace._getCellCount() * this._workSpace.getRoundedCellWidth(groupIndex - 1, 0) * groupIndex;
    return indicatorStartPosition + offset;
  }
  _calculateGroupByDateOffset(groupIndex) {
    return this._workSpace.getIndicatorOffset(0) * this._workSpace._getGroupCount() + this._workSpace.getRoundedCellWidth(groupIndex - 1, 0) * groupIndex;
  }
  getShaderOffset(i, width) {
    const offset = this._workSpace._getCellCount() * this._workSpace.getRoundedCellWidth(i - 1) * i;
    return this._workSpace.option('rtlEnabled') ? (0, _position.getBoundingRect)(this._workSpace._dateTableScrollable.$content().get(0)).width - offset - this._workSpace.getTimePanelWidth() - width : offset;
  }
  getShaderTopOffset(i) {
    return -this.getShaderMaxHeight() * (i > 0 ? 1 : 0);
  }
  getShaderHeight() {
    const height = this._workSpace.getIndicationHeight();
    return height;
  }
  getShaderMaxHeight() {
    return (0, _position.getBoundingRect)(this._workSpace._dateTableScrollable.$content().get(0)).height;
  }
  getShaderWidth(i) {
    return this._workSpace.getIndicationWidth(i);
  }
  getScrollableScrollTop(allDay) {
    return !allDay ? this._workSpace.getScrollable().scrollTop() : 0;
  }
  // ---------------
  // We do not need these nethods in renovation
  // ---------------
  addAdditionalGroupCellClasses(cellClass, index, i, j) {
    let applyUnconditionally = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    cellClass = this._addLastGroupCellClass(cellClass, index, applyUnconditionally);
    return this._addFirstGroupCellClass(cellClass, index, applyUnconditionally);
  }
  _addLastGroupCellClass(cellClass, index, applyUnconditionally) {
    if (applyUnconditionally) {
      return `${cellClass} ${_m_classes.LAST_GROUP_CELL_CLASS}`;
    }
    const groupByDate = this._workSpace.isGroupedByDate();
    if (groupByDate) {
      if (index % this._workSpace._getGroupCount() === 0) {
        return `${cellClass} ${_m_classes.LAST_GROUP_CELL_CLASS}`;
      }
    } else if (index % this._workSpace._getCellCount() === 0) {
      return `${cellClass} ${_m_classes.LAST_GROUP_CELL_CLASS}`;
    }
    return cellClass;
  }
  _addFirstGroupCellClass(cellClass, index, applyUnconditionally) {
    if (applyUnconditionally) {
      return `${cellClass} ${_m_classes.FIRST_GROUP_CELL_CLASS}`;
    }
    const groupByDate = this._workSpace.isGroupedByDate();
    if (groupByDate) {
      if ((index - 1) % this._workSpace._getGroupCount() === 0) {
        return `${cellClass} ${_m_classes.FIRST_GROUP_CELL_CLASS}`;
      }
    } else if ((index - 1) % this._workSpace._getCellCount() === 0) {
      return `${cellClass} ${_m_classes.FIRST_GROUP_CELL_CLASS}`;
    }
    return cellClass;
  }
}
var _default = exports.default = HorizontalGroupedStrategy;