import type { WidgetName } from './types';
import TextBox from './textBox';

export default class TextArea extends TextBox {
  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxTextArea'; }
}
