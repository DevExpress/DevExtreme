import type { WidgetName } from './types';
import DropDownList from './internal/dropDownList';

export default class SelectBox extends DropDownList {
  name: WidgetName = 'dxSelectBox';
}
