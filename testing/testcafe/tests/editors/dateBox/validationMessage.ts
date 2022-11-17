import { compareScreenshot } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import DateBox from '../../../model/dateBox';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import { getThemePostfix } from '../../../helpers/getPostfix';

fixture`DateBox ValidationMessagePosition`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

const positions = ['top', 'right', 'bottom', 'left'];
positions.forEach((position) => {
  test(`DateBox ValidationMessage position is correct (${position})`, async (t) => {
    const dateBox1 = new DateBox('#container');
    await dateBox1.option('value', new Date(2022, 6, 14));

    await t.expect(await compareScreenshot(t, `datebox-validation-message-position=${position}${getThemePostfix()}.png`)).ok();
  }).before(async (t) => {
    await t.resizeWindow(300, 200);

    await createWidget('dxDateBox', {
      elementAttr: { style: 'margin: 50px 0 0 100px;' },
      width: 100,
      height: 40,
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
  }).after(async (t) => {
    await restoreBrowserSize(t);
  });
});
