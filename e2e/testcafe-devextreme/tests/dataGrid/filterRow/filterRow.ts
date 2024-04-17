import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import FilterTextBox from 'devextreme-testcafe-models/dataGrid/editors/filterTextBox';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';
import { getNumberData } from '../helpers/generateDataSourceData';

fixture.disablePageReloads`FilterRow`
  .page(url(__dirname, '../../container.html'));

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

test('FilterRow range overlay screenshot', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const filterEditor = dataGrid.getFilterEditor(1, FilterTextBox);

  await t
    .click(filterEditor.menuButton);
  await t
    .click(filterEditor.menu.getItemByText('Between'))
    // act
    .expect(await takeScreenshot('filter-row-overlay.png', dataGrid.element))
    .ok()
    // assert
    .expect(dataGrid.getFilterRangeOverlay().exists)
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getNumberData(20, 2),
  height: 400,
  showBorders: true,
  filterRow: {
    visible: true,
    applyFilter: 'auto',
  },
}));
