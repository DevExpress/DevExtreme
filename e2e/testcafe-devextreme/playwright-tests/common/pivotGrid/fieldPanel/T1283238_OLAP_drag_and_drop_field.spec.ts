import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, PivotGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe.skip('pivotGrid_olap_drag-n-drop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [true, false].forEach((showRowGrandTotals) => {
    test(`Empty table has one ${showRowGrandTotals ? 'total' : 'empty'} row after drag-n-drop for paginated data`, async ({ page }) => {
      const paginatedData = Array.from({ length: 30 }, (_, i) => ({
        region: `Region ${Math.floor(i / 5)}`,
        city: `City ${i}`,
        amount: (i + 1) * 100,
      }));

      await createWidget(page, 'dxPivotGrid', {
        showBorders: true,
        showRowGrandTotals,
        fieldPanel: {
          visible: true,
          allowFieldDragging: true,
          showColumnFields: true,
          showRowFields: true,
          showDataFields: true,
          showFilterFields: true,
        },
        dataSource: {
          fields: [{
            dataField: 'region',
            area: 'row',
          }, {
            dataField: 'amount',
            area: 'data',
            summaryType: 'sum',
          }],
          store: paginatedData,
        },
      });

      const pivotGrid = new PivotGrid(page);
      const fieldPanel = pivotGrid.getFieldPanel();
      const rowArea = fieldPanel.getRowArea();
      const filterArea = fieldPanel.getFilterArea();

      const regionField = fieldPanel.getFieldItem(rowArea);
      const regionBox = await regionField.boundingBox();
      const filterBox = await filterArea.boundingBox();

      if (regionBox && filterBox) {
        await page.mouse.move(
          regionBox.x + regionBox.width / 2,
          regionBox.y + regionBox.height / 2,
        );
        await page.mouse.down();
        await page.mouse.move(
          filterBox.x + filterBox.width / 2,
          filterBox.y + filterBox.height / 2,
          { steps: 10 },
        );
        await page.mouse.up();
      }

      await page.waitForTimeout(500);

      const dataArea = pivotGrid.getDataArea();
      const dataRows = dataArea.locator('tr');
      const rowCount = await dataRows.count();
      expect(rowCount).toBe(1);

      await testScreenshot(page, `olap-drag-drop-empty-table-showRowGrandTotals-${showRowGrandTotals}.png`, {
        element: '#container',
      });
    });
  });
});
