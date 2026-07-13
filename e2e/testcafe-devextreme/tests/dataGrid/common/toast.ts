import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture`Toasts in DataGrid`.page(
  url(__dirname, '../../container.html'),
);

const setToastDisplayTime = (displayTime: number) => ClientFunction(() => {
  (window as any).DevExpress.ui.dxToast.defaultOptions({
    displayTime,
  });
}, { dependencies: { displayTime } })();

test('Toast should be visible after calling and should be not visible after default display time', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(dataGrid.isReady())
    .ok();

  await setToastDisplayTime(100000);
  await dataGrid.apiShowErrorToast();

  await t.expect(dataGrid.getToast().exists).ok();
  await testScreenshot(t, takeScreenshot, 'ai-column__toast__at-the-right-position.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {});
});

test('Toast should hide after the display time', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .expect(dataGrid.isReady())
    .ok();

  await setToastDisplayTime(100);
  await dataGrid.apiShowErrorToast();
  await t
    .expect(dataGrid.getToast().exists).ok();

  await t
    .wait(150)
    .expect(dataGrid.getToast().exists).notOk();
}).before(async () => {
  await createWidget('dxDataGrid', {});
});
