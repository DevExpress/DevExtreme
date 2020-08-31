import dateUtils from '../../core/utils/date';
import { extend } from '../../core/utils/extend';
import { getRecurrenceProcessor } from './recurrence';
import timeZoneUtils from './utils.timeZone.js';


export default class AppointmentSettingsGenerator {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }

    create(rawAppointment) {
        const { scheduler } = this;
        const workspace = scheduler.getWorkSpace();
        const appointment = this.scheduler.createAppointmentAdapter(rawAppointment);
        const dateRange = this.scheduler._workSpace.getDateRange();
        const renderingStrategy = this.scheduler.getLayoutManager().getRenderingStrategyInstance();
        let allDay = this.scheduler.appointmentTakesAllDay(rawAppointment);

        const minRecurrenceDate = scheduler.option('timeZone') ? scheduler.timeZoneCalculator.createDate(startViewDate, { path: 'fromGrid' }) : startViewDate;
        const appointmentList = this._createRecurrenceAppointments(appointment, appointment.duration);
        if(appointmentList.length === 0) {
            if(workspace.isVirtualScrolling()) {
                const groupIndices = workspace._isVerticalGroupedWorkSpace()
                    ? workspace._getGroupIndexes(itemResources)
                    : [0];
                groupIndices.forEach(groupIndex => {
                    appointmentList.push({
                        startDate: adapter.startDate,
                        endDate: adapter.endDate,
                        groupIndex
                    });
                });
            } else {
                appointmentList.push({
                    startDate: adapter.startDate,
                    endDate: adapter.endDate
                });
            }
        }

        let gridAppointmentList = appointmentList.map(source => {
            const startDate = this.scheduler.timeZoneCalculator.createDate(source.startDate, {
                appointmentTimeZone: appointment.startDateTimeZone,
                path: 'toGrid'
            });
            const endDate = this.scheduler.timeZoneCalculator.createDate(source.endDate, {
                appointmentTimeZone: appointment.endDateTimeZone,
                path: 'toGrid'
            });

            return this._createAppointmentInfo(startDate, endDate, source);
        });

        gridAppointmentList = this._cropAppointmentsByStartDayHour(gridAppointmentList, rawAppointment);

        if(renderingStrategy.needSeparateAppointment(allDay)) {
            let longParts = [];
            let resultDates = [];

            gridAppointmentList.forEach(gridAppointment => {
                const maxDate = new Date(dateRange[1]);
                const endDateOfPart = renderingStrategy.normalizeEndDateByViewEnd(rawAppointment, gridAppointment.endDate);

                longParts = dateUtils.getDatesOfInterval(gridAppointment.startDate, endDateOfPart, {
                    milliseconds: this.scheduler.getWorkSpace().getIntervalDuration(allDay)
                });

                const newArr = longParts.filter(el => new Date(el) < maxDate)
                    .map(date => this._createAppointmentInfo(date, new Date(new Date(date).setMilliseconds(appointment.duration)), gridAppointment.source));

                resultDates = resultDates.concat(newArr);
            });

            gridAppointmentList = resultDates;
        }

        allDay = this.scheduler.appointmentTakesAllDay(rawAppointment) && this.scheduler._workSpace.supportAllDayRow();

        return this._createAppointmentInfos(gridAppointmentList, itemResources, allDay);
    }

    _createExtremeRecurrenceDates(rawAppointment) {
        const dateRange = this.scheduler._workSpace.getDateRange();
        const startViewDate = this.scheduler.appointmentTakesAllDay(rawAppointment) ? dateUtils.trimTime(new Date(dateRange[0])) : dateRange[0];
        const commonTimeZone = this.scheduler.option('timeZone');

        const minRecurrenceDate = commonTimeZone ?
            this.scheduler.timeZoneCalculator.createDate(startViewDate, { path: 'fromGrid' }) :
            startViewDate;

        const maxRecurrenceDate = commonTimeZone ?
            this.scheduler.timeZoneCalculator.createDate(dateRange[1], { path: 'fromGrid' }) :
            dateRange[1];

        return [minRecurrenceDate, maxRecurrenceDate];
    }

    _createRecurrenceOptions(appointment) {
        const [minRecurrenceDate, maxRecurrenceDate] = this._createExtremeRecurrenceDates(appointment.source());

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

    _createAppointmentInfo(startDate, endDate, source) {
        return {
            startDate,
            endDate,
            source // TODO
        };
    }

    _createRecurrenceAppointments(appointment, duration) {
        const option = this._createRecurrenceOptions(appointment);
        const generatedStartDates = getRecurrenceProcessor().generateDates(option);

        return generatedStartDates.map(date => {
            const utcDate = timeZoneUtils.createUTCDate(date);
            utcDate.setTime(utcDate.getTime() + duration);
            const endDate = timeZoneUtils.createDateFromUTC(utcDate);

            return {
                startDate: new Date(date),
                endDate: endDate
            };
        });
    }

    _cropAppointmentsByStartDayHour(appointments, rawAppointment) {
        const workspace = this.scheduler.getWorkSpace();
        let startDayHour = this.scheduler._getCurrentViewOption('startDayHour');
        let firstViewDate = this.scheduler._workSpace.getStartViewDate();

        return appointments.map(appointment => {
            let startDate = new Date(appointment.startDate);
            let resultDate = new Date(appointment.startDate);

            if(workspace.isVirtualScrolling()) {
                const { groupIndex } = appointment.source;
                firstViewDate = workspace.viewDataProvider.getGroupStartDate(groupIndex);
                startDayHour = firstViewDate.getHours();
            }


            if(this.scheduler.appointmentTakesAllDay(rawAppointment)) {
                resultDate = dateUtils.normalizeDate(startDate, firstViewDate);
            } else {
                if(startDate < firstViewDate) {
                    startDate = firstViewDate;
                }
                resultDate = dateUtils.normalizeDate(appointment.startDate, startDate);
            }

            appointment.startDate = dateUtils.roundDateByStartDayHour(resultDate, startDayHour);

            return appointment;
        });
    }

    _createAppointmentInfos(gridAppointments, appointmentResources, allDay) {
        let result = [];

        for(let i = 0; i < gridAppointments.length; i++) {
            const coordinates = this.scheduler._workSpace.getCoordinatesByDateInGroup(gridAppointments[i].startDate, appointmentResources, allDay);

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
