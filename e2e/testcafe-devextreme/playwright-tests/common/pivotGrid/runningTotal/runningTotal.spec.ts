import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, PivotGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('PivotGrid: running total', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const PIVOT_GRID_SELECTOR = '#container';

  const seamlessData = [
    {
      month: 'A',
      value: 1,
      first_row: '0_0',
      second_row: '0_1',
    },
    {
      month: 'B',
      value: 1,
      first_row: '0_0',
      second_row: '0_1',
    },
    {
      month: 'C',
      value: 1,
      first_row: '0_0',
      second_row: '0_1',
    },
    {
      month: 'A',
      value: 2,
      first_row: '1_0',
      second_row: '1_1',
    },
    {
      month: 'B',
      value: 2,
      first_row: '1_0',
      second_row: '1_1',
    },
    {
      month: 'C',
      value: 2,
      first_row: '1_0',
      second_row: '1_1',
    },
  ];

  const partialData = [
    {
      month: 'A',
      value: 1,
      first_row: '0_0',
      second_row: '0_1',
    },
    {
      month: 'B',
      value: 2,
      first_row: '1_0',
      second_row: '1_1',
    },
    {
      month: 'C',
      value: 3,
      first_row: '2_0',
      second_row: '2_1',
    },
  ];

  test('Should correctly sum cells values with runningTotal', async ({ page }) => {
    await createWidget(page, 'dxPivotGrid', {
    dataSource: {
      fields: [
        {
          dataField: 'first_row',
          area: 'row',
          expanded: true,
        },
        {
          dataField: 'second_row',
          area: 'row',
        },
        {
          dataField: 'value',
          dataType: 'number',
          summaryType: 'sum',
          area: 'data',
          runningTotal: 'row',
        },
        {
          dataField: 'month',
          area: 'column',
        },
      ],
      store: seamlessData,
    },
  });

    const container = page.locator(PIVOT_GRID_SELECTOR);

    await testScreenshot(page, 'running-total_seamless-data.png', { element: container });

    });

  test('Should correctly sum cells values with runningTotal with partial data (T1144885)', async ({ page }) => {
    await createWidget(page, 'dxPivotGrid', {
    dataSource: {
      fields: [
        {
          dataField: 'first_row',
          area: 'row',
          expanded: true,
        },
        {
          dataField: 'second_row',
          area: 'row',
        },
        {
          dataField: 'value',
          dataType: 'number',
          summaryType: 'sum',
          area: 'data',
          runningTotal: 'row',
        },
        {
          dataField: 'month',
          area: 'column',
        },
      ],
      store: partialData,
    },
  });

    const container = page.locator(PIVOT_GRID_SELECTOR);

    await testScreenshot(page, 'running-total_partial-data_render-0.png', { element: container });

    const rowToCollapse = page.locator(`${PIVOT_GRID_SELECTOR} .dx-pivotgrid-vertical-headers td`).nth(3);
    await rowToCollapse.click();

    await testScreenshot(page, 'running-total_partial-data_render-1.png', { element: container });

    });
});
