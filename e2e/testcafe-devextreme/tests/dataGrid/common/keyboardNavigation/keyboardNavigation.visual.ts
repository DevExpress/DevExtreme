import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { ClientFunction } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { getData } from '../../helpers/generateDataSourceData';
import { isScrollAtEnd } from '../../helpers/rowDraggingHelpers';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture`Keyboard Navigation.Visual`
  .page(url(__dirname, '../../../container.html'));

const KEYBOARD_NAVIGATION_TIMEOUT = 3000;

const isKeyboardNavigationInProgress = ClientFunction(() => {
  const dataGrid = ($('#container') as any).dxDataGrid('instance');

  return dataGrid
    .getController('keyboardNavigation')
    .navigationToCellInProgress();
});

const waitForPaint = ClientFunction(() => new Promise<void>((resolve) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => resolve());
  });
}));

const focusDataCell = async (
  t: TestController,
  dataGrid: DataGrid,
  rowIndex: number,
  columnIndex: number,
): Promise<void> => {
  const cell = dataGrid.getDataCell(rowIndex, columnIndex);

  await dataGrid.apiFocus(cell.element);
  await t
    .expect(cell.element.focused)
    .ok({ timeout: KEYBOARD_NAVIGATION_TIMEOUT });
};

const expectDataCellFocusState = async (
  t: TestController,
  dataGrid: DataGrid,
  rowIndex: number,
  columnIndex: number,
): Promise<void> => {
  await t
    .expect(dataGrid.getDataCell(rowIndex, columnIndex).isFocused)
    .ok({ timeout: KEYBOARD_NAVIGATION_TIMEOUT });
};

const waitForKeyboardNavigation = async (t: TestController): Promise<void> => {
  await t
    .expect(isKeyboardNavigationInProgress())
    .notOk({ timeout: KEYBOARD_NAVIGATION_TIMEOUT });
};

// Quick navigation through grid cells via Home and End keys
test('Focus the last cell in the row that contains focus when pressing the End key', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .pressKey('end');

  await testScreenshot(t, takeScreenshot, 'focus_last_cell_in_row_that_contains_focus_when_pressing_End_key.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 7),
  columnWidth: 100,
  height: 500,
  width: 800,
  showBorders: true,
  scrolling: {
    showScrollbar: 'never',
  },
}));

test('Focus the first cell in the row that contains focus when pressing the Home key', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t
    .click(dataGrid.getDataCell(0, 6).element)
    .pressKey('home');

  await testScreenshot(t, takeScreenshot, 'focus_first_cell_in_row_that_contains_focus_when_pressing_Home_key.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 7),
  columnWidth: 100,
  height: 500,
  width: 800,
  showBorders: true,
  scrolling: {
    showScrollbar: 'never',
  },
}));

test('Navigate to last cell in the row that contains focus when pressing the End key', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .pressKey('end');

  await testScreenshot(t, takeScreenshot, 'navigate_to_last_cell_in_row_that_contains_focus_when_pressing_End_key.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 15),
  columnWidth: 100,
  height: 500,
  width: 800,
  showBorders: true,
  scrolling: {
    showScrollbar: 'never',
  },
}));

test('Navigate to first cell in the row that contains focus when pressing the Home key', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  await dataGrid.scrollTo(t, { x: 700 });

  // assert
  await t
    .expect(dataGrid.getScrollLeft())
    .eql(700);

  // act
  await t
    .click(dataGrid.getDataCell(0, 14).element)
    .pressKey('home');

  await testScreenshot(t, takeScreenshot, 'navigate_to_first_cell_in_row_that_contains_focus_when_pressing_Home_key.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 15),
  columnWidth: 100,
  height: 500,
  width: 800,
  showBorders: true,
  scrolling: {
    showScrollbar: 'never',
  },
}));

test('Navigate to last cell in the row that contains focus when focusedRowEnabled is true', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .pressKey('end');

  await testScreenshot(t, takeScreenshot, 'navigate_to_last_cell_in_row_that_contains_focus_when_focusedRowEnabled_is_true.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 15),
  columnWidth: 100,
  height: 500,
  width: 800,
  showBorders: true,
  focusedRowEnabled: true,
  scrolling: {
    showScrollbar: 'never',
  },
}));

