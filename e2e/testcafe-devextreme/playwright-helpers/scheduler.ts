import type { Page, Locator } from '@playwright/test';

const CLASS = {
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
} as const;

const APPOINTMENT_CLASS = {
  appointment: 'dx-scheduler-appointment',
  appointmentContentDate: 'dx-scheduler-appointment-content-date',
  recurrenceIcon: 'dx-scheduler-appointment-recurrence-icon',
  resizableHandleBottom: 'dx-resizable-handle-bottom',
  resizableHandleLeft: 'dx-resizable-handle-left',
  resizableHandleRight: 'dx-resizable-handle-right',
  resizableHandleTop: 'dx-resizable-handle-top',
  stateFocused: 'dx-state-focused',
  allDay: 'dx-scheduler-all-day-appointment',
  title: 'dx-scheduler-appointment-title',
  resourceItem: 'dx-scheduler-appointment-resource-item',
  resourceValue: 'dx-scheduler-appointment-resource-item-value',
  reduced: 'dx-scheduler-appointment-reduced',
  reducedIcon: 'dx-scheduler-appointment-reduced-icon',
  reducedHead: 'dx-scheduler-appointment-head',
  reducedBody: 'dx-scheduler-appointment-body',
  reducedTail: 'dx-scheduler-appointment-tail',
  draggableSource: 'dx-draggable-source',
} as const;

const POPUP_SELECTORS = {
  appointmentPopup: '.dx-scheduler-appointment-popup.dx-popup.dx-widget',
  appointmentPopupContent: '.dx-scheduler-appointment-popup .dx-overlay-content',
  appointmentPopupToolbar: '.dx-scheduler-appointment-popup .dx-popup-title',
  form: '.dx-scheduler-form',
  doneButton: '.dx-popup-done.dx-button.dx-widget',
  cancelButton: '.dx-popup-cancel.dx-button.dx-widget',
  textEditor: '.dx-textbox.dx-widget',
  allDaySwitch: '.dx-scheduler-form-all-day-switch .dx-switch.dx-widget',
  startDateEditor: '.dx-scheduler-form-start-date-editor .dx-datebox.dx-datebox-date.dx-widget',
  startTimeEditor: '.dx-scheduler-form-start-time-editor .dx-datebox.dx-datebox-time.dx-widget',
  endDateEditor: '.dx-scheduler-form-end-date-editor .dx-datebox.dx-datebox-date.dx-widget',
  endTimeEditor: '.dx-scheduler-form-end-time-editor .dx-datebox.dx-datebox-time.dx-widget',
  descriptionEditor: '.dx-scheduler-form-description-editor .dx-textarea.dx-widget',
  recurrenceGroup: '.dx-scheduler-form-recurrence-group',
  listItem: '.dx-list-item',
} as const;

const TOOLTIP_CLASS = {
  tooltip: 'dx-tooltip',
  appointmentTooltipWrapper: 'dx-scheduler-appointment-tooltip-wrapper',
  tooltipWrapper: 'dx-tooltip-wrapper',
  tooltipDeleteButton: 'dx-tooltip-appointment-item-delete-button',
  mobileTooltip: '.dx-scheduler-overlay-panel > .dx-overlay-content',
  listItem: 'dx-list-item',
  contentDate: 'dx-tooltip-appointment-item-content-date',
  contentSubject: 'dx-tooltip-appointment-item-content-subject',
  stateInvisible: 'dx-state-invisible',
  popupContent: 'dx-popup-content',
} as const;

const TOOLBAR_CLASS = {
  toolbar: 'dx-scheduler-header',
  todayButton: 'dx-scheduler-today',
  menuButton: 'dx-toolbar-menu-container',
  invisible: 'dx-state-invisible',
} as const;

const NAVIGATOR_CLASS = {
  navigator: 'dx-scheduler-navigator',
  nextButton: 'dx-scheduler-navigator-next',
  prevButton: 'dx-scheduler-navigator-previous',
  caption: 'dx-scheduler-navigator-caption',
} as const;

const DIALOG_CLASS = {
  dialog: 'dx-dialog.dx-popup',
  dialogButton: 'dx-dialog-button',
} as const;

