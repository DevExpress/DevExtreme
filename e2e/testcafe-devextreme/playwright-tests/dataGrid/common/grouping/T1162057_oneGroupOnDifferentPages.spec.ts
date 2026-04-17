import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Grouping Panel - One group on different pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 800 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Group panel restored from cache and ends at the next page', async ({ page }) => {
    const data = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      group: i < 25 ? 'Group A' : 'Group B',
    }));

    await createWidget(page, 'dxDataGrid', {
      dataSource: data,
      keyExpr: 'id',
      columns: [
        { dataField: 'group', groupIndex: 0 },
        'name',
      ],
      paging: {
        pageSize: 20,
      },
      grouping: {
        autoExpandAll: true,
      },
      groupPanel: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await dataGrid.apiPageIndex(1);

    const groupRows = dataGrid.getGroupRowSelector();
    await expect(groupRows.first()).toBeVisible();
  });
});
