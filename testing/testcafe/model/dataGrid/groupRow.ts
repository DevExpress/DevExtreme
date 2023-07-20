import FocusableElement from '../internal/focusable';
import DataCell from './data/cell';
import Widget from '../internal/widget';

const CLASS = {
  commandExpand: 'dx-command-expand',
  focused: 'dx-focused',
  focusedRow: 'dx-row-focused',
  groupExpanded: 'group-opened',
};

export default class GroupRow extends FocusableElement {
  widgetName: string;

  isFocusedRow: Promise<boolean>;

  isFocused: Promise<boolean>;

  isExpanded: Promise<boolean>;

  constructor(element: Selector, widgetName: string) {
    super(element);
    this.widgetName = widgetName;
    this.isFocusedRow = this.element.hasClass(CLASS.focusedRow);
    this.isFocused = this.element.hasClass(CLASS.focused);
    this.isExpanded = this.element.find(`.${CLASS.commandExpand} .${Widget.addClassPrefix(this.widgetName, CLASS.groupExpanded)}`).exists;
  }

  getCell(index: number): DataCell {
    return new DataCell(this.element, index, this.widgetName);
  }
}
