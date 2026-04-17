import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe.skip('FileManager', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Custom DropDown width for Material and Fluent themes', async ({ page }) => {
    await createWidget(page, 'dxFileManager', {
    name: 'fileManager',
    fileSystemProvider: [],
    height: 450,
  });

    const viewModeButton = page.locator('.dx-filemanager-toolbar-viewmode-item');

    await viewModeButton.click();

    await testScreenshot(page, 'drop down width.png', { element: '#container' });

    });
});
