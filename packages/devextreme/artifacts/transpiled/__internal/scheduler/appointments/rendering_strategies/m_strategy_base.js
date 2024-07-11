"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _extend = require("../../../../core/utils/extend");
var _type = require("../../../../core/utils/type");
var _themes = require("../../../../ui/themes");
var _date2 = require("../../../core/utils/date");
var _m_expression_utils = require("../../../scheduler/m_expression_utils");
var _index = require("../../../scheduler/r1/utils/index");
var _m_appointment_adapter = require("../../m_appointment_adapter");
var _m_utils_time_zone = _interopRequireDefault(require("../../m_utils_time_zone"));
var _m_settings_generator = require("../m_settings_generator");
var _m_appointments_positioning_strategy_adaptive = _interopRequireDefault(require("./m_appointments_positioning_strategy_adaptive"));
var _m_appointments_positioning_strategy_base = _interopRequireDefault(require("./m_appointments_positioning_strategy_base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const toMs = _date.default.dateToMilliseconds;
const APPOINTMENT_MIN_SIZE = 2;
const APPOINTMENT_DEFAULT_HEIGHT = 20;
const COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT = 18;
const DROP_DOWN_BUTTON_ADAPTIVE_SIZE = 28;
const WEEK_VIEW_COLLECTOR_OFFSET = 5;
const COMPACT_THEME_WEEK_VIEW_COLLECTOR_OFFSET = 1;
class BaseRenderingStrategy {
  constructor(options) {
    this.options = options;
    this._initPositioningStrategy();
  }
  get isAdaptive() {
    return this.options.adaptivityEnabled;
  }
  get rtlEnabled() {
    return this.options.rtlEnabled;
  }
  get startDayHour() {
    return this.options.startDayHour;
  }
  get endDayHour() {
    return this.options.endDayHour;
  }
  get maxAppointmentsPerCell() {
    return this.options.maxAppointmentsPerCell;
  }
  get cellWidth() {
    return this.options.cellWidth;
  }
  get cellHeight() {
    return this.options.cellHeight;
  }
  get allDayHeight() {
    return this.options.allDayHeight;
  }
  get resizableStep() {
    return this.options.resizableStep;
  }
  get isGroupedByDate() {
    return this.options.isGroupedByDate;
  }
  get visibleDayDuration() {
    return this.options.visibleDayDuration;
  }
  get viewStartDayHour() {
    return this.options.viewStartDayHour;
  }
  get viewEndDayHour() {
    return this.options.viewEndDayHour;
  }
  get cellDuration() {
    return this.options.cellDuration;
  }
  get cellDurationInMinutes() {
    return this.options.cellDurationInMinutes;
  }
  get leftVirtualCellCount() {
    return this.options.leftVirtualCellCount;
  }
  get topVirtualCellCount() {
    return this.options.topVirtualCellCount;
  }
  get positionHelper() {
    return this.options.positionHelper;
  }
  get showAllDayPanel() {
    return this.options.showAllDayPanel;
  }
  get isGroupedAllDayPanel() {
    return this.options.isGroupedAllDayPanel;
  }
  get groupOrientation() {
    return this.options.groupOrientation;
  }
  get rowCount() {
    return this.options.rowCount;
  }
  get groupCount() {
    return this.options.groupCount;
  }
  get currentDate() {
    return this.options.currentDate;
  }
  get appointmentCountPerCell() {
    return this.options.appointmentCountPerCell;
  }
  get appointmentOffset() {
    return this.options.appointmentOffset;
  }
  get allowResizing() {
    return this.options.allowResizing;
  }
  get allowAllDayResizing() {
    return this.options.allowAllDayResizing;
  }
  get viewDataProvider() {
    return this.options.viewDataProvider;
  }
  get dataAccessors() {
    return this.options.dataAccessors;
  }
  get timeZoneCalculator() {
    return this.options.timeZoneCalculator;
  }
  get intervalCount() {
    return this.options.intervalCount;
  }
  get allDayPanelMode() {
    return this.options.allDayPanelMode;
  }
  get isVirtualScrolling() {
    return this.options.isVirtualScrolling;
  }
  _correctCollectorCoordinatesInAdaptive(coordinates, isAllDay) {
    coordinates.top += this.getCollectorTopOffset(isAllDay);
    coordinates.left += this.getCollectorLeftOffset();
  }
  _initPositioningStrategy() {
    this._positioningStrategy = this.isAdaptive ? new _m_appointments_positioning_strategy_adaptive.default(this) : new _m_appointments_positioning_strategy_base.default(this);
  }
  getPositioningStrategy() {
    return this._positioningStrategy;
  }
  getAppointmentMinSize() {
    return APPOINTMENT_MIN_SIZE;
  }
  keepAppointmentSettings() {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDeltaTime(args, initialSize, appointment) {}
  getAppointmentGeometry(coordinates) {
    return coordinates;
  }
  needCorrectAppointmentDates() {
    return true;
  }
  getDirection() {
    return 'horizontal';
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createTaskPositionMap(items, skipSorting) {
    delete this._maxAppointmentCountPerCell;
    const length = items === null || items === void 0 ? void 0 : items.length;
    if (!length) return;
    const map = [];
    for (let i = 0; i < length; i++) {
      let coordinates = this._getItemPosition(items[i]);
      if (coordinates.length && this.rtlEnabled) {
        coordinates = this._correctRtlCoordinates(coordinates);
      }
      coordinates.forEach(item => {
        item.leftVirtualCellCount = this.leftVirtualCellCount;
        item.topVirtualCellCount = this.topVirtualCellCount;
        item.leftVirtualWidth = this.leftVirtualCellCount * this.cellWidth;
        item.topVirtualHeight = this.topVirtualCellCount * this.cellHeight;
      });
      map.push(coordinates);
    }
    const positionArray = this._getSortedPositions(map);
    const resultPositions = this._getResultPositions(positionArray);
    return this._getExtendedPositionMap(map, resultPositions);
  }
  _getDeltaWidth(args, initialSize) {
    const intervalWidth = this.resizableStep || this.getAppointmentMinSize();
    const initialWidth = initialSize.width;
    return Math.round((args.width - initialWidth) / intervalWidth);
  }
  _correctRtlCoordinates(coordinates) {
    const width = coordinates[0].width || this._getAppointmentMaxWidth();
    coordinates.forEach(coordinate => {
      if (!coordinate.appointmentReduced) {
        coordinate.left -= width;
      }
    });
    return coordinates;
  }
  _getAppointmentMaxWidth() {
    return this.cellWidth;
  }
  _getItemPosition(initialAppointment) {
    const appointment = this.shiftAppointmentByViewOffset(initialAppointment);
    const position = this.generateAppointmentSettings(appointment);
    const allDay = this.isAllDay(appointment);
    let result = [];
    for (let j = 0; j < position.length; j++) {
      const height = this.calculateAppointmentHeight(appointment, position[j]);
      const width = this.calculateAppointmentWidth(appointment, position[j]);
      let resultWidth = width;
      let appointmentReduced = null;
      let multiWeekAppointmentParts = [];
      let initialRowIndex = position[j].rowIndex;
      let initialColumnIndex = position[j].columnIndex;
      if (this._needVerifyItemSize() || allDay) {
        const currentMaxAllowedPosition = position[j].hMax;
        if (this.isAppointmentGreaterThan(currentMaxAllowedPosition, {
          left: position[j].left,
          width
        })) {
          appointmentReduced = 'head';
          initialRowIndex = position[j].rowIndex;
          initialColumnIndex = position[j].columnIndex;
          resultWidth = this._reduceMultiWeekAppointment(width, {
            left: position[j].left,
            right: currentMaxAllowedPosition
          });
          multiWeekAppointmentParts = this._getAppointmentParts({
            sourceAppointmentWidth: width,
            reducedWidth: resultWidth,
            height
          }, position[j]);
          // eslint-disable-next-line max-depth
          if (this.rtlEnabled) {
            position[j].left = currentMaxAllowedPosition;
          }
        }
      }
      (0, _extend.extend)(position[j], {
        height,
        width: resultWidth,
        allDay,
        rowIndex: initialRowIndex,
        columnIndex: initialColumnIndex,
        appointmentReduced
      });
      result = this._getAppointmentPartsPosition(multiWeekAppointmentParts, position[j], result);
    }
    return result;
  }
  _getAppointmentPartsPosition(appointmentParts, position, result) {
    if (appointmentParts.length) {
      appointmentParts.unshift(position);
      result = result.concat(appointmentParts);
    } else {
      result.push(position);
    }
    return result;
  }
  getAppointmentSettingsGenerator(rawAppointment) {
    return new _m_settings_generator.AppointmentSettingsGenerator(_extends({
      rawAppointment,
      appointmentTakesAllDay: this.isAppointmentTakesAllDay(rawAppointment),
      getPositionShiftCallback: this.getPositionShift.bind(this)
    }, this.options));
  }
  generateAppointmentSettings(rawAppointment) {
    return this.getAppointmentSettingsGenerator(rawAppointment).create();
  }
  isAppointmentTakesAllDay(rawAppointment) {
    const adapter = (0, _m_appointment_adapter.createAppointmentAdapter)(rawAppointment, this.dataAccessors, this.timeZoneCalculator);
    return (0, _index.getAppointmentTakesAllDay)(adapter, this.allDayPanelMode);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getAppointmentParts(geometry, settings) {
    return [];
  }
  _getCompactAppointmentParts(appointmentWidth) {
    const cellWidth = this.cellWidth || this.getAppointmentMinSize();
    return Math.round(appointmentWidth / cellWidth);
  }
  _reduceMultiWeekAppointment(sourceAppointmentWidth, bound) {
    if (this.rtlEnabled) {
      sourceAppointmentWidth = Math.floor(bound.left - bound.right);
    } else {
      sourceAppointmentWidth = bound.right - Math.floor(bound.left);
    }
    return sourceAppointmentWidth;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  calculateAppointmentHeight(appointment, position) {
    return 0;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  calculateAppointmentWidth(appointment, position) {
    return 0;
  }
  isAppointmentGreaterThan(etalon, comparisonParameters) {
    let result = comparisonParameters.left + comparisonParameters.width - etalon;
    if (this.rtlEnabled) {
      result = etalon + comparisonParameters.width - comparisonParameters.left;
    }
    return result > this.cellWidth / 2;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isAllDay(appointment) {
    return false;
  }
  cropAppointmentWidth(width, cellWidth) {
    return this.isGroupedByDate ? cellWidth : width;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getSortedPositions(positionList, skipSorting) {
    const result = [];
    const round = value => Math.round(value * 100) / 100;
    const createItem = (rowIndex, columnIndex, top, left, bottom, right, position, allDay) => ({
      i: rowIndex,
      j: columnIndex,
      top: round(top),
      left: round(left),
      bottom: round(bottom),
      right: round(right),
      cellPosition: position,
      allDay
    });
    for (let rowIndex = 0, rowCount = positionList.length; rowIndex < rowCount; rowIndex++) {
      for (let columnIndex = 0, cellCount = positionList[rowIndex].length; columnIndex < cellCount; columnIndex++) {
        const {
          top,
          left,
          height,
          width,
          cellPosition,
          allDay
        } = positionList[rowIndex][columnIndex];
        result.push(createItem(rowIndex, columnIndex, top, left, top + height, left + width, cellPosition, allDay));
      }
    }
    return result.sort((a, b) => this._sortCondition(a, b));
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _sortCondition(a, b) {}
  _getConditions(a, b) {
    const isSomeEdge = this._isSomeEdge(a, b);
    return {
      columnCondition: isSomeEdge || this._normalizeCondition(a.left, b.left),
      rowCondition: isSomeEdge || this._normalizeCondition(a.top, b.top),
      cellPositionCondition: isSomeEdge || this._normalizeCondition(a.cellPosition, b.cellPosition)
    };
  }
  _rowCondition(a, b) {
    const conditions = this._getConditions(a, b);
    return conditions.columnCondition || conditions.rowCondition;
  }
  _columnCondition(a, b) {
    const conditions = this._getConditions(a, b);
    return conditions.rowCondition || conditions.columnCondition;
  }
  _isSomeEdge(a, b) {
    return a.i === b.i && a.j === b.j;
  }
  _normalizeCondition(first, second) {
    // NOTE: ie & ff pixels
    const result = first - second;
    return Math.abs(result) > 1 ? result : 0;
  }
  _isItemsCross(firstItem, secondItem) {
    const areItemsInTheSameTable = !!firstItem.allDay === !!secondItem.allDay;
    const areItemsAllDay = firstItem.allDay && secondItem.allDay;
    if (areItemsInTheSameTable) {
      const orientation = this._getOrientation(areItemsAllDay);
      return this._checkItemsCrossing(firstItem, secondItem, orientation);
    }
    return false;
  }
  _checkItemsCrossing(firstItem, secondItem, orientation) {
    const firstItemSide1 = Math.floor(firstItem[orientation[0]]);
    const firstItemSide2 = Math.floor(firstItem[orientation[1]]);
    const secondItemSide1 = Math.ceil(secondItem[orientation[0]]);
    const secondItemSide2 = Math.ceil(secondItem[orientation[1]]);
    const isItemCross = Math.abs(firstItem[orientation[2]] - secondItem[orientation[2]]) <= 1;
    return isItemCross && (firstItemSide1 <= secondItemSide1 && firstItemSide2 > secondItemSide1 || firstItemSide1 < secondItemSide2 && firstItemSide2 >= secondItemSide2 || firstItemSide1 === secondItemSide1 && firstItemSide2 === secondItemSide2);
  }
  _getOrientation(isAllDay) {
    return isAllDay ? ['left', 'right', 'top'] : ['top', 'bottom', 'left'];
  }
  _getResultPositions(sortedArray) {
    const result = [];
    let i;
    let sortedIndex = 0;
    let currentItem;
    let indexes;
    let itemIndex;
    let maxIndexInStack = 0;
    let stack = {};
    const findFreeIndex = (indexes, index) => {
      const isFind = indexes.some(item => item === index);
      if (isFind) {
        return findFreeIndex(indexes, ++index);
      }
      return index;
    };
    const createItem = (currentItem, index) => {
      const currentIndex = index || 0;
      return {
        index: currentIndex,
        i: currentItem.i,
        j: currentItem.j,
        left: currentItem.left,
        right: currentItem.right,
        top: currentItem.top,
        bottom: currentItem.bottom,
        allDay: currentItem.allDay,
        sortedIndex: this._skipSortedIndex(currentIndex) ? null : sortedIndex++
      };
    };
    const startNewStack = currentItem => {
      stack.items = [createItem(currentItem)];
      stack.left = currentItem.left;
      stack.right = currentItem.right;
      stack.top = currentItem.top;
      stack.bottom = currentItem.bottom;
      stack.allDay = currentItem.allDay;
    };
    const pushItemsInResult = items => {
      items.forEach(item => {
        result.push({
          index: item.index,
          count: maxIndexInStack + 1,
          i: item.i,
          j: item.j,
          sortedIndex: item.sortedIndex
        });
      });
    };
    for (i = 0; i < sortedArray.length; i++) {
      currentItem = sortedArray[i];
      indexes = [];
      if (!stack.items) {
        startNewStack(currentItem);
      } else if (this._isItemsCross(stack, currentItem)) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        stack.items.forEach(item => {
          if (this._isItemsCross(item, currentItem)) {
            indexes.push(item.index);
          }
        });
        itemIndex = indexes.length ? findFreeIndex(indexes, 0) : 0;
        stack.items.push(createItem(currentItem, itemIndex));
        maxIndexInStack = Math.max(itemIndex, maxIndexInStack);
        stack.left = Math.min(stack.left, currentItem.left);
        stack.right = Math.max(stack.right, currentItem.right);
        stack.top = Math.min(stack.top, currentItem.top);
        stack.bottom = Math.max(stack.bottom, currentItem.bottom);
        stack.allDay = currentItem.allDay;
      } else {
        pushItemsInResult(stack.items);
        stack = {};
        startNewStack(currentItem);
        maxIndexInStack = 0;
      }
    }
    if (stack.items) {
      pushItemsInResult(stack.items);
    }
    return result.sort((a, b) => {
      const columnCondition = a.j - b.j;
      const rowCondition = a.i - b.i;
      return rowCondition || columnCondition;
    });
  }
  _skipSortedIndex(index) {
    return index > this._getMaxAppointmentCountPerCell() - 1;
  }
  _findIndexByKey(arr, iKey, jKey, iValue, jValue) {
    let result = 0;
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i][iKey] === iValue && arr[i][jKey] === jValue) {
        result = i;
        break;
      }
    }
    return result;
  }
  _getExtendedPositionMap(map, positions) {
    let positionCounter = 0;
    const result = [];
    for (let i = 0, mapLength = map.length; i < mapLength; i++) {
      const resultString = [];
      for (let j = 0, itemLength = map[i].length; j < itemLength; j++) {
        map[i][j].index = positions[positionCounter].index;
        map[i][j].sortedIndex = positions[positionCounter].sortedIndex;
        map[i][j].count = positions[positionCounter++].count;
        resultString.push(map[i][j]);
        this._checkLongCompactAppointment(map[i][j], resultString);
      }
      result.push(resultString);
    }
    return result;
  }
  _checkLongCompactAppointment(item, result) {
    this._splitLongCompactAppointment(item, result);
    return result;
  }
  _splitLongCompactAppointment(item, result) {
    const appointmentCountPerCell = this._getMaxAppointmentCountPerCellByType(item.allDay);
    let compactCount = 0;
    if (appointmentCountPerCell !== undefined && item.index > appointmentCountPerCell - 1) {
      item.isCompact = true;
      compactCount = this._getCompactAppointmentParts(item.width);
      for (let k = 1; k < compactCount; k++) {
        const compactPart = (0, _extend.extend)(true, {}, item);
        compactPart.left = this._getCompactLeftCoordinate(item.left, k);
        compactPart.columnIndex += k;
        compactPart.sortedIndex = null;
        result.push(compactPart);
      }
    }
    return result;
  }
  _adjustDurationByDaylightDiff(duration, startDate, endDate) {
    const {
      viewOffset
    } = this.options;
    const originalStartDate = _date2.dateUtilsTs.addOffsets(startDate, [viewOffset]);
    const originalEndDate = _date2.dateUtilsTs.addOffsets(endDate, [viewOffset]);
    const daylightDiff = _m_utils_time_zone.default.getDaylightOffset(originalStartDate, originalEndDate);
    const correctedDuration = this._needAdjustDuration(daylightDiff) ? this._calculateDurationByDaylightDiff(duration, daylightDiff) : duration;
    return correctedDuration <= Math.abs(daylightDiff) ? duration : correctedDuration;
  }
  _needAdjustDuration(diff) {
    return diff !== 0;
  }
  _calculateDurationByDaylightDiff(duration, diff) {
    return duration + diff * toMs('minute');
  }
  _getCollectorLeftOffset(isAllDay) {
    if (isAllDay || !this.isApplyCompactAppointmentOffset()) {
      return 0;
    }
    const dropDownButtonWidth = this.getDropDownAppointmentWidth(this.intervalCount, isAllDay);
    const rightOffset = this._isCompactTheme() ? COMPACT_THEME_WEEK_VIEW_COLLECTOR_OFFSET : WEEK_VIEW_COLLECTOR_OFFSET;
    return this.cellWidth - dropDownButtonWidth - rightOffset;
  }
  _markAppointmentAsVirtual(coordinates) {
    let isAllDay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const countFullWidthAppointmentInCell = this._getMaxAppointmentCountPerCellByType(isAllDay);
    if (coordinates.count - countFullWidthAppointmentInCell > 0) {
      const {
        top,
        left
      } = coordinates;
      const compactRender = this.isAdaptive || !isAllDay && this.supportCompactDropDownAppointments();
      coordinates.virtual = {
        left: left + this._getCollectorLeftOffset(isAllDay),
        top,
        width: this.getDropDownAppointmentWidth(this.intervalCount, isAllDay),
        height: this.getDropDownAppointmentHeight(),
        index: this._generateAppointmentCollectorIndex(coordinates, isAllDay),
        isAllDay,
        groupIndex: coordinates.groupIndex,
        isCompact: compactRender
      };
    }
  }
  isApplyCompactAppointmentOffset() {
    return this.supportCompactDropDownAppointments();
  }
  supportCompactDropDownAppointments() {
    return true;
  }
  _generateAppointmentCollectorIndex(_ref, isAllDay) {
    let {
      groupIndex,
      rowIndex,
      columnIndex
    } = _ref;
    return `${groupIndex}-${rowIndex}-${columnIndex}-${isAllDay}`;
  }
  _getMaxAppointmentCountPerCellByType(isAllDay) {
    const appointmentCountPerCell = this._getMaxAppointmentCountPerCell();
    if ((0, _type.isObject)(appointmentCountPerCell)) {
      return isAllDay ? appointmentCountPerCell.allDay : appointmentCountPerCell.simple;
    }
    return appointmentCountPerCell;
  }
  getDropDownAppointmentWidth(intervalCount, isAllDay) {
    return this.getPositioningStrategy().getDropDownAppointmentWidth(intervalCount, isAllDay);
  }
  getDropDownAppointmentHeight() {
    return this.getPositioningStrategy().getDropDownAppointmentHeight();
  }
  getDropDownButtonAdaptiveSize() {
    return DROP_DOWN_BUTTON_ADAPTIVE_SIZE;
  }
  getCollectorTopOffset(allDay) {
    return this.getPositioningStrategy().getCollectorTopOffset(allDay);
  }
  getCollectorLeftOffset() {
    return this.getPositioningStrategy().getCollectorLeftOffset();
  }
  getAppointmentDataCalculator() {}
  getVerticalAppointmentHeight(cellHeight, currentAppointmentCountInCell, maxAppointmentsPerCell) {
    let resultMaxAppointmentsPerCell = maxAppointmentsPerCell;
    if ((0, _type.isNumeric)(this.maxAppointmentsPerCell)) {
      const dynamicAppointmentCountPerCell = this._getDynamicAppointmentCountPerCell();
      const maxAppointmentCountDisplayedInCell = dynamicAppointmentCountPerCell.allDay || dynamicAppointmentCountPerCell;
      const maxAppointmentsCount = Math.max(currentAppointmentCountInCell, maxAppointmentCountDisplayedInCell);
      resultMaxAppointmentsPerCell = Math.min(maxAppointmentsCount, maxAppointmentsPerCell);
    }
    return cellHeight / resultMaxAppointmentsPerCell;
  }
  _customizeCoordinates(coordinates, cellHeight, appointmentCountPerCell, topOffset, isAllDay) {
    const {
      index,
      count
    } = coordinates;
    const appointmentHeight = this.getVerticalAppointmentHeight(cellHeight, count, appointmentCountPerCell);
    const appointmentTop = coordinates.top + index * appointmentHeight;
    const top = appointmentTop + topOffset;
    const {
      width
    } = coordinates;
    const {
      left
    } = coordinates;
    if (coordinates.isCompact) {
      this.isAdaptive && this._correctCollectorCoordinatesInAdaptive(coordinates, isAllDay);
      this._markAppointmentAsVirtual(coordinates, isAllDay);
    }
    return {
      height: appointmentHeight,
      width,
      top,
      left,
      empty: this._isAppointmentEmpty(cellHeight, width)
    };
  }
  _isAppointmentEmpty(height, width) {
    return height < this._getAppointmentMinHeight() || width < this._getAppointmentMinWidth();
  }
  _calculateGeometryConfig(coordinates) {
    const overlappingMode = this.maxAppointmentsPerCell;
    const offsets = this._getOffsets();
    const appointmentDefaultOffset = this._getAppointmentDefaultOffset();
    let appointmentCountPerCell = this._getAppointmentCount(overlappingMode, coordinates);
    let ratio = this._getDefaultRatio(coordinates, appointmentCountPerCell);
    let maxHeight = this._getMaxHeight();
    if (!(0, _type.isNumeric)(appointmentCountPerCell)) {
      appointmentCountPerCell = coordinates.count;
      ratio = (maxHeight - offsets.unlimited) / maxHeight;
    }
    let topOffset = (1 - ratio) * maxHeight;
    if (overlappingMode === 'auto' || (0, _type.isNumeric)(overlappingMode)) {
      ratio = 1;
      maxHeight -= appointmentDefaultOffset;
      topOffset = appointmentDefaultOffset;
    }
    return {
      height: ratio * maxHeight,
      appointmentCountPerCell,
      offset: topOffset
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getAppointmentCount(overlappingMode, coordinates) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getDefaultRatio(coordinates, appointmentCountPerCell) {}
  _getOffsets() {}
  _getMaxHeight() {}
  _needVerifyItemSize() {
    return false;
  }
  _getMaxAppointmentCountPerCell() {
    if (!this._maxAppointmentCountPerCell) {
      const overlappingMode = this.maxAppointmentsPerCell;
      let appointmentCountPerCell;
      if ((0, _type.isNumeric)(overlappingMode)) {
        appointmentCountPerCell = overlappingMode;
      }
      if (overlappingMode === 'auto') {
        appointmentCountPerCell = this._getDynamicAppointmentCountPerCell();
      }
      if (overlappingMode === 'unlimited') {
        appointmentCountPerCell = undefined;
      }
      this._maxAppointmentCountPerCell = appointmentCountPerCell;
    }
    return this._maxAppointmentCountPerCell;
  }
  _getDynamicAppointmentCountPerCell() {
    return this.getPositioningStrategy().getDynamicAppointmentCountPerCell();
  }
  allDaySupported() {
    return false;
  }
  _isCompactTheme() {
    return ((0, _themes.current)() || '').split('.').pop() === 'compact';
  }
  _getAppointmentDefaultOffset() {
    return this.getPositioningStrategy().getAppointmentDefaultOffset();
  }
  _getAppointmentDefaultHeight() {
    return this._getAppointmentHeightByTheme();
  }
  _getAppointmentMinHeight() {
    return this._getAppointmentDefaultHeight();
  }
  _getAppointmentHeightByTheme() {
    return this._isCompactTheme() ? COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT : APPOINTMENT_DEFAULT_HEIGHT;
  }
  _getAppointmentDefaultWidth() {
    return this.getPositioningStrategy()._getAppointmentDefaultWidth();
  }
  _getAppointmentMinWidth() {
    return this._getAppointmentDefaultWidth();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _needVerticalGroupBounds(allDay) {
    return false;
  }
  _needHorizontalGroupBounds() {
    return false;
  }
  getAppointmentDurationInMs(apptStartDate, apptEndDate, allDay) {
    if (allDay) {
      const appointmentDuration = apptEndDate.getTime() - apptStartDate.getTime();
      const ceilQuantityOfDays = Math.ceil(appointmentDuration / toMs('day'));
      return ceilQuantityOfDays * this.visibleDayDuration;
    }
    const msInHour = toMs('hour');
    const trimmedStartDate = _date.default.trimTime(apptStartDate);
    const trimmedEndDate = _date.default.trimTime(apptEndDate);
    const deltaDate = trimmedEndDate - trimmedStartDate;
    const quantityOfDays = deltaDate / toMs('day') + 1;
    const dayVisibleHours = this.endDayHour - this.startDayHour;
    const appointmentDayHours = dayVisibleHours * quantityOfDays;
    const startHours = (apptStartDate - trimmedStartDate) / msInHour;
    const apptStartDelta = Math.max(0, startHours - this.startDayHour);
    const endHours = Math.max(0, (apptEndDate - trimmedEndDate) / msInHour - this.startDayHour);
    const apptEndDelta = Math.max(0, dayVisibleHours - endHours);
    const result = (appointmentDayHours - (apptStartDelta + apptEndDelta)) * msInHour;
    return result;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPositionShift(timeShift, isAllDay) {
    return {
      top: timeShift * this.cellHeight,
      left: 0,
      cellPosition: 0
    };
  }
  shiftAppointmentByViewOffset(appointment) {
    const {
      viewOffset
    } = this.options;
    const startDateField = this.dataAccessors.expr.startDateExpr;
    const endDateField = this.dataAccessors.expr.endDateExpr;
    let startDate = new Date(_m_expression_utils.ExpressionUtils.getField(this.dataAccessors, 'startDate', appointment));
    startDate = _date2.dateUtilsTs.addOffsets(startDate, [-viewOffset]);
    let endDate = new Date(_m_expression_utils.ExpressionUtils.getField(this.dataAccessors, 'endDate', appointment));
    endDate = _date2.dateUtilsTs.addOffsets(endDate, [-viewOffset]);
    return _extends({}, appointment, {
      [startDateField]: startDate,
      [endDateField]: endDate
    });
  }
}
var _default = exports.default = BaseRenderingStrategy;