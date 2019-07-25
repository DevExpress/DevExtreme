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
    row: any;

    constructor(appointment, index) {
        this.appointment = appointment[index];

        this.title = this.appointment.title;
        this.element = scheduler.getAppointmentByTitle(this.title);

        this.durationRatio = this.appointment.durationRatio;

        this.movementMap = this.appointment.movementMap;

        this.height = {
            expected: `${(this.appointment.durationRatio * durationRatioScale)}px`,
            received: scheduler.getAppointmentHeight(this.element)
        }

        this.startTime = {
            expected: () => {
                return scheduler.getAppointmentBeginTime(this.element);
            },
            received: (movementIndex) => {
                return this.movementMap[movementIndex].startTime;
            }
        }

        this.finalTime = {
            expected: () => {
                return scheduler.getAppointmentFinalTime(this.element);
            },
            received: (movementIndex) => {
                return this.movementMap[movementIndex].finalTime;
            }
        }

        this.row = (movementIndex) => {
            return this.movementMap[movementIndex].row;
        }

    }
}
