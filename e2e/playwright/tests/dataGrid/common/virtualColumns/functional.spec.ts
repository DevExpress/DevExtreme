import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';
import { waitForScrollHandled } from '../../helpers/waitForQueuedTimers';

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

test.describe('Virtual Columns.Functional', () => {
  test('DataGrid should not scroll back to the focused cell after horizontal scrolling to the right when columnRenderingMode is virtual', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 450,
      dataSource: generateData(10, 30),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getDataCell(0, 0).element.click();
    await expect(dataGrid.getDataCell(0, 0).element).toBeFocused();

    await dataGrid.scrollTo({ left: 50 });

    await expect.poll(() => dataGrid.getScrollLeft()).toBe(50);

    await dataGrid.scrollTo({ left: 100 });

    await expect.poll(() => dataGrid.getScrollLeft()).toBe(100);
  });

  test('DataGrid should not scroll back to the focused cell after horizontal scrolling to the left when columnRenderingMode is virtual', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 450,
      dataSource: generateData(10, 50),
      columnWidth: 100,
      // @ts-expect-error private option
      loadingTimeout: null,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.scrollTo({ left: 1500 });

    await dataGrid.getDataCell(0, 18).element.click();
    await expect(dataGrid.getDataCell(0, 18).element).toBeFocused();

    await dataGrid.scrollTo({ left: 1200 });

    await expect.poll(() => dataGrid.getScrollLeft()).toBe(1200);

    await dataGrid.scrollTo({ left: 1000 });

    await expect.poll(() => dataGrid.getScrollLeft()).toBe(1000);

    await dataGrid.scrollTo({ left: 800 });

    await waitForScrollHandled(page);
    await expect.poll(() => dataGrid.getScrollLeft()).toBe(800);
  });
});
