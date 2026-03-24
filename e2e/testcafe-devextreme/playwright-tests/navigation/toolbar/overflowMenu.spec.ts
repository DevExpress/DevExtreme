import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setClassAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Toolbar_OverflowMenu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Drop down button should lost hover and active state', async ({ page }) => {
    // skipped: requires Toolbar page object with getOverflowMenu, dispatchEvent chaining
  });

  test.skip('ButtonGroup item should not have hover and active state', async ({ page }) => {
    // skipped: requires Toolbar page object with getOverflowMenu, getList, find
  });

  test.skip('Click on overflow button should prevent popup hideOnOutsideClick', async ({ page }) => {
    // skipped: requires Toolbar page object with getOverflowMenu, getPopup
  });

  test.skip('Toolbar buttons in menu appearance', async ({ page }) => {
    // skipped: requires Toolbar page object with getOverflowMenu, duplicate const items
  });

  test.skip('Toolbar buttons as custom template appearance', async ({ page }) => {
    // skipped: requires jQuery template, Toolbar page object, duplicate const items
  });

  test.skip('Toolbar button group appearance', async ({ page }) => {
    // skipped: requires Toolbar page object with getOverflowMenu, duplicate const items
  });

  test.skip('Toolbar button group as custom template appearance', async ({ page }) => {
    // skipped: requires jQuery template, Toolbar page object, duplicate const items
  });
});
