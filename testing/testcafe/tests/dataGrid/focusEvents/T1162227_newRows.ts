import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import DataGrid from '../../../model/dataGrid';
import { CallbackTestHelper, WindowCallbackExtended } from '../../../helpers/callbackTestHelper';

// TODO: Something wrong with test cleanup with 'disablePageReloads'
//       old events from previous test still alive on the next test case run
//       So, we should disable it for these tests until this problem exists.
fixture`Focused row - new rows T1162227`
  .page(url(__dirname, '../../container.html'));

type FocusCellChangingData =
  [[prevRowIdx: number, prevColumnIdx: number], [rowIdx: number, columnIdx: number]];
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

test('It should fire events after new rows were added', async (t) => {
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

  const dataGrid = new DataGrid(GRID_SELECTOR);
  const addRowBtn = dataGrid.getToolbar().getItem();

  await t.click(addRowBtn)
    .click(addRowBtn)
    .click(addRowBtn);

  const [
    cellFocusChanging,
    cellFocusChanged,
    rowFocusChanging,
    rowFocusChanged,
  ] = await collectEventsCallbackResults();

  await t
    .expect(cellFocusChanging)
    .eql(expectedCellFocusChanging)
    .expect(cellFocusChanged)
    .eql(expectedCellFocusChanged)
    .expect(rowFocusChanging)
    .eql(expectedRowFocusChanging)
    .expect(rowFocusChanged)
    .eql(expectedRowFocusChanged);
}).before(async () => {
  await initCallbackTesting();
  await createWidget('dxDataGrid', {
    focusedRowEnabled: true,
    editing: {
      mode: 'batch',
      allowAdding: true,
      allowUpdating: true,
    },
    ...getGridDataConfig(4),
    ...getGridEventsConfig(),
  });
}).after(async () => {
  await clearCallbackTesting();
});

test('It should fire events when focus switch between existing and a new row', async (t) => {
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

  const dataGrid = new DataGrid(GRID_SELECTOR);
  const addRowBtn = dataGrid.getToolbar().getItem();
  const newCell = dataGrid.getDataCell(0, 0);
  const existingCell = dataGrid.getDataCell(1, 0);

  await t.click(addRowBtn)
    .click(existingCell.element)
    .click(newCell.element);

  const [
    cellFocusChanging,
    cellFocusChanged,
    rowFocusChanging,
    rowFocusChanged,
  ] = await collectEventsCallbackResults();

  await t
    .expect(cellFocusChanging)
    .eql(expectedCellFocusChanging)
    .expect(cellFocusChanged)
    .eql(expectedCellFocusChanged)
    .expect(rowFocusChanging)
    .eql(expectedRowFocusChanging)
    .expect(rowFocusChanged)
    .eql(expectedRowFocusChanged);
}).before(async () => {
  await initCallbackTesting();
  await createWidget('dxDataGrid', {
    focusedRowEnabled: true,
    editing: {
      mode: 'batch',
      allowAdding: true,
      allowUpdating: true,
    },
    ...getGridDataConfig(4),
    ...getGridEventsConfig(),
  });
}).after(async () => {
  await clearCallbackTesting();
});

test('It should not fire row events if focusedRowEnabled: false', async (t) => {
  const expectedCellFocusChanging: FocusCellChangingData[] = [
    [[-1, -1], [0, 0]], [[0, 0], [2, 0]], [[2, 0], [0, 0]],
  ];
  const expectedCellFocusChanged: FocusCellChangedData[] = [
    [0, 0], [2, 0], [0, 0],
  ];
  const expectedRowFocusChanging: FocusRowChangingData[] = [];
  const expectedRowFocusChanged: FocusRowChangedData[] = [];

  const dataGrid = new DataGrid(GRID_SELECTOR);
  const addRowBtn = dataGrid.getToolbar().getItem();
  const newCell = dataGrid.getDataCell(0, 0);
  const existingCell = dataGrid.getDataCell(1, 0);

  await t.click(addRowBtn)
    .click(existingCell.element)
    .click(newCell.element);

  const [
    cellFocusChanging,
    cellFocusChanged,
    rowFocusChanging,
    rowFocusChanged,
  ] = await collectEventsCallbackResults();

  await t
    .expect(cellFocusChanging)
    .eql(expectedCellFocusChanging)
    .expect(cellFocusChanged)
    .eql(expectedCellFocusChanged)
    .expect(rowFocusChanging)
    .eql(expectedRowFocusChanging)
    .expect(rowFocusChanged)
    .eql(expectedRowFocusChanged);
}).before(async () => {
  await initCallbackTesting();
  await createWidget('dxDataGrid', {
    focusedRowEnabled: false,
    editing: {
      mode: 'batch',
      allowAdding: true,
      allowUpdating: true,
    },
    ...getGridDataConfig(4),
    ...getGridEventsConfig(),
  });
}).after(async () => {
  await clearCallbackTesting();
});

