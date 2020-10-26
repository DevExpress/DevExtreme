import dateUtils from '../../core/utils/date';
import { isEmptyObject } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { getRecurrenceProcessor } from './recurrence';
import timeZoneUtils from './utils.timeZone.js';

const toMs = dateUtils.dateToMilliseconds;

export class AppointmentSettingsGenerator {
    constructor(scheduler) {
        this.scheduler = scheduler;

        this.settingsStrategy = this.scheduler.isVirtualScrolling()
            ? new AppointmentSettingsGeneratorVirtualStrategy(this.scheduler)
            : new AppointmentSettingsGeneratorBaseStrategy(this.scheduler);
    }

    create(rawAppointment) {
        return this.settingsStrategy.create(rawAppointment);
    }
}

export class AppointmentSettingsGeneratorBaseStrategy {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }

    get timeZoneCalculator() {
        return this.scheduler.timeZoneCalculator;
    }

    create(rawAppointment) {
        const { scheduler } = this;
        const appointment = scheduler.createAppointmentAdapter(rawAppointment);
        const itemResources = scheduler._resourcesManager.getResourcesFromItem(rawAppointment);

        let appointmentList = this._createAppointments(appointment, itemResources);

        if(this._canProcessNotNativeTimezoneDates(appointmentList, appointment)) {
            appointmentList = this._getProcessedNotNativeTimezoneDates(appointmentList, appointment);
        }

        let gridAppointmentList = this._createGridAppointmentList(appointmentList);
        this._cropAppointmentsByStartDayHour(gridAppointmentList, rawAppointment);

        gridAppointmentList = this._getProcessedLongAppointmentsIfRequired(gridAppointmentList, appointment);

        return this._createAppointmentInfos(gridAppointmentList, itemResources, this._isAllDayAppointment(rawAppointment));
    }

    _isAllDayAppointment(rawAppointment) {
        const scheduler = this.scheduler;

        return scheduler.appointmentTakesAllDay(rawAppointment) && scheduler._workSpace.supportAllDayRow();
    }

    _createAppointments(appointment, resources) {
        const appointmentList = this._createRecurrenceAppointments(appointment, resources);

        if(appointmentList.length === 0) {
            appointmentList.push({
                startDate: appointment.startDate,
                endDate: appointment.endDate
            });
        }

        return appointmentList;
    }

    _canProcessNotNativeTimezoneDates(appointmentList, appointment) {
        const timeZoneName = this.scheduler.option('timeZone');
        const { isEqualLocalTimeZone, hasDSTInLocalTimeZone } = timeZoneUtils;

        const isRecurrence = appointmentList.length > 1;
        const isTimeZoneSet = !isEmptyObject(timeZoneName);
        const isAppointmentTimeZoneSet = !isEmptyObject(appointment.startDateTimeZone);

        if(!isRecurrence) {
            return false;
        }

        if(!isTimeZoneSet && hasDSTInLocalTimeZone()) {
            return false;
        }

        return isTimeZoneSet &&
            !isAppointmentTimeZoneSet &&
            !isEqualLocalTimeZone(timeZoneName);
    }

    _getProcessedNotNativeDateIfCrossDST(date, dateRangeOffset) {
        const newDate = new Date(date);

        const newDateMinusOneHour = new Date(newDate);
        newDateMinusOneHour.setHours(newDateMinusOneHour.getHours() - 1);

        const newDateOffset = this.timeZoneCalculator.getOffsets(newDate).common;
        const newDateMinusOneHourOffset = this.timeZoneCalculator.getOffsets(newDateMinusOneHour).common;

        if(newDateOffset !== newDateMinusOneHourOffset) {
            return 0;
        }

        return dateRangeOffset;
    }

    _getProcessedNotNativeTimezoneDates(appointmentList, appointment) {
        const startDateRange = appointmentList[0].startDate;
        const endDateRange = appointmentList[appointmentList.length - 1].endDate;

        const startDateRangeOffset = this.timeZoneCalculator.getOffsets(startDateRange).common;
        const endDateRangeOffset = this.timeZoneCalculator.getOffsets(endDateRange).common;

        const isChangeOffsetInRange = startDateRangeOffset !== endDateRangeOffset;

        if(isChangeOffsetInRange) {
            return appointmentList.map(a => {
                let diffStartDateOffset = this.timeZoneCalculator.getOffsets(appointment.startDate).common - this.timeZoneCalculator.getOffsets(a.startDate).common;
                let diffEndDateOffset = this.timeZoneCalculator.getOffsets(appointment.endDate).common - this.timeZoneCalculator.getOffsets(a.endDate).common;

                if(diffStartDateOffset < 0) { // summer time
                    diffStartDateOffset = this._getProcessedNotNativeDateIfCrossDST(a.startDate, diffStartDateOffset);
                    diffEndDateOffset = this._getProcessedNotNativeDateIfCrossDST(a.endDate, diffEndDateOffset);
                }

                const newStartDate = new Date(a.startDate.getTime() + diffStartDateOffset * toMs('hour'));
                let newEndDate = new Date(a.endDate.getTime() + diffEndDateOffset * toMs('hour'));

                const testNewStartDate = this.timeZoneCalculator.createDate(newStartDate, { path: 'toGrid' });
                const testNewEndDate = this.timeZoneCalculator.createDate(newEndDate, { path: 'toGrid' });

                if(appointment.duration > testNewEndDate.getTime() - testNewStartDate.getTime()) {
                    newEndDate = new Date(newStartDate.getTime() + appointment.duration);
                }

                return {
                    startDate: newStartDate,
                    endDate: newEndDate
                };
            });
        }

        return appointmentList;
    }

    _getProcessedLongAppointmentsIfRequired(gridAppointmentList, appointment) {
        const rawAppointment = appointment.source();

        const allDay = this.scheduler.appointmentTakesAllDay(rawAppointment);
        const dateRange = this.scheduler._workSpace.getDateRange();
        const renderingStrategy = this.scheduler.getLayoutManager().getRenderingStrategyInstance();

        if(renderingStrategy.needSeparateAppointment(allDay)) {
            let longStartDateParts = [];
            let resultDates = [];

            gridAppointmentList.forEach(gridAppointment => {
                const maxDate = new Date(dateRange[1]);
                const endDateOfPart = renderingStrategy.normalizeEndDateByViewEnd(rawAppointment, gridAppointment.endDate);

                longStartDateParts = dateUtils.getDatesOfInterval(gridAppointment.startDate, endDateOfPart, {
                    milliseconds: this.scheduler.getWorkSpace().getIntervalDuration(allDay)
                });

                const list = longStartDateParts.filter(startDatePart => new Date(startDatePart) < maxDate)
                    .map(date => {
                        return {
                            startDate: date,
                            endDate: new Date(new Date(date).setMilliseconds(appointment.duration)),
                            source: gridAppointment.source
                        };
                    });

                resultDates = resultDates.concat(list);
            });

            gridAppointmentList = resultDates;
        }

        return gridAppointmentList;
    }

    _createGridAppointmentList(appointmentList) {
        return appointmentList.map(source => {
            const startDate = this.timeZoneCalculator.createDate(source.startDate, { path: 'toGrid' });
            const endDate = this.timeZoneCalculator.createDate(source.endDate, { path: 'toGrid' });

            return {
                startDate,
                endDate,
                source // TODO
            };
        });
    }

    _createExtremeRecurrenceDates(rawAppointment, groupIndex) {
        const dateRange = this._getGroupDateRange(groupIndex);

        const startViewDate = this.scheduler.appointmentTakesAllDay(rawAppointment)
            ? dateUtils.trimTime(dateRange[0])
            : dateRange[0];
        const commonTimeZone = this.scheduler.option('timeZone');

        const minRecurrenceDate = commonTimeZone ?
            this.timeZoneCalculator.createDate(startViewDate, { path: 'fromGrid' }) :
            startViewDate;

        const maxRecurrenceDate = commonTimeZone ?
            this.timeZoneCalculator.createDate(dateRange[1], { path: 'fromGrid' }) :
            dateRange[1];

        return [
            minRecurrenceDate,
            maxRecurrenceDate
        ];
    }
    _getGroupDateRange(groupIndex) {
        return this.scheduler._workSpace.getDateRange();
    }

    _createRecurrenceOptions(appointment, groupIndex) {
        const [
            minRecurrenceDate,
            maxRecurrenceDate
        ] = this._createExtremeRecurrenceDates(appointment.source(), groupIndex);

        return {
            rule: appointment.recurrenceRule,
            exception: appointment.recurrenceException,
            min: minRecurrenceDate,
            max: maxRecurrenceDate,
            firstDayOfWeek: this.scheduler.getFirstDayOfWeek(),

            start: appointment.startDate,
            end: appointment.endDate,
        };
    }

    _createRecurrenceAppointments(appointment, resources) {
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

    _getGroupIndices(resources) {
        const workspace = this.scheduler._workSpace;
        return workspace._getGroupIndexes(resources);
    }

    _cropAppointmentsByStartDayHour(appointments, rawAppointment) {
        return appointments.map(appointment => {
            const startDate = new Date(appointment.startDate);
            const firstViewDate = this._getAppointmentFirstViewDate(appointment, rawAppointment);
            const startDayHour = this._getViewStartDayHour(firstViewDate);

            appointment.startDate = this._getAppointmentResultDate({
                appointment,
                rawAppointment,
                startDate,
                startDayHour,
                firstViewDate
            });

            return appointment;
        });
    }
    _getAppointmentFirstViewDate() {
        return this.scheduler.getStartViewDate();
    }
    _getViewStartDayHour() {
        return this.scheduler._getCurrentViewOption('startDayHour');
    }
    _getAppointmentResultDate(options) {
        const {
            appointment,
            rawAppointment,
            startDayHour,
            firstViewDate
        } = options;
        let { startDate } = options;
        let resultDate = new Date(appointment.startDate);

        if(this.scheduler.appointmentTakesAllDay(rawAppointment)) {
            resultDate = dateUtils.normalizeDate(startDate, firstViewDate);
        } else {
            if(startDate < firstViewDate) {
                startDate = firstViewDate;
            }

            resultDate = dateUtils.normalizeDate(appointment.startDate, startDate);
        }


        return dateUtils.roundDateByStartDayHour(resultDate, startDayHour);
    }

    _createAppointmentInfos(gridAppointments, appointmentResources, allDay) {
        let result = [];

        for(let i = 0; i < gridAppointments.length; i++) {
            const coordinates = this.scheduler._workSpace.getCoordinatesByDateInGroup(
                gridAppointments[i].startDate,
                appointmentResources,
                allDay
            );

            coordinates.forEach(coordinate => {
                extend(coordinate, {
                    info: {
                        appointment: gridAppointments[i],
                        sourceAppointment: gridAppointments[i].source
                    }
                });
            });

            result = result.concat(coordinates);
        }
        return result;
    }
}

