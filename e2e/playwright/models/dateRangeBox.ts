import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from './types';
import Calendar from './calendar';
import DateBox from './dateBox';
import Widget from './internal/widget';
import Popup from './popup';

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
};

export default class DateRangeBox extends Widget {
  name: WidgetName = 'dxDateRangeBox';

  public readonly dropDownButton: Locator;

  public readonly clearButton: Locator;

  public readonly separator: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.dropDownButton = this.element.locator(`.${CLASS.dropDownButton}`);
    this.separator = this.element.locator(`.${CLASS.separator}`);
    this.clearButton = this.element.locator(`.${CLASS.buttonsContainer} .${CLASS.clearButton}`);
  }

  public getPopup(): Popup {
    return new Popup(this.page, this.getStartDateBox().element.locator(`.${CLASS.popup}`));
  }

  public getCalendar(): Calendar {
    return new Calendar(this.page, this.getPopup().getContent().locator(`.${CLASS.calendar}`));
  }

  public getCalendarCell(index: number): Locator {
    return this.getCalendar().element.locator(`.${CLASS.calendarCell}`).nth(index);
  }

  public getStartDateBox(): DateBox {
    return new DateBox(this.page, this.element.locator(`.${CLASS.startDateDateBox}`));
  }

  public getEndDateBox(): DateBox {
    return new DateBox(this.page, this.element.locator(`.${CLASS.endDateDateBox}`));
  }
}
