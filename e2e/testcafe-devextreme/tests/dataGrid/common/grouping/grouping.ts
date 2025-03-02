import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { makeColumnHeadersViewTemplatesAsync } from '../helpers/asyncTemplates';

fixture.disablePageReloads`Grouping Panel`
  .page(url(__dirname, '../../container.html'));

const DATA_GRID_SELECTOR = '#container';

test('Grouping Panel label should not overflow in a narrow grid (T1103925)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');

  await t
    .expect(await takeScreenshot('groupingPanel', dataGrid.getToolbar().element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: {
    store: [
      {
        field1: '1', field2: '2', field3: '3', field4: '4', field5: '5',
      },
      {
        field1: '11', field2: '22', field3: '33', field4: '44', field5: '55',
      }],
  },
  width: 200,
  groupPanel: {
    emptyPanelText: 'Long long long long long long long long long long long text',
    visible: true,
  },
  editing: { allowAdding: true, mode: 'batch' },
  columnChooser: {
    enabled: true,
  },
}));

// T1112573
test('Content should be rendered correctly after setting the grouping.autoExpandAll property to true when dataRowTemplate is given', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  await dataGrid.apiExpandAllGroups();

  await t
    .wait(100)
    .expect(await takeScreenshot('expanded-groups-content', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    {
      field1: '1', field2: 'test1',
    },
    {
      field1: '2', field2: 'test1',
    },
    {
      field1: '3', field2: 'test2',
    },
  ],
  width: 700,
  columns: [
    'field1',
    { dataField: 'field2', groupIndex: 0 },
  ],
  dataRowTemplate(container, { data }) {
    return $(container).append($(`<tr><td>${data.field1}</td></tr>`));
  },
  groupPanel: {
    visible: true,
  },
  grouping: {
    autoExpandAll: false,
  },
}));

// T1112573
test('Content should be rendered correctly after setting the grouping.autoExpandAll property to true when dataRowTemplate is given', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  await dataGrid.apiExpandAllGroups();

  await t
    .wait(100)
    .expect(await takeScreenshot('expanded-groups-content', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    {
      field1: '1', field2: 'test1',
    },
    {
      field1: '2', field2: 'test1',
    },
    {
      field1: '3', field2: 'test2',
    },
  ],
  width: 700,
  columns: [
    'field1',
    { dataField: 'field2', groupIndex: 0 },
  ],
  dataRowTemplate(container, { data }) {
    return $(container).append($(`<tr><td>${data.field1}</td></tr>`));
  },
  groupPanel: {
    visible: true,
  },
  grouping: {
    autoExpandAll: false,
  },
}));

// T1155453
test('Headers should be rendered correctly after changing the grouping.autoExpandAll when headerCellTemplate is given (React)', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  await takeScreenshot('T1155453-expanded-groups', dataGrid.element);

  // act
  await dataGrid.apiCollapseAllGroups();
  await t.wait(100);

  await takeScreenshot('T1155453-collapsed-groups', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [
      {
        field1: '1', field2: 'test1',
      },
      {
        field1: '2', field2: 'test1',
      },
      {
        field1: '3', field2: 'test2',
      },
    ],
    width: 700,
    renderAsync: false,
    // @ts-expect-error private option
    templatesRenderAsynchronously: true,
    columns: [
      { dataField: 'field1', headerCellTemplate: (_, { column }) => $('<div>').text(column.caption as string) },
      { dataField: 'field2', groupIndex: 0 },
    ],
    groupPanel: {
      visible: true,
    },
    grouping: {
      autoExpandAll: true,
    },
  });

  await makeColumnHeadersViewTemplatesAsync(DATA_GRID_SELECTOR);
});

