import { compareScreenshot } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import TextBox from '../../../model/textBox';
import { setAttribute } from '../../navigation/helpers/domUtils';
import { getThemePostfix } from '../../../helpers/getPostfix';

fixture`TextBox_Label`
  .page(url(__dirname, '../../container.html'));

const labelMods = ['floating', 'static'];
const stylingMods = ['outlined', 'underlined', 'filled'];

test('Label max-width changed with container size', async (t) => {
  const textBox = new TextBox('#container');

  await t
    .expect(textBox.element.find('.dx-label').getStyleProperty('max-width')).eql('82px');

  await setAttribute(`#${await textBox.element.getAttribute('id')}`, 'style', 'width: 400px');

  await t
    .expect(textBox.element.find('.dx-label').getStyleProperty('max-width')).eql('382px');
}).before(async () => createWidget('dxTextBox', {
  width: 100,
  label: 'long label text long label text long label text long label text long label text',
}));

stylingMods.forEach((stylingMode) => {
  labelMods.forEach((labelMode) => {
    test(`Label for dxTextBox labelMode=${labelMode} stylingMode=${stylingMode}`, async (t) => {
      await t.click('#otherContainer');

      await t.expect(await compareScreenshot(t, `label-dxTextBox-labelMode=${labelMode}-stylingMode=${stylingMode}${getThemePostfix()}.png`)).ok();
    }).before(async (t) => {
      await t.resizeWindow(300, 400);

      await createWidget('dxTextBox', {
        width: 100,
        label: 'label',
        text: '',
        labelMode,
        stylingMode,
      });

      return createWidget('dxTextBox', {
        label: `this label is ${'very '.repeat(10)}long`,
        text: `this content is ${'very '.repeat(10)}long`,
        items: ['item1', 'item2'],
        labelMode,
        stylingMode,
      }, false, '#otherContainer');
    });
  });
});
