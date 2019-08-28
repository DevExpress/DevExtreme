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

    getDateTableRow(index = 0) {
        return this.scheduler.find(`.dx-scheduler-date-table-row`).nth(index);
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

    getAppointment(title, index = 0) {
        return this.scheduler.find(`.dx-scheduler-appointment`).withAttribute('title', title).nth(index);
    }

    getAppointmentDate(appointment) {
        const appointmentContentDate = appointment.find('.dx-scheduler-appointment-content-date');
        return {
            startTime: appointmentContentDate.nth(0).innerText,
            endTime: appointmentContentDate.nth(2).innerText
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
            width: appointment.getStyleProperty('width'),
            height: appointment.getStyleProperty('height')
        }
    }

    isTooltipVisible() {
        return Selector(".dx-scheduler-appointment-tooltip-wrapper.dx-overlay-wrapper .dx-list").exists;
    }
}
