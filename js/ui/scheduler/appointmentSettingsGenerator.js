import dateUtils from '../../core/utils/date';
import { extend } from '../../core/utils/extend';
import { getRecurrenceProcessor } from './recurrence';

export default class AppointmentSettingsGenerator {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }

    create(appointmentData) {
        const adapter = this.scheduler.createAppointmentAdapter(appointmentData);

        const recurrenceRule = adapter.recurrenceRule;
        const dateRange = this.scheduler._workSpace.getDateRange();
        let allDay = this.scheduler.appointmentTakesAllDay(appointmentData);

        const startViewDate = this.scheduler.appointmentTakesAllDay(appointmentData) ? dateUtils.trimTime(new Date(dateRange[0])) : dateRange[0];

        const renderingStrategy = this.scheduler.getLayoutManager().getRenderingStrategyInstance();
        const firstDayOfWeek = this.scheduler.getFirstDayOfWeek();

        const minRecurrenceDate = this.scheduler.option('timeZone') ? this.scheduler.timeZoneCalculator.createDate(startViewDate, { path: 'fromGrid' }) : startViewDate;
        const maxRecurrenceDate = this.scheduler.option('timeZone') ? this.scheduler.timeZoneCalculator.createDate(dateRange[1], { path: 'fromGrid' }) : dateRange[1];

        const recurrenceOptions = {
            rule: recurrenceRule,
            exception: adapter.recurrenceException,
            start: adapter.startDate,
            end: adapter.endDate,
            min: minRecurrenceDate,
            max: maxRecurrenceDate,
            firstDayOfWeek: firstDayOfWeek
        };

        const createAppointmentInfo = (startDate, endDate, source) => {
            return {
                startDate,
                endDate,
                source
            };
        };

        const appointmentDuration = adapter.endDate ? adapter.endDate.getTime() - adapter.startDate.getTime() : 0;
        const appointmentList = this._createRecurrenceAppointments(recurrenceOptions, appointmentDuration);

        if(appointmentList.length === 0) {
            appointmentList.push({
                startDate: adapter.startDate,
                endDate: adapter.endDate
            });
        }

        let gridAppointmentList = appointmentList.map(source => {
            const startDate = this.scheduler.timeZoneCalculator.createDate(source.startDate, {
                appointmentTimeZone: adapter.startDateTimeZone,
                path: 'toGrid'
            });
            const endDate = this.scheduler.timeZoneCalculator.createDate(source.endDate, {
                appointmentTimeZone: adapter.endDateTimeZone,
                path: 'toGrid'
            });


            return createAppointmentInfo(startDate, endDate, source);
        });

        gridAppointmentList = this._cropAppointmentsByStartDayHour(gridAppointmentList, appointmentData);

        if(renderingStrategy.needSeparateAppointment(allDay)) {
            let longParts = [];
            let resultDates = [];

            gridAppointmentList.forEach(gridAppointment => {
                const maxDate = new Date(dateRange[1]);
                const endDateOfPart = renderingStrategy.normalizeEndDateByViewEnd(appointmentData, gridAppointment.endDate);

                longParts = dateUtils.getDatesOfInterval(gridAppointment.startDate, endDateOfPart, {
                    milliseconds: this.scheduler.getWorkSpace().getIntervalDuration(allDay)
                });

                const newArr = longParts.filter(el => new Date(el) < maxDate)
                    .map(date => createAppointmentInfo(date, new Date(new Date(date).setMilliseconds(appointmentDuration)), gridAppointment.source));

                resultDates = resultDates.concat(newArr);
            });

            gridAppointmentList = resultDates;
        }

        const itemResources = this.scheduler._resourcesManager.getResourcesFromItem(appointmentData);
        allDay = this.scheduler.appointmentTakesAllDay(appointmentData) && this.scheduler._workSpace.supportAllDayRow();

        return this._createAppointmentInfos(gridAppointmentList, itemResources, allDay);
    }

    _createRecurrenceAppointments(option, duration) {
        const result = getRecurrenceProcessor().generateDates(option);
        return result.map(date => {
            return {
                startDate: new Date(date),
                endDate: new Date(new Date(date).setMilliseconds(duration))
            };
        });
    }

    _cropAppointmentsByStartDayHour(appointments, appointmentData) {
        const adapter = this.scheduler.createAppointmentAdapter(appointmentData);
        const startDayHour = this.scheduler._getCurrentViewOption('startDayHour');
        const endDayHour = this.scheduler._getCurrentViewOption('endDayHour');

        const firstViewDate = this.scheduler._workSpace.getStartViewDate();

        return appointments.map(appointment => {
            let startDate = new Date(appointment.startDate);
            let resultDate = new Date(appointment.startDate);

            if(this.scheduler.appointmentTakesAllDay(appointmentData)) {
                if(adapter.allDay && appointment.endDate.getHours() < endDayHour) {
                    appointment.endDate.setHours(endDayHour, 0, 0, 0);
                }
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
