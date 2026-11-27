import type { Page } from '@playwright/test';
import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../../fixtures';
import type { WindowCallbackExtended } from '../../../../../helpers/callbackTestHelper';
import { CallbackTestHelper } from '../../../../../helpers/callbackTestHelper';
import { DEFAULT_SELECTOR } from '../../../../../helpers/const';
import { createWidget } from '../../../../../helpers/createWidget';
import DataGrid from '../../../../../models/dataGrid';
import { getFirstDataRow } from '../../../helpers/getFirstDataRow';

type FocusCellChangingData = [
  [prevRowIdx: number, prevColumnIdx: number],
  [rowIdx: number, columnIdx: number],
];
type FocusCellChangedData = [rowIdx: number, columnIdx: number];
type FocusRowChangingData = [prevRowIdx: number, rowIdx: number];
type FocusRowChangedData = [rowIdx: number];

type GridEventsConfig = Pick<Properties, 'onFocusedCellChanging' | 'onFocusedCellChanged' | 'onFocusedRowChanging' | 'onFocusedRowChanged'>;
type TestWindow = WindowCallbackExtended & { gridEventsConfig: GridEventsConfig };

// Handlers can't pass through page.evaluate: the page builds them once, and each grid config
// spreads them.
const initCallbackTesting = async (page: Page): Promise<void> => {
  await CallbackTestHelper.initClientTesting(page, [
    'cellFocusChanging',
    'cellFocusChanged',
    'rowFocusChanging',
    'rowFocusChanged',
  ]);

  await page.evaluate(() => {
    const testWindow = window as TestWindow;

    testWindow.gridEventsConfig = {
      onFocusedCellChanging: ({
        prevRowIndex,
        prevColumnIndex,
        newRowIndex,
        newColumnIndex,
      }) => {
        testWindow.clientTesting!.addCallbackResult('cellFocusChanging', [
          [prevRowIndex, prevColumnIndex], [newRowIndex, newColumnIndex],
        ]);
      },
      onFocusedCellChanged: ({ rowIndex, columnIndex }) => {
        testWindow.clientTesting!.addCallbackResult('cellFocusChanged', [rowIndex, columnIndex]);
      },
      onFocusedRowChanging: ({ prevRowIndex, newRowIndex }) => {
        testWindow.clientTesting!.addCallbackResult('rowFocusChanging', [prevRowIndex, newRowIndex]);
      },
      onFocusedRowChanged: ({ rowIndex }) => {
        testWindow.clientTesting!.addCallbackResult('rowFocusChanged', [rowIndex]);
      },
    };
  });
};

const collectEventsCallbackResults = async (page: Page) => [
  await CallbackTestHelper.getClientResults<FocusCellChangingData>(page, 'cellFocusChanging'),
  await CallbackTestHelper.getClientResults<FocusCellChangedData>(page, 'cellFocusChanged'),
  await CallbackTestHelper.getClientResults<FocusRowChangingData>(page, 'rowFocusChanging'),
  await CallbackTestHelper.getClientResults<FocusRowChangedData>(page, 'rowFocusChanged'),
];

const getGridDataConfig = (size: number): Properties => ({
  keyExpr: 'id',
  dataSource: new Array(size).fill(null).map((_, idx) => ({
    id: idx,
    dataA: `dataA_${idx}`,
    dataB: `dataB_${idx}`,
    dataC: `dataC_${idx}`,
  })),
  columns: ['dataA', 'dataB', 'dataC'],
});

const createGrid = (page: Page, options: Properties): Promise<void> => createWidget(
  page,
  'dxDataGrid',
  (gridOptions) => ({
    ...gridOptions,
    ...(window as TestWindow).gridEventsConfig,
  }),
  DEFAULT_SELECTOR,
  { arg: options },
);

