import type { WidgetName } from '../helpers/widgetTypings';
import DropDownList from './internal/dropDownList';

export default class Autocomplete extends DropDownList {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxAutocomplete'; }
}
