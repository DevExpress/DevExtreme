import { Selector, ClientFunction } from 'testcafe';
import { Primitive } from 'lodash';
import { height } from 'window-size';

const CLASS = {
    appointment: 'dx-scheduler-appointment',
    appointmentContentDate: 'dx-scheduler-appointment-content-date',
    resizableHandleLeft: 'dx-resizable-handle-left',
    resizableHandleRight: 'dx-resizable-handle-right',
    resizableHandleTop: 'dx-resizable-handle-top',
    resizableHandleBottom: 'dx-resizable-handle-bottom',
    dateTableCell: 'dx-scheduler-date-table-cell',
};

class Appointment {
    element: Selector;
    date: { startTime: Promise<string>, endTime: Promise<string> };
    resizableHandle: { left: Selector, right: Selector, top: Selector, bottom: Selector };
    size: { width: Promise<string>, height: Promise<string> };

    constructor(scheduler: Selector, title: string, index: number = 0) {
        this.element = scheduler.find(`.${CLASS.appointment}`).withAttribute('title', title).nth(index);

        const appointmentContentDate = this.element.find(`.${CLASS.appointmentContentDate}`);

        this.date = {
            startTime: appointmentContentDate.nth(0).innerText,
            endTime: appointmentContentDate.nth(2).innerText
        };

        this.resizableHandle = {
            left: this.element.find(`.${CLASS.resizableHandleLeft}`),
            right: this.element.find(`.${CLASS.resizableHandleRight}`),
            top: this.element.find(`.${CLASS.resizableHandleTop}`),
            bottom: this.element.find(`.${CLASS.resizableHandleBottom}`),
        };

        this.size = {
            width: this.element.getStyleProperty('width'),
            height: this.element.getStyleProperty('height')
        }
    }
}

export default class Scheduler {
    element: Selector;
    dateTableCells: Selector;
    tooltip: Selector;
    workSpaceScroll: { left: Promise<number>, top: Promise<number> };
    headerSpaceScroll: { left: Promise<number>, top: Promise<number> };

    constructor(id: string) {
        this.element = Selector(id);
        this.dateTableCells = this.element.find(`.${CLASS.dateTableCell}`);
        this.tooltip = Selector('.dx-scheduler-appointment-tooltip-wrapper.dx-overlay-wrapper .dx-list');
        const workSpaceScroll = this.element.find(".dx-scheduler-date-table-scrollable .dx-scrollable-container");
        const headerSpaceScroll = this.element.find(".dx-scheduler-header-scrollable .dx-scrollable-container");

        this.workSpaceScroll = {
            left: workSpaceScroll.scrollLeft,
            top: workSpaceScroll.scrollTop
        };

        this.headerSpaceScroll = {
            left: headerSpaceScroll.scrollLeft,
            top: headerSpaceScroll.scrollTop
        };
    }

    enableNativeScroll(): Promise<void> {
        return (ClientFunction(() => {
            ($(".dx-scheduler-date-table-scrollable") as any).dxScrollable("instance").option("useNative", true);
        }))();
    }

    setOption(name: string, value: string): Promise<void> {
        return (ClientFunction(() => {
            const instance = ($("#container") as any)["dxScheduler"]("instance");
            instance.option(name, value);
        }, { dependencies: { name, value } }))();
    }

    getDateTableRow(index: number = 0): Selector {
        return this.element.find(`.dx-scheduler-date-table-row`).nth(index);
    }

    getDateTableCell(rowIndex: number = 0, cellIndex: number = 0): Selector {
        return this.getDateTableRow(rowIndex).find(`.dx-scheduler-date-table-cell`).nth(cellIndex);
    }

    getHeaderPanelCell(index:number = 0): Selector {
        return this.element.find(`.dx-scheduler-header-panel-cell`).nth(index);
    }

    getAppointment(title: string, index:number = 0): Appointment {
        return new Appointment(this.element, title, index);
    }
}
