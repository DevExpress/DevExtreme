import FocusableElement from '../internal/focusable';
import Widget from '../internal/widget';
import DropDownButton from '../dropDownButton';

const CLASS = {
  commandEdit: 'dx-command-edit',
  commandExpand: 'dx-command-expand',
  commandSelect: 'dx-command-select',
  commandAdaptive: 'dx-command-adaptive',
  commandAI: 'dx-command-ai',
  hiddenColumn: 'hidden-column',
  focused: 'dx-focused',
  selectCheckBox: 'dx-select-checkbox',
  adaptiveButton: 'dx-datagrid-adaptive-more',
  aiColumnHeaderButton: 'dx-command-ai-header-button',
  editButton: 'dx-link-edit',
};

const commandSelector = [
  `.${CLASS.commandEdit}`,
  `.${CLASS.commandExpand}`,
  `.${CLASS.commandSelect}`,
  `.${CLASS.commandAdaptive}`,
  `.${CLASS.commandAI}`,
].join(', ');

export default class CommandCell extends FocusableElement {
  isFocused: Promise<boolean>;

  isHidden: Promise<boolean>;

  constructor(dataRow: Selector, index: number, widgetName: string) {
    const childrenSelector = `td[aria-colindex='${index + 1}']`;
    super(dataRow.child(childrenSelector).filter(commandSelector));
    this.isFocused = this.element.hasClass(CLASS.focused);
    this.isHidden = this.element.hasClass(Widget.addClassPrefix(widgetName, CLASS.hiddenColumn));
  }

  getButton(index: number): Selector {
    return this.element.child(index);
  }

  getEditButton(): Selector {
    return this.element.find(`.${CLASS.editButton}`);
  }

  getSelectCheckBox(): Selector {
    return this.element.find(`.${CLASS.selectCheckBox}`);
  }

  getAdaptiveButton(): Selector {
    return this.element.find(`.${CLASS.adaptiveButton}`);
  }

  getAIDropDownButton(): DropDownButton {
    return new DropDownButton(this.element.find(`.${CLASS.aiColumnHeaderButton}`));
  }
}
