import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';
import { changeTheme } from '../../helpers/changeTheme';
import { safeSizeTest } from '../../helpers/safeSizeTest';

fixture.disablePageReloads`Search Panel`
  .page(url(__dirname, '../container.html'));

// T1046688
safeSizeTest('searchPanel has correct view inside masterDetail', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');

  //  act
  await t.click(dataGrid.getDataRow(0).getCommandCell(0).element);

  const masterRow = dataGrid.getMasterRow(0);
  const masterGrid = masterRow.getDataGrid();

  // assert
  await t
    .expect(await takeScreenshot('T1046688.searchPanel.png', masterGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => {
  await changeTheme('material.blue.light');

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
}).after(async () => {
  await changeTheme('generic.light');
});
