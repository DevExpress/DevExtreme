import type { Locator, Page } from '@playwright/test';
import { hasClass } from '../../../internal/hasClass';

const CLASS = {
  stateInvisible: 'dx-state-invisible',
  tooltipWrapper: 'dx-tooltip-wrapper',
  content: 'dx-popup-content',
};

export default class TooltipBase {
  public readonly page: Page;

  public element: Locator;

  public readonly content: Locator;

  // A subclass may re-point "element" at a narrower root, but "content" and "exists()" stay bound
  // to the one built here — the same split the TestCafe model had.
  private readonly root: Locator;

  constructor(page: Page, tooltipClass: string) {
    this.page = page;
    this.root = page.locator(`.${tooltipClass}`);
    this.element = this.root;
    this.content = this.root.locator(`.${CLASS.content}`);
  }

  public async exists(): Promise<boolean> {
    return await this.root.count() > 0;
  }

  public async isVisible(): Promise<boolean> {
    if (await this.element.count() === 0) {
      return false;
    }

    return !await hasClass(this.element, CLASS.stateInvisible);
  }
}
