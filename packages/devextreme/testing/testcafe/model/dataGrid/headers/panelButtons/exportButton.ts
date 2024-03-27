import Widget from '../../../internal/widget';
import { getRootContainer } from '../../../../helpers/domUtils';

const CLASS = {
  exportButton: 'export-button',
  dropDownButtonPopupWrapper: 'dx-dropdownbutton-popup-wrapper',
  exportMenu: 'export-menu',
};

export default class ExportButton {
  element: Selector;

  widgetName: string;

  root = getRootContainer();

  isOpened: Promise<boolean>;

  constructor(headerPanel: Selector, widgetName: string) {
    this.widgetName = widgetName;
    this.element = headerPanel.find(`.${Widget.addClassPrefix(this.widgetName, CLASS.exportButton)}`);
    this.isOpened = this.root.find(`.${Widget.addClassPrefix(this.widgetName, CLASS.exportMenu)}.${CLASS.dropDownButtonPopupWrapper}`).exists;
  }
}
