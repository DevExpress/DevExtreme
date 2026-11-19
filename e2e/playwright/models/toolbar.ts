import type { WidgetName } from './types';
import Widget from './internal/widget';

export default class Toolbar extends Widget {
  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxToolbar'; }
}
