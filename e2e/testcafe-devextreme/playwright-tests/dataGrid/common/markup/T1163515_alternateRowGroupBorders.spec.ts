import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Grouping Panel - check borders and backgrounds with various options', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Should have correct applied styles with rowAlternationEnabled: true, showColumnLines: true, showRowLines: true, showBorders: true, hasFixedColumn: false, hasMasterDetail: false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Item 1', group: 'A' },
        { id: 2, name: 'Item 2', group: 'A' },
        { id: 3, name: 'Item 3', group: 'B' },
        { id: 4, name: 'Item 4', group: 'B' },
      ],
      keyExpr: 'id',
      rowAlternationEnabled: true,
      showColumnLines: true,
      showRowLines: true,
      showBorders: true,
      columns: [
        { dataField: 'group', groupIndex: 0 },
        'name',
      ],
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await testScreenshot(page, 'alternateRow-group-borders.png', {
      element: '#container',
    });
  });
});
