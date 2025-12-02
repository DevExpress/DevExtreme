import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`filterPanel`
  .page(url(__dirname, '../../container.html'));

// T1182854
test('editor\'s popup inside filterBuilder is opening & closing right (T1182854)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');

  const filterBuilder = (
    await dataGrid.getFilterPanel().openFilterBuilderPopup(t)
  ).getFilterBuilder();

  await testScreenshot(t, takeScreenshot, 'dataGrid-filterPanel-popup-focused.png');
  await t
    .expect(compareResults.isValid())
    .ok();

  await t.click(filterBuilder.getField().getValueText());
  await testScreenshot(t, takeScreenshot, 'dataGrid-filterPanel-popup.-with-editor-popup.png');
  await t
    .expect(compareResults.isValid())
    .ok();

  await t.click(filterBuilder.getField().getValueText());
  await testScreenshot(t, takeScreenshot, 'dataGrid-filterPanel-popup.png');
  await t
    .expect(compareResults.isValid())
    .ok();

  await t.click(filterBuilder.getField().getValueText());
  await testScreenshot(t, takeScreenshot, 'dataGrid-filterPanel-popup.-with-editor-popup.png');

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
