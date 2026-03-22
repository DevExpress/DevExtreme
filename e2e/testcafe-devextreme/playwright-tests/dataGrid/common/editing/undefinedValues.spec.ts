import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
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

  fixture.disablePageReloads`Editing - undefined values`
    .disablePageReloads
    .page(url(__dirname, '../../../container.html'));

  test('Should properly set nested undefined values (T1226946)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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
        customizeText: (cellInfo) => String(cellInfo.value.data ?? 'undefined'),
      }],
      showBorders: true,
    });

      const firstCell = page.locator('.dx-data-row').nth(0).locator('td').nth(0);
    const secondCell = page.locator('.dx-data-row').nth(1).locator('td').nth(0);

    expect(await firstCell.element().textContent).toBe('100');
    expect(await secondCell.element().textContent).toBe('undefined');

    await dataGrid.apiCellValue(0, 0, { data: undefined });
    await dataGrid.apiSaveEditData();

    expect(await firstCell.element().textContent).toBe('undefined');
    expect(await secondCell.element().textContent).toBe('undefined');
  });
});