test('It should fire rowChanged event on initialization if focusedRowKey options is set', async (t) => {
  const expectedRowFocusChanged: FocusRowChangedData[] = [
    [1],
  ];

  const [
    ,
    ,
    ,
    rowFocusChanged,
  ] = await collectEventsCallbackResults();

  await t
    .expect(rowFocusChanged)
    .eql(expectedRowFocusChanged);
}).before(async () => {
  await initCallbackTesting();
  await createWidget('dxDataGrid', {
    focusedRowKey: 1,
    focusedRowEnabled: true,
    editing: {
      mode: 'batch',
      allowAdding: true,
      allowUpdating: true,
    },
    ...getGridDataConfig(4),
    ...getGridEventsConfig(),
  });
}).after(async () => {
  await clearCallbackTesting();
});

// NOTE: It may not be logical, but it is the current prod version's behavior (23.1).
// (changing event fires after page change action).
test('It should fire correct events on page change', async (t) => {
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

  const dataGrid = new DataGrid(GRID_SELECTOR);
  const nextPage = dataGrid.getPager().getNavPage('2');

  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .click(nextPage.element)
    .click(dataGrid.getDataCell(2, 0).element);

  const [
    cellFocusChanging,
    cellFocusChanged,
    rowFocusChanging,
    rowFocusChanged,
  ] = await collectEventsCallbackResults();

  await t
    .expect(cellFocusChanging)
    .eql(expectedCellFocusChanging)
    .expect(cellFocusChanged)
    .eql(expectedCellFocusChanged)
    .expect(rowFocusChanging)
    .eql(expectedRowFocusChanging)
    .expect(rowFocusChanged)
    .eql(expectedRowFocusChanged);
}).before(async () => {
  await initCallbackTesting();
  await createWidget('dxDataGrid', {
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
    ...getGridEventsConfig(),
  });
}).after(async () => {
  await clearCallbackTesting();
});

test('It should fire row changed event and change page if focusedRowKey on another page', async (t) => {
  const expectedRowFocusChanged: FocusRowChangedData[] = [[1]];

  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.wait(100);

  const [
    ,
    ,
    ,
    rowFocusChanged,
  ] = await collectEventsCallbackResults();

  const cellText = await dataGrid.getDataCell(3, 0).element().innerText;

  await t
    .expect(rowFocusChanged)
    .eql(expectedRowFocusChanged)
    .expect(cellText)
    .eql('dataA_3');
}).before(async () => {
  await initCallbackTesting();
  await createWidget('dxDataGrid', {
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
    ...getGridEventsConfig(),
  });
}).after(async () => {
  await clearCallbackTesting();
});

test('After modification of newRowIndex / newCellIndex focused row and cell should be changed', async (t) => {
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

  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.click(dataGrid.getDataCell(0, 0).element);

  const [
    cellFocusChanging,
    cellFocusChanged,
    rowFocusChanging,
    rowFocusChanged,
  ] = await collectEventsCallbackResults();

  await t
    .expect(cellFocusChanging)
    .eql(expectedCellFocusChanging)
    .expect(cellFocusChanged)
    .eql(expectedCellFocusChanged)
    .expect(rowFocusChanging)
    .eql(expectedRowFocusChanging)
    .expect(rowFocusChanged)
    .eql(expectedRowFocusChanged);
}).before(async () => {
  await initCallbackTesting();
  await createWidget('dxDataGrid', {
    focusedRowEnabled: true,
    editing: {
      mode: 'batch',
      allowAdding: true,
      allowUpdating: true,
    },
    ...getGridDataConfig(4),
    ...getGridEventsConfig(),
    onFocusedCellChanging: (event) => {
      (window as WindowCallbackExtended)
        .clientTesting!
        .addCallbackResult('cellFocusChanging', [
          [event.prevRowIndex, event.prevColumnIndex], [event.newRowIndex, event.newColumnIndex],
        ]);

      event.newRowIndex = 3;
      event.newColumnIndex = 1;
    },
  });
}).after(async () => {
  await clearCallbackTesting();
});

test('It should be able to change focusedRowKey on "onContentReady"', async (t) => {
  const expectedRowFocusChanged: FocusRowChangedData[] = [[1], [3]];

  await t.wait(100);

  const [
    ,
    ,
    ,
    rowFocusChanged,
  ] = await collectEventsCallbackResults();

  await t
    .expect(rowFocusChanged)
    .eql(expectedRowFocusChanged);
}).before(async () => {
  await initCallbackTesting();
  await createWidget('dxDataGrid', {
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
    ...getGridDataConfig(4),
    ...getGridEventsConfig(),
  });
}).after(async () => {
  await clearCallbackTesting();
});
