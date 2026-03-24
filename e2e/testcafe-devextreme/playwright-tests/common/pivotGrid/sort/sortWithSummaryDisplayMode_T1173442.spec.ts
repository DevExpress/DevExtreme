import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('pivotGrid_sort', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Should apply sort changes to the markup if the "summaryDisplayMode" is set', async ({ page }) => {
    await createWidget(page, 'dxPivotGrid', {
    allowSortingBySummary: true,
    allowSorting: true,
    fieldPanel: {
      showFilterFields: false,
      visible: true,
    },
    dataSource: {
      fields: [{
        dataField: 'row',
        area: 'row',
      }, {
        dataField: 'column',
        area: 'column',
      }, {
        dataField: 'value',
        dataType: 'number',
        summaryType: 'sum',
        area: 'data',
        summaryDisplayMode: 'percentVariation',
      }],
      store: [
        {
          row: 'row_A',
          column: 'column_A',
          value: 100,
        },
        {
          row: 'row_A',
          column: 'column_A',
          value: 100,
        },
        {
          row: 'row_A',
          column: 'column_B',
          value: 150,
        },
        {
          row: 'row_A',
          column: 'column_B',
          value: 150,
        },
        {
          row: 'row_A',
          column: 'column_C',
          value: 200,
        },
        {
          row: 'row_A',
          column: 'column_C',
          value: 200,
        },
        {
          row: 'row_B',
          column: 'column_A',
          value: 100,
        },
        {
          row: 'row_B',
          column: 'column_A',
          value: 100,
        },
        {
          row: 'row_B',
          column: 'column_B',
          value: 150,
        },
        {
          row: 'row_B',
          column: 'column_B',
          date: '2022-01-02',
          value: 150,
        },
        {
          row: 'row_B',
          column: 'column_C',
          value: 200,
        },
        {
          row: 'row_B',
          column: 'column_C',
          date: '2022-01-02',
          value: 200,
        },
      ],
    },
  });

    const pivotGrid = page.locator('#container');

    await testScreenshot(page,
      'T1173442_before_sort_with_summary_display_mode.png',
      { element: pivotGrid.element },
    );

    await click(pivotGrid.getColumnHeaderArea().getField());
    await click(pivotGrid.getRowHeaderArea().getField());
    await testScreenshot(page,
      'T1173442_after_sort_with_summary_display_mode.png',
      { element: pivotGrid.element },
    );

    });
});
