import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { getData } from '../../helpers/generateDataSourceData';
import { testScreenshot } from '../../../../helpers/themeUtils';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Sticky columns - Drag and Drop`
  .page(url(__dirname, '../../../container.html'));

test('Fixed columns should work when drag and drop rows are enabled', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  await testScreenshot(t, takeScreenshot, 'datagrid_sticky_columns_with_drag_and_drop.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(10, 10),
  keyExpr: 'field_0',
  width: 500,
  columnFixing: {
    enabled: true,
  },
  showColumnHeaders: true,
  columnAutoWidth: true,
  rowDragging: {
    allowReordering: true,
    dropFeedbackMode: 'push',
  },
  customizeColumns(columns) {
    columns[5].fixed = true;
    columns[6].fixed = true;

    columns[8].fixed = true;
    columns[8].fixedPosition = 'right';
    columns[9].fixed = true;
    columns[9].fixedPosition = 'right';
  },
}));

test.meta({
  browserSize: [900, 800],
  themes: ['generic.light', 'material.blue.light'],
})('Drag icons keep vertical centering in focused and selected rows with fixed columns (T1303892)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getDataCell(1, 1).element);

  await testScreenshot(t, takeScreenshot, 'drag-icons-focused-selected-rows.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(10, 5),
  keyExpr: 'field_0',
  width: 500,
  columnFixing: {
    enabled: true,
  },
  focusedRowEnabled: true,
  selection: {
    mode: 'single',
  },
  showRowLines: false,
  showColumnHeaders: true,
  columnAutoWidth: true,
  rowDragging: {
    allowReordering: true,
  },
  scrolling: {
    showScrollbar: 'never',
  },
}));
