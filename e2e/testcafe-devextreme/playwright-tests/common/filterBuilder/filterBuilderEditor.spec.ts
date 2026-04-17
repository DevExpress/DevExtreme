import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import { fields, filter } from './data';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Editing events', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Change value editor to checkbox', async ({ page }) => {
    await createWidget(page, 'dxFilterBuilder', {
      fields,
      value: filter,
      allowHierarchicalFields: true,
      onEditorPreparing: (data: any) => {
        data.editorName = 'dxCheckBox';
      },
    });

    const filterBuilder = page.locator('#container');
    await filterBuilder.locator('.dx-filterbuilder-item-value-text').first().click();

    await testScreenshot(page, 'value-editor-checkbox.png', { element: '#container' });
  });

  test('Change value editor to switch', async ({ page }) => {
    await createWidget(page, 'dxFilterBuilder', {
      fields,
      value: filter,
      allowHierarchicalFields: true,
      onEditorPreparing: (data: any) => {
        data.editorName = 'dxSwitch';
      },
    });

    const filterBuilder = page.locator('#container');
    await filterBuilder.locator('.dx-filterbuilder-item-value-text').first().click();

    await testScreenshot(page, 'value-editor-switch.png', { element: '#container' });
  });
});
