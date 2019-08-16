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

    getDateTableRowElement(rowIndex = 0) {
        return this.scheduler.find(`.dx-scheduler-date-table-row`).nth(rowIndex);
    }

    getDateTableCellElement(rowIndex = 0, cellIndex = 0) {
        return this.getDateTableRowElement(rowIndex).find(`.dx-scheduler-date-table-cell`).nth(cellIndex);
    }

    getHeaderPanelCellElement(index = 0) {
        return this.scheduler.find(`.dx-scheduler-header-panel-cell`).nth(index);
    }

    getHeaderPanelCellElementByTitle(title, index = 0) {
        return this.scheduler.find(`.dx-scheduler-header-panel-cell`).withAttribute('title', title).nth(index)
    }

    getAppointmentElement(index = 0) {
        return this.scheduler.find(`.dx-scheduler-appointment`).nth(index);
    }

    getAppointmentElementByTitle(title, index = 0) {
        return this.scheduler.find(`.dx-scheduler-appointment`).withAttribute('title', title).nth(index);
    }

    getAppointmentResizableHandleElement(appointment) {
        return {
            left: appointment.find('.dx-resizable-handle-left'),
            right: appointment.find('.dx-resizable-handle-right'),
            top: appointment.find('.dx-resizable-handle-top'),
            bottom: appointment.find('.dx-resizable-handle-bottom')
        }
    }

    getAppointmentElementTime(appointment) {
        const appointmentContentDateElement = appointment.find('.dx-scheduler-appointment-content-date');
        return {
            startTime: appointmentContentDateElement.nth(0).innerText,
            endTime: appointmentContentDateElement.nth(2).innerText
        }
    }

    getAppointmentElementSize(appointment) {
        return {
            height: appointment.getStyleProperty('height'),
            width: appointment.getStyleProperty('width')
        }
    }

    isTooltipVisible() {
        return Selector(".dx-scheduler-appointment-tooltip-wrapper.dx-overlay-wrapper .dx-list").exists;
    }
}
