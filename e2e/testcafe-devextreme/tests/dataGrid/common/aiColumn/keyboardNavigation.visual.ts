import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Ai Column.KeyboardNavigation.Visual`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

test('Check keyboard navigation for AI column', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.click(headerRow.getHeaderCell(0).element);
  await t.pressKey('tab');

  // assert
  await t.expect(headerRow.getCommandCell(1).element.focused).ok();

  // act
  await t.pressKey('tab');

  // assert
  await t.expect(headerRow.getCommandCell(1).getAIDropDownButton().isFocused).ok();

  await testScreenshot(t, takeScreenshot, 'datagrid__ai-column__focused-dropdown-button.png', { element: dataGrid.element });

  // act
  await t.pressKey('tab');

  // assert
  await t
    .expect(headerRow.getHeaderCell(2).isFocused)
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  allowColumnReordering: true,
  columnWidth: 200,
  columns: [
    { dataField: 'id', caption: 'ID' },
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'myAiColumn',
    },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));