test.describe('Focused row - new rows T1162227', () => {
  test('It should fire events after new rows were added', async ({ page }) => {
    const expectedCellFocusChanging: FocusCellChangingData[] = [
      [[-1, -1], [0, 0]], [[1, 0], [0, 0]], [[1, 0], [0, 0]],
    ];
    const expectedCellFocusChanged: FocusCellChangedData[] = [
      [0, 0], [0, 0], [0, 0],
    ];
    const expectedRowFocusChanging: FocusRowChangingData[] = [
      [-1, 0], [1, 0], [1, 0],
    ];
    const expectedRowFocusChanged: FocusRowChangedData[] = [
      [0], [1], [0], [1], [0],
    ];

    await initCallbackTesting(page);
    await createGrid(page, {
      focusedRowEnabled: true,
      editing: {
        mode: 'batch',
        allowAdding: true,
        allowUpdating: true,
      },
      ...getGridDataConfig(4),
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const addRowBtn = dataGrid.getToolbar().getItem();

    await addRowBtn.click();
    await addRowBtn.click();
    await addRowBtn.click();

    await expect.poll(() => collectEventsCallbackResults(page)).toEqual([
      expectedCellFocusChanging,
      expectedCellFocusChanged,
      expectedRowFocusChanging,
      expectedRowFocusChanged,
    ]);
  });

  test('It should fire events when focus switch between existing and a new row', async ({ page }) => {
    const expectedCellFocusChanging: FocusCellChangingData[] = [
      [[-1, -1], [0, 0]], [[0, 0], [2, 0]], [[2, 0], [0, 0]],
    ];
    const expectedCellFocusChanged: FocusCellChangedData[] = [
      [0, 0], [2, 0], [0, 0],
    ];
    const expectedRowFocusChanging: FocusRowChangingData[] = [
      [-1, 0], [0, 2], [2, 0],
    ];
    const expectedRowFocusChanged: FocusRowChangedData[] = [
      [0], [2], [0],
    ];

    await initCallbackTesting(page);
    await createGrid(page, {
      focusedRowEnabled: true,
      editing: {
        mode: 'batch',
        allowAdding: true,
        allowUpdating: true,
      },
      ...getGridDataConfig(4),
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const addRowBtn = dataGrid.getToolbar().getItem();
    const newRow = getFirstDataRow(dataGrid);
    const newCell = newRow.getDataCell(0);
    const existingCell = dataGrid.getDataCell(1, 0);

    await addRowBtn.click();
    await newRow.expectInserted();
    await existingCell.element.click();
    await newCell.element.click();

    await expect.poll(() => collectEventsCallbackResults(page)).toEqual([
      expectedCellFocusChanging,
      expectedCellFocusChanged,
      expectedRowFocusChanging,
      expectedRowFocusChanged,
    ]);
  });

  test('It should not fire row events if focusedRowEnabled: false', async ({ page }) => {
    const expectedCellFocusChanging: FocusCellChangingData[] = [
      [[-1, -1], [0, 0]], [[0, 0], [2, 0]], [[2, 0], [0, 0]],
    ];
    const expectedCellFocusChanged: FocusCellChangedData[] = [
      [0, 0], [2, 0], [0, 0],
    ];
    const expectedRowFocusChanging: FocusRowChangingData[] = [];
    const expectedRowFocusChanged: FocusRowChangedData[] = [];

    await initCallbackTesting(page);
    await createGrid(page, {
      focusedRowEnabled: false,
      editing: {
        mode: 'batch',
        allowAdding: true,
        allowUpdating: true,
      },
      ...getGridDataConfig(4),
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const addRowBtn = dataGrid.getToolbar().getItem();
    const newRow = getFirstDataRow(dataGrid);
    const newCell = newRow.getDataCell(0);
    const existingCell = dataGrid.getDataCell(1, 0);

    await addRowBtn.click();
    await newRow.expectInserted();
    await existingCell.element.click();
    await newCell.element.click();

    await expect.poll(() => collectEventsCallbackResults(page)).toEqual([
      expectedCellFocusChanging,
      expectedCellFocusChanged,
      expectedRowFocusChanging,
      expectedRowFocusChanged,
    ]);
  });

  test('It should fire rowChanged event on initialization if focusedRowKey options is set', async ({ page }) => {
    const expectedRowFocusChanged: FocusRowChangedData[] = [
      [1],
    ];

    await initCallbackTesting(page);
    await createGrid(page, {
      focusedRowKey: 1,
      focusedRowEnabled: true,
      editing: {
        mode: 'batch',
        allowAdding: true,
        allowUpdating: true,
      },
      ...getGridDataConfig(4),
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await dataGrid.getDataRow(1).expectFocusedRow();

    await expect.poll(
      () => CallbackTestHelper.getClientResults<FocusRowChangedData>(page, 'rowFocusChanged'),
    ).toEqual(expectedRowFocusChanged);
  });

  // NOTE: It may not be logical, but it is the current prod version's behavior (23.1).
  // (changing event fires after page change action).
  test('It should fire correct events on page change', async ({ page }) => {
    const expectedCellFocusChanging: FocusCellChangingData[] = [
      [[-1, -1], [0, 0]], [[0, 0], [0, 0]],
    ];
    const expectedCellFocusChanged: FocusCellChangedData[] = [
      [0, 0], [0, 0],
    ];
    const expectedRowFocusChanging: FocusRowChangingData[] = [
      [-1, 0], [0, 0],
    ];
    const expectedRowFocusChanged: FocusRowChangedData[] = [
      [0], [0],
    ];

    await initCallbackTesting(page);
    await createGrid(page, {
      focusedRowEnabled: true,
      editing: {
        mode: 'batch',
        allowAdding: true,
        allowUpdating: true,
      },
      paging: {
        pageSize: 2,
      },
      ...getGridDataConfig(4),
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const nextPage = dataGrid.getPager().getNavPage('2');

    await dataGrid.getDataCell(0, 0).element.click();
    await nextPage.click();
    await dataGrid.getDataCell(2, 0).element.click();

    await expect.poll(() => collectEventsCallbackResults(page)).toEqual([
      expectedCellFocusChanging,
      expectedCellFocusChanged,
      expectedRowFocusChanging,
      expectedRowFocusChanged,
    ]);
  });

  test('It should fire row changed event and change page if focusedRowKey on another page', async ({ page }) => {
    const expectedRowFocusChanged: FocusRowChangedData[] = [[1]];

    await initCallbackTesting(page);
    await createGrid(page, {
      focusedRowEnabled: true,
      focusedRowKey: 3,
      editing: {
        mode: 'batch',
        allowAdding: true,
        allowUpdating: true,
      },
      paging: {
        pageSize: 2,
      },
      ...getGridDataConfig(4),
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(
      () => CallbackTestHelper.getClientResults<FocusRowChangedData>(page, 'rowFocusChanged'),
    ).toEqual(expectedRowFocusChanged);
    await expect(dataGrid.getDataCell(3, 0).element).toHaveText('dataA_3');
  });

  test('After modification of newRowIndex / newCellIndex focused row and cell should be changed', async ({ page }) => {
    const expectedCellFocusChanging: FocusCellChangingData[] = [
      [[-1, -1], [0, 0]],
    ];
    const expectedCellFocusChanged: FocusCellChangedData[] = [
      [3, 1],
    ];
    const expectedRowFocusChanging: FocusRowChangingData[] = [
      [-1, 3],
    ];
    const expectedRowFocusChanged: FocusRowChangedData[] = [
      [3],
    ];

    await initCallbackTesting(page);
    await createWidget(page, 'dxDataGrid', (dataConfig) => ({
      focusedRowEnabled: true,
      editing: {
        mode: 'batch',
        allowAdding: true,
        allowUpdating: true,
      },
      ...dataConfig,
      ...(window as TestWindow).gridEventsConfig,
      onFocusedCellChanging: (event) => {
        (window as TestWindow)
          .clientTesting!
          .addCallbackResult('cellFocusChanging', [
            [event.prevRowIndex, event.prevColumnIndex], [event.newRowIndex, event.newColumnIndex],
          ]);

        /* eslint-disable no-param-reassign */
        event.newRowIndex = 3;
        event.newColumnIndex = 1;
        /* eslint-enable no-param-reassign */
      },
    }), DEFAULT_SELECTOR, { arg: getGridDataConfig(4) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getDataCell(0, 0).element.click();

    await expect.poll(() => collectEventsCallbackResults(page)).toEqual([
      expectedCellFocusChanging,
      expectedCellFocusChanged,
      expectedRowFocusChanging,
      expectedRowFocusChanged,
    ]);
  });

  test('It should be able to change focusedRowKey on "onContentReady"', async ({ page }) => {
    const expectedRowFocusChanged: FocusRowChangedData[] = [[1], [3]];

    await initCallbackTesting(page);
    await createWidget(page, 'dxDataGrid', (dataConfig) => ({
      focusedRowKey: 1,
      focusedRowEnabled: true,
      editing: {
        mode: 'batch',
        allowAdding: true,
        allowUpdating: true,
      },
      onContentReady: ({ component }) => {
        component.option('focusedRowKey', 3);
      },
      ...dataConfig,
      ...(window as TestWindow).gridEventsConfig,
    }), DEFAULT_SELECTOR, { arg: getGridDataConfig(4) });

    await expect.poll(
      () => CallbackTestHelper.getClientResults<FocusRowChangedData>(page, 'rowFocusChanged'),
    ).toEqual(expectedRowFocusChanged);
  });
});