const VIEW_TYPE_CLASSES: Record<string, string> = {
  day: 'dx-scheduler-work-space-day',
  week: 'dx-scheduler-work-space-week',
  workWeek: 'dx-scheduler-work-space-work-week',
  month: 'dx-scheduler-work-space-month',
  timelineDay: 'dx-scheduler-timeline-day',
  timelineWeek: 'dx-scheduler-timeline-week',
  timelineWorkWeek: 'dx-scheduler-timeline-work-week',
  timelineMonth: 'dx-scheduler-timeline-month',
};

export class SchedulerAppointment {
  readonly element: Locator;

  readonly resizableHandle: {
    left: Locator;
    right: Locator;
    top: Locator;
    bottom: Locator;
  };

  readonly reducedIcon: Locator;

  readonly resourcesItems: Locator;

  constructor(
    private readonly page: Page,
    container: Locator,
    index: number,
    title?: string,
  ) {
    const appointments = container.locator(`.${APPOINTMENT_CLASS.appointment}`);
    this.element = title
      ? appointments.filter({ hasText: title }).nth(index)
      : appointments.nth(index);

    this.resizableHandle = {
      left: this.element.locator(`.${APPOINTMENT_CLASS.resizableHandleLeft}`),
      right: this.element.locator(`.${APPOINTMENT_CLASS.resizableHandleRight}`),
      top: this.element.locator(`.${APPOINTMENT_CLASS.resizableHandleTop}`),
      bottom: this.element.locator(`.${APPOINTMENT_CLASS.resizableHandleBottom}`),
    };

    this.reducedIcon = this.element.locator(`.${APPOINTMENT_CLASS.reducedIcon}`);
    this.resourcesItems = this.element.locator(`.${APPOINTMENT_CLASS.resourceItem}`);
  }

  async getDateTimeText(): Promise<string> {
    return this.element
      .locator(`.${APPOINTMENT_CLASS.appointmentContentDate}`)
      .first()
      .innerText();
  }

  async getTitle(): Promise<string> {
    return this.element.locator(`.${APPOINTMENT_CLASS.title}`).innerText();
  }

  async getColor(): Promise<string> {
    return this.element.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
  }

  async getWidth(): Promise<string> {
    return this.element.evaluate(
      (el) => getComputedStyle(el).width,
    );
  }

  async getHeight(): Promise<string> {
    return this.element.evaluate(
      (el) => getComputedStyle(el).height,
    );
  }

  async isFocused(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      APPOINTMENT_CLASS.stateFocused,
    );
  }

  async isAllDay(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      APPOINTMENT_CLASS.allDay,
    );
  }

  async isReduced(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      APPOINTMENT_CLASS.reduced,
    );
  }

  async isDraggableSource(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      APPOINTMENT_CLASS.draggableSource,
    );
  }

  async getAriaLabel(): Promise<string | null> {
    return this.element.getAttribute('aria-label');
  }

  getRecurrenceElement(): Locator {
    return this.element.locator(`.${APPOINTMENT_CLASS.recurrenceIcon}`);
  }

  getResourceElement(label: string): Locator {
    return this.resourcesItems
      .filter({ has: this.page.locator('div', { hasText: label }) })
      .locator(`.${APPOINTMENT_CLASS.resourceValue}`);
  }

  async getResource(label: string): Promise<string> {
    return this.getResourceElement(label).innerText();
  }
}

export class SchedulerAppointmentPopup {
  readonly element: Locator;
  readonly contentElement: Locator;
  readonly toolbarElement: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly form: Locator;
  readonly textEditor: Locator;
  readonly allDaySwitch: Locator;
  readonly startDateEditor: Locator;
  readonly startTimeEditor: Locator;
  readonly endDateEditor: Locator;
  readonly endTimeEditor: Locator;
  readonly descriptionEditor: Locator;
  readonly recurrenceGroup: Locator;

