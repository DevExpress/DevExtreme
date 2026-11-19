import type { WidgetName } from '../types';
import Widget from '../internal/widget';

export default class DropDownMenu extends Widget {
  public getName(): WidgetName { return 'dxDropDownMenu'; }
}
