import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import Step from './item';

const CLASS = {
  item: 'dx-stepper',
};
export default class Stepper extends Widget {
  public static className = '.dx-step';

  itemElements: Selector;

  constructor(id: string | Selector) {
    super(id);
    this.itemElements = this.element.find(`.${CLASS.item}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxStepper'; }

  public getItem(index = 0): Step {
    return new Step(this.itemElements.nth(index));
  }
}
