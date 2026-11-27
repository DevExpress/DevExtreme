import FocusableElement from '../internal/focusable';
import DataCell from './data/cell';
import Widget from '../internal/widget';

const CLASS = {
  commandExpand: 'dx-command-expand',
  focused: 'dx-focused',
  groupExpanded: 'group-opened',
};

export default class GroupRow extends FocusableElement {
  widgetName: string;

  isFocused: Promise<boolean>;

  isExpanded: Promise<boolean>;

  constructor(element: Selector, widgetName: string) {
    super(element);
    this.widgetName = widgetName;
    this.isFocused = this.element.hasClass(CLASS.focused);
    this.isExpanded = this.element.find(`.${CLASS.commandExpand} .${Widget.addClassPrefix(this.widgetName, CLASS.groupExpanded)}`).exists;
  }

  getCell(index: number): DataCell {
    return new DataCell(this.element, index, this.widgetName);
  }

  getExpandCell(): Selector {
    return this.element.find(`.${CLASS.commandExpand}`);
  }
}
