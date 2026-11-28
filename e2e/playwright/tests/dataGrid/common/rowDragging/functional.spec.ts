import type { Page } from '@playwright/test';
import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import {
  dragToElement, dragToOffset, finishDrag, startDragToOffset,
} from '../../../../helpers/dragUtils';
import DataGrid from '../../../../models/dataGrid';
import { getOffsetToTriggerAutoScroll, isScrollAtEnd } from '../../helpers/rowDraggingHelpers';

const MAXIMIZED_WINDOW_SIZE = { width: 1920, height: 1080 };

interface Offset { left: number; top: number }

const isPlaceholderVisible = (page: Page): Promise<boolean> => page.evaluate(() => $('.dx-sortable-placeholder').is(':visible'));

const getPlaceholderOffset = (page: Page): Promise<Offset | undefined> => page.evaluate(() => $('.dx-sortable-placeholder').offset());

const getRowsViewLeftOffset = (page: Page): Promise<number | undefined> => page.evaluate((selector) => $(`${selector} .dx-datagrid-rowsview`).offset()?.left, DEFAULT_SELECTOR);

const getDraggingElementLeftOffset = (page: Page): Promise<number | undefined> => page.evaluate(() => $('.dx-sortable-dragging').offset()?.left);

const getDraggingElementScrollPosition = (page: Page): Promise<Offset> => page.evaluate(() => {
  const $dataGrid = $('.dx-sortable-dragging').find('.dx-datagrid').first().parent();
  const dataGridInstance = $dataGrid.data('dxDataGrid');
  const scrollableInstance = dataGridInstance.getScrollable();

  // "+ 0" turns the -0 of a simulated scrollable into 0, which "toEqual" tells apart and "eql"
  // did not.
  return {
    left: scrollableInstance.scrollLeft() + 0,
    top: scrollableInstance.scrollTop() + 0,
  };
});

const getFreeSpaceRowOffset = (page: Page): Promise<Offset | undefined> => page.evaluate(
  (selector) => {
    const $freeSpaceRow = $(selector).find('.dx-datagrid-rowsview table .dx-freespace-row').first();

    return $freeSpaceRow?.offset();
  },
  DEFAULT_SELECTOR,
);

const scrollTo = (page: Page, x: number, y: number): Promise<void> => page.evaluate(
  ({ left, top }) => { window.scrollTo(left, top); },
  { left: x, top: y },
);

const getFixedContentPointerEvents = (page: Page): Promise<string[]> => page.evaluate(() => [
  $('.dx-datagrid-rowsview .dx-datagrid-content-fixed:eq(0)').css('pointer-events'),
  $('.dx-datagrid-rowsview .dx-datagrid-content-fixed:eq(1)').css('pointer-events'),
]);

const generateData = (rowCount: number, columnCount: number): Record<string, unknown>[] => {
  const items: Record<string, unknown>[] = [];

  for (let i = 0; i < rowCount; i += 1) {
    const item = {};

    for (let j = 0; j < columnCount; j += 1) {
      item[`field${j + 1}`] = `${i + 1}-${j + 1}`;
    }

    items.push(item);
  }

  return items;
};

