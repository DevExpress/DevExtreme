import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Ai Column - Sticky columns.Visual`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

test('Check context menu items', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t
    .rightClick(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element)
    .click(dataGrid.getContextMenu().getItemByText('Set Fixed Position'));

  await takeScreenshot('datagrid__ai-column-and-sticky-columns__context-menu.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  width: 600,
  columnWidth: 200,
  columnFixing: {
    enabled: true,
  },
  columns: [
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'myAiColumn',
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));

test('Check context menu items when allowFixing is false', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.rightClick(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element);

  await takeScreenshot('datagrid__ai-column-and-sticky-columns__context-menu-when-allowFixing-false.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  width: 600,
  columnWidth: 200,
  columnFixing: {
    enabled: true,
  },
  columns: [
    {
      type: 'ai',
      caption: 'AI Column',
      allowFixing: false,
      name: 'myAiColumn',
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));
