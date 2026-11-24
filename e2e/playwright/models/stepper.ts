import type { Locator } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';

const CLASS = {
  item: 'dx-step',
};

export default class Stepper extends Widget {
  name: WidgetName = 'dxStepper';

  public getItem(index = 0): Locator {
    return this.element.locator(`.${CLASS.item}`).nth(index);
  }
}
