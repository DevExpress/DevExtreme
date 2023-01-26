import FocusableElement from '../internal/focusable';
import Widget from '../internal/widget';

const CLASS = {
  commandEdit: 'dx-command-edit',
  commandExpand: 'dx-command-expand',
  commandSelect: 'dx-command-select',
  commandAdaptive: 'dx-command-adaptive',
  hiddenColumn: 'hidden-column',
  commandLink: 'dx-link',
  focused: 'dx-focused',
  selectCheckBox: 'dx-select-checkbox',
  adaptiveButton: 'dx-datagrid-adaptive-more',
};

export default class CommandCell extends FocusableElement {
  isFocused: Promise<boolean>;

  isHidden: Promise<boolean>;

  constructor(dataRow: Selector, index: number, widgetName: string) {
    const childrenSelector = `td[aria-colindex='${index + 1}']`;
    const commandSelector = `${childrenSelector}.${CLASS.commandEdit}, ${childrenSelector}.${CLASS.commandSelect}, ${childrenSelector}.${CLASS.commandExpand}, ${childrenSelector}.${CLASS.commandAdaptive}`;
    super(dataRow.find(commandSelector));
    this.isFocused = this.element.hasClass(CLASS.focused);
    this.isHidden = this.element.hasClass(Widget.addClassPrefix(widgetName, CLASS.hiddenColumn));
  }

  getButton(index: number): Selector {
    return this.element.find(`.${CLASS.commandLink}:nth-child(${index + 1})`);
  }

  getSelectCheckBox(): Selector {
    return this.element.find(`.${CLASS.selectCheckBox}`);
  }

  getAdaptiveButton(): Selector {
    return this.element.find(`.${CLASS.adaptiveButton}`);
  }
}
