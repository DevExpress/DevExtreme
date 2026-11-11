import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { classMatcher } from '../internal/classMatcher';
import Navigator from './navigator';
import ViewSwitcher from './viewSwitcher';

const CLASS = {
  toolbar: 'dx-scheduler-header',
  todayButton: 'dx-scheduler-today',
  menuButton: 'dx-toolbar-menu-container',
  invisible: 'dx-state-invisible',
};

export default class Toolbar {
  public readonly element: Locator;

  public readonly todayButton: Locator;

  public readonly menuButton: Locator;

  public readonly navigator: Navigator;

  public readonly viewSwitcher: ViewSwitcher;

  constructor(page: Page, scheduler: Locator) {
    this.element = scheduler.locator(`.${CLASS.toolbar}`);
    this.todayButton = this.element.locator(`.${CLASS.todayButton}`);
    this.menuButton = this.element.locator(`.${CLASS.menuButton}`);
    this.navigator = new Navigator(page, this.element);
    this.viewSwitcher = new ViewSwitcher(page, this.element);
  }

  public async expectInvisible(present = true): Promise<void> {
    const assertion = expect(this.element);

    await (present ? assertion : assertion.not).toHaveClass(classMatcher(CLASS.invisible));
  }
}