test('Navigate to first cell in the row that contains focus when row dragging is enabled', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  await dataGrid.scrollTo(t, { x: 700 });

  // assert
  await t
    .expect(dataGrid.getScrollLeft())
    .eql(700);

  // act
  await t
    .click(dataGrid.getDataCell(0, 14).element)
    .pressKey('home');

  await testScreenshot(t, takeScreenshot, 'navigate_to_first_cell_in_row_that_contains_focus_when_row_dragging_is_enabled.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 15),
  columnWidth: 100,
  height: 500,
  width: 800,
  showBorders: true,
  rowDragging: {
    allowReordering: true,
    showDragIcons: true,
  },
  scrolling: {
    showScrollbar: 'never',
  },
}));

test('Navigation should not work when pressing the End key when the row is in edit state', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .pressKey('end');

  await testScreenshot(t, takeScreenshot, 'navigation_should_not_work_when_pressing_End_when_row_is_in_edit_state.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 15),
  keyExpr: 'field_0',
  columnWidth: 100,
  height: 500,
  width: 800,
  showBorders: true,
  scrolling: {
    showScrollbar: 'never',
  },
  editing: {
    editRowKey: 'val_0_0',
  },
}));

test('Navigate to last cell in the row that contains focus when virtual columns are enabled', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .pressKey('end');

  await testScreenshot(t, takeScreenshot, 'navigate_to_last_cell_in_row_that_contains_focus_when_virtual_columns_are_enabled.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 50),
  columnWidth: 100,
  height: 500,
  width: 800,
  showBorders: true,
  scrolling: {
    useNative: false,
    showScrollbar: 'never',
    columnRenderingMode: 'virtual',
  },
}));

test('Navigate to first cell in the row that contains focus when virtual columns are enabled', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  await dataGrid.scrollTo(t, { x: 4200 });

  // assert
  await t
    .expect(dataGrid.getScrollLeft())
    .eql(4200);

  // act
  await t
    .click(dataGrid.getDataCell(0, 49).element)
    .pressKey('home');

  await testScreenshot(t, takeScreenshot, 'navigate_to_first_cell_in_row_that_contains_focus_when_virtual_columns_are_enabled.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 50),
  columnWidth: 100,
  height: 500,
  width: 800,
  showBorders: true,
  scrolling: {
    useNative: false,
    showScrollbar: 'never',
    columnRenderingMode: 'virtual',
  },
}));

test('Navigate to last cell in the row that contains focus when adaptivity is enabled', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .pressKey('end');

  await testScreenshot(t, takeScreenshot, 'navigate_to_last_cell_in_row_that_contains_focus_when_adaptivity_is_enabled.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 50),
  columnWidth: 100,
  height: 500,
  width: 800,
  showBorders: true,
  scrolling: {
    showScrollbar: 'never',
  },
  customizeColumns(columns) {
    columns[columns.length - 1].hidingPriority = 0;
    columns.splice(columns.length - 2, 0, { type: 'adaptive', width: 100 });
  },
}));

test('Navigate to first cell in the row that contains focus when adaptivity is enabled', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  await dataGrid.scrollTo(t, { x: 4200 });

  // assert
  await t
    .expect(dataGrid.getScrollLeft())
    .eql(4200);

  // act
  await t
    .click(dataGrid.getDataCell(0, 50).element)
    .pressKey('home');

  await testScreenshot(t, takeScreenshot, 'navigate_to_first_cell_in_row_that_contains_focus_when_adaptivity_is_enabled.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 50),
  columnWidth: 100,
  height: 500,
  width: 800,
  showBorders: true,
  customizeColumns(columns) {
    columns[0].hidingPriority = 0;
    columns.push({ type: 'adaptive', width: 100 });
  },
  scrolling: {
    showScrollbar: 'never',
  },
}));

// Quick navigation through grid rows via Ctrl+Home and Ctrl+End keys
test('Focus the last cell in the last row when pressing the Ctrl+End key', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .pressKey('ctrl+end');

  await testScreenshot(t, takeScreenshot, 'focus_last_cell_in_last_row_when_pressing_Ctrl_+_End_key.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(5, 7),
  columnWidth: 100,
  height: 400,
  width: 800,
  showBorders: true,
}));

