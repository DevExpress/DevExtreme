import type { Locator, Page } from '@playwright/test';
import Button from '../button';
import { textMatcher } from '../internal/textMatcher';

const CLASS = {
  viewSwitcher: 'dx-scheduler-view-switcher',
  button: 'dx-button',
};

export default class ViewSwitcher {
  public readonly element: Locator;

  private readonly page: Page;

  constructor(page: Page, toolbar: Locator) {
    this.page = page;
    this.element = toolbar.locator(`.${CLASS.viewSwitcher}`);
  }

  public getButton(text: string): Button {
    return new Button(
      this.page,
      this.element.locator(`.${CLASS.button}`).filter({ hasText: textMatcher(text) }),
    );
  }

  public getDropDownButton(): Button {
    return new Button(this.page, this.element.locator(`.${CLASS.button}`));
  }
}
