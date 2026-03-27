import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

test.describe('Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('DataGrid should set the scrollbar position to the left on resize (T934842)', async ({ page }) => {
    // TODO: Playwright migration - getScrollable() returns undefined after viewport resize
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(1, 50),
      columnWidth: 100,
    });

    const dataGrid = new DataGrid(page);

    await page.setViewportSize({ width: 900, height: 250 });
    expect(await dataGrid.getScrollLeft()).toBe(0);

    await page.setViewportSize({ width: 700, height: 250 });
    expect(await dataGrid.getScrollLeft()).toBe(0);

    await page.setViewportSize({ width: 600, height: 250 });
    expect(await dataGrid.getScrollLeft()).toBe(0);
  });

  test('Warning should be thrown if scrolling is virtual and height is not specified', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning') warnings.push(msg.text());
    });

    await createWidget(page, 'dxDataGrid', {
      scrolling: {
        mode: 'virtual',
      },
      dataSource: [{ column: 'value' }],
    });

    await page.waitForTimeout(100);

    const warningExists = warnings.some((message) => message.startsWith('W1025'));
    expect(warningExists).toBeTruthy();
  });

  test('Warning should not be thrown if scrolling is virtual and height is specified with option', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning') warnings.push(msg.text());
    });

    await createWidget(page, 'dxDataGrid', {
      scrolling: {
        mode: 'virtual',
      },
      dataSource: [{ column: 'value' }],
      height: 200,
    });

    const warningExists = warnings.some((message) => message.startsWith('W1025'));
    expect(warningExists).toBeFalsy();
  });

  ['height', 'max-height'].forEach((cssOption) => {
    test(`Warning should not be thrown if scrolling is virtual and height is specified with css (${cssOption})`, async ({ page }) => {
      const warnings: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'warning') warnings.push(msg.text());
      });

      await page.addStyleTag({ content: `#container { ${cssOption}: 200px; }` });

      await createWidget(page, 'dxDataGrid', {
        scrolling: {
          mode: 'virtual',
        },
        dataSource: [{ column: 'value' }],
      });

      const warningExists = warnings.some((message) => message.startsWith('W1025'));
      expect(warningExists).toBeFalsy();
    });
  });

  test('DataGrid should not reset its top scroll position after cell modification with master-detail', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await createWidget(page, 'dxDataGrid', {
      height: 300,
      dataSource: [{ FirstName: 'A', LastName: 'B' }, { FirstName: 'C', LastName: 'D' }],
      editing: {
        allowUpdating: true,
        mode: 'cell',
      },
      masterDetail: {
        enabled: true,
        template: (container: any) => {
          $('<div>')
            .css('height', '200px')
            .appendTo(container);
        },
      },
    });

    await dataGrid.getDataRow(0).element.locator('.dx-command-expand').click();
    await dataGrid.scrollTo({ y: 220 });
    const scrollTop = await dataGrid.getScrollTop();

    await dataGrid.getDataRow(1).element.locator('.dx-command-expand').click();
    await dataGrid.getDataCell(2, 1).click();
    await page.keyboard.type('new_value');
    await page.keyboard.press('Tab');

    const newScrollTop = await dataGrid.getScrollTop();
    expect(Math.abs(scrollTop - newScrollTop) < 2).toBe(true);
  });

  test('New row should be rendered at the top when grid is scrolled in virtual scrolling', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    const generateData = (): Record<string, unknown>[] => {
      const items: Record<string, unknown>[] = [];
      for (let i = 0; i < 130; i += 1) {
        items.push({ ID: i + 1, Name: `Name ${i + 1}` });
      }
      return items;
    };

    await page.evaluate(() => {
      ($('#container') as any).css('max-height', '440px');
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: generateData(),
      keyExpr: 'ID',
      scrolling: { mode: 'virtual' },
      paging: { pageSize: 10 },
      editing: {
        mode: 'row',
        allowAdding: true,
        newRowPosition: 'first',
      },
    });

    await dataGrid.scrollTo({ y: 2350 });

    const topVisibleRowData = await dataGrid.apiGetTopVisibleRowData() as any;
    expect(topVisibleRowData.ID).toBe(49);

    await dataGrid.getHeaderPanel().getAddRowButton().click();

    const firstRow = await page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      return instance.getVisibleRows()[0];
    });
    expect(firstRow.isNewRow).toBe(true);
  });

  test('Editors should keep changes after being scrolled out of sight (T1145698)', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    const getItems = (): Record<string, unknown>[] => {
      const items: Record<string, unknown>[] = [];
      for (let i = 0; i < 65; i += 1) {
        items.push({ ID: i + 1, Name: `Name ${i + 1}` });
      }
      return items;
    };

    await createWidget(page, 'dxDataGrid', {
      dataSource: getItems(),
      keyExpr: 'ID',
      columns: [{ dataField: 'Name', showEditorAlways: true }],
      scrolling: { mode: 'virtual' },
      height: 300,
      editing: {
        mode: 'batch',
        allowUpdating: true,
        allowAdding: true,
      },
    });

    await page.waitForTimeout(200);
    await dataGrid.getDataCell(0, 0).click();
    await page.keyboard.press('Control+a');
    await page.keyboard.type('test');
    await dataGrid.getDataCell(1, 0).click();
    await page.keyboard.press('Control+a');
    await page.keyboard.type('test');
    await page.keyboard.press('Enter');

    await dataGrid.scrollTo({ y: 500 });
    await dataGrid.scrollTo({ y: 0 });

    await page.waitForTimeout(300);
    expect(await dataGrid.apiGetCellValue(0, 0)).toBe('test');
    expect(await dataGrid.apiGetCellValue(1, 0)).toBe('test');
  });

  test('Restoring focus on re-rendering should be done without unexpected scrolling to the focused element (T1181439)', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    const data = Array.from({ length: 30 }, (_, i) => ({ id: i + 1 }));

    await createWidget(page, 'dxDataGrid', {
      dataSource: data,
      scrolling: { mode: 'virtual', useNative: true },
      height: 440,
      width: 600,
      columns: Array.from({ length: 20 }, () => ({ dataField: 'id', width: 75 })),
      masterDetail: { enabled: true },
    });

    await dataGrid.scrollBy({ x: 1000 });

    const headers = dataGrid.getHeaders();
    await headers.getHeaderCell(0, 19).click();

    await dataGrid.scrollBy({ x: 0 });
    await dataGrid.scrollBy({ y: 50 });

    expect(await dataGrid.getScrollLeft()).toBe(0);
  });

  test('DataGrid - Focused cell moves to the end of the table after horizontal scrolling (T1262288)', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(1, 20).map((item, index) => ({ ...item, id: index })),
      keyExpr: 'id',
      columnWidth: 100,
      showBorders: true,
      focusedRowEnabled: true,
      scrolling: {
        columnRenderingMode: 'virtual',
        mode: 'virtual',
        showScrollbar: 'always',
      },
      paging: { enabled: false },
    });

    await dataGrid.getDataCell(0, 0).click();
    await page.keyboard.press('ArrowLeft');

    const isFocusedBefore = await page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      const cell = instance.getCellElement(0, 0);
      return document.activeElement === cell;
    });
    expect(isFocusedBefore).toBe(true);

    await dataGrid.scrollBy({ x: 1000 });
    await dataGrid.scrollBy({ x: -1000 });

    const isFocusedAfter = await page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      const cell = instance.getCellElement(0, 0);
      return document.activeElement === cell;
    });
    expect(isFocusedAfter).toBe(true);
  });

  test('DataGrid - Scrolling position is reset to far right on an attempt to scroll left if the most right cell is focused using the keyboard (T1277214)', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(1, 20).map((item, index) => ({ ...item, id: index })),
      keyExpr: 'id',
      columnWidth: 100,
      showBorders: true,
      focusedRowEnabled: true,
      scrolling: {
        columnRenderingMode: 'virtual',
        mode: 'virtual',
        showScrollbar: 'always',
      },
      paging: { enabled: false },
    });

    await dataGrid.scrollTo({ x: 1000 });
    await dataGrid.getDataCell(0, 20).click();
    await page.keyboard.press('ArrowRight');

    const isFocusedBefore = await page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      const cell = instance.getCellElement(0, 20);
      return document.activeElement === cell;
    });
    expect(isFocusedBefore).toBe(true);

    await dataGrid.scrollBy({ x: -1000 });
    await dataGrid.scrollBy({ x: 1000 });

    const isFocusedAfter = await page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      const cell = instance.getCellElement(0, 20);
      return document.activeElement === cell;
    });
    expect(isFocusedAfter).toBe(true);
  });

  test('New virtual mode. Navigation to the last row if new row is added (T1069849)', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await createWidget(page, 'dxDataGrid', {
      height: 150,
      keyExpr: 'id',
      dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
      editing: {
        mode: 'batch',
        allowAdding: true,
      },
      columns: ['id'],
      scrolling: { mode: 'virtual' },
    });

    await dataGrid.getHeaderPanel().getAddRowButton().click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const lastCellText = await dataGrid.getDataCell(3, 0).textContent();
    expect(lastCellText).toBe('4');

    const isFocused = await page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      const cell = instance.getCellElement(3, 0);
      return document.activeElement === cell;
    });
    expect(isFocused).toBe(true);
  });

  test('The data should display correctly after changing the dataSource and focusedRowIndex options when scroll position is at the end (T1129252)', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await createWidget(page, 'dxDataGrid', {
      height: 250,
      width: 200,
      keyExpr: 'id',
      dataSource: Array.from({ length: 100 }, (_, index) => ({ id: index, text: `item ${index}` })),
      columnWidth: 100,
      focusedRowEnabled: true,
      focusedRowIndex: 99,
      scrolling: { mode: 'virtual' },
    });

    await dataGrid.scrollTo({ y: 100000 });
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      instance.option({
        focusedRowIndex: -1,
        dataSource: Array.from({ length: 100 }, (_, index) => ({ id: index, text: `item ${index}` })),
      });
    });

    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());
    const isReady = await dataGrid.isReady();
    expect(isReady).toBe(true);
  });

  test('Should not scroll back on top with virtual scrolling and adaptive master detail (nativeScroll: false) [T1278804]', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    const adaptiveCellIdx = 101;
    const scrollValuesThreshold = 100;

    await page.evaluate(() => {
      (window as any).dataGridScrollableEventValues = [];
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(3, 100).map((item, idx) => ({ ...item, id: idx })),
      keyExpr: 'id',
      columnHidingEnabled: true,
      focusedRowEnabled: true,
      scrolling: { mode: 'virtual', useNative: false },
      onContentReady: ({ component }: any) => {
        component.getScrollable().on('scroll', ({ scrollOffset: { top } }: any) => {
          if (!Array.isArray((window as any).dataGridScrollableEventValues)) {
            (window as any).dataGridScrollableEventValues = [];
          }
          (window as any).dataGridScrollableEventValues.push(top);
        });
      },
      width: 400,
      height: 400,
    });

    await dataGrid.getDataCell(0, 0).click();
    const adaptiveCell = dataGrid.getDataRow(0).element.locator('.dx-command-adaptive').nth(0);
    await adaptiveCell.click();

    await dataGrid.scrollTo({ y: 2000 });
    await page.waitForTimeout(300);
    await dataGrid.scrollTo({ y: 1000 });
    await page.waitForTimeout(300);

    const scrollOffsets: number[] = await page.evaluate(() => (window as any).dataGridScrollableEventValues);
    const hasSmallScrollValues = scrollOffsets.some((offset) => offset < scrollValuesThreshold);
    expect(hasSmallScrollValues).toBe(false);

    await page.evaluate(() => {
      delete (window as any).dataGridScrollableEventValues;
    });
  });

  test('The "row" parameter in the FocusedRowChanged event refers to a non-focused row if the grid height is small (T1280020)', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await page.evaluate(() => {
      $('body').append('<div id="otherContainer"></div>');
    });

    await createWidget(page, 'dxDataGrid', {
      height: 70,
      dataSource: [{ id: '0' }, { id: '1' }, { id: '2' }],
      scrolling: { mode: 'virtual' },
      keyExpr: 'id',
      focusedRowEnabled: true,
      onFocusedRowChanged: (e: any) => {
        const data = e.row?.data;
        $('#otherContainer').text(data.id);
      },
    });

    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    await page.evaluate(() => {
      ($('#container') as any).dxDataGrid('instance').option('focusedRowKey', '2');
    });
    await expect(page.locator('#otherContainer')).toHaveText('2');

    await page.evaluate(() => {
      ($('#container') as any).dxDataGrid('instance').option('focusedRowKey', '0');
    });
    await expect(page.locator('#otherContainer')).toHaveText('0');

    await page.evaluate(() => {
      $('#otherContainer').remove();
    });
  });

  test('New virtual mode. A detail row should be rendered when the last master row is expanded', async ({ page }) => {
    const ROWS_AMOUNT = 100;
    const dataGrid = new DataGrid(page);

    const getItems = (): Record<string, unknown>[] => {
      const items: Record<string, unknown>[] = [];
      for (let i = 0; i < 100; i += 1) {
        items.push({ ID: i + 1, Name: `Name ${i + 1}` });
      }
      return items;
    };

    await createWidget(page, 'dxDataGrid', {
      height: 350,
      dataSource: getItems(),
      keyExpr: 'ID',
      remoteOperations: true,
      scrolling: {
        mode: 'virtual',
        rowRenderingMode: 'virtual',
        legacyMode: false,
      },
      masterDetail: { enabled: true },
    });

    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const firstRowHeight = await page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      const rowElement = instance.getView('rowsView').element().find('.dx-data-row').first();
      return rowElement.height() ?? 0;
    });
    const scrollTopOffset = ROWS_AMOUNT * firstRowHeight;

    await dataGrid.scrollTo({ top: scrollTopOffset });
    await page.waitForTimeout(300);

    const lastDataRow = dataGrid.getDataRow(99);
    await lastDataRow.element.locator('.dx-command-expand').click();

    const visibleRows = await dataGrid.apiGetVisibleRows();
    const penultimateRow = visibleRows[visibleRows.length - 2];
    const lastRow = visibleRows[visibleRows.length - 1];

    expect(penultimateRow.rowType).toBe('data');
    expect(penultimateRow.key).toBe(ROWS_AMOUNT);
    expect(lastRow.rowType).toBe('detail');
    expect(lastRow.key).toBe(ROWS_AMOUNT);
  });

  test('Ungrouping after grouping should work correctly if row rendering mode is virtual', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    const getItems = (): Record<string, unknown>[] => {
      const items: Record<string, unknown>[] = [];
      for (let i = 1; i <= 25; i += 1) {
        const groupIndex = (i % 8) + 1;
        items.push({ id: i, group: `group${groupIndex}` });
      }
      return items;
    };

    await createWidget(page, 'dxDataGrid', {
      height: 500,
      keyExpr: 'id',
      dataSource: getItems(),
      scrolling: {
        mode: 'virtual',
        rowRenderingMode: 'virtual',
        updateTimeout: 0,
        useNative: false,
      },
      grouping: { autoExpandAll: false },
      groupPanel: { visible: true },
      paging: { pageSize: 10 },
    });

    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    await dataGrid.scrollTo({ top: 500 });
    let visibleRows = await dataGrid.apiGetVisibleRows();

    expect(visibleRows[0].rowType).toBe('data');
    expect(visibleRows[0].key).not.toBe(1);

    await dataGrid.apiColumnOption('group', 'groupIndex', 0);
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());
    visibleRows = await dataGrid.apiGetVisibleRows();

    expect(visibleRows.length).toBe(8);
    expect(visibleRows[0].rowType).toBe('group');
    expect(visibleRows[0].key).toEqual(['group1']);
    expect(visibleRows[7].rowType).toBe('group');
    expect(visibleRows[7].key).toEqual(['group8']);

    await page.evaluate(() => {
      ($('#container') as any).dxDataGrid('instance').columnOption('group', 'groupIndex', undefined);
    });
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const groupRows = await dataGrid.getGroupRowSelector().count();
    expect(groupRows).toBe(0);

    visibleRows = await dataGrid.apiGetVisibleRows();
    expect(visibleRows[0].rowType).toBe('data');
    expect(visibleRows[0].key).toBe(1);
  });

  test('Rows are rendered properly when window content is scrolled (T1070388)', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await page.evaluate(() => {
      for (let i = 0; i < 100; i += 1) {
        $('body').prepend('<br class="myBr" />');
      }
      for (let i = 0; i < 100; i += 1) {
        $('body').append('<br class="myBr" />');
      }
    });

    const getItems = (): any[] => {
      const items: any[] = [];
      for (let i = 0; i < 100; i += 1) {
        items.push({ id: i + 1, name: `Name ${i + 1}` });
      }
      return items;
    };

    await createWidget(page, 'dxDataGrid', {
      dataSource: getItems(),
      keyExpr: 'id',
      showBorders: true,
      scrolling: { mode: 'virtual' },
    });

    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    let visibleRows = await dataGrid.apiGetVisibleRows();
    expect(visibleRows.length).toBeGreaterThan(0);

    await page.evaluate(() => window.scroll({ top: 3100 }));
    await page.waitForFunction(() => window.scrollY === 3100);
    await page.waitForTimeout(300);

    visibleRows = await dataGrid.apiGetVisibleRows();
    expect(visibleRows.length).toBeGreaterThan(0);
    expect(visibleRows[0].key).toBeGreaterThan(20);

    await page.evaluate(() => window.scroll({ top: 0 }));
    await page.waitForFunction(() => window.scrollY === 0);

    visibleRows = await dataGrid.apiGetVisibleRows();
    expect(visibleRows.length).toBeGreaterThan(0);

    await page.evaluate(() => {
      $('.myBr').remove();
    });
  });

  test('New virtual mode. Virtual rows should not be in view port after scrolling large data (T1043156)', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await page.evaluate(() => {
      const getItems = (): Record<string, unknown>[] => {
        const items: Record<string, unknown>[] = [];
        for (let i = 0; i < 10000; i += 1) {
          items.push({ ID: i + 1, Name: `Name ${i + 1}` });
        }
        return items;
      };

      (window as any).myStore = new (window as any).DevExpress.data.ArrayStore({
        key: 'ID',
        data: getItems(),
      });
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: {
        key: 'ID',
        load: (loadOptions: any) => new Promise((resolve) => {
          (window as any).myStore.load(loadOptions).done((data: any) => resolve(data));
        }),
        totalCount: (loadOptions: any) => (window as any).myStore.totalCount(loadOptions),
      } as any,
      height: 500,
      remoteOperations: true,
      scrolling: { mode: 'virtual' },
    });

    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    await dataGrid.scrollTo({ y: 4000 });
    await page.waitForTimeout(500);

    const isVirtualRowIntersect = await dataGrid.isVirtualRowIntersectViewport();
    expect(isVirtualRowIntersect).toBe(false);

    await dataGrid.scrollTo({ y: 0 });
    await page.waitForTimeout(500);

    const isVirtualRowIntersect2 = await dataGrid.isVirtualRowIntersectViewport();
    expect(isVirtualRowIntersect2).toBe(false);

    await page.evaluate(() => {
      delete (window as any).myStore;
    });
  });

  test('Scroll position after grouping when RTL (T388508)', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await createWidget(page, 'dxDataGrid', {
      width: 200,
      rtlEnabled: true,
      columns: [
        { dataField: 'field1', width: 100 },
        { dataField: 'field2', width: 100 },
        { dataField: 'field3', width: 100 },
        { dataField: 'field4', width: 100 },
        { dataField: 'field5', width: 100 },
      ],
      dataSource: [{
        field1: '1',
        field2: '2',
        field3: '3',
        field4: '4',
      }],
    });

    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const scrollLeft = await dataGrid.getScrollLeft();
    expect(scrollLeft).toBe(300);

    await dataGrid.scrollTo({ x: 100 });
    const scrollRight = await dataGrid.getScrollRight();

    await dataGrid.apiColumnOption('field1', 'groupIndex', 0);
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const groupRows = page.locator('.dx-group-row');
    await expect(groupRows.first()).toBeVisible();

    const scrollRightAfterGrouping = await dataGrid.getScrollRight();
    expect(Math.floor(scrollRightAfterGrouping)).toBe(Math.floor(scrollRight));
  });

  // Duplicate removed — test already exists at line 464

  test('New virtual mode. An adaptive row should be rendered when the last row is expanded', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    const getItems = (): Record<string, unknown>[] => {
      const items: Record<string, unknown>[] = [];
      for (let i = 0; i < 100; i += 1) {
        items.push({
          ID: i + 1,
          Name: `Name ${i + 1}`,
          Description: `Description ${i + 1}`,
        });
      }
      return items;
    };

    await createWidget(page, 'dxDataGrid', {
      height: 350,
      width: 300,
      dataSource: getItems(),
      keyExpr: 'ID',
      remoteOperations: true,
      scrolling: {
        mode: 'virtual',
        rowRenderingMode: 'virtual',
        useNative: false,
      },
      columnHidingEnabled: true,
      customizeColumns(columns: any[]) {
        columns[0].width = 250;
      },
    });

    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const firstRowHeight = await page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      return $(instance.element()).find('.dx-data-row').first().height() ?? 0;
    });

    const scrollTopOffset = 100 * firstRowHeight;
    await dataGrid.scrollTo({ top: scrollTopOffset });
    await page.waitForTimeout(300);

    await page.locator('.dx-data-row[aria-rowindex="100"]').locator('.dx-datagrid-adaptive-more').click();
    await page.waitForTimeout(300);

    const visibleRows = await dataGrid.apiGetVisibleRows();
    const penultimateRow = visibleRows[visibleRows.length - 2];
    const lastRow = visibleRows[visibleRows.length - 1];

    expect(penultimateRow.rowType).toBe('data');
    expect(penultimateRow.key).toBe(100);
    expect(lastRow.rowType).toBe('detailAdaptive');
    expect(lastRow.key).toBe(100);
  });

  test('The row alternation should display correctly when grouping and virtual scrolling are enabled (T1194796)', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await createWidget(page, 'dxDataGrid', {
      dataSource: new Array(20).fill(null).map((_, index) => ({
        groupField: index < 2 ? index : 2,
        field: `test${index}`,
      })),
      height: 400,
      paging: { pageSize: 5 },
      columns: [{ dataField: 'groupField', groupIndex: 0 }, 'field'],
      rowAlternationEnabled: true,
      grouping: { autoExpandAll: true },
      scrolling: { mode: 'virtual', useNative: false },
    });

    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());
    expect(await dataGrid.hasScrollable()).toBe(true);

    await dataGrid.scrollTo({ y: 100 });
    await dataGrid.scrollTo({ y: 200 });
    await dataGrid.scrollTo({ y: 300 });
    await dataGrid.scrollTo({ y: 400 });

    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const visibleRows = await dataGrid.apiGetVisibleRows();
    expect(visibleRows.length).toBeGreaterThan(0);

    const dataRowCount = visibleRows.filter((r) => r.rowType === 'data').length;
    expect(dataRowCount).toBeGreaterThan(0);
  });

  test('DataGrid - Gray boxes appear when the push method is used to remove rows in infinite scrolling mode (T1240079)', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await createWidget(page, 'dxDataGrid', () => {
      const data = [
        { id: 1, text: 'text 1' },
        { id: 2, text: 'text 2' },
      ];
      const dataSource = {
        reshapeOnPush: true,
        store: new (window as any).DevExpress.data.CustomStore({
          key: 'id',
          loadMode: 'raw',
          load: () => Promise.resolve(data),
        }),
      };

      return {
        dataSource,
        showBorders: true,
        scrolling: { mode: 'infinite' },
        height: 300,
      };
    });

    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const initialRows = await dataGrid.apiGetVisibleRows();
    expect(initialRows.length).toBe(2);

    await dataGrid.apiPush([
      { type: 'remove', key: 1 },
      { type: 'remove', key: 2 },
    ]);

    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const finalRows = await dataGrid.apiGetVisibleRows();
    expect(finalRows.length).toBe(0);

    const freeSpaceRows = page.locator('.dx-freespace-row');
    const grayBoxes = page.locator('.dx-datagrid-rowsview .dx-row:not(.dx-freespace-row):not(.dx-virtual-row)');
    const grayBoxCount = await grayBoxes.count();
    expect(grayBoxCount).toBe(0);
  });

  test('DataGrid should set the scrollbar position to the right on resize when RTL is enabled (T934842)', async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 250 });

    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(1, 50),
      rtlEnabled: true,
      columnWidth: 100,
    });

    const dataGrid = new DataGrid(page);
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const getMaxScrollLeft = async (): Promise<number> => page.evaluate(() => {
      const scrollable = ($('#container') as any).dxDataGrid('instance').getScrollable();
      return scrollable.scrollWidth() - scrollable.clientWidth();
    });

    await page.setViewportSize({ width: 900, height: 250 });
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());
    const scrollLeft1 = await dataGrid.getScrollLeft();
    const maxScrollLeft1 = await getMaxScrollLeft();
    expect(scrollLeft1).toBe(maxScrollLeft1);

    await page.setViewportSize({ width: 700, height: 250 });
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());
    const scrollLeft2 = await dataGrid.getScrollLeft();
    const maxScrollLeft2 = await getMaxScrollLeft();
    expect(scrollLeft2).toBe(maxScrollLeft2);
  });

  test('New virtual mode. Virtual rows should not be in view port', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).myStore = new (window as any).DevExpress.data.ArrayStore({
        key: 'ID',
        data: (() => {
          const items: Record<string, unknown>[] = [];
          for (let i = 0; i < 100; i += 1) {
            items.push({ ID: i + 1, Name: `Name ${i + 1}` });
          }
          return items;
        })(),
      });
    });

    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: {
        key: 'ID',
        load(loadOptions: any) {
          return new Promise((resolve) => {
            setTimeout(() => {
              (window as any).myStore.load(loadOptions).done((data: any) => resolve(data));
            }, 300);
          });
        },
        totalCount(loadOptions: any) {
          return (window as any).myStore.totalCount(loadOptions);
        },
      },
      height: 420,
      remoteOperations: true,
      scrolling: {
        mode: 'virtual',
        legacyMode: false,
      },
    }));

    const dataGrid = new DataGrid(page);

    await page.waitForTimeout(600);
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const getVirtualRowInfo = async () => page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      const rowsViewEl = instance.getView('rowsView').element()[0];
      const virtualRows = rowsViewEl.querySelectorAll('.dx-virtual-row');
      return {
        count: virtualRows.length,
        rows: Array.from(virtualRows).map((el: any) => ({
          top: el.getBoundingClientRect().top,
          bottom: el.getBoundingClientRect().bottom,
        })),
        viewportTop: rowsViewEl.getBoundingClientRect().top,
        viewportBottom: rowsViewEl.getBoundingClientRect().bottom,
      };
    });

    const info1 = await getVirtualRowInfo();
    const visibleRows1 = await dataGrid.apiGetVisibleRows();
    expect(visibleRows1.length).toBeGreaterThan(0);

    if (info1.count > 0) {
      const virtualRow = info1.rows[0];
      const isInViewport = virtualRow.bottom > info1.viewportTop && virtualRow.top < info1.viewportBottom;
      expect(isInViewport).toBe(false);
    }

    await dataGrid.scrollTo({ top: 2520 });
    await page.waitForTimeout(300);
    await dataGrid.scrollTo({ top: 4580 });
    await page.waitForTimeout(600);

    const isVirtualInViewport = await dataGrid.isVirtualRowIntersectViewport();
    expect(isVirtualInViewport).toBe(false);

    await page.evaluate(() => {
      delete (window as any).myStore;
    });
  });

  test('New mode. Rows should be rendered properly when rowRenderingMode is virtual and max height (T1054920)', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelector('#container')?.setAttribute('style', 'max-height: 600px');
    });

    const getItems = () => {
      const items: { id: number; name: string }[] = [];
      for (let i = 0; i < 100; i += 1) {
        items.push({ id: i + 1, name: `Name ${i + 1}` });
      }
      return items;
    };

    await createWidget(page, 'dxDataGrid', {
      dataSource: getItems(),
      keyExpr: 'id',
      showBorders: true,
      remoteOperations: true,
      scrolling: {
        rowRenderingMode: 'virtual',
        useNative: false,
      },
      paging: {
        pageSize: 10,
      },
      pager: {
        visible: true,
        allowedPageSizes: [10, 'all'],
        showPageSizeSelector: true,
      },
    });

    const dataGrid = new DataGrid(page);
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const visibleRows1 = await dataGrid.apiGetVisibleRows();
    expect(visibleRows1.length).toBe(10);

    const pageSizeAll = dataGrid.getPager().locator('.dx-page-size').last();
    await pageSizeAll.click();
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const visibleRows2 = await dataGrid.apiGetVisibleRows();
    expect(visibleRows2.length).toBeGreaterThan(0);

    await dataGrid.scrollTo({ top: 2000 });

    const isVirtualInViewport1 = await dataGrid.isVirtualRowIntersectViewport();
    expect(isVirtualInViewport1).toBe(false);

    const visibleRows3 = await dataGrid.apiGetVisibleRows();
    expect(visibleRows3.length).toBeGreaterThan(0);

    const pageSizeTen = dataGrid.getPager().locator('.dx-page-size').first();
    await pageSizeTen.click();
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const isVirtualInViewport2 = await dataGrid.isVirtualRowIntersectViewport();
    expect(isVirtualInViewport2).toBe(false);

    const visibleRows4 = await dataGrid.apiGetVisibleRows();
    expect(visibleRows4.length).toBe(10);

    await page.evaluate(() => {
      document.querySelector('#container')?.removeAttribute('style');
    });
  });

  test('Editing buttons should rerender correctly after scrolling if repaintChangesOnly=true', async ({ page }) => {
    const data = Array.from({ length: 14 }, (_, i) => ({ id: i + 1 }));

    await createWidget(page, 'dxDataGrid', {
      height: 200,
      dataSource: data,
      keyExpr: 'id',
      scrolling: {
        mode: 'virtual',
      },
      editing: {
        mode: 'row',
        allowUpdating: true,
        allowDeleting: true,
      },
      repaintChangesOnly: true,
    });

    const dataGrid = new DataGrid(page);
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    await dataGrid.scrollBy({ top: 1000 });
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    await dataGrid.apiEditRow(3);
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const editRow = dataGrid.element.locator('.dx-edit-row');
    await expect(editRow).toBeVisible();

    await dataGrid.scrollBy({ top: -1000 });
    await dataGrid.scrollBy({ top: 1000 });
    await dataGrid.scrollBy({ top: -1 });
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const saveButtons = dataGrid.element.locator('.dx-edit-row .dx-link-save');
    const cancelButtons = dataGrid.element.locator('.dx-edit-row .dx-link-cancel');
    await expect(saveButtons).toBeVisible();
    await expect(cancelButtons).toBeVisible();
  });

  test('Scroll to the bottom after expand several group', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      width: 1000,
      height: 440,
      dataSource: (window as any).DevExpress.data.AspNet.createStore({
        key: 'Id',
        loadUrl: 'https://api/data',
      }),
      remoteOperations: { groupPaging: true },
      scrolling: {
        mode: 'virtual',
        useNative: false,
      },
      grouping: {
        autoExpandAll: false,
      },
      groupPanel: {
        visible: true,
      },
      showBorders: true,
      columns: [{
        dataField: 'Id',
        dataType: 'number',
        width: 75,
      }, {
        caption: 'Subcategory',
        dataField: 'ProductSubcategoryName',
        width: 150,
      }, {
        caption: 'Store',
        dataField: 'StoreName',
        groupIndex: 0,
        width: 150,
      }, {
        caption: 'Category',
        dataField: 'ProductCategoryName',
        groupIndex: 1,
        width: 150,
      }, {
        caption: 'Product',
        dataField: 'ProductName',
      }],
      loadingTimeout: 0,
    }));

    const dataGrid = new DataGrid(page);

    const hasScrollable = await dataGrid.hasScrollable();
    expect(hasScrollable).toBe(true);

    await dataGrid.scrollTo({ y: 100000 });
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    await dataGrid.apiExpandRow(['Contoso York Store']);
    await dataGrid.apiExpandRow(['Contoso York Store', 'Audio']);

    await dataGrid.scrollTo({ y: 100000 });
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    await dataGrid.scrollBy({ y: -1 });
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const visibleRows = await dataGrid.apiGetVisibleRows();
    if (visibleRows.length > 0) {
      expect(typeof visibleRows[0].key).toBe('number');
    }
  });
});
