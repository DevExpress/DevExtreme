import { Selector, ClientFunction } from "testcafe";

export default class SchedulerTestHelper {
    scheduler: Selector;

    constructor(selector: string) {
        this.scheduler = Selector(selector);
    }

    getAppointment(index = 0) {
        return this.scheduler.find(`.dx-scheduler-appointment`).nth(index);
    }

    getAppointmentByTitle(title, index = 0) {
        return this.scheduler.find(`.dx-scheduler-appointment`).withAttribute('title', title).nth(index);
    }

    getDateTableRow(rowIndex = 0) {
        return this.scheduler.find(`.dx-scheduler-date-table-row`).nth(rowIndex);
    }

    getDateTableCell(rowIndex = 0, cellIndex = 0) {
        return this.getDateTableRow(rowIndex = 0).find(`.dx-scheduler-date-table-cell`).nth(cellIndex);
    }

    isTooltipVisible() {
        return Selector(".dx-scheduler-appointment-tooltip-wrapper.dx-overlay-wrapper .dx-list").exists;
    }
}
