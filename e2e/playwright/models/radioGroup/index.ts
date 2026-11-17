import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import RadioGroupItem from './item';

const CLASS = {
  collection: 'dx-collection',
  item: 'dx-item',
};

export default class RadioGroup extends Widget {
  public readonly items: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    // Direct children only: an item template may hold a radio group of its own.
    this.items = this.element.locator(`:scope > .${CLASS.collection} > .${CLASS.item}`);
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxRadioGroup'; }

  public getItem(index = 0): RadioGroupItem {
    return new RadioGroupItem(this.items.nth(index));
  }
}
