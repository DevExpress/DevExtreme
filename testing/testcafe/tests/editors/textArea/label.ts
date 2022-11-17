import { compareScreenshot } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import TextArea from '../../../model/textArea';
import { getThemePostfix } from '../../../helpers/getPostfix';

fixture`Label`
  .page(url(__dirname, '../../container.html'));

const labelMods = ['floating', 'static'];
const stylingMods = ['outlined', 'underlined', 'filled'];

test('Label scroll input dxTextArea', async (t) => {
  const textArea = new TextArea('#container');

  await t.scroll(textArea.getInput(), 0, 20);

  await t.expect(await compareScreenshot(t, `label-scroll-text-area${getThemePostfix()}.png`, textArea.element)).ok();
}).before(async () => createWidget('dxTextArea', {
  height: 50,
  width: 200,
  text: `this content is ${'very '.repeat(10)}long`,
  label: 'label text',
}));

stylingMods.forEach((stylingMode) => {
  labelMods.forEach((labelMode) => {
    test(`Label for dxTextArea labelMode=${labelMode} stylingMode=${stylingMode}`, async (t) => {
      await t.click('#otherContainer');

      await t.expect(await compareScreenshot(t, `label-dxTextArea-labelMode=${labelMode}-stylingMode=${stylingMode}${getThemePostfix()}.png`)).ok();
    }).before(async (t) => {
      await t.resizeWindow(300, 400);

      await createWidget('dxTextArea', {
        width: 100,
        label: 'label',
        text: '',
        labelMode,
        stylingMode,
      });

      return createWidget('dxTextArea', {
        label: `this label is ${'very '.repeat(10)}long`,
        text: `this content is ${'very '.repeat(10)}long`,
        items: ['item1', 'item2'],
        labelMode,
        stylingMode,
      }, false, '#otherContainer');
    });
  });
});
