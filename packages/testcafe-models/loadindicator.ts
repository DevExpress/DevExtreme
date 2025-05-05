import type { WidgetName } from './types';
import Widget from './internal/widget';

export default class LoadIndicator extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxLoadIndicator'; }
}
