import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';
import { waitForQueuedTimers } from '../../helpers/waitForQueuedTimers';

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
  test('DataGrid should scroll to the first cell of the next row and focus it when navigating with Tab key', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 500,
      dataSource: generateData(10, 20),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollTo({ left: 10000 });

    await expect.poll(() => dataGrid.getScrollLeft()).toBe(1500);
    await expect(dataGrid.getDataCell(0, 19).element).toBeAttached();

    await dataGrid.getDataCell(0, 19).element.click();

    await expect(dataGrid.getDataCell(0, 19).element).toBeFocused();

    await page.keyboard.press('Tab');

    // The simulated scrollable reports -0 at the start, which toBe(0) rejects.
    await expect.poll(() => dataGrid.getScrollLeft()).toBeCloseTo(0);
    await expect(dataGrid.getDataCell(1, 0).element).toBeFocused();
  });

  test('DataGrid should scroll to the last cell of the previous row and focus it when navigating with Shift+Tab keys', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 500,
      dataSource: generateData(10, 20),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(1, 0).element.click();

    await expect(dataGrid.getDataCell(1, 0).element).toBeFocused();

    await page.keyboard.press('Shift+Tab');

    await expect.poll(() => dataGrid.getScrollLeft()).toBe(1500);
    await expect(dataGrid.getDataCell(0, 19).element).toBeFocused();
  });

  [true, false].forEach((rtlEnabled) => {
    [true, false].forEach((useNative) => {
      test(`DataGrid should scroll to the next virtual cell and focus it when navigating with Tab key (rtlEnabled: ${rtlEnabled}, useNative: ${useNative})`, async ({ page }) => {
        await createWidget(page, 'dxDataGrid', {
          width: 500,
          rtlEnabled,
          dataSource: generateData(10, 20),
          columnWidth: 100,
          scrolling: {
            columnRenderingMode: 'virtual',
            useNative,
          },
        });

        const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
        const headerRow = dataGrid.getHeaders().getHeaderRow(0);
        const expectedScrollLeft = rtlEnabled ? 1400 : 100;

        await expect.poll(() => dataGrid.isReady()).toBe(true);
        await expect(headerRow.getDataHeaderCells()).toHaveCount(5);

        await dataGrid.getDataCell(0, 4).element.click();

        await expect(dataGrid.getDataCell(0, 4).element).toBeFocused();

        await page.keyboard.press('Tab');

        await expect.poll(() => dataGrid.getScrollLeft()).toBe(expectedScrollLeft);
        await expect(dataGrid.getDataCell(0, 5).element).toBeFocused();
        await expect(headerRow.getDataHeaderCells()).toHaveCount(10);
      });

      test(`DataGrid should scroll to the previous virtual cell and focus it when navigating with Shift+Tab key (rtlEnabled: ${rtlEnabled}, useNative: ${useNative})`, async ({ page }) => {
        await createWidget(page, 'dxDataGrid', {
          width: 500,
          rtlEnabled,
          dataSource: generateData(10, 20),
          columnWidth: 100,
          scrolling: {
            columnRenderingMode: 'virtual',
            useNative,
          },
        });

        const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
        const headerRow = dataGrid.getHeaders().getHeaderRow(0);

        await expect.poll(() => dataGrid.isReady()).toBe(true);

        await dataGrid.scrollTo({ left: rtlEnabled ? 0 : 10000 });

        // The simulated scrollable reports -0 at the start, which toBe(0) rejects.
        await expect.poll(() => dataGrid.getScrollLeft()).toBeCloseTo(rtlEnabled ? 0 : 1500);
        await expect(dataGrid.getDataCell(0, 19).element).toBeAttached();
        await expect(headerRow.getDataHeaderCells()).toHaveCount(5);

        await dataGrid.getDataCell(0, 15).element.click();

        await expect(dataGrid.getDataCell(0, 15).element).toBeFocused();

        await page.keyboard.press('Shift+Tab');

        await expect.poll(() => dataGrid.getScrollLeft()).toBe(rtlEnabled ? 100 : 1400);
        await expect(dataGrid.getDataCell(0, 14).element).toBeFocused();
        await expect(headerRow.getDataHeaderCells()).toHaveCount(10);
      });

      test(`DataGrid should scroll to the next virtual cell and focus it when navigating with Right key (rtlEnabled: ${rtlEnabled}, useNative: ${useNative})`, async ({ page }) => {
        await createWidget(page, 'dxDataGrid', {
          width: 500,
          rtlEnabled,
          dataSource: generateData(10, 20),
          columnWidth: 100,
          scrolling: {
            columnRenderingMode: 'virtual',
            useNative,
          },
        });

        const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
        const headerRow = dataGrid.getHeaders().getHeaderRow(0);
        const expectedScrollLeft = rtlEnabled ? 1400 : 100;
        const navigationKey = rtlEnabled ? 'ArrowLeft' : 'ArrowRight';

        await expect.poll(() => dataGrid.isReady()).toBe(true);
        await expect(headerRow.getDataHeaderCells()).toHaveCount(5);

        await dataGrid.getDataCell(0, 4).element.click();

        await expect(dataGrid.getDataCell(0, 4).element).toBeFocused();

        await page.keyboard.press(navigationKey);

        await expect.poll(() => dataGrid.getScrollLeft()).toBe(expectedScrollLeft);
        await expect(dataGrid.getDataCell(0, 5).element).toBeFocused();
        await expect(headerRow.getDataHeaderCells()).toHaveCount(10);
      });

      test(`DataGrid should scroll to the previous virtual cell and focus it when navigating with Left key (rtlEnabled: ${rtlEnabled}, useNative: ${useNative})`, async ({ page }) => {
        await createWidget(page, 'dxDataGrid', {
          width: 500,
          rtlEnabled,
          dataSource: generateData(10, 20),
          columnWidth: 100,
          scrolling: {
            columnRenderingMode: 'virtual',
            useNative,
          },
        });

        const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
        const headerRow = dataGrid.getHeaders().getHeaderRow(0);
        const navigationKey = rtlEnabled ? 'ArrowRight' : 'ArrowLeft';

        await expect.poll(() => dataGrid.isReady()).toBe(true);

        await dataGrid.scrollTo({ left: rtlEnabled ? 0 : 10000 });

        // The simulated scrollable reports -0 at the start, which toBe(0) rejects.
        await expect.poll(() => dataGrid.getScrollLeft()).toBeCloseTo(rtlEnabled ? 0 : 1500);
        await expect(dataGrid.getDataCell(0, 19).element).toBeAttached();
        await expect(headerRow.getDataHeaderCells()).toHaveCount(5);

        await dataGrid.getDataCell(0, 15).element.click();

        await expect(dataGrid.getDataCell(0, 15).element).toBeFocused();

        await page.keyboard.press(navigationKey);

        await expect.poll(() => dataGrid.getScrollLeft()).toBe(rtlEnabled ? 100 : 1400);
        await expect(dataGrid.getDataCell(0, 14).element).toBeFocused();
        await expect(headerRow.getDataHeaderCells()).toHaveCount(10);
      });
    });
  });

  test('DataGrid should move focus from Save to Cancel button on Tab press in row editing mode with virtual columns (T1326106)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 800,
      dataSource: generateData(10, 5),
      columnWidth: 100,
      keyExpr: 'field1',
      editing: {
        mode: 'row',
        allowUpdating: true,
        allowDeleting: true,
      },
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const commandCell = dataGrid.getDataRow(0).getCommandCell(5);

    await commandCell.getButton(0).click();
    // The row renders in the edit mode a moment after the click.
    await dataGrid.getDataRow(0).expectEdited();

    const saveButton = commandCell.getButton(0);
    const cancelButton = commandCell.getButton(1);

    await expect(saveButton).toBeAttached();
    await expect(cancelButton).toBeAttached();

    const lastDataCell = dataGrid.getDataCell(0, 4);

    await lastDataCell.element.click();

    await lastDataCell.expectFocusVisible();

    await page.keyboard.press('Tab');

    await expect(saveButton).toBeFocused();
    // The grid focuses the cell's first link again a moment later: a Tab before that is undone.
    await waitForQueuedTimers(page);

    await page.keyboard.press('Tab');

    await expect(cancelButton).toBeFocused();

    await page.keyboard.press('Tab');

    await dataGrid.getDataCell(1, 0).expectFocusVisible();
  });

  test('DataGrid should move focus from Save button to the last data cell on Shift + Tab press in row editing mode(T1326106)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 800,
      dataSource: generateData(10, 5),
      columnWidth: 100,
      keyExpr: 'field1',
      editing: {
        mode: 'row',
        allowUpdating: true,
        allowDeleting: true,
      },
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const commandCell = dataGrid.getDataRow(0).getCommandCell(5);

    await commandCell.getButton(0).click();
    // The row renders in the edit mode a moment after the click.
    await dataGrid.getDataRow(0).expectEdited();

    const saveButton = commandCell.getButton(0);
    const cancelButton = commandCell.getButton(1);

    await expect(saveButton).toBeAttached();
    await expect(cancelButton).toBeAttached();

    const firstDataCell = dataGrid.getDataCell(1, 0);

    await firstDataCell.element.click();

    await expect(firstDataCell.element).toBeFocused();

    await page.keyboard.press('Shift+Tab');

    await expect(saveButton).toBeFocused();

    await page.keyboard.press('Shift+Tab');

    await dataGrid.getDataCell(0, 4).expectFocusVisible();
  });
});
