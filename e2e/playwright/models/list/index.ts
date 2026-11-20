import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import ListGroup from './group';
import ListItem from './item';

const CLASS = {
  group: 'dx-list-group',
  invisible: 'dx-state-invisible',
  item: 'dx-list-item',
  nestedItem: 'nested-item',
  search: 'dx-list-search',
  selectAll: 'dx-list-select-all',
};

export default class List extends Widget {
  name: WidgetName = 'dxList';

  public readonly items: Locator;

  public readonly visibleItems: Locator;

  public readonly selectAll: ListItem;

  public readonly searchInput: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.items = this.element.locator(`.${CLASS.item}:not(.${CLASS.nestedItem})`);
    this.visibleItems = this.element.locator(`.${CLASS.item}:not(.${CLASS.invisible})`);
    this.selectAll = new ListItem(this.element.locator(`.${CLASS.selectAll}`));
    this.searchInput = this.element.locator(`.${CLASS.search} input`);
  }

  public getItem(index = 0): ListItem {
    return new ListItem(this.items.nth(index));
  }

  public getGroup(index = 0): ListGroup {
    return new ListGroup(this.element.locator(`.${CLASS.group}`).nth(index));
  }

  public async scrollTo(value: number): Promise<void> {
    await this.invoke('scrollTo', value);
  }
}
