import { scheduler } from './widget.setup';

const durationRatioScale = 50;

export class AppointmentWrapper {
    appointment: any;
    title: any;
    element: any;
    durationRatio: any;
    movementMap: any;
    height: any;
    startTime: any;
    finalTime: any;
    getRow: any;

    constructor(appointment, index) {
        this.appointment = appointment[index];

        this.title = this.appointment.title;
        this.element = scheduler.getAppointmentByTitle(this.title);

        this.durationRatio = this.appointment.durationRatio;

        this.movementMap = this.appointment.movementMap;

        this.height = {
            getExpected: `${(this.appointment.durationRatio * durationRatioScale)}px`,
            getReceived: scheduler.getAppointmentHeight(this.element)
        }

        this.startTime = {
            getExpected: () => {
                return scheduler.getAppointmentBeginTime(this.element);
            },
            getReceived: (movementIndex) => {
                return this.movementMap[movementIndex].startTime;
            }
        }

        this.finalTime = {
            getExpected: () => {
                return scheduler.getAppointmentFinalTime(this.element);
            },
            getReceived: (movementIndex) => {
                return this.movementMap[movementIndex].finalTime;
            }
        }

        this.getRow = (movementIndex) => {
            return this.movementMap[movementIndex].row;
        }

    }
}
