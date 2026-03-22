import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('DataGrid Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  fixture
    .disablePageReloads`Keyboard Navigation - screenshots`
    .page(url(__dirname, '../../../../container.html'));

  test('Focus goes inside master detail on tab', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', gridOptions);

      await (page.locator('.dx-data-row').click().nth(0).locator('.dx-command-edit').nth(0),
    );

    const innerDataGrid = new DataGrid(page.locator('.dx-master-detail-row').nth(0).element.find('.dx-datagrid').parent());

    await (page.locator('.dx-data-row').click().nth(0).locator('td').nth(4),
    )
      .pressKey('tab')
      .pressKey('tab');

    expect(await innerDataGrid.getHeaders().getHeaderRow(0).locator('td').nth(0).isFocused);
    await t.ok();
  });
});
