import FocusableElement from '../../internal/focusable';
import Widget from '../../internal/widget';
import { DropDownSelectPopup } from './dropDownSelectPopup';

const CLASS = {
  addRowButton: 'addrow-button',
  saveButton: 'save-button',
  cancelButton: 'cancel-button',
  exportButton: 'export-button',
  columnChooserButton: 'column-chooser-button',
  dropDownMenuButton: 'dx-dropdownmenu-button',
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

  getExportButton(): Selector {
    return this.element.find(`.${Widget.addClassPrefix(this.widgetName, CLASS.exportButton)}`);
  }

  getColumnChooserButton(): Selector {
    return this.element.find(`.${Widget.addClassPrefix(this.widgetName, CLASS.columnChooserButton)}`);
  }

  getDropDownMenuButton(): Selector {
    return this.element.find(`.${CLASS.dropDownMenuButton}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getDropDownSelectPopup(): DropDownSelectPopup {
    return new DropDownSelectPopup();
  }
}
