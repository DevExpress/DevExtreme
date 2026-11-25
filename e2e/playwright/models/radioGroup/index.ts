import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import RadioGroupItem from './item';

const CLASS = {
  collection: 'dx-collection',
  item: 'dx-item',
};

export default class RadioGroup extends Widget {
  name: WidgetName = 'dxRadioGroup';

  public readonly items: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.items = this.element.locator(`:scope > .${CLASS.collection} > .${CLASS.item}`);
  }

  public getItem(index = 0): RadioGroupItem {
    return new RadioGroupItem(this.items.nth(index));
  }
}
