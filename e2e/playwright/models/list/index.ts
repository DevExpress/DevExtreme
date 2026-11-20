import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import ListItem from './item';

const CLASS = {
  item: 'dx-list-item',
  nestedItem: 'nested-item',
  selectAll: 'dx-list-select-all',
};

export default class List extends Widget {
  name: WidgetName = 'dxList';

  public readonly items: Locator;

  public readonly selectAll: ListItem;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.items = this.element.locator(`.${CLASS.item}:not(.${CLASS.nestedItem})`);
    this.selectAll = new ListItem(this.element.locator(`.${CLASS.selectAll}`));
  }

  public getItem(index = 0): ListItem {
    return new ListItem(this.items.nth(index));
  }

  public async scrollTo(value: number): Promise<void> {
    await this.invoke('scrollTo', value);
  }
}
