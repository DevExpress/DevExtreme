import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { getData } from '../../helpers/generateDataSourceData';
import { groupingDataSource, groupingDataSourceFields } from '../helpers/data';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Sticky columns - Virtual Columns`
  .page(url(__dirname, '../../../container.html'));

test.meta({ browserSize: [800, 800] })('Fixed columns with sticky position should not work', async (t) => {
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
}).before(async () => createWidget('dxDataGrid', {
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

test('There should be no way to set a sticky fixed position for columns via the context menu', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t
    .rightClick(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3).element)
    .click(dataGrid.getContextMenu().getItemByText('Set Fixed Position'));

  // assert
  await takeScreenshot('context_menu_and_virtual_columns_with_fixed_columns.png');
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
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

test('should render group row in scroll right max position', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  // NOTE: Scroll to max right position
  await dataGrid.scrollTo(t, { x: 9999999 });

  await t.expect(dataGrid.isReady()).ok();
  await takeScreenshot('virtual_columns_with_grouping_scroll_right.png', dataGrid.element);
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: groupingDataSource,
  columns: [
    {
      dataField: 'groupFieldA',
      groupIndex: 0,
      fixed: true,
    },
    ...groupingDataSourceFields.map((dataField) => ({
      dataField,
      width: 100,
    })),
  ],
  groupPanel: {
    visible: true,
  },
  grouping: {
    autoExpandAll: true,
  },
  scrolling: {
    columnRenderingMode: 'virtual',
  },
  // NOTE: 3x columns (by 100px each) + 30px command column
  width: 330,
}));

test('should render nested group row in scroll right max position', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  // NOTE: Scroll to max right position
  await dataGrid.scrollTo(t, { x: 9999999 });

  await t.expect(dataGrid.isReady()).ok();
  await takeScreenshot('virtual_columns_with_nested_grouping_scroll_right.png', dataGrid.element);
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: groupingDataSource,
  columns: [
    {
      dataField: 'groupFieldA',
      groupIndex: 0,
      fixed: true,
    },
    {
      dataField: 'groupFieldB',
      groupIndex: 1,
      fixed: true,
    },
    ...groupingDataSourceFields.map((dataField) => ({
      dataField,
      width: 100,
    })),
  ],
  groupPanel: {
    visible: true,
  },
  grouping: {
    autoExpandAll: true,
  },
  scrolling: {
    columnRenderingMode: 'virtual',
  },
  // NOTE: 3x columns (by 100px each) + 30px command column
  width: 330,
}));

test('expand group icon should be clickable in scroll right max position', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  // NOTE: Scroll to max right position
  await dataGrid.scrollTo(t, { x: 9999999 });
  const expandCell = dataGrid.getGroupRow(1).getCell(0);
  await t.click(expandCell.element);

  await t.expect(dataGrid.isReady()).ok();
  await takeScreenshot('virtual_columns_with_grouping_expand_scroll_right.png', dataGrid.element);
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: groupingDataSource,
  columns: [
    {
      dataField: 'groupFieldA',
      groupIndex: 0,
      fixed: true,
    },
    ...groupingDataSourceFields.map((dataField) => ({
      dataField,
      width: 100,
    })),
  ],
  groupPanel: {
    visible: true,
  },
  grouping: {
    autoExpandAll: false,
  },
  scrolling: {
    columnRenderingMode: 'virtual',
    showScrollbar: 'never',
  },
  // NOTE: 3x columns (by 100px each) + 30px command column
  width: 330,
}));
