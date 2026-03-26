import type { Page, Locator } from '@playwright/test';

const CLASS = {
  popup: 'dx-popup',
  calendar: 'dx-calendar',
  calendarCell: 'dx-calendar-cell',
  calendarWidget: 'dx-widget',
  calendarViewsWrapper: 'dx-calendar-views-wrapper',
  cellInRange: 'dx-calendar-cell-in-range',
  cellInRangeStart: 'dx-calendar-range-start-date',
  cellInRangeEnd: 'dx-calendar-range-end-date',
  cellInHoveredRange: 'dx-calendar-cell-range-hover',
  cellInHoveredRangeStart: 'dx-calendar-cell-range-hover-start',
  cellInHoveredRangeEnd: 'dx-calendar-cell-range-hover-end',
  otherMonth: 'dx-calendar-other-month',
  startDateDateBox: 'dx-start-datebox',
  endDateDateBox: 'dx-end-datebox',
  dropDownButton: 'dx-dropdowneditor-button',
  clearButton: 'dx-clear-button-area',
  buttonsContainer: 'dx-texteditor-buttons-container',
  separator: 'dx-daterangebox-separator',
  input: 'dx-texteditor-input',
  focused: 'dx-state-focused',
  doneButton: 'dx-popup-done',
  cancelButton: 'dx-popup-cancel',
  todayButton: 'dx-button-today',
  navigatorNextView: 'dx-calendar-navigator-next-view',
  navigatorPrevView: 'dx-calendar-navigator-previous-view',
  navigatorCaption: 'dx-calendar-caption-button',
  button: 'dx-button',
} as const;

function serializeDateToCalendarFormat(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}

export class CalendarViewHelper {
  readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  getCellByDate(date: Date): Locator {
    const dateStr = serializeDateToCalendarFormat(date);
    return this.element.locator(`td[data-value='${dateStr}']`);
  }
}

export class CalendarHelper {
  readonly element: Locator;
  private readonly page: Page;

  constructor(page: Page, element: Locator) {
    this.page = page;
    this.element = element;
  }

  getSelectedRangeCells(): Locator {
    return this.element.locator(`.${CLASS.cellInRange}`);
  }

  getSelectedRangeStartCell(): Locator {
    return this.element.locator(`.${CLASS.cellInRangeStart}:not(.${CLASS.otherMonth})`);
  }

  getSelectedRangeEndCell(): Locator {
    return this.element.locator(`.${CLASS.cellInRangeEnd}`);
  }

  getHoveredRangeCells(): Locator {
    return this.element.locator(`.${CLASS.cellInHoveredRange}`);
  }

  getHoveredRangeStartCell(): Locator {
    return this.element.locator(`.${CLASS.cellInHoveredRangeStart}`);
  }

  getHoveredRangeEndCell(): Locator {
    return this.element.locator(`.${CLASS.cellInHoveredRangeEnd}`);
  }

  getCellByDate(dateStr: string): Locator {
    return this.element.locator(`[data-value="${dateStr}"]:not(.${CLASS.otherMonth})`);
  }

  getView(): CalendarViewHelper {
    const viewEl = this.element.locator(`.${CLASS.calendarViewsWrapper} .${CLASS.calendarWidget}`).first();
    return new CalendarViewHelper(viewEl);
  }

  async option(name: string, value?: unknown): Promise<unknown> {
    const elementHandle = await this.element.elementHandle();
    if (!elementHandle) throw new Error('Calendar element not found');
    if (value !== undefined) {
      return this.page.evaluate(
        ({ el, name: n, value: v }) => {
          const instance = (window as any).DevExpress.ui.dxCalendar.getInstance(el);
          if (instance) instance.option(n, v);
        },
        { el: elementHandle, name, value },
      );
    }
    return this.page.evaluate(
      ({ el, name: n }) => {
        const instance = (window as any).DevExpress.ui.dxCalendar.getInstance(el);
        return instance ? instance.option(n) : undefined;
      },
      { el: elementHandle, name },
    );
  }
}

export class DateBoxHelper {
  readonly element: Locator;
  readonly input: Locator;

  constructor(private readonly page: Page, locator: Locator) {
    this.element = locator;
    this.input = locator.locator(`.${CLASS.input}`);
  }

  async isFocused(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.focused,
    );
  }

  async option(name: string, value?: unknown): Promise<unknown> {
    const elementHandle = await this.element.elementHandle();
    if (!elementHandle) throw new Error('DateBox element not found');
    if (arguments.length === 2) {
      return this.page.evaluate(
        ({ el, name: n, value: v }) => {
          const instance = (window as any).DevExpress.ui.dxDateBox.getInstance(el);
          if (instance) instance.option(n, v);
        },
        { el: elementHandle, name, value },
      );
    }
    return this.page.evaluate(
      ({ el, name: n }) => {
        const instance = (window as any).DevExpress.ui.dxDateBox.getInstance(el);
        return instance ? instance.option(n) : undefined;
      },
      { el: elementHandle, name },
    );
  }
}

