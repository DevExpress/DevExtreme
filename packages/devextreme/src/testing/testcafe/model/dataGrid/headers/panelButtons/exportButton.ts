import { Selector } from 'testcafe';
import Widget from '../../../internal/widget';

const CLASS = {
  exportButton: 'export-button',
  dropDownButtonPopupWrapper: 'dx-dropdownbutton-popup-wrapper',
  exportMenu: 'export-menu',
};

export default class ExportButton {
  element: Selector;

  widgetName: string;

  body = Selector('body');

  isOpened: Promise<boolean>;

  constructor(headerPanel: Selector, widgetName: string) {
    this.widgetName = widgetName;
    this.element = headerPanel.find(`.${Widget.addClassPrefix(this.widgetName, CLASS.exportButton)}`);
    this.isOpened = this.body.find(`.${Widget.addClassPrefix(this.widgetName, CLASS.exportMenu)}.${CLASS.dropDownButtonPopupWrapper}`).exists;
  }
}
