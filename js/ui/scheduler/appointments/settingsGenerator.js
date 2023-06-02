import dateUtils from '../../../core/utils/date';
import { isEmptyObject } from '../../../core/utils/type';
import { extend } from '../../../core/utils/extend';
import { getRecurrenceProcessor } from '../recurrence';
import timeZoneUtils from '../utils.timeZone';
import { createResourcesTree, getDataAccessors, getGroupCount, getResourceTreeLeaves } from '../resources/utils';
import { createAppointmentAdapter } from '../appointmentAdapter';
import { CellPositionCalculator } from './cellPositionCalculator';
import { ExpressionUtils } from '../expressionUtils';
import { isDateAndTimeView } from '../../../renovation/ui/scheduler/view_model/to_test/views/utils/base';
import { createFormattedDateText } from './textUtils';

const toMs = dateUtils.dateToMilliseconds;
const APPOINTMENT_DATE_TEXT_FORMAT = 'TIME';

export class DateGeneratorBaseStrategy {
    constructor(options) {
        this.options = options;
    }

    get rawAppointment() { return this.options.rawAppointment; }
    get timeZoneCalculator() { return this.options.timeZoneCalculator; }
    get viewDataProvider() { return this.options.viewDataProvider; }
    get appointmentTakesAllDay() { return this.options.appointmentTakesAllDay; }
    get supportAllDayRow() { return this.options.supportAllDayRow; }
    get isAllDayRowAppointment() { return this.options.isAllDayRowAppointment; }
    get timeZone() { return this.options.timeZone; }
    get dateRange() { return this.options.dateRange; }
    get firstDayOfWeek() { return this.options.firstDayOfWeek; }
    get viewStartDayHour() { return this.options.viewStartDayHour; }
    get viewEndDayHour() { return this.options.viewEndDayHour; }
    get endViewDate() { return this.options.endViewDate; }
    get viewType() { return this.options.viewType; }
    get isGroupedByDate() { return this.options.isGroupedByDate; }
    get isVerticalOrientation() { return this.options.isVerticalGroupOrientation; }
    get dataAccessors() { return this.options.dataAccessors; }

    get loadedResources() { return this.options.loadedResources; }

    get isDateAppointment() { return !isDateAndTimeView(this.viewType) && this.appointmentTakesAllDay; }

    getIntervalDuration() {
        return this.appointmentTakesAllDay
            ? this.options.allDayIntervalDuration
            : this.options.intervalDuration;
    }

    generate(appointmentAdapter) {
        const itemGroupIndices = this._getGroupIndices(this.rawAppointment);

        let appointmentList = this._createAppointments(appointmentAdapter, itemGroupIndices);

        appointmentList = this._getProcessedByAppointmentTimeZone(appointmentList, appointmentAdapter); // T983264

        if(this._canProcessNotNativeTimezoneDates(appointmentAdapter)) {
            appointmentList = this._getProcessedNotNativeTimezoneDates(appointmentList, appointmentAdapter);
        }

        let dateSettings = this._createGridAppointmentList(appointmentList, appointmentAdapter);

        const firstViewDates = this._getAppointmentsFirstViewDate(dateSettings);
        this._fillNormalizedStartDate(dateSettings, firstViewDates);

        dateSettings = this._cropAppointmentsByStartDayHour(dateSettings, firstViewDates, this.rawAppointment);
        dateSettings = this._fillNormalizedEndDate(dateSettings, this.rawAppointment);

        if(this._needSeparateLongParts()) {
            dateSettings = this._separateLongParts(dateSettings, appointmentAdapter);
        }

        const { isRecurrent } = appointmentAdapter;

        return {
            dateSettings,
            itemGroupIndices,
            isRecurrent
        };
    }

