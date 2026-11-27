import type { Locator } from '@playwright/test';
import type { WidgetName } from './types';
import { expectClass } from './internal/classMatcher';
import DropDownList from './internal/dropDownList';

const CLASS = {
  buttonGroup: 'dx-buttongroup',
  focused: 'dx-state-focused',
};

export default class DropDownButton extends DropDownList {
  name: WidgetName = 'dxDropDownButton';

  // The widget element itself names the popup content.
  public getPopupOwner(): Locator {
    return this.element;
  }

  // The widget's focus goes to its button group.
  public expectFocused(present = true): Promise<void> {
    return expectClass(this.element.locator(`.${CLASS.buttonGroup}`), CLASS.focused, present);
  }
}
