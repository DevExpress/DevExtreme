import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import CheckBox from 'devextreme-testcafe-models/checkBox';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`Selection`
  .page(url(__dirname, '../../container.html'));

test('selectAll state should be correct after unselect item if refresh(true) is called inside onSelectionChanged (T1048081)', async (t) => {
  const dataGrid = new DataGrid('#container');

  const firstRowSelectionCheckBox = new CheckBox(dataGrid.getDataCell(0, 0).getEditor().element);
  const selectAllCheckBox = new CheckBox(
    dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).getEditor().element,
  );

  // act
  await t.click(firstRowSelectionCheckBox.element);
  // assert
  await t
    .expect(await selectAllCheckBox.option('value')).eql(undefined)
    .expect(await firstRowSelectionCheckBox.option('value')).eql(false);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
  ],
  keyExpr: 'id',
  selectedRowKeys: [1, 2],
  paging: {
    pageSize: 3,
  },
  selection: {
    mode: 'multiple',
  },
  onSelectionChanged(e) {
    e.component.refresh(true);
  },
}));

// T1141405
test('The Select All checkbox should be visible when a column headerCellTemplate is specified (React)', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // assert
  await testScreenshot(t, takeScreenshot, 'T1141405-grid-select-all.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await createWidget('dxDataGrid', {
    dataSource: [...new Array(2)].map((_, index) => ({ id: index, text: `item ${index}` })),
    renderAsync: false,
    // @ts-expect-error private option
    templatesRenderAsynchronously: true,
    loadingTimeout: 200,
    columns: [
      { dataField: 'id', headerCellTemplate: '#test' },
      { dataField: 'text' },
    ],
    selection: {
      mode: 'multiple',
    },
  });

  // simulating async rendering in React
  await ClientFunction(() => {
    const dataGrid = ($('#container') as any).dxDataGrid('instance');

    // eslint-disable-next-line no-underscore-dangle
    dataGrid.getView('columnHeadersView')._templatesCache = {};

    // eslint-disable-next-line no-underscore-dangle
    dataGrid._getTemplate = () => ({
      render(options) {
        setTimeout(() => {
          $(options.container).html('<div>Custom  header template</div>');
          options.deferred?.resolve();
        }, 100);
      },
    });
  })();

  await t.wait(300);
});

// T1214734
test('Select rows by shift should work when grid has real time updates', async (t) => {
  const dataGrid = new DataGrid('#container');
  const secondRow = dataGrid.getDataRow(1);
  const seventhRow = dataGrid.getDataRow(6);
  const checkRowSelectionStates = async (startRowIndex: number, endRowIndex: number) => {
    for (let i = startRowIndex; i <= endRowIndex; i += 1) {
      await t
        .expect(dataGrid.getDataRow(i).isSelected)
        .ok();
    }
  };

  // act
  await t
    .click(secondRow.element);

  // assert
  await checkRowSelectionStates(1, 1);
  await t
    .expect(dataGrid.getDataCell(2, 3).element.textContent)
    .eql('test123');

  // act
  await t.click(seventhRow.element, { modifiers: { shift: true } });

  // assert
  await checkRowSelectionStates(1, 6);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: {
    store: {
      data: [...new Array(50)].map((_, i) => ({
        ID: i + 1,
        CompanyName: `company name ${i + 1}`,
        City: `city ${i + 1}`,
      })),
      type: 'array',
      key: 'ID',
    },
    reshapeOnPush: true,
    pushAggregationTimeout: 0,
  },
  height: 600,
  repaintChangesOnly: true,
  selection: {
    mode: 'multiple',
  },
  onSelectionChanged(e) {
    e.component.getDataSource().store().push([{
      type: 'update',
      key: 3,
      data: {
        City: 'test123',
      },
    }]);
  },
  columnAutoWidth: true,
  showBorders: true,
  paging: {
    pageSize: 10,
  },
}));

// --- T1234676 ---

