import type { Locator, Page } from '@playwright/test';

const CLASS = {
  navigator: 'dx-scheduler-navigator',
  nextButton: 'dx-scheduler-navigator-next',
  prevButton: 'dx-scheduler-navigator-previous',
  caption: 'dx-scheduler-navigator-caption',
  calendar: 'dx-scheduler-navigator-calendar',
  calendarViewsWrapper: 'dx-calendar-views-wrapper',
  calendarCell: 'dx-calendar-cell',
  calendarNextView: 'dx-calendar-navigator-next-view',
  calendarPrevView: 'dx-calendar-navigator-previous-view',
  widget: 'dx-widget',
};

export interface NavigatorCalendar {
  element: Locator;
  nextButton: Locator;
  prevButton: Locator;
  getCell: (index: number) => Locator;
}

export default class Navigator {
  public readonly element: Locator;

  public readonly nextButton: Locator;

  public readonly prevButton: Locator;

  public readonly caption: Locator;

  public readonly calendar: NavigatorCalendar;

  constructor(page: Page, toolbar: Locator) {
    this.element = toolbar.locator(`.${CLASS.navigator}`);
    this.nextButton = toolbar.locator(`.${CLASS.nextButton}`);
    this.prevButton = toolbar.locator(`.${CLASS.prevButton}`);
    this.caption = toolbar.locator(`.${CLASS.caption}`);

    const calendar = page.locator(`.${CLASS.calendar}`);
    const view = calendar.locator(`.${CLASS.calendarViewsWrapper} .${CLASS.widget}`).first();

    this.calendar = {
      element: calendar,
      nextButton: calendar.locator(`.${CLASS.calendarNextView}`),
      prevButton: calendar.locator(`.${CLASS.calendarPrevView}`),
      getCell: (index: number): Locator => view.locator(`.${CLASS.calendarCell}`).nth(index),
    };
  }
}
