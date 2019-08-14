import { Selector, ClientFunction } from "testcafe";

export default class SchedulerTestHelper {
    scheduler: Selector;

    constructor(selector: string) {
        this.scheduler = Selector(selector);
    }

    getDateTableRow(rowIndex = 0) {
        return this.scheduler.find(`.dx-scheduler-date-table-row`).nth(rowIndex);
    }

    getDateTableCell(rowIndex = 0, cellIndex = 0) {
        return this.getDateTableRow(rowIndex).find(`.dx-scheduler-date-table-cell`).nth(cellIndex);
    }

    getHeaderPanelCell(index = 0) {
        return this.scheduler.find(`.dx-scheduler-header-panel-cell`).nth(index);
    }

    getHeaderPanelCellByTitle(title, index = 0) {
        return this.scheduler.find(`.dx-scheduler-header-panel-cell`).withAttribute('title', title).nth(index)
    }

    getAppointment(index = 0) {
        return this.scheduler.find(`.dx-scheduler-appointment`).nth(index);
    }

    getAppointmentByTitle(title, index = 0) {
        return this.scheduler.find(`.dx-scheduler-appointment`).withAttribute('title', title).nth(index);
    }

    getAppointmentTime(appointment) {
        return {
            startTime: appointment.find('.dx-scheduler-appointment-content-date').nth(0).innerText,
            endTime: appointment.find('.dx-scheduler-appointment-content-date').nth(2).innerText
        }
    }

    getAppointmentResizableHandle(appointment) {
        return {
            left: appointment.find('.dx-resizable-handle-left'),
            right: appointment.find('.dx-resizable-handle-right'),
            top: appointment.find('.dx-resizable-handle-top'),
            bottom: appointment.find('.dx-resizable-handle-bottom')
        }
    }

    getAppointmentSize(appointment) {
        return {
            height: appointment.getStyleProperty('height'),
            width: appointment.getStyleProperty('width')
        }
    }
    isTooltipVisible() {
        return Selector(".dx-scheduler-appointment-tooltip-wrapper.dx-overlay-wrapper .dx-list").exists;
    }
}
