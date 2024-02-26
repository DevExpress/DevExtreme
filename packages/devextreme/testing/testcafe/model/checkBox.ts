import type { WidgetName } from '../helpers/widgetTypings';
import Widget from './internal/widget';

export default class CheckBox extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxCheckBox'; }
}
