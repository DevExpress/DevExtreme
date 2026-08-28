import type { Locator, Page } from '@playwright/test';
import Calendar from '../calendar';

const CLASS = {
  navigator: 'dx-scheduler-navigator',
  navigatorButtonNext: 'dx-scheduler-navigator-next',
  navigatorButtonPrev: 'dx-scheduler-navigator-previous',
  navigatorButtonCaption: 'dx-scheduler-navigator-caption',
  calendar: '.dx-scheduler-navigator-calendar',
};

export default class SchedulerNavigator {
  public readonly element: Locator;

  public readonly nextButton: Locator;

  public readonly prevButton: Locator;

  public readonly caption: Locator;

  private readonly page: Page;

  public get calendar(): Calendar {
    return new Calendar(this.page, CLASS.calendar);
  }

  constructor(page: Page, scheduler: Locator) {
    this.page = page;
    this.element = scheduler.locator(`.${CLASS.navigator}`);
    this.nextButton = page.locator(`.${CLASS.navigatorButtonNext}`);
    this.prevButton = page.locator(`.${CLASS.navigatorButtonPrev}`);
    this.caption = page.locator(`.${CLASS.navigatorButtonCaption}`);
  }
}
