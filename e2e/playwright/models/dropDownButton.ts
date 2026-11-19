import type { Locator } from '@playwright/test';
import type { WidgetName } from './types';
import DropDownList from './internal/dropDownList';

export default class DropDownButton extends DropDownList {
  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxDropDownButton'; }

  // The widget element itself names the popup content.
  public getPopupOwner(): Locator {
    return this.element;
  }
}
