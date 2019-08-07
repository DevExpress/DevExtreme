export class TimeSpan<T> {
    startTime: T;
    endTime: T;

    constructor(startDate: T, endDate: T) {
        this.startTime = startDate;
        this.endTime = endDate;
    }
}
