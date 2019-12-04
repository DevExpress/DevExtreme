import { Selector } from 'testcafe';
import Widget from './internal/widget';

const CLASS = {
    appointment: 'dx-scheduler-appointment',
    appointmentContentDate: 'dx-scheduler-appointment-content-date',
    dateTableCell: 'dx-scheduler-date-table-cell',
    dateTableRow: 'dx-scheduler-date-table-row',
    dateTableScrollable: 'dx-scheduler-date-table-scrollable',
    headerPanelCell: 'dx-scheduler-header-panel-cell',
    resizableHandleBottom: 'dx-resizable-handle-bottom',
    resizableHandleLeft: 'dx-resizable-handle-left',
    resizableHandleRight: 'dx-resizable-handle-right',
    resizableHandleTop: 'dx-resizable-handle-top',
    schedulerHeaderScrollable: 'dx-scheduler-header-scrollable',
    scrollableContainer: 'dx-scrollable-container',

    dialogButton: `dx-dialog-button`,
    navigator: `dx-scheduler-navigator`,
    navigatorButtonNext: `dx-scheduler-navigator-next`,
    navigatorButtonPrev: `dx-scheduler-navigator-previous`,
    navigatorButtonCaption: `dx-scheduler-navigator-caption`
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
            bottom: this.element.find(`.${CLASS.resizableHandleBottom}`)
        };

        this.size = {
            width: this.element.getStyleProperty('width'),
            height: this.element.getStyleProperty('height')
        }
    }
}

class SchedulerNavigator {
    element: Selector;
    nextDuration: Selector;
    prevDuration: Selector;
    caption: Selector;

    constructor(scheduler: Selector) {
        this.element = scheduler.find(`.${CLASS.navigator}`);
        this.nextDuration = Selector(`.${CLASS.navigatorButtonNext}`);
        this.prevDuration = Selector(`.${CLASS.navigatorButtonPrev}`);
        this.caption = Selector(`.${CLASS.navigatorButtonCaption}`);
    }
}

export default class Scheduler extends Widget {
    dateTableCells: Selector;
    dateTableRows: Selector;
    dateTableScrollable: Selector;
    headerPanelCells: Selector;
    headerSpaceScroll: { left: Promise<number>, top: Promise<number> };
    tooltip: Selector;
    workSpaceScroll: { left: Promise<number>, top: Promise<number> };

    name: string = 'dxScheduler';

    constructor(id: string) {
        super(id);

        this.dateTableCells = this.element.find(`.${CLASS.dateTableCell}`);
        this.dateTableRows = this.element.find(`.${CLASS.dateTableRow}`);
        this.dateTableScrollable =  this.element.find(`.${CLASS.dateTableScrollable}`);
        this.headerPanelCells = this.element.find(`.${CLASS.headerPanelCell}`);
        this.tooltip = Selector('.dx-scheduler-appointment-tooltip-wrapper.dx-overlay-wrapper .dx-list');

        const headerSpaceScroll = this.element.find(`.${CLASS.schedulerHeaderScrollable} .${CLASS.scrollableContainer}`);
        const workSpaceScroll = this.element.find(`.${CLASS.dateTableScrollable} .${CLASS.scrollableContainer}`);

        this.headerSpaceScroll = {
            left: headerSpaceScroll.scrollLeft,
            top: headerSpaceScroll.scrollTop
        };

        this.workSpaceScroll = {
            left: workSpaceScroll.scrollLeft,
            top: workSpaceScroll.scrollTop
        };
    }

    getDateTableCell(rowIndex: number = 0, cellIndex: number = 0): Selector {
        return this.dateTableRows.nth(rowIndex).find(`.${CLASS.dateTableCell}`).nth(cellIndex);
    }

    getAppointment(title: string, index:number = 0): Appointment {
        return new Appointment(this.element, title, index);
    }

    getNavigator(): SchedulerNavigator {
        return new SchedulerNavigator(this.element);
    }
};
