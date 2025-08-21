import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { getData } from '../../helpers/generateDataSourceData';
import { makeRowsViewTemplatesAsync } from '../../helpers/asyncTemplates';

fixture.disablePageReloads`State Storing`
  .page(url(__dirname, '../../../container.html'));

const GRID_CONTAINER = '#container';

const makeLocalStorageJsonInvalid = ClientFunction(() => {
  window.localStorage.testStorageKey = '{]';
});

const dataGridConfig = {
  dataSource: [
    { id: 0, text: 'item 1' },
    { id: 1, text: 'item 2' },
    { id: 2, text: 'item 3' },
    { id: 3, text: 'item 4' },
  ],
  columnFixing: {
    enabled: true,
  },
  keyExpr: 'id',
  stateStoring: {
    enabled: true,
  },
  scrolling: {
    mode: 'virtual' as any,
  },
  customizeColumns(columns) {
    columns[0].fixed = true;
    columns[0].fixedPosition = 'sticky';
  },
};

test('The Grid should load if JSON in localStorage is invalid and stateStoring enabled', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const secondCell = dataGrid.getDataCell(1, 1);
  const consoleMessages = await t.getBrowserConsoleMessages();

  await t.expect(secondCell.element().innerText).eql('5');
  const isWarningExist = !!consoleMessages.warn.find((message) => message.startsWith('W1022'));
  await t.expect(isWarningExist).ok();
}).before(async () => {
  await makeLocalStorageJsonInvalid();
  await createWidget('dxDataGrid', {
    dataSource: [
      { A: 1, B: 2, C: 3 },
      { A: 4, B: 5, C: 6 },
      { A: 7, B: 8, C: 9 },
    ],
    stateStoring: {
      enabled: true,
      storageKey: 'testStorageKey',
    },
  });
});

// T1188828
test('The rows should render correctly when cellTemplates are used and the selectedRowKeys array contains an invalid key', async (t) => {
  // arrange
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(await takeScreenshot('T1188828-state-storing-with-selected-row-keys.png', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    height: 800,
    renderAsync: false,
    // @ts-expect-error private option
    templatesRenderAsynchronously: true,
    dataSource: getData(1000, 1),
    columns: [
      {
        dataField: 'field_0',
        cellTemplate: (_, { value }) => ($('<div/>') as any).text(value),
      },
    ],
    stateStoring: {
      enabled: true,
      type: 'custom',
      customLoad: () => Promise.resolve({
        selectedRowKeys: ['key-invalid'],
      }),
    },
    paging: { pageSize: 50 },
    scrolling: {
      rowRenderingMode: 'virtual',
    },
  });

  // simulating async rendering in React
  await makeRowsViewTemplatesAsync(GRID_CONTAINER);
});

test('The focused state of a row with the 0 key should be restored (T1252962)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const dataRow0 = dataGrid.getDataRow(0);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(dataRow0.isFocusedRow)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0, text: 'item 1' },
    { id: 1, text: 'item 2' },
  ],
  keyExpr: 'id',
  focusedRowEnabled: true,
  stateStoring: {
    enabled: true,
    type: 'custom',
    customLoad() {
      return Promise.resolve({
        focusedRowKey: 0,
      });
    },
  },
}));

test('DataGrid - Cannot read properties of undefined (reading \'done\') error occurs when column fixing and state storing are used (T1283168)', async (t) => {
  await t.eval(() => location.reload());
  await createWidget('dxDataGrid', { ...dataGridConfig });

  /*
    DataGrid is expected to load normally with the given configuration,
    so no other checks are required.
  */
}).before(async () => {
  await createWidget('dxDataGrid', { ...dataGridConfig });
});

test('DataGrid - The filterType property is reset if client state storing contains no filtering settings (T1296608)', async (t) => {
  const dataGrid = new DataGrid('#container');

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(dataGrid.getDataCell(0, 0).element().innerText)
    .eql('1');
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [
      { id: 0, textID: '0', text: 'item 0' },
      { id: 1, textID: '1', text: 'item 1' },
    ],
    keyExpr: 'id',
    filterSyncEnabled: true,
    columns: [
      {
        dataField: 'id',
        caption: 'ID',
        dataType: 'string',
      },
      {
        dataField: 'textID',
        filterType: 'exclude',
        name: 'textID',
        dataType: 'string',
        filterValues: ['0'],
      },
    ],
    stateStoring: {
      enabled: true,
      type: 'custom',
      customLoad() {
        return Promise.resolve({
          columns: [
            {
              dataField: 'id',
            },
            {
              dataField: 'textID',
            },
          ],
        });
      },
    },
  });
});
