import type { WidgetName } from './types';
import Widget from './internal/widget';

export const CLASS = {
  TEXT: '.dx-button-text',
  selected: 'dx-state-selected',
  itemSelected: 'dx-item-selected',
};

export default class Button extends Widget {
  public static className = 'dx-button';

  public get text(): Promise<string> {
    return this.element.find(CLASS.TEXT).innerText;
  }

  public get isSelected(): Promise<boolean> {
    return this.element.hasClass(CLASS.selected);
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxButton'; }
}
