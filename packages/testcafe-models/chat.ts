import type { WidgetName } from './types';
import Widget from './internal/widget';

export default class Chat extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxChat'; }
}
