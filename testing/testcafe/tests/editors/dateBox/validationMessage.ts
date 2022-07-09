import { compareScreenshot } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import DateBox from '../../../model/dateBox';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';

fixture`DateBox ValidationMessagePosition`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

const positions = ['top', 'right', 'bottom', 'left'];
const themes = ['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'];
themes.forEach((theme) => {
  positions.forEach((position) => {
    test(`DateBox ValidationMessage position is correct (${position}, ${theme})`, async (t) => {
      const dateBox1 = new DateBox('#container');
      await dateBox1.option('value', new Date());

      await t.expect(await compareScreenshot(t, `datebox-validation-message-position=${position},theme=${theme.replace(/\./g, '-')}.png`)).ok();
    }).before(async (t) => {
      await t.resizeWindow(500, 200);
      await changeTheme(theme);

      await createWidget('dxDateBox', {
        elementAttr: { style: 'margin: 50px 0 0 100px;' },
        width: 200,
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
    });
  });
});
