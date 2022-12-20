import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import {
  appendElementTo, setAttribute,
} from '../../navigation/helpers/domUtils';
import SelectBox from '../../../model/selectBox';

const labelMods = ['floating', 'static'];
const stylingModes = ['outlined', 'underlined', 'filled'];

fixture.disablePageReloads`Label`
  .page(url(__dirname, '../../container.html'));

stylingModes.forEach((stylingMode) => {
  labelMods.forEach((labelMode) => {
    test(`Label for dxSelectBox labelMode=${labelMode} stylingMode=${stylingMode}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const selectBox2 = new SelectBox('#selectBox2');

      await t.click('#selectBox2');

      await takeScreenshotInTheme(t, takeScreenshot, `SelectBox with label-labelMode=${labelMode}-stylingMode=${stylingMode}.png`, '#container');

      await t.click(await selectBox2.getPopup());

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await setAttribute('#container', 'style', 'box-sizing: border-box; width: 300px; height: 400px; padding: 8px;');

      await appendElementTo('#container', 'div', 'selectBox1');
      await appendElementTo('#container', 'div', 'selectBox2');

      await createWidget('dxSelectBox', {
        width: 100,
        label: 'label',
        text: '',
        labelMode,
        stylingMode,
      }, false, '#selectBox1');

      await createWidget('dxSelectBox', {
        label: `this label is ${'very '.repeat(10)}long`,
        text: `this content is ${'very '.repeat(10)}long`,
        items: ['item1', 'item2'],
        labelMode,
        stylingMode,
      }, false, '#selectBox2');
    });
  });
});
