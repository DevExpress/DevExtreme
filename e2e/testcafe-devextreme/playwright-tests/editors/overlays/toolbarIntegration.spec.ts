import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage, isMaterial } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Popup_toolbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  ['dxPopup', 'dxPopover'].forEach((name) => {
    ['bottom', 'top'].forEach((toolbar) => {
      [true, false].forEach((rtlEnabled) => {
        test.skip(`Extended toolbar should be used in ${name},rtlEnabled=${rtlEnabled},toolbar=${toolbar}`, async ({ page }) => {
          // skipped: requires Popup/Popover page objects, Toolbar page object, hover helper
        });
      });
    });
  });

  test.skip('Popup toolbars with wide elements and overflow menu if hidden on init with toolbar items', async ({ page }) => {
    // skipped: requires Popup page object with getOverflowButton, option
  });

  test.skip('Popup toolbars with wide elements and overflow menu if hidden on init with no toolbar items', async ({ page }) => {
    // skipped: requires Popup page object with getOverflowButton, option
  });

  test.skip('Popup toolbars with wide elements and overflow menu if shown on init with toolbar items', async ({ page }) => {
    // skipped: requires Popup page object with getOverflowButton, option
  });
});