// T1155453
test('Headers should be rendered correctly after changing the grouping.autoExpandAll when there is fixed column and headerCellTemplate is given (React)', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  await takeScreenshot('T1155453-expanded-groups-with-fixed-content', dataGrid.element);

  // act
  await dataGrid.apiCollapseAllGroups();
  await t.wait(200);

  await takeScreenshot('T1155453-collapsed-groups-with-fixed-content', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [
      {
        field1: '1', field2: 'test1', field3: 'test11',
      },
      {
        field1: '2', field2: 'test1', field3: 'test12',
      },
      {
        field1: '3', field2: 'test2', field3: 'test13',
      },
    ],
    width: 700,
    renderAsync: false,
    templatesRenderAsynchronously: true,
    columnFixing: {
      // @ts-expect-error private option
      legacyMode: true,
    },
    columns: [
      { dataField: 'field1', headerCellTemplate: (_, { column }) => $('<div>').text(column.caption as string) },
      { dataField: 'field2', groupIndex: 0 },
      { dataField: 'field3', fixed: true },
    ],
    groupPanel: {
      visible: true,
    },
    grouping: {
      autoExpandAll: true,
    },
  });

  await makeColumnHeadersViewTemplatesAsync(DATA_GRID_SELECTOR);
});

safeSizeTest('Empty header message should appear when all columns grouped and selection is enabled', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');

  await takeScreenshot('empty-header-message-with-selection-enabled', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [
      {
        field1: '1', field2: 'test1', field3: 'test11',
      },
      {
        field1: '2', field2: 'test1', field3: 'test12',
      },
      {
        field1: '3', field2: 'test2', field3: 'test13',
      },
    ],
    columns: [
      { dataField: 'field1', groupIndex: 0 },
      { dataField: 'field2', groupIndex: 1 },
      { dataField: 'field3', groupIndex: 2 },
    ],
    groupPanel: {
      visible: true,
    },
    selection: {
      mode: 'multiple',
    },
  });
});

test('Group panel message should be vertically aligned (T1186613)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  await t
    .expect(await takeScreenshot('group-panel-message-align.png', dataGrid.getToolbar().element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  groupPanel: {
    visible: true,
  },
  showBorders: true,
  searchPanel: {
    visible: true,
  },
  editing: {
    allowAdding: true,
  },
  toolbar: {
    items: [
      'groupPanel',
      {
        showText: 'always',
        location: 'before',
        name: 'addRowButton',
        options: {
          icon: null,
          text: 'add a new row',
        },
      }, {
        location: 'before',
        widget: 'dxTextBox',
        options: {
          width: 140,
          text: 'TestTest',
        },
      },
    ],
  },
}));

test('The collapse icon should update if repaintChangesOnly option is enabled (T1201981)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  await t
    .click(dataGrid.getPager().getNavPage('2').element)
    .expect(await takeScreenshot('continued_group-collapse_icon-T1201981.png', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    {
      field1: '1', field2: 'test1', field3: 'test11',
    },
    {
      field1: '2', field2: 'test1', field3: 'test12',
    },
    {
      field1: '3', field2: 'test2', field3: 'test13',
    },
  ],
  repaintChangesOnly: true,
  columns: [
    {
      dataField: 'field1',
      groupIndex: 0,
    },
    'field2',
    'field3',
  ],
  groupPanel: {
    visible: true,
  },
  paging: {
    pageSize: 3,
  },
  showBorders: true,
}));

const customersT1232129 = [
  {
    id: 1,
    number: 2,
    description: 'Material Description',
    groupId: '',
    articleGroup: 'Material',
  },
];
test('DataGrid loses grouping after the expandAll method if a grouped column has calculateDisplayValue (T1232129)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await dataGrid.apiExpandAll();
  await t
    .expect(dataGrid.apiColumnOption('groupId', 'groupIndex'))
    .eql(0);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: customersT1232129,
  keyExpr: 'id',
  showBorders: true,
  grouping: {
    autoExpandAll: false,
  },
  columns: [
    'number',
    'description',
    {
      dataField: 'groupId',
      calculateDisplayValue: 'articleGroup',
      groupIndex: 0,
    },
  ],
}));

test('Grouping and filtering should be applied correctly when they change at runtime (T1237863)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.option({
    'columns[2].groupIndex': 0,
    filterValue: ['room', '=', '1'],
  });

  await t.expect(dataGrid.isReady()).ok();

  await takeScreenshot('T1237863_datagrid-grouping_and_filtering.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(() => createWidget('dxDataGrid', {
  dataSource: [
    {
      ID: 1,
      FirstName: 'Bob',
      room: 1,
    },
    {
      ID: 2,
      FirstName: 'Alex',
      room: 2,
    },
    {
      ID: 3,
      FirstName: 'John',
      room: 1,
    },
  ],
  keyExpr: 'ID',
}));