test('Focus the first cell in the firs row when pressing the Ctrl+Home key', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t
    .click(dataGrid.getDataCell(4, 6).element)
    .pressKey('ctrl+home');

  await testScreenshot(t, takeScreenshot, 'focus_first_cell_in_first_row_when_pressing_Ctrl_+_Home_key.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(5, 7),
  columnWidth: 100,
  height: 400,
  width: 800,
  showBorders: true,
}));

test('Navigate to last cell in the last row when pressing the Ctrl+End key', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .pressKey('ctrl+end');

  await testScreenshot(t, takeScreenshot, 'navigate_to_last_cell_in_last_row_when_pressing_Ctrl_+_End_key.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 15),
  columnWidth: 100,
  height: 500,
  width: 800,
  showBorders: true,
  scrolling: {
    showScrollbar: 'never',
  },
}));

test('Navigate to first cell in the first row when pressing the Ctrl + Home key', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  await dataGrid.scrollTo(t, { x: 700, y: 1000 });

  // assert
  await t
    .expect(dataGrid.getScrollLeft())
    .eql(700);

  await testScreenshot(t, takeScreenshot, 'navigate_to_first_cell_in_first_row_when_pressing_Ctrl_+_Home_key_1.png', { element: dataGrid.element });

  // act
  await t
    .click(dataGrid.getDataCell(19, 14).element)
    .pressKey('ctrl+home');

  await testScreenshot(t, takeScreenshot, 'navigate_to_first_cell_in_first_row_when_pressing_Ctrl_+_Home_key_2.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 15),
  columnWidth: 100,
  height: 500,
  width: 800,
  showBorders: true,
  scrolling: {
    showScrollbar: 'never',
  },
}));

test('Navigate to last cell in the last row when virtual scrolling is enabled', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await focusDataCell(t, dataGrid, 0, 0);
  await t.pressKey('ctrl+end');
  await waitForKeyboardNavigation(t);

  await expectDataCellFocusState(t, dataGrid, 199, 14);
  await testScreenshot(t, takeScreenshot, 'navigate_to_last_cell_in_last_row_when_virtual_scrolling_is_enabled.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(200, 15),
  columnWidth: 100,
  height: 500,
  width: 800,
  showBorders: true,
  scrolling: {
    mode: 'virtual',
    showScrollbar: 'never',
    useNative: false,
  },
}));

test.meta({ unstable: true })('Navigate to first cell in the first row when virtual scrolling is enabled', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  await dataGrid
    .scrollTo(t, { x: 700, y: 10000 });

  // assert
  await t
    .expect(dataGrid.getScrollLeft())
    .eql(700);

  await testScreenshot(t, takeScreenshot, 'navigate_to_first_cell_in_first_row_when_virtual_scrolling_is_enabled_1.png', { element: dataGrid.element });

  // act
  await focusDataCell(t, dataGrid, 199, 14);
  await t.pressKey('ctrl+home');
  await waitForKeyboardNavigation(t);

  await expectDataCellFocusState(t, dataGrid, 0, 0);
  await testScreenshot(t, takeScreenshot, 'navigate_to_first_cell_in_first_row_when_virtual_scrolling_is_enabled_2.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(200, 15),
  columnWidth: 100,
  height: 500,
  width: 800,
  showBorders: true,
  scrolling: {
    mode: 'virtual',
    showScrollbar: 'never',
    useNative: false,
  },
}));

test('Navigate to last cell in the last row when virtual scrolling and columns are enabled', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await focusDataCell(t, dataGrid, 0, 0);
  await t.pressKey('ctrl+end');
  await waitForKeyboardNavigation(t);

  // assert
  await expectDataCellFocusState(t, dataGrid, 199, 34);

  await testScreenshot(t, takeScreenshot, 'navigate_to_last_cell_in_last_row_when_virtual_scrolling_and_columns_are_enabled.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(200, 35),
  columnWidth: 100,
  height: 500,
  width: 800,
  scrolling: {
    mode: 'virtual',
    columnRenderingMode: 'virtual',
    showScrollbar: 'never',
  },
}));

