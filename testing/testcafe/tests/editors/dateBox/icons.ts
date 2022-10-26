import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { changeTheme } from '../../../helpers/changeTheme';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DateBox from '../../../model/dateBox';

const stylingMods = ['outlined', 'underlined', 'filled'];
const themes = ['generic.light', 'material.blue.light'];
const pickerTypes = ['calendar', 'list', 'native', 'rollers'];
const types = ['date', 'datetime', 'time'];

fixture`DateBox_Icon`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

themes.forEach((theme) => {
  stylingMods.forEach((stylingMode) => {
    pickerTypes.forEach((pickerType) => {
      types.forEach((type) => {
        [true, false].forEach((rtlEnabled) => {
          test(`Icon for dxDateBox ${theme} stylingMode=${stylingMode} pickerType=${pickerType} type=${type} rtlEnabled=${rtlEnabled}`, async (t) => {
            const dateBox = new DateBox('#container');
            await t.expect(await compareScreenshot(t, `datebox-icon-stMode=${stylingMode},pType=${pickerType},type=${type},rtl=${rtlEnabled},theme=${theme.replace(/\./g, '-')}.png`)).ok();

            await t.click(dateBox.input);

            await t.expect(await compareScreenshot(t, `datebox-opened-icon-stMode=${stylingMode},pType=${pickerType},type=${type},rtl=${rtlEnabled},theme=${theme.replace(/\./g, '-')}.png`)).ok();
          }).before(async (t) => {
            await t.resizeWindow(300, 400);
            await changeTheme(theme);

            return createWidget('dxDateBox', {
              label: 'label text',
              stylingMode,
              showClearButton: true,
              pickerType,
              type,
              rtlEnabled,
              value: new Date(1900, 0, 1),
            });
          });
        });
      });
    });
  });
});
