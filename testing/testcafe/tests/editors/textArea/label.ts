import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import TextArea from '../../../model/textArea';
import { appendElementTo } from '../../../helpers/domUtils';

fixture`Label`
  .page(url(__dirname, '../../container.html'));

const labelMods = ['floating', 'static'];
const stylingModes = ['outlined', 'underlined', 'filled'];

test('Label scroll input dxTextArea', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const textArea = new TextArea('#container');

  await t.scroll(textArea.getInput(), 0, 20);

  await testScreenshot(t, takeScreenshot, 'TextArea label after scroll.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxTextArea', {
  height: 50,
  width: 200,
  text: `this content is ${'very '.repeat(10)}long`,
  label: 'label text',
}));

stylingModes.forEach((stylingMode) => {
  labelMods.forEach((labelMode) => {
    safeSizeTest(`Label for dxTextArea labelMode=${labelMode} stylingMode=${stylingMode}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.click('#textArea2');

      await testScreenshot(t, takeScreenshot, `TextArea with label-labelMode=${labelMode}-stylingMode=${stylingMode}.png`);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [300, 400]).before(async () => {
      await appendElementTo('#container', 'div', 'textArea1', { });
      await appendElementTo('#container', 'div', 'textArea2', { });

      await createWidget('dxTextArea', {
        width: 100,
        label: 'label',
        text: '',
        labelMode,
        stylingMode,
      }, '#textArea1');

      return createWidget('dxTextArea', {
        label: `this label is ${'very '.repeat(10)}long`,
        text: `this content is ${'very '.repeat(10)}long`,
        items: ['item1', 'item2'],
        labelMode,
        stylingMode,
      }, '#textArea2');
    });
  });
});
