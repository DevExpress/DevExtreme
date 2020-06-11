import Widget from '../internal/widget';
import AppointmentPopup from './appointment/popup';
import AppointmentTooltip from './appointment/tooltip';
import AppointmentCollector from './appointment/collector';
import AppointmentDialog from './appointment/dialog';
import Appointment from './appointment';
import Navigator from './navigator';

const CLASS = {
    appointment: 'dx-scheduler-appointment',
    appointmentCollector: 'dx-scheduler-appointment-collector',
    dateTableCell: 'dx-scheduler-date-table-cell',
    allDayTableCell: 'dx-scheduler-all-day-table-cell',
    dateTableRow: 'dx-scheduler-date-table-row',
    dateTableScrollable: 'dx-scheduler-date-table-scrollable',
    headerPanelCell: 'dx-scheduler-header-panel-cell',
    headerScrollable: 'dx-scheduler-header-scrollable',
    scrollableContainer: 'dx-scrollable-container',
};

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

    name: string = 'dxScheduler';

    constructor(id: string) {
        super(id);

        this.dateTableCells = this.element.find(`.${CLASS.dateTableCell}`);
        this.allDayTableCells = this.element.find(`.${CLASS.allDayTableCell}`);
        this.dateTableRows = this.element.find(`.${CLASS.dateTableRow}`);
        this.dateTableScrollable = this.element.find(`.${CLASS.dateTableScrollable}`);
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

    static getDialog() {
        return new AppointmentDialog();
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

    getNavigator(): Navigator {
        return new Navigator(this.element);
    }
}
