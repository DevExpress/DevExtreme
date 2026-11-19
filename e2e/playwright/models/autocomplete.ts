import type { WidgetName } from './types';
import TextBox from './textBox';

export default class Autocomplete extends TextBox {
  public getName(): WidgetName { return 'dxAutocomplete'; }
}