  constructor(private readonly page: Page) {
    this.element = page.locator(POPUP_SELECTORS.appointmentPopup);
    this.contentElement = page.locator(POPUP_SELECTORS.appointmentPopupContent);
    this.toolbarElement = page.locator(POPUP_SELECTORS.appointmentPopupToolbar);
    this.saveButton = this.toolbarElement.locator(POPUP_SELECTORS.doneButton);
    this.cancelButton = this.toolbarElement.locator(POPUP_SELECTORS.cancelButton);
    this.form = this.contentElement.locator(POPUP_SELECTORS.form);
    this.textEditor = this.contentElement.locator(POPUP_SELECTORS.textEditor);
    this.allDaySwitch = this.contentElement.locator(POPUP_SELECTORS.allDaySwitch);
    this.startDateEditor = this.contentElement.locator(POPUP_SELECTORS.startDateEditor);
    this.startTimeEditor = this.contentElement.locator(POPUP_SELECTORS.startTimeEditor);
    this.endDateEditor = this.contentElement.locator(POPUP_SELECTORS.endDateEditor);
    this.endTimeEditor = this.contentElement.locator(POPUP_SELECTORS.endTimeEditor);
    this.descriptionEditor = this.contentElement.locator(POPUP_SELECTORS.descriptionEditor);
    this.recurrenceGroup = this.contentElement.locator(POPUP_SELECTORS.recurrenceGroup);
  }

  async isVisible(): Promise<boolean> {
    return this.element.isVisible();
  }
}

export class SchedulerTooltipListItem {
  readonly element: Locator;
  readonly date: Locator;
  readonly subject: Locator;

  constructor(wrapper: Locator, title?: string, index = 0) {
    const items = wrapper.locator(`.${TOOLTIP_CLASS.listItem}`);
    this.element = title
      ? items.filter({ hasText: title }).nth(index)
      : items.nth(index);
    this.date = this.element.locator(`.${TOOLTIP_CLASS.contentDate}`);
    this.subject = this.element.locator(`.${TOOLTIP_CLASS.contentSubject}`);
  }

  async isFocused(): Promise<boolean> {
    return this.element.evaluate(
      (el) => el.classList.contains('dx-state-focused'),
    );
  }
}

export class SchedulerAppointmentTooltip {
  readonly element: Locator;
  readonly mobileElement: Locator;
  readonly deleteButton: Locator;
  readonly wrapper: Locator;
  readonly content: Locator;

  constructor(private readonly page: Page, container: Locator) {
    this.element = container.locator(
      `.${TOOLTIP_CLASS.tooltip}.${TOOLTIP_CLASS.appointmentTooltipWrapper}`,
    );
    this.mobileElement = page.locator(TOOLTIP_CLASS.mobileTooltip);
    this.deleteButton = page.locator(`.${TOOLTIP_CLASS.tooltipDeleteButton}`);
    this.wrapper = page.locator(
      `.${TOOLTIP_CLASS.tooltipWrapper}.${TOOLTIP_CLASS.appointmentTooltipWrapper}`,
    );
    this.content = this.element.locator(`.${TOOLTIP_CLASS.popupContent}`);
  }

  getListItem(title?: string, index = 0): SchedulerTooltipListItem {
    return new SchedulerTooltipListItem(this.wrapper, title, index);
  }

  async isVisible(): Promise<boolean> {
    const count = await this.element.count();
    if (count === 0) return false;
    return this.element.evaluate(
      (el, cls) => !el.classList.contains(cls),
      TOOLTIP_CLASS.stateInvisible,
    );
  }
}

export class SchedulerNavigator {
  readonly element: Locator;
  readonly nextButton: Locator;
  readonly prevButton: Locator;
  readonly caption: Locator;

  constructor(private readonly page: Page, toolbar: Locator) {
    this.element = toolbar.locator(`.${NAVIGATOR_CLASS.navigator}`);
    this.nextButton = page.locator(`.${NAVIGATOR_CLASS.nextButton}`);
    this.prevButton = page.locator(`.${NAVIGATOR_CLASS.prevButton}`);
    this.caption = page.locator(`.${NAVIGATOR_CLASS.caption}`);
  }
}

export class SchedulerToolbar {
  readonly element: Locator;
  readonly todayButton: Locator;
  readonly navigator: SchedulerNavigator;
  readonly menuButton: Locator;

  constructor(page: Page, container: Locator) {
    this.element = container.locator(`.${TOOLBAR_CLASS.toolbar}`);
    this.todayButton = this.element.locator(`.${TOOLBAR_CLASS.todayButton}`);
    this.navigator = new SchedulerNavigator(page, this.element);
    this.menuButton = this.element.locator(`.${TOOLBAR_CLASS.menuButton}`);
  }

