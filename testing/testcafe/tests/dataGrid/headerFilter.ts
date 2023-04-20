import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';
import { getData } from './helpers/generateDataSourceData';

fixture.disablePageReloads`Header Filter`
  .page(url(__dirname, '../container.html'));

test('HeaderFilter popup screenshot', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);
  const filterIconElement = headerCell.getFilterIcon();

  await t
    .click(filterIconElement)
    // act
    .expect(await takeScreenshot('header-filter-popup.png', dataGrid.element))
    .ok()
    // assert
    .expect(headerCell.getHeaderFilterMenu().exists)
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 2),
  height: 400,
  showBorders: true,
  headerFilter: {
    visible: true,
  },
}));
