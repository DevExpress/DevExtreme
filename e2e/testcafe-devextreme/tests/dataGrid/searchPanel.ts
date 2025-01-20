import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { changeTheme } from '../../helpers/changeTheme';
import { Themes } from '../../helpers/themes';
import { safeSizeTest } from '../../helpers/safeSizeTest';

fixture.disablePageReloads`Search Panel`
  .page(url(__dirname, '../container.html'));

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
}, [800, 800]).before(async () => {
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

// T1272535
safeSizeTest('Base sensitivity search should accept rows with accent letters in lookup columns', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .click(dataGrid.getSearchBox().input)
    .pressKey('a');

  await t.expect(dataGrid.dataRows.count).eql(2);
  await t.expect(dataGrid.dataRows.withText('another').exists).ok();
  await t.expect(dataGrid.dataRows.withText('ánother').exists).ok();
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
  dataSource: {
    store: [
      { id: 1, text: 'tešt', lookup: 1 },
      { id: 2, text: 'test', lookup: 2 },
      { id: 3, text: 'chest', lookup: 3 },
    ],
    langParams: {
      locale: 'en-US',
      collatorOptions: {
        sensitivity: 'base',
      },
    },
  },
  keyExpr: 'id',
  searchPanel: { visible: true },
  columns: ['id', 'text', {
    dataField: 'lookup',
    lookup: {
      dataSource: [
        { id: 1, text: 'another' },
        { id: 2, text: 'ánother' },
        { id: 3, text: 'other' },
      ],
      valueExpr: 'id',
      displayExpr: 'text',
    },
  }],
}));
