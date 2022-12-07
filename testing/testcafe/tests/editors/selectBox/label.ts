import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { changeTheme } from '../../../helpers/changeTheme';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { getThemePostfix } from '../../../helpers/getPostfix';

const labelMods = ['floating', 'static'];
const stylingMods = ['outlined', 'underlined', 'filled'];
const themes = ['generic.light', 'material.blue.light'];

fixture`Label`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

themes.forEach((theme) => {
  stylingMods.forEach((stylingMode) => {
    labelMods.forEach((labelMode) => {
      test(`Label for dxSelectBox labelMode=${labelMode} stylingMode=${stylingMode} ${theme}`, async (t) => {
        await t.click('#otherContainer');

        await t.expect(await compareScreenshot(t, `SelectBox with label-labelMode=${labelMode}-stylingMode=${stylingMode}${getThemePostfix(theme)}.png`)).ok();
      }).before(async (t) => {
        await t.resizeWindow(300, 400);
        await changeTheme(theme);

        await createWidget('dxSelectBox', {
          width: 100,
          label: 'label',
          text: '',
          labelMode,
          stylingMode,
        });

        return createWidget('dxSelectBox', {
          label: `this label is ${'very '.repeat(10)}long`,
          text: `this content is ${'very '.repeat(10)}long`,
          items: ['item1', 'item2'],
          labelMode,
          stylingMode,
        }, false, '#otherContainer');
      });
    });
  });
});
