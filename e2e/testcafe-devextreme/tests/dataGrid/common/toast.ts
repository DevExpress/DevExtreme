import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`Toasts in DataGrid`.page(
  url(__dirname, '../../container.html'),
);

test('Toast should be visible after calling and should be not visible after default display time', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await dataGrid.isReady();
  await dataGrid.apiShowErrorToast();
  await t.expect(dataGrid.getToast().exists).ok();
  await testScreenshot(t, takeScreenshot, 'ai-column__toast__at-the-right-position.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
  await t.expect(dataGrid.getToast().exists).notOk();
}).before(async () => {
  createWidget('dxDataGrid', {});
});
