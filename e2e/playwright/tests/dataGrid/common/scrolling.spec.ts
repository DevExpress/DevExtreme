import type { Page } from '@playwright/test';
import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../fixtures';
import { mockApi } from '../../../helpers/apiMock';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../helpers/domUtils';
import { dragToOffset } from '../../../helpers/dragUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import DataGrid from '../../../models/dataGrid';
import { expectClass } from '../../../models/internal/classMatcher';
import { collectWarnings } from '../helpers/consoleWarnings';
import { typeText } from '../helpers/typeText';
import { waitForScrollHandled } from '../helpers/waitForQueuedTimers';
import { salesApiMock } from './apiMocks/salesApiMock';

const VIRTUAL_ROW_CLASS = 'dx-virtual-row';

async function getMaxRightOffset(dataGrid: DataGrid): Promise<number> {
  const scrollWidth = await dataGrid.getScrollWidth();
  const rowsViewWidth = await dataGrid.getRowsView().evaluate((element) => element.clientWidth);
  return scrollWidth - rowsViewWidth;
}

async function getRightScrollOffset(dataGrid: DataGrid): Promise<number> {
  const maxHorizontalOffset = await getMaxRightOffset(dataGrid);
  const scrollLeft = await dataGrid.getScrollLeft();
  return maxHorizontalOffset - scrollLeft;
}

function getData(rowCount: number, colCount: number): Record<string, string>[] {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i += 1) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j += 1) {
      item[`field_${j}`] = `val_${i}_${j}`;
    }
    items.push(item);
  }

  return items;
}

function getRefreshedData(
  rowCount: number,
  colCount: number,
  refreshIndex: number,
): Record<string, string>[] {
  return getData(rowCount, colCount).map((item) => ({
    ...item,
    field_0: `${item.field_0}_refresh_${refreshIndex}`,
  }));
}

async function getTestLoadCount(page: Page): Promise<number> {
  return page.evaluate(() => (window as any).testLoadCount as number);
}

async function getTestLoadOptions(page: Page): Promise<{ skip: number; take: number }[]> {
  return page.evaluate(
    () => (window as any).testLoadOptions as { skip: number; take: number }[],
  );
}

// A virtual grid loads and renders the rows of a new scroll position a moment after the scroll.
async function waitForScrollRender(dataGrid: DataGrid): Promise<void> {
  await expect.poll(() => dataGrid.isReady()).toBe(true);
  await expect.poll(() => dataGrid.isViewportRowsRenderPending()).toBe(false);
}

const getScrollLeftOf = (element: ReturnType<DataGrid['getScrollContainer']>): Promise<number> => element
  .evaluate((node) => node.scrollLeft);

const getRightPadding = async (dataGrid: DataGrid): Promise<number> => {
  const padding = await dataGrid.getHeaders().element
    .evaluate((element) => getComputedStyle(element).paddingRight);
  return parseFloat(padding);
};

const getFirstVisibleRowHeight = (page: Page): Promise<number> => page.evaluate(
  () => $((window as any).widget.element()).find('.dx-data-row').first().height() ?? 0,
);

const getViewportSize = (page: Page): Promise<number> => page.evaluate(
  () => (window as any).widget.getController('data').viewportSize() as number,
);

