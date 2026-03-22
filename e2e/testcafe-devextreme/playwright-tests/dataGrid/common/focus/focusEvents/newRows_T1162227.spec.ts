import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Focused row - new rows T1162227', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  // TODO: Something wrong with test cleanup with 'disablePageReloads'
  //       old events from previous test still alive on the next test case run
  //       So, we should disable it for these tests until this problem exists.
  );

  type FocusCellChangingData = [
    [prevRowIdx: number, prevColumnIdx: number],
    [rowIdx: number, columnIdx: number],
  ];
  type FocusCellChangedData = [rowIdx: number, columnIdx: number];
  type FocusRowChangingData = [prevRowIdx: number, rowIdx: number];
  type FocusRowChangedData = [rowIdx: number];

  const GRID_SELECTOR = '#container';

  const initCallbackTesting = async () => {
    await CallbackTestHelper.initClientTesting([
      'cellFocusChanging',
      'cellFocusChanged',
      'rowFocusChanging',
      'rowFocusChanged',
    ]);
  };

  const clearCallbackTesting = async () => {
    await CallbackTestHelper.clearClientData([
      'cellFocusChanging',
      'cellFocusChanged',
      'rowFocusChanging',
      'rowFocusChanged',
    ]);
  };

  const collectEventsCallbackResults = async () => [
    await CallbackTestHelper.getClientResults<FocusCellChangingData>('cellFocusChanging'),
    await CallbackTestHelper.getClientResults<FocusCellChangedData>('cellFocusChanged'),
    await CallbackTestHelper.getClientResults<FocusRowChangingData>('rowFocusChanging'),
    await CallbackTestHelper.getClientResults<FocusRowChangedData>('rowFocusChanged'),
  ];

  const getGridDataConfig = (size: number) => ({
    keyExpr: 'id',
    dataSource: new Array(size).fill(null).map((_, idx) => ({
      id: idx,
      dataA: `dataA_${idx}`,
      dataB: `dataB_${idx}`,
      dataC: `dataC_${idx}`,
    })),
    columns: ['dataA', 'dataB', 'dataC'],
  });

  const getGridEventsConfig = () => ({
    onFocusedCellChanging: ({
      prevRowIndex,
      prevColumnIndex,
      newRowIndex,
      newColumnIndex,
    }) => {
      (window as WindowCallbackExtended)
        .clientTesting!
        .addCallbackResult('cellFocusChanging', [
          [prevRowIndex, prevColumnIndex], [newRowIndex, newColumnIndex],
        ]);
    },
    onFocusedCellChanged: ({ rowIndex, columnIndex }) => {
      (window as WindowCallbackExtended)
        .clientTesting!
        .addCallbackResult('cellFocusChanged', [rowIndex, columnIndex]);
    },
    onFocusedRowChanging: ({ prevRowIndex, newRowIndex }) => {
      (window as WindowCallbackExtended)
        .clientTesting!
        .addCallbackResult('rowFocusChanging', [prevRowIndex, newRowIndex]);
    },
    onFocusedRowChanged: ({ rowIndex }) => {
      (window as WindowCallbackExtended)
        .clientTesting!
        .addCallbackResult('rowFocusChanged', [rowIndex]);
    },
  });

  test('It should fire events after new rows were added', async ({ page }) => {
    await initCallbackTesting();
      await createWidget(page, 'dxDataGrid', {
        focusedRowEnabled: true,
        editing: {
          mode: 'batch',
          allowAdding: true,
          allowUpdating: true,
        },
        ...getGridDataConfig(4),
        ...getGridEventsConfig(),
      });

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

      const addRowBtn = page.locator('.dx-toolbar').getItem();

    await (addRowBtn).click()
      .click(addRowBtn)
      .click(addRowBtn);

    const [
      cellFocusChanging,
      cellFocusChanged,
      rowFocusChanging,
      rowFocusChanged,
    ] = await collectEventsCallbackResults();

    expect(await cellFocusChanging);
    await t.eql(expectedCellFocusChanging);
    expect(await cellFocusChanged);
    await t.eql(expectedCellFocusChanged);
    expect(await rowFocusChanging);
    await t.eql(expectedRowFocusChanging);
    expect(await rowFocusChanged);
    await t.eql(expectedRowFocusChanged);
  });
    // TODO: .after() block removed
});