const data = [
  { ID: 'aaa', Name: 'Name 1' },
  { ID: 'AAA', Name: 'Name 2' },
  { ID: 'BBB', Name: 'Name 3' },
];
const DATA_GRID_SELECTOR = '#container';
(['base', undefined] as ('base' | undefined)[]).forEach((sensitivity) => {
  test(`Deferred selection should work correctly with deferred sensitivity: ${sensitivity}`, async (t) => {
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const checkBoxCell = dataGrid.getDataCell(0, 0);
    const firstRow = dataGrid.getDataRow(0);
    const secondRow = dataGrid.getDataRow(1);

    await t.click(checkBoxCell.element);

    await t
      .expect(firstRow.isSelected).ok()
      .expect(secondRow.isSelected).ok();
  }).before(() => createWidget('dxDataGrid', {
    dataSource: data,
    keyExpr: 'ID',
    columns: ['ID', 'Name'],
    showBorders: true,
    selection: {
      mode: 'multiple',
      deferred: true,
      sensitivity,
    },
  }));
});

test('Deferred selection should work correctly with deferred sensitivity: \'case\'', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const checkBoxCell = dataGrid.getDataCell(0, 0);
  const firstRow = dataGrid.getDataRow(0);
  const secondRow = dataGrid.getDataRow(1);

  await t.click(checkBoxCell.element);

  await t
    .expect(firstRow.isSelected).ok()
    .expect(secondRow.isSelected).notOk();
}).before(() => createWidget('dxDataGrid', {
  dataSource: data,
  keyExpr: 'ID',
  columns: ['ID', 'Name'],
  showBorders: true,
  selection: {
    mode: 'multiple',
    deferred: true,
    sensitivity: 'case',
  },
}));

test('Sensitivity option change should be correctly handled during runtime change', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const checkBoxCell = dataGrid.getDataCell(0, 0);
  const firstRow = dataGrid.getDataRow(0);
  const secondRow = dataGrid.getDataRow(1);

  await t.click(checkBoxCell.element);

  await t
    .expect(firstRow.isSelected).ok()
    .expect(secondRow.isSelected).ok();

  await dataGrid.apiChangeSensitivity('case');

  await t
    .expect(firstRow.isSelected).notOk()
    .expect(secondRow.isSelected).notOk();

  await t.click(checkBoxCell.element);

  await t
    .expect(firstRow.isSelected).ok()
    .expect(secondRow.isSelected).notOk();
}).before(() => createWidget('dxDataGrid', {
  dataSource: data,
  keyExpr: 'ID',
  columns: ['ID', 'Name'],
  showBorders: true,
  selection: {
    mode: 'multiple',
    deferred: true,
    sensitivity: 'base',
  },
}));

// ---

test('"Select All" checkbox should not react when not visible', async (t) => {
  const dataGrid = new DataGrid('#container');

  const selectAllCheckBox = new CheckBox(
    dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).getEditor().element,
  );
  const editorCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element;

  await t.expect(await selectAllCheckBox.option('visible')).notOk();

  await t.click(editorCell);

  await t.expect(await selectAllCheckBox.option('visible')).notOk();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [],
  keyExpr: 'orderId',
  selection: {
    mode: 'multiple',
  },
  paging: {
    pageSize: 10,
  },
  pager: {
    visible: true,
  },
  filterRow: {
    visible: true,
  },
  columns: [{
    dataField: 'orderId',
    caption: 'Order ID',
    width: 90,
  },
  'city', {
    dataField: 'country',
    width: 180,
  },
  'region', {
    dataField: 'date',
    dataType: 'date',
  }, {
    dataField: 'amount',
    format: 'currency',
    width: 90,
  }],
}));

test('"Deselect all" should work after changing showCheckboxMode', async (t) => {
  const dataGrid = new DataGrid('#container');

  await dataGrid.option('selection.showCheckBoxesMode', 'onClick');

  const selectAllCheckBox = new CheckBox(
    dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).getEditor().element,
  );

  await t.click(selectAllCheckBox.element); // select all
  await t.click(selectAllCheckBox.element); // deselect all

  await t
    .expect(selectAllCheckBox.option('value'))
    .eql(false);

  for (let i = 0; i < 7; i += 1) {
    await t
      .expect(dataGrid.getDataRow(i).isSelected)
      .notOk();
  }
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 },
  ],
  keyExpr: 'a',
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'always',
  },
  selectedRowKeys: [1, 2],
}));
