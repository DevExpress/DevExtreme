import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`DataGrid deleted row height consistency T1286265`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';
const ROW_INDEX = 1;

// visual: generic.light
// visual: generic.light.compact
// visual: material.blue.light
// visual: material.blue.light.compact
// visual: fluent.blue.light
// visual: fluent.blue.light.compact
test('When DataGrid has fixed column row height should not change when marked as deleted - generic.light', async (t) => {
  // Arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  // Get the initial height of the row at index
  const initialRow = dataGrid.getDataRow(ROW_INDEX);
  const initialRowHeight = await initialRow.element.clientHeight;

  // Act - mark the row as deleted
  await dataGrid.apiDeleteRow(ROW_INDEX);

  // Assert - check if the row is marked as deleted
  await t
    .expect(dataGrid.getDataRow(ROW_INDEX).isRemoved)
    .ok('Row should be marked as deleted');

  // Get the height of the deleted row
  const deletedRow = dataGrid.getDataRow(ROW_INDEX);
  const deletedRowHeight = await deletedRow.element.clientHeight;

  // Assert - check if the height remains consistent
  await t
    .expect(deletedRowHeight)
    .eql(initialRowHeight, 'Row height should not change when marked as deleted');

  // Take a screenshot for visual verification
  await testScreenshot(t, takeScreenshot, 'datagrid-deleted-row-height-row-lines-and-fixed-column.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [
      { id: 1, name: 'John Smith' },
      { id: 2, name: 'Jane Johnson' },
      { id: 3, name: 'Mike Wilson' },
    ],
    keyExpr: 'id',
    height: 300,
    showBorders: true,
    showRowLines: true,
    columns: [
      { dataField: 'id', width: 50, fixed: true },
      { dataField: 'name', width: 150 },
    ],
    editing: {
      mode: 'batch',
      allowDeleting: true,
    },
  });
});

// visual: generic.light
// visual: generic.light.compact
// visual: material.blue.light
// visual: material.blue.light.compact
// visual: fluent.blue.light
// visual: fluent.blue.light.compact
test('When DataGrid doesn\'t have fixed column row height should not change when marked as deleted - generic.light', async (t) => {
  // Arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  // Get the initial height of the row at index
  const initialRow = dataGrid.getDataRow(ROW_INDEX);
  const initialRowHeight = await initialRow.element.clientHeight;

  // Act - mark the row as deleted
  await dataGrid.apiDeleteRow(ROW_INDEX);

  // Assert - check if the row is marked as deleted
  await t
    .expect(dataGrid.getDataRow(ROW_INDEX).isRemoved)
    .ok('Row should be marked as deleted');

  // Get the height of the deleted row
  const deletedRow = dataGrid.getDataRow(ROW_INDEX);
  const deletedRowHeight = await deletedRow.element.clientHeight;

  // Assert - check if the height remains consistent
  await t
    .expect(deletedRowHeight)
    .eql(initialRowHeight, 'Row height should not change when marked as deleted');

  // Take a screenshot for visual verification
  await testScreenshot(t, takeScreenshot, 'datagrid-deleted-row-height-row-lines-and-no-fixed-column.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [
      { id: 1, name: 'John Smith' },
      { id: 2, name: 'Jane Johnson' },
      { id: 3, name: 'Mike Wilson' },
    ],
    keyExpr: 'id',
    height: 300,
    showBorders: true,
    showRowLines: true,
    columns: [
      { dataField: 'id', width: 50 },
      { dataField: 'name', width: 150 },
    ],
    editing: {
      mode: 'batch',
      allowDeleting: true,
    },
  });
});

// visual: generic.light
// visual: generic.light.compact
// visual: material.blue.light
// visual: material.blue.light.compact
// visual: fluent.blue.light
// visual: fluent.blue.light.compact
test('When not showing row lines and not fixed any column row height should not change when marked as deleted - generic.light', async (t) => {
  // Arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  // Get the initial height of the row at index
  const initialRow = dataGrid.getDataRow(ROW_INDEX);
  const initialRowHeight = await initialRow.element.clientHeight;

  // Act - mark the row as deleted
  await dataGrid.apiDeleteRow(ROW_INDEX);

  // Assert - check if the row is marked as deleted
  await t
    .expect(dataGrid.getDataRow(ROW_INDEX).isRemoved)
    .ok('Row should be marked as deleted');

  // Get the height of the deleted row
  const deletedRow = dataGrid.getDataRow(ROW_INDEX);
  const deletedRowHeight = await deletedRow.element.clientHeight;

  // Assert - check if the height remains consistent
  await t
    .expect(deletedRowHeight)
    .eql(initialRowHeight, 'Row height should not change when marked as deleted');

  // Take a screenshot for visual verification
  await testScreenshot(t, takeScreenshot, 'datagrid-deleted-row-height-no-row-lines-and-no-fixed-column.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [
      { id: 1, name: 'John Smith' },
      { id: 2, name: 'Jane Johnson' },
      { id: 3, name: 'Mike Wilson' },
    ],
    keyExpr: 'id',
    height: 300,
    showBorders: true,
    showRowLines: false,
    columns: [
      { dataField: 'id', width: 50 },
      { dataField: 'name', width: 150 },
    ],
    editing: {
      mode: 'batch',
      allowDeleting: true,
    },
  });
});

// visual: generic.light
// visual: generic.light.compact
// visual: material.blue.light
// visual: material.blue.light.compact
// visual: fluent.blue.light
// visual: fluent.blue.light.compact
test('When not showing row lines and DataGrid has any column row height should not change when marked as deleted - generic.light', async (t) => {
  // Arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  // Get the initial height of the row at index
  const initialRow = dataGrid.getDataRow(ROW_INDEX);
  const initialRowHeight = await initialRow.element.clientHeight;

  // Act - mark the row as deleted
  await dataGrid.apiDeleteRow(ROW_INDEX);

  // Assert - check if the row is marked as deleted
  await t
    .expect(dataGrid.getDataRow(ROW_INDEX).isRemoved)
    .ok('Row should be marked as deleted');

  // Get the height of the deleted row
  const deletedRow = dataGrid.getDataRow(ROW_INDEX);
  const deletedRowHeight = await deletedRow.element.clientHeight;

  // Assert - check if the height remains consistent
  await t
    .expect(deletedRowHeight)
    .eql(initialRowHeight, 'Row height should not change when marked as deleted');

  // Take a screenshot for visual verification
  await testScreenshot(t, takeScreenshot, 'datagrid-deleted-row-height-no-row-lines-and-fixed-column.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [
      { id: 1, name: 'John Smith' },
      { id: 2, name: 'Jane Johnson' },
      { id: 3, name: 'Mike Wilson' },
    ],
    keyExpr: 'id',
    height: 300,
    showBorders: true,
    showRowLines: false,
    columns: [
      { dataField: 'id', width: 50, fixed: true },
      { dataField: 'name', width: 150 },
    ],
    editing: {
      mode: 'batch',
      allowDeleting: true,
    },
  });
});
