import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import Appointment from './appointment';
import AppointmentTooltip from './appointment/tooltip';
import Collectors from './collectors';

export const CLASS = {
  appointment: 'dx-scheduler-appointment',
  dateTableCell: 'dx-scheduler-date-table-cell',
  dateTableRow: 'dx-scheduler-date-table-row',
  workSpace: 'dx-scheduler-work-space',
};

export default class Scheduler extends Widget {
  public readonly workSpace: Locator;

  public readonly appointments: Locator;

  public readonly dateTableRows: Locator;

  public readonly collectors: Collectors;

  public readonly appointmentTooltip: AppointmentTooltip;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.workSpace = this.element.locator(`.${CLASS.workSpace}`);
    this.appointments = this.element.locator(`.${CLASS.appointment}`);
    this.dateTableRows = this.element.locator(`.${CLASS.dateTableRow}`);
    this.collectors = new Collectors(this.element);
    this.appointmentTooltip = new AppointmentTooltip(page);
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxScheduler'; }

  public getDateTableCell(rowIndex = 0, cellIndex = 0): Locator {
    return this.dateTableRows.nth(rowIndex).locator(`.${CLASS.dateTableCell}`).nth(cellIndex);
  }

  public getAppointment(title: string, index = 0): Appointment {
    return new Appointment(this.element, index, title);
  }
}
