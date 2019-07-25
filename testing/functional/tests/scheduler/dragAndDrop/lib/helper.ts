import { scheduler } from './widget.setup';

const durationRatioScale = 50;

export class Appointment {
    database: any;

    title: any;
    element: any;
    movementMap: any;

    appointment: any;

    row: any;
    runTime: any;
    endTime: any;

    constructor(map, id) {
        this.database = map[id];

        this.title = map[id].dataSource.text;
        this.element = scheduler.getAppointmentByTitle(this.title);
        this.movementMap = map[id].movementMap;

        this.appointment = {
            title: this.title,
            element: scheduler.getAppointmentByTitle(this.title),
            height: {
                expected: `${(map[id].durationRatio * durationRatioScale)}px`,
                received: scheduler.getAppointmentHeight(this.element)
            }
        }

        this.row = (step) => {
            return this.movementMap[step].row;
        }

        this.runTime = {
            expected: () => {
                return scheduler.getAppointmentBeginTime(this.element);
            },
            received: (step) => {
                return this.movementMap[step].runTime;
            }
        }

        this.endTime = {
            expected: () => {
                return scheduler.getAppointmentFinalTime(this.element);
            },
            received: (step) => {
                return this.movementMap[step].endTime;
            }
        }
    }
}
