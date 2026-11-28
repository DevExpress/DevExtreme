import FocusableElement from '../../internal/focusable';
import Widget from '../../internal/widget';
import ExportButton from './panelButtons/exportButton';

const CLASS = {
  addRowButton: 'addrow-button',
  columnChooserButton: 'column-chooser-button',
  applyFilterButton: 'dx-apply-button',
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

  getExportButton(): ExportButton {
    return new ExportButton(this.element, this.widgetName);
  }

  getColumnChooserButton(): Selector {
    return this.element.find(`.${Widget.addClassPrefix(this.widgetName, CLASS.columnChooserButton)}`);
  }

  getApplyFilterButton(): Selector {
    return this.element.find(`.${CLASS.applyFilterButton}`);
  }
}
