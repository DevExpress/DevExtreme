import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { testScreenshot } from '../../../helpers/themeUtils';

const BUTTON_CLASS = 'dx-dropdowneditor-button';

fixture.disablePageReloads`Drop Down Box's Popup`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('Popup should have correct height when DropDownBox is opened first time (T1130045)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(`.${BUTTON_CLASS}`);

  await testScreenshot(t, takeScreenshot, 'Popup has correct height on the first opening.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 600]).before(async () => createWidget('dxDropDownBox', {
  dropDownOptions: {
    templatesRenderAsynchronously: true,
  },
  contentTemplate: '<div style="height: 400px"></div>',
}));
