import type { Locator } from '@playwright/test';
import GridModule from '../../gridCore/module';
import { DropDownSelectPopup } from './dropDownSelectPopup';
import ExportButton from './panelButtons/exportButton';

const CLASS = {
  addRowButton: 'addrow-button',
  saveButton: 'save-button',
  cancelButton: 'cancel-button',
  columnChooserButton: 'column-chooser-button',
  dropDownMenuButton: 'dx-dropdownmenu-button',
  applyFilterButton: 'dx-apply-button',
};

export default class HeaderPanel extends GridModule {
  public getAddRowButton(): Locator {
    return this.element.locator(`.${this.addWidgetPrefix(CLASS.addRowButton)}`);
  }

  public getSaveButton(): Locator {
    return this.element.locator(`.${this.addWidgetPrefix(CLASS.saveButton)}`);
  }

  public getCancelButton(): Locator {
    return this.element.locator(`.${this.addWidgetPrefix(CLASS.cancelButton)}`);
  }

  public getExportButton(): ExportButton {
    return new ExportButton(this.element, this.widgetName);
  }

  public getColumnChooserButton(): Locator {
    return this.element.locator(`.${this.addWidgetPrefix(CLASS.columnChooserButton)}`);
  }

  public getDropDownMenuButton(): Locator {
    return this.element.locator(`.${CLASS.dropDownMenuButton}`);
  }

  public getApplyFilterButton(): Locator {
    return this.element.locator(`.${CLASS.applyFilterButton}`);
  }

  public getDropDownSelectPopup(): DropDownSelectPopup {
    return new DropDownSelectPopup(this.element.page());
  }
}
