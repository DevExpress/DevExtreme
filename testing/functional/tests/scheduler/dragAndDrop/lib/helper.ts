import { scheduler } from './widget.setup';

const durationRatioScale = 50;

export class Appointment {
    database: any;

    title: any;
    element: any;
    movementMap: any;

    appointment: any;

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
    }
}

export class AppointmentDuration {
    start: any;
    final: any;
    duration: any;

    constructor(run, end) {
        this.start = this.convert(run);
        this.final = this.convert(end);

        this.duration = this.calculate();
    }

    convert(time) {
        let hour = time.match(/\d+/g).map(Number)[0];
        let minute = time.match(/\d+/g).map(Number)[1];
        let period = time.match(/(AM|PM)/g)[0];

        if (hour < 12 && period != 'AM') {
            hour += 12;
        }

        return {
            hour: hour,
            minute: minute
        }
    }

    restore(time) {
        let hour = time.hour > 12 ? time.hour - 12 : time.hour;
        let minute = time.minute;

        let period = time.hour > 11 ? 'PM' : 'AM';

        return `${hour}:${minute} ${period}`;
    }

    calculate() {
        let hour = this.final.hour - this.start.hour;
        let minute = this.final.minute - this.start.minute;

        if (minute < 0) {
            hour--;
            minute += 60;
        }

        if (hour < 0) {
            hour += 24;
        }

        return {
            hour: hour,
            minute: minute
        }
    }
}
