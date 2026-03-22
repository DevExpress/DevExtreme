import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('pivotGrid_olap_drag-n-drop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const PIVOT_GRID_SELECTOR = '#container';

  [true, false].forEach((showRowGrandTotals) => {
    test(`Empty table has one ${showRowGrandTotals ? 'total' : 'empty'} row after drag-n-drop for paginated data`, async ({ page }) => {

      const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
      const loadPanel = pivotGrid.getLoadPanel();

      await expect(loadPanel.isInvisible()).ok();
      await pivotGrid.scrollTo({ top: 5000 });
      await page.waitForTimeout(1000)
        .expect(loadPanel.isInvisible()).ok();
      await dragToElement(
        pivotGrid.getRowHeaderArea().getField(),
        pivotGrid.getColumnHeaderArea().element,

      await expect(loadPanel.isInvisible()).ok();

      await testScreenshot(page,
        `empty_table_after_dnd (showRowGrandTotals=${showRowGrandTotals}).png`,
        { element: pivotGrid.element },

    });.before(async ({ page }) => {
      await addRequestHooks(OLAPApiMock);
      await createWidget(page, 'dxPivotGrid', {
        height: 500,
        fieldPanel: { visible: true },
        showRowGrandTotals,
        scrolling: { mode: 'virtual', useNative: false },
        dataSource: {
          paginate: true,
          fields: [
            { dataField: '[Customer].[Customer]', area: 'row' },
            { dataField: '[Ship Date].[Calendar Year]', area: 'column' },
            { dataField: '[Measures].[Internet Sales Amount]', area: 'data' },
          ],
          store: {
            type: 'xmla',
            url: 'https://api/data',
            catalog: 'Catalog',
            cube: 'Cube',
          },
        },
      });
    });
  });
});
