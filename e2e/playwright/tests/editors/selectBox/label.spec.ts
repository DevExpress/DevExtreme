import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import SelectBox from '../../../models/selectBox';

const labelMods = ['floating', 'static', 'outside'];
const stylingModes = ['outlined', 'underlined', 'filled'];

test.describe('Label', () => {
  stylingModes.forEach((stylingMode) => {
    labelMods.forEach((labelMode) => {
      test(`Label for dxSelectBox labelMode=${labelMode} stylingMode=${stylingMode}`, async ({ page }) => {
        await setStyleAttribute(page, '#container', 'box-sizing: border-box; width: 300px; height: 400px; padding: 8px;');

        await appendElementTo(page, '#container', 'div', 'selectBox1');
        await appendElementTo(page, '#container', 'div', 'selectBox2');

        await createWidget(page, 'dxSelectBox', {
          width: 100,
          label: 'label',
          text: '',
          labelMode,
          stylingMode,
        }, '#selectBox1');

        await createWidget(page, 'dxSelectBox', {
          label: `this label is ${'very '.repeat(10)}long`,
          text: `this content is ${'very '.repeat(10)}long`,
          items: ['item1', 'item2'],
          labelMode,
          stylingMode,
        }, '#selectBox2');

        const selectBox2 = new SelectBox(page, '#selectBox2');

        await selectBox2.element.click();

        await testScreenshot(page, `SelectBox with label-labelMode=${labelMode}-stylingMode=${stylingMode}.png`, { element: '#container' });

        await (await selectBox2.getPopup()).click();
      });
    });
  });
});
