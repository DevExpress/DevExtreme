import type { Locator } from '@playwright/test';
import ListItem from './item';

const CLASS = {
  header: 'dx-list-group-header',
  item: 'dx-list-item',
  nestedItem: 'nested-item',
};

export default class ListGroup {
  public readonly element: Locator;

  public readonly header: Locator;

  public readonly items: Locator;

  constructor(element: Locator) {
    this.element = element;
    this.header = element.locator(`.${CLASS.header}`);
    this.items = element.locator(`.${CLASS.item}:not(.${CLASS.nestedItem})`);
  }

  public getItem(index = 0): ListItem {
    return new ListItem(this.items.nth(index));
  }
}
