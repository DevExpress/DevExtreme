import { WidgetName } from '../helpers/widgetName';
import DropDownList from './internal/dropDownList';

export default class SelectBox extends DropDownList {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxSelectBox'; }
}
