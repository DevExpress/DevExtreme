import type { WidgetName } from './types';
import TextBox from './textBox';

export default class ColorBox extends TextBox {
  public getName(): WidgetName { return 'dxColorBox'; }
}
