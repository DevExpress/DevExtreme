import { Selector, ClientFunction } from 'testcafe';
import Widget from './internal/widget';

const CLASS = {
    appointment: 'dx-scheduler-appointment',
    appointmentContentDate: 'dx-scheduler-appointment-content-date',
    appointmentCollector: 'dx-scheduler-appointment-collector',
    appointmentTooltipWrapper: 'dx-scheduler-appointment-tooltip-wrapper',
    appointmentPopup: 'dx-scheduler-appointment-popup',
    dateTableCell: 'dx-scheduler-date-table-cell',
    allDayTableCell: 'dx-scheduler-all-day-table-cell',
    dateTableRow: 'dx-scheduler-date-table-row',
    dateTableScrollable: 'dx-scheduler-date-table-scrollable',
    headerPanelCell: 'dx-scheduler-header-panel-cell',
    headerScrollable: 'dx-scheduler-header-scrollable',
    listItem: 'dx-list-item',
    popup: 'dx-popup',
    popupWrapper: 'dx-popup-wrapper',
    cancelButton: 'dx-popup-cancel.dx-button',
    resizableHandleBottom: 'dx-resizable-handle-bottom',
    resizableHandleLeft: 'dx-resizable-handle-left',
    resizableHandleRight: 'dx-resizable-handle-right',
    resizableHandleTop: 'dx-resizable-handle-top',
    scrollableContainer: 'dx-scrollable-container',
    stateFocused: 'dx-state-focused',
    allDay: 'dx-scheduler-all-day-appointment',
    stateInvisible: 'dx-state-invisible',
    tooltip: 'dx-tooltip',
    tooltipAppointmentItemContentDate: 'dx-tooltip-appointment-item-content-date',
    tooltipAppointmentItemContentSubject: 'dx-tooltip-appointment-item-content-subject',
    tooltipWrapper: 'dx-tooltip-wrapper',
    tooltipDeleteButton: 'dx-tooltip-appointment-item-delete-button',

    dialog: 'dx-dialog.dx-popup',
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
    isFocused: Promise<boolean>;
    isAllDay: Promise<boolean>;

    constructor(scheduler: Selector, index: number = 0, title?: string) {
        const element = scheduler.find(`.${CLASS.appointment}`);
        this.element = (title ? element.withAttribute('title', title) : element).nth(index);

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

        this.isFocused = this.element.hasClass(CLASS.stateFocused);
        this.isAllDay = this.element.hasClass(CLASS.allDay);
    }
}

class AppointmentCollector{
    element: Selector;
    isFocused: Promise<boolean>;

    constructor(scheduler: Selector, index: number = 0, title?: string) {
        const element = scheduler.find(`.${CLASS.appointmentCollector}`);
        this.element = (title ? element.withText(title) : element).nth(index);

        this.isFocused = this.element.hasClass(CLASS.stateFocused);
    }
}

class AppointmentTooltipListItem {
    element: Selector;
    date: Selector;
    subject: Selector;
    isFocused: Promise<boolean>;

    constructor(wrapper: Selector, title: string, index: number = 0) {
        this.element = wrapper.find(`.${CLASS.listItem}`).withText(title).nth(index);
        this.isFocused = this.element.hasClass(CLASS.stateFocused);

        this.date = this.element.find(`.${CLASS.tooltipAppointmentItemContentDate}`);
        this.subject = this.element.find(`.${CLASS.tooltipAppointmentItemContentSubject}`);
    }
}

class AppointmentDialog {
    element: Selector;
    series: Selector;
    appointment: Selector;

    constructor(scheduler: Selector) {
        this.element = Selector(`.${CLASS.dialog}`);
        this.series = this.element.find(`.${CLASS.dialogButton}`).nth(0);
        this.appointment = this.element.find(`.${CLASS.dialogButton}`).nth(1);
    }
}

class AppointmentPopup {
    element: Selector;
    wrapper: Selector;

    subjectElement: Selector;
    descriptionElement: Selector;
    startDateElement: Selector;
    endDateElement: Selector;
    allDayElement: Selector;

    doneButton: Selector;
    cancelButton: Selector;


