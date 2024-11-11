import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { getData } from '../helpers/generateDataSourceData';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Sticky columns - Virtual Columns`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('Fixed columns with sticky position should not work', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  await takeScreenshot('virtual_columns_with_sticky_columns_1.png', dataGrid.element);

  // act
  await dataGrid.scrollTo(t, { x: 150 });

  await takeScreenshot('virtual_columns_with_sticky_columns_2.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(10, 100),
  columnWidth: 100,
  showColumnLines: true,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
  customizeColumns(columns) {
    columns[0].fixed = true;
    columns[1].fixed = true;

    columns[3].fixed = true;
    columns[3].fixedPosition = 'sticky';
  },
}));

safeSizeTest('There should be no way to set a sticky fixed position for columns via the context menu', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t
    .rightClick(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3).element)
    .click(dataGrid.getContextMenu().getItemByOrder(4));

  // assert
  await takeScreenshot('context_menu_and_virtual_columns_with_fixed_columns.png', dataGrid.element);
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(10, 100),
  columnWidth: 100,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
  columnFixing: {
    enabled: true,
  },
  customizeColumns(columns) {
    columns[0].fixed = true;
    columns[1].fixed = true;
  },
}));
