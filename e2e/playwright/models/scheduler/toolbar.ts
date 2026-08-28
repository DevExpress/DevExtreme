import type { Locator, Page } from '@playwright/test';
import { hasClass } from '../internal/hasClass';
import Navigator from './navigator';
import ViewSwitcher from './viewSwitcher';

const CLASS = {
  toolbar: 'dx-scheduler-header',
  toolbarTodayButton: 'dx-scheduler-today',
  menuButton: 'dx-toolbar-menu-container',
  invisible: 'dx-state-invisible',
};

export default class Toolbar {
  public readonly element: Locator;

  public readonly todayButton: Locator;

  public readonly navigator: Navigator;

  public readonly viewSwitcher: ViewSwitcher;

  public readonly menuButton: Locator;

  constructor(page: Page, scheduler: Locator) {
    this.element = scheduler.locator(`.${CLASS.toolbar}`);
    this.todayButton = this.element.locator(`.${CLASS.toolbarTodayButton}`);
    this.navigator = new Navigator(page, this.element);
    this.viewSwitcher = new ViewSwitcher(this.element);
    this.menuButton = this.element.locator(`.${CLASS.menuButton}`);
  }

  public isInvisible(): Promise<boolean> {
    return hasClass(this.element, CLASS.invisible);
  }
}
