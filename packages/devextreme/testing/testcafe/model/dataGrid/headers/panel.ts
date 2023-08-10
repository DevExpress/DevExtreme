import FocusableElement from '../../internal/focusable';
import Widget from '../../internal/widget';
import { DropDownSelectPopup } from './dropDownSelectPopup';
import ExportButton from './panelButtons/exportButton';

const CLASS = {
  addRowButton: 'addrow-button',
  saveButton: 'save-button',
  cancelButton: 'cancel-button',
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

  getExportButton(): ExportButton {
    return new ExportButton(this.element, this.widgetName);
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
