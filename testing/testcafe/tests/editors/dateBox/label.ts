import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { changeTheme } from '../../../helpers/changeTheme';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';

const stylingMods = ['outlined', 'underlined', 'filled'];
const themes = ['generic.light', 'material.blue.light'];

fixture`DateBox_Label`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

themes.forEach((theme) => {
  stylingMods.forEach((stylingMode) => {
    test(`Label for dxDateBox ${theme} stylingMode=${stylingMode}`, async (t) => {
      await t.expect(await compareScreenshot(t, `label-date-box-styleMode=${stylingMode},theme=${theme.replace(/\./g, '-')}.png`)).ok();
    }).before(async (t) => {
      await t.resizeWindow(300, 400);
      await changeTheme(theme);

      return createWidget('dxDateBox', {
        label: 'label text',
        stylingMode,
        value: new Date(1900, 0, 1),
      });
    });

    test(`Symbol parts in label should not be cropped in ${theme} with stylingMode=${stylingMode}`, async (t) => {
      await t.expect(await compareScreenshot(t, `label-symbols-stylingMode=${stylingMode},theme=${theme.replace(/\./g, '-')}.png`)).ok();
    }).before(async () => {
      await changeTheme(theme);

      return createWidget('dxDateBox', {
        label: 'qwertyuiopasdfghjklzxcvbmn QWERTYUIOPLKJHGFDSAZXCVBNM 1234567890',
        stylingMode,
        value: new Date(1900, 0, 1),
      });
    });
  });
});
