export class TimeZoneCalculator {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }

    createDate(sourceDate, info) {
        const date = new Date(sourceDate);
        switch(info.path) {
            case PathTimeZoneConversion.fromSourceToAppointment:
                return this.scheduler.fire('convertDateByTimezone', date, info.appointmentTimeZone, true);
            case PathTimeZoneConversion.fromAppointmentToSource:
                return this.scheduler.fire('convertDateByTimezoneBack', date, info.appointmentTimeZone, true);
            case PathTimeZoneConversion.fromSourceToGrid:
                return this.scheduler.fire('convertDateByTimezone', date, info.appointmentTimeZone);
            case PathTimeZoneConversion.fromGridToSource:
                return this.scheduler.fire('convertDateByTimezoneBack', date, info.appointmentTimeZone);
        }
        throw new Error('not specified pathTimeZoneConversion');
    }
}

export const PathTimeZoneConversion = {
    fromSourceToAppointment: 'toAppointment',
    fromAppointmentToSource: 'fromAppointment',

    fromSourceToGrid: 'toGrid',
    fromGridToSource: 'fromGrid',
};
