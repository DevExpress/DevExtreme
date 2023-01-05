import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { changeTheme } from '../../../helpers/changeTheme';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { getThemePostfix } from '../../../helpers/themeUtils';

const stylingMods = ['outlined', 'underlined', 'filled'];
const themes = ['generic.light', 'material.blue.light'];

fixture`DateBox_Label`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

themes.forEach((theme) => {
  stylingMods.forEach((stylingMode) => {
    test(`Symbol parts in label should not be cropped with stylingMode=${stylingMode}`, async (t) => {
      await t.expect(await compareScreenshot(t, `Datebox label symbols with stylingMode=${stylingMode}${getThemePostfix(theme)}.png`)).ok();
    }).before(async (t) => {
      await t.resizeWindow(300, 400);
      await changeTheme(theme);

      return createWidget('dxDateBox', {
        label: 'qwerty QWERTY 1234567890',
        stylingMode,
        value: new Date(1900, 0, 1),
      });
    });
  });
});
