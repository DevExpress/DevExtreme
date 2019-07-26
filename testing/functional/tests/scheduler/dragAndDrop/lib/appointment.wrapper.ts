import { scheduler } from './widget.setup';

const durationRatioScale = 50;

export class AppointmentWrapper {
    appointment: any;
    title: any;
    element: any;
    durationRatio: any;
    moveMap: any;

    constructor(appointment, index) {
        this.appointment = appointment[index];

        this.title = this.appointment.title;
        this.element = scheduler.getAppointmentByTitle(this.title);

        this.durationRatio = this.appointment.durationRatio;

        this.moveMap = this.appointment.moveMap;

    }

    getHeightExpected = () => {
        return `${(this.appointment.durationRatio * durationRatioScale)}px`;
    }

    getHeightReceived = () => {
        return scheduler.getAppointmentHeight(this.element);
    }

    getBeginTimeExpected = () => {
        return scheduler.getAppointmentBeginTime(this.element);
    }

    getBeginTimeReceived = (moveIndex) => {
        return this.moveMap[moveIndex].beginTime;
    }

    getFinalTimeExpected = () => {
        return scheduler.getAppointmentFinalTime(this.element);
    }

    getFinalTimeReceived = (moveIndex) => {
        return this.moveMap[moveIndex].finalTime;
    }

    getRow = (moveIndex) => {
        return this.moveMap[moveIndex].row;
    }
}
