import { WidgetName } from '../helpers/createWidget';
import DropDownList from './internal/dropDownList';

export default class SelectBox extends DropDownList {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxSelectBox'; }
}
