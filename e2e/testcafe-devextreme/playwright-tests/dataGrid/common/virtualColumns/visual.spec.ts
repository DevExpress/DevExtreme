import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const generateData = (rowCount: number, columnCount: number): Record<string, unknown>[] => {
  const items: Record<string, unknown>[] = [];
  for (let i = 0; i < rowCount; i += 1) {
    const item: Record<string, unknown> = {};
    for (let j = 0; j < columnCount; j += 1) {
      item[`field${j + 1}`] = `${i + 1}-${j + 1}`;
    }
    items.push(item);
  }
  return items;
};

const generateColumns = (columnCount: number): { dataField: string }[] => [...new Array(columnCount)]
  .map((_, index) => ({
    dataField: `field${index + 1}`,
  }));

test.describe('Virtual Columns.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Columns should be rendered correctly after reinit of columns controller', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    const columns = generateColumns(500);

    await createWidget(page, 'dxDataGrid', {
      height: 440,
      dataSource: generateData(150, 500),
      columns,
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

    await dataGrid.scrollTo({ x: 1000 });
    await expect(await dataGrid.getScrollLeft()).toBe(1000);

    const updatedColumns = generateColumns(500);
    (updatedColumns[0] as any).visible = false;
    await dataGrid.option('columns', updatedColumns);
    await expect(await dataGrid.getScrollLeft()).toBe(1000);

    (updatedColumns[0] as any).visible = true;
    await dataGrid.option('columns', updatedColumns);
    await expect(await dataGrid.getScrollLeft()).toBe(1000);

    await testScreenshot(page, 'grid-virtual-columns-after-reinit.png');
  });

  test('Group row should have right colspan with summary, virtual columns and fixed columns (T1221369)', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    const generatedColumns = generateColumns(20);
    const columns = [
      { ...generatedColumns[0], groupIndex: 0 },
      { ...generatedColumns[1], fixed: true },
      { ...generatedColumns[2], fixed: true },
      ...generatedColumns.slice(3),
    ];

    await createWidget(page, 'dxDataGrid', {
      dataSource: generateData(10, 20),
      width: 400,
      height: 400,
      columns,
      columnFixing: {
        enabled: true,
        legacyMode: true,
      },
      columnMinWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
      summary: {
        groupItems: [{
          column: columns[2].dataField,
          summaryType: 'count',
          alignByColumn: true,
        }],
      },
    });

    await testScreenshot(page, 'T1221369_fixed-summary-with-virtual-cols_0.png', { element: page.locator('#container') });

    await dataGrid.scrollTo({ x: 10000 });
    await dataGrid.scrollTo({ x: 10000 });

    await testScreenshot(page, 'T1221369_fixed-summary-with-virtual-cols_1.png', { element: page.locator('#container') });

    await dataGrid.scrollTo({ x: 0 });

    await testScreenshot(page, 'T1221369_fixed-summary-with-virtual-cols_2.png', { element: page.locator('#container') });
  });

  test('Virtual columns should render correctly with repaintChangesOnly and grouping after horizontal scrolling (T1319173)', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await createWidget(page, 'dxDataGrid', {
      dataSource: generateData(10, 50).map((item, index) => ({ id: index, ...item })),
      keyExpr: 'id',
      height: 400,
      width: 600,
      repaintChangesOnly: true,
      scrolling: {
        columnRenderingMode: 'virtual',
        useNative: false,
      },
      columnWidth: 100,
      customizeColumns(columns: any[]) {
        columns[1].groupIndex = 0;
      },
    });

    await expect(dataGrid.element).toBeVisible();
    await expect(await dataGrid.getScrollLeft()).toBe(0);

    await dataGrid.scrollTo({ x: 10000 });

    await testScreenshot(page, 'T1319173__datagrid__virtual-columns__repaintChangesOnly=true.png', { element: page.locator('#container') });
  });

  test('The markup should be correct after horizontal scrolling and collapse of the master detail row', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await createWidget(page, 'dxDataGrid', {
      dataSource: generateData(10, 50).map((item, index) => ({ id: index, ...item })),
      keyExpr: 'id',
      width: 500,
      height: 500,
      columnWidth: 100,
      scrolling: {
        mode: 'virtual',
        columnRenderingMode: 'virtual',
      },
      columnFixing: {
        legacyMode: true,
      },
      customizeColumns(columns: any[]) {
        columns[0].fixed = true;
      },
      masterDetail: {
        enabled: true,
        template() {
          return ($('<div style=\'height: 300px;\'>') as any).text('details');
        },
      },
      onContentReady(e: any) {
        if (!e.component.__initExpand) {
          e.component.__initExpand = true;
          e.component.expandRow(0);
        }
      },
    });

    await page.waitForTimeout(100);

    await dataGrid.scrollTo({ x: 2000 });
    await page.waitForTimeout(300);
    await dataGrid.scrollTo({ x: 4000 });

    await testScreenshot(page, 'T1176161-master-detail-with-virtual-columns-1.png', { element: page.locator('#container') });

    await dataGrid.apiCollapseRow(0);

    await testScreenshot(page, 'T1176161-master-detail-with-virtual-columns-2.png', { element: page.locator('#container') });
  });

  test('Columns reordering should work with virtual columns', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    const columns = generateColumns(30);

    await createWidget(page, 'dxDataGrid', {
      height: 440,
      width: 600,
      dataSource: generateData(10, 30),
      columns,
      columnWidth: 100,
      allowColumnReordering: true,
      scrolling: { columnRenderingMode: 'virtual' },
    });

    await expect(dataGrid.element).toBeVisible();
    const scrollLeft = await dataGrid.getScrollLeft();
    expect(scrollLeft).toBe(0);

    await dataGrid.moveHeader(0, 200, 0, true);
    await dataGrid.dropHeader(0);

    await testScreenshot(page, 'data-grid__virtual-columns__reoder.png', { element: page.locator('#container') });
  });

  test('Grouping should work with virtual columns', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    const columns = generateColumns(20);

    await createWidget(page, 'dxDataGrid', {
      height: 440,
      width: 600,
      dataSource: generateData(10, 20),
      columns: [{ ...columns[0], groupIndex: 0 }, ...columns.slice(1)],
      columnWidth: 100,
      scrolling: { columnRenderingMode: 'virtual' },
    });

    await expect(dataGrid.element).toBeVisible();
    await dataGrid.scrollTo({ x: 500 });

    await testScreenshot(page, 'data-grid__virtual-columns__grouping.png', { element: page.locator('#container') });
  });

  test('Column chooser should work with virtual columns', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    const columns = generateColumns(30);

    await createWidget(page, 'dxDataGrid', {
      height: 440,
      width: 600,
      dataSource: generateData(10, 30),
      columns,
      columnWidth: 100,
      scrolling: { columnRenderingMode: 'virtual' },
      columnChooser: { enabled: true },
    });

    await expect(dataGrid.element).toBeVisible();
    await page.locator('.dx-datagrid-column-chooser-button').click();

    const columnChooser = page.locator('.dx-datagrid-column-chooser');
    await expect(columnChooser).toBeVisible();

    await testScreenshot(page, 'data-grid__virtual-columns__column-chooser.png', { element: page.locator('body') });
  });

  test.skip('The updateDimensions method should render the grid if a container was hidden and columnRenderingMode is virtual', async ({ page }) => {
    // TODO: Playwright migration - screenshot mismatch
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.evaluate(() => {
      $('#container').wrap('<div id=\'wrapperContainer\' style=\'display: none;\'></div>');
    });

    await createWidget(page, 'dxDataGrid', {
      height: 440,
      dataSource: generateData(150, 500),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

    await expect(page.locator('#wrapperContainer')).toBeHidden();

    await page.evaluate(() => {
      $('#wrapperContainer').css('display', '');
    });

    await page.waitForTimeout(200);
    await expect(page.locator('#wrapperContainer')).toBeVisible();

    await page.evaluate(() => {
      ($('#container') as any).dxDataGrid('instance').updateDimensions();
    });

    await testScreenshot(page, 'T1090735-grid-virtual-columns.png', { element: '#wrapperContainer' });
  });
});
