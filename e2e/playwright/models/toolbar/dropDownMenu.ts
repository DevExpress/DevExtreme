import type { WidgetName } from '../types';
import Widget from '../internal/widget';

export default class DropDownMenu extends Widget {
  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxDropDownMenu'; }
}
