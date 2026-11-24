import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';
import Button from './button';

const CLASS = {
  item: 'dx-button',
};

export default class ButtonGroup extends Widget {
  name: WidgetName = 'dxButtonGroup';

  public readonly items: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.items = this.element.locator(`.${CLASS.item}`);
  }

  public getItem(index = 0): Button {
    return new Button(this.page, this.items.nth(index));
  }
}
