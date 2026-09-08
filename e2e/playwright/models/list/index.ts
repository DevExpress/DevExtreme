import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import ListItem from './item';

const CLASS = {
  group: 'dx-list-group',
  item: 'dx-list-item',
  search: 'dx-list-search',
  selectAllItem: 'dx-list-select-all',
  invisible: 'dx-state-invisible',

  // Custom classes
  nestedItem: 'nested-item',
};

export default class List extends Widget {
  public readonly searchInput: Locator;

  public readonly selectAll: ListItem;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.searchInput = this.element.locator(`.${CLASS.search} input`);
    this.selectAll = new ListItem(this.element.locator(`.${CLASS.selectAllItem}`));
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxList'; }

  public getItem(index = 0): ListItem {
    return new ListItem(this.getItems().nth(index));
  }

  public getItems(): Locator {
    return this.element.locator(`.${CLASS.item}:not(.${CLASS.nestedItem})`);
  }

  public getVisibleItems(): Locator {
    return this.element.locator(`.${CLASS.item}:not(.${CLASS.invisible})`);
  }

  public getGroup(index = 0): Locator {
    return this.element.locator(`.${CLASS.group}`).nth(index);
  }

  public async scrollTo(value: number): Promise<void> {
    await this.invoke('scrollTo', value);
  }
}
