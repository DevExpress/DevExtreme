"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateGeneratorVirtualStrategy = exports.DateGeneratorBaseStrategy = exports.AppointmentSettingsGenerator = void 0;
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _extend = require("../../../core/utils/extend");
var _type = require("../../../core/utils/type");
var _date2 = require("../../core/utils/date");
var _index = require("../../scheduler/r1/utils/index");
var _m_appointment_adapter = require("../m_appointment_adapter");
var _m_expression_utils = require("../m_expression_utils");
var _m_recurrence = require("../m_recurrence");
var _m_utils_time_zone = _interopRequireDefault(require("../m_utils_time_zone"));
var _m_utils = require("../resources/m_utils");
var _m_cell_position_calculator = require("./m_cell_position_calculator");
var _m_text_utils = require("./m_text_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable max-classes-per-file */
const toMs = _date.default.dateToMilliseconds;
const APPOINTMENT_DATE_TEXT_FORMAT = 'TIME';
// TODO: Vinogradov types refactoring.
class DateGeneratorBaseStrategy {
  constructor(options) {
    this.options = options;
  }
  // TODO Vinogradov: Remove these getters.
  get rawAppointment() {
    return this.options.rawAppointment;
  }
  get timeZoneCalculator() {
    return this.options.timeZoneCalculator;
  }
  get viewDataProvider() {
    return this.options.viewDataProvider;
  }
  get appointmentTakesAllDay() {
    return this.options.appointmentTakesAllDay;
  }
  get supportAllDayRow() {
    return this.options.supportAllDayRow;
  }
  get isAllDayRowAppointment() {
    return this.options.isAllDayRowAppointment;
  }
  get timeZone() {
    return this.options.timeZone;
  }
  get dateRange() {
    return this.options.dateRange;
  }
  get firstDayOfWeek() {
    return this.options.firstDayOfWeek;
  }
  get viewStartDayHour() {
    return this.options.viewStartDayHour;
  }
  get viewEndDayHour() {
    return this.options.viewEndDayHour;
  }
  get endViewDate() {
    return this.options.endViewDate;
  }
  get viewType() {
    return this.options.viewType;
  }
  get isGroupedByDate() {
    return this.options.isGroupedByDate;
  }
  get isVerticalOrientation() {
    return this.options.isVerticalGroupOrientation;
  }
  get dataAccessors() {
    return this.options.dataAccessors;
  }
  get loadedResources() {
    return this.options.loadedResources;
  }
  get isDateAppointment() {
    return !(0, _index.isDateAndTimeView)(this.viewType) && this.appointmentTakesAllDay;
  }
  getIntervalDuration() {
    return this.appointmentTakesAllDay ? this.options.allDayIntervalDuration : this.options.intervalDuration;
  }
  generate(appointmentAdapter) {
    const {
      isRecurrent
    } = appointmentAdapter;
    const itemGroupIndices = this._getGroupIndices(this.rawAppointment);
    let appointmentList = this._createAppointments(appointmentAdapter, itemGroupIndices);
    appointmentList = this._getProcessedByAppointmentTimeZone(appointmentList, appointmentAdapter); // T983264
    if (this._canProcessNotNativeTimezoneDates(appointmentAdapter)) {
      appointmentList = this._getProcessedNotNativeTimezoneDates(appointmentList, appointmentAdapter);
    }
    let dateSettings = this._createGridAppointmentList(appointmentList, appointmentAdapter);
    const firstViewDates = this._getAppointmentsFirstViewDate(dateSettings);
    dateSettings = this._fillNormalizedStartDate(dateSettings, firstViewDates);
    dateSettings = this._cropAppointmentsByStartDayHour(dateSettings, firstViewDates);
    dateSettings = this._fillNormalizedEndDate(dateSettings, this.rawAppointment);
    if (this._needSeparateLongParts()) {
      dateSettings = this._separateLongParts(dateSettings, appointmentAdapter);
    }
    dateSettings = this.shiftSourceAppointmentDates(dateSettings);
    return {
      dateSettings,
      itemGroupIndices,
      isRecurrent
    };
  }
  shiftSourceAppointmentDates(dateSettings) {
    const {
      viewOffset
    } = this.options;
    return dateSettings.map(item => _extends({}, item, {
      source: _extends({}, item.source, {
        startDate: _date2.dateUtilsTs.addOffsets(item.source.startDate, [viewOffset]),
        endDate: _date2.dateUtilsTs.addOffsets(item.source.endDate, [viewOffset])
      })
    }));
  }
  _getProcessedByAppointmentTimeZone(appointmentList, appointment) {
    const hasAppointmentTimeZone = !(0, _type.isEmptyObject)(appointment.startDateTimeZone) || !(0, _type.isEmptyObject)(appointment.endDateTimeZone);
    if (hasAppointmentTimeZone) {
      const appointmentOffsets = {
        startDate: this.timeZoneCalculator.getOffsets(appointment.startDate, appointment.startDateTimeZone),
        endDate: this.timeZoneCalculator.getOffsets(appointment.endDate, appointment.endDateTimeZone)
      };
      appointmentList.forEach(a => {
        const sourceOffsets = {
          startDate: this.timeZoneCalculator.getOffsets(a.startDate, appointment.startDateTimeZone),
          endDate: this.timeZoneCalculator.getOffsets(a.endDate, appointment.endDateTimeZone)
        };
        const startDateOffsetDiff = appointmentOffsets.startDate.appointment - sourceOffsets.startDate.appointment;
        const endDateOffsetDiff = appointmentOffsets.endDate.appointment - sourceOffsets.endDate.appointment;
        if (sourceOffsets.startDate.appointment !== sourceOffsets.startDate.common) {
          a.startDate = new Date(a.startDate.getTime() + startDateOffsetDiff * toMs('hour'));
        }
        if (sourceOffsets.endDate.appointment !== sourceOffsets.endDate.common) {
          a.endDate = new Date(a.endDate.getTime() + endDateOffsetDiff * toMs('hour'));
        }
      });
    }
    return appointmentList;
  }
  _createAppointments(appointment, groupIndices) {
    let appointments = this._createRecurrenceAppointments(appointment, groupIndices);
    if (!appointment.isRecurrent && appointments.length === 0) {
      appointments.push({
        startDate: appointment.startDate,
        endDate: appointment.endDate
      });
    }
    // T817857
    appointments = appointments.map(item => {
      var _item$endDate;
      const resultEndTime = (_item$endDate = item.endDate) === null || _item$endDate === void 0 ? void 0 : _item$endDate.getTime();
      if (item.startDate.getTime() === resultEndTime) {
        item.endDate.setTime(resultEndTime + toMs('minute'));
      }
      return _extends({}, item, {
        exceptionDate: new Date(item.startDate)
      });
    });
    return appointments;
  }
  _canProcessNotNativeTimezoneDates(appointment) {
    const isTimeZoneSet = !(0, _type.isEmptyObject)(this.timeZone);
    if (!isTimeZoneSet) {
      return false;
    }
    if (!appointment.isRecurrent) {
      return false;
    }
    return !_m_utils_time_zone.default.isEqualLocalTimeZone(this.timeZone, appointment.startDate);
  }
  _getProcessedNotNativeDateIfCrossDST(date, offset) {
    if (offset < 0) {
      // summer time
      const newDate = new Date(date);
      const newDateMinusOneHour = new Date(newDate);
      newDateMinusOneHour.setHours(newDateMinusOneHour.getHours() - 1);
      const newDateOffset = this.timeZoneCalculator.getOffsets(newDate).common;
      const newDateMinusOneHourOffset = this.timeZoneCalculator.getOffsets(newDateMinusOneHour).common;
      if (newDateOffset !== newDateMinusOneHourOffset) {
        return 0;
      }
    }
    return offset;
  }
  _getCommonOffset(date) {
    return this.timeZoneCalculator.getOffsets(date).common;
  }
  _getProcessedNotNativeTimezoneDates(appointmentList, appointment) {
    return appointmentList.map(item => {
      let diffStartDateOffset = this._getCommonOffset(appointment.startDate) - this._getCommonOffset(item.startDate);
      let diffEndDateOffset = this._getCommonOffset(appointment.endDate) - this._getCommonOffset(item.endDate);
      if (diffStartDateOffset === 0 && diffEndDateOffset === 0) {
        return item;
      }
      diffStartDateOffset = this._getProcessedNotNativeDateIfCrossDST(item.startDate, diffStartDateOffset);
      diffEndDateOffset = this._getProcessedNotNativeDateIfCrossDST(item.endDate, diffEndDateOffset);
      const newStartDate = new Date(item.startDate.getTime() + diffStartDateOffset * toMs('hour'));
      let newEndDate = new Date(item.endDate.getTime() + diffEndDateOffset * toMs('hour'));
      const testNewStartDate = this.timeZoneCalculator.createDate(newStartDate, {
        path: 'toGrid'
      });
      const testNewEndDate = this.timeZoneCalculator.createDate(newEndDate, {
        path: 'toGrid'
      });
      if (appointment.duration > testNewEndDate.getTime() - testNewStartDate.getTime()) {
        newEndDate = new Date(newStartDate.getTime() + appointment.duration);
      }
      return _extends({}, item, {
        startDate: newStartDate,
        endDate: newEndDate,
        exceptionDate: new Date(newStartDate)
      });
    });
  }
  _needSeparateLongParts() {
    return this.isVerticalOrientation ? this.isGroupedByDate : this.isGroupedByDate && this.appointmentTakesAllDay;
  }
  normalizeEndDateByViewEnd(rawAppointment, endDate) {
    let result = new Date(endDate.getTime());
    const isAllDay = (0, _index.isDateAndTimeView)(this.viewType) && this.appointmentTakesAllDay;
    if (!isAllDay) {
      const roundedEndViewDate = _date.default.roundToHour(this.endViewDate);
      if (result > roundedEndViewDate) {
        result = roundedEndViewDate;
      }
    }
    const endDayHour = this.viewEndDayHour;
    const allDay = _m_expression_utils.ExpressionUtils.getField(this.dataAccessors, 'allDay', rawAppointment);
    const currentViewEndTime = new Date(new Date(endDate.getTime()).setHours(endDayHour, 0, 0, 0));
    if (result.getTime() > currentViewEndTime.getTime() || allDay && result.getHours() < endDayHour) {
      result = currentViewEndTime;
    }
    return result;
  }
  _fillNormalizedEndDate(dateSettings, rawAppointment) {
    return dateSettings.map(item => _extends({}, item, {
      normalizedEndDate: this.normalizeEndDateByViewEnd(rawAppointment, item.endDate)
    }));
  }
  _separateLongParts(gridAppointmentList, appointmentAdapter) {
    let result = [];
    gridAppointmentList.forEach(gridAppointment => {
      const maxDate = new Date(this.dateRange[1]);
      const {
        startDate,
        normalizedEndDate: endDateOfPart
      } = gridAppointment;
      const longStartDateParts = _date.default.getDatesOfInterval(startDate, endDateOfPart, {
        milliseconds: this.getIntervalDuration()
      });
      const list = longStartDateParts.filter(startDatePart => new Date(startDatePart) < maxDate).map(date => {
        const endDate = new Date(new Date(date).setMilliseconds(appointmentAdapter.duration));
        const normalizedEndDate = this.normalizeEndDateByViewEnd(this.rawAppointment, endDate);
        return {
          startDate: date,
          endDate,
          normalizedEndDate,
          source: gridAppointment.source
        };
      });
      result = result.concat(list);
    });
    return result;
  }
  _createGridAppointmentList(appointmentList, appointmentAdapter) {
    return appointmentList.map(source => {
      const offsetDifference = appointmentAdapter.startDate.getTimezoneOffset() - source.startDate.getTimezoneOffset();
      if (offsetDifference !== 0 && this._canProcessNotNativeTimezoneDates(appointmentAdapter)) {
        source.startDate = _date2.dateUtilsTs.addOffsets(source.startDate, [offsetDifference * toMs('minute')]);
        source.endDate = _date2.dateUtilsTs.addOffsets(source.endDate, [offsetDifference * toMs('minute')]);
        source.exceptionDate = new Date(source.startDate);
      }
      const duration = source.endDate.getTime() - source.startDate.getTime();
      const startDate = this.timeZoneCalculator.createDate(source.startDate, {
        path: 'toGrid'
      });
      const endDate = _date2.dateUtilsTs.addOffsets(startDate, [duration]);
      return {
        startDate,
        endDate,
        allDay: appointmentAdapter.allDay || false,
        source // TODO
      };
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _createExtremeRecurrenceDates(groupIndex) {
    let startViewDate = this.appointmentTakesAllDay ? _date.default.trimTime(this.dateRange[0]) : this.dateRange[0];
    let endViewDateByEndDayHour = this.dateRange[1];
    if (this.timeZone) {
      startViewDate = this.timeZoneCalculator.createDate(startViewDate, {
        path: 'fromGrid'
      });
      endViewDateByEndDayHour = this.timeZoneCalculator.createDate(endViewDateByEndDayHour, {
        path: 'fromGrid'
      });
      const daylightOffset = _m_utils_time_zone.default.getDaylightOffsetInMs(startViewDate, endViewDateByEndDayHour);
      if (daylightOffset) {
        endViewDateByEndDayHour = new Date(endViewDateByEndDayHour.getTime() + daylightOffset);
      }
    }
    return [startViewDate, endViewDateByEndDayHour];
  }
  _createRecurrenceOptions(appointment, groupIndex) {
    const {
      viewOffset
    } = this.options;
    // NOTE: For creating a recurrent appointments,
    // we should use original appointment's dates (without view offset).
    const originalAppointmentStartDate = _date2.dateUtilsTs.addOffsets(appointment.startDate, [viewOffset]);
    const originalAppointmentEndDate = _date2.dateUtilsTs.addOffsets(appointment.endDate, [viewOffset]);
    const [minRecurrenceDate, maxRecurrenceDate] = this._createExtremeRecurrenceDates(groupIndex);
    const shiftedMinRecurrenceDate = _date2.dateUtilsTs.addOffsets(minRecurrenceDate, [viewOffset]);
    const shiftedMaxRecurrenceDate = _date2.dateUtilsTs.addOffsets(maxRecurrenceDate, [viewOffset]);
    return {
      rule: appointment.recurrenceRule,
      exception: appointment.recurrenceException,
      min: shiftedMinRecurrenceDate,
      max: shiftedMaxRecurrenceDate,
      firstDayOfWeek: this.firstDayOfWeek,
      start: originalAppointmentStartDate,
      end: originalAppointmentEndDate,
      appointmentTimezoneOffset: this.timeZoneCalculator.getOriginStartDateOffsetInMs(originalAppointmentStartDate, appointment.rawAppointment.startDateTimeZone, true),
      getPostProcessedException: date => {
        if ((0, _type.isEmptyObject)(this.timeZone) || _m_utils_time_zone.default.isEqualLocalTimeZone(this.timeZone, date)) {
          return date;
        }
        const appointmentOffset = this.timeZoneCalculator.getOffsets(originalAppointmentStartDate).common;
        const exceptionAppointmentOffset = this.timeZoneCalculator.getOffsets(date).common;
        let diff = appointmentOffset - exceptionAppointmentOffset;
        diff = this._getProcessedNotNativeDateIfCrossDST(date, diff);
        return new Date(date.getTime() - diff * _date.default.dateToMilliseconds('hour'));
      }
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _createRecurrenceAppointments(appointment, groupIndices) {
    const {
      duration
    } = appointment;
    const {
      viewOffset
    } = this.options;
    const option = this._createRecurrenceOptions(appointment);
    const generatedStartDates = (0, _m_recurrence.getRecurrenceProcessor)().generateDates(option);
    return generatedStartDates.map(date => {
      const utcDate = _m_utils_time_zone.default.createUTCDateWithLocalOffset(date);
      utcDate.setTime(utcDate.getTime() + duration);
      const endDate = _m_utils_time_zone.default.createDateFromUTCWithLocalOffset(utcDate);
      return {
        startDate: new Date(date),
        endDate
      };
    })
    // NOTE: For the next calculations,
    // we should shift recurrence appointments by view offset.
    .map(_ref => {
      let {
        startDate,
        endDate
      } = _ref;
      return {
        startDate: _date2.dateUtilsTs.addOffsets(startDate, [-viewOffset]),
        endDate: _date2.dateUtilsTs.addOffsets(endDate, [-viewOffset])
      };
    });
  }
  _getAppointmentsFirstViewDate(appointments) {
    const {
      viewOffset
    } = this.options;
    return appointments.map(appointment => {
      const tableFirstDate = this._getAppointmentFirstViewDate(_extends({}, appointment, {
        startDate: _date2.dateUtilsTs.addOffsets(appointment.startDate, [viewOffset]),
        endDate: _date2.dateUtilsTs.addOffsets(appointment.endDate, [viewOffset])
      }));
      if (!tableFirstDate) {
        return appointment.startDate;
      }
      const firstDate = _date2.dateUtilsTs.addOffsets(tableFirstDate, [-viewOffset]);
      return firstDate > appointment.startDate ? firstDate : appointment.startDate;
    });
  }
  _fillNormalizedStartDate(appointments, firstViewDates,
  // TODO Vinogradov: Check this unused argument.
  rawAppointment) {
    return appointments.map((item, idx) => _extends({}, item, {
      startDate: this._getAppointmentResultDate({
        appointment: item,
        rawAppointment,
        startDate: new Date(item.startDate),
        startDayHour: this.viewStartDayHour,
        firstViewDate: firstViewDates[idx]
      })
    }));
  }
  _cropAppointmentsByStartDayHour(appointments, firstViewDates) {
    return appointments.filter((appointment, idx) => {
      if (!firstViewDates[idx]) {
        return false;
      }
      if (this.appointmentTakesAllDay) {
        return true;
      }
      return appointment.endDate > appointment.startDate;
    });
  }
  _getAppointmentResultDate(options) {
    const {
      appointment,
      startDayHour,
      firstViewDate
    } = options;
    let {
      startDate
    } = options;
    let resultDate;
    if (this.appointmentTakesAllDay) {
      resultDate = _date.default.normalizeDate(startDate, firstViewDate);
    } else {
      if (startDate < firstViewDate) {
        startDate = firstViewDate;
      }
      resultDate = _date.default.normalizeDate(appointment.startDate, startDate);
    }
    return !this.isDateAppointment ? _date.default.roundDateByStartDayHour(resultDate, startDayHour) : resultDate;
  }
  _getAppointmentFirstViewDate(appointment) {
    const groupIndex = appointment.source.groupIndex || 0;
    const {
      startDate,
      endDate
    } = appointment;
    if (this.isAllDayRowAppointment || appointment.allDay) {
      return this.viewDataProvider.findAllDayGroupCellStartDate(groupIndex);
    }
    return this.viewDataProvider.findGroupCellStartDate(groupIndex, startDate, endDate, this.isDateAppointment);
  }
  _getGroupIndices(rawAppointment) {
    let result = [];
    if (rawAppointment && this.loadedResources.length) {
      const tree = (0, _m_utils.createResourcesTree)(this.loadedResources);
      result = (0, _m_utils.getResourceTreeLeaves)((field, action) => (0, _m_utils.getDataAccessors)(this.options.dataAccessors.resources, field, action), tree, rawAppointment);
    }
    return result;
  }
}
exports.DateGeneratorBaseStrategy = DateGeneratorBaseStrategy;
class DateGeneratorVirtualStrategy extends DateGeneratorBaseStrategy {
  get groupCount() {
    return (0, _index.getGroupCount)(this.loadedResources);
  }
  _createRecurrenceAppointments(appointment, groupIndices) {
    const {
      duration
    } = appointment;
    const result = [];
    const validGroupIndices = this.groupCount ? groupIndices : [0];
    validGroupIndices.forEach(groupIndex => {
      const option = this._createRecurrenceOptions(appointment, groupIndex);
      const generatedStartDates = (0, _m_recurrence.getRecurrenceProcessor)().generateDates(option);
      const recurrentInfo = generatedStartDates.map(date => {
        const startDate = new Date(date);
        const utcDate = _m_utils_time_zone.default.createUTCDateWithLocalOffset(date);
        utcDate.setTime(utcDate.getTime() + duration);
        const endDate = _m_utils_time_zone.default.createDateFromUTCWithLocalOffset(utcDate);
        return {
          startDate,
          endDate,
          groupIndex
        };
      });
      result.push(...recurrentInfo);
    });
    return result;
  }
  _updateGroupIndices(appointments, groupIndices) {
    const result = [];
    groupIndices.forEach(groupIndex => {
      const groupStartDate = this.viewDataProvider.getGroupStartDate(groupIndex);
      if (groupStartDate) {
        appointments.forEach(appointment => {
          const appointmentCopy = (0, _extend.extend)({}, appointment);
          appointmentCopy.groupIndex = groupIndex;
          result.push(appointmentCopy);
        });
      }
    });
    return result;
  }
  _getGroupIndices(resources) {
    var _groupIndices;
    let groupIndices = super._getGroupIndices(resources);
    const viewDataGroupIndices = this.viewDataProvider.getGroupIndices();
    if (!((_groupIndices = groupIndices) !== null && _groupIndices !== void 0 && _groupIndices.length)) {
      groupIndices = [0];
    }
    return groupIndices.filter(groupIndex => viewDataGroupIndices.indexOf(groupIndex) !== -1);
  }
  _createAppointments(appointment, groupIndices) {
    const appointments = super._createAppointments(appointment, groupIndices);
    return !appointment.isRecurrent ? this._updateGroupIndices(appointments, groupIndices) : appointments;
  }
}
// TODO rename to AppointmentInfoGenerator or AppointmentViewModel after refactoring geometry calculation strategies
exports.DateGeneratorVirtualStrategy = DateGeneratorVirtualStrategy;
class AppointmentSettingsGenerator {
  constructor(options) {
    this.options = options;
    this.appointmentAdapter = (0, _m_appointment_adapter.createAppointmentAdapter)(this.rawAppointment, this.dataAccessors, this.timeZoneCalculator);
  }
  get rawAppointment() {
    return this.options.rawAppointment;
  }
  get dataAccessors() {
    return this.options.dataAccessors;
  }
  get timeZoneCalculator() {
    return this.options.timeZoneCalculator;
  }
  get isAllDayRowAppointment() {
    return this.options.appointmentTakesAllDay && this.options.supportAllDayRow;
  }
  get groups() {
    return this.options.groups;
  }
  get dateSettingsStrategy() {
    const options = _extends({}, this.options, {
      isAllDayRowAppointment: this.isAllDayRowAppointment
    });
    return this.options.isVirtualScrolling ? new DateGeneratorVirtualStrategy(options) : new DateGeneratorBaseStrategy(options);
  }
  create() {
    const {
      dateSettings,
      itemGroupIndices,
      isRecurrent
    } = this._generateDateSettings();
    const cellPositions = this._calculateCellPositions(dateSettings, itemGroupIndices);
    const result = this._prepareAppointmentInfos(dateSettings, cellPositions, isRecurrent);
    return result;
  }
  _generateDateSettings() {
    return this.dateSettingsStrategy.generate(this.appointmentAdapter);
  }
  _calculateCellPositions(dateSettings, itemGroupIndices) {
    const cellPositionCalculator = new _m_cell_position_calculator.CellPositionCalculator(_extends({}, this.options, {
      dateSettings
    }));
    return cellPositionCalculator.calculateCellPositions(itemGroupIndices, this.isAllDayRowAppointment, this.appointmentAdapter.isRecurrent);
  }
  _prepareAppointmentInfos(dateSettings, cellPositions, isRecurrent) {
    const infos = [];
    cellPositions.forEach(_ref2 => {
      let {
        coordinates,
        dateSettingIndex
      } = _ref2;
      const dateSetting = dateSettings[dateSettingIndex];
      const dateText = this._getAppointmentDateText(dateSetting);
      const info = {
        appointment: dateSetting,
        sourceAppointment: dateSetting.source,
        dateText,
        isRecurrent
      };
      infos.push(_extends({}, coordinates, {
        info
      }));
    });
    return infos;
  }
  _getAppointmentDateText(sourceAppointment) {
    const {
      startDate,
      endDate,
      allDay
    } = sourceAppointment;
    return (0, _m_text_utils.createFormattedDateText)({
      startDate,
      endDate,
      allDay,
      format: APPOINTMENT_DATE_TEXT_FORMAT
    });
  }
}
exports.AppointmentSettingsGenerator = AppointmentSettingsGenerator;