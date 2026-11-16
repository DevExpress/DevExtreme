import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import Appointment from './appointment';
import AppointmentDialog from './appointment/dialog';
import AppointmentPopup from './appointment/popup';
import AppointmentTooltip from './appointment/tooltip';
import Collectors from './collectors';
import { GroupRow } from './groupRow';
import { HeaderPanel } from './headerPanel';
import Toolbar from './toolbar';

export const CLASS = {
  appointment: 'dx-scheduler-appointment',
  dateTable: 'dx-scheduler-date-table',
  dateTableCell: 'dx-scheduler-date-table-cell',
  dateTableRow: 'dx-scheduler-date-table-row',
  allDayTableCell: 'dx-scheduler-all-day-table-cell',
  allDayTitle: 'dx-scheduler-all-day-title',
  allDayRow: 'dx-scheduler-all-day-table-row',
  allDayCollapsed: 'dx-scheduler-work-space-all-day-collapsed',
  focusedCell: 'dx-scheduler-focused-cell',
  selectedCell: 'dx-state-focused',
  droppableCell: 'dx-scheduler-date-table-droppable-cell',
  dateTableScrollable: 'dx-scheduler-date-table-scrollable',
  headerScrollable: 'dx-scheduler-header-scrollable',
  scrollableContainer: 'dx-scrollable-container',
  workspaceBothScrollbar: 'dx-scheduler-work-space-both-scrollbar',
  workSpace: 'dx-scheduler-work-space',
  statusContainer: 'dx-screen-reader-only',
};

export const VIEW_TYPE_CLASS = {
  day: 'dx-scheduler-work-space-day',
  week: 'dx-scheduler-work-space-week',
  workWeek: 'dx-scheduler-work-space-work-week',
  month: 'dx-scheduler-work-space-month',
  timelineDay: 'dx-scheduler-timeline-day',
  timelineWeek: 'dx-scheduler-timeline-week',
  timelineWorkWeek: 'dx-scheduler-timeline-work-week',
  timelineMonth: 'dx-scheduler-timeline-month',
};

export interface ScrollPosition {
  left: number;
  top: number;
}

export default class Scheduler extends Widget {
  public readonly workSpace: Locator;

  public readonly appointments: Locator;

  public readonly dateTable: Locator;

  public readonly dateTableCells: Locator;

  public readonly dateTableRows: Locator;

  public readonly allDayTableCells: Locator;

  public readonly allDayRow: Locator;

  public readonly allDayTitle: Locator;

  public readonly dateTableScrollable: Locator;

  public readonly workspaceScrollable: Locator;

  public readonly headerScrollable: Locator;

  public readonly headerPanel: HeaderPanel;

  public readonly groupRow: GroupRow;

  public readonly toolbar: Toolbar;

  public readonly collectors: Collectors;

  public readonly appointmentPopup: AppointmentPopup;

  public readonly appointmentTooltip: AppointmentTooltip;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.workSpace = this.element.locator(`.${CLASS.workSpace}`);
    this.appointments = this.element.locator(`.${CLASS.appointment}`);
    this.dateTable = this.element.locator(`.${CLASS.dateTable}`);
    this.dateTableCells = this.element.locator(`.${CLASS.dateTableCell}`);
    this.dateTableRows = this.element.locator(`.${CLASS.dateTableRow}`);
    this.allDayTableCells = this.element.locator(`.${CLASS.allDayTableCell}`);
    this.allDayRow = this.element.locator(`.${CLASS.allDayRow}`);
    this.allDayTitle = this.element.locator(`.${CLASS.allDayTitle}`);
    this.dateTableScrollable = this.element.locator(`.${CLASS.dateTableScrollable}`);
    this.workspaceScrollable = this.dateTableScrollable.locator(`.${CLASS.scrollableContainer}`);
    this.headerScrollable = this.element
      .locator(`.${CLASS.headerScrollable} .${CLASS.scrollableContainer}`);
    this.headerPanel = new HeaderPanel(this.element);
    this.groupRow = new GroupRow(this.element);
    this.toolbar = new Toolbar(page, this.element);
    this.collectors = new Collectors(this.element);
    this.appointmentPopup = new AppointmentPopup(page);
    this.appointmentTooltip = new AppointmentTooltip(page, this.element);
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxScheduler'; }

  public getDateTableCell(rowIndex = 0, cellIndex = 0): Locator {
    return this.dateTableRows.nth(rowIndex).locator(`.${CLASS.dateTableCell}`).nth(cellIndex);
  }

  public getAllDayTableCell(cellIndex = 0): Locator {
    return this.allDayTableCells.nth(cellIndex);
  }

  public getGroupCell(cellIndex = 0): Locator {
    return this.groupRow.groupCells.nth(cellIndex);
  }

  public getFocusedCell(isAllDay = false): Locator {
    return this.getCellsWithClass(CLASS.focusedCell, isAllDay);
  }

  public getSelectedCells(isAllDay = false): Locator {
    return this.getCellsWithClass(CLASS.selectedCell, isAllDay);
  }

  public getDroppableCell(isAllDay = false): Locator {
    return this.getCellsWithClass(CLASS.droppableCell, isAllDay);
  }

  public getAppointment(title: string, index = 0): Appointment {
    return new Appointment(this.element, index, title);
  }

  public getAppointmentByIndex(index = 0): Appointment {
    return new Appointment(this.element, index);
  }

  public getGeneralStatusContainer(): Locator {
    return this.element.locator(`.${CLASS.statusContainer}`);
  }

  public getEditRecurrenceDialog(): AppointmentDialog {
    return new AppointmentDialog(this.page);
  }

  public getDeleteRecurrenceDialog(): AppointmentDialog {
    return new AppointmentDialog(this.page);
  }

  public getWorkSpaceScroll(): Promise<ScrollPosition> {
    return this.workspaceScrollable.evaluate(
      (node) => ({ left: node.scrollLeft, top: node.scrollTop }),
    );
  }

  public getHeaderScroll(): Promise<ScrollPosition> {
    return this.headerScrollable.evaluate(
      (node) => ({ left: node.scrollLeft, top: node.scrollTop }),
    );
  }

  public async scrollTo(
    date: Date,
    group?: Record<string, unknown>,
    allDay?: boolean,
  ): Promise<void> {
    await this.invoke('scrollTo', date, group, allDay);
  }

  public async hideAppointmentTooltip(): Promise<void> {
    await this.invoke('hideAppointmentTooltip');
  }

  public async openAppointmentPopup(
    appointment?: Record<string, unknown>,
    isRecurringAppointment = false,
  ): Promise<AppointmentPopup> {
    await this.invoke('showAppointmentPopup', appointment);

    if (isRecurringAppointment) {
      await this.getEditRecurrenceDialog().series.click();
    }

    return this.appointmentPopup;
  }

  public getCellDataAtViewportCenter(): Promise<Record<string, unknown>> {
    return this.element.evaluate((element) => {
      const instance = ($(element) as any).dxScheduler('instance');
      const workSpace = instance.getWorkSpace();
      const scrollable = workSpace.getScrollable();
      const centerX = scrollable.scrollLeft() + scrollable.$element().width() / 2;
      const centerY = scrollable.scrollTop() + scrollable.$element().height() / 2;
      const cell = workSpace.getCellByCoordinates({ top: centerY, left: centerX }, false);

      return workSpace.getCellData(cell);
    });
  }

  private getCellsWithClass(className: string, isAllDay: boolean): Locator {
    const cellClass = isAllDay ? CLASS.allDayTableCell : CLASS.dateTableCell;

    return this.element.locator(`.${cellClass}.${className}`);
  }
}
