export class AppointmentTooltipInfo {
    constructor(appointment, targetedAppointment = undefined, color = [], settings = []) { // TODO
        this.appointment = appointment;
        this.targetedAppointment = targetedAppointment;
        this.color = color;
        this.settings = settings;
    }
}
