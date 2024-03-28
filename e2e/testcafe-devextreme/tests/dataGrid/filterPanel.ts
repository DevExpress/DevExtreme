import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import DataGrid from 'devextreme-testcafe-models/dataGrid';

fixture.disablePageReloads`filterPanel`
  .page(url(__dirname, '../container.html'));

// T1182854
test('editor\'s popup inside filterBuilder is opening & closing right (T1182854)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');

  const filterBuilder = (
    await dataGrid.getFilterPanel().openFilterBuilderPopup(t)
  ).getFilterBuilder();

  await t.expect(await takeScreenshot('dataGrid-filterPanel-popup-focused.png')).ok();

  await t.click(filterBuilder.getField().getValueText());
  await t.expect(await takeScreenshot('dataGrid-filterPanel-popup.-with-editor-popup')).ok();

  await t.click(filterBuilder.getField().getValueText());
  await t.expect(await takeScreenshot('dataGrid-filterPanel-popup.png')).ok();

  await t.click(filterBuilder.getField().getValueText());
  await t.expect(await takeScreenshot('dataGrid-filterPanel-popup.-with-editor-popup')).ok();

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{ column1: 'first' }],
  columns: ['column1'],
  filterValue: ['column1', 'anyof', []],
  filterPanel: {
    visible: true,
  },
}));
