import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Grouping Panel - Borders with enabled alternate rows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const GRID_SELECTOR = '#container';

  const generateData = (rowCount) => new Array(rowCount).fill(null).map((_, idx) => ({
    A: `A_${idx}`,
    B: `B_${idx}`,
    C: `C_${idx}`,
  }));

  test('Alternate rows should be the same size', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: generateData(10),
      columns: ['A', 'B', {
        dataField: 'C',
        cellTemplate: ($container, { value }) => {
          const $root = $('<div>');
          $('<div>')
            .text('C template')
            .appendTo($root);
          $('<div>')
            .text(value)
            .appendTo($root);
          $root.appendTo($container);
        },
      }],
      onCellPrepared: ({ cellElement, value }) => {
        if (typeof value === 'string' && value.startsWith('B')) {
          // @ts-expect-error todo check
          cellElement.html(`
          <div>
            <div>B template:</div>
            <div>${value}</div>
          </div>
          `);
        }
      },
      showRowLines: false,
      rowAlternationEnabled: true,
    });

      await testScreenshot(page, 'T838734_alternate-rows-same-size.png', { element: page.locator('#container') });
  });
});
