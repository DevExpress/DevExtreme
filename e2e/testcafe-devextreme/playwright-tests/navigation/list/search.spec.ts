import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('List with search bar appearance', async ({ page }) => {

    await setAttribute(page, '#container', 'style', 'display: flex; gap: 40px; padding: 8px; width: fit-content;');

    const dataSource = Array.from({ length: 8 }, (_, i) => `Item_${i + 1}`);
    const selectionModes = ['none', 'single', 'multiple', 'all'];

    await Promise.all(selectionModes.map((mode) => appendElementTo(page, '#container', 'div', `list-${mode}`)));
    await Promise.all(selectionModes.map((mode) => createWidget(page, 'dxList', {
      dataSource,
      height: 400,
      width: 200,
      searchEnabled: true,
      showSelectionControls: true,
      selectionMode: mode,
    }, `#list-${mode}`)));

    await testScreenshot(page, 'List with search.png', { element: '#container' });

    });
});
