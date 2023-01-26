import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import {
  appendElementTo,
  setStyleAttribute,
} from '../../../helpers/domUtils';
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

      await testScreenshot(t, takeScreenshot, `SelectBox with label-labelMode=${labelMode}-stylingMode=${stylingMode}.png`, { element: '#container' });

      await t.click(await selectBox2.getPopup());

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await setStyleAttribute(Selector('#container'), 'box-sizing: border-box; width: 300px; height: 400px; padding: 8px;');

      await appendElementTo('#container', 'div', 'selectBox1');
      await appendElementTo('#container', 'div', 'selectBox2');

      await createWidget('dxSelectBox', {
        width: 100,
        label: 'label',
        text: '',
        labelMode,
        stylingMode,
      }, '#selectBox1');

      await createWidget('dxSelectBox', {
        label: `this label is ${'very '.repeat(10)}long`,
        text: `this content is ${'very '.repeat(10)}long`,
        items: ['item1', 'item2'],
        labelMode,
        stylingMode,
      }, '#selectBox2');
    });
  });
});
