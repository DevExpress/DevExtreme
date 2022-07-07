import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { changeTheme } from '../../../helpers/changeTheme';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';

const labelMods = ['floating', 'static'];
const stylingMods = ['outlined', 'underlined', 'filled'];
const themes = ['generic.light', 'material.blue.light'];

fixture`Lookup_Label`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

themes.forEach((theme) => {
  stylingMods.forEach((stylingMode) => {
    labelMods.forEach((labelMode) => {
      test(`Label for Lookup labelMode=${labelMode} stylingMode=${stylingMode} ${theme}`, async (t) => {
        await t.click('#otherContainer');

        await t.expect(await compareScreenshot(t, `label-lookup-${theme}-labelMode=${labelMode}-styleMode=${stylingMode}.png`)).ok();
      }).before(async (t) => {
        await t.resizeWindow(300, 800);
        await changeTheme(theme);

        const componentOption = {
          label: 'label text',
          labelMode,
          dropDownCentered: false,
          items: [...Array(10)].map((_, i) => `item${i}`),
          stylingMode,
        };

        await createWidget('dxLookup', { ...componentOption });

        return createWidget('dxLookup', { ...componentOption }, false, '#otherContainer');
      });
    });
  });
});