  async isInvisible(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      TOOLBAR_CLASS.invisible,
    );
  }
}

export class SchedulerAppointmentDialog {
  readonly element: Locator;
  readonly series: Locator;
  readonly appointment: Locator;

  constructor(page: Page) {
    this.element = page.locator(`.${DIALOG_CLASS.dialog}`);
    this.series = this.element.locator(`.${DIALOG_CLASS.dialogButton}`).nth(0);
    this.appointment = this.element.locator(`.${DIALOG_CLASS.dialogButton}`).nth(1);
  }
}

export class Scheduler {
  readonly page: Page;
  readonly element: Locator;
  readonly selector: string;

  readonly workSpace: Locator;
  readonly dateTable: Locator;
  readonly dateTableCells: Locator;
  readonly dateTableRows: Locator;
  readonly dateTableScrollable: Locator;
  readonly dateTableScrollableContainer: Locator;
  readonly workspaceScrollable: Locator;
  readonly allDayTableCells: Locator;
  readonly allDayRow: Locator;
  readonly allDayTitle: Locator;

  readonly toolbar: SchedulerToolbar;
  readonly appointmentPopup: SchedulerAppointmentPopup;
  readonly appointmentTooltip: SchedulerAppointmentTooltip;

  constructor(page: Page, selector = '#container') {
    this.page = page;
    this.selector = selector;
    this.element = page.locator(selector);

    this.workSpace = this.element.locator(`.${CLASS.workSpace}`);
    this.dateTable = this.element.locator(`.${CLASS.dateTable}`);
    this.dateTableCells = this.element.locator(`.${CLASS.dateTableCell}`);
    this.dateTableRows = this.element.locator(`.${CLASS.dateTableRow}`);
    this.allDayTableCells = this.element.locator(`.${CLASS.allDayTableCell}`);
    this.allDayRow = this.element.locator(`.${CLASS.allDayRow}`);
    this.allDayTitle = this.element.locator(`.${CLASS.allDayTitle}`);
    this.dateTableScrollable = this.element.locator(`.${CLASS.dateTableScrollable}`);
    this.dateTableScrollableContainer = this.dateTableScrollable.locator(
      `.${CLASS.dateTableScrollableContainer}`,
    );
    this.workspaceScrollable = this.dateTableScrollable.locator(
      `.${CLASS.scrollableContainer}`,
    );

    this.toolbar = new SchedulerToolbar(page, this.element);
    this.appointmentPopup = new SchedulerAppointmentPopup(page);
    this.appointmentTooltip = new SchedulerAppointmentTooltip(page, this.element);
  }

  getAppointment(title: string, index = 0): SchedulerAppointment {
    return new SchedulerAppointment(this.page, this.element, index, title);
  }

  getAppointmentByIndex(index = 0): SchedulerAppointment {
    return new SchedulerAppointment(this.page, this.element, index);
  }

  async getAppointmentCount(): Promise<number> {
    return this.element.locator(`.${CLASS.appointment}`).count();
  }

  getDateTableCell(rowIndex = 0, cellIndex = 0): Locator {
    return this.dateTableRows
      .nth(rowIndex)
      .locator(`.${CLASS.dateTableCell}`)
      .nth(cellIndex);
  }

  getAllDayTableCell(cellIndex = 0): Locator {
    return this.allDayTableCells.nth(cellIndex);
  }

  getSelectedCells(isAllDay = false): Locator {
    const cellClass = isAllDay ? CLASS.allDayTableCell : CLASS.dateTableCell;
    return this.element.locator(`.${cellClass}.${CLASS.selectedCell}`);
  }

  getFocusedCell(isAllDay = false): Locator {
    const base = isAllDay
      ? `.${CLASS.allDayTableCell}.${CLASS.focusedCell}`
      : `.${CLASS.dateTableCell}.${CLASS.focusedCell}`;
    return this.element.locator(base);
  }

  getDroppableCell(isAllDay = false): Locator {
    const base = isAllDay
      ? `.${CLASS.allDayTableCell}.${CLASS.droppableCell}`
      : `.${CLASS.dateTableCell}.${CLASS.droppableCell}`;
    return this.element.locator(base);
  }

