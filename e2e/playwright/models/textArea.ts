import type { WidgetName } from './types';
import TextBox from './textBox';

export default class TextArea extends TextBox {
  public getName(): WidgetName { return 'dxTextArea'; }
}
