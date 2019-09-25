import { Selector, ClientFunction } from 'testcafe';
import Widget from './internal/widget';

const CLASS = {
    appointment: 'dx-scheduler-appointment',
    appointmentContentDate: 'dx-scheduler-appointment-content-date',
    appointmentCollector: 'dx-scheduler-appointment-collector',
    appointmentTooltip: 'dx-scheduler-appointment-tooltip-wrapper',
    appointmentPopup: 'dx-scheduler-appointment-popup',
    dateTableCell: 'dx-scheduler-date-table-cell',
    dateTableRow: 'dx-scheduler-date-table-row',
    dateTableScrollable: 'dx-scheduler-date-table-scrollable',
    headerPanelCell: 'dx-scheduler-header-panel-cell',
    listItem: 'dx-list-item',
    popup: 'dx-popup',
    popupWrapper: 'dx-popup-wrapper',
    resizableHandleBottom: 'dx-resizable-handle-bottom',
    resizableHandleLeft: 'dx-resizable-handle-left',
    resizableHandleRight: 'dx-resizable-handle-right',
    resizableHandleTop: 'dx-resizable-handle-top',
    schedulerHeaderScrollable: 'dx-scheduler-header-scrollable',
    scrollableContainer: 'dx-scrollable-container',
    stateFocused: 'dx-state-focused',
    stateInvisible: 'dx-state-invisible',
    tooltip: 'dx-tooltip',
    tooltipWrapper: 'dx-tooltip-wrapper'
};

class Appointment {
    element: Selector;
    date: { startTime: Promise<string>, endTime: Promise<string> };
    resizableHandle: { left: Selector, right: Selector, top: Selector, bottom: Selector };
    size: { width: Promise<string>, height: Promise<string> };
    isFocused: Promise<boolean>;

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

        this.isFocused = this.element.hasClass(CLASS.stateFocused);
    }
}

class AppointmentCollector {
    element: Selector;
    isFocused: Promise<boolean>;

    constructor(scheduler: Selector, title: string, index: number = 0) {
        this.element = scheduler.find(`.${CLASS.appointmentCollector}`).withText(title).nth(index);
        this.isFocused = this.element.hasClass(CLASS.stateFocused);
    }
}

class ListItem {
    element: Selector;
    isHovered: Promise<boolean>;
    isFocused: Promise<boolean>;

    constructor(wrapper: Selector, index: number = 0) {
        this.element = wrapper.find(`.${CLASS.listItem}`).nth(index);
        this.isFocused = this.element.hasClass(CLASS.stateFocused);
    }
}

class Popup {
    element: Selector;
    wrapper: Selector;

    constructor(scheduler: Selector) {
        this.element = scheduler.find(`.${CLASS.popup}.${CLASS.appointmentPopup}`);
        this.wrapper = Selector(`.${CLASS.popupWrapper}.${CLASS.appointmentPopup}`);
    }

    isVisible(): Promise<boolean> {
        const { element } = this;
        const invisibleClass = CLASS.stateInvisible;

        return ClientFunction(() => !$(element()).hasClass(invisibleClass), {
            dependencies: { element, invisibleClass }
        })();
    }
}

class Tooltip {
    element: Selector;
    wrapper: Selector;

    constructor(scheduler: Selector) {
        this.element = scheduler.find(`.${CLASS.tooltip}.${CLASS.appointmentTooltip}`);
        this.wrapper = Selector(`.${CLASS.tooltipWrapper}.${CLASS.appointmentTooltip}`);
    }

    getListItem(index: number = 0): ListItem {
        return new ListItem(this.wrapper, index);
    }

    isVisible(): Promise<boolean> {
        const { element } = this;
        const invisibleClass = CLASS.stateInvisible;

        return ClientFunction(() => !$(element()).hasClass(invisibleClass), {
            dependencies: { element, invisibleClass }
        })();
    }
}

export default class Scheduler extends Widget {
    dateTableCells: Selector;
    dateTableRows: Selector;
    dateTableScrollable: Selector;
    headerPanelCells: Selector;
    headerSpaceScroll: { left: Promise<number>, top: Promise<number> };
    workSpaceScroll: { left: Promise<number>, top: Promise<number> };
    popup: Popup;
    tooltip: Tooltip;

    name: string = 'dxScheduler';

    constructor(id: string) {
        super(id);

        this.dateTableCells = this.element.find(`.${CLASS.dateTableCell}`);
        this.dateTableRows = this.element.find(`.${CLASS.dateTableRow}`);
        this.dateTableScrollable =  this.element.find(`.${CLASS.dateTableScrollable}`);
        this.headerPanelCells = this.element.find(`.${CLASS.headerPanelCell}`);

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

        this.tooltip = new Tooltip(this.element);
        this.popup = new Popup(this.element);
    }

    getDateTableCell(rowIndex: number = 0, cellIndex: number = 0): Selector {
        return this.dateTableRows.nth(rowIndex).find(`.${CLASS.dateTableCell}`).nth(cellIndex);
    }

    getAppointment(title: string, index: number = 0): Appointment {
        return new Appointment(this.element, title, index);
    }

    getAppointmentCollector(title: string, index: number = 0): AppointmentCollector {
        return new AppointmentCollector(this.element, title, index);
    }
};
