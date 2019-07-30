import { scheduler } from './widget.setup';
import { heightList, widthList, timeScale } from './appointment.map';

class TestResult<T> {
    expect: T;
    result: T;

    constructor(expect: T, result: T) {
        this.expect = expect;
        this.result = result;
    }
}

export class AppointmentWrapper {
    mode: string;

    id: number;
    title: string;

    row: number;
    cell: number;

    element: any;

    constructor(id, title, row, cell = 0) {
        this.id = id;
        this.title = title;

        this.row = row;
        this.cell = cell;

        this.element = scheduler.getAppointmentByTitle(this.title);
    }

    getHeight() {
        return new TestResult(
            heightList[this.id],
            scheduler.getAppointmentHeight(this.element)
        )
    }

    getWidth() {
        return new TestResult(
            widthList[this.id],
            scheduler.getAppointmentWidth(this.element)
        )
    }

    getStartDate() {
        return new TestResult(
            timeScale[this.row],
            scheduler.getAppointmentStartTime(this.element)
        );
    }

    getEndDate() {
        return new TestResult(
            timeScale[this.row + this.id],
            scheduler.getAppointmentEndTime(this.element)
        );
    }
}
