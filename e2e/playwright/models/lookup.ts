import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from './types';
import DropDownList from './internal/dropDownList';

const CLASS = {
  field: 'dx-lookup-field',
};

export default class Lookup extends DropDownList {
  public readonly field: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.field = this.element.locator(`.${CLASS.field}`);
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxLookup'; }

  // Lookup has no text input: the field takes its place.
  public getPopupOwner(): Locator {
    return this.field;
  }
}
