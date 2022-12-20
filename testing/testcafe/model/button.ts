import { WidgetName } from '../helpers/createWidget';
import Widget from './internal/widget';

export const CLASS = {
  TEXT: '.dx-button-text',
};

export default class Button extends Widget {
  public static className = 'dx-button';

  public get text(): Promise<string> {
    return this.element.find(CLASS.TEXT).innerText;
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxButton'; }
}
