import { compareScreenshot } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { getThemePostfix } from '../../../helpers/getPostfix';

const stylingMods = ['outlined', 'underlined', 'filled'];

fixture`NumberBox_Label`
  .page(url(__dirname, '../../container.html'));

stylingMods.forEach((stylingMode) => {
  test(`Label for dxNumberBox stylingMode=${stylingMode}`, async (t) => {
    await t.expect(await compareScreenshot(t, `label-number-box-styleMode=${stylingMode}${getThemePostfix()}.png`)).ok();
  }).before(async (t) => {
    await t.resizeWindow(300, 400);

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
