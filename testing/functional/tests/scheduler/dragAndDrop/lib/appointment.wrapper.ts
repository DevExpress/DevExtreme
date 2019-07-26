import { scheduler } from './widget.setup';

const durationRatioScale = 50;

export class AppointmentWrapper {
    appointment: any;
    title: any;
    element: any;
    durationRatio: any;
    positionMap: any;

    constructor(appointment, index) {
        this.appointment = appointment[index];

        this.title = this.appointment.title;
        this.element = scheduler.getAppointmentByTitle(this.title);

        this.durationRatio = this.appointment.durationRatio;

        this.positionMap = this.appointment.positionMap;

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
        return this.positionMap[moveIndex].eventBeginTime;
    }

    getFinalTimeExpected = () => {
        return scheduler.getAppointmentFinalTime(this.element);
    }

    getFinalTimeReceived = (moveIndex) => {
        return this.positionMap[moveIndex].eventFinalTime;
    }

    getRow = (moveIndex) => {
        return this.positionMap[moveIndex].timelinePosition;
    }
}
