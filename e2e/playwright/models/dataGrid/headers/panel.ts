import type { Locator } from '@playwright/test';
import GridModule from '../../gridCore/module';
import ExportButton from './panelButtons/exportButton';

const CLASS = {
  addRowButton: 'addrow-button',
  saveButton: 'save-button',
  cancelButton: 'cancel-button',
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

  public getApplyFilterButton(): Locator {
    return this.element.locator(`.${CLASS.applyFilterButton}`);
  }
}
