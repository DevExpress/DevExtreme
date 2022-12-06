import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import DateBox from '../../../model/dateBox';
import createWidget from '../../../helpers/createWidget';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';

fixture.disablePageReloads`DateBox ValidationMessagePosition`
  .page(url(__dirname, '../../container.html'));

const positions = ['top', 'right', 'bottom', 'left'];

positions.forEach((position) => {
  test(`DateBox ValidationMessage position is correct (${position})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const dateBox = new DateBox('#container');
    await dateBox.option('value', new Date(2022, 6, 14));

    await takeScreenshotInTheme(t, takeScreenshot, `Datebox validation message with position=${position}.png`, undefined, true, async () => dateBox.option('value', new Date(2022, 6, 15)));

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(300, 200);

    await createWidget('dxDateBox', {
      elementAttr: { style: 'margin: 50px 0 0 100px;' },
      width: 100,
      height: 40,
      validationMessageMode: 'always',
      validationMessagePosition: position,
    });

    return createWidget('dxValidator', {
      validationRules: [{
        type: 'range',
        max: new Date(1),
        message: 'out of range',
      }],
    });
  }).after(async (t) => {
    await restoreBrowserSize(t);
  });
});
