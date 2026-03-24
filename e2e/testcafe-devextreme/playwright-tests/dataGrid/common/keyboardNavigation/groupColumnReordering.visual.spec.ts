import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Keyboard Navigation - Group Column Reordering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [true, false].forEach((rtlEnabled) => {
    test(`reorder group column when ${rtlEnabled ? 'left' : 'right'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          {
            field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
          },
        ],
        rtlEnabled,
        groupPanel: { visible: true },
        columns: [
          { dataField: 'field1', groupIndex: 0 },
          { dataField: 'field2', groupIndex: 1 },
          { dataField: 'field3' },
          { dataField: 'field4' },
        ],
      });

      const dataGrid = new DataGrid(page);
      const groupPanel = dataGrid.getGroupPanel();
      await expect(groupPanel).toBeVisible();

      const firstGroupItem = groupPanel.locator('.dx-group-panel-item').first();
      await firstGroupItem.click();

      const arrowKey = rtlEnabled ? 'ArrowLeft' : 'ArrowRight';
      await page.keyboard.press(arrowKey);

      await testScreenshot(page, `group-column-reorder-rtl-${rtlEnabled}.png`, {
        element: '#container',
      });
    });
  });
});
