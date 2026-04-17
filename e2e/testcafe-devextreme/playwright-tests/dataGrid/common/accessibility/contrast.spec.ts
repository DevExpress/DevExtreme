import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

test.describe.skip('DataGrid - contrast', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('DataGrid - Contrast between icons in the Filter Row menu and their background doesn\'t comply with WCAG accessibility standards', async ({ page }) => {
    // TODO: Playwright migration - filter menu button not visible (requires hover before click)
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(3, 3),
      filterRow: { visible: true },
    });

    const dataGrid = new DataGrid(page);
    const filterCell = dataGrid.getFilterCell(0);
    const menuButton = filterCell.locator('.dx-editor-with-menu .dx-menu');

    await menuButton.click();

    await testScreenshot(page, 'filter-row-menu-contrast-T1257970.png', {
      element: '#container',
    });
  });

  test('DataGrid - Filter icon should remain visible when it\'s focused', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(3, 3),
      filterRow: { visible: true },
      headerFilter: { visible: true },
    });

    const dataGrid = new DataGrid(page);
    const headerFilterIcon = page.locator('.dx-header-filter').first();
    await headerFilterIcon.click();

    await testScreenshot(page, 'T1286345-datagrid-menu-icon-when-focused.png', {
      element: '#container',
    });
  });
});
