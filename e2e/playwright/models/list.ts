import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';

const CLASS = {
  item: 'dx-list-item',
  nestedItem: 'nested-item',
};

export default class List extends Widget {
  public readonly items: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.items = this.element.locator(`.${CLASS.item}:not(.${CLASS.nestedItem})`);
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxList'; }

  public getItem(index = 0): Locator {
    return this.items.nth(index);
  }

  public async scrollTo(value: number): Promise<void> {
    await this.invoke('scrollTo', value);
  }
}
