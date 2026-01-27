import TextBox from './textBox';
import type { WidgetName } from './types';

export default class NumberBox extends TextBox {
  getName(): WidgetName { return 'dxNumberBox'; }
}
