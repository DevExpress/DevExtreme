import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

// TODO: import defaultConfig from sticky helpers or inline the data

test.describe('FixedColumns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('The simulated scrollbar should display correctly when there are sticky columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      columnAutoWidth: true,
      scrolling: {
        useNative: false,
      },
      customizeColumns: (columns) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'left';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'left';

        columns[8].fixed = true;
        columns[8].fixedPosition = 'right';
        columns[9].fixed = true;
        columns[9].fixedPosition = 'right';
      },
    });

    // arrange
      const scrollbarVerticalThumbTrack = page.locator('.dx-scrollbar-horizontal .dx-scrollable-scroll');

    expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await (scrollbarVerticalThumbTrack).hover();
    await testScreenshot(page, 'simulated_scrollbar_with_sticky_columns_1.png', { element: page.locator('#container') });

    // act
    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: 1500 });

    await testScreenshot(page, 'simulated_scrollbar_with_sticky_columns_2.png', { element: page.locator('#container') });
  });
    // TODO: .after() block removed

  test('Alternating rows should display correctly when there are fixed columns (generic.light theme)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 15),
      columnWidth: 100,
      columnAutoWidth: true,
      rowAlternationEnabled: true,
      customizeColumns: (columns: any[]) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'left';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'left';

        columns[8].fixed = true;
        columns[8].fixedPosition = 'right';
        columns[9].fixed = true;
        columns[9].fixedPosition = 'right';
      },
    });

    expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await testScreenshot(page, 'datagrid_row_alt_with_fixed_columns.png', { element: page.locator('#container') });
  });

  test('Header hover should display correctly when there are fixed columns (generic.light theme)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 15),
      columnWidth: 100,
      columnAutoWidth: true,
      customizeColumns: (columns: any[]) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'left';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'left';

        columns[8].fixed = true;
        columns[8].fixedPosition = 'right';
        columns[9].fixed = true;
        columns[9].fixedPosition = 'right';
      },
    });

    expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    const headerCell = page.locator('.dx-header-row td').nth(13);
    await headerCell.hover();

    await testScreenshot(page, 'datagrid_header_hover_with_fixed_columns.png', { element: page.locator('#container') });
  });

  test('Row hover should display correctly when there are fixed columns (generic.light theme)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 15),
      columnWidth: 100,
      columnAutoWidth: true,
      hoverStateEnabled: true,
      customizeColumns: (columns: any[]) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'left';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'left';

        columns[8].fixed = true;
        columns[8].fixedPosition = 'right';
        columns[9].fixed = true;
        columns[9].fixedPosition = 'right';
      },
    });

    expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await page.locator('.dx-data-row').nth(1).hover();

    await testScreenshot(page, 'datagrid_row_hover_with_fixed_columns.png', { element: page.locator('#container') });
  });

  test('The grid should display correctly when there is no data and there are fixed columns (T1269088)', async ({ page }) => {
    const defaultColumns = [
      { dataField: 'OrderNumber', width: 130, fixed: true, fixedPosition: 'left' },
      { dataField: 'OrderDate', dataType: 'date' },
      { dataField: 'Employee' },
      { dataField: 'TotalAmount', width: 160, fixed: true, fixedPosition: 'right' },
    ];

    await createWidget(page, 'dxDataGrid', {
      width: 700,
      height: 500,
      dataSource: [],
      columnAutoWidth: true,
      columns: defaultColumns,
    });

    expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await testScreenshot(page, 'T1269088_grid_with_fixed_columns_and_without_data.png', { element: page.locator('#container') });
  });

  test('Boolean column checkboxes should display correctly when there are fixed columns (T1303134)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, text: 'item 1', enabled: false },
        { id: 2, text: 'item 2', enabled: true },
        { id: 3, text: 'item 3' },
      ],
      keyExpr: 'id',
      columns: [{ dataField: 'id', fixed: true }, 'enabled', 'text'],
      columnWidth: 200,
      width: 400,
    });

    expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo({ x: 100 }));

    await testScreenshot(page, 'T1303134_boolean_column_checkboxes_with_fixed_columns.png', { element: page.locator('#container') });
  });

  [90, 125, 150].forEach((zoomPercent) => {
    test(`Fixed columns should display correctly at ${zoomPercent}% zoom (generic.light theme)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: getData(20, 15),
        columnWidth: 100,
        columnAutoWidth: true,
        customizeColumns: (columns: any[]) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'left';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'left';

          columns[8].fixed = true;
          columns[8].fixedPosition = 'right';
          columns[9].fixed = true;
          columns[9].fixedPosition = 'right';
        },
      });

      await page.evaluate((zoom) => { document.body.style.zoom = `${zoom}%`; }, zoomPercent);

      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

      await testScreenshot(page, `fixed_columns_with_${zoomPercent}%_zoom.png`, { element: page.locator('#container') });

      await page.evaluate(() => { document.body.style.zoom = ''; });
    });
  });
});
