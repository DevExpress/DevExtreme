export const PathTimeZoneConversion = {
    fromSourceToAppointment: 'toAppointment',
    fromAppointmentToSource: 'fromAppointment',

    fromSourceToGrid: 'toGrid',
    fromGridToSource: 'fromGrid',
};

export default class TimeZoneCalculator {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }

    /**
     * @param {Date} sourceDate
     * @param {{ appointmentTimeZone:'', path: '' }} info
     */
    createDate(sourceDate, info) {
        switch(info.path) {
            case PathTimeZoneConversion.fromSourceToAppointment:
                return this.scheduler.fire('convertDateByTimezone', sourceDate, info.appointmentTimeZone, true);
            case PathTimeZoneConversion.fromAppointmentToSource:
                return this.scheduler.fire('convertDateByTimezoneBack', sourceDate, info.appointmentTimeZone, true);
            case PathTimeZoneConversion.fromSourceToGrid:
                return this.scheduler.fire('convertDateByTimezone', sourceDate, info.appointmentTimeZone);
            case PathTimeZoneConversion.fromGridToSource:
                return this.scheduler.fire('convertDateByTimezoneBack', sourceDate, info.appointmentTimeZone);
        }
        throw new Error('not specified pathTimeZoneConversion');
    }
}
