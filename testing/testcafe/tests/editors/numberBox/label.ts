import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { changeTheme } from '../../../helpers/changeTheme';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { getThemePostfix } from '../../../helpers/themeUtils';

const stylingMods = ['outlined', 'underlined', 'filled'];
const themes = ['generic.light', 'material.blue.light'];

fixture`NumberBox_Label`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

themes.forEach((theme) => {
  stylingMods.forEach((stylingMode) => {
    safeSizeTest(`Label for dxNumberBox ${theme} stylingMode=${stylingMode}`, async (t) => {
      await t.expect(await compareScreenshot(t, `NumberBox label with stylingMode=${stylingMode}${getThemePostfix(theme)}.png`)).ok();
    }, [300, 400]).before(async () => {
      await changeTheme(theme);

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
});
