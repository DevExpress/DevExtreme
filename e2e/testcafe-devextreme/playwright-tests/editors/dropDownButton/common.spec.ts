import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, insertStylesheetRulesToPage } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Drop Down Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Item collection should be updated after direct option changing (T817436)', async ({ page }) => {
    // skipped: requires DropDownButton page object with getList, option methods
  });

  test.skip('DropDownButton renders correctly', async ({ page }) => {
    // skipped: requires .before() setup with t.ctx.ids, Guid
  });

  [false, true].forEach((splitButton) => {
    test.skip(`Button template, splitButton=${splitButton}`, async ({ page }) => {
      // skipped: requires jQuery template function
    });
  });
});
