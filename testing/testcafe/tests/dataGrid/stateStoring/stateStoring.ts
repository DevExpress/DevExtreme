import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DataGrid from '../../../model/dataGrid';

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
