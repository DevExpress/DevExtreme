/* eslint-disable @typescript-eslint/require-await */
import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { getData } from '../helpers/generateDataSourceData';
import { makeRowsViewTemplatesAsync } from '../helpers/asyncTemplates';

fixture.disablePageReloads`State Storing`
  .page(url(__dirname, '../../container.html'));

const GRID_CONTAINER = '#container';

const makeLocalStorageJsonInvalid = ClientFunction(() => {
  window.localStorage.testStorageKey = '{]';
});

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
