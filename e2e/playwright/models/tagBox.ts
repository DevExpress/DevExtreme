import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from './types';
import SelectBox from './selectBox';

const CLASS = {
  tag: 'dx-tag',
};

export default class TagBox extends SelectBox {
  public readonly tags: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.tags = this.element.locator(`.${CLASS.tag}`);
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxTagBox'; }
}