    constructor(scheduler: Selector) {
        this.element = scheduler.find(`.${CLASS.popup}.${CLASS.appointmentPopup}`);
        this.wrapper = Selector(`.${CLASS.popupWrapper}.${CLASS.appointmentPopup}`);

        this.subjectElement = this.wrapper.find(".dx-texteditor-input").nth(0);
        this.startDateElement = this.wrapper.find(".dx-texteditor-input").nth(1);
        this.endDateElement = this.wrapper.find(".dx-texteditor-input").nth(2);
        this.descriptionElement = this.wrapper.find(".dx-texteditor-input").nth(3);
        this.allDayElement = this.wrapper.find(".dx-switch").nth(0);

        this.doneButton = this.wrapper.find(".dx-popup-done.dx-button");
        this.cancelButton = this.wrapper.find(`.${CLASS.cancelButton}`);
    }

    isVisible(): Promise<boolean> {
        const { element } = this;
        const invisibleStateClass = CLASS.stateInvisible;

        return ClientFunction(() => !$(element()).hasClass(invisibleStateClass), {
            dependencies: { element, invisibleStateClass }
        })();
    }
}

class AppointmentTooltip {
    element: Selector;
    deleteElement: Selector;
    wrapper: Selector;

    constructor(scheduler: Selector) {
        this.element = scheduler.find(`.${CLASS.tooltip}.${CLASS.appointmentTooltipWrapper}`);
        this.deleteElement = Selector(`.${CLASS.tooltipDeleteButton}`);
        this.wrapper = Selector(`.${CLASS.tooltipWrapper}.${CLASS.appointmentTooltipWrapper}`);
    }

    getListItem(title: string, index: number = 0): AppointmentTooltipListItem {
        return new AppointmentTooltipListItem(this.wrapper, title, index);
    }

    isVisible(): Promise<boolean> {
        const { element } = this;
        const invisibleStateClass = CLASS.stateInvisible;

        return ClientFunction(() => !$(element()).hasClass(invisibleStateClass), {
            dependencies: { element, invisibleStateClass }
        })();
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
    allDayTableCells: Selector;
    dateTableRows: Selector;
    dateTableScrollable: Selector;
    headerPanelCells: Selector;
    headerSpaceScroll: { left: Promise<number>, top: Promise<number> };
    workSpaceScroll: { left: Promise<number>, top: Promise<number> };
    appointmentPopup: AppointmentPopup;
    appointmentTooltip: AppointmentTooltip;
    navigator: SchedulerNavigator;

    name: string = 'dxScheduler';

    constructor(id: string) {
        super(id);

        this.dateTableCells = this.element.find(`.${CLASS.dateTableCell}`);
        this.allDayTableCells = this.element.find(`.${CLASS.allDayTableCell}`);
        this.dateTableRows = this.element.find(`.${CLASS.dateTableRow}`);
        this.dateTableScrollable =  this.element.find(`.${CLASS.dateTableScrollable}`);
        this.headerPanelCells = this.element.find(`.${CLASS.headerPanelCell}`);

        const headerSpaceScroll = this.element.find(`.${CLASS.headerScrollable} .${CLASS.scrollableContainer}`);
        const workSpaceScroll = this.element.find(`.${CLASS.dateTableScrollable} .${CLASS.scrollableContainer}`);

        this.headerSpaceScroll = {
            left: headerSpaceScroll.scrollLeft,
            top: headerSpaceScroll.scrollTop
        };

        this.workSpaceScroll = {
            left: workSpaceScroll.scrollLeft,
            top: workSpaceScroll.scrollTop
        };

        this.appointmentPopup = new AppointmentPopup(this.element);
        this.appointmentTooltip = new AppointmentTooltip(this.element);
    }

    getDialog() {
        return new AppointmentDialog(this.element);
    }

    getDateTableCell(rowIndex: number = 0, cellIndex: number = 0): Selector {
        return this.dateTableRows.nth(rowIndex).find(`.${CLASS.dateTableCell}`).nth(cellIndex);
    }

    getAllDayTableCell(cellIndex: number = 0): Selector {
        return this.allDayTableCells.nth(cellIndex);
    }

    getAppointment(title: string, index: number = 0): Appointment {
        return new Appointment(this.element, index, title);
    }

    getAppointmentCollector(title: string, index: number = 0): AppointmentCollector {
        return new AppointmentCollector(this.element, index, title);
    }

    getAppointmentByIndex(index: number = 0): Appointment {
        return new Appointment(this.element, index);
    }

    getAppointmentCollectorByIndex(index: number = 0): AppointmentCollector {
        return new AppointmentCollector(this.element, index);
    }

    getAppointmentCount() {
        return this.element.find(`.${CLASS.appointment}`).count;
    }

    getAppointmentCollectorCount() {
        return this.element.find(`.${CLASS.appointmentCollector}`).count;
    }

    getNavigator(): SchedulerNavigator {
        return new SchedulerNavigator(this.element);
    }
};
