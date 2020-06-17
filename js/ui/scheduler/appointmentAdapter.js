import { extend } from '../../core/utils/extend';

const PROPERTY_NAMES = {
    startDate: 'startDate',
    endDate: 'endDate',
    allDay: 'allDay',
    text: 'text',
    description: 'description',
    startDateTimeZone: 'startDateTimeZone',
    endDateTimeZone: 'endDateTimeZone',
    recurrenceRule: 'recurrenceRule',
    recurrenceException: 'recurrenceException'
};

export default class AppointmentAdapter {
    constructor(scheduler, appointment) {
        this.scheduler = scheduler;
        this.appointment = appointment;
    }

    get startDate() {
        return this.scheduler.fire('getField', PROPERTY_NAMES.startDate, this.appointment);
    }

    get endDate() {
        return this.scheduler.fire('getField', PROPERTY_NAMES.endDate, this.appointment);
    }

    get allDay() {
        return this.scheduler.fire('getField', PROPERTY_NAMES.allDay, this.appointment);
    }

    get text() {
        return this.scheduler.fire('getField', PROPERTY_NAMES.text, this.appointment);
    }

    get description() {
        return this.scheduler.fire('getField', PROPERTY_NAMES.description, this.appointment);
    }

    get startDateTimeZone() {
        return this.scheduler.fire('getField', PROPERTY_NAMES.startDateTimeZone, this.appointment);
    }

    get endDateTimeZone() {
        return this.scheduler.fire('getField', PROPERTY_NAMES.endDateTimeZone, this.appointment);
    }

    get recurrenceRule() {
        return this.scheduler.fire('getField', PROPERTY_NAMES.recurrenceRule, this.appointment);
    }

    get recurrenceException() {
        return this.scheduler.fire('getField', PROPERTY_NAMES.recurrenceException, this.appointment);
    }

    get disabled() {
        return !!this.appointment.disabled;
    }

    calculateStartDate(pathTimeZoneConversion) {
        return this.calculateDate(this.startDate, this.startDateTimeZone, pathTimeZoneConversion);
    }

    calculateEndDate(pathTimeZoneConversion) {
        return this.calculateDate(this.endDate, this.endDateTimeZone, pathTimeZoneConversion);
    }

    calculateDate(date, appointmentTimeZone, pathTimeZoneConversion) {
        if(!date) { // TODO:
            return undefined;
        }

        return this.scheduler.timeZoneCalculator.createDate(date, {
            appointmentTimeZone: appointmentTimeZone,
            path: pathTimeZoneConversion
        });
    }

    createModifiedAppointment(pathTimeZoneConversion) {
        const result = extend({}, this.appointment);

        this.scheduler.fire('setField', PROPERTY_NAMES.startDate, result, this.calculateStartDate(pathTimeZoneConversion));
        this.scheduler.fire('setField', PROPERTY_NAMES.endDate, result, this.calculateEndDate(pathTimeZoneConversion));

        return result;
    }
}
