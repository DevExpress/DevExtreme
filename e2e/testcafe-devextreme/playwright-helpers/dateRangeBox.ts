import type { Page, Locator } from '@playwright/test';

const CLASS = {
  popup: 'dx-popup',
  calendar: 'dx-calendar',
  calendarCell: 'dx-calendar-cell',
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

  getCalendar(): { element: Locator; option: (name: string) => Promise<unknown> } {
    const calendarLocator = this.page.locator(`.${CLASS.calendar}`);
    const page = this.page;
    return {
      element: calendarLocator,
      async option(name: string): Promise<unknown> {
        return page.evaluate(
          ({ cls, n }) => {
            const el = document.querySelector(`.${cls}`);
            if (!el) return undefined;
            const instance = (window as any).DevExpress.ui.dxCalendar.getInstance(el);
            return instance ? instance.option(n) : undefined;
          },
          { cls: CLASS.calendar, n: name },
        );
      },
    };
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
      ({ sel: s, name: n }) => ($(s) as any).dxDateRangeBox('instance').option(n),
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
