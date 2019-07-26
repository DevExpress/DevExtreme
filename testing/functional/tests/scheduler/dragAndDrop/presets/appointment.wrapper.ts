import { scheduler } from './widget.setup';

class TestResult<T> {
    expect: T;
    result: T;

    constructor(expect: T, result: T) {
        this.expect = expect;
        this.result = result;
    }
}

export class AppointmentWrapper {
    appointment: {
        title: string,
        height: string,
        positionMap: Array<{
            row: number,
            startDate: string,
            endDate: string
        }>
    };

    title: string;
    element: any;

    height: string;
    positionMap: Array<{
        row: number,
        startDate: string,
        endDate: string
    }>;

    constructor(appointment, index) {
        this.appointment = appointment[index];
        this.title = this.appointment.title;
        this.element = scheduler.getAppointmentByTitle(this.title);

        this.height = this.appointment.height;
        this.positionMap = this.appointment.positionMap;
    }

    getHeight() {
        return new TestResult(
            this.height,
            scheduler.getAppointmentHeight(this.element)
        );
    }

    getStartDate(moveIndex) {
        return new TestResult(
            this.positionMap[moveIndex].startDate,
            scheduler.getAppointmentBeginTime(this.element)
        );
    }

    getEndDate(moveIndex) {
        return new TestResult(
            this.positionMap[moveIndex].endDate,
            scheduler.getAppointmentFinalTime(this.element)
        );
    }

    getRow(moveIndex) {
        return this.positionMap[moveIndex].row;
    }
}
