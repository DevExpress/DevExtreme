import { Selector, ClientFunction } from "testcafe";

export default class SchedulerTestHelper {
    protected scheduler: Selector;

    constructor(selector: string) {
        this.scheduler = Selector(selector);
    }

    enableNativeScroll() {
        return (ClientFunction(() => {
            ($(".dx-scheduler-date-table-scrollable") as any).dxScrollable("instance").option("useNative", true);
        }))();
    }

    setOption(name: string, value: string) {
        return (ClientFunction(() => {
            const instance = ($("#container") as any)["dxScheduler"]("instance");
            instance.option(name, value);
        }, { dependencies: { name, value } }))();
    }

    getWorkSpaceScroll() {
        const scrollElement = this.scheduler.find(".dx-scheduler-date-table-scrollable .dx-scrollable-container");
        return {
            left: scrollElement.scrollLeft,
            top: scrollElement.scrollTop
        };
    }

    getHeaderSpaceScroll() {
        const scrollElement = this.scheduler.find(".dx-scheduler-header-scrollable .dx-scrollable-container");
        return {
            left: scrollElement.scrollLeft,
            top: scrollElement.scrollTop
        };
    }

    getDateTableRow(rowIndex = 0) {
        return this.scheduler.find(`.dx-scheduler-date-table-row`).nth(rowIndex);
    }

    getDateTableCell(rowIndex = 0, cellIndex = 0) {
        return this.getDateTableRow(rowIndex).find(`.dx-scheduler-date-table-cell`).nth(cellIndex);
    }

    getDateTableCells() {
        return this.scheduler.find(`.dx-scheduler-date-table-cell`);
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

    getAppointmentStartTime(appointment) {
        return appointment.find('.dx-scheduler-appointment-content-date').nth(0).innerText;
    }

    getAppointmentEndTime(appointment) {
        return appointment.find('.dx-scheduler-appointment-content-date').nth(2).innerText;
    }

    getAppointmentHeight(appointment) {
        return appointment.getStyleProperty('height');
    }

    getAppointmentWidth(appointment) {
        return appointment.getStyleProperty('width');
    }

    isTooltipVisible() {
        return Selector(".dx-scheduler-appointment-tooltip-wrapper.dx-overlay-wrapper .dx-list").exists;
    }
}
