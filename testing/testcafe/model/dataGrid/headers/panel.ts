import FocusableElement from '../../internal/focusable';
import Widget from '../../internal/widget';

const CLASS = {
  addRowButton: 'addrow-button',
  saveButton: 'save-button',
  cancelButton: 'cancel-button',
};

export default class HeaderPanel extends FocusableElement {
  widgetName: string;

  constructor(element: Selector, widgetName: string) {
    super(element);
    this.widgetName = widgetName;
  }

  getAddRowButton(): Selector {
    return this.element.find(`.${Widget.addClassPrefix(this.widgetName, CLASS.addRowButton)}`);
  }

  getSaveButton(): Selector {
    return this.element.find(`.${Widget.addClassPrefix(this.widgetName, CLASS.saveButton)}`);
  }

  getCancelButton(): Selector {
    return this.element.find(`.${Widget.addClassPrefix(this.widgetName, CLASS.cancelButton)}`);
  }
}
