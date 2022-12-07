import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';
import { changeTheme } from '../../helpers/changeTheme';

fixture`Search Panel`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => disposeWidgets());

// T1046688
test('searchPanel has correct view inside masterDetail', async (t) => {
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
}).before(async () => {
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
});
