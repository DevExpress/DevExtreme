import FocusableElement from '../internal/focusable';
import Widget from '../internal/widget';

const CLASS = {
  command: {
    edit: 'dx-command-edit',
    expand: 'dx-command-expand',
    select: 'dx-command-select',
    adaptive: 'dx-command-adaptive',
  },
  hiddenColumn: 'hidden-column',
  focused: 'dx-focused',
  selectCheckBox: 'dx-select-checkbox',
  adaptiveButton: 'dx-datagrid-adaptive-more',
};

export default class CommandCell extends FocusableElement {
  isFocused: Promise<boolean>;

  isHidden: Promise<boolean>;

  constructor(dataRow: Selector, index: number, widgetName: string) {
    const childrenSelector = `td[aria-colindex='${index + 1}']`;

    const commandSelector = Object.values(CLASS.command)
      .map((commandClass) => `${childrenSelector}.${commandClass}`)
      .join(',');

    super(dataRow.find(commandSelector));
    this.isFocused = this.element.hasClass(CLASS.focused);
    this.isHidden = this.element.hasClass(Widget.addClassPrefix(widgetName, CLASS.hiddenColumn));
  }

  getButton(index: number): Selector {
    return this.element.child(index);
  }

  getSelectCheckBox(): Selector {
    return this.element.find(`.${CLASS.selectCheckBox}`);
  }

  getAdaptiveButton(): Selector {
    return this.element.find(`.${CLASS.adaptiveButton}`);
  }
}
