import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { WidgetName } from '../../../types';
import GridModule from '../../../gridCore/module';
import Widget from '../../../internal/widget';

const CLASS = {
  exportButton: 'export-button',
  dropDownButtonPopupWrapper: 'dx-dropdownbutton-popup-wrapper',
  exportMenu: 'export-menu',
};

export default class ExportButton extends GridModule {
  public readonly body: Locator;

  constructor(headerPanel: Locator, widgetName: WidgetName) {
    super(headerPanel.locator(`.${Widget.addClassPrefix(widgetName, CLASS.exportButton)}`), widgetName);
    this.body = headerPanel.page().locator('body');
  }

  public async expectOpened(present = true): Promise<void> {
    const menu = this.body.locator(
      `.${this.addWidgetPrefix(CLASS.exportMenu)}.${CLASS.dropDownButtonPopupWrapper}`,
    ).first();

    await (present ? expect(menu) : expect(menu).not).toBeAttached();
  }
}
