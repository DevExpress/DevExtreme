import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

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
    .disablePageReloads`Keyboard Navigation - custom buttons`
    .page(url(__dirname, '../../../container.html'));

  const createDataGrid = async () => createWidget(page, 'dxDataGrid', {
    dataSource: [
      {
        id: 1,
        columnA: 'A_0',
        columnB: 'B_0',
      },
      {
        id: 2,
        columnA: 'A_1',
        columnB: 'B_1',
      },
      {
        id: 3,
        columnA: 'A_2',
        columnB: 'B_2',
      },
    ],
    keyExpr: 'id',
    columns: [
      {
        type: 'buttons',
        buttons: [
          {
            hint: 'button_1',
            icon: 'edit',
            onClick: (e) => $(e.event.target).attr('has-been-clicked', 'true'),
          },
          {
            hint: 'button_2',
            icon: 'remove',
          },
        ],
      },
      'id',
      'columnA',
      'columnB',
    ],
    sorting: {
      mode: 'none',
    },
  });

  test('Custom buttons cell should be focused before custom buttons on tab navigation', async ({ page }) => {
    await createDataGrid();

      const expectedFocusedCell = page.locator('.dx-data-row').nth(0).locator('td').nth(0);
    const cellToStartNavigation = page.locator('.dx-header-row').nth(0).locator('td').nth(3);

    await (cellToStartNavigation.element).click();
    await page.keyboard.press('tab');
    expect(await expectedFocusedCell.isFocused);
    await t.ok();
  });
});
