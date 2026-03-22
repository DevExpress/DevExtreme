import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('PivotGrid_scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const createData = (count, innerCount) => {
    const result: object[] = [];

    for (let i = 0; i < count; i += 1) {
      for (let j = 0; j < innerCount; j += 1) {
        result.push({
          item: `item ${i}`,
          date: new Date('2024-01-01'),
          category: `category ${j}`,
          innerA: j,
          innerB: j,
        });
      }
    }

    return result;
  };

  test('Row fields overlap data fields if dataFieldArea is set to "row" and virtual scrolling is enabled (T1210807)', async ({ page }) => {
    await createWidget(page, 'dxPivotGrid', {
    allowExpandAll: true,
    showBorders: true,
    rowHeaderLayout: 'tree',
    dataFieldArea: 'row',
    height: 560,
    scrolling: {
      mode: 'virtual',
    },
    dataSource: {
      fields: [
        {
          dataField: 'item',
          area: 'row',
          width: 120,
        },
        {
          dataField: 'category',
          area: 'row',
          width: 120,
        },
        {
          dataField: 'date',
          dataType: 'date',
          area: 'column',
          groupInterval: 'year',
        },
        {
          dataField: 'innerA',
          dataType: 'number',
          summaryType: 'sum',
          area: 'data',
        },
        {
          dataField: 'innerB',
          dataType: 'number',
          summaryType: 'sum',
          area: 'data',
        },
      ],
      store: createData(50, 5),
    },
  });

    const pivotGrid = page.locator('#container');
    const firstHeaderRow = pivotGrid.getRowsArea(2).getCell(0);
    await page.click(firstHeaderRow);
    await pivotGrid.scrollBy({ top: 30000 });

    await testScreenshot(page, 'rows_do_not_overlap_data_fields_if_virtual_scrolling_enabled_T1210807.png', { element: pivotGrid.element });

    });
});
