import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Editing - undefined values', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Should properly set nested undefined values (T1226946)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [{
        id: 0,
        value: {
          data: 100,
        },
      }, {
        id: 1,
        value: {
          data: undefined,
        },
      }],
      keyExpr: 'id',
      columns: [{
        dataField: 'value',
        customizeText: (cellInfo: any) => String(cellInfo.value.data ?? 'undefined'),
      }],
      showBorders: true,
    }));

    const dataGrid = new DataGrid(page);
    const firstCell = dataGrid.getDataCell(0, 0);
    const secondCell = dataGrid.getDataCell(1, 0);

    await expect(firstCell).toHaveText('100');
    await expect(secondCell).toHaveText('undefined');

    await dataGrid.apiCellValue(0, 0, { data: undefined });
    await dataGrid.apiSaveEditData();

    await expect(firstCell).toHaveText('undefined');
    await expect(secondCell).toHaveText('undefined');
  });
});
