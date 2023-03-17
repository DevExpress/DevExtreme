import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';
import { changeTheme } from '../../helpers/changeTheme';

fixture`FilterRow`
  .page(url(__dirname, '../container.html'));

test('Filter row\'s height should be adjusted by content (T1072609)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('T1072609-material.blue.light', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme('material.blue.light');

  return createWidget('dxDataGrid', {
    columns: [{
      dataField: 'Date',
      dataType: 'date',
      width: 140,
      selectedFilterOperation: 'between',
      filterValue: [new Date(2022, 2, 28), new Date(2022, 2, 29)],
    }],
    filterRow: { visible: true },
    wordWrapEnabled: true,
    showBorders: true,
  });
}).after(async () => {
  await changeTheme('generic.light');
});
