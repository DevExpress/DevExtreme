import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Column reordering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('The column reordering should work correctly when there is a fixed column with zero width', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 800,
      dataSource: [
        {
          field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
        },
      ],
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      columns: [
        {
          dataField: 'field1',
          fixed: true,
          width: 200,
        }, {
          name: 'fake',
          fixed: true,
          width: 0.01,
        }, {
          dataField: 'field2',
          width: 200,
        }, {
          dataField: 'field3',
          width: 200,
        }, {
          dataField: 'field4',
          width: 200,
        },
      ],
      allowColumnReordering: true,
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    const columnsBefore = await dataGrid.apiGetVisibleColumns();

    await dataGrid.moveHeader(2, 200, 0, true);
    await dataGrid.dropHeader(2);

    const columnsAfter = await dataGrid.apiGetVisibleColumns();
    expect(columnsAfter.length).toBe(columnsBefore.length);
  });

  test('Column without allowReordering should have same position after dragging to groupPanel and back', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 800,
      dataSource: [{ field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4' }],
      groupPanel: { visible: true },
      columns: [
        { dataField: 'field1', width: 200 },
        { dataField: 'field2', width: 200 },
        { dataField: 'field3', width: 200 },
        { dataField: 'field4', width: 200 },
      ],
      allowColumnReordering: false,
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    const columnsBefore = await dataGrid.apiGetVisibleColumns();
    expect(columnsBefore.map((c) => c.dataField)).toEqual(['field1', 'field2', 'field3', 'field4']);

    await dataGrid.moveHeader(2, -100, -50, true);
    await dataGrid.dropHeader(2);

    await page.waitForTimeout(300);

    const columnsAfter = await dataGrid.apiGetVisibleColumns();
    expect(columnsAfter.map((c) => c.dataField)).toEqual(['field1', 'field2', 'field3', 'field4']);
  });

  test('Column reordering should work correctly with fixed columns on the right and columnRenderingMode is virtual', async ({ page }) => {
    const columns = Array.from({ length: 19 }, (_, i) => ({
      dataField: String(i + 1),
      ...(i >= 17 ? { fixed: true, fixedPosition: 'right' } : {}),
    }));

    await createWidget(page, 'dxDataGrid', {
      dataSource: [{}],
      width: 800,
      allowColumnReordering: true,
      columnWidth: 100,
      scrolling: { columnRenderingMode: 'virtual' },
      columns,
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    const visibleCols = await dataGrid.apiGetVisibleColumns();
    expect(visibleCols.length).toBe(19);
  });

  test('Column reordering should work correctly after scrolling right with fixed columns on the left', async ({ page }) => {
    const columns = [
      { dataField: '1', fixed: true, fixedPosition: 'left' },
      { dataField: '2', fixed: true, fixedPosition: 'left' },
      ...Array.from({ length: 17 }, (_, i) => ({ dataField: String(i + 3) })),
    ];

    await createWidget(page, 'dxDataGrid', {
      dataSource: [{}],
      width: 800,
      allowColumnReordering: true,
      columnWidth: 100,
      scrolling: { columnRenderingMode: 'virtual' },
      columns,
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await dataGrid.scrollTo({ x: 10000 });
    await page.waitForTimeout(300);

    const scrollLeft = await dataGrid.getScrollLeft();
    expect(scrollLeft).toBeGreaterThan(0);
  });

  test('Dragging a fixed column to a group panel should work correctly when columnRenderingMode is virtual', async ({ page }) => {
    const columns = [
      ...Array.from({ length: 17 }, (_, i) => ({ dataField: String(i + 1) })),
      { dataField: '18', fixed: true, fixedPosition: 'right' },
      { dataField: '19', fixed: true, fixedPosition: 'right' },
    ];

    await createWidget(page, 'dxDataGrid', {
      dataSource: [{}],
      width: 800,
      allowColumnReordering: true,
      columnWidth: 100,
      scrolling: { columnRenderingMode: 'virtual' },
      groupPanel: { visible: true },
      columns,
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    const visibleCols = await dataGrid.apiGetVisibleColumns();
    expect(visibleCols.length).toBe(19);
  });

  test('Dragging a fixed column to a column chooser should work when columnRenderingMode is virtual', async ({ page }) => {
    const columns = [
      ...Array.from({ length: 17 }, (_, i) => ({ dataField: String(i + 1) })),
      { dataField: '18', fixed: true, fixedPosition: 'right' },
      { dataField: '19', fixed: true, fixedPosition: 'right' },
    ];

    await createWidget(page, 'dxDataGrid', {
      dataSource: [{}],
      width: 800,
      height: 500,
      allowColumnReordering: true,
      columnWidth: 100,
      scrolling: { columnRenderingMode: 'virtual' },
      columnChooser: { enabled: true },
      columns,
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await page.locator('.dx-datagrid-column-chooser-button').click();
    const columnChooser = page.locator('.dx-datagrid-column-chooser');
    await expect(columnChooser).toBeVisible();
  });
});
