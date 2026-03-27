import { test, expect } from '@playwright/test';
import { createWidget, PivotGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('pivotGrid_fieldPanel_aria_label', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const PIVOT_GRID_SELECTOR = '#container';

  test('Header fields should have correct aria-label', async ({ page }) => {

    await createWidget(page, 'dxPivotGrid', {
      allowFiltering: true,
      fieldPanel: {
        visible: true,
      },
      dataSource: {
        fields: [{
          dataField: 'row1',
          area: 'row',
        }, {
          dataField: 'row2',
          area: 'row',
        }, {
          dataField: 'column1',
          area: 'column',
        }, {
          dataField: 'column2',
          area: 'column',
        }, {
          dataField: 'column3',
          area: 'filter',
        }],
        store: [],
      },
    });

    const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
    const rowHeader = pivotGrid.getRowHeaderArea();
    const columnHeader = pivotGrid.getColumnHeaderArea();

    await expect(rowHeader.getHeaderFilterIcon(0)).toHaveAttribute('aria-label', "Show filter options for column 'Row1'");
    await expect(rowHeader.getHeaderFilterIcon(1)).toHaveAttribute('aria-label', "Show filter options for column 'Row2'");
    await expect(columnHeader.getHeaderFilterIcon(0)).toHaveAttribute('aria-label', "Show filter options for column 'Column1'");
    await expect(columnHeader.getHeaderFilterIcon(1)).toHaveAttribute('aria-label', "Show filter options for column 'Column2'");

    const filterArea = page.locator(`${PIVOT_GRID_SELECTOR} .dx-area-filter-cell`);
    await expect(filterArea.locator('.dx-header-filter').nth(0)).toHaveAttribute('aria-label', "Show filter options for column 'Column3'");

    });
});
