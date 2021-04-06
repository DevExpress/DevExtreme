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

    get workspace() { return this.scheduler.getWorkSpace(); }
    get viewDataProvider() { return this.workspace.viewDataProvider; }

    create(rawAppointment) {
        const { scheduler } = this;
        const appointment = scheduler.createAppointmentAdapter(rawAppointment);
        const itemResources = scheduler._resourcesManager.getResourcesFromItem(rawAppointment);
        const isAllDay = this._isAllDayAppointment(rawAppointment);

        let appointmentList = this._createAppointments(appointment, itemResources);

        appointmentList = this._getProcessedByAppointmentTimeZone(appointmentList, appointment); // T983264

        if(this._canProcessNotNativeTimezoneDates(appointment)) {
            appointmentList = this._getProcessedNotNativeTimezoneDates(appointmentList, appointment);
        }

        let gridAppointmentList = this._createGridAppointmentList(appointmentList, appointment);

        gridAppointmentList = this._cropAppointmentsByStartDayHour(gridAppointmentList, rawAppointment, isAllDay);

        gridAppointmentList = this._getProcessedLongAppointmentsIfRequired(gridAppointmentList, appointment);

        const appointmentInfos = this._createAppointmentInfos(
            gridAppointmentList,
            itemResources,
            isAllDay,
            appointment.isRecurrent
        );

        return appointmentInfos;
    }

    _getProcessedByAppointmentTimeZone(appointmentList, appointment) {
        const hasAppointmentTimeZone = !isEmptyObject(appointment.startDateTimeZone) || !isEmptyObject(appointment.endDateTimeZone);

        if(appointmentList.length > 1 && hasAppointmentTimeZone) {
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

                if(startDateOffsetDiff !== 0) {
                    a.startDate = new Date(a.startDate.getTime() + startDateOffsetDiff * toMs('hour'));
                }
                if(endDateOffsetDiff !== 0) {
                    a.endDate = new Date(a.endDate.getTime() + endDateOffsetDiff * toMs('hour'));
                }
            });
        }

        return appointmentList;
    }

    _isAllDayAppointment(rawAppointment) {
        return this.scheduler.appointmentTakesAllDay(rawAppointment) && this.workspace.supportAllDayRow();
    }

    _createAppointments(appointment, resources) {
        let appointments = this._createRecurrenceAppointments(appointment, resources);

        if(!appointment.isRecurrent && appointments.length === 0) {
            appointments.push({
                startDate: appointment.startDate,
                endDate: appointment.endDate
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
        const timeZoneName = this.scheduler.option('timeZone');
        const isTimeZoneSet = !isEmptyObject(timeZoneName);

        if(!isTimeZoneSet) {
            return false;
        }

        if(!appointment.isRecurrent) {
            return false;
        }

        return !timeZoneUtils.isEqualLocalTimeZone(timeZoneName, appointment.startDate);
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

    _getProcessedNotNativeTimezoneDates(appointmentList, appointment) {
        const startDateRange = appointment.startDate;
        const endDateRange = appointmentList[appointmentList.length - 1].endDate;

        const startDateRangeOffset = this.timeZoneCalculator.getOffsets(startDateRange).common;
        const endDateRangeOffset = this.timeZoneCalculator.getOffsets(endDateRange).common;

        const isChangeOffsetInRange = startDateRangeOffset !== endDateRangeOffset;

        if(isChangeOffsetInRange) {
            return appointmentList.map(a => {
                let diffStartDateOffset = this.timeZoneCalculator.getOffsets(appointment.startDate).common - this.timeZoneCalculator.getOffsets(a.startDate).common;
                let diffEndDateOffset = this.timeZoneCalculator.getOffsets(appointment.endDate).common - this.timeZoneCalculator.getOffsets(a.endDate).common;

                diffStartDateOffset = this._getProcessedNotNativeDateIfCrossDST(a.startDate, diffStartDateOffset);
                diffEndDateOffset = this._getProcessedNotNativeDateIfCrossDST(a.endDate, diffEndDateOffset);

                const newStartDate = new Date(a.startDate.getTime() + diffStartDateOffset * toMs('hour'));
                let newEndDate = new Date(a.endDate.getTime() + diffEndDateOffset * toMs('hour'));

                const testNewStartDate = this.timeZoneCalculator.createDate(newStartDate, { path: 'toGrid' });
                const testNewEndDate = this.timeZoneCalculator.createDate(newEndDate, { path: 'toGrid' });

                if(appointment.duration > testNewEndDate.getTime() - testNewStartDate.getTime()) {
                    newEndDate = new Date(newStartDate.getTime() + appointment.duration);
                }

                return {
                    startDate: newStartDate,
                    endDate: newEndDate,
                    exceptionDate: new Date(newStartDate)
                };
            });
        }

        return appointmentList;
    }

    _getProcessedLongAppointmentsIfRequired(gridAppointmentList, appointment) {
        const rawAppointment = appointment.source();

        const allDay = this.scheduler.appointmentTakesAllDay(rawAppointment);
        const dateRange = this.workspace.getDateRange();
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

    _createGridAppointmentList(appointmentList, appointment) {
        return appointmentList.map(source => {
            const offsetDifference = appointment.startDate.getTimezoneOffset() - source.startDate.getTimezoneOffset();

            if(offsetDifference !== 0 && this._canProcessNotNativeTimezoneDates(appointment)) {
                source.startDate = new Date(source.startDate.getTime() + offsetDifference * toMs('minute'));
                source.endDate = new Date(source.endDate.getTime() + offsetDifference * toMs('minute'));
                source.exceptionDate = new Date(source.startDate);
            }

            const startDate = this.timeZoneCalculator.createDate(source.startDate, { path: 'toGrid' });
            const endDate = this.timeZoneCalculator.createDate(source.endDate, { path: 'toGrid' });

            return {
                startDate,
                endDate,
                source // TODO
            };
        });
    }

    _createExtremeRecurrenceDates(rawAppointment) {
        const dateRange = this.workspace.getDateRange();
        let startViewDate = this.scheduler.appointmentTakesAllDay(rawAppointment)
            ? dateUtils.trimTime(dateRange[0])
            : dateRange[0];
        let endViewDate = dateRange[1];

        const commonTimeZone = this.scheduler.option('timeZone');
        if(commonTimeZone) {
            startViewDate = this.timeZoneCalculator.createDate(startViewDate, { path: 'fromGrid' });
            endViewDate = this.timeZoneCalculator.createDate(endViewDate, { path: 'fromGrid' });

            const daylightOffset = timeZoneUtils.getDaylightOffsetInMs(startViewDate, endViewDate);
            if(daylightOffset) {
                endViewDate = new Date(endViewDate.getTime() + daylightOffset);
            }
        }

        return [
            startViewDate,
            endViewDate
        ];
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

            getPostProcessedException: date => {
                const timeZoneName = this.scheduler.option('timeZone');
                if(isEmptyObject(timeZoneName) || timeZoneUtils.isEqualLocalTimeZone(timeZoneName, date)) {
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

    _cropAppointmentsByStartDayHour(appointments, rawAppointment, isAllDay) {
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

    _createAppointmentInfos(gridAppointments, resources, allDay, recurrent) {
        let result = [];

        for(let i = 0; i < gridAppointments.length; i++) {
            const coordinates = this.scheduler._workSpace.getCoordinatesByDateInGroup(
                gridAppointments[i].startDate,
                resources,
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
    get viewDataProvider() { return this.workspace.viewDataProvider; }
    get isVerticalGrouping() { return this.workspace._isVerticalGroupedWorkSpace(); }

    _createAppointmentInfos(gridAppointments, resources, allDay, recurrent) {
        const appointments = allDay
            ? gridAppointments
            : gridAppointments.filter(item => {
                const { source, startDate, endDate } = item;
                const { groupIndex } = source;

                return this.viewDataProvider.isGroupIntersectDateInterval(groupIndex, startDate, endDate);
            });

        if(recurrent && this.isVerticalGrouping) {
            return this._createRecurrentAppointmentInfos(appointments, resources, allDay);
        }

        return super._createAppointmentInfos(appointments, resources, allDay, recurrent);
    }

    _createRecurrentAppointmentInfos(gridAppointments, resources, allDay) {
        const result = [];

        gridAppointments.forEach(appointment => {
            const { source } = appointment;
            const { groupIndex } = source;

            const coordinate = this.workspace.getCoordinatesByDate(
                appointment.startDate,
                groupIndex,
                allDay
            );

            if(coordinate) {
                extend(coordinate, {
                    info: {
                        appointment,
                        sourceAppointment: source
                    }
                });

                result.push(coordinate);
            }
        });

        return result;
    }

    _cropAppointmentsByStartDayHour(appointments, rawAppointment, isAllDay) {
        return appointments.filter(appointment => {
            const firstViewDate = this._getAppointmentFirstViewDate(appointment, rawAppointment);

            if(!firstViewDate) return false;

            const startDayHour = this._getViewStartDayHour(firstViewDate);
            const startDate = new Date(appointment.startDate);

            appointment.startDate = this._getAppointmentResultDate({
                appointment,
                rawAppointment,
                startDate,
                startDayHour,
                firstViewDate
            });

            return !isAllDay
                ? appointment.endDate > appointment.startDate
                : true;
        });
    }

    _createRecurrenceAppointments(appointment, resources) {
        const { duration } = appointment;
        const result = [];
        const groupIndices = this.isVerticalGrouping && this.workspace._getGroupCount()
            ? this._getGroupIndices(resources)
            : [0];

        groupIndices.forEach(groupIndex => {
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

        const isAllDay = this._isAllDayAppointment(rawAppointment);

        return viewDataProvider.findGroupCellStartDate(groupIndex, startDate, endDate, isAllDay);
    }

    _updateGroupIndices(appointments, itemResources) {
        const groupIndices = this.isVerticalGrouping
            ? this._getGroupIndices(itemResources)
            : [0];
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
        const groupIndices = super._getGroupIndices(resources);
        const { viewDataProvider } = this.scheduler.getWorkSpace();
        const viewDataGroupIndices = viewDataProvider.getGroupIndices();

        const result = groupIndices.filter(
            groupIndex => viewDataGroupIndices.indexOf(groupIndex) !== -1
        );

        return result;
    }

    _createAppointments(appointment, resources) {
        const appointments = super._createAppointments(appointment, resources);

        return !appointment.isRecurrent
            ? this._updateGroupIndices(appointments, resources)
            : appointments;
    }
}
