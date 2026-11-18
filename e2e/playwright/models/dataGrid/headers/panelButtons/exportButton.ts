import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import Widget from '../../../internal/widget';

const CLASS = {
  exportButton: 'export-button',
  dropDownButtonPopupWrapper: 'dx-dropdownbutton-popup-wrapper',
  exportMenu: 'export-menu',
};

export default class ExportButton {
  public readonly element: Locator;

  public readonly widgetName: string;

  public readonly body: Locator;

  constructor(headerPanel: Locator, widgetName: string) {
    this.widgetName = widgetName;
    this.body = headerPanel.page().locator('body');
    this.element = headerPanel.locator(`.${Widget.addClassPrefix(this.widgetName, CLASS.exportButton)}`);
  }

  public async expectOpened(present = true): Promise<void> {
    const menu = this.body.locator(
      `.${Widget.addClassPrefix(this.widgetName, CLASS.exportMenu)}.${CLASS.dropDownButtonPopupWrapper}`,
    ).first();

    await (present ? expect(menu) : expect(menu).not).toBeAttached();
  }
}
