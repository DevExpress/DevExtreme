import Widget from '../internal/widget';
import AppointmentPopup from './appointment/popup';
import AppointmentTooltip from './appointment/tooltip';
import AppointmentCollector from './appointment/collector';
import AppointmentDialog from './appointment/dialog';
import Appointment from './appointment';
import Navigator from './navigator';

export const CLASS = {
  appointment: 'dx-scheduler-appointment',
  appointmentCollector: 'dx-scheduler-appointment-collector',
  dateTable: 'dx-scheduler-date-table',
  dateTableCell: 'dx-scheduler-date-table-cell',
  allDayTableCell: 'dx-scheduler-all-day-table-cell',
  focusedCell: 'dx-scheduler-focused-cell',
  selectedCell: 'dx-state-focused',
  dateTableRow: 'dx-scheduler-date-table-row',
  dateTableScrollable: 'dx-scheduler-date-table-scrollable',
  headerPanelCell: 'dx-scheduler-header-panel-cell',
  headerScrollable: 'dx-scheduler-header-scrollable',
  scrollableContainer: 'dx-scrollable-container',

  workSpace: 'dx-scheduler-work-space',
};

export default class Scheduler extends Widget {
  workSpace: Selector;

  dateTableCells: Selector;

  allDayTableCells: Selector;

  dateTableRows: Selector;

  dateTable: Selector;

  dateTableScrollable: Selector;

  headerPanelCells: Selector;

  headerSpaceScroll: { left: Promise<number>; top: Promise<number> };

  workspaceScrollable: Selector;

  workSpaceScroll: { left: Promise<number>; top: Promise<number> };

  appointmentPopup: AppointmentPopup;

  appointmentTooltip: AppointmentTooltip;

  name = 'dxScheduler';

  constructor(id: string) {
    super(id);

    this.workSpace = this.element.find(`.${CLASS.workSpace}`);
    this.dateTableCells = this.element.find(`.${CLASS.dateTableCell}`);
    this.allDayTableCells = this.element.find(`.${CLASS.allDayTableCell}`);
    this.dateTable = this.element.find(`.${CLASS.dateTable}`);
    this.dateTableRows = this.element.find(`.${CLASS.dateTableRow}`);
    this.dateTableScrollable = this.element.find(`.${CLASS.dateTableScrollable}`);
    this.headerPanelCells = this.element.find(`.${CLASS.headerPanelCell}`);
    this.workspaceScrollable = this.dateTableScrollable.find(`.${CLASS.scrollableContainer}`);

    const headerSpaceScroll = this.element.find(`.${CLASS.headerScrollable} .${CLASS.scrollableContainer}`);

    this.headerSpaceScroll = {
      left: headerSpaceScroll.scrollLeft,
      top: headerSpaceScroll.scrollTop,
    };

    this.workSpaceScroll = {
      left: this.workspaceScrollable.scrollLeft,
      top: this.workspaceScrollable.scrollTop,
    };

    this.appointmentPopup = new AppointmentPopup(this.element);
    this.appointmentTooltip = new AppointmentTooltip(this.element);
  }

  static getDialog(): AppointmentDialog {
    return new AppointmentDialog();
  }

  getDateTableCell(rowIndex = 0, cellIndex = 0): Selector {
    return this.dateTableRows.nth(rowIndex).find(`.${CLASS.dateTableCell}`).nth(cellIndex);
  }

  getAllDayTableCell(cellIndex = 0): Selector {
    return this.allDayTableCells.nth(cellIndex);
  }

  getFocusedCell(isAllDay = false): Selector {
    const cells = isAllDay ? this.allDayTableCells : this.dateTableCells;

    return cells.filter(`.${CLASS.focusedCell}`);
  }

  getSelectedCells(isAllDay = false): Selector {
    const cells = isAllDay ? this.allDayTableCells : this.dateTableCells;

    return cells.filter(`.${CLASS.selectedCell}`);
  }

  getAppointment(title: string, index = 0): Appointment {
    return new Appointment(this.element, index, title);
  }

  getAppointmentCollector(title: string, index = 0): AppointmentCollector {
    return new AppointmentCollector(this.element, index, title);
  }

  getAppointmentByIndex(index = 0): Appointment {
    return new Appointment(this.element, index);
  }

  getAppointmentCollectorByIndex(index = 0): AppointmentCollector {
    return new AppointmentCollector(this.element, index);
  }

  async getAppointmentCount(): Promise<number> {
    return this.element.find(`.${CLASS.appointment}`).count;
  }

  async getAppointmentCollectorCount(): Promise<number> {
    return this.element.find(`.${CLASS.appointmentCollector}`).count;
  }

  getNavigator(): Navigator {
    return new Navigator(this.element);
  }
}