test.describe('Scrolling', () => {
  test('DataGrid should set the scrollbar position to the left on resize (T934842)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(1, 50),
      columnWidth: 100,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // act
    await page.setViewportSize({ width: 900, height: 250 });

    // assert
    // The simulated scrollable reports -0 at the start, which toBe(0) rejects.
    await expect.poll(() => dataGrid.getScrollLeft()).toBeCloseTo(0);

    // act
    await page.setViewportSize({ width: 700, height: 250 });

    // assert
    await expect.poll(() => dataGrid.getScrollLeft()).toBeCloseTo(0);

    // act
    await page.setViewportSize({ width: 600, height: 250 });

    // assert
    await expect.poll(() => dataGrid.getScrollLeft()).toBeCloseTo(0);
  });

  test('DataGrid should set the scrollbar position to the right on resize when RTL is enabled (T934842)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(1, 50),
      rtlEnabled: true,
      columnWidth: 100,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // act
    await page.setViewportSize({ width: 900, height: 250 });
    let maxRightOffset = await getMaxRightOffset(dataGrid);

    // assert
    await expect.poll(() => dataGrid.getScrollLeft()).toBe(maxRightOffset);

    // act
    await page.setViewportSize({ width: 700, height: 250 });
    maxRightOffset = await getMaxRightOffset(dataGrid);

    // assert
    await expect.poll(() => dataGrid.getScrollLeft()).toBe(maxRightOffset);

    // act
    await page.setViewportSize({ width: 600, height: 250 });
    maxRightOffset = await getMaxRightOffset(dataGrid);

    // assert
    await expect.poll(() => dataGrid.getScrollLeft()).toBe(maxRightOffset);
  });

  test('DataGrid should not reset its left scroll position on window resize when columnRenderingMode is virtual with fixed columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data): Properties => ({
      dataSource: data,
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      customizeColumns(columns) {
        /* eslint-disable no-param-reassign */
        columns[0].fixed = true;
        columns[1].fixed = true;
        columns[48].fixed = true;
        columns[48].fixedPosition = 'right';
        columns[49].fixed = true;
        columns[49].fixedPosition = 'right';
        /* eslint-enable no-param-reassign */
      },
    }), DEFAULT_SELECTOR, { arg: getData(1, 50) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // act
    await page.setViewportSize({ width: 900, height: 250 });
    await dataGrid.scrollTo({ left: 100 });

    // assert
    await expect.poll(() => dataGrid.getScrollLeft()).toBe(100);

    // act
    await page.setViewportSize({ width: 700, height: 250 });

    // assert
    await expect.poll(() => dataGrid.getScrollLeft()).toBe(100);

    // act
    await page.setViewportSize({ width: 600, height: 250 });

    // assert
    await expect.poll(() => dataGrid.getScrollLeft()).toBe(100);
  });

  test('DataGrid should not reset its right scroll position on window resize when columnRenderingMode is virtual with fixed columns (rtlEnabled)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data): Properties => ({
      dataSource: data,
      columnWidth: 100,
      rtlEnabled: true,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      customizeColumns(columns) {
        /* eslint-disable no-param-reassign */
        columns[0].fixedPosition = 'right';
        columns[0].fixed = true;
        columns[1].fixedPosition = 'right';
        columns[1].fixed = true;
        columns[48].fixed = true;
        columns[49].fixed = true;
        /* eslint-enable no-param-reassign */
      },
    }), DEFAULT_SELECTOR, { arg: getData(1, 50) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // act
    await page.setViewportSize({ width: 900, height: 250 });
    const maxHorizontalPosition = await getMaxRightOffset(dataGrid);
    const scrollLeft = maxHorizontalPosition - 100;
    await dataGrid.scrollTo({ left: scrollLeft });

    // assert
    await expect.poll(() => getRightScrollOffset(dataGrid)).toBe(100);

    // act
    await page.setViewportSize({ width: 700, height: 250 });

    // assert
    await expect.poll(() => getRightScrollOffset(dataGrid)).toBe(100);

    // act
    await page.setViewportSize({ width: 600, height: 250 });

    // assert
    await expect.poll(() => getRightScrollOffset(dataGrid)).toBe(100);
  });

  test('DataGrid should not reset its top scroll position after cell modification with master-detail', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => ({
      height: 300,
      dataSource: [{ FirstName: 'A', LastName: 'B' }, { FirstName: 'C', LastName: 'D' }],
      editing: {
        allowUpdating: true,
        mode: 'cell',
      },
      masterDetail: {
        enabled: true,
        template: (container): void => {
          $('<div>')
            .css('height', '200px')
            .appendTo(container);
        },
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // act
    await dataGrid.getDataRow(0).getCommandCell(0).element.click();
    await dataGrid.scrollTo({ top: 220 });
    const scrollTop = await dataGrid.getScrollTop();
    await dataGrid.getDataRow(1).getCommandCell(0).element.click();
    await dataGrid.getDataCell(2, 1).element.click();
    await typeText(dataGrid.getDataCell(2, 1).getEditor().element, 'new_value');
    await page.keyboard.press('Tab');
    // assert
    const newScrollTop = await dataGrid.getScrollTop();
    expect(Math.abs(scrollTop - newScrollTop) < 2, `ScrollTop ${scrollTop} changes after editing to ${newScrollTop}`).toBe(true);
  });

  // Theme dependent test
  test('Ungrouping after grouping should work correctly if row rendering mode is virtual', async ({ page }) => {
    const getItems = (): Record<string, unknown>[] => {
      const items: Record<string, unknown>[] = [];
      for (let i = 1; i <= 25; i += 1) {
        const groupIndex = (i % 8) + 1;
        items.push({
          id: i,
          group: `group${groupIndex}`,
        });
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
        // @ts-expect-error private option
        updateTimeout: 0,
        useNative: false,
      },
      grouping: {
        autoExpandAll: false,
      },
      groupPanel: {
        visible: true,
      },
      paging: {
        pageSize: 10,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataGrid.scrollTo({ top: 500 });
    await waitForScrollRender(dataGrid);
    let visibleRows = await dataGrid.apiGetVisibleRows();

    // assert
    expect(visibleRows[0].rowType).toBe('data');
    expect(visibleRows[0].key).not.toBe(1);

    // act
    await dataGrid.apiColumnOption('group', 'groupIndex', 0);
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    visibleRows = await dataGrid.apiGetVisibleRows();

    // assert
    expect(visibleRows.length).toBe(8);
    expect(visibleRows[0].rowType).toBe('group');
    expect(visibleRows[0].key).toEqual(['group1']);
    expect(visibleRows[7].rowType).toBe('group');
    expect(visibleRows[7].key).toEqual(['group8']);

    // act
    await dataGrid.apiColumnOption('group', 'groupIndex', undefined);
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    const groupRow = dataGrid.getGroupRowSelector();

    // assert
    await expect(groupRow).toHaveCount(0);

    visibleRows = await dataGrid.apiGetVisibleRows();

    expect(visibleRows[0].rowType).toBe('data');
    expect(visibleRows[0].key).toBe(1);
  });

  test('Scroll position after grouping when RTL (T388508)', async ({ page }) => {
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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // assert
    await expect.poll(() => dataGrid.getScrollLeft()).toBe(300);

    // act
    await dataGrid.scrollTo({ left: 100 });
    const scrollRight = await dataGrid.getScrollRight();
    await dataGrid.apiColumnOption('field1', 'groupIndex', 0);

    // assert
    const groupRow = dataGrid.getGroupRowSelector();

    await expect(groupRow.first()).toBeAttached();

    const visibleRows = await dataGrid.apiGetVisibleRows();
    const scrollRightAfterGrouping = await dataGrid.getScrollRight();

    // assert
    expect(visibleRows[0].rowType).toBe('group');
    expect(Math.floor(scrollRightAfterGrouping)).toBe(Math.floor(scrollRight));
  });

  [false, true].forEach((rtlEnabled) => {
    test(`Headers should have a border before the scrollbar gutter when the vertical scrollbar occupies space (rtlEnabled = ${rtlEnabled}) (T1306973)`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, `
        ::-webkit-scrollbar { -webkit-appearance: none; width: 14px; height: 14px; }
        ::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, .5); border-radius: 7px; }
        ::-webkit-scrollbar-track { background-color: #fafafa; border-${rtlEnabled ? 'right' : 'left'}: 1px solid #e0e0e0; }
      `);

      await createWidget(page, 'dxDataGrid', {
        rtlEnabled,
        width: 700,
        height: 300,
        showBorders: true,
        dataSource: getData(30, 5),
        columns: ['field_0', 'field_1', 'field_2', 'field_3', 'field_4'],
        filterRow: {
          visible: true,
        },
        summary: {
          totalItems: [{
            column: 'field_0',
            summaryType: 'count',
          }],
        },
        scrolling: {
          useNative: true,
        },
      });

      // arrange, act
      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      const headersElement = dataGrid.getHeaders().element;
      const padding = parseFloat(await headersElement.evaluate(
        (element, isRtl) => getComputedStyle(element)[isRtl ? 'paddingLeft' : 'paddingRight'],
        rtlEnabled,
      ));

      // assert
      await expectClass(headersElement, 'dx-datagrid-scroller-spacing');
      expect(padding).toBe(14);

      await testScreenshot(
        page,
        `grid-headers-scroller-spacing-border${rtlEnabled ? '-rtl' : ''}.png`,
        { element: DEFAULT_SELECTOR },
      );
    });
  });

  test('Horizontal scrolling should work correctly in RTL mode with native scrolling (T1318490)', async ({ page }) => {
    await insertStylesheetRulesToPage(page, `
      ::-webkit-scrollbar { -webkit-appearance: none; width: 14px; height: 14px; }
      ::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, .5); border-radius: 7px; }
      ::-webkit-scrollbar-track { background-color: #fafafa; }
    `);

    await createWidget(page, 'dxDataGrid', {
      rtlEnabled: true,
      width: 700,
      height: 300,
      showBorders: true,
      dataSource: getData(30, 5),
      columns: [
        { dataField: 'field_0', width: 300 },
        { dataField: 'field_1', width: 300 },
        { dataField: 'field_2', width: 300 },
        { dataField: 'field_3', width: 300 },
        { dataField: 'field_4', width: 300 },
      ],
      scrolling: {
        useNative: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const rowsScrollContainer = dataGrid.getScrollContainer();
    const headersScrollContainer = dataGrid.getHeadersScrollContainer();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // assert: the grid must not scroll itself on initialization
    await expect.poll(() => getScrollLeftOf(rowsScrollContainer)).toBe(0);
    await expect.poll(() => getScrollLeftOf(headersScrollContainer)).toBe(0);

    const initialScrollLeft = await dataGrid.getScrollLeft();

    // act: scroll to the left
    await dataGrid.scrollTo({ left: initialScrollLeft - 120 });

    // assert: the headers are in sync with the content
    await expect.poll(() => getScrollLeftOf(rowsScrollContainer)).toBe(-120);
    await expect.poll(() => getScrollLeftOf(headersScrollContainer)).toBe(-120);

    // act: scroll back to the right edge
    await dataGrid.scrollTo({ left: initialScrollLeft });

    // assert: the content must not jump to the opposite edge
    await expect.poll(() => getScrollLeftOf(rowsScrollContainer)).toBe(0);
    await expect.poll(() => getScrollLeftOf(headersScrollContainer)).toBe(0);
  });

  test('Column headers should keep the scroll position after resizing a column in RTL mode with native scrolling', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      rtlEnabled: true,
      width: 500,
      dataSource: getData(5, 10),
      columnAutoWidth: true,
      allowColumnResizing: true,
      columnResizingMode: 'nextColumn',
      scrolling: {
        useNative: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const rowsScrollContainer = dataGrid.getScrollContainer();
    const headersScrollContainer = dataGrid.getHeadersScrollContainer();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const initialScrollLeft = await dataGrid.getScrollLeft();

    await dataGrid.scrollTo({ left: initialScrollLeft - 100 });

    await expect.poll(() => getScrollLeftOf(rowsScrollContainer)).toBe(-100);
    await expect.poll(() => getScrollLeftOf(headersScrollContainer)).toBe(-100);

    await dataGrid.resizeHeader(2, -30);

    await expect.poll(() => getScrollLeftOf(rowsScrollContainer)).toBe(-100);
    await expect.poll(() => getScrollLeftOf(headersScrollContainer)).toBe(-100);
  });

  test('Column headers should keep the scroll position after repaint in RTL mode with native scrolling', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      rtlEnabled: true,
      width: 500,
      dataSource: getData(5, 10),
      columnAutoWidth: true,
      scrolling: {
        useNative: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const rowsScrollContainer = dataGrid.getScrollContainer();
    const headersScrollContainer = dataGrid.getHeadersScrollContainer();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const initialScrollLeft = await dataGrid.getScrollLeft();

    await dataGrid.scrollTo({ left: initialScrollLeft - 100 });

    await expect.poll(() => getScrollLeftOf(rowsScrollContainer)).toBe(-100);
    await expect.poll(() => getScrollLeftOf(headersScrollContainer)).toBe(-100);

    await dataGrid.repaint();

    await expect.poll(() => getScrollLeftOf(rowsScrollContainer)).toBe(-100);
    await expect.poll(() => getScrollLeftOf(headersScrollContainer)).toBe(-100);
  });

  test('Column headers should have the correct scroll position after refreshing the data twice when RTL and virtual scrolling are enabled (T1333941)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 700,
      height: 300,
      rtlEnabled: true,
      dataSource: getData(30, 20),
      columnWidth: 100,
      scrolling: {
        mode: 'virtual',
        useNative: false,
        // @ts-expect-error private option
        updateTimeout: 3000,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const initialScrollLeft = await dataGrid.getHeadersScrollLeft();

    // act
    await dataGrid.option('dataSource', getRefreshedData(30, 20, 1));

    await expect(dataGrid.getDataCell(0, 0).element).toHaveText('val_0_0_refresh_1');

    await dataGrid.option('dataSource', getRefreshedData(30, 20, 2));

    await expect(dataGrid.getDataCell(0, 0).element).toHaveText('val_0_0_refresh_2');

    // assert
    const scrollLeft = await dataGrid.getHeadersScrollLeft();

    expect(scrollLeft).toBe(initialScrollLeft);
  });

  test('Column headers should have the correct scroll position after refreshing the data twice when the grid is scrolled horizontally and virtual scrolling is enabled (T1333941)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 700,
      height: 300,
      dataSource: getData(30, 20),
      columnWidth: 100,
      scrolling: {
        mode: 'virtual',
        // @ts-expect-error private option
        updateTimeout: 3000,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollTo({ left: 1000 });

    await expect.poll(() => dataGrid.getScrollLeft()).toBe(1000);

    const initialScrollLeft = await dataGrid.getHeadersScrollLeft();

    // act
    await dataGrid.option('dataSource', getRefreshedData(30, 20, 1));

    await expect(dataGrid.getDataCell(0, 0).element).toHaveText('val_0_0_refresh_1');

    await dataGrid.option('dataSource', getRefreshedData(30, 20, 2));

    await expect(dataGrid.getDataCell(0, 0).element).toHaveText('val_0_0_refresh_2');

    // assert
    const scrollLeft = await dataGrid.getHeadersScrollLeft();

    expect(scrollLeft).toBe(initialScrollLeft);
  });

  [false, true].forEach((useNative) => {
    const createRtlVirtualScrollingGrid = async (page: Page): Promise<void> => createWidget(page, 'dxDataGrid', {
      width: 700,
      height: 400,
      rtlEnabled: true,
      dataSource: getData(1000, 10),
      columnWidth: 200,
      scrolling: {
        mode: 'virtual',
        useNative,
        // @ts-expect-error private option
        updateTimeout: 0,
      },
    });

    test(`Horizontal scroll position should not change during vertical scrolling when RTL and virtual scrolling are enabled (useNative = ${useNative}) (T1335898)`, async ({ page }) => {
      await createRtlVirtualScrollingGrid(page);

      // arrange
      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      const initialScrollLeft = await dataGrid.getScrollLeft();

      await dataGrid.scrollTo({ left: initialScrollLeft - 150 });

      await expect.poll(() => dataGrid.getScrollLeft()).toBe(initialScrollLeft - 150);

      // act
      await dataGrid.scrollTo({ top: 1500 });

      // assert
      await expect.poll(() => dataGrid.isReady()).toBe(true);
      await expect.poll(() => dataGrid.apiPageIndex()).toBe(1);
      await expect(dataGrid.getDataRow(30).element).toBeAttached();
      await expect.poll(() => dataGrid.getScrollLeft()).toBe(initialScrollLeft - 150);
    });

    test(`Horizontal scroll position should not change when scrolling horizontally and vertically at once with RTL and virtual scrolling enabled (useNative = ${useNative}) (T1335898)`, async ({ page }) => {
      await createRtlVirtualScrollingGrid(page);

      // arrange
      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      const initialScrollLeft = await dataGrid.getScrollLeft();

      // act
      await dataGrid.scrollTo({ left: initialScrollLeft - 150, top: 1500 });

      // assert
      await expect.poll(() => dataGrid.isReady()).toBe(true);
      await expect.poll(() => dataGrid.apiPageIndex()).toBe(1);
      await expect(dataGrid.getDataRow(30).element).toBeAttached();
      await expect.poll(() => dataGrid.getScrollLeft()).toBe(initialScrollLeft - 150);
    });
  });

  test('Header container should have padding-right after expanding the master row with a detail grid when using native scrolling (T1004507)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => ({
      width: 150,
      height: 300,
      columnMinWidth: 100,
      dataSource: [{
        id: 0, field1: 'test1', field2: 'test2', field3: 'test3',
      }],
      keyExpr: 'id',
      columns: ['field1', 'field2', 'field3'],
      scrolling: {
        useNative: true,
      },
      masterDetail: {
        enabled: true,
        template(): any {
          return ($('<div>') as any).dxDataGrid({
            dataSource: [
              {
                id: 0, field1: 'test11', field2: 'test21', field3: 'test31',
              },
              {
                id: 1, field1: 'test12', field2: 'test22', field3: 'test32',
              },
              {
                id: 2, field1: 'test13', field2: 'test23', field3: 'test33',
              },
              {
                id: 3, field1: 'test14', field2: 'test24', field3: 'test34',
              },
              {
                id: 4, field1: 'test15', field2: 'test25', field3: 'test35',
              },
            ],
            columns: ['field1', 'field2', 'field3'],
            columnMinWidth: 100,
            keyExpr: 'id',
          });
        },
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataGrid.getDataRow(0).getCommandCell(0).element.click();

    // assert
    await dataGrid.getDataRow(0).expectExpanded();

    // act
    await dataGrid.scrollTo({ left: 180 });
    await dataGrid.scrollTo({ left: 210 });
    const scrollBarWidth = await dataGrid.getScrollbarWidth(false);

    await page.setViewportSize({ width: 600, height: 250 });

    // assert
    await expect.poll(() => getRightPadding(dataGrid)).toBe(scrollBarWidth);

    await testScreenshot(page, 'grid-column-lines-alignment-master-grid-horizontal-scrolling.png', { element: DEFAULT_SELECTOR });
  });

  test('Header container should have padding-right if grid has max-height and scrollbar is shown', async ({ page }) => {
    await page.evaluate((selector) => {
      $(selector).css('max-height', '200px');
    }, DEFAULT_SELECTOR);

    await createWidget(page, 'dxDataGrid', {
      width: 400,
      showBorders: true,
      scrolling: {
        useNative: true,
      },
      dataSource: [
        {
          id: 0, field1: 'test1', field2: 'test2', field3: 'test3',
        },
        {
          id: 1, field1: 'test1', field2: 'test2', field3: 'test3',
        },
        {
          id: 2, field1: 'test1', field2: 'test2', field3: 'test3',
        },
        {
          id: 3, field1: 'test1', field2: 'test2', field3: 'test3',
        },
        {
          id: 4, field1: 'test1', field2: 'test2', field3: 'test3',
        },
        {
          id: 5, field1: 'test1', field2: 'test2', field3: 'test3',
        },
      ],
      keyExpr: 'id',
      columns: ['field1', 'field2', 'field3'],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    const scrollBarWidth = await dataGrid.getScrollbarWidth(false);

    await dataGrid.scrollBy({ top: 20 });

    // assert
    await expect.poll(() => getRightPadding(dataGrid)).toBe(scrollBarWidth);
    await expect.poll(() => dataGrid.getScrollTop()).toBe(20);

    await testScreenshot(page, 'grid-header-row-scrollbar-padding.png', { element: DEFAULT_SELECTOR });
  });

  test('New virtual mode. A detail row should be rendered when the last master row is expanded', async ({ page }) => {
    const getItems = (): Record<string, unknown>[] => {
      const items: Record<string, unknown>[] = [];
      for (let i = 0; i < 100; i += 1) {
        items.push({
          ID: i + 1,
          Name: `Name ${i + 1}`,
        });
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
        // @ts-expect-error private option
        legacyMode: false,
      },
      masterDetail: {
        enabled: true,
      },
    });

    const ROWS_AMOUNT = 100;
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    const firstVisibleRowHeight = await getFirstVisibleRowHeight(page);
    const scrollTopOffset = ROWS_AMOUNT * firstVisibleRowHeight;

    await dataGrid.scrollTo({ top: scrollTopOffset });
    await waitForScrollRender(dataGrid);
    await dataGrid.getDataRow(99).getCommandCell(0).element.click();

    const getLastRows = async (): Promise<[string, unknown][]> => {
      const visibleRows = await dataGrid.apiGetVisibleRows();

      return visibleRows.slice(-2).map((row) => [row.rowType, row.key]);
    };

    // assert
    await expect.poll(getLastRows).toEqual([['data', ROWS_AMOUNT], ['detail', ROWS_AMOUNT]]);
  });

  test('New virtual mode. An adaptive row should be rendered when the last row is expanded', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => {
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

      return {
        height: 350,
        width: 300,
        dataSource: getItems(),
        keyExpr: 'ID',
        remoteOperations: true,
        scrolling: {
          mode: 'virtual',
          rowRenderingMode: 'virtual',
          // @ts-expect-error private option
          legacyMode: false,
          useNative: false,
        },
        columnHidingEnabled: true,
        customizeColumns(columns) {
          // eslint-disable-next-line no-param-reassign
          columns[0].width = 250;
        },
      };
    });

    const ROWS_AMOUNT = 100;
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    const firstVisibleRowHeight = await getFirstVisibleRowHeight(page);
    const scrollTopOffset = ROWS_AMOUNT * firstVisibleRowHeight;

    await dataGrid.scrollTo({ top: scrollTopOffset });
    await waitForScrollRender(dataGrid);
    await dataGrid.getDataRow(99).getCommandCell(3).element.click();

    const getLastRows = async (): Promise<[string, unknown][]> => {
      const visibleRows = await dataGrid.apiGetVisibleRows();

      return visibleRows.slice(-2).map((row) => [row.rowType, row.key]);
    };

    // assert
    await expect.poll(getLastRows).toEqual([['data', ROWS_AMOUNT], ['detailAdaptive', ROWS_AMOUNT]]);
  });

  // Theme dependent test
  test('New virtual mode. Virtual rows should not be in view port', async ({ page }) => {
    await page.evaluate(() => {
      const getItems = (): Record<string, unknown>[] => {
        const items: Record<string, unknown>[] = [];
        for (let i = 0; i < 100; i += 1) {
          items.push({
            ID: i + 1,
            Name: `Name ${i + 1}`,
          });
        }
        return items;
      };

      (window as any).myStore = new (window as any).DevExpress.data.ArrayStore({
        key: 'ID',
        data: getItems(),
      });
    });

    await createWidget(page, 'dxDataGrid', (): Properties => ({
      dataSource: {
        key: 'ID',
        load(loadOptions) {
          return new Promise((resolve) => {
            // The data comes later, like the answer of a server.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              (window as any).myStore.load(loadOptions).done((data) => {
                resolve(data);
              });
            }, 300);
          });
        },
        totalCount(loadOptions) {
          return (window as any).myStore.totalCount(loadOptions);
        },
      } as any, // todo check
      height: 420,
      remoteOperations: true,
      scrolling: {
        mode: 'virtual',
        // @ts-expect-error private option
        legacyMode: false,
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const getVirtualRowInfo = (): Promise<any> => page.evaluate((virtualRowClass) => {
      const result: any = {};
      const $virtualRows = $((window as any).widget.element()).find(`.${virtualRowClass}`);

      result.count = $virtualRows.length;
      $virtualRows.each((index, el) => {
        const $element = $(el);
        result[index] = {
          top: $element.position().top,
          height: $element.height(),
        };
      });

      return result;
    }, VIRTUAL_ROW_CLASS);
    const getVisibleRowsHeight = (): Promise<number> => page.evaluate(() => {
      let result = 0;
      const $rows = $((window as any).widget.element()).find('.dx-data-row');

      $rows.each((_, el) => {
        result += $(el).height() ?? 0;
      });

      return result;
    });
    // The rows come a moment after a scroll: the data loads with a delay.
    const getRowsState = async (): Promise<{ length: number; firstKey: unknown }> => {
      const rows = await dataGrid.apiGetVisibleRows();

      return { length: rows.length, firstKey: rows[0]?.key };
    };

    await expect.poll(async () => (await getRowsState()).length).toBe(16);
    let visibleRows = await dataGrid.apiGetVisibleRows();
    let virtualRowInfo = await getVirtualRowInfo();
    let visibleRowsHeight = await getVisibleRowsHeight();

    // assert
    expect(visibleRows.length).toBe(16);
    expect(virtualRowInfo.count).toBe(1);
    expect(virtualRowInfo[0].top >= visibleRowsHeight).toBe(true);

    // act
    await dataGrid.scrollTo({ top: 2520 });
    await waitForScrollRender(dataGrid);
    await dataGrid.scrollTo({ top: 4580 });
    await expect.poll(getRowsState).toEqual({ length: 8, firstKey: 93 });

    visibleRows = await dataGrid.apiGetVisibleRows();
    virtualRowInfo = await getVirtualRowInfo();
    const topScrollPosition = await dataGrid.getScrollTop();
    const topVirtualRowPosition = virtualRowInfo[0].top as number;
    const virtualRowHeight = virtualRowInfo[0].height as number;
    const bottomVirtualRowPosition = topVirtualRowPosition + virtualRowHeight;

    // assert
    expect(visibleRows.length).toBe(8);
    expect(visibleRows[0].key).toBe(93);
    expect(virtualRowInfo.count).toBe(1);
    expect(bottomVirtualRowPosition <= topScrollPosition).toBe(true);

    // act
    await dataGrid.scrollTo({ top: 2520 });
    await waitForScrollRender(dataGrid);
    await dataGrid.scrollTo({ top: 0 });
    await expect.poll(getRowsState).toEqual({ length: 8, firstKey: 1 });

    visibleRows = await dataGrid.apiGetVisibleRows();
    virtualRowInfo = await getVirtualRowInfo();
    visibleRowsHeight = await getVisibleRowsHeight();

    // assert
    expect(visibleRows.length).toBe(8);
    expect(visibleRows[0].key).toBe(1);
    expect(virtualRowInfo.count).toBe(1);
    expect(virtualRowInfo[0].top >= visibleRowsHeight).toBe(true);
  });

  test('New row should be rendered at the top when grid is scrolled in virtual scrolling', async ({ page }) => {
    const generateData = (): Record<string, unknown>[] => {
      const items: Record<string, unknown>[] = [];
      for (let i = 0; i < 130; i += 1) {
        items.push({
          ID: i + 1,
          Name: `Name ${i + 1}`,
        });
      }
      return items;
    };
    await page.evaluate((selector) => {
      $(selector).css('max-height', '440px');
    }, DEFAULT_SELECTOR);
    await createWidget(page, 'dxDataGrid', {
      dataSource: generateData(),
      keyExpr: 'ID',
      scrolling: {
        mode: 'virtual',
      },
      paging: {
        pageSize: 10,
      },
      editing: {
        mode: 'row',
        allowAdding: true,
        newRowPosition: 'first',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // act
    await dataGrid.scrollTo({ top: 2350 });

    // assert
    await expect.poll(async () => (await dataGrid.apiGetTopVisibleRowData()).ID).toBe(49);

    await dataGrid.getHeaderPanel().getAddRowButton().click();

    // assert
    await dataGrid.getDataRow(0).expectInserted();
  });

  test.describe(() => {
    test.use({ browserSize: [800, 700] });

    test('New mode. Rows should be rendered properly when rowRenderingMode is virtual and max height (T1054920)', async ({ page }) => {
      const getItems = (): any[] => {
        const items: any[] = [];
        for (let i = 0; i < 100; i += 1) {
          items.push({
            id: i + 1,
            name: `Name ${i + 1}`,
          });
        }

        return items;
      };

      await page.evaluate((selector) => {
        $(selector).css('max-height', '600px');
      }, DEFAULT_SELECTOR);

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

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const getVisibleRowCount = async (): Promise<number> => (
        await dataGrid.apiGetVisibleRows()
      ).length;

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      // assert
      await expect.poll(getVisibleRowCount).toBe(10);

      // act
      await dataGrid.getPager().getPageSize(1).click();

      // assert
      await expect.poll(getVisibleRowCount).toBeGreaterThan(0);

      await dataGrid.scrollTo({ top: 2000 });

      // act
      await expect.poll(() => dataGrid.isVirtualRowIntersectViewport()).toBe(false);

      // assert
      await expect.poll(getVisibleRowCount).toBe(13);

      // act
      await dataGrid.getPager().getPageSize(0).click();

      // act
      await expect.poll(() => dataGrid.isVirtualRowIntersectViewport()).toBe(false);

      // assert
      await expect.poll(getVisibleRowCount).toBe(10);
    });
  });

  test.describe(() => {
    test.use({ browserSize: [800, 800] });

    // Theme dependent test
    test('Rows are rendered properly when window content is scrolled (T1070388)', async ({ page }) => {
      const getItems = (): any[] => {
        const items: any[] = [];
        for (let i = 0; i < 100; i += 1) {
          items.push({
            id: i + 1,
            name: `Name ${i + 1}`,
          });
        }

        return items;
      };

      await page.evaluate(() => {
        for (let i = 0; i < 100; i += 1) {
          $('body').prepend('<br class="myBr" />');
        }
        for (let i = 0; i < 100; i += 1) {
          $('body').append('<br class="myBr" />');
        }
      });

      await createWidget(page, 'dxDataGrid', {
        dataSource: getItems(),
        keyExpr: 'id',
        showBorders: true,
        scrolling: {
          mode: 'virtual',
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      const scrollWindowTo = async (position: number): Promise<void> => {
        await page.evaluate((top) => { (window as any).scroll({ top }); }, position);
      };
      const getWindowScrollPosition = (): Promise<number> => page.evaluate(
        () => (window as any).scrollY,
      );
      // The grid renders the rows of the window's new scroll position a moment after the scroll.
      const getRowsState = async (): Promise<[number, boolean, boolean]> => {
        const rows = await dataGrid.apiGetVisibleRows();

        return [rows.length, (rows[0]?.key as number) > 20, (rows[18]?.key as number) > 35];
      };

      let visibleRows = await dataGrid.apiGetVisibleRows();

      // assert
      expect(visibleRows.length > 0).toBe(true);

      // act
      await scrollWindowTo(3100);

      // assert
      await expect.poll(getWindowScrollPosition).toBe(3100);

      // assert
      await expect.poll(getRowsState).toEqual([19, true, true]);

      // act
      await scrollWindowTo(6000);

      // assert
      await expect.poll(getWindowScrollPosition).toBe(6000);

      // act
      await scrollWindowTo(3100);

      // assert
      await expect.poll(getWindowScrollPosition).toBe(3100);

      // assert
      await expect.poll(getRowsState).toEqual([19, true, true]);

      // act
      await scrollWindowTo(0);

      // assert
      await expect.poll(getWindowScrollPosition).toBe(0);

      visibleRows = await dataGrid.apiGetVisibleRows();

      // assert
      expect(visibleRows.length > 0).toBe(true);
    });
  });

  // T1129252
  test('The data should display correctly after changing the dataSource and focusedRowIndex options when scroll position is at the end', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 250,
      width: 200,
      keyExpr: 'id',
      dataSource: [...new Array(100)].map((_, index) => ({ id: index, text: `item ${index}` })),
      columnWidth: 100,
      focusedRowEnabled: true,
      focusedRowIndex: 99,
      scrolling: {
        mode: 'virtual',
      },
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    const scrollToBottom = async (): Promise<void> => {
      await dataGrid.scrollTo({ top: 100000 });
      await expect.poll(() => dataGrid.isReady()).toBe(true);
    };

    await scrollToBottom();

    // act
    await dataGrid.option({
      focusedRowIndex: -1,
      dataSource: [...new Array(100)].map((_, index) => ({ id: index, text: `item ${index}` })),
    });

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(() => dataGrid.apiGetTopVisibleRowData()).toEqual({ id: 96, text: 'item 96' });
    await testScreenshot(page, 'grid-virtual-scrolling-T1129252.png', { element: DEFAULT_SELECTOR });
  });

  test.describe(() => {
    test.use({ browserSize: [800, 800] });

    // T1166649
    test('The scroll position of a fixed table should be synchronized with the main table when fast scrolling to the end', async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [...new Array(1000)].map((_, index) => ({ id: index, text: `item ${index}` })),
        keyExpr: 'id',
        showRowLines: true,
        height: 600,
        scrolling: {
          mode: 'virtual',
          useNative: false,
        },
        editing: {
          mode: 'row',
          allowUpdating: true,
          allowDeleting: true,
          useIcons: true,
        },
        columnFixing: {
          enabled: true,
        },
        columns: [{
          type: 'buttons',
          fixedPosition: 'left',
        }, 'id', 'text'],
      });

      // arrange
      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const scrollbarVerticalThumbTrack = dataGrid.getScrollBarThumbTrack('vertical');

      // act
      await scrollbarVerticalThumbTrack.hover();
      await dragToOffset(page, scrollbarVerticalThumbTrack, 0, 600);
      // The rows of the end render a moment after the scroll.
      await waitForScrollRender(dataGrid);

      await testScreenshot(page, 'grid-virtual-scrolling_with_fixed_columns-T1166649.png', { element: 'tr[aria-rowindex="999"]' });
      // assert
    });

    // T1089634
    test('The page should not be changed when hiding/showing the grid view after the data has been edited', async ({ page }) => {
      await page.evaluate(() => {
        (window as any).testLoadCount = 0;

        $('body').css({
          minHeight: '100px',
          minWidth: '100px',
        });
      });

      await createWidget(page, 'dxDataGrid', (): Properties => ({
        height: 500,
        dataSource: {
          load() {
            ((window as any).testLoadCount as number) += 1;

            return new Array(200).fill(null).map((_, index) => ({ id: index, field1: `item1 ${index}`, field2: `item2 ${index}` }));
          },
          key: 'id',
        } as any, // todo check
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
        scrolling: {
          mode: 'virtual',
        },
      }));

      // arrange
      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      // assert
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      // act
      await dataGrid.scrollTo({ top: 500 });

      // assert
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await testScreenshot(page, 'T1089634-virtual-scrolling-1.png');

      // act
      await dataGrid.apiEditCell(5, 1);
      await dataGrid.apiCellValue(5, 1, 'test');

      // act - simulate click on button
      await dataGrid.hide();
      await page.locator('body').click();

      await testScreenshot(page, 'T1089634-virtual-scrolling-2.png');

      // act
      await dataGrid.show();

      await testScreenshot(page, 'T1089634-virtual-scrolling-3.png');

      // assert
      await expect.poll(() => getTestLoadCount(page)).toBe(1);
    });
  });

  test('New virtual mode. Virtual rows should not be rendered after the height is decreased and restored (T1336247)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 2),
      height: 600,
      scrolling: {
        mode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const initialViewportSize = await getViewportSize(page);

    await dataGrid.option('height', 150);
    await expect.poll(() => getViewportSize(page)).toBeLessThan(initialViewportSize);

    await dataGrid.option('height', 600);
    await expect.poll(() => getViewportSize(page)).toBe(initialViewportSize);

    const visibleRows = await dataGrid.apiGetVisibleRows();

    expect(visibleRows.length).toBe(10);
    await expect(dataGrid.getRowsView().locator(`.${VIRTUAL_ROW_CLASS}`)).toHaveCount(0);
  });

  test('New virtual mode. Virtual rows should not be rendered after the container height is decreased and restored (T1336247)', async ({ page }) => {
    const setContainerHeight = (height: number): Promise<void> => page.evaluate(
      ({ selector, value }) => { $(selector).css('height', value); },
      { selector: DEFAULT_SELECTOR, value: height },
    );

    await setContainerHeight(600);

    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 2),
      scrolling: {
        mode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await setContainerHeight(150);
    await dataGrid.apiUpdateDimensions();
    await setContainerHeight(600);
    await dataGrid.apiUpdateDimensions();

    await expect(dataGrid.getRowsView().locator(`.${VIRTUAL_ROW_CLASS}`)).toHaveCount(0);
  });

  test('New virtual mode. Virtual rows should not be rendered after a row is selected while the height is decreased (T1336247)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 2),
      height: 600,
      selection: {
        mode: 'single',
      },
      scrolling: {
        mode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const initialViewportSize = await getViewportSize(page);

    await dataGrid.option('height', 150);
    await expect.poll(() => getViewportSize(page)).toBeLessThan(initialViewportSize);

    await dataGrid.getDataRow(0).element.click();
    await dataGrid.getDataRow(0).expectSelected();

    await dataGrid.option('height', 600);
    await expect.poll(() => getViewportSize(page)).toBe(initialViewportSize);

    await expect(dataGrid.getRowsView().locator(`.${VIRTUAL_ROW_CLASS}`)).toHaveCount(0);
  });

  test('New virtual mode. Virtual rows should not be rendered after a row is focused while the height is decreased (T1336247)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 2).map((item, index) => ({ ...item, id: index })),
      keyExpr: 'id',
      height: 600,
      focusedRowEnabled: true,
      scrolling: {
        mode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const initialViewportSize = await getViewportSize(page);

    await dataGrid.option('height', 150);
    await expect.poll(() => getViewportSize(page)).toBeLessThan(initialViewportSize);

    await dataGrid.getDataRow(0).element.click();
    await dataGrid.getDataRow(0).expectFocusedRow();

    await dataGrid.option('height', 600);
    await expect.poll(() => getViewportSize(page)).toBe(initialViewportSize);

    await expect(dataGrid.getRowsView().locator(`.${VIRTUAL_ROW_CLASS}`)).toHaveCount(0);
  });
});

test.describe('Remote Scrolling', () => {
  test('Scroll to the bottom after expand several group', async ({ page }) => {
    await mockApi(page, salesApiMock);
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
        width: 120,
      }, {
        caption: 'Product',
        dataField: 'ProductName',
      }],
      loadingTimeout: 0,
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    const scrollToBottom = async (): Promise<void> => {
      await dataGrid.scrollTo({ top: 100000 });
      await expect.poll(() => dataGrid.isReady()).toBe(true);
    };

    // act
    await expect.poll(() => dataGrid.hasScrollable()).toBe(true);
    await scrollToBottom();
    await dataGrid.apiExpandRow(['Contoso York Store']);
    await dataGrid.apiExpandRow(['Contoso York Store', 'Audio']);
    await scrollToBottom();
    await dataGrid.scrollBy({ top: -1 });
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // assert
    const visibleRows = await dataGrid.apiGetVisibleRows();

    if (!visibleRows.length) {
      expect(visibleRows[0].key).toBeGreaterThanOrEqual(897075);
      expect(visibleRows[0].key).toBeLessThanOrEqual(932043);
    }
  });

  test('New virtual mode. Virtual rows should not be in view port after scrolling large data (T1043156)', async ({ page }) => {
    await page.evaluate(() => {
      const getItems = (): Record<string, unknown>[] => {
        const items: Record<string, unknown>[] = [];
        for (let i = 0; i < 1000000; i += 1) {
          items.push({
            ID: i + 1,
            Name: `Name ${i + 1}`,
          });
        }
        return items;
      };

      (window as any).myStore = new (window as any).DevExpress.data.ArrayStore({
        key: 'ID',
        data: getItems(),
      });
    });

    await createWidget(page, 'dxDataGrid', (): Properties => ({
      dataSource: {
        key: 'ID',
        load(loadOptions) {
          return new Promise((resolve) => {
            // The data comes later, like the answer of a server.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              (window as any).myStore.load(loadOptions).done((data) => {
                resolve(data);
              });
            }, 300);
          });
        },
        totalCount(loadOptions) {
          return (window as any).myStore.totalCount(loadOptions);
        },
      } as any, // todo check
      height: 500,
      remoteOperations: true,
      scrolling: {
        mode: 'virtual',
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const scrollbarVerticalThumbTrack = dataGrid.getScrollBarThumbTrack('vertical');

    // assert
    await expect(scrollbarVerticalThumbTrack).toBeAttached();

    // act
    await scrollbarVerticalThumbTrack.hover();
    await dragToOffset(page, scrollbarVerticalThumbTrack, 0, 400);

    // The rows of the new position load a moment later: the check waits for them.
    // assert
    await expect.poll(() => dataGrid.isVirtualRowIntersectViewport()).toBe(false);

    // act
    await scrollbarVerticalThumbTrack.hover();
    await dragToOffset(page, scrollbarVerticalThumbTrack, 0, -200);

    // assert
    await expect.poll(() => dataGrid.isVirtualRowIntersectViewport()).toBe(false);
  });

  test.describe(() => {
    test.use({ theme: 'generic.light' });

    test('New virtual mode. Navigation to the last row if new row is added (T1069849)', async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        height: 150,
        keyExpr: 'id',
        dataSource: [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
        ],
        editing: {
          mode: 'batch',
          allowAdding: true,
        },
        columns: ['id'],
        scrolling: {
          mode: 'virtual',
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();

      await addRowButton.click();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const lastCell = dataGrid.getDataCell(3, 0);

      // assert
      await expect(lastCell.element).toHaveText('4');

      await lastCell.expectFocusVisible();
    });

    [false, true].forEach((useNative) => {
      test(`New virtual mode. Virtual rows should not be in view port after switching to the last page with row numbers less than page size (useNative = ${useNative}) (T1085775)`, async ({ page }) => {
        await page.evaluate(() => {
          const getItems = (): Record<string, unknown>[] => {
            const items: Record<string, unknown>[] = [];
            for (let i = 0; i < 65; i += 1) {
              items.push({
                ID: i + 1,
                Name: `Name ${i + 1}`,
              });
            }
            return items;
          };

          (window as any).myStore = new (window as any).DevExpress.data.ArrayStore({
            key: 'ID',
            data: getItems(),
          });
        });

        await createWidget(page, 'dxDataGrid', (native): Properties => ({
          dataSource: {
            key: 'ID',
            load(loadOptions) {
              return new Promise((resolve) => {
                // The data comes later, like the answer of a server.
                // eslint-disable-next-line no-restricted-syntax
                setTimeout(() => {
                  (window as any).myStore.load(loadOptions).done((data) => {
                    resolve(data);
                  });
                }, 500);
              });
            },
            totalCount(loadOptions) {
              return new Promise((resolve) => {
                // eslint-disable-next-line no-restricted-syntax
                setTimeout(() => {
                  (window as any).myStore.totalCount(loadOptions).done((count) => {
                    resolve(count);
                  });
                }, 500);
              });
            },
          } as any, // todo check
          height: 500,
          remoteOperations: true,
          scrolling: {
            mode: 'virtual',
            useNative: native,
          },
          pager: {
            visible: true,
          },
        }), DEFAULT_SELECTOR, { arg: useNative });

        const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
        // The last page loads a moment later, in parts: the state holds the checks made below.
        const getLastPageState = async (): Promise<[boolean, boolean, unknown]> => {
          const rows = await dataGrid.apiGetVisibleRows();

          return [rows.length >= 12, (rows[0]?.key as number) <= 54, rows[rows.length - 1]?.key];
        };

        // assert
        await expect.poll(() => dataGrid.isVirtualRowIntersectViewport()).toBe(false);

        for (let i = 0; i < 3; i += 1) {
          // act
          await dataGrid.getPager().getNavPage('4').click();
          await expect.poll(getLastPageState).toEqual([true, true, 65]);

          const visibleRows = await dataGrid.apiGetVisibleRows();

          // assert
          await expect.poll(() => dataGrid.isVirtualRowIntersectViewport()).toBe(false);
          await expectClass(dataGrid.getPager().getNavPage('3'), 'dx-selection');
          expect(visibleRows.length >= 12).toBe(true);
          expect((visibleRows[0].key as number) <= 54).toBe(true);
          expect(visibleRows[visibleRows.length - 1].key).toBe(65);
        }
      });
    });
  });

  // T1284002
  test('Last group should not disappear after collapsing another subgroup with virtual scrolling, local grouping and remote operations (T1284002)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 500,
      dataSource: [
        {
          Id: 1, Category: 'Cell phones', Subcategory: 'Touch Screen Phones', Store: 'Europe Online Store', Date: '2024-01-10',
        },
        {
          Id: 2, Category: 'Cell phones', Subcategory: 'Touch Screen Phones', Store: 'Europe Online Store', Date: '2024-02-15',
        },
        {
          Id: 3, Category: 'Computers', Subcategory: 'Computers Accessories', Store: 'North America Reseller', Date: '2024-03-20',
        },
        {
          Id: 4, Category: 'Computers', Subcategory: 'Computers Accessories', Store: 'North America Online Store', Date: '2024-04-25',
        },
      ],
      keyExpr: 'Id',
      remoteOperations: {
        filtering: true,
        sorting: true,
        paging: true,
      },
      scrolling: {
        mode: 'virtual',
      },
      grouping: {
        autoExpandAll: true,
      },
      columns: [
        { dataField: 'Id', dataType: 'number' },
        { dataField: 'Category', dataType: 'string', groupIndex: 0 },
        { dataField: 'Subcategory', dataType: 'string', groupIndex: 1 },
        { dataField: 'Store', dataType: 'string', groupIndex: 2 },
        { dataField: 'Date', dataType: 'date', format: 'yyyy-MM-dd' },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiCollapseRow(['Cell phones', 'Touch Screen Phones']);

    const getDataRowCount = async (): Promise<number> => {
      const visibleRows = await dataGrid.apiGetVisibleRows();

      return visibleRows.filter((r) => r.rowType === 'data').length;
    };

    await expect.poll(getDataRowCount, { message: 'Computers category should still show 2 data rows' }).toBe(2);
  });

  // T1152498
  (['infinite', 'virtual'] as const).forEach((scrollingMode) => {
    test(`${scrollingMode} scrolling - the markup should be correct for continuous scrolling when there is a fixed column with cellTemplate (React)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (mode): Properties => ({
        dataSource: [...new Array(500)].map((_, index) => ({ id: index, text: `item ${index}` })),
        keyExpr: 'id',
        height: 440,
        width: 800,
        renderAsync: false,
        templatesRenderAsynchronously: true,
        columnFixing: {
          // @ts-expect-error private option
          legacyMode: true,
        },
        customizeColumns(columns) {
          /* eslint-disable no-param-reassign */
          columns[0].width = 70;
          columns[0].fixed = true;
          columns[0].cellTemplate = '#test';
          /* eslint-enable no-param-reassign */
        },
        scrolling: {
          mode,
        },
      }), DEFAULT_SELECTOR, { arg: scrollingMode });

      // arrange
      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      // simulating async rendering in React
      await page.evaluate((gridSelector) => {
        const dataGridInstance = ($(gridSelector) as any).dxDataGrid('instance');

        // eslint-disable-next-line no-underscore-dangle
        dataGridInstance.getView('rowsView')._templatesCache = {};

        // eslint-disable-next-line no-underscore-dangle
        dataGridInstance._getTemplate = () => ({
          render(options) {
            // The template renders after the grid, like an asynchronous template of a framework.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              ($(options.container) as any).append(($('<div/>') as any).text(options.model.value));
              options.deferred?.resolve();
            }, 1000);
          },
        });

        dataGridInstance.repaint();
      }, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      // act
      await dataGrid.scrollTo({ top: 200 });
      await dataGrid.scrollTo({ top: 600 });
      await expect.poll(() => dataGrid.isReady()).toBe(true);
      await expect.poll(() => dataGrid.isVirtualRowIntersectViewport()).toBe(false);
      await expect(dataGrid.getFixedDataCell(12, 0).element).toHaveText('12');
      await expect(dataGrid.getFixedDataCell(19, 0).element).toHaveText('19');

      // assert
      await testScreenshot(page, `grid-${scrollingMode}-scrolling-T1152498.png`, { element: DEFAULT_SELECTOR });
    });
  });

  test('Editors should keep changes after being scrolled out of sight (T1145698)', async ({ page }) => {
    const getItems = (): Record<string, unknown>[] => {
      const items: Record<string, unknown>[] = [];
      for (let i = 0; i < 65; i += 1) {
        items.push({
          ID: i + 1,
          Name: `Name ${i + 1}`,
        });
      }
      return items;
    };

    await createWidget(page, 'dxDataGrid', {
      dataSource: getItems(),
      keyExpr: 'ID',
      columns: [{
        dataField: 'Name',
        showEditorAlways: true,
      }],
      scrolling: {
        mode: 'virtual',
      },
      height: 300,
      editing: {
        mode: 'batch',
        allowUpdating: true,
        allowAdding: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // act
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await dataGrid.getDataCell(0, 0).element.click();
    await page.keyboard.press('Control+a');
    // TestCafe typed into the focused editor of the cell, over the text "Ctrl+A" selected.
    await page.keyboard.type('test');
    await dataGrid.getDataCell(1, 0).element.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.type('test');
    await page.keyboard.press('Enter');

    await dataGrid.scrollTo({ top: 500 });
    await dataGrid.scrollTo({ top: 0 });

    // assert
    await expect.poll(() => dataGrid.apiGetCellValue(0, 0)).toBe('test');
    await expect.poll(() => dataGrid.apiGetCellValue(1, 0)).toBe('test');
  });

  test.describe(() => {
    test.use({ browserSize: [800, 200] });

    // T1136896
    test('Editing buttons should rerender correctly after scrolling if repaintChangesOnly=true', async ({ page }) => {
      const data = [...new Array(14)].map((_, i) => ({
        id: i + 1,
      }));

      await createWidget(page, 'dxDataGrid', {
        height: 200,
        // @ts-expect-error private option
        loadingTimeout: null,
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

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await dataGrid.scrollBy({ top: 1000 });

      await dataGrid.apiEditRow(3); // row with id=12

      await dataGrid.scrollBy({ top: -1000 });
      await dataGrid.scrollBy({ top: 1000 });

      await dataGrid.scrollBy({ top: -1 });

      await testScreenshot(page, 'T1136896-virtual-scrolling_editing-buttons.png', { element: DEFAULT_SELECTOR });
    });
  });

  // T1181439
  test('Restoring focus on re-rendering should be done without unexpected scrolling to the focused element', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data): Properties => ({
      dataSource: data,
      scrolling: {
        mode: 'virtual',
        useNative: true,
      },
      height: 440,
      width: 600,
      columns: [...new Array(20)].map(() => ({
        dataField: 'id',
        width: 75,
      })),
      masterDetail: { enabled: true },
      onContentReady: () => {
        (window as any).contentReadyFired = true;
      },
    }), DEFAULT_SELECTOR, {
      arg: [...new Array(30)].map((_, i) => ({
        id: i + 1,
      })),
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const resetContentReadyFlag = (): Promise<void> => page.evaluate(() => {
      (window as any).contentReadyFired = false;
    });
    const isContentReadyFired = (): Promise<boolean> => page.evaluate(
      () => (window as any).contentReadyFired,
    );

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollBy({ left: 1000 });

    await resetContentReadyFlag();
    await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(19).element.click();
    await expect.poll(isContentReadyFired).toBe(true);

    await dataGrid.scrollBy({ left: -1000 });

    await resetContentReadyFlag();
    await dataGrid.scrollBy({ top: 50 });
    await expect.poll(isContentReadyFired).toBe(true);

    await expect.poll(() => dataGrid.getScrollLeft()).toBe(0);
  });

  // T1194796
  test('The row alternation should display correctly when grouping and virtual scrolling are enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: new Array(20).fill(null).map((_, index) => ({
        groupField: index < 2 ? index : 2,
        field: `test${index}`,
      })),
      height: 400,
      paging: {
        pageSize: 5,
      },
      columns: [{ dataField: 'groupField', groupIndex: 0 }, 'field'],
      rowAlternationEnabled: true,
      grouping: { autoExpandAll: true },
      scrolling: { mode: 'virtual', useNative: false },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect.poll(() => dataGrid.hasScrollable()).toBe(true);

    // act
    await dataGrid.scrollTo({ top: 100 });
    await dataGrid.scrollTo({ top: 200 });
    await dataGrid.scrollTo({ top: 300 });
    await dataGrid.scrollTo({ top: 400 });

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'T1194796-row-alternation-with-grouping-and-virtual-scrolling.png', { element: DEFAULT_SELECTOR });
  });

  test('DataGrid - Gray boxes appear when the push method is used to remove rows in infinite scrolling mode (T1240079)', async ({ page }) => {
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
        scrolling: {
          mode: 'infinite',
        },
        height: 300,
      };
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const data = [
      { id: 1, text: 'text 1' },
      { id: 2, text: 'text 2' },
    ];
    const changes = data.map((item) => ({
      type: 'remove',
      key: item.id,
    }));

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiPush(changes);
    // The data source applies pushed changes a moment later, all at once.
    await expect.poll(async () => (await dataGrid.apiGetVisibleRows()).length).toBe(0);
    await testScreenshot(page, 'T1240079.png', { element: dataGrid.element });
  });

  // T1262288 - Left to Right
  test('DataGrid - Focused cell moves to the end of the table after horizontal scrolling', async ({ page }) => {
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
      paging: {
        enabled: false,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getDataCell(0, 0).element.click();
    await page.keyboard.press('ArrowLeft');

    await dataGrid.getDataCell(0, 0).expectFocusVisible();

    await dataGrid.scrollBy({ left: 1000 });
    await dataGrid.scrollBy({ left: -1000 });

    await dataGrid.getDataCell(0, 0).expectFocusVisible();
  });

  // T1277214 - Right to Left
  test('DataGrid - Scrolling position is reset to far right on an attempt to scroll left if the most right cell is focused using the keyboard', async ({ page }) => {
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
      paging: {
        enabled: false,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await dataGrid.scrollTo({ left: 1000 });
    await dataGrid.getDataCell(0, 20).element.click();
    await page.keyboard.press('ArrowRight');

    await dataGrid.getDataCell(0, 20).expectFocusVisible();

    await dataGrid.scrollBy({ left: -1000 });
    await dataGrid.scrollBy({ left: 1000 });

    await dataGrid.getDataCell(0, 20).expectFocusVisible();
  });

  // T1280020
  test('DataGrid - The "row" parameter in the FocusedRowChanged event refers to a non-focused row if the grid height is small', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => ({
      height: 70,
      dataSource: [
        { id: '0' },
        { id: '1' },
        { id: '2' },
      ],
      scrolling: { mode: 'virtual' },
      keyExpr: 'id',
      focusedRowEnabled: true,
      onFocusedRowChanged(e) {
        const data = e.row?.data;
        $('#otherContainer').text(data.id);
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const otherContainer = page.locator('#otherContainer');

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiOption('focusedRowKey', '2');
    await expect(otherContainer).toHaveText('2', { useInnerText: true });

    await dataGrid.apiOption('focusedRowKey', '0');
    await expect(otherContainer).toHaveText('0', { useInnerText: true });
  });

  [true, false].forEach((nativeScroll) => {
    test(`Should not scroll back on top with virtual scrolling and adaptive master detail (nativeScroll: ${nativeScroll}) [T1278804]`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', ({ data, native }): Properties => ({
        dataSource: data,
        keyExpr: 'id',
        columnHidingEnabled: true,
        focusedRowEnabled: true,
        scrolling: {
          mode: 'virtual',
          useNative: native,
        },
        onContentReady: ({ component }) => {
          const testWindow = window as any;

          component.getScrollable().on('scroll', ({ scrollOffset: { top } }) => {
            if (!Array.isArray(testWindow.dataGridScrollableEventValues)) {
              testWindow.dataGridScrollableEventValues = [];
            }

            testWindow.dataGridScrollableEventValues.push(top);
          });
        },
        width: 400,
        height: 400,
      }), DEFAULT_SELECTOR, {
        arg: {
          data: getData(3, 100).map((item, idx) => ({ ...item, id: idx })),
          native: nativeScroll,
        },
      });

      // NOTE: idx + 1 logic inside POM
      const adaptiveCellIdx = 101;
      const scrollValuesThreshold = 100;

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const firstRow = dataGrid.getDataRow(0);
      const firstDataCell = firstRow.getDataCell(0);
      const adaptiveCell = firstRow.getCommandCell(adaptiveCellIdx);

      await firstDataCell.element.click();
      await adaptiveCell.element.click();

      // The grid handles each scroll with the next frame and renders the rows of the new position.
      await dataGrid.scrollTo({ top: 2000 });
      await waitForScrollRender(dataGrid);
      await waitForScrollHandled(page);
      await dataGrid.scrollTo({ top: 1000 });
      await waitForScrollRender(dataGrid);
      await waitForScrollHandled(page);

      const scrollOffsets = await page.evaluate(
        () => (window as any).dataGridScrollableEventValues as number[],
      );

      const hasSmallScrollValues = scrollOffsets.some((offset) => offset < scrollValuesThreshold);
      expect(hasSmallScrollValues).toBe(false);
    });
  });

  // T1270354
  [
    { useNative: true },
    { useNative: false },
  ].forEach(({ useNative }) => {
    test(`Virtual ${useNative ? 'native' : 'simulated'} scrolling - Scrolling to the bottom should work correctly when there is a grouping and a summary`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [...new Array(50)]
          .fill(null)
          .map((_, index) => ({
            id: index,
            machine: index,
            totalTime: 1,
          })),
        keyExpr: 'id',
        showBorders: true,
        height: 400,
        width: '100%',
        columns: [
          {
            dataField: 'machine',
            groupIndex: 0,
          }, {
            dataField: 'totalTime',
          },
        ],
        scrolling: {
          mode: 'virtual',
          useNative,
        },
        grouping: {
          autoExpandAll: false,
        },
        summary: {
          totalItems: [
            {
              column: 'totalTime',
              summaryType: 'sum',
            },
          ],
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.scrollBy({ top: 10000 });

      await testScreenshot(page, `T1270354-virtual-${useNative ? 'native' : 'simulated'}-scrolling-with-grouping-and-summary.png`, { element: DEFAULT_SELECTOR });
    });
  });

  test('Remote virtual scrolling should send one request on init when starting on a non-first page with async templates (T1326786)', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).testLoadOptions = [];
    });

    await createWidget(page, 'dxDataGrid', () => ({
      height: 1000,
      remoteOperations: true,
      renderAsync: false,
      templatesRenderAsynchronously: true,
      dataSource: new (window as any).DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions: any) {
          (window as any).testLoadOptions.push({
            skip: loadOptions.skip,
            take: loadOptions.take,
          });

          const skip = loadOptions.skip ?? 0;
          const take = loadOptions.take ?? 20;
          const data: Record<string, unknown>[] = [];

          for (let i = skip; i < skip + take; i += 1) {
            data.push({ id: i, text: `item ${i}` });
          }

          return Promise.resolve({ data, totalCount: 5000 });
        },
      }),
      scrolling: {
        mode: 'virtual',
        useNative: false,
      },
      paging: {
        pageSize: 100,
        pageIndex: 10,
      },
      columns: [
        { dataField: 'id', cellTemplate: 'cell' },
        'text',
      ],
      integrationOptions: {
        templates: {
          cell: {
            render(e: any) {
              // The template renders after the grid, like an asynchronous template of a framework.
              // eslint-disable-next-line no-restricted-syntax
              setTimeout(() => {
                ($(e.container) as any).text(e.model.value);
                e.onRendered?.();
              });
            },
          },
        },
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect.poll(() => dataGrid.getScrollTop()).toBeGreaterThan(0);
    await expect.poll(() => dataGrid.apiPageIndex()).toBe(10);

    await expect.poll(() => getTestLoadOptions(page)).toEqual([{ skip: 1000, take: 100 }]);
  });
});

test.describe('Scrolling - warnings', () => {
  test('Warning should be thrown if scrolling is virtual and height is not specified', async ({ page }) => {
    const warnings = collectWarnings(page, 'W1025');

    await createWidget(page, 'dxDataGrid', {
      scrolling: {
        mode: 'virtual',
      },
      dataSource: [
        { column: 'value' },
      ],
    });

    await expect.poll(() => warnings.length).toBeGreaterThan(0);
  });

  test('Warning should not be thrown if scrolling is virtual and height is specified with option', async ({ page }) => {
    const warnings = collectWarnings(page, 'W1025');

    await createWidget(page, 'dxDataGrid', {
      scrolling: {
        mode: 'virtual',
      },
      dataSource: [
        { column: 'value' },
      ],
      height: 200,
    });

    expect(warnings).toHaveLength(0);
  });

  ['height', 'max-height'].forEach((cssOption) => {
    test(`Warning should not be thrown if scrolling is virtual and height is specified with css (${cssOption})`, async ({ page }) => {
      const warnings = collectWarnings(page, 'W1025');

      await insertStylesheetRulesToPage(page, `
        ${DEFAULT_SELECTOR} {
          ${cssOption}: 200px;
        }
      `);

      await createWidget(page, 'dxDataGrid', {
        scrolling: {
          mode: 'virtual',
        },
        dataSource: [
          { column: 'value' },
        ],
      });

      expect(warnings).toHaveLength(0);
    });
  });

  // T1326460
  test('Horizontal scrollbar should not appear when columnHidingEnabled is true and vertical scrollbar is present (T1326460)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 552,
      height: 300,
      dataSource: getData(20, 10),
      columnHidingEnabled: true,
      columnWidth: 100,
      scrolling: {
        useNative: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const scrollContainerWidth = await dataGrid.getScrollContainer()
      .evaluate((element) => element.clientWidth);
    const rowsWidth = await dataGrid.getRows().nth(0).evaluate((element) => element.clientWidth);

    expect(rowsWidth).toBe(scrollContainerWidth);
  });

  test('navigateToRow should scroll to the correct row with virtual scrolling (T1220800)', async ({ page }) => {
    await page.evaluate(() => {
      const getItems = (): Record<string, unknown>[] => {
        const items: Record<string, unknown>[] = [];
        for (let i = 0; i < 1000000; i += 1) {
          items.push({
            ID: i + 1,
            Name: `Name ${i + 1}`,
            Description: `Text text text text text text text text text text ${i + 1}`,
          });
        }
        return items;
      };

      (window as any).myStore = new (window as any).DevExpress.data.ArrayStore({
        key: 'ID',
        data: getItems(),
      });
    });

    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: new (window as any).DevExpress.data.CustomStore({
        key: 'ID',
        loadMode: 'raw',
        load(loadOptions) {
          return new Promise((resolve) => {
            (window as any).myStore.load(loadOptions).done((data) => {
              resolve(data);
            });
          });
        },
        totalCount() {
          return (window as any).myStore.totalCount();
        },
      }),
      width: 900,
      height: 250,
      wordWrapEnabled: true,
      showBorders: true,
      scrolling: {
        mode: 'virtual',
        rowRenderingMode: 'virtual',
        useNative: false,
      },
      paging: {
        pageSize: 20,
      },
      columns: [
        {
          dataField: 'ID',
          width: 90,
        },
        'Name',
        'Description',
      ],
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const targetKey = 901;

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataGrid.apiNavigateToRow(targetKey);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect(dataGrid.getDataCells(0).nth(0)).toHaveText(String(targetKey));

    const visibleRows = await dataGrid.apiGetVisibleRows();

    expect(visibleRows[0].key, `Row with key ${targetKey} should be the first visible row after navigation`).toBe(targetKey);
  });
});