    _getProcessedByAppointmentTimeZone(appointmentList, appointment) {
        const hasAppointmentTimeZone = !isEmptyObject(appointment.startDateTimeZone) || !isEmptyObject(appointment.endDateTimeZone);

        if(hasAppointmentTimeZone) {
            const appointmentOffsets = {
                startDate: this.timeZoneCalculator.getOffsets(appointment.startDate, appointment.startDateTimeZone),
                endDate: this.timeZoneCalculator.getOffsets(appointment.endDate, appointment.endDateTimeZone),
            };

            appointmentList.forEach(a => {
                const sourceOffsets = {
                    startDate: this.timeZoneCalculator.getOffsets(a.startDate, appointment.startDateTimeZone),
                    endDate: this.timeZoneCalculator.getOffsets(a.endDate, appointment.endDateTimeZone),
                };

                const startDateOffsetDiff = appointmentOffsets.startDate.appointment - sourceOffsets.startDate.appointment;
                const endDateOffsetDiff = appointmentOffsets.endDate.appointment - sourceOffsets.endDate.appointment;

                if(sourceOffsets.startDate.appointment !== sourceOffsets.startDate.common) {
                    a.startDate = new Date(a.startDate.getTime() + startDateOffsetDiff * toMs('hour'));
                }
                if(sourceOffsets.endDate.appointment !== sourceOffsets.endDate.common) {
                    a.endDate = new Date(a.endDate.getTime() + endDateOffsetDiff * toMs('hour'));
                }
            });
        }

        return appointmentList;
    }

    _createAppointments(appointment, groupIndices) {
        let appointments = this._createRecurrenceAppointments(appointment, groupIndices);

        if(!appointment.isRecurrent && appointments.length === 0) {
            appointments.push({
                startDate: appointment.startDate,
                endDate: appointment.endDate,
            });
        }

        // T817857
        appointments = appointments.map(item => {
            const resultEndTime = item.endDate?.getTime();

            if(item.startDate.getTime() === resultEndTime) {
                item.endDate.setTime(resultEndTime + toMs('minute'));
            }

            return {
                ...item,
                exceptionDate: new Date(item.startDate)
            };
        });

        return appointments;
    }

    _canProcessNotNativeTimezoneDates(appointment) {
        const isTimeZoneSet = !isEmptyObject(this.timeZone);

        if(!isTimeZoneSet) {
            return false;
        }

        if(!appointment.isRecurrent) {
            return false;
        }

        return !timeZoneUtils.isEqualLocalTimeZone(this.timeZone, appointment.startDate);
    }

    _getProcessedNotNativeDateIfCrossDST(date, offset) {
        if(offset < 0) { // summer time
            const newDate = new Date(date);

            const newDateMinusOneHour = new Date(newDate);
            newDateMinusOneHour.setHours(newDateMinusOneHour.getHours() - 1);

            const newDateOffset = this.timeZoneCalculator.getOffsets(newDate).common;
            const newDateMinusOneHourOffset = this.timeZoneCalculator.getOffsets(newDateMinusOneHour).common;

            if(newDateOffset !== newDateMinusOneHourOffset) {
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

            if(diffStartDateOffset === 0 && diffEndDateOffset === 0) {
                return item;
            }

            diffStartDateOffset = this._getProcessedNotNativeDateIfCrossDST(item.startDate, diffStartDateOffset);
            diffEndDateOffset = this._getProcessedNotNativeDateIfCrossDST(item.endDate, diffEndDateOffset);

            const newStartDate = new Date(item.startDate.getTime() + diffStartDateOffset * toMs('hour'));
            let newEndDate = new Date(item.endDate.getTime() + diffEndDateOffset * toMs('hour'));

            const testNewStartDate = this.timeZoneCalculator.createDate(newStartDate, { path: 'toGrid' });
            const testNewEndDate = this.timeZoneCalculator.createDate(newEndDate, { path: 'toGrid' });

            if(appointment.duration > testNewEndDate.getTime() - testNewStartDate.getTime()) {
                newEndDate = new Date(newStartDate.getTime() + appointment.duration);
            }

            return {
                ...item,
                startDate: newStartDate,
                endDate: newEndDate,
                exceptionDate: new Date(newStartDate)
            };
        });
    }

