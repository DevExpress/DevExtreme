import { ClientFunction } from 'testcafe';
import Widget from '../internal/widget';
import AppointmentPopup from './appointment/popup';
import AppointmentTooltip from './appointment/tooltip';
import AppointmentDialog from './appointment/dialog';
import Appointment from './appointment';
import Toolbar from './toolbar';
import Collectors from './collectors';
import ReducedIconTooltip from './appointment/tooltip/reducedIconTooltip';

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

const ViewTypeClassesMap = {
  day: 'dx-scheduler-work-space-day',
  week: 'dx-scheduler-work-space-week',
  workWeek: 'dx-scheduler-work-space-work-week',
  month: 'dx-scheduler-work-space-month',
  timelineDay: 'dx-scheduler-timeline-day',
  timelineWeek: 'dx-scheduler-timeline-week',
  timelineWorkWeek: 'dx-scheduler-timeline-work-week',
  timelineMonth: 'dx-scheduler-timeline-month',
};

export default class Scheduler extends Widget {
  readonly name = 'dxScheduler';

  readonly workSpace: Selector;

  readonly dateTableCells: Selector;

  readonly allDayTableCells: Selector;

  readonly dateTableRows: Selector;

  readonly dateTable: Selector;

  readonly dateTableScrollable: Selector;

  readonly headerPanelCells: Selector;

  readonly headerSpaceScroll: { left: Promise<number>; top: Promise<number> };

  readonly workspaceScrollable: Selector;

  readonly workSpaceScroll: { left: Promise<number>; top: Promise<number> };

  readonly appointmentPopup: AppointmentPopup;

  readonly appointmentTooltip: AppointmentTooltip;

  readonly toolbar: Toolbar;

  readonly collectors: Collectors;

  readonly reducedIconTooltip: ReducedIconTooltip;

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

    this.toolbar = new Toolbar(this.element);
    this.collectors = new Collectors(this.element);

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
    this.reducedIconTooltip = new ReducedIconTooltip();
  }

  static getDeleteRecurrenceDialog(): AppointmentDialog {
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

  getAppointmentByIndex(index = 0): Appointment {
    return new Appointment(this.element, index);
  }

  getAppointmentCount(): Promise<number> {
    return this.element.find(`.${CLASS.appointment}`).count;
  }

  scrollTo(date: Date, group?: Record<string, unknown>, allDay?: boolean): Promise<any> {
    const { name, element } = this;
    const scrollTo = (): any => $(element())[name]('instance').scrollTo(date, group, allDay);

    return ClientFunction(scrollTo, {
      dependencies: {
        date, group, allDay, element, name,
      },
    })();
  }

  hideAppointmentTooltip(): Promise<any> {
    const { name, element } = this;
    const hideAppointmentTooltip = (): any => $(element())[name]('instance').hideAppointmentTooltip();

    return ClientFunction(hideAppointmentTooltip, {
      dependencies: { element, name },
    })();
  }

  checkViewType(type: string): Promise<boolean> {
    return this.workSpace.hasClass(ViewTypeClassesMap[type]);
  }
}
