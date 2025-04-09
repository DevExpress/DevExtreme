import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture
  .disablePageReloads`Keyboard Navigation - Column Reordering`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

[true, false].forEach((rtlEnabled) => {
  test(`reorder column when ${rtlEnabled ? 'left' : 'right'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const firstHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);
    const shortcut = rtlEnabled ? 'ctrl+left' : 'ctrl+right';

    await t
      .click(firstHeaderCell.element)
      .pressKey(shortcut);

    await takeScreenshot(
      `reorder_column_to_${rtlEnabled ? 'left' : 'right'}_when_rtlEnabled_=_${rtlEnabled}`,
      dataGrid.element,
    );

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      rtlEnabled,
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
    });
  });

  test(`reorder column when ${rtlEnabled ? 'right' : 'left'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const lastHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);
    const shortcut = rtlEnabled ? 'ctrl+right' : 'ctrl+left';

    await t
      .click(lastHeaderCell.element)
      .pressKey(shortcut);

    await takeScreenshot(
      `reorder_column_to_${rtlEnabled ? 'right' : 'left'}_when_rtlEnabled_=_${rtlEnabled}`,
      dataGrid.element,
    );

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      rtlEnabled,
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
    });
  });
});