    _needSeparateLongParts() {
        return this.isVerticalOrientation
            ? this.isGroupedByDate
            : this.isGroupedByDate && this.appointmentTakesAllDay;
    }

    normalizeEndDateByViewEnd(rawAppointment, endDate) {
        let result = new Date(endDate.getTime());
        const isAllDay = isDateAndTimeView(this.viewType) && this.appointmentTakesAllDay;

        if(!isAllDay) {
            const roundedEndViewDate = dateUtils.roundToHour(this.endViewDate);

            if(result > roundedEndViewDate) {
                result = roundedEndViewDate;
            }
        }

        const endDayHour = this.viewEndDayHour;
        const allDay = ExpressionUtils.getField(this.dataAccessors, 'allDay', rawAppointment);
        const currentViewEndTime = new Date(new Date(endDate.getTime()).setHours(endDayHour, 0, 0, 0));

        if(result.getTime() > currentViewEndTime.getTime() || (allDay && result.getHours() < endDayHour)) {
            result = currentViewEndTime;
        }

        return result;
    }

    _fillNormalizedEndDate(dateSettings, rawAppointment) {
        return dateSettings.map((item) => {
            const { endDate } = item;

            const normalizedEndDate = this.normalizeEndDateByViewEnd(rawAppointment, endDate);

            return {
                ...item,
                normalizedEndDate
            };
        });
    }

