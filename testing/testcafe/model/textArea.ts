import TextBox from './textBox';
import type { WidgetName } from '../helpers/widgetTypings';

export default class TextArea extends TextBox {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxTextArea'; }
}
