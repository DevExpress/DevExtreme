import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import FilterTextBox from 'devextreme-testcafe-models/dataGrid/editors/filterTextBox';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { getNumberData } from '../../helpers/generateDataSourceData';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture`FilterRow`
  .page(url(__dirname, '../../../container.html'));

test.meta({
  themes: ['material.blue.light'],
})('Filter row\'s height should be adjusted by content (T1072609)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'T1072609.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
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
}));

test('FilterRow range overlay screenshot', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const filterEditor = dataGrid.getFilterEditor(1, FilterTextBox);

  await t
    .click(filterEditor.menuButton);
  await t
    .click(filterEditor.menu.getItemByText('Between'));
  // act
  await testScreenshot(t, takeScreenshot, 'filter-row-overlay.png');
  await t
    .expect(compareResults.isValid())
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
  scrolling: {
    showScrollbar: 'never',
  },
}));

// T1287288
test('Focus overlay should be visible in filter row when focusedRowEnabled is enabled', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const filterEditor = dataGrid.getFilterEditor(1, FilterTextBox);

  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .click(filterEditor.input)
    // assert
    .expect(filterEditor.input.focused)
    .ok();
  await testScreenshot(t, takeScreenshot, 'filter-row-focus-overlay.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { ID: 1, Field: 'Item 1' },
    { ID: 2, Field: 'Item 2' },
    { ID: 3, Field: 'Item 3' },
  ],
  keyExpr: 'ID',
  focusedRowEnabled: true,
  filterRow: { visible: true },
  showBorders: true,
  columns: ['ID', 'Field'],
}));

test('DataGrid - The `between` filter dropdown sticks to the viewport edge during horizontal scrolling (T1280071)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const filterEditor = dataGrid.getFilterEditor(0, FilterTextBox);

  await dataGrid.isReady();

  await t
    .click(filterEditor.menuButton)
    .click(filterEditor.menu.getItemByText('Between'));

  await dataGrid.scrollBy(t, { x: 999 });
  await testScreenshot(t, takeScreenshot, 'filter-row-filter-range-hide-on-scroll.png');
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { ID: 1, Text: 'Item 1' },
    { ID: 2, Text: '' },
    { ID: 3, Text: 'Item 3' },
  ],
  keyExpr: 'ID',
  filterRow: {
    visible: true,
  },
  scrolling: {
    useNative: true,
  },
  columnWidth: 400,
  width: 500,
}));
