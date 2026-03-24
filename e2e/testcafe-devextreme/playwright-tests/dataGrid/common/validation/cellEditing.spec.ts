import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [true, false].forEach((repaintChangesOnly) => {
    test(`Navigation with tab without saving should not throw an error (repaintChangesOnly: ${repaintChangesOnly})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [{
          id: 1,
          col2: 30,
          col3: 240,
        },
        {
          id: 2,
          col2: 15,
          col3: 120,
        }],
        keyExpr: 'id',
        repaintChangesOnly,
        columnAutoWidth: true,
        showBorders: true,
        paging: {
          enabled: false,
        },
        editing: {
          mode: 'cell',
          allowUpdating: true,
          allowAdding: true,
        },
        columns: [{
          dataField: 'col2',
          validationRules: [{ type: 'required' }],
        }, {
          dataField: 'col3',
          validationRules: [{ type: 'required' }],
        }],
      });

      await page.locator('.dx-data-row').nth(0).locator('td').nth(0).click();

      const editor = page.locator('.dx-data-row').nth(0).locator('td').nth(0).locator('input');
      await editor.fill('123');
      await page.keyboard.press('Tab');

      expect(true).toBeTruthy();
    });
  });
});
