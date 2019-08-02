
export class TablePosition<T> {
    row: T;
    cell: T;

    constructor(row: T, cell: T) {
        this.row = row;
        this.cell = cell;
    }
}

export class Size<T> {
    width: T;
    height: T;

    constructor(width: T, height: T) {
        this.width = width;
        this.height = height;
    }
}

export class TimeSpan<T> {
    startTime: T;
    endTime: T;

    constructor(startDate: T, endDate: T) {
        this.startTime = startDate;
        this.endTime = endDate;
    }
}

export interface AppointmentFeature {
    position: TablePosition<number>,
    size: Size<string>,
    duration: TimeSpan<string>
}

export enum Feature {
    width, height, startTime, endTime
}
