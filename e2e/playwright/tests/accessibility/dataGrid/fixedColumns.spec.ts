import type { Page } from '@playwright/test';
import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import DataGrid from '../../../models/dataGrid';

const pressKey = async (page: Page, key: string, times = 1): Promise<void> => {
  for (let i = 0; i < times; i += 1) {
    await page.keyboard.press(key);
  }
};

const getGridConfig = (needFixedColumnOnLeft = true): Properties => ({
  columnWidth: 150,
  width: 800,
  keyExpr: 'id',
  scrolling: {
    useNative: true,
  },
  dataSource: [
    {
      id: 0, column1: 'a', column2: 'a', column3: 'a', column4: 'a', column5: 'a', column6: 'a', column7: 'a', column8: 'a',
    },
    {
      id: 1, column1: 'a', column2: 'a', column3: 'a', column4: 'a', column5: 'a', column6: 'a', column7: 'a', column8: 'a',
    },
  ],
  columnFixing: {
    // @ts-expect-error private option
    legacyMode: true,
  },
  columns: [
    { dataField: 'column1', fixed: needFixedColumnOnLeft },
    { dataField: 'column2', fixed: needFixedColumnOnLeft },
    { dataField: 'column3' },
    { dataField: 'column4' },
    { dataField: 'column5' },
    { dataField: 'column6' },
    { dataField: 'column7', fixed: true, fixedPosition: 'right' },
    { dataField: 'column8', fixed: true, fixedPosition: 'right' },
  ],
});

const COLUMNS_LENGTH = 8;

const expectReady = async (dataGrid: DataGrid): Promise<void> => {
  await expect.poll(() => dataGrid.isReady()).toBe(true);
};

test('Accessibility: Scrollable should have focusable element', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', getGridConfig());

  await a11yCheck(page);
});

test('Accessibility: Scrollable should have focusable element when navigate through fixed columns', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', getGridConfig());

  const dataGrid = new DataGrid(page, '#container');
  await expectReady(dataGrid);

  const columnsByFixing: boolean[] = await page.evaluate(
    () => (window as any).widget.getVisibleColumns().map((column) => column.fixed),
  );

  // focus through headers
  await pressKey(page, 'Tab', COLUMNS_LENGTH);

  // focus cells in first row
  for (let columnIndex = 0; columnIndex < COLUMNS_LENGTH; columnIndex += 1) {
    await pressKey(page, 'Tab');

    const isFixedCell = columnsByFixing[columnIndex];
    const cell = isFixedCell
      ? dataGrid.getFixedDataCell(0, columnIndex)
      : dataGrid.getDataCell(0, columnIndex);

    await cell.expectFocused();

    // it makes sense to check accessibility only if fixed column is focused
    const needCheckA11y = columnsByFixing[columnIndex];

    if (needCheckA11y) {
      await a11yCheck(page);
    }
  }
});

test('Accessibility: Scrollable should always have focusable element when navigate back to column headers', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', getGridConfig());

  const dataGrid = new DataGrid(page, '#container');
  await expectReady(dataGrid);

  // focus first cell in second row
  await a11yCheck(page);
  await dataGrid.getFixedDataCell(1, 0).element.click();

  await expect(dataGrid.getFixedDataCell(1, 0).element).toBeFocused();

  await a11yCheck(page);

  // focus last not fixed header cell
  // In headless mode with nativeAutomation, we need one more shift+tab
  // because focus goes through scrollable-container
  await pressKey(page, 'Shift+Tab', 10);

  const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(COLUMNS_LENGTH - 3);

  await headerCell.expectFocused();

  await a11yCheck(page);
});

test('Accessibility: Scrollable should have focusable element when click out of the grid', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', getGridConfig());

  const dataGrid = new DataGrid(page, '#container');
  await expectReady(dataGrid);

  await dataGrid.getFixedDataCell(0, 0).element.click();

  // focus through data row to last cell
  await pressKey(page, 'Tab', COLUMNS_LENGTH - 1);

  await dataGrid.getFixedDataCell(0, COLUMNS_LENGTH - 1).expectFocused();

  // focus out rows view by outside click
  const dataGridOffsetBottom = await dataGrid.element.evaluate(
    (element) => element.getBoundingClientRect().bottom,
  );
  const bodyWidth = await page.locator('body').evaluate(
    (element) => element.getBoundingClientRect().width,
  );
  await page.mouse.click(bodyWidth / 2, dataGridOffsetBottom + 10);

  await a11yCheck(page);
});

test('Accessibility: Scrollable should have focusable element when navigate out of the grid', async ({ page }) => {
  await page.evaluate(() => { $('<div id="myButton">').appendTo('body'); });
  await createWidget(page, 'dxButton', { text: 'Focus' }, '#myButton');

  await createWidget(page, 'dxDataGrid', getGridConfig());

  const dataGrid = new DataGrid(page, '#container');
  await expectReady(dataGrid);

  await dataGrid.getFixedDataCell(0, 0).element.click();

  // focus through 1st and 2nd data row
  await pressKey(page, 'Tab', COLUMNS_LENGTH - 1);
  await pressKey(page, 'Tab', COLUMNS_LENGTH);

  // focus button outside of the grid
  await pressKey(page, 'Tab');

  await expect(page.locator('#myButton')).toBeFocused();

  await a11yCheck(page);
});

test('Accessibility: Scrollable should have focusable when fixed on the right side columns are focused', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', getGridConfig(false));

  const dataGrid = new DataGrid(page, '#container');
  await expectReady(dataGrid);

  // focus through headers
  await pressKey(page, 'Tab', COLUMNS_LENGTH);

  // focus through data row till last cell (which is fixed)
  await pressKey(page, 'Tab', COLUMNS_LENGTH);

  await dataGrid.getFixedDataCell(0, COLUMNS_LENGTH - 1).expectFocused();

  await a11yCheck(page);
});
