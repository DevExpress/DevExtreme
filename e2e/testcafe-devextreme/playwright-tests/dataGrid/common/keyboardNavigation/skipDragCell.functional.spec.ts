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

  // T1147695
  fixture
    .disablePageReloads`Keyboard Navigation - skip drag cell`
    .page(url(__dirname, '../../../container.html'));

  const DATA_SOURCE = [
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
  ];
  const createDataGrid = async () => createWidget(page, 'dxDataGrid', {
    dataSource: DATA_SOURCE,
    keyExpr: 'id',
    columns: ['id', 'columnA', 'columnB'],
    rowDragging: {
      allowReordering: true,
    },
    sorting: {
      mode: 'none',
    },
  });

  const createDataGridRenderAsyncWithButtons = async () => createWidget(page, 'dxDataGrid', {
    dataSource: DATA_SOURCE,
    keyExpr: 'id',
    columns: ['id', 'columnA', 'columnB', { type: 'buttons' }],
    rowDragging: {
      allowReordering: true,
    },
    sorting: {
      mode: 'none',
    },
    renderAsync: true,
  });

  test('The drag cell should be skipped when navigating from the header cell by tab keypress', async ({ page }) => {
    await createDataGrid();

      const expectedFocusedCell = page.locator('.dx-data-row').nth(0).locator('td').nth(1);
    const cellToStartNavigation = page.locator('.dx-header-row').nth(0).locator('td').nth(3);

    await (cellToStartNavigation.element).click()
      .pressKey('tab')
      .expect(expectedFocusedCell.isFocused)
      .ok();
  });
});
