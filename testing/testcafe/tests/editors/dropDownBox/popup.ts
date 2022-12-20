import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';

const BUTTON_CLASS = 'dx-dropdowneditor-button';

fixture`Drop Down Button's Popup`
  .page(url(__dirname, '../../container.html'));

test('Popup should have correct height when DropDownBox is opend first time (T1130045)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(`.${BUTTON_CLASS}`)
    .expect(await takeScreenshot('popup_has_correct_height.png', '#container'))
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
