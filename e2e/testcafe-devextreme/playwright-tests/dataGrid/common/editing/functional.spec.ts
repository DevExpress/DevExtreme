import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Editing.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const getGridConfig = (config): Record<string, unknown> => {
    const defaultConfig = {
      errorRowEnabled: true,
      dataSource: [{
        id: 1, name: 'Alex', age: 15, lastName: 'John',
      }],
      keyExpr: 'id',
      legacyRendering: false,
    };

    return config ? { ...defaultConfig, ...config } : defaultConfig;
  };

  test('Focused cell should be switched to the editing mode after onSaving\'s promise is resolved (T1190566)', async ({ page }) => {
    await page.evaluate(() => {
        (window as any).deferred = $.Deferred();
      });

      return createWidget(page, 'dxDataGrid', {
        dataSource: [
          { id: 1, field1: 'value1' },
          { id: 2, field1: 'value2' },
          { id: 3, field1: 'value3' },
          { id: 4, field1: 'value4' },
        ],
        keyExpr: 'id',
        showBorders: true,
        columns: ['field1'],
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
        onSaving(e) {
          e.promise = (window as any).deferred;
        },
      });

      const resolveOnSavingDeferred = ClientFunction(() => (window as any).deferred.resolve());

    await (page.locator('.dx-data-row').nth(0).locator('td').nth(0)).click();
    await (page.locator('.dx-data-row').nth(0).locator('td').nth(0)).fill('new_value');
    await page.keyboard.press('tab tab');
    await resolveOnSavingDeferred();
    expect(await page.locator('.dx-data-row').nth(2).locator('td').nth(0).isEditCell).toBeTruthy();
  });
    // TODO: .after() block removed
});