test('Navigate to first cell in the first row when virtual scrolling and columns are enabled', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  await dataGrid.scrollTo(t, { x: 3000, y: 10000 });

  // assert
  await t
    .expect(dataGrid.getScrollLeft())
    .eql(2700);

  await testScreenshot(t, takeScreenshot, 'navigate_to_first_cell_in_first_row_when_virtual_scrolling_and_columns_are_enabled_1.png', { element: dataGrid.element });

  // act
  await focusDataCell(t, dataGrid, 199, 34);
  await t.pressKey('ctrl+home');
  await waitForKeyboardNavigation(t);

  // assert
  await expectDataCellFocusState(t, dataGrid, 0, 0);

  await testScreenshot(t, takeScreenshot, 'navigate_to_first_cell_in_first_row_when_virtual_scrolling_and_columns_are_enabled_2.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(200, 35),
  columnWidth: 100,
  height: 500,
  width: 800,
  scrolling: {
    mode: 'virtual',
    showScrollbar: 'never',
    columnRenderingMode: 'virtual',
  },
}));

[true, false].forEach((useNative) => {
  test(`${useNative ? 'Native' : 'Simulated'} scrolling: Focus should be on the first focusable cell when pressing the Ctrl + Home key when row dragging, virtual scrolling and columns are enabled`, async (t) => {
    // arrange
    const dataGrid = new DataGrid('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    await t
      .expect(dataGrid.isReady())
      .ok();

    // act
    await focusDataCell(t, dataGrid, 0, 1);
    await t.pressKey('ctrl+end');
    await waitForKeyboardNavigation(t);

    // assert
    await expectDataCellFocusState(t, dataGrid, 199, 35);

    // act
    await focusDataCell(t, dataGrid, 199, 35);
    await t.pressKey('ctrl+home');
    await waitForKeyboardNavigation(t);

    // assert
    await expectDataCellFocusState(t, dataGrid, 0, 1);

    await testScreenshot(t, takeScreenshot, `${useNative ? 'native' : 'simulated'}_scrolling_-_navigate_to_first_cell_row_dragging__virtual_scrolling__virtual_columns.png`, { element: dataGrid.element });

    // assert
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxDataGrid', {
    dataSource: getData(200, 35),
    columnWidth: 100,
    height: 500,
    width: 800,
    scrolling: {
      mode: 'virtual',
      columnRenderingMode: 'virtual',
      useNative,
    },
    rowDragging: {
      allowReordering: true,
      showDragIcons: true,
    },
  }));

  test(`${useNative ? 'Native' : 'Simulated'} scrolling: Focus should be on the last focusable cell when pressing the Ctrl + Home key when row dragging, virtual scrolling and columns are enabled`, async (t) => {
    // arrange
    const dataGrid = new DataGrid('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    await t
      .expect(dataGrid.isReady())
      .ok();

    // act
    await focusDataCell(t, dataGrid, 0, 1);
    await t.pressKey('ctrl+end');
    await waitForKeyboardNavigation(t);

    await expectDataCellFocusState(t, dataGrid, 199, 34);
    await t
      .expect(dataGrid.isReady())
      .ok({ timeout: KEYBOARD_NAVIGATION_TIMEOUT });

    if (!useNative) {
      await t
        .expect(isScrollAtEnd('horizontal'))
        .ok({ timeout: KEYBOARD_NAVIGATION_TIMEOUT });
    }

    await waitForPaint();

    await testScreenshot(t, takeScreenshot, `${useNative ? 'native' : 'simulated'}_scrolling_-_navigate_to_last_cell_row_dragging__virtual_scrolling__virtual_columns.png`, { element: dataGrid.element });

    // assert
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxDataGrid', {
    dataSource: getData(200, 35),
    columnWidth: 100,
    height: 500,
    width: 800,
    scrolling: {
      mode: 'virtual',
      columnRenderingMode: 'virtual',
      useNative,
    },
    customizeColumns(columns) {
      columns.push({ type: 'drag' });
    },
    rowDragging: {
      allowReordering: true,
      showDragIcons: true,
    },
  }));
});
