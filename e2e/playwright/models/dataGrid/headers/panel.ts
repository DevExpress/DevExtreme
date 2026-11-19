import type { Locator } from '@playwright/test';
import GridModule from '../../gridCore/module';
import ExportButton from './panelButtons/exportButton';

const CLASS = {
  applyFilterButton: 'dx-apply-button',
};

export default class HeaderPanel extends GridModule {
  public getExportButton(): ExportButton {
    return new ExportButton(this.element, this.widgetName);
  }

  public getApplyFilterButton(): Locator {
    return this.element.locator(`.${CLASS.applyFilterButton}`);
  }
}
