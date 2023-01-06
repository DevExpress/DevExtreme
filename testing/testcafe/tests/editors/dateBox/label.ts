import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { changeTheme } from '../../../helpers/changeTheme';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { getThemePostfix } from '../../../helpers/themeUtils';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

const stylingMods = ['outlined', 'underlined', 'filled'];
const themes = ['generic.light', 'material.blue.light'];

fixture`DateBox_Label`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

themes.forEach((theme) => {
  stylingMods.forEach((stylingMode) => {
    safeSizeTest(`Symbol parts in label should not be cropped with stylingMode=${stylingMode}`, async (t) => {
      await t.expect(await compareScreenshot(t, `Datebox label symbols with stylingMode=${stylingMode}${getThemePostfix(theme)}.png`)).ok();
    }, [300, 400]).before(async () => {
      await changeTheme(theme);

      return createWidget('dxDateBox', {
        label: 'qwerty QWERTY 1234567890',
        stylingMode,
        value: new Date(1900, 0, 1),
      });
    });
  });
});
