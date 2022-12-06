import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';

const stylingMods = ['outlined', 'underlined', 'filled'];

fixture.disablePageReloads`DateBox_Label`
  .page(url(__dirname, '../../container.html'))
  .afterEach(() => disposeWidgets());

stylingMods.forEach((stylingMode) => {
  test(`Symbol parts in label should not be cropped with stylingMode=${stylingMode}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await takeScreenshotInTheme(t, takeScreenshot, `Datebox label symbols with stylingMode=${stylingMode}.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(300, 400);

    return createWidget('dxDateBox', {
      label: 'qwerty QWERTY 1234567890',
      stylingMode,
      value: new Date(1900, 0, 1),
    });
  });
});