export class DateRangeBoxPopup {
  readonly page: Page;
  readonly container: Locator;

  constructor(page: Page, container: Locator) {
    this.page = page;
    this.container = container;
  }

  private getWrapper(): Locator {
    return this.page.locator('.dx-popup-wrapper');
  }

  getApplyButton(): { element: Locator; isFocused: () => Promise<boolean> } {
    const el = this.getWrapper().locator(`.${CLASS.button}.${CLASS.doneButton}`);
    return {
      element: el,
      isFocused: () => el.evaluate((e, cls) => e.classList.contains(cls), CLASS.focused),
    };
  }

  getCancelButton(): { element: Locator; isFocused: () => Promise<boolean> } {
    const el = this.getWrapper().locator(`.${CLASS.button}.${CLASS.cancelButton}`);
    return {
      element: el,
      isFocused: () => el.evaluate((e, cls) => e.classList.contains(cls), CLASS.focused),
    };
  }

  getTodayButton(): { element: Locator; isFocused: () => Promise<boolean> } {
    const el = this.getWrapper().locator(`.${CLASS.todayButton}`);
    return {
      element: el,
      isFocused: () => el.evaluate((e, cls) => e.classList.contains(cls), CLASS.focused),
    };
  }

  getNavigatorPrevButton(): { element: Locator; isFocused: () => Promise<boolean> } {
    const el = this.getWrapper().locator(`.${CLASS.navigatorPrevView}`);
    return {
      element: el,
      isFocused: () => el.evaluate((e, cls) => e.classList.contains(cls), CLASS.focused),
    };
  }

  getNavigatorNextButton(): { element: Locator; isFocused: () => Promise<boolean> } {
    const el = this.getWrapper().locator(`.${CLASS.navigatorNextView}`);
    return {
      element: el,
      isFocused: () => el.evaluate((e, cls) => e.classList.contains(cls), CLASS.focused),
    };
  }

  getNavigatorCaption(): { element: Locator; isFocused: () => Promise<boolean> } {
    const el = this.getWrapper().locator(`.${CLASS.navigatorCaption}`);
    return {
      element: el,
      isFocused: () => el.evaluate((e, cls) => e.classList.contains(cls), CLASS.focused),
    };
  }

  getViewsWrapper(): { element: Locator; isFocused: () => Promise<boolean> } {
    const el = this.getWrapper().locator('.dx-calendar-views-wrapper');
    return {
      element: el,
      isFocused: () => el.evaluate((e) => e === document.activeElement || e.contains(document.activeElement)),
    };
  }
}

export class DateRangeBox {
  readonly page: Page;
  readonly selector: string;
  readonly element: Locator;
  readonly dropDownButton: Locator;
  readonly clearButton: Locator;
  readonly separator: Locator;

  constructor(page: Page, selector = '#container') {
    this.page = page;
    this.selector = selector;
    this.element = page.locator(selector);
    this.dropDownButton = this.element.locator(`.${CLASS.dropDownButton}`);
    this.separator = this.element.locator(`.${CLASS.separator}`);
    this.clearButton = this.element
      .locator(`.${CLASS.buttonsContainer}`)
      .locator(`.${CLASS.clearButton}`);
  }

  async isFocused(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.focused,
    );
  }

  getStartDateBox(): DateBoxHelper {
    return new DateBoxHelper(
      this.page,
      this.element.locator(`.${CLASS.startDateDateBox}`),
    );
  }

  getEndDateBox(): DateBoxHelper {
    return new DateBoxHelper(
      this.page,
      this.element.locator(`.${CLASS.endDateDateBox}`),
    );
  }

  getPopup(): DateRangeBoxPopup {
    return new DateRangeBoxPopup(this.page, this.element);
  }

  getCalendar(): CalendarHelper {
    const calendarLocator = this.page.locator(`.${CLASS.calendar}`);
    return new CalendarHelper(this.page, calendarLocator);
  }

  getCalendarCell(index: number): Locator {
    return this.page.locator(`.${CLASS.calendar} .${CLASS.calendarCell}`).nth(index);
  }

  async option(name: string, value?: unknown): Promise<unknown> {
    const sel = this.selector;
    if (arguments.length === 2) {
      return this.page.evaluate(
        ({ sel: s, name: n, value: v }) => {
          ($(s) as any).dxDateRangeBox('instance').option(n, v);
        },
        { sel, name, value },
      );
    }
    return this.page.evaluate(
      ({ sel: s, name: n }) => {
        const result = ($(s) as any).dxDateRangeBox('instance').option(n);
        if (Array.isArray(result)) {
          return result.map((v: unknown) => (v instanceof Date ? v.toISOString() : v));
        }
        return result instanceof Date ? result.toISOString() : result;
      },
      { sel, name },
    );
  }

  async focus(): Promise<void> {
    await this.page.evaluate(
      (sel) => {
        ($(sel) as any).dxDateRangeBox('instance').focus();
      },
      this.selector,
    );
  }
}