export class AppointmentSettingsGeneratorVirtualStrategy extends AppointmentSettingsGeneratorBaseStrategy {
    _createRecurrenceAppointments(appointment, resources) {
        const { duration } = appointment;
        const result = [];
        const workspace = this.scheduler._workSpace;
        const groupIndices = workspace._getGroupCount()
            ? this._getGroupIndices(resources)
            : [0];

        groupIndices.forEach(groupIndex => {
            const option = this._createRecurrenceOptions(appointment, groupIndex);
            const generatedStartDates = getRecurrenceProcessor().generateDates(option);
            const dates = generatedStartDates.map(date => {
                const utcDate = timeZoneUtils.createUTCDateWithLocalOffset(date);
                utcDate.setTime(utcDate.getTime() + duration);
                const endDate = timeZoneUtils.createDateFromUTCWithLocalOffset(utcDate);

                return {
                    startDate: new Date(date),
                    endDate: endDate
                };
            });

            result.push(...dates);
        });

        return result;
    }

    _getViewStartDayHour(firstViewDate) {
        return firstViewDate.getHours();
    }

    _getAppointmentFirstViewDate(appointment, rawAppointment) {
        const { viewDataProvider } = this.scheduler.getWorkSpace();
        const { groupIndex } = appointment.source;
        const {
            startDate,
            endDate
        } = appointment;

        const allDay = this._isAllDayAppointment(rawAppointment);

        return viewDataProvider.findGroupCellStartDate(groupIndex, startDate, endDate, allDay);
    }

