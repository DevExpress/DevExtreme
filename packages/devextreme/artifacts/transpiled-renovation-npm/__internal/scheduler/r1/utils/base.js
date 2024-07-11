"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitNumber = exports.setOptionHour = exports.isVerticalGroupingApplied = exports.isTimelineView = exports.isHorizontalView = exports.isHorizontalGroupingApplied = exports.isGroupingByDate = exports.isFirstCellInMonthWithIntervalCount = exports.isDateInRange = exports.isDateAndTimeView = exports.isDataOnWeekend = exports.hasResourceValue = exports.getWeekendsCount = exports.getViewStartByOptions = exports.getVerticalGroupCountClass = exports.getValidCellDateForLocalTimeFormat = exports.getTotalRowCountByCompleteData = exports.getTotalCellCountByCompleteData = exports.getToday = exports.getStartViewDateWithoutDST = exports.getStartViewDateTimeOffset = exports.getSkippedHoursInRange = exports.getOverflowIndicatorColor = exports.getKeyByGroup = exports.getIsGroupedAllDayPanel = exports.getHorizontalGroupCount = exports.getHeaderCellText = exports.getGroupPanelData = exports.getGroupCount = exports.getDisplayedRowCount = exports.getDisplayedCellCount = exports.getDatesWithoutTime = exports.getCellDuration = exports.getCalculatedFirstDayOfWeek = exports.getAppointmentTakesAllDay = exports.getAppointmentRenderingStrategyName = exports.getAppointmentKey = exports.extendGroupItemsForGroupingByDate = exports.calculateViewStartDate = exports.calculateIsGroupedAllDayPanel = exports.calculateDayDuration = exports.calculateCellIndex = void 0;
var _common = require("../../../../core/utils/common");
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _type = require("../../../../core/utils/type");
var _date2 = _interopRequireDefault(require("../../../../localization/date"));
var _date3 = require("../../../core/utils/date");
var _m_classes = require("../../m_classes");
var _m_constants = require("../../m_constants");
var _m_utils_time_zone = _interopRequireDefault(require("../../m_utils_time_zone"));
var _const = require("../const");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const toMs = _date.default.dateToMilliseconds;
const DAY_HOURS = 24;
const HOUR_IN_MS = 1000 * 60 * 60;
const SATURDAY_INDEX = 6;
const SUNDAY_INDEX = 0;
const getDurationInHours = (startDate, endDate) => Math.floor((endDate.getTime() - startDate.getTime()) / toMs('hour'));
const getDatesWithoutTime = (min, max) => {
  const newMin = _date.default.trimTime(min);
  const newMax = _date.default.trimTime(max);
  newMax.setDate(newMax.getDate() + 1);
  return [newMin, newMax];
};
exports.getDatesWithoutTime = getDatesWithoutTime;
const getAppointmentRenderingStrategyName = viewType => {
  const appointmentRenderingStrategyMap = {
    day: {
      renderingStrategy: 'vertical'
    },
    week: {
      renderingStrategy: 'week'
    },
    workWeek: {
      renderingStrategy: 'week'
    },
    month: {
      renderingStrategy: 'horizontalMonth'
    },
    timelineDay: {
      renderingStrategy: 'horizontal'
    },
    timelineWeek: {
      renderingStrategy: 'horizontal'
    },
    timelineWorkWeek: {
      renderingStrategy: 'horizontal'
    },
    timelineMonth: {
      renderingStrategy: 'horizontalMonthLine'
    },
    agenda: {
      renderingStrategy: 'agenda'
    }
  };
  const {
    renderingStrategy
  } = appointmentRenderingStrategyMap[viewType];
  return renderingStrategy;
};
exports.getAppointmentRenderingStrategyName = getAppointmentRenderingStrategyName;
const getAppointmentTakesAllDay = (appointmentAdapter, allDayPanelMode) => {
  const {
    startDate,
    endDate,
    allDay
  } = appointmentAdapter;
  switch (allDayPanelMode) {
    case 'hidden':
      return false;
    case 'allDay':
      return allDay;
    case 'all':
    default:
      if (allDay) {
        return true;
      }
      if (!(0, _type.isDefined)(endDate)) {
        return false;
      }
      return getDurationInHours(startDate, endDate) >= DAY_HOURS;
  }
};
exports.getAppointmentTakesAllDay = getAppointmentTakesAllDay;
const getAppointmentKey = geometry => {
  const {
    left,
    top,
    width,
    height
  } = geometry;
  return `${left}-${top}-${width}-${height}`;
};
exports.getAppointmentKey = getAppointmentKey;
const hasResourceValue = (resourceValues, itemValue) => (0, _type.isDefined)(resourceValues.find(value => (0, _common.equalByValue)(value, itemValue)));
exports.hasResourceValue = hasResourceValue;
const getOverflowIndicatorColor = (color, colors) => !colors.length || colors.filter(item => item !== color).length === 0 ? color : undefined;
exports.getOverflowIndicatorColor = getOverflowIndicatorColor;
const getVerticalGroupCountClass = groups => {
  switch (groups === null || groups === void 0 ? void 0 : groups.length) {
    case 1:
      return _m_classes.VERTICAL_GROUP_COUNT_CLASSES[0];
    case 2:
      return _m_classes.VERTICAL_GROUP_COUNT_CLASSES[1];
    case 3:
      return _m_classes.VERTICAL_GROUP_COUNT_CLASSES[2];
    default:
      return undefined;
  }
};
exports.getVerticalGroupCountClass = getVerticalGroupCountClass;
const setOptionHour = (date, optionHour) => {
  const nextDate = new Date(date);
  if (!(0, _type.isDefined)(optionHour)) {
    return nextDate;
  }
  nextDate.setHours(optionHour, optionHour % 1 * 60, 0, 0);
  return nextDate;
};
exports.setOptionHour = setOptionHour;
const calculateDayDuration = (startDayHour, endDayHour) => endDayHour - startDayHour;
exports.calculateDayDuration = calculateDayDuration;
const getStartViewDateTimeOffset = (startViewDate, startDayHour) => {
  const validStartDayHour = Math.floor(startDayHour);
  const isDSTChange = _m_utils_time_zone.default.isTimezoneChangeInDate(startViewDate);
  if (isDSTChange && validStartDayHour !== startViewDate.getHours()) {
    return _date.default.dateToMilliseconds('hour');
  }
  return 0;
};
exports.getStartViewDateTimeOffset = getStartViewDateTimeOffset;
const getValidCellDateForLocalTimeFormat = (date, _ref) => {
  let {
    startViewDate,
    startDayHour,
    cellIndexShift,
    viewOffset
  } = _ref;
  const originDate = _date3.dateUtilsTs.addOffsets(date, [-viewOffset]);
  const localTimeZoneChangedInOriginDate = _m_utils_time_zone.default.isTimezoneChangeInDate(originDate);
  if (!localTimeZoneChangedInOriginDate) {
    return date;
  }
  // NOTE: Shift the startViewDate by two days ahead because
  // we can have viewOffset equals -1/+1 day.
  // This strange method of changing date used here because
  // +2 days from DST date not affected by DST.
  const startViewDateWithoutDST = new Date(new Date(startViewDate).setDate(startViewDate.getDate() + 2));
  const startViewDateOffset = getStartViewDateTimeOffset(startViewDate, startDayHour);
  return _date3.dateUtilsTs.addOffsets(startViewDateWithoutDST, [viewOffset, cellIndexShift, -startViewDateOffset]);
};
exports.getValidCellDateForLocalTimeFormat = getValidCellDateForLocalTimeFormat;
const getTotalCellCountByCompleteData = completeData => completeData[completeData.length - 1].length;
exports.getTotalCellCountByCompleteData = getTotalCellCountByCompleteData;
const getDisplayedCellCount = (displayedCellCount, completeData) => displayedCellCount ?? getTotalCellCountByCompleteData(completeData);
exports.getDisplayedCellCount = getDisplayedCellCount;
const getHeaderCellText = (headerIndex, date, headerCellTextFormat, getDateForHeaderText, additionalOptions) => {
  const validDate = getDateForHeaderText(headerIndex, date, additionalOptions);
  return _date2.default.format(validDate, headerCellTextFormat);
};
exports.getHeaderCellText = getHeaderCellText;
const isVerticalGroupingApplied = (groups, groupOrientation) => groupOrientation === _const.VERTICAL_GROUP_ORIENTATION && !!groups.length;
exports.isVerticalGroupingApplied = isVerticalGroupingApplied;
const getGroupCount = groups => {
  let result = 0;
  for (let i = 0, len = groups.length; i < len; i += 1) {
    if (!i) {
      result = groups[i].items.length;
    } else {
      result *= groups[i].items.length;
    }
  }
  return result;
};
exports.getGroupCount = getGroupCount;
const getHorizontalGroupCount = (groups, groupOrientation) => {
  const groupCount = getGroupCount(groups) || 1;
  const isVerticalGrouping = isVerticalGroupingApplied(groups, groupOrientation);
  return isVerticalGrouping ? 1 : groupCount;
};
exports.getHorizontalGroupCount = getHorizontalGroupCount;
const isTimelineView = viewType => !!_const.TIMELINE_VIEWS[viewType];
exports.isTimelineView = isTimelineView;
const isDateAndTimeView = viewType => viewType !== _m_constants.VIEWS.TIMELINE_MONTH && viewType !== _m_constants.VIEWS.MONTH;
exports.isDateAndTimeView = isDateAndTimeView;
const isHorizontalView = viewType => {
  switch (viewType) {
    case _m_constants.VIEWS.TIMELINE_DAY:
    case _m_constants.VIEWS.TIMELINE_WEEK:
    case _m_constants.VIEWS.TIMELINE_WORK_WEEK:
    case _m_constants.VIEWS.TIMELINE_MONTH:
    case _m_constants.VIEWS.MONTH:
      return true;
    default:
      return false;
  }
};
exports.isHorizontalView = isHorizontalView;
const isDateInRange = (date, startDate, endDate, diff) => diff > 0 ? _date.default.dateInRange(date, startDate, new Date(endDate.getTime() - 1)) : _date.default.dateInRange(date, endDate, startDate, 'date');
exports.isDateInRange = isDateInRange;
const isFirstCellInMonthWithIntervalCount = (cellDate, intervalCount) => cellDate.getDate() === 1 && intervalCount > 1;
exports.isFirstCellInMonthWithIntervalCount = isFirstCellInMonthWithIntervalCount;
const getViewStartByOptions = (startDate, currentDate, intervalDuration, startViewDate) => {
  if (!startDate) {
    return new Date(currentDate);
  }
  let currentStartDate = _date.default.trimTime(startViewDate);
  const diff = currentStartDate.getTime() <= currentDate.getTime() ? 1 : -1;
  let endDate = new Date(currentStartDate.getTime() + intervalDuration * diff);
  while (!isDateInRange(currentDate, currentStartDate, endDate, diff)) {
    currentStartDate = endDate;
    endDate = new Date(currentStartDate.getTime() + intervalDuration * diff);
  }
  return diff > 0 ? currentStartDate : endDate;
};
exports.getViewStartByOptions = getViewStartByOptions;
const calculateIsGroupedAllDayPanel = (groups, groupOrientation, isAllDayPanelVisible) => isVerticalGroupingApplied(groups, groupOrientation) && isAllDayPanelVisible;
exports.calculateIsGroupedAllDayPanel = calculateIsGroupedAllDayPanel;
const calculateViewStartDate = startDateOption => startDateOption;
exports.calculateViewStartDate = calculateViewStartDate;
const getCellDuration = (viewType, startDayHour, endDayHour, hoursInterval) => {
  switch (viewType) {
    case 'month':
      return calculateDayDuration(startDayHour, endDayHour) * 3600000;
    case 'timelineMonth':
      return _date.default.dateToMilliseconds('day');
    default:
      return 3600000 * hoursInterval;
  }
};
exports.getCellDuration = getCellDuration;
const calculateCellIndex = (rowIndex, columnIndex, rowCount) => columnIndex * rowCount + rowIndex;
exports.calculateCellIndex = calculateCellIndex;
const getTotalRowCountByCompleteData = completeData => completeData.length;
exports.getTotalRowCountByCompleteData = getTotalRowCountByCompleteData;
const getDisplayedRowCount = (displayedRowCount, completeData) => displayedRowCount ?? getTotalRowCountByCompleteData(completeData);
exports.getDisplayedRowCount = getDisplayedRowCount;
const getStartViewDateWithoutDST = (startViewDate, startDayHour) => {
  const newStartViewDate = _m_utils_time_zone.default.getDateWithoutTimezoneChange(startViewDate);
  newStartViewDate.setHours(startDayHour);
  return newStartViewDate;
};
exports.getStartViewDateWithoutDST = getStartViewDateWithoutDST;
const getIsGroupedAllDayPanel = (hasAllDayRow, isVerticalGrouping) => hasAllDayRow && isVerticalGrouping;
exports.getIsGroupedAllDayPanel = getIsGroupedAllDayPanel;
const getKeyByGroup = (groupIndex, isVerticalGrouping) => {
  if (isVerticalGrouping && !!groupIndex) {
    return groupIndex.toString();
  }
  return '0';
};
exports.getKeyByGroup = getKeyByGroup;
const getToday = (indicatorTime, timeZoneCalculator) => {
  const todayDate = indicatorTime ?? new Date();
  return (timeZoneCalculator === null || timeZoneCalculator === void 0 ? void 0 : timeZoneCalculator.createDate(todayDate, {
    path: 'toGrid'
  })) || todayDate;
};
exports.getToday = getToday;
const getCalculatedFirstDayOfWeek = firstDayOfWeekOption => (0, _type.isDefined)(firstDayOfWeekOption) ? firstDayOfWeekOption : _date2.default.firstDayOfWeekIndex();
exports.getCalculatedFirstDayOfWeek = getCalculatedFirstDayOfWeek;
const isHorizontalGroupingApplied = (groups, groupOrientation) => groupOrientation === _const.HORIZONTAL_GROUP_ORIENTATION && !!groups.length;
exports.isHorizontalGroupingApplied = isHorizontalGroupingApplied;
const isGroupingByDate = (groups, groupOrientation, groupByDate) => {
  const isHorizontalGrouping = isHorizontalGroupingApplied(groups, groupOrientation);
  return groupByDate && isHorizontalGrouping;
};
exports.isGroupingByDate = isGroupingByDate;
const getSkippedHoursInRange = (startDate, endDate, allDay, viewDataProvider) => {
  const isAllDay = allDay && !viewDataProvider.viewType.includes('timeline');
  let result = 0;
  const currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() + 1);
  currentDate.setHours(0, 0, 0, 0);
  const endDateWithStartHour = new Date(endDate);
  endDateWithStartHour.setHours(0, 0, 0, 0);
  const {
    startDayHour,
    endDayHour
  } = viewDataProvider.getViewOptions();
  const dayHours = isAllDay ? DAY_HOURS : endDayHour - startDayHour;
  while (currentDate < endDateWithStartHour) {
    if (viewDataProvider.isSkippedDate(currentDate)) {
      result += dayHours;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  const startDateHours = startDate.getHours();
  const endDateHours = endDate.getHours() + Math.ceil(endDate.getTime() % HOUR_IN_MS);
  if (viewDataProvider.isSkippedDate(startDate)) {
    if (isAllDay) {
      result += DAY_HOURS;
    } else if (startDateHours < startDayHour) {
      result += dayHours;
    } else if (startDateHours < endDayHour) {
      result += endDayHour - startDateHours;
    }
  }
  if (viewDataProvider.isSkippedDate(endDate)) {
    if (isAllDay) {
      result += DAY_HOURS;
    } else if (endDateHours > endDayHour) {
      result += dayHours;
    } else if (endDateHours > startDayHour) {
      result += endDateHours - startDayHour;
    }
  }
  return result;
};
exports.getSkippedHoursInRange = getSkippedHoursInRange;
const isDataOnWeekend = date => {
  const day = date.getDay();
  return day === SATURDAY_INDEX || day === SUNDAY_INDEX;
};
exports.isDataOnWeekend = isDataOnWeekend;
const getWeekendsCount = days => 2 * Math.floor(days / 7);
exports.getWeekendsCount = getWeekendsCount;
const extendGroupItemsForGroupingByDate = (groupRenderItems, columnCountPerGroup) => [...new Array(columnCountPerGroup)].reduce((currentGroupItems, _, index) => groupRenderItems.map((groupsRow, rowIndex) => {
  const currentRow = currentGroupItems[rowIndex] || [];
  return [...currentRow, ...groupsRow.map((item, columnIndex) => _extends({}, item, {
    key: `${item.key}_group_by_date_${index}`,
    isFirstGroupCell: columnIndex === 0,
    isLastGroupCell: columnIndex === groupsRow.length - 1
  }))];
}), []);
exports.extendGroupItemsForGroupingByDate = extendGroupItemsForGroupingByDate;
const getGroupPanelData = (groups, columnCountPerGroup, groupByDate, baseColSpan) => {
  let repeatCount = 1;
  let groupPanelItems = groups.map(group => {
    const result = [];
    const {
      name: resourceName,
      items,
      data
    } = group;
    for (let iterator = 0; iterator < repeatCount; iterator += 1) {
      result.push(...items.map((_ref2, index) => {
        let {
          id,
          text,
          color
        } = _ref2;
        return {
          id,
          text,
          color,
          key: `${iterator}_${resourceName}_${id}`,
          resourceName,
          data: data === null || data === void 0 ? void 0 : data[index]
        };
      }));
    }
    repeatCount *= items.length;
    return result;
  });
  if (groupByDate) {
    groupPanelItems = extendGroupItemsForGroupingByDate(groupPanelItems, columnCountPerGroup);
  }
  return {
    groupPanelItems,
    baseColSpan
  };
};
exports.getGroupPanelData = getGroupPanelData;
const splitNumber = (value, splitValue) => Array.from({
  length: Math.ceil(value / splitValue)
}, (_, index) => Math.min(value - splitValue * index, splitValue));
exports.splitNumber = splitNumber;