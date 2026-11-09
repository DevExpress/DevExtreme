import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import Appointment from './appointment';
import AppointmentPopup from './appointment/popup';
import AppointmentTooltip from './appointment/tooltip';
import Collectors from './collectors';

export const CLASS = {
  appointment: 'dx-scheduler-appointment',
  allDayTableCell: 'dx-scheduler-all-day-table-cell',
  dateTableCell: 'dx-scheduler-date-table-cell',
  dateTableRow: 'dx-scheduler-date-table-row',
  workSpace: 'dx-scheduler-work-space',
};

export default class Scheduler extends Widget {
  public readonly workSpace: Locator;

  public readonly appointments: Locator;

  public readonly allDayTableCells: Locator;

  public readonly dateTableRows: Locator;

  public readonly collectors: Collectors;

  public readonly appointmentPopup: AppointmentPopup;

  public readonly appointmentTooltip: AppointmentTooltip;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.workSpace = this.element.locator(`.${CLASS.workSpace}`);
    this.appointments = this.element.locator(`.${CLASS.appointment}`);
    this.allDayTableCells = this.element.locator(`.${CLASS.allDayTableCell}`);
    this.dateTableRows = this.element.locator(`.${CLASS.dateTableRow}`);
    this.collectors = new Collectors(this.element);
    this.appointmentPopup = new AppointmentPopup(page);
    this.appointmentTooltip = new AppointmentTooltip(page);
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxScheduler'; }

  public getDateTableCell(rowIndex = 0, cellIndex = 0): Locator {
    return this.dateTableRows.nth(rowIndex).locator(`.${CLASS.dateTableCell}`).nth(cellIndex);
  }

  public getAllDayTableCell(cellIndex = 0): Locator {
    return this.allDayTableCells.nth(cellIndex);
  }

  public getAppointment(title: string, index = 0): Appointment {
    return new Appointment(this.element, index, title);
  }
}
