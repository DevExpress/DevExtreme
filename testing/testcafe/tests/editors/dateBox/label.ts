import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { screenshotTestFn } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../navigation/helpers/domUtils';

const stylingModes = ['outlined', 'underlined', 'filled'];

fixture.disablePageReloads`DateBox_Label`
  .page(url(__dirname, '../../container.html'));

stylingModes.forEach((stylingMode) => {
  test(`Symbol parts in label should not be cropped with stylingMode=${stylingMode}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await screenshotTestFn(t, takeScreenshot, `Datebox label symbols with stylingMode=${stylingMode}.png`, '#container');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await appendElementTo('#container', 'div', 'dateBox');
    await setStyleAttribute(Selector('#container'), 'box-sizing: border-box; width: 300px; height: 400px; padding: 8px;');

    return createWidget('dxDateBox', {
      label: 'qwerty QWERTY 1234567890',
      stylingMode,
      value: new Date(1900, 0, 1),
    }, true, '#dateBox');
  });
});
