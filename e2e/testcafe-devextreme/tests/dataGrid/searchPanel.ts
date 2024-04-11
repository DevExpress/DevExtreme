import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import { createWidget, disposeWidgets } from '../../helpers/createWidget';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { changeTheme } from '../../helpers/changeTheme';
import { Themes } from '../../helpers/themes';
import { safeSizeTest } from '../../helpers/safeSizeTest';
import { clearTestPage } from '../../helpers/clearPage';

fixture.disablePageReloads`Search Panel`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => {await disposeWidgets(); await clearTestPage()});


// T1046688
safeSizeTest('searchPanel has correct view inside masterDetail', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');

  // act
  await t.click(dataGrid.getDataRow(0).getCommandCell(0).element);

  const masterRow = dataGrid.getMasterRow(0);
  const masterGrid = masterRow.getDataGrid();

  // assert
  await t
    .expect(await takeScreenshot('T1046688.searchPanel.png', masterGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).meta({unstable: true}).before(async () => {
  await changeTheme(Themes.materialBlue);

  return createWidget('dxDataGrid', {
    dataSource: [{ column1: 'first' }],
    columns: ['column1'],
    masterDetail: {
      enabled: true,
      template(container) {
        ($('<div>') as any)
          .dxDataGrid({
            searchPanel: {
              visible: true,
              width: 240,
              placeholder: 'Search...',
            },
            columns: ['detail1'],
            dataSource: [],
          })
          .appendTo(container);
      },
    },
  });
}).after(async () => { await changeTheme(Themes.genericLight); });
