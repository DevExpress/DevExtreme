import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

const BUTTON_CLASS = 'dx-dropdowneditor-button';

fixture`Drop Down Box's Popup`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('Popup should have correct height when DropDownBox is opened first time (T1130045)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(`.${BUTTON_CLASS}`)
    .expect(await takeScreenshot('popup_has_correct_height.png'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.resizeWindow(900, 600);

  await createWidget('dxDropDownBox', {
    dropDownOptions: {
      templatesRenderAsynchronously: true,
    },
    contentTemplate: '<div style="height: 400px"></div>',
  });
});
