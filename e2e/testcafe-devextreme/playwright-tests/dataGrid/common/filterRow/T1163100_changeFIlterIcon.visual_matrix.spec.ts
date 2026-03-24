import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Header Filter T1163100 change filter icon', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const generateTestData = (rowCount: number) => new Array(rowCount)
    .fill(null)
    .map((_, idx) => ({
      dataA: `A_${idx}`,
      dataB: `B_${idx}`,
      dataC: `C_${idx}`,
      dataD: `D_${idx}`,
    }));

  [
    ['usual', ['dataA', 'dataB']],
    ['fixed', [{ dataField: 'dataA', fixed: true }, { dataField: 'dataB', fixed: true }]],
  ].forEach(([firstColumnsName, firstColumns]) => {
    [
      ['usual', ['dataC', 'dataD']],
      ['band', [{ caption: 'Band column', columns: ['dataC', 'dataD'] }]],
    ].forEach(([secondColumnsName, secondColumns]) => {
      ([
        ['usual', undefined],
        ['virtual', { columnRenderingMode: 'virtual', rowRenderingMode: 'virtual' }],
      ] as const).forEach(([scrollingName, scrolling]) => {
        test(`Should change filter row icon (columns ${firstColumnsName} ${secondColumnsName}, scrolling ${scrollingName}`, async ({ page }) => {
          await createWidget(page, 'dxDataGrid', {
            dataSource: generateTestData(10),
            filterRow: { visible: true },
            scrolling,
            columns: [...(firstColumns as any[]), ...(secondColumns as any[])],
          });

          const dataGrid = new DataGrid(page);
          const filterCell = dataGrid.getFilterCell(0);
          const menuButton = filterCell.locator('.dx-editor-with-menu .dx-menu');

          await menuButton.click();

          const menuItem = page.locator('.dx-menu-item').filter({ hasText: 'Does not equal' });
          await menuItem.click();

          await testScreenshot(page, `filter-icon-changed-${firstColumnsName as string}-${secondColumnsName as string}-${scrollingName}.png`, {
            element: '#container',
          });
        });
      });
    });
  });
});
