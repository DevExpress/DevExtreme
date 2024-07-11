"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppointmentFilterVirtualStrategy = exports.AppointmentFilterBaseStrategy = void 0;
var _array = require("../../../../core/utils/array");
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _iterator = require("../../../../core/utils/iterator");
var _type = require("../../../../core/utils/type");
var _query = _interopRequireDefault(require("../../../../data/query"));
var _date2 = require("../../../core/utils/date");
var _index = require("../../../scheduler/r1/utils/index");
var _m_appointment_adapter = require("../../m_appointment_adapter");
var _m_recurrence = require("../../m_recurrence");
var _m_utils = require("../../resources/m_utils");
var _m_utils2 = require("./m_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable max-classes-per-file */
// TODO Vinogradov refactoring: this module should be refactored :)
const toMs = _date.default.dateToMilliseconds;
const FilterStrategies = {
  virtual: 'virtual',
  standard: 'standard'
};
class AppointmentFilterBaseStrategy {
  constructor(options) {
    this.options = options;
    this.dataAccessors = this.options.dataAccessors;
    this._init();
  }
  get strategyName() {
    return FilterStrategies.standard;
  }
  get timeZoneCalculator() {
    return this.options.timeZoneCalculator;
  }
  get viewStartDayHour() {
    return this.options.startDayHour;
  }
  get viewEndDayHour() {
    return this.options.endDayHour;
  }
  get timezone() {
    return this.options.timezone;
  }
  get firstDayOfWeek() {
    return this.options.firstDayOfWeek;
  }
  get showAllDayPanel() {
    return this.options.showAllDayPanel;
  }
  get loadedResources() {
    return this._resolveOption('loadedResources');
  }
  get supportAllDayRow() {
    return this._resolveOption('supportAllDayRow');
  }
  get viewType() {
    return this._resolveOption('viewType');
  }
  get viewDirection() {
    return this._resolveOption('viewDirection');
  }
  get dateRange() {
    return this._resolveOption('dateRange');
  }
  get groupCount() {
    return this._resolveOption('groupCount');
  }
  get viewDataProvider() {
    return this._resolveOption('viewDataProvider');
  }
  get allDayPanelMode() {
    return this._resolveOption('allDayPanelMode');
  }
  _resolveOption(name) {
    const result = this.options[name];
    return typeof result === 'function' ? result() : result;
  }
  _init() {
    this.setDataAccessors(this.dataAccessors);
  }
  filter(preparedItems) {
    const [min, max] = this.dateRange;
    const {
      viewOffset
    } = this.options;
    const allDay = !this.showAllDayPanel && this.supportAllDayRow ? false : undefined;
    return this.filterLoadedAppointments({
      startDayHour: this.viewStartDayHour,
      endDayHour: this.viewEndDayHour,
      viewOffset,
      viewStartDayHour: this.viewStartDayHour,
      viewEndDayHour: this.viewEndDayHour,
      min,
      max,
      resources: this.loadedResources,
      allDay,
      supportMultiDayAppointments: (0, _index.isTimelineView)(this.viewType),
      firstDayOfWeek: this.firstDayOfWeek
    }, preparedItems);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasAllDayAppointments(filteredItems, preparedItems) {
    const adapters = filteredItems.map(item => (0, _m_appointment_adapter.createAppointmentAdapter)(item, this.dataAccessors, this.timeZoneCalculator));
    let result = false;
    // @ts-expect-error
    (0, _iterator.each)(adapters, (_, item) => {
      if ((0, _index.getAppointmentTakesAllDay)(item, this.allDayPanelMode)) {
        result = true;
        return false;
      }
    });
    return result;
  }
  setDataAccessors(dataAccessors) {
    this.dataAccessors = dataAccessors;
  }
  _createAllDayAppointmentFilter() {
    return [[appointment => (0, _index.getAppointmentTakesAllDay)(appointment, this.allDayPanelMode)]];
  }
  _createCombinedFilter(filterOptions) {
    const min = new Date(filterOptions.min);
    const max = new Date(filterOptions.max);
    const {
      startDayHour,
      endDayHour,
      viewOffset,
      viewStartDayHour,
      viewEndDayHour,
      resources,
      firstDayOfWeek,
      checkIntersectViewport,
      supportMultiDayAppointments
    } = filterOptions;
    const [trimMin, trimMax] = (0, _index.getDatesWithoutTime)(min, max);
    const useRecurrence = (0, _type.isDefined)(this.dataAccessors.getter.recurrenceRule);
    return [[appointment => {
      const appointmentVisible = appointment.visible ?? true;
      if (!appointmentVisible) {
        return false;
      }
      const {
        allDay: isAllDay,
        hasRecurrenceRule
      } = appointment;
      const startDate = _date2.dateUtilsTs.addOffsets(appointment.startDate, [-viewOffset]);
      const endDate = _date2.dateUtilsTs.addOffsets(appointment.endDate, [-viewOffset]);
      const appointmentTakesAllDay = (0, _index.getAppointmentTakesAllDay)(appointment, this.allDayPanelMode);
      if (!hasRecurrenceRule) {
        if (!(endDate >= trimMin && startDate < trimMax || _date.default.sameDate(endDate, trimMin) && _date.default.sameDate(startDate, trimMin))) {
          return false;
        }
      }
      const appointmentTakesSeveralDays = (0, _m_utils2.getAppointmentTakesSeveralDays)(appointment);
      const isLongAppointment = appointmentTakesSeveralDays || appointmentTakesAllDay;
      if (resources !== null && resources !== void 0 && resources.length && !this._filterAppointmentByResources(appointment.rawAppointment, resources)) {
        return false;
      }
      if (appointmentTakesAllDay && filterOptions.allDay === false) {
        return false;
      }
      if (hasRecurrenceRule) {
        const recurrenceException = (0, _m_utils2.getRecurrenceException)(appointment, this.timeZoneCalculator, this.timezone);
        if (!this._filterAppointmentByRRule(_extends({}, appointment, {
          recurrenceException,
          allDay: appointmentTakesAllDay
        }), min, max, startDayHour, endDayHour, firstDayOfWeek)) {
          return false;
        }
      }
      if (!isAllDay && supportMultiDayAppointments && isLongAppointment) {
        if (endDate < min && (!useRecurrence || useRecurrence && !hasRecurrenceRule)) {
          return false;
        }
      }
      if (!isAllDay && (0, _type.isDefined)(startDayHour) && (!useRecurrence || !filterOptions.isVirtualScrolling)) {
        if (!(0, _m_utils2.compareDateWithStartDayHour)(startDate, endDate, startDayHour, appointmentTakesAllDay, appointmentTakesSeveralDays)) {
          return false;
        }
      }
      if (!isAllDay && (0, _type.isDefined)(endDayHour)) {
        if (!(0, _m_utils2.compareDateWithEndDayHour)({
          startDate,
          endDate,
          startDayHour,
          endDayHour,
          viewOffset,
          viewStartDayHour,
          viewEndDayHour,
          allDay: appointmentTakesAllDay,
          severalDays: appointmentTakesSeveralDays,
          min,
          max,
          checkIntersectViewport
        })) {
          return false;
        }
      }
      if (!isAllDay && (!isLongAppointment || supportMultiDayAppointments)) {
        if (endDate < min && useRecurrence && !hasRecurrenceRule) {
          return false;
        }
      }
      return true;
    }]];
  }
  // TODO get rid of wrapper
  _createAppointmentFilter(filterOptions) {
    return this._createCombinedFilter(filterOptions);
  }
  _filterAppointmentByResources(appointment, resources) {
    const checkAppointmentResourceValues = (resourceName, resourceIndex) => {
      const resourceGetter = this.dataAccessors.resources.getter[resourceName];
      let resource;
      if ((0, _type.isFunction)(resourceGetter)) {
        resource = resourceGetter(appointment);
      }
      const appointmentResourceValues = (0, _array.wrapToArray)(resource);
      const resourceData = (0, _iterator.map)(resources[resourceIndex].items, _ref => {
        let {
          id
        } = _ref;
        return id;
      });
      for (let i = 0; i < appointmentResourceValues.length; i++) {
        if ((0, _index.hasResourceValue)(resourceData, appointmentResourceValues[i])) {
          return true;
        }
      }
      return false;
    };
    let result = false;
    for (let i = 0; i < resources.length; i++) {
      const resourceName = resources[i].name;
      result = checkAppointmentResourceValues(resourceName, i);
      if (!result) {
        return false;
      }
    }
    return result;
  }
  _filterAppointmentByRRule(appointment, min, max, startDayHour, endDayHour, firstDayOfWeek) {
    const {
      recurrenceRule
    } = appointment;
    const {
      recurrenceException
    } = appointment;
    const {
      allDay
    } = appointment;
    let result = true;
    const appointmentStartDate = appointment.startDate;
    const appointmentEndDate = appointment.endDate;
    const recurrenceProcessor = (0, _m_recurrence.getRecurrenceProcessor)();
    if (allDay || (0, _m_utils2._appointmentPartInInterval)(appointmentStartDate, appointmentEndDate, startDayHour, endDayHour)) {
      const [trimMin, trimMax] = (0, _index.getDatesWithoutTime)(min, max);
      min = trimMin;
      max = new Date(trimMax.getTime() - toMs('minute'));
    }
    if (recurrenceRule && !recurrenceProcessor.isValidRecurrenceRule(recurrenceRule)) {
      result = appointmentEndDate > min && appointmentStartDate <= max;
    }
    if (result && recurrenceProcessor.isValidRecurrenceRule(recurrenceRule)) {
      const {
        viewOffset
      } = this.options;
      result = recurrenceProcessor.hasRecurrence({
        rule: recurrenceRule,
        exception: recurrenceException,
        start: appointmentStartDate,
        end: appointmentEndDate,
        min: _date2.dateUtilsTs.addOffsets(min, [viewOffset]),
        max: _date2.dateUtilsTs.addOffsets(max, [viewOffset]),
        firstDayOfWeek,
        appointmentTimezoneOffset: this.timeZoneCalculator.getOriginStartDateOffsetInMs(appointmentStartDate, appointment.startDateTimeZone, false)
      });
    }
    return result;
  }
  filterLoadedAppointments(filterOptions, preparedItems) {
    const filteredItems = this.filterPreparedItems(filterOptions, preparedItems);
    return filteredItems.map(_ref2 => {
      let {
        rawAppointment
      } = _ref2;
      return rawAppointment;
    });
  }
  filterPreparedItems(filterOptions, preparedItems) {
    const combinedFilter = this._createAppointmentFilter(filterOptions);
    return (0, _query.default)(preparedItems).filter(combinedFilter).toArray();
  }
  filterAllDayAppointments(preparedItems) {
    const combinedFilter = this._createAllDayAppointmentFilter();
    return (0, _query.default)(preparedItems).filter(combinedFilter).toArray().map(_ref3 => {
      let {
        rawAppointment
      } = _ref3;
      return rawAppointment;
    });
  }
}
exports.AppointmentFilterBaseStrategy = AppointmentFilterBaseStrategy;
class AppointmentFilterVirtualStrategy extends AppointmentFilterBaseStrategy {
  get strategyName() {
    return FilterStrategies.virtual;
  }
  get resources() {
    return this.options.resources;
  }
  filter(preparedItems) {
    const {
      viewOffset
    } = this.options;
    const hourMs = toMs('hour');
    const isCalculateStartAndEndDayHour = (0, _index.isDateAndTimeView)(this.viewType);
    const checkIntersectViewport = isCalculateStartAndEndDayHour && this.viewDirection === 'horizontal';
    const isAllDayWorkspace = !this.supportAllDayRow;
    const showAllDayAppointments = this.showAllDayPanel || isAllDayWorkspace;
    const endViewDate = this.viewDataProvider.getLastViewDateByEndDayHour(this.viewEndDayHour);
    const shiftedEndViewDate = _date2.dateUtilsTs.addOffsets(endViewDate, [viewOffset]);
    const filterOptions = [];
    const groupsInfo = this.viewDataProvider.getCompletedGroupsInfo();
    groupsInfo.forEach(item => {
      const {
        groupIndex
      } = item;
      const groupStartDate = item.startDate;
      const groupEndDate = new Date(Math.min(item.endDate.getTime(), shiftedEndViewDate.getTime()));
      const startDayHour = isCalculateStartAndEndDayHour ? groupStartDate.getHours() : this.viewStartDayHour;
      const endDayHour = isCalculateStartAndEndDayHour ? startDayHour + groupStartDate.getMinutes() / 60 + (groupEndDate.getTime() - groupStartDate.getTime()) / hourMs : this.viewEndDayHour;
      const resources = this._getPrerenderFilterResources(groupIndex);
      const hasAllDayPanel = this.viewDataProvider.hasGroupAllDayPanel(groupIndex);
      const supportAllDayAppointment = isAllDayWorkspace || !!showAllDayAppointments && hasAllDayPanel;
      filterOptions.push({
        isVirtualScrolling: true,
        startDayHour,
        endDayHour,
        viewOffset,
        viewStartDayHour: this.viewStartDayHour,
        viewEndDayHour: this.viewEndDayHour,
        min: _date2.dateUtilsTs.addOffsets(groupStartDate, [-viewOffset]),
        max: _date2.dateUtilsTs.addOffsets(groupEndDate, [-viewOffset]),
        supportMultiDayAppointments: (0, _index.isTimelineView)(this.viewType),
        allDay: supportAllDayAppointment,
        resources,
        firstDayOfWeek: this.firstDayOfWeek,
        checkIntersectViewport
      });
    });
    return this.filterLoadedAppointments({
      filterOptions,
      groupCount: this.groupCount
    }, preparedItems);
  }
  filterPreparedItems(_ref4, preparedItems) {
    let {
      filterOptions,
      groupCount
    } = _ref4;
    const combinedFilters = [];
    let itemsToFilter = preparedItems;
    const needPreFilter = groupCount > 0;
    if (needPreFilter) {
      // @ts-expect-error
      itemsToFilter = itemsToFilter.filter(_ref5 => {
        let {
          rawAppointment
        } = _ref5;
        for (let i = 0; i < filterOptions.length; ++i) {
          const {
            resources
          } = filterOptions[i];
          if (this._filterAppointmentByResources(rawAppointment, resources)) {
            return true;
          }
        }
      });
    }
    filterOptions.forEach(option => {
      combinedFilters.length && combinedFilters.push('or');
      const filter = this._createAppointmentFilter(option);
      combinedFilters.push(filter);
    });
    return (0, _query.default)(itemsToFilter).filter(combinedFilters).toArray();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasAllDayAppointments(filteredItems, preparedItems) {
    return this.filterAllDayAppointments(preparedItems).length > 0;
  }
  _getPrerenderFilterResources(groupIndex) {
    const cellGroup = this.viewDataProvider.getCellsGroup(groupIndex);
    return (0, _m_utils.getResourcesDataByGroups)(this.loadedResources, this.resources, [cellGroup]);
  }
}
exports.AppointmentFilterVirtualStrategy = AppointmentFilterVirtualStrategy;