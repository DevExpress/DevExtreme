import { compareScreenshot } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { getThemePostfix } from '../../../helpers/getPostfix';

const stylingMods = ['outlined', 'underlined', 'filled'];

fixture`DateBox_Label`
  .page(url(__dirname, '../../container.html'));

stylingMods.forEach((stylingMode) => {
  test(`Label for dxDateBox stylingMode=${stylingMode}`, async (t) => {
    await t.expect(await compareScreenshot(t, `label-date-box-styleMode=${stylingMode}${getThemePostfix()}.png`)).ok();
  }).before(async (t) => {
    await t.resizeWindow(300, 400);

    return createWidget('dxDateBox', {
      label: 'label text',
      stylingMode,
      value: new Date(1900, 0, 1),
    });
  });

  test(`Symbol parts in label should not be cropped with stylingMode=${stylingMode}`, async (t) => {
    await t.expect(await compareScreenshot(t, `label-symbols-stylingMode=${stylingMode}${getThemePostfix()}.png`)).ok();
  }).before(async (t) => {
    await t.resizeWindow(300, 400);

    return createWidget('dxDateBox', {
      label: 'qwertyuiopasdfghjklzxcvbmn QWERTYUIOPLKJHGFDSAZXCVBNM 1234567890',
      stylingMode,
      value: new Date(1900, 0, 1),
    });
  });
});