    _separateLongParts(gridAppointmentList, appointmentAdapter) {
        let result = [];

        gridAppointmentList.forEach((gridAppointment) => {
            const maxDate = new Date(this.dateRange[1]);
            const { normalizedEndDate: endDateOfPart } = gridAppointment;

            const longStartDateParts = dateUtils.getDatesOfInterval(
                gridAppointment.startDate,
                endDateOfPart,
                {
                    milliseconds: this.getIntervalDuration(this.appointmentTakesAllDay)
                }
            );

            const list = longStartDateParts
                .filter((startDatePart) => new Date(startDatePart) < maxDate)
                .map((date) => {
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

            if(offsetDifference !== 0 && this._canProcessNotNativeTimezoneDates(appointmentAdapter)) {
                source.startDate = new Date(source.startDate.getTime() + offsetDifference * toMs('minute'));
                source.endDate = new Date(source.endDate.getTime() + offsetDifference * toMs('minute'));
                source.exceptionDate = new Date(source.startDate);
            }

            const startDate = this.timeZoneCalculator.createDate(source.startDate, { path: 'toGrid' });
            const endDate = this.timeZoneCalculator.createDate(source.endDate, { path: 'toGrid' });

            return {
                startDate,
                endDate,
                allDay: appointmentAdapter.allDay || false,
                source // TODO
            };
        });
    }

    _createExtremeRecurrenceDates() {
        let startViewDate = this.appointmentTakesAllDay
            ? dateUtils.trimTime(this.dateRange[0])
            : this.dateRange[0];
        let endViewDateByEndDayHour = this.dateRange[1];

        if(this.timeZone) {
            startViewDate = this.timeZoneCalculator.createDate(startViewDate, { path: 'fromGrid' });
            endViewDateByEndDayHour = this.timeZoneCalculator.createDate(endViewDateByEndDayHour, { path: 'fromGrid' });

            const daylightOffset = timeZoneUtils.getDaylightOffsetInMs(startViewDate, endViewDateByEndDayHour);
            if(daylightOffset) {
                endViewDateByEndDayHour = new Date(endViewDateByEndDayHour.getTime() + daylightOffset);
            }
        }

        return [
            startViewDate,
            endViewDateByEndDayHour
        ];
    }

    _createRecurrenceOptions(appointment, groupIndex) {
        const [
            minRecurrenceDate,
            maxRecurrenceDate
        ] = this._createExtremeRecurrenceDates(groupIndex);

        return {
            rule: appointment.recurrenceRule,
            exception: appointment.recurrenceException,
            min: minRecurrenceDate,
            max: maxRecurrenceDate,
            firstDayOfWeek: this.firstDayOfWeek,

            start: appointment.startDate,
            end: appointment.endDate,
            appointmentTimezoneOffset: this.timeZoneCalculator.getOriginStartDateOffsetInMs(
                appointment.startDate,
                appointment.rawAppointment.startDateTimeZone,
                true,
            ),

            getPostProcessedException: date => {
                if(isEmptyObject(this.timeZone) || timeZoneUtils.isEqualLocalTimeZone(this.timeZone, date)) {
                    return date;
                }

                const appointmentOffset = this.timeZoneCalculator.getOffsets(appointment.startDate).common;
                const exceptionAppointmentOffset = this.timeZoneCalculator.getOffsets(date).common;

                let diff = appointmentOffset - exceptionAppointmentOffset;
                diff = this._getProcessedNotNativeDateIfCrossDST(date, diff);

                return new Date(date.getTime() - diff * dateUtils.dateToMilliseconds('hour'));
            }
        };
    }

    _createRecurrenceAppointments(appointment, groupIndices) {
        const { duration } = appointment;
        const option = this._createRecurrenceOptions(appointment);
        const generatedStartDates = getRecurrenceProcessor().generateDates(option);

        return generatedStartDates.map(date => {
            const utcDate = timeZoneUtils.createUTCDateWithLocalOffset(date);
            utcDate.setTime(utcDate.getTime() + duration);
            const endDate = timeZoneUtils.createDateFromUTCWithLocalOffset(utcDate);

            return {
                startDate: new Date(date),
                endDate: endDate
            };
        });
    }

    _getAppointmentsFirstViewDate(appointments) {
        return appointments.map((appointment) => this._getAppointmentFirstViewDate(appointment));
    }

    _fillNormalizedStartDate(
        appointments,
        firstViewDates,
        rawAppointment,
    ) {
        appointments.forEach((appointment, idx) => {
            appointment.startDate = this._getAppointmentResultDate({
                appointment,
                rawAppointment,
                startDate: new Date(appointment.startDate),
                startDayHour: this.viewStartDayHour,
                firstViewDate: firstViewDates[idx],
            });
        });
    }

    _cropAppointmentsByStartDayHour(appointments, firstViewDates) {
        return appointments.filter((appointment, idx) => {
            if(!firstViewDates[idx]) {
                return false;
            } else if(this.appointmentTakesAllDay) {
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
        let { startDate } = options;
        let resultDate;

        if(this.appointmentTakesAllDay) {
            resultDate = dateUtils.normalizeDate(startDate, firstViewDate);
        } else {
            if(startDate < firstViewDate) {
                startDate = firstViewDate;
            }

            resultDate = dateUtils.normalizeDate(appointment.startDate, startDate);
        }

        return !this.isDateAppointment
            ? dateUtils.roundDateByStartDayHour(resultDate, startDayHour)
            : resultDate;
    }

    _getAppointmentFirstViewDate(appointment) {
        const groupIndex = appointment.source.groupIndex || 0;
        const {
            startDate,
            endDate
        } = appointment;

        if(this.isAllDayRowAppointment || appointment.allDay) {
            return this.viewDataProvider.findAllDayGroupCellStartDate(groupIndex, startDate);
        }

        return this.viewDataProvider.findGroupCellStartDate(
            groupIndex,
            startDate,
            endDate,
            this.isDateAppointment
        );
    }

    _getGroupIndices(rawAppointment) {
        let result = [];
        if(rawAppointment && this.loadedResources.length) {
            const tree = createResourcesTree(this.loadedResources);

            result = getResourceTreeLeaves(
                (field, action) => getDataAccessors(this.options.dataAccessors.resources, field, action),
                tree,
                rawAppointment
            );
        }

        return result;
    }
}

export class DateGeneratorVirtualStrategy extends DateGeneratorBaseStrategy {
    get groupCount() { return getGroupCount(this.loadedResources); }

    _createRecurrenceAppointments(appointment, groupIndices) {
        const { duration } = appointment;
        const result = [];
        const validGroupIndices = this.groupCount
            ? groupIndices
            : [0];

        validGroupIndices.forEach(groupIndex => {
            const option = this._createRecurrenceOptions(appointment, groupIndex);
            const generatedStartDates = getRecurrenceProcessor().generateDates(option);
            const recurrentInfo = generatedStartDates
                .map(date => {
                    const startDate = new Date(date);
                    const utcDate = timeZoneUtils.createUTCDateWithLocalOffset(date);
                    utcDate.setTime(utcDate.getTime() + duration);
                    const endDate = timeZoneUtils.createDateFromUTCWithLocalOffset(utcDate);

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
            if(groupStartDate) {
                appointments.forEach(appointment => {
                    const appointmentCopy = extend({}, appointment);
                    appointmentCopy.groupIndex = groupIndex;

                    result.push(appointmentCopy);
                });
            }
        });

        return result;
    }

    _getGroupIndices(resources) {
        let groupIndices = super._getGroupIndices(resources);
        const viewDataGroupIndices = this.viewDataProvider.getGroupIndices();

        if(!groupIndices?.length) {
            groupIndices = [0];
        }

        return groupIndices.filter(
            groupIndex => viewDataGroupIndices.indexOf(groupIndex) !== -1
        );
    }

    _createAppointments(appointment, groupIndices) {
        const appointments = super._createAppointments(appointment, groupIndices);

        return !appointment.isRecurrent
            ? this._updateGroupIndices(appointments, groupIndices)
            : appointments;
    }
}

// TODO rename to AppointmentInfoGenerator or AppointmentViewModel after refactoring geometry calculation strategies
export class AppointmentSettingsGenerator {
    constructor(options) {
        this.options = options;
        this.appointmentAdapter = createAppointmentAdapter(
            this.rawAppointment,
            this.dataAccessors,
            this.timeZoneCalculator
        );
    }

    get rawAppointment() { return this.options.rawAppointment; }
    get dataAccessors() { return this.options.dataAccessors; }
    get timeZoneCalculator() { return this.options.timeZoneCalculator; }
    get isAllDayRowAppointment() { return this.options.appointmentTakesAllDay && this.options.supportAllDayRow; }
    get groups() { return this.options.groups; }
    get dateSettingsStrategy() {
        const options = {
            ...this.options,
            isAllDayRowAppointment: this.isAllDayRowAppointment
        };

        return this.options.isVirtualScrolling
            ? new DateGeneratorVirtualStrategy(options)
            : new DateGeneratorBaseStrategy(options);
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
        const cellPositionCalculator = new CellPositionCalculator({
            ...this.options,
            dateSettings
        });

        return cellPositionCalculator.calculateCellPositions(
            itemGroupIndices,
            this.isAllDayRowAppointment,
            this.appointmentAdapter.isRecurrent
        );
    }

    _prepareAppointmentInfos(dateSettings, cellPositions, isRecurrent) {
        const infos = [];

        cellPositions.forEach(({ coordinates, dateSettingIndex }) => {
            const dateSetting = dateSettings[dateSettingIndex];
            const dateText = this._getAppointmentDateText(dateSetting);

            const info = {
                appointment: dateSetting,
                sourceAppointment: dateSetting.source,
                dateText,
                isRecurrent,
            };

            infos.push({
                ...coordinates,
                info
            });
        });

        return infos;
    }
    _getAppointmentDateText(sourceAppointment) {
        const { startDate, endDate, allDay } = sourceAppointment;
        return createFormattedDateText({
            startDate,
            endDate,
            allDay,
            format: APPOINTMENT_DATE_TEXT_FORMAT
        });
    }
}
