import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { dragToOffset, pointWithin } from '../../../../helpers/dragUtils';
import DataGrid from '../../../../models/dataGrid';

const getVisibleColumns = (dataGrid: DataGrid): Promise<string[]> => dataGrid.element.evaluate(
  (element) => ($(element) as any).dxDataGrid('instance')
    .getVisibleColumns()
    .map((column: any) => column.dataField ?? column.name),
);
const getColumnsSeparatorOffset = (page: Page): Promise<{ left: number; top: number } | undefined> => page.evaluate(() => $('.dx-datagrid-columns-separator').offset());

test.describe('Column reordering', () => {
  // T975549
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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const headers = dataGrid.getHeaders();
    const headerRow = headers.getHeaderRow(0);

    await expect(headerRow.getHeaderCell(2).element).toHaveText('Field 2');
    await dragToOffset(page, headerRow.getHeaderCell(3).element, -400, 0);
    await expect(headerRow.getHeaderCell(2).element).toHaveText('Field 3');
    await expect.poll(() => getVisibleColumns(dataGrid)).toEqual(['field1', 'fake', 'field3', 'field2', 'field4']);
  });

  // T1038094
  test('The separator should display correctly when dragging column', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 800,
      dataSource: [
        {
          field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
        },
      ],
      columns: [
        {
          dataField: 'field1',
          width: 200,
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
      allowColumnResizing: true,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // TestCafe pressed the header's corner with no pointer over it before. A real pointer there
    // hovers the column's border and resizes the column, so the drag starts inside the header.
    const firstHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);
    const dragStart = await pointWithin(firstHeader.element);
    await page.mouse.move(dragStart.x, dragStart.y);
    await page.mouse.down();
    await dataGrid.moveHeader(0, 200, 5);

    await expect.poll(() => getColumnsSeparatorOffset(page)).toEqual({
      left: 8,
      top: 8,
    });

    await dataGrid.moveHeader(0, 400, 5);

    const offset2 = await getColumnsSeparatorOffset(page);
    expect(offset2!.left).toBeGreaterThanOrEqual(405);
    expect(offset2!.left).toBeLessThanOrEqual(406.5);
    expect(offset2!.top).toBe(8);

    await dataGrid.moveHeader(0, 600, 5);

    const offset3 = await getColumnsSeparatorOffset(page);

    expect(offset3!.left).toBeGreaterThanOrEqual(605);
    expect(offset3!.left).toBeLessThanOrEqual(606.5);
    expect(offset3!.top).toBe(8);

    await dataGrid.moveHeader(0, 800, 5);

    await expect.poll(() => getColumnsSeparatorOffset(page)).toEqual({
      left: 805,
      top: 8,
    });
  });

  test('Column without allowReordering should have same position after dragging to groupPanel and back', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 800,
      dataSource: [
        {
          field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
        },
      ],
      groupPanel: {
        visible: true,
      },
      columns: [
        {
          dataField: 'field1',
          width: 200,
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
      allowColumnReordering: false,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const headerRow = dataGrid.getHeaders().getHeaderRow(0);

    await dragToOffset(page, headerRow.getHeaderCell(2).element, -100, -50);

    await expect.poll(() => dataGrid.getGroupPanel().getHeadersCount()).toBe(1);

    await dragToOffset(page, dataGrid.getGroupPanel().getHeader(0).element, 0, 50);

    const getHeaders = (): Promise<(string | null)[]> => Promise.all(
      [0, 1, 2, 3].map((i) => headerRow.getHeaderCell(i).element.textContent()),
    );

    await expect.poll(getHeaders).toEqual(['Field 1', 'Field 2', 'Field 3', 'Field 4']);
  });

  // T1316881
  test('Column reordering should work correctly with fixed columns on the right and columnRenderingMode is virtual', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{}],
      width: 800,
      allowColumnReordering: true,
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
      columns: [
        { dataField: '1' },
        { dataField: '2' },
        { dataField: '3' },
        { dataField: '4' },
        { dataField: '5' },
        { dataField: '6' },
        { dataField: '7' },
        { dataField: '8' },
        { dataField: '9' },
        { dataField: '10' },
        { dataField: '11' },
        { dataField: '12' },
        { dataField: '13' },
        { dataField: '14' },
        { dataField: '15' },
        { dataField: '16' },
        { dataField: '17' },
        { dataField: '18', fixed: true, fixedPosition: 'right' },
        { dataField: '19', fixed: true, fixedPosition: 'right' },
      ],
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headers = dataGrid.getHeaders();
    const headerRow = headers.getHeaderRow(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const lastHeader = headerRow.getDataHeaderCells().nth(11);

    // assert
    await expect(lastHeader).toHaveText('19');

    // act
    await dragToOffset(page, lastHeader, -200, 0);

    // assert
    await expect(headerRow.getDataHeaderCells().nth(11)).toHaveText('18');
  });

  // T1316881
  test('Column reordering should work correctly after scrolling right with fixed columns on the left and columnRenderingMode is virtual', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{}],
      width: 800,
      allowColumnReordering: true,
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
      columns: [
        { dataField: '1', fixed: true, fixedPosition: 'left' },
        { dataField: '2', fixed: true, fixedPosition: 'left' },
        { dataField: '3' },
        { dataField: '4' },
        { dataField: '5' },
        { dataField: '6' },
        { dataField: '7' },
        { dataField: '8' },
        { dataField: '9' },
        { dataField: '10' },
        { dataField: '11' },
        { dataField: '12' },
        { dataField: '13' },
        { dataField: '14' },
        { dataField: '15' },
        { dataField: '16' },
        { dataField: '17' },
        { dataField: '18' },
        { dataField: '19' },
      ],
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headers = dataGrid.getHeaders();
    const headerRow = headers.getHeaderRow(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataGrid.scrollTo({ left: 10000 });

    // assert
    await expect.poll(() => dataGrid.getScrollLeft()).toBe(1100);
    await expect(headerRow.getHeaderCell(16).element).toBeAttached(); // last non-fixed column
    await expect(headerRow.getDataHeaderCells().nth(0)).toHaveText('1');

    // act
    await dragToOffset(page, headerRow.getDataHeaderCells().nth(1), -200, 0);

    // assert
    await expect(headerRow.getDataHeaderCells().nth(0)).toHaveText('2');
  });

  // T1316881
  test('Dragging a fixed column to a group panel should work correctly when columnRenderingMode is virtual', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{}],
      width: 800,
      allowColumnReordering: true,
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        { dataField: '1' },
        { dataField: '2' },
        { dataField: '3' },
        { dataField: '4' },
        { dataField: '5' },
        { dataField: '6' },
        { dataField: '7' },
        { dataField: '8' },
        { dataField: '9' },
        { dataField: '10' },
        { dataField: '11' },
        { dataField: '12' },
        { dataField: '13' },
        { dataField: '14' },
        { dataField: '15' },
        { dataField: '16' },
        { dataField: '17' },
        { dataField: '18', fixed: true, fixedPosition: 'right' },
        { dataField: '19', fixed: true, fixedPosition: 'right' },
      ],
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headers = dataGrid.getHeaders();
    const headerRow = headers.getHeaderRow(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const fixedHeader = headerRow.getDataHeaderCells().nth(10);

    // assert
    await expect(fixedHeader).toHaveText('18');

    // act
    await dragToOffset(page, fixedHeader, -600, -50);

    // assert
    await expect(dataGrid.getGroupPanel().getHeader(0).element).toHaveText('18');
  });

  // T1316881
  test('Dragging a fixed column to a column chooser should work correctly when columnRenderingMode is virtual', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{}],
      width: 800,
      height: 500,
      allowColumnReordering: true,
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
      columnChooser: {
        enabled: true,
      },
      columns: [
        { dataField: '1' },
        { dataField: '2' },
        { dataField: '3' },
        { dataField: '4' },
        { dataField: '5' },
        { dataField: '6' },
        { dataField: '7' },
        { dataField: '8' },
        { dataField: '9' },
        { dataField: '10' },
        { dataField: '11' },
        { dataField: '12' },
        { dataField: '13' },
        { dataField: '14' },
        { dataField: '15' },
        { dataField: '16' },
        { dataField: '17' },
        { dataField: '18', fixed: true, fixedPosition: 'right' },
        { dataField: '19', fixed: true, fixedPosition: 'right' },
      ],
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headers = dataGrid.getHeaders();
    const headerRow = headers.getHeaderRow(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act - open column chooser
    await dataGrid.getColumnChooserButton().click();

    // assert
    await dataGrid.getColumnChooser().expectOpened();

    const fixedHeader = headerRow.getDataHeaderCells().nth(10);

    // assert
    await expect(fixedHeader).toHaveText('18');

    // act
    await dragToOffset(page, fixedHeader, 20, 300);

    // assert
    await expect.poll(() => dataGrid.getColumnChooser().getColumnTexts()).toEqual(['18']);
  });
});
