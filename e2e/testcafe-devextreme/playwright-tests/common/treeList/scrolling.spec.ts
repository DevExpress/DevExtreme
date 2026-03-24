import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Virtual Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('The vertical scroll bar of the container\'s parent should not be displayed when the grid has no height, virtual scrolling and state storing are enabled (T1129106)', async ({ page }) => {
    // skipped: requires .before() setup, ClientFunction scrollWindowTo, resizeWindow
  });

  test.skip('All items should be selected after select all and scroll down (T1189118)', async ({ page }) => {
    // skipped: requires CheckBox page object, TreeList page object with scrollTo
  });
});
