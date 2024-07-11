"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimePanelDataGenerator = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _date2 = require("../../../core/utils/date");
var _math = require("../../../core/utils/math");
var _index = require("../../../scheduler/r1/utils/index");
const _excluded = ["allDay", "startDate", "endDate", "groups", "groupIndex", "isFirstGroupCell", "isLastGroupCell", "index"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const toMs = _date.default.dateToMilliseconds;
class TimePanelDataGenerator {
  constructor(_viewDataGenerator) {
    this._viewDataGenerator = _viewDataGenerator;
  }
  getCompleteTimePanelMap(options, completeViewDataMap) {
    const {
      startViewDate,
      cellDuration,
      startDayHour,
      isVerticalGrouping,
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      endDayHour,
      viewOffset,
      today,
      showCurrentTimeIndicator
    } = options;
    const rowsCount = completeViewDataMap.length - 1;
    const realEndViewDate = completeViewDataMap[rowsCount][completeViewDataMap[rowsCount].length - 1].endDate;
    const rowCountInGroup = this._viewDataGenerator.getRowCount({
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour
    });
    const cellCountInGroupRow = this._viewDataGenerator.getCellCount({
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour
    });
    let allDayRowsCount = 0;
    let usualCellIndex = 0;
    return completeViewDataMap.map((row, index) => {
      const _row$ = row[0],
        {
          allDay,
          startDate,
          groups,
          groupIndex,
          isFirstGroupCell,
          isLastGroupCell,
          index: cellIndex
        } = _row$,
        restCellProps = _objectWithoutPropertiesLoose(_row$, _excluded);
      const highlighted = allDay ? false : this.isTimeCellShouldBeHighlighted(today, viewOffset, {
        startViewDate,
        realEndViewDate,
        showCurrentTimeIndicator
      }, {
        date: startDate,
        index: usualCellIndex,
        // NOTE: The 'cellDuration' (in ms) here created from the float 'hoursInterval' value.
        // It may be not equal integer value but very close to it.
        // Therefore, we round this value here.
        duration: Math.round(cellDuration),
        isFirst: usualCellIndex === 0,
        isLast: this.isLastCellInGroup(completeViewDataMap, index)
      });
      if (allDay) {
        allDayRowsCount += 1;
        usualCellIndex = 0;
      } else {
        usualCellIndex += 1;
      }
      const timeIndex = (index - allDayRowsCount) % rowCountInGroup;
      return _extends({}, restCellProps, {
        startDate,
        allDay,
        highlighted,
        text: _index.weekUtils.getTimePanelCellText(timeIndex, startDate, startViewDate, cellDuration, startDayHour, viewOffset),
        groups: isVerticalGrouping ? groups : undefined,
        groupIndex: isVerticalGrouping ? groupIndex : undefined,
        isFirstGroupCell: isVerticalGrouping && isFirstGroupCell,
        isLastGroupCell: isVerticalGrouping && isLastGroupCell,
        index: Math.floor(cellIndex / cellCountInGroupRow)
      });
    });
  }
  generateTimePanelData(completeTimePanelMap, options) {
    const {
      startRowIndex,
      rowCount,
      topVirtualRowHeight,
      bottomVirtualRowHeight,
      isGroupedAllDayPanel,
      isVerticalGrouping,
      isAllDayPanelVisible
    } = options;
    const indexDifference = isVerticalGrouping || !isAllDayPanelVisible ? 0 : 1;
    const correctedStartRowIndex = startRowIndex + indexDifference;
    const displayedRowCount = (0, _index.getDisplayedRowCount)(rowCount, completeTimePanelMap);
    const timePanelMap = completeTimePanelMap.slice(correctedStartRowIndex, correctedStartRowIndex + displayedRowCount);
    const timePanelData = {
      topVirtualRowHeight,
      bottomVirtualRowHeight,
      isGroupedAllDayPanel
    };
    const {
      previousGroupedData: groupedData
    } = this._generateTimePanelDataFromMap(timePanelMap, isVerticalGrouping);
    timePanelData.groupedData = groupedData;
    return timePanelData;
  }
  _generateTimePanelDataFromMap(timePanelMap, isVerticalGrouping) {
    return timePanelMap.reduce((_ref, cellData) => {
      let {
        previousGroupIndex,
        previousGroupedData
      } = _ref;
      const currentGroupIndex = cellData.groupIndex;
      if (currentGroupIndex !== previousGroupIndex) {
        previousGroupedData.push({
          dateTable: [],
          isGroupedAllDayPanel: (0, _index.getIsGroupedAllDayPanel)(!!cellData.allDay, isVerticalGrouping),
          groupIndex: currentGroupIndex,
          key: (0, _index.getKeyByGroup)(currentGroupIndex, isVerticalGrouping)
        });
      }
      if (cellData.allDay) {
        previousGroupedData[previousGroupedData.length - 1].allDayPanel = cellData;
      } else {
        previousGroupedData[previousGroupedData.length - 1].dateTable.push(cellData);
      }
      return {
        previousGroupIndex: currentGroupIndex,
        previousGroupedData
      };
    }, {
      previousGroupIndex: -1,
      previousGroupedData: []
    });
  }
  isTimeCellShouldBeHighlighted(today, viewOffset, _ref2, cellData) {
    let {
      startViewDate,
      realEndViewDate,
      showCurrentTimeIndicator
    } = _ref2;
    // NOTE: today date value shifted by -viewOffset for the render purposes.
    // Therefore, we roll-backing here this shift.
    const realToday = _date2.dateUtilsTs.addOffsets(today, [viewOffset]);
    // NOTE: start view date value calculated from the render options and hasn't viewOffset.
    // So, we must shift it by viewOffset to get the real start view date here.
    const realStartViewDate = _date2.dateUtilsTs.addOffsets(startViewDate, [viewOffset]);
    if (!showCurrentTimeIndicator || realToday < realStartViewDate || realToday >= realEndViewDate) {
      return false;
    }
    const realTodayTimeMs = this.getLocalDateTimeInMs(realToday);
    const [startMs, endMs] = this.getHighlightedInterval(cellData);
    return startMs < endMs ? realTodayTimeMs >= startMs && realTodayTimeMs < endMs : realTodayTimeMs >= startMs && realTodayTimeMs < toMs('day') || realTodayTimeMs >= 0 && realTodayTimeMs < endMs;
  }
  getHighlightedInterval(_ref3) {
    let {
      date,
      index,
      duration,
      isFirst,
      isLast
    } = _ref3;
    const cellTimeMs = this.getLocalDateTimeInMs(date);
    const isEvenCell = index % 2 === 0;
    switch (true) {
      case isFirst || isLast && !isEvenCell:
        return [cellTimeMs, (0, _math.shiftIntegerByModule)(cellTimeMs + duration, toMs('day'))];
      case isEvenCell:
        return [(0, _math.shiftIntegerByModule)(cellTimeMs - duration, toMs('day')), (0, _math.shiftIntegerByModule)(cellTimeMs + duration, toMs('day'))];
      default:
        return [cellTimeMs, (0, _math.shiftIntegerByModule)(cellTimeMs + 2 * duration, toMs('day'))];
    }
  }
  getLocalDateTimeInMs(date) {
    const dateUtcMs = date.getTime() - date.getTimezoneOffset() * toMs('minute');
    return (0, _math.shiftIntegerByModule)(dateUtcMs, toMs('day'));
  }
  isLastCellInGroup(completeViewDataMap, index) {
    if (index === completeViewDataMap.length - 1) {
      return true;
    }
    const {
      groupIndex: currentGroupIndex
    } = completeViewDataMap[index][0];
    const {
      groupIndex: nextGroupIndex,
      allDay: nextAllDay
    } = completeViewDataMap[index + 1][0];
    return nextAllDay || nextGroupIndex !== currentGroupIndex;
  }
}
exports.TimePanelDataGenerator = TimePanelDataGenerator;