test.describe('Row dragging.Functional', () => {
  // T903351
  test('The placeholder should appear when a cross-component dragging rows after scrolling the window', async ({ page }) => {
    await page.setViewportSize(MAXIMIZED_WINDOW_SIZE);
    await page.evaluate((selector) => {
      $('body').css('display', 'flex');
      $(`${selector}, #otherContainer`).css({
        display: 'inline-block',
        'margin-top': '800px',
        width: '50%',
      });
    }, DEFAULT_SELECTOR);

    await createWidget(page, 'dxDataGrid', {
      width: 400,
      dataSource: [
        {
          id: 1, name: 'Name 1', age: 19,
        },
        {
          id: 2, name: 'Name 2', age: 11,
        },
        {
          id: 3, name: 'Name 3', age: 15,
        },
        {
          id: 4, name: 'Name 4', age: 16,
        },
        {
          id: 5, name: 'Name 5', age: 25,
        },
        {
          id: 6, name: 'Name 6', age: 18,
        },
        {
          id: 7, name: 'Name 7', age: 21,
        },
        {
          id: 8, name: 'Name 8', age: 14,
        },
      ],
      columns: ['name', 'age'],
      rowDragging: {
        group: 'shared',
      },
    });
    await createWidget(page, 'dxTreeList', {
      columnAutoWidth: true,
      dataSource: [
        {
          id: 1, parentId: 0, name: 'Name 1', age: 19,
        },
        {
          id: 2, parentId: 1, name: 'Name 2', age: 11,
        },
        {
          id: 3, parentId: 0, name: 'Name 3', age: 15,
        },
        {
          id: 4, parentId: 3, name: 'Name 4', age: 16,
        },
        {
          id: 5, parentId: 0, name: 'Name 5', age: 25,
        },
        {
          id: 6, parentId: 5, name: 'Name 6', age: 18,
        },
        {
          id: 7, parentId: 0, name: 'Name 7', age: 21,
        },
        {
          id: 8, parentId: 7, name: 'Name 8', age: 14,
        },
      ],
      autoExpandAll: true,
      columns: ['name', 'age'],
      rowDragging: {
        group: 'shared',
      },
    }, '#otherContainer');

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await scrollTo(page, 0, 10000);
    await dataGrid.moveRow(6, 500, 0, true);
    await dataGrid.moveRow(6, 550, 0);

    await expect.poll(() => isPlaceholderVisible(page)).toBe(true);
  });

  test('The cross-component drag and drop rows should work when there are fixed columns', async ({ page }) => {
    await page.setViewportSize(MAXIMIZED_WINDOW_SIZE);
    await page.evaluate((selector) => {
      $('body').css('display', 'flex');
      $(`${selector}, #otherContainer`).css({
        display: 'inline-block',
        width: '50%',
      });
    }, DEFAULT_SELECTOR);

    await createWidget(page, 'dxDataGrid', {
      width: 400,
      dataSource: [
        {
          id: 1, name: 'Name 1', age: 19,
        },
        {
          id: 2, name: 'Name 2', age: 11,
        },
        {
          id: 3, name: 'Name 3', age: 15,
        },
        {
          id: 4, name: 'Name 4', age: 16,
        },
        {
          id: 5, name: 'Name 5', age: 25,
        },
        {
          id: 6, name: 'Name 6', age: 18,
        },
        {
          id: 7, name: 'Name 7', age: 21,
        },
        {
          id: 8, name: 'Name 8', age: 14,
        },
      ],
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      columns: [{ dataField: 'id', fixed: true }, 'name', 'age'],
      rowDragging: {
        group: 'shared',
      },
    });
    await createWidget(page, 'dxDataGrid', {
      width: 400,
      dataSource: [
        {
          id: 1, name: 'Name 1', age: 19,
        },
        {
          id: 2, name: 'Name 2', age: 11,
        },
        {
          id: 3, name: 'Name 3', age: 15,
        },
        {
          id: 4, name: 'Name 4', age: 16,
        },
        {
          id: 5, name: 'Name 5', age: 25,
        },
        {
          id: 6, name: 'Name 6', age: 18,
        },
        {
          id: 7, name: 'Name 7', age: 21,
        },
        {
          id: 8, name: 'Name 8', age: 14,
        },
      ],
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      columns: [{ dataField: 'id', fixed: true }, 'name', 'age'],
      rowDragging: {
        group: 'shared',
      },
    }, '#otherContainer');

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.moveRow(0, 500, 0, true);
    await dataGrid.moveRow(0, 550, 0);

    await expect.poll(() => isPlaceholderVisible(page)).toBe(true);

    const otherDataGrid = new DataGrid(page, '#otherContainer');
    const dataRow = otherDataGrid.getDataRow(0);
    const dataRowOffset = await dataRow.getOffset();

    await expect(dataRow.element).toBeAttached();
    await expect.poll(() => getPlaceholderOffset(page)).toEqual(dataRowOffset);
  });

  test('The cross-component drag and drop rows should not block rows', async ({ page }) => {
    await page.setViewportSize(MAXIMIZED_WINDOW_SIZE);
    await page.evaluate((selector) => {
      $('body').css('display', 'flex');
      $(`${selector}, #otherContainer`).css({
        display: 'inline-block',
        width: '50%',
      });
    }, DEFAULT_SELECTOR);

    await createWidget(page, 'dxDataGrid', {
      width: 400,
      dataSource: [
        {
          id: 1, name: 'Name 1', age: 19,
        },
        {
          id: 2, name: 'Name 2', age: 11,
        },
        {
          id: 3, name: 'Name 3', age: 15,
        },
        {
          id: 4, name: 'Name 4', age: 16,
        },
        {
          id: 5, name: 'Name 5', age: 25,
        },
        {
          id: 6, name: 'Name 6', age: 18,
        },
        {
          id: 7, name: 'Name 7', age: 21,
        },
        {
          id: 8, name: 'Name 8', age: 14,
        },
      ],
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      columns: [{ dataField: 'id', fixed: true }, 'name', 'age'],
      rowDragging: {
        group: 'shared',
      },
    });
    await createWidget(page, 'dxDataGrid', {
      width: 400,
      dataSource: [
        {
          id: 1, name: 'Name 1', age: 19,
        },
        {
          id: 2, name: 'Name 2', age: 11,
        },
        {
          id: 3, name: 'Name 3', age: 15,
        },
        {
          id: 4, name: 'Name 4', age: 16,
        },
        {
          id: 5, name: 'Name 5', age: 25,
        },
        {
          id: 6, name: 'Name 6', age: 18,
        },
        {
          id: 7, name: 'Name 7', age: 21,
        },
        {
          id: 8, name: 'Name 8', age: 15,
        },
      ],
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      columns: [{ dataField: 'id', fixed: true }, 'name', 'age'],
      rowDragging: {
        group: 'shared',
      },
    }, '#otherContainer');

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const otherDataGrid = new DataGrid(page, '#otherContainer');
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect.poll(() => otherDataGrid.isReady()).toBe(true);

    // The drag column is fixed: its icon is in the row of the fixed table only.
    await dragToOffset(page, dataGrid.getFixedDataRow(2).element.locator('.dx-datagrid-drag-icon'), 500, 0);

    // T1013088
    await expect.poll(() => getFixedContentPointerEvents(page)).toEqual(['none', 'none']);
  });

  test('Virtual rendering during auto scrolling should not cause errors in onDragChange', async ({ page }) => {
    await page.setViewportSize(MAXIMIZED_WINDOW_SIZE);

    await createWidget(page, 'dxDataGrid', (): Properties => ({
      height: 200,
      keyExpr: 'id',
      scrolling: {
        mode: 'virtual',
      },
      dataSource: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
      ],
      columns: ['id'],
      rowDragging: {
        allowReordering: true,
        scrollSpeed: 300,
        onDragChange(e) {
          const visibleRows = e.component.getVisibleRows();
          const row = visibleRows[e.toIndex];
          if (!row) {
            throw new Error('row is null');
          }
        },
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // TestCafe dragged slowly, and the grid scrolled while the pointer was at its edge. Here the
    // pointer stays there until the scrolling renders the last row.
    await startDragToOffset(page, dataGrid.getDataRow(0).getDragCommand(), 0, 100);

    const lastRow = dataGrid.getDataRow(9);

    await expect(lastRow.element).toBeAttached();
    await finishDrag(page);
  });

  // T1078513
  test('Headers should not be hidden during auto scrolling when virtual scrollling is specified', async ({ page }) => {
    await page.setViewportSize(MAXIMIZED_WINDOW_SIZE);

    await createWidget(page, 'dxDataGrid', (): Properties => ({
      height: 200,
      keyExpr: 'id',
      scrolling: {
        mode: 'virtual',
      },
      paging: {
        pageSize: 2,
      },
      dataSource: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
        { id: 11 },
        { id: 12 },
        { id: 13 },
        { id: 14 },
        { id: 15 },
      ],
      columns: ['id'],
      columnAutoWidth: true,
      rowDragging: {
        allowReordering: true,
        dropFeedbackMode: 'push',
        onDragEnd(e: any): void {
          e.cancel = new Promise<void>((resolve) => {
            // The drop ends later, like the promise of an asynchronous handler.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              resolve();
            }, 500);
          });
        },
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // TestCafe dragged slowly, and the grid scrolled while the pointer was at its edge. Here the
    // pointer stays there until the grid scrolls.
    await startDragToOffset(page, dataGrid.getDataRow(0).getDragCommand(), 0, 90);
    await expect.poll(() => dataGrid.getScrollTop()).toBeGreaterThan(0);
    await finishDrag(page);

    const headerRow = dataGrid.getHeaders().getHeaderRow(0).element;

    await expect(headerRow).toBeAttached();
    await expect(headerRow).toHaveCSS('transform', 'none');
  });

  // T1078513
  test('Footer should not be hidden during auto scrolling when virtual scrolling is specified', async ({ page }) => {
    await page.setViewportSize(MAXIMIZED_WINDOW_SIZE);

    await createWidget(page, 'dxDataGrid', (): Properties => ({
      height: 250,
      keyExpr: 'id',
      scrolling: {
        mode: 'virtual',
      },
      summary: {
        totalItems: [{
          column: 'id',
          summaryType: 'count',
        }],
      },
      paging: {
        pageSize: 2,
      },
      dataSource: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
        { id: 11 },
        { id: 12 },
        { id: 13 },
        { id: 14 },
        { id: 15 },
      ],
      columns: ['id'],
      columnAutoWidth: true,
      rowDragging: {
        allowReordering: true,
        dropFeedbackMode: 'push',
        onDragEnd(e: any): void {
          e.cancel = new Promise<void>((resolve) => {
            // The drop ends later, like the promise of an asynchronous handler.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              resolve();
            }, 500);
          });
        },
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // TestCafe dragged slowly, and the grid scrolled while the pointer was at its edge. Here the
    // pointer stays there until the grid scrolls.
    await startDragToOffset(page, dataGrid.getDataRow(0).getDragCommand(), 0, 90);
    await expect.poll(() => dataGrid.getScrollTop()).toBeGreaterThan(0);
    await finishDrag(page);

    const footerRow = dataGrid.getFooterRow();

    await expect(footerRow).toBeAttached();
    await expect(footerRow).toHaveCSS('transform', 'none');
  });

  // T1082538
  test('The draggable element should be displayed correctly after horizontal scrolling when columnRenderingMode is virtual', async ({ page }) => {
    await page.setViewportSize(MAXIMIZED_WINDOW_SIZE);

    await createWidget(page, 'dxDataGrid', {
      width: 600,
      height: 500,
      dataSource: generateData(10, 50),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
        useNative: false,
      },
      rowDragging: {
        allowReordering: true,
        showDragIcons: false,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await dataGrid.scrollTo({ left: 2500 });

    await expect.poll(() => dataGrid.getScrollLeft()).toBe(2500);

    await dataGrid.moveRow(0, 0, 25, true);
    await dataGrid.moveRow(0, 0, 50, false);

    const rowsViewLeftOffset = await getRowsViewLeftOffset(page);

    await expect.poll(() => getDraggingElementLeftOffset(page)).toBe(rowsViewLeftOffset);
    await expect.poll(() => getDraggingElementScrollPosition(page)).toEqual({
      left: 2500,
      top: 0,
    });
  });

  test('Dragging with scrolling should be prevented by e.cancel (T1179555)', async ({ page }) => {
    await page.setViewportSize(MAXIMIZED_WINDOW_SIZE);

    await createWidget(page, 'dxDataGrid', (): Properties => ({
      dataSource: [...new Array(100)].map((_, i) => ({
        value1: i,
        value2: 1000 + i,
      })),
      keyExpr: 'value1',
      height: 300,
      scrolling: {
        mode: 'virtual',
      },
      rowDragging: {
        allowDropInsideItem: true,
        allowReordering: true,
        onDragChange(e) {
          const row = e.component.getVisibleRows()[e.toIndex];
          if (row.key < 95) {
            e.cancel = true;
          }
        },
      },

    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollBy({ top: 10000 });

    await expect(dataGrid.getDataRow(99).getDataCell(1).element).toHaveText('99');
    await expect.poll(() => isScrollAtEnd(page, 'vertical')).toBe(true);

    const visibleRows = await dataGrid.apiGetVisibleRows();
    const scrollTopOffsetByTheme = await getOffsetToTriggerAutoScroll(
      page,
      visibleRows.length - 2,
      1,
    );
    const scrollTopBeforeDragging = await dataGrid.getScrollTop();

    await startDragToOffset(
      page,
      dataGrid.getDataRow(98).getDragCommand(),
      0,
      scrollTopOffsetByTheme,
    );

    // The grid scrolls while the pointer stays at its edge: the checks wait for the end. The drag
    // starts at the middle of the row, so the pointer stops short of the edge, and the way from the
    // bottom to the top takes longer than one check waits: the first one waits for half of it.
    await expect.poll(() => dataGrid.getScrollTop()).toBeLessThan(scrollTopBeforeDragging / 2);
    await expect(dataGrid.getDataRow(0).getDataCell(1).element).toHaveText('0');
    // The simulated scrollable reports -0 at the top, which toBe(0) rejects.
    await expect.poll(() => dataGrid.getScrollTop()).toBeCloseTo(0);

    await expect(page.locator('.dx-sortable-placeholder')).toBeHidden();
  });

  // T1085143
  test('The placeholder should have correct position after dragging the row to the end when there is free space in grid and dataRowTemplate is set', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => ({
      width: 400,
      height: 600,
      dataSource: [
        {
          id: 1, name: 'Name 1', age: 19,
        },
        {
          id: 2, name: 'Name 2', age: 11,
        },
      ],
      columns: ['name', 'age'],
      dataRowTemplate(_, { data }) {
        return $(`<tr><td>${data.name}</td><td>${data.age}</td></tr>`);
      },
      rowDragging: {
        allowReordering: true,
        dragTemplate() {
          return $('<div>test</div>');
        },
        showDragIcons: false,
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.moveRow(0, 0, 50, true);
    await dataGrid.moveRow(0, 0, 550);

    const freeSpaceRowOffset = await getFreeSpaceRowOffset(page);
    const placeholderOffset = await getPlaceholderOffset(page);

    const expectedPlaceholderOffset = freeSpaceRowOffset
      ? {
        ...freeSpaceRowOffset,
        top: freeSpaceRowOffset.top - 2,
      }
      : undefined;

    await expect.poll(() => isPlaceholderVisible(page)).toBe(true);

    if (expectedPlaceholderOffset && placeholderOffset) {
      expect(placeholderOffset.left).toBe(expectedPlaceholderOffset.left);
      expect(Math.abs(placeholderOffset.top - expectedPlaceholderOffset.top)).toBeLessThan(0.1);
    } else {
      expect(placeholderOffset).toEqual(expectedPlaceholderOffset);
    }
  });

  // T1126013
  test('toIndex should not be corrected when source item gets removed from DOM', async ({ page }) => {
    await page.setViewportSize(MAXIMIZED_WINDOW_SIZE);

    await createWidget(page, 'dxDataGrid', (items): Properties => ({
      height: 260,
      keyExpr: 'field1',
      scrolling: {
        mode: 'virtual',
      },
      dataSource: items,
      rowDragging: {
        scrollSpeed: 300,
        allowReordering: true,
        onReorder(e) {
          const visibleRows = e.component.getVisibleRows();
          // eslint-disable-next-line @stylistic/max-len
          const toIndex = items.findIndex((item) => item.field1 === visibleRows[e.toIndex].data.field1);
          const fromIndex = items.findIndex((item) => item.field1 === e.itemData.field1);
          items.splice(fromIndex, 1);
          items.splice(toIndex, 0, e.itemData);

          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          e.component.refresh();
        },
      },
      showBorders: true,
    }), DEFAULT_SELECTOR, { arg: generateData(50, 1) });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const AUTOSCROLL_SPEED_FACTOR = 0.5;

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act - scroll to the bottom to make the last row visible
    await dataGrid.scrollTo({ top: 3000 });

    // assert
    await expect(dataGrid.getDataRow(49).getDataCell(1).element).toHaveText('50-1');
    await expect.poll(() => isScrollAtEnd(page, 'vertical')).toBe(true);

    let visibleRows = await dataGrid.apiGetVisibleRows();
    const draggableRow = visibleRows[1];

    // Calculate offsetY to trigger upward autoscroll when dragging the row.
    // Using speedFactor 0.5 to ensure medium scrolling speed.
    const scrollOffsetForFastAutoScroll = await getOffsetToTriggerAutoScroll(
      page,
      draggableRow.rowIndex,
      AUTOSCROLL_SPEED_FACTOR,
    );

    // act - drag a row up the grid to start auto-scrolling.
    await dataGrid.moveRow(draggableRow.rowIndex, 0, 150, true);
    await dataGrid.moveRow(draggableRow.rowIndex, 0, 100);
    await dataGrid.moveRow(draggableRow.rowIndex, 0, scrollOffsetForFastAutoScroll);

    // The grid scrolls while the pointer stays at its edge: the checks wait for the end.
    // assert
    await expect(dataGrid.getDataRow(0).getDataCell(1).element).toHaveText('1-1');
    // The simulated scrollable reports -0 at the top, which toBe(0) rejects.
    await expect.poll(() => dataGrid.getScrollTop()).toBeCloseTo(0);
    // The dragging takes the rows rendered at the top a moment later, with a delayed resize.
    await expect.poll(() => dataGrid.hasResizeTimeout()).toBe(false);

    // act - drag and drop the row to the third position (after row 2-1).
    const rowHeight = await dataGrid.getDataRow(0).element
      .evaluate((element) => (element as HTMLElement).offsetHeight);

    await dataGrid.moveRow(draggableRow.rowIndex, 0, rowHeight / 2);
    await dataGrid.dropRow();

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    visibleRows = await dataGrid.apiGetVisibleRows();

    expect(visibleRows[0].key).toBe('1-1');
    expect(visibleRows[1].key).toBe('2-1');
    expect(visibleRows[2].key).toBe(draggableRow.key);
  });

  // T1139685
  test('Item should appear in a correct spot when dragging to a different page with scrolling.mode: "virtual"', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (items): Properties => ({
      height: 250,
      keyExpr: 'field1',
      scrolling: {
        mode: 'virtual',
      },
      paging: {
        pageSize: 4,
      },
      dataSource: items,
      rowDragging: {
        scrollSpeed: 300,
        allowReordering: true,
        onReorder(e) {
          const visibleRows = e.component.getVisibleRows();
          // eslint-disable-next-line @stylistic/max-len
          const toIndex = items.findIndex((item) => item.field1 === visibleRows[e.toIndex].data.field1);
          const fromIndex = items.findIndex((item) => item.field1 === e.itemData.field1);
          items.splice(fromIndex, 1);
          items.splice(toIndex, 0, e.itemData);

          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          e.component.refresh();
        },
      },
      showBorders: true,
    }), DEFAULT_SELECTOR, { arg: generateData(20, 1) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dragToElement(
      page,
      dataGrid.getDataRow(2).getDragCommand(),
      dataGrid.getDataRow(4).element,
    );

    const getSequenceStartIndex = async (): Promise<number> => {
      const visibleRows = await dataGrid.apiGetVisibleRows();
      const visibleRowKeys = visibleRows.map((row) => row.key);
      const expectedSequence = ['5-1', '3-1', '6-1'];

      return visibleRowKeys.findIndex(
        (_, i) => expectedSequence.every((val, j) => visibleRowKeys[i + j] === val),
      );
    };

    await expect.poll(getSequenceStartIndex).toBeGreaterThanOrEqual(0);
  });
});
