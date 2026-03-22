import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
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
  // T1156153

  test('Fixed columns should have same width as not fixed columns with columnAutoWidth: true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
        dataSource: [
          {
            id: 0,
            // long group name causes the issue
            group: 'VERY LONG GROUP TEXT VERY LONG GROUP TEXT VERY LONG GROUP TEXT',
            dataA: 'DATA_A',
            dataB: 'DATA_B',
            dataC: 'DATA_C',
            dataD: 'DATA_D',
            dataE: 'DATA_E',
            dataF: 'DATA_F',
            dataG: 'DATA_G',
            dataH: 'DATA_H',
          }, {
            id: 1,
            group: 0,
            dataA: 'DATA_A',
            dataB: 'DATA_B',
            dataC: 'DATA_C',
            dataD: 'DATA_D',
            dataE: 'DATA_E',
            dataF: 'DATA_F',
            dataG: 'DATA_G',
            dataH: 'DATA_H',
          },
        ],
        keyExpr: 'id',
        allowColumnReordering: true,
        showBorders: true,
        grouping: {
          autoExpandAll: true,
        },
        columnAutoWidth: true,
        scrolling: { mode: 'standard', useNative: true },
        columnFixing: {
          // @ts-expect-error private option
          legacyMode: true,
        },
        columns: [
          {
            dataField: 'dataA',
            fixed: true,
          },
          'dataB',
          'dataC',
          'dataD',
          'dataE',
          'dataF',
          'dataG',
          'dataH',
          {
            dataField: 'group',
            groupIndex: 0,
          },
        ],
      });

      await createWidget(page, 'dxDataGrid',
        {
          dataSource: [
            {
              id: 0,
              group: 'VERY LONG GROUP TEXT VERY LONG GROUP TEXT VERY LONG GROUP TEXT',
              dataA: 'DATA_A',
              dataB: 'DATA_B',
              dataC: 'DATA_C',
              dataD: 'DATA_D',
              dataE: 'DATA_E',
              dataF: 'DATA_F',
              dataG: 'DATA_G',
              dataH: 'DATA_H',
            }, {
              id: 1,
              group: 0,
              dataA: 'DATA_A',
              dataB: 'DATA_B',
              dataC: 'DATA_C',
              dataD: 'DATA_D',
              dataE: 'DATA_E',
              dataF: 'DATA_F',
              dataG: 'DATA_G',
              dataH: 'DATA_H',
            },
          ],
          keyExpr: 'id',
          allowColumnReordering: true,
          showBorders: true,
          grouping: {
            autoExpandAll: true,
          },
          columnAutoWidth: true,
          scrolling: { mode: 'standard', useNative: true },
          columns: [
            'dataA',
            'dataB',
            'dataC',
            'dataD',
            'dataE',
            'dataF',
            'dataG',
            'dataH',
            {
              dataField: 'group',
              groupIndex: 0,
            },
          ],
        },
        '#otherContainer',
      );

        const firstFixedCell = dataGridWidthFixedColumns.locator('td').nth(1, 0);
    const firstCell = dataGridUsual.locator('td').nth(1, 0);

    const fixedCellWidth = await firstFixedCell.element().clientWidth;
    const cellWidth = await firstCell.element().clientWidth;

    expect(await fixedCellWidth).toBe(cellWidth);
  });
});
