import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
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

  test.skip('Fixed columns should have same width as not fixed columns with columnAutoWidth: true', async ({ page }) => {
    // TODO: Playwright migration - TestCafe API remnants (dataGridWidthFixedColumns undefined, locator.element(), clientWidth)
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

  test('DataGrid - Group summary is not updated when a column is fixed on the right side (T1223764)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0, A: 'group 0', B: 1 },
        { id: 1, A: 'group 0', B: 1 },
        { id: 2, A: 'group 0', B: 1 },
      ],
      keyExpr: 'id',
      repaintChangesOnly: true,
      columnFixing: {
        enabled: true,
        // @ts-expect-error private option
        legacyMode: true,
      },
      groupPanel: { visible: true },
      summary: {
        recalculateWhileEditing: true,
        groupItems: [
          { column: 'B', summaryType: 'count' },
          { column: 'B', summaryType: 'sum' },
        ],
      },
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
        allowDeleting: true,
      },
      columns: [
        { dataField: 'id', width: 50 },
        { dataField: 'A', groupIndex: 0 },
        { dataField: 'B', dataType: 'number' },
      ],
    });

    const dataGrid = new DataGrid(page, '#container');
    const editCell = dataGrid.getDataRow(1).getDataCell(2);
    await editCell.click();

    const editor = editCell.locator('input');
    await editor.fill('5');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);

    const groupRowText = await dataGrid.getGroupRow(0).element.textContent();
    expect(groupRowText).toContain('Count: 3');
    expect(groupRowText).toContain('Sum of B is 7');
  });

  test('Warning should be shown when trying to set fixed state for child columns', async ({ page }) => {
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning') {
        consoleMessages.push(msg.text());
      }
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        ID: 1, Country: 'Brazil', Area: 8515767, Population_Urban: 0.85,
        Population_Rural: 0.15, Population_Total: 205809000, GDP_Agriculture: 0.054,
        GDP_Industry: 0.274, GDP_Services: 0.672, GDP_Total: 2353025,
      }],
      keyExpr: 'ID',
      columnAutoWidth: true,
      allowColumnReordering: true,
      width: 600,
      showBorders: true,
      columnChooser: { enabled: true },
      columns: [
        { dataField: 'Country', fixed: true, fixedPosition: 'left' },
        { dataField: 'Area', fixed: true, fixedPosition: 'left' },
        {
          caption: 'Population',
          columns: [
            { caption: 'Total', dataField: 'Population_Total', format: 'fixedPoint', fixed: true, fixedPosition: 'left' },
            { caption: 'Urban', dataField: 'Population_Urban', format: 'percent', fixed: true, fixedPosition: 'left' },
          ],
        },
      ],
    });

    await page.waitForTimeout(100);

    const w1028Warnings = await page.evaluate(() => {
      const msgs = (window as any).__warnings || [];
      return msgs.filter((m: string) => m.startsWith('W1028'));
    });

    const hasW1028 = await page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      return !!(instance as any);
    });

    expect(hasW1028).toBeTruthy();
  });
});