  getGeneralStatusContainer(): Locator {
    return this.element.locator(`.${CLASS.statusContainer}`);
  }

  async option(name: string, value?: unknown): Promise<unknown> {
    const sel = this.selector;
    if (arguments.length === 2) {
      return this.page.evaluate(
        ({ sel: s, name: n, value: v }) => {
          ($(s) as any).dxScheduler('instance').option(n, v);
        },
        { sel, name, value },
      );
    }
    return this.page.evaluate(
      ({ sel: s, name: n }) => ($(s) as any).dxScheduler('instance').option(n),
      { sel, name },
    );
  }

  async optionObject(options: Record<string, unknown>): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ sel: s, opts }) => {
        ($(s) as any).dxScheduler('instance').option(opts);
      },
      { sel, opts: options },
    );
  }

  async scrollTo(
    date: Date,
    group?: Record<string, unknown>,
    allDay?: boolean,
  ): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ sel: s, d, g, a }) => {
        const instance = ($(s) as any).dxScheduler('instance');
        instance.scrollTo(new Date(d), g, a);
      },
      { sel, d: date.toISOString(), g: group, a: allDay },
    );
  }

  async hideAppointmentTooltip(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      (s) => {
        ($(s) as any).dxScheduler('instance').hideAppointmentTooltip();
      },
      sel,
    );
  }

  async showAppointmentPopup(appointmentData: unknown): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ sel: s, data }) => {
        ($(s) as any).dxScheduler('instance').showAppointmentPopup(data);
      },
      { sel, data: appointmentData },
    );
  }

  async checkViewType(type: string): Promise<boolean> {
    const viewClass = VIEW_TYPE_CLASSES[type];
    if (!viewClass) return false;
    return this.workSpace.evaluate(
      (el, cls) => el.classList.contains(cls),
      viewClass,
    );
  }

  async isAllDayPanelCollapsed(): Promise<boolean> {
    return this.workSpace.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.allDayCollapsed,
    );
  }

  async workspaceHasBothScrollbar(): Promise<boolean> {
    return this.workSpace.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.workspaceBothScrollbar,
    );
  }

  async getWorkSpaceScrollLeft(): Promise<number> {
    return this.workspaceScrollable.evaluate((el) => el.scrollLeft);
  }

  async getWorkSpaceScrollTop(): Promise<number> {
    return this.workspaceScrollable.evaluate((el) => el.scrollTop);
  }

  async getHeaderSpaceScrollLeft(): Promise<number> {
    return this.element
      .locator(`.${CLASS.headerScrollable} .${CLASS.scrollableContainer}`)
      .evaluate((el) => el.scrollLeft);
  }

  async getHeaderSpaceScrollTop(): Promise<number> {
    return this.element
      .locator(`.${CLASS.headerScrollable} .${CLASS.scrollableContainer}`)
      .evaluate((el) => el.scrollTop);
  }

  async getCellDataAtViewportCenter(): Promise<unknown> {
    const sel = this.selector;
    return this.page.evaluate((s) => {
      const instance = ($(s) as any).dxScheduler('instance');
      const workSpace = instance.getWorkSpace();
      const scrollable = workSpace.getScrollable();
      const scrollLeft = scrollable.scrollLeft();
      const scrollTop = scrollable.scrollTop();
      const centerX = scrollLeft + scrollable.$element().width() / 2;
      const centerY = scrollTop + scrollable.$element().height() / 2;
      const cellElement = workSpace.getCellByCoordinates(
        { top: centerY, left: centerX },
        false,
      );
      return workSpace.getCellData(cellElement);
    }, sel);
  }

  async focus(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate((s) => {
      ($(s) as any).dxScheduler('instance').focus();
    }, sel);
  }

  async repaint(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate((s) => {
      ($(s) as any).dxScheduler('instance').repaint();
    }, sel);
  }

  getDeleteRecurrenceDialog(): SchedulerAppointmentDialog {
    return new SchedulerAppointmentDialog(this.page);
  }

  getEditRecurrenceDialog(): SchedulerAppointmentDialog {
    return new SchedulerAppointmentDialog(this.page);
  }
}
