import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DataGrid from '../../../model/dataGrid';
import { makeColumnHeadersViewTemplatesAsync } from '../helpers/asyncTemplates';

fixture.disablePageReloads`Grouping Panel`
  .page(url(__dirname, '../../container.html'));

const DATA_GRID_SELECTOR = '#container';

test('Grouping Panel label should not overflow in a narrow grid (T1103925)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');

  await t
    .expect(await takeScreenshot('groupingPanel', dataGrid.getToolbar()))
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
    templatesRenderAsynchronously: true,
    columns: [
      { dataField: 'field1', headerCellTemplate: (_, { column }) => $('<div>').text(column.caption) },
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
    columns: [
      { dataField: 'field1', headerCellTemplate: (_, { column }) => $('<div>').text(column.caption) },
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
