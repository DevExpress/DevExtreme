import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Grouping Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('Grouping Panel label should not overflow in a narrow grid (T1103925)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: {
        store: [
          {
            field1: '1', field2: '2', field3: '3', field4: '4', field5: '5',
          },
          {
            field1: '11', field2: '22', field3: '33', field4: '44', field5: '55',
          }],
      },
      width: 200,
      groupPanel: {
        emptyPanelText: 'Long long long long long long long long long long long text',
        visible: true,
      },
      editing: { allowAdding: true, mode: 'batch' },
      columnChooser: {
        enabled: true,
      },
    });

      await testScreenshot(page, 'groupingPanel.png', { element: page.locator('.dx-toolbar') });
  });
});
