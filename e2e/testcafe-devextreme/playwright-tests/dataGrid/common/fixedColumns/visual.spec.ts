import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('FixedColumns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // T1148937

  test('Hovering over a row should work correctly when there is a fixed column and a column with a cellTemplate (React)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
        dataSource: [...new Array(2)].map((_, index) => ({ id: index, text: `item ${index}` })),
        keyExpr: 'id',
        renderAsync: false,
        hoverStateEnabled: true,
        templatesRenderAsynchronously: true,
        columns: [
          { dataField: 'id', fixed: true },
          { dataField: 'text', cellTemplate: '#test' },
        ],
        columnFixing: {
          // @ts-expect-error private option
          legacyMode: true,
        },
        showBorders: true,
      });

      await page.waitForTimeout(100);

      // simulating async rendering in React
      await page.evaluate(() => {
        const dataGrid = ($('#container') as any).dxDataGrid('instance');

        // eslint-disable-next-line no-underscore-dangle
        dataGrid.getView('rowsView')._templatesCache = {};

        // eslint-disable-next-line no-underscore-dangle
        dataGrid._getTemplate = () => ({
          render(options) {
            setTimeout(() => {
              ($(options.container) as any).append(($('<div/>') as any).text(options.model.value));
              options.deferred?.resolve();
            }, 100);
          },
        });

        dataGrid.repaint();
      });

      await page.waitForTimeout(200);

    // arrange
      const firstDataRow = page.locator('.dx-data-row').nth(0);
    const firstFixedDataRow = dataGrid.getFixedDataRow(0);
    const secondDataRow = page.locator('.dx-data-row').nth(1);
    const secondFixedDataRow = dataGrid.getFixedDataRow(1);
    // act
    await (firstDataRow.element).hover();

    // assert
    await testScreenshot(page, 'T1148937-grid-hover-row-1.png', { element: page.locator('#container') });

    expect(await firstDataRow.isHovered);
    await t.ok();
    expect(await firstFixedDataRow.isHovered);
    await t.ok();

    // act
    await (secondFixedDataRow.element).hover();

    // assert
    await testScreenshot(page, 'T1148937-grid-hover-row-2.png', { element: page.locator('#container') });

    expect(await secondDataRow.isHovered);
    await t.ok();
    expect(await secondFixedDataRow.isHovered);
    await t.ok();
    expect(await compareResults.isValid());
    await t.ok(compareResults.errorMessages());
  });
});
