"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMaxAllowedPosition = exports.getGroupWidth = exports.getCellWidth = exports.getCellHeight = exports.getAllDayHeight = exports.PositionHelper = void 0;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/* eslint-disable max-classes-per-file */
const getCellSize = DOMMetaData => {
  const {
    dateTableCellsMeta
  } = DOMMetaData;
  const length = dateTableCellsMeta === null || dateTableCellsMeta === void 0 ? void 0 : dateTableCellsMeta.length;
  if (!length) {
    return {
      width: 0,
      height: 0
    };
  }
  const cellIndex = length > 1 ? 1 : 0;
  const cellSize = dateTableCellsMeta[cellIndex][0];
  return {
    width: cellSize.width,
    height: cellSize.height
  };
};
const getMaxAllowedHorizontalPosition = (groupIndex, viewDataProvider, rtlEnabled, DOMMetaData) => {
  const {
    dateTableCellsMeta
  } = DOMMetaData;
  const firstRow = dateTableCellsMeta[0];
  if (!firstRow) return 0;
  const {
    columnIndex
  } = viewDataProvider.getLastGroupCellPosition(groupIndex);
  const cellPosition = firstRow[columnIndex];
  if (!cellPosition) return 0;
  return !rtlEnabled ? cellPosition.left + cellPosition.width : cellPosition.left;
};
const getCellHeight = DOMMetaData => getCellSize(DOMMetaData).height;
exports.getCellHeight = getCellHeight;
const getCellWidth = DOMMetaData => getCellSize(DOMMetaData).width;
exports.getCellWidth = getCellWidth;
const getAllDayHeight = (showAllDayPanel, isVerticalGrouping, DOMMetaData) => {
  if (!showAllDayPanel) {
    return 0;
  }
  if (isVerticalGrouping) {
    const {
      dateTableCellsMeta
    } = DOMMetaData;
    const length = dateTableCellsMeta === null || dateTableCellsMeta === void 0 ? void 0 : dateTableCellsMeta.length;
    return length ? dateTableCellsMeta[0][0].height : 0;
  }
  const {
    allDayPanelCellsMeta
  } = DOMMetaData;
  return allDayPanelCellsMeta !== null && allDayPanelCellsMeta !== void 0 && allDayPanelCellsMeta.length ? allDayPanelCellsMeta[0].height : 0;
};
exports.getAllDayHeight = getAllDayHeight;
const getMaxAllowedPosition = (groupIndex, viewDataProvider, rtlEnabled, DOMMetaData) => {
  const validGroupIndex = groupIndex || 0;
  return getMaxAllowedHorizontalPosition(validGroupIndex, viewDataProvider, rtlEnabled, DOMMetaData);
};
exports.getMaxAllowedPosition = getMaxAllowedPosition;
const getGroupWidth = (groupIndex, viewDataProvider, options) => {
  const {
    isVirtualScrolling,
    rtlEnabled,
    DOMMetaData
  } = options;
  const cellWidth = getCellWidth(DOMMetaData);
  let result = viewDataProvider.getCellCount(options) * cellWidth;
  // TODO: refactor after deleting old render
  if (isVirtualScrolling) {
    const groupedData = viewDataProvider.groupedDataMap.dateTableGroupedMap;
    const groupLength = groupedData[groupIndex][0].length;
    result = groupLength * cellWidth;
  }
  const position = getMaxAllowedPosition(groupIndex, viewDataProvider, rtlEnabled, DOMMetaData);
  const currentPosition = position[groupIndex];
  if (currentPosition) {
    if (rtlEnabled) {
      result = currentPosition - position[groupIndex + 1];
    } else if (groupIndex === 0) {
      result = currentPosition;
    } else {
      result = currentPosition - position[groupIndex - 1];
    }
  }
  return result;
};
exports.getGroupWidth = getGroupWidth;
class PositionHelper {
  get viewDataProvider() {
    return this.options.viewDataProvider;
  }
  get rtlEnabled() {
    return this.options.rtlEnabled;
  }
  get isGroupedByDate() {
    return this.options.isGroupedByDate;
  }
  get groupCount() {
    return this.options.groupCount;
  }
  get DOMMetaData() {
    return this.options.getDOMMetaDataCallback();
  }
  constructor(options) {
    this.options = options;
    this.groupStrategy = this.options.isVerticalGrouping ? new GroupStrategyBase(this.options) : new GroupStrategyHorizontal(this.options);
  }
  getHorizontalMax(groupIndex) {
    const getMaxPosition = groupIndex => getMaxAllowedPosition(groupIndex, this.viewDataProvider, this.rtlEnabled, this.DOMMetaData);
    if (this.isGroupedByDate) {
      const viewPortGroupCount = this.viewDataProvider.getViewPortGroupCount();
      return Math.max(getMaxPosition(groupIndex), getMaxPosition(viewPortGroupCount - 1));
    }
    return getMaxPosition(groupIndex);
  }
  getResizableStep() {
    const cellWidth = getCellWidth(this.DOMMetaData);
    if (this.isGroupedByDate) {
      return this.groupCount * cellWidth;
    }
    return cellWidth;
  }
  getVerticalMax(options) {
    return this.groupStrategy.getVerticalMax(options);
  }
  getOffsetByAllDayPanel(options) {
    return this.groupStrategy.getOffsetByAllDayPanel(options);
  }
  getGroupTop(options) {
    return this.groupStrategy.getGroupTop(options);
  }
}
exports.PositionHelper = PositionHelper;
class GroupStrategyBase {
  constructor(options) {
    this.options = options;
  }
  get viewDataProvider() {
    return this.options.viewDataProvider;
  }
  get isGroupedByDate() {
    return this.options.isGroupedByDate;
  }
  get rtlEnabled() {
    return this.options.rtlEnabled;
  }
  get groupCount() {
    return this.options.groupCount;
  }
  get DOMMetaData() {
    return this.options.getDOMMetaDataCallback();
  }
  getOffsetByAllDayPanel(_ref) {
    let {
      groupIndex,
      supportAllDayRow,
      showAllDayPanel
    } = _ref;
    let result = 0;
    if (supportAllDayRow && showAllDayPanel) {
      const allDayPanelHeight = getAllDayHeight(showAllDayPanel, true, this.DOMMetaData);
      result = allDayPanelHeight * (groupIndex + 1);
    }
    return result;
  }
  getVerticalMax(options) {
    let maxAllowedPosition = this._getMaxAllowedVerticalPosition(_extends({}, options, {
      viewDataProvider: this.viewDataProvider,
      rtlEnabled: this.rtlEnabled,
      DOMMetaData: this.DOMMetaData
    }));
    maxAllowedPosition += this.getOffsetByAllDayPanel(options);
    return maxAllowedPosition;
  }
  getGroupTop(_ref2) {
    let {
      groupIndex,
      showAllDayPanel,
      isGroupedAllDayPanel
    } = _ref2;
    const rowCount = this.viewDataProvider.getRowCountInGroup(groupIndex);
    const maxVerticalPosition = this._getMaxAllowedVerticalPosition({
      groupIndex,
      viewDataProvider: this.viewDataProvider,
      showAllDayPanel,
      isGroupedAllDayPanel,
      isVerticalGrouping: true,
      DOMMetaData: this.DOMMetaData
    });
    return maxVerticalPosition - getCellHeight(this.DOMMetaData) * rowCount;
  }
  _getAllDayHeight(showAllDayPanel) {
    return getAllDayHeight(showAllDayPanel, true, this.DOMMetaData);
  }
  _getMaxAllowedVerticalPosition(_ref3) {
    let {
      groupIndex,
      showAllDayPanel,
      isGroupedAllDayPanel
    } = _ref3;
    const {
      rowIndex
    } = this.viewDataProvider.getLastGroupCellPosition(groupIndex);
    const {
      dateTableCellsMeta
    } = this.DOMMetaData;
    const lastGroupRow = dateTableCellsMeta[rowIndex];
    if (!lastGroupRow) return 0;
    let result = lastGroupRow[0].top + lastGroupRow[0].height;
    // TODO remove while refactoring dual calculcations.
    // Should decrease allDayPanel amount due to the dual calculation corrections.
    if (isGroupedAllDayPanel) {
      result -= (groupIndex + 1) * this._getAllDayHeight(showAllDayPanel);
    }
    return result;
  }
}
class GroupStrategyHorizontal extends GroupStrategyBase {
  getOffsetByAllDayPanel() {
    return 0;
  }
  getVerticalMax(options) {
    const {
      isVirtualScrolling,
      groupIndex
    } = options;
    const correctedGroupIndex = isVirtualScrolling ? groupIndex : 0;
    return this._getMaxAllowedVerticalPosition(_extends({}, options, {
      groupIndex: correctedGroupIndex
    }));
  }
  getGroupTop() {
    return 0;
  }
  _getAllDayHeight(showAllDayPanel) {
    return getAllDayHeight(showAllDayPanel, false, this.DOMMetaData);
  }
}