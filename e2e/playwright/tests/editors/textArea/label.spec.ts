import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import TextArea from '../../../models/textArea';

const labelModes = ['floating', 'static', 'outside'];
const stylingModes = ['outlined', 'underlined', 'filled'];

test.describe('Label', () => {
  test('Label scroll input dxTextArea', async ({ page }) => {
    await createWidget(page, 'dxTextArea', {
      height: 50,
      width: 200,
      text: `this content is ${'very '.repeat(10)}long`,
      label: 'label text',
    });

    const textArea = new TextArea(page, '#container');

    await textArea.input.evaluate((element) => { element.scrollTo(0, 20); });

    await testScreenshot(page, 'TextArea label after scroll.png', { element: '#container' });
  });

  test.describe(() => {
    test.use({ browserSize: [300, 400] });

    stylingModes.forEach((stylingMode) => {
      labelModes.forEach((labelMode) => {
        test(`Label for dxTextArea labelMode=${labelMode} stylingMode=${stylingMode}`, async ({ page }) => {
          await appendElementTo(page, '#container', 'div', 'textArea1');
          await appendElementTo(page, '#container', 'div', 'textArea2');

          await createWidget(page, 'dxTextArea', {
            width: 100,
            label: 'label',
            text: '',
            labelMode,
            stylingMode,
          }, '#textArea1');

          await createWidget(page, 'dxTextArea', {
            label: `this label is ${'very '.repeat(10)}long`,
            text: `this content is ${'very '.repeat(10)}long`,
            items: ['item1', 'item2'],
            labelMode,
            stylingMode,
          }, '#textArea2');

          await page.locator('#textArea2').click();

          await testScreenshot(page, `TextArea with label-labelMode=${labelMode}-stylingMode=${stylingMode}.png`);
        });
      });
    });
  });
});
