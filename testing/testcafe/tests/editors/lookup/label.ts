import { compareScreenshot } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { getThemePostfix } from '../../../helpers/getPostfix';

const labelMods = ['floating', 'static'];
const stylingMods = ['outlined', 'underlined', 'filled'];

fixture`Lookup_Label`
  .page(url(__dirname, '../../container.html'));

stylingMods.forEach((stylingMode) => {
  labelMods.forEach((labelMode) => {
    test(`Label for Lookup labelMode=${labelMode} stylingMode=${stylingMode}`, async (t) => {
      await t.click('#otherContainer');

      await t.expect(await compareScreenshot(t, `label-lookup-labelMode=${labelMode}-styleMode=${stylingMode}${getThemePostfix()}.png`)).ok();
    }).before(async (t) => {
      await t.resizeWindow(300, 800);

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
