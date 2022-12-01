import { WidgetName } from '../helpers/createWidget';
import Widget from './internal/widget';

export const CLASS = {

};

export default class Button extends Widget {
  public static className = 'dx-button';

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxButton'; }
}
