import type { WidgetName } from './types';
import DropDownList from './internal/dropDownList';

export default class SelectBox extends DropDownList {
  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxSelectBox'; }
}
