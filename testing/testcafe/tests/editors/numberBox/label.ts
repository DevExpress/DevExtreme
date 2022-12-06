import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';

const stylingMods = ['outlined', 'underlined', 'filled'];

fixture.disablePageReloads`NumberBox_Label`
  .page(url(__dirname, '../../container.html'));

stylingMods.forEach((stylingMode) => {
  test(`Label for dxNumberBox stylingMode=${stylingMode}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await takeScreenshotInTheme(t, takeScreenshot, `NumberBox label with stylingMode=${stylingMode}.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(300, 400);

    const componentOption = {
      label: 'label text',
      stylingMode,
    };

    await createWidget('dxNumberBox', {
      ...componentOption,
      value: 'text',
    });

    return createWidget('dxNumberBox', {
      ...componentOption,
      value: 123,
    }, true, '#otherContainer');
  });
});
