import type { Locator } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';

export const CLASS = {
  text: '.dx-button-text',
  selected: 'dx-state-selected',
  itemSelected: 'dx-item-selected',
};

export default class Button extends Widget {
  public static className = 'dx-button';

  public get text(): Locator {
    return this.element.locator(CLASS.text);
  }

  public expectSelected(present = true): Promise<void> {
    return this.expectClass(CLASS.selected, present);
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxButton'; }
}
