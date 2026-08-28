import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import { hasClass } from '../internal/hasClass';
import Appointment from './appointment';
import AppointmentDialog from './appointment/dialog';
import AppointmentPopup from './appointment/popup';
import AppointmentTooltip from './appointment/tooltip';
import ReducedIconTooltip from './appointment/tooltip/reducedIconTooltip';
import Collectors from './collectors';
import { GroupRow } from './groupRow';
import { HeaderPanel } from './headerPanel';
import Toolbar from './toolbar';

export const CLASS = {
  appointment: 'dx-scheduler-appointment',
  appointmentCollector: 'dx-scheduler-appointment-collector',
  dateTable: 'dx-scheduler-date-table',
  dateTableCell: 'dx-scheduler-date-table-cell',
  allDayTableCell: 'dx-scheduler-all-day-table-cell',
  allDayTitle: 'dx-scheduler-all-day-title',
  allDayRow: 'dx-scheduler-all-day-table-row',
  allDayCollapsed: 'dx-scheduler-work-space-all-day-collapsed',
  focusedCell: 'dx-scheduler-focused-cell',
  selectedCell: 'dx-state-focused',
  hoverCell: 'dx-state-hover',
  activeCell: 'dx-state-active',
  droppableCell: 'dx-scheduler-date-table-droppable-cell',
  dateTableRow: 'dx-scheduler-date-table-row',
  dateTableScrollable: 'dx-scheduler-date-table-scrollable',
  dateTableScrollableContainer: 'dx-scrollable-container',
  headerScrollable: 'dx-scheduler-header-scrollable',
  scrollableContainer: 'dx-scrollable-container',
  workspaceBothScrollbar: 'dx-scheduler-work-space-both-scrollbar',

  workSpace: 'dx-scheduler-work-space',
  statusContainer: 'dx-screen-reader-only',
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

interface ScrollOffset {
  left: number;
  top: number;
}

const readScrollOffset = (container: Locator): Promise<ScrollOffset> => container.evaluate(
  (element) => ({ left: element.scrollLeft, top: element.scrollTop }),
);

export default class Scheduler extends Widget {
  public readonly workSpace: Locator;

  public readonly dateTableCells: Locator;

  public readonly allDayTableCells: Locator;

  public readonly allDayRow: Locator;

  public readonly allDayTitle: Locator;

  public readonly dateTableRows: Locator;

  public readonly dateTable: Locator;

  public readonly dateTableScrollable: Locator;

  public readonly dateTableScrollableContainer: Locator;

  public readonly headerPanel: HeaderPanel;

  public readonly groupRow: GroupRow;

  public readonly workspaceScrollable: Locator;

  public readonly appointmentPopup: AppointmentPopup;

  public readonly appointmentTooltip: AppointmentTooltip;

  public readonly toolbar: Toolbar;

  public readonly collectors: Collectors;

  public readonly reducedIconTooltip: ReducedIconTooltip;

  private readonly headerSpaceScrollable: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.workSpace = this.element.locator(`.${CLASS.workSpace}`);
    this.dateTableCells = this.element.locator(`.${CLASS.dateTableCell}`);
    this.allDayTableCells = this.element.locator(`.${CLASS.allDayTableCell}`);
    this.allDayRow = this.element.locator(`.${CLASS.allDayRow}`);
    this.allDayTitle = this.element.locator(`.${CLASS.allDayTitle}`);
    this.dateTable = this.element.locator(`.${CLASS.dateTable}`);
    this.dateTableRows = this.element.locator(`.${CLASS.dateTableRow}`);
    this.dateTableScrollable = this.element.locator(`.${CLASS.dateTableScrollable}`);
    this.dateTableScrollableContainer = this.dateTableScrollable
      .locator(`.${CLASS.dateTableScrollableContainer}`);
    this.workspaceScrollable = this.dateTableScrollable.locator(`.${CLASS.scrollableContainer}`);

    this.headerSpaceScrollable = this.element
      .locator(`.${CLASS.headerScrollable} .${CLASS.scrollableContainer}`);

    this.headerPanel = new HeaderPanel(this.element);
    this.toolbar = new Toolbar(page, this.element);
    this.collectors = new Collectors(this.element);
    this.groupRow = new GroupRow(this.element);

    this.appointmentPopup = new AppointmentPopup(page);
    this.appointmentTooltip = new AppointmentTooltip(page, this.element);
    this.reducedIconTooltip = new ReducedIconTooltip(page);
  }

  private static getAppointmentDialog(page: Page): AppointmentDialog {
    return new AppointmentDialog(page);
  }

  static getDeleteRecurrenceDialog(page: Page): AppointmentDialog {
    return this.getAppointmentDialog(page);
  }

  static getEditRecurrenceDialog(page: Page): AppointmentDialog {
    return this.getAppointmentDialog(page);
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxScheduler'; }

  public workspaceHasBothScrollbar(): Promise<boolean> {
    return hasClass(this.workSpace, CLASS.workspaceBothScrollbar);
  }

  public getHeaderSpaceScroll(): Promise<ScrollOffset> {
    return readScrollOffset(this.headerSpaceScrollable);
  }

  public getWorkSpaceScroll(): Promise<ScrollOffset> {
    return readScrollOffset(this.workspaceScrollable);
  }

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
    const cells = isAllDay ? this.allDayTableCells : this.dateTableCells;

    return cells.and(this.page.locator(`.${CLASS.focusedCell}`));
  }

  public getCellDataAtViewportCenter(): Promise<any> {
    return this.element.evaluate((element) => {
      const instance = $(element).data('dxScheduler');
      const workSpace = instance.getWorkSpace();
      const scrollable = workSpace.getScrollable();
      const scrollLeft = scrollable.scrollLeft();
      const scrollTop = scrollable.scrollTop();
      const centerX = scrollLeft + scrollable.$element().width() / 2;
      const centerY = scrollTop + scrollable.$element().height() / 2;

      const cellElement = workSpace.getCellByCoordinates({ top: centerY, left: centerX }, false);

      return workSpace.getCellData(cellElement);
    });
  }

  public getSelectedCells(isAllDay = false): Locator {
    const cells = isAllDay ? this.allDayTableCells : this.dateTableCells;

    return cells.and(this.page.locator(`.${CLASS.selectedCell}`));
  }

  public getDroppableCell(isAllDay = false): Locator {
    const cells = isAllDay ? this.allDayTableCells : this.dateTableCells;

    return cells.and(this.page.locator(`.${CLASS.droppableCell}`));
  }

  public getAppointment(title: string, index = 0): Appointment {
    return new Appointment(this.element, index, title);
  }

  public getAppointmentByIndex(index = 0): Appointment {
    return new Appointment(this.element, index);
  }

  public getAppointmentCount(): Promise<number> {
    return this.element.locator(`.${CLASS.appointment}`).count();
  }

  public getAppointmentResourceByIndex(index: number, label: string): Promise<string> {
    return this.getAppointmentByIndex(index).getResource(label);
  }

  public getGeneralStatusContainer(): Locator {
    return this.element.locator(`.${CLASS.statusContainer}`);
  }

  // The arguments of "evaluate" travel as JSON, so the date is handed over as a timestamp and
  // rebuilt in the page — otherwise the widget would receive a string.
  public async scrollTo(
    date: Date,
    group?: Record<string, unknown>,
    allDay?: boolean,
  ): Promise<void> {
    await this.element.evaluate((element, { time, groupValue, isAllDay }) => {
      $(element).data('dxScheduler').scrollTo(new Date(time), groupValue, isAllDay);
    }, { time: date.getTime(), groupValue: group, isAllDay: allDay });
  }

  public async hideAppointmentTooltip(): Promise<void> {
    await this.invoke('hideAppointmentTooltip');
  }

  public checkViewType(type: string): Promise<boolean> {
    return hasClass(this.workSpace, ViewTypeClassesMap[type]);
  }

  public isAllDayPanelCollapsed(): Promise<boolean> {
    return hasClass(this.workSpace, CLASS.allDayCollapsed);
  }

  public async openAppointmentPopup(
    appointment?: Record<string, unknown>,
    isRecurringAppointment?: boolean,
  ): Promise<AppointmentPopup> {
    await this.element.evaluate((element, data) => {
      // The appointment travels as JSON as well; its date fields come back as ISO strings and are
      // revived here, the way the TestCafe client function used to get them for free.
      const revived = data === undefined
        ? undefined
        : JSON.parse(data, (_, value: unknown) => (
          typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(value)
            ? new Date(value)
            : value
        ));

      $(element).data('dxScheduler').showAppointmentPopup(revived);
    }, appointment === undefined ? undefined : JSON.stringify(appointment));

    if (isRecurringAppointment) {
      await Scheduler.getEditRecurrenceDialog(this.page).series.click();
    }

    return this.appointmentPopup;
  }
}