    _getGroupDateRange(groupIndex) {
        const { viewDataProvider } = this.scheduler.getWorkSpace();
        const startDate = viewDataProvider.getGroupStartDate(groupIndex);
        const groupEndDate = viewDataProvider.getGroupEndDate(groupIndex);
        const endDate = new Date(groupEndDate.getTime() - 1);

        return [
            startDate,
            endDate
        ];
    }

    _updateGroupIndices(appointments, itemResources) {
        const workspace = this.scheduler.getWorkSpace();
        const groupIndices = workspace._isVerticalGroupedWorkSpace()
            ? workspace._getGroupIndexes(itemResources)
            : [0];

        groupIndices.forEach(groupIndex => {
            appointments.forEach(appointment => appointment.groupIndex = groupIndex);
        });
    }

    _getGroupIndices(resources) {
        const groupIndices = super._getGroupIndices(resources);
        const { viewDataProvider } = this.scheduler.getWorkSpace();
        const viewDataGroupIndices = viewDataProvider.getGroupIndices();

        const result = groupIndices.filter(
            groupIndex => viewDataGroupIndices.indexOf(groupIndex) !== -1
        );

        return result;
    }

    _createAppointments(appointment, resources) {
        const result = super._createAppointments(appointment, resources);

        this._updateGroupIndices(result, resources);

        return result;
    }
}
