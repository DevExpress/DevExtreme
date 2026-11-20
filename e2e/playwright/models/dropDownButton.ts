import type { Locator } from '@playwright/test';
import type { WidgetName } from './types';
import DropDownList from './internal/dropDownList';

export default class DropDownButton extends DropDownList {
  name: WidgetName = 'dxDropDownButton';

  // The widget element itself names the popup content.
  public getPopupOwner(): Locator {
    return this.element;
  }
}
