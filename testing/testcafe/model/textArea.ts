import TextBox from './textBox';
import { WidgetName } from '../helpers/createWidget';

export default class TextArea extends TextBox {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxTextArea'; }
}
