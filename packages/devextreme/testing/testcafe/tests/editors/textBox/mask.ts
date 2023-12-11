import url from '../../../helpers/getPageUrl';
import TextBox from '../../../model/textBox';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';

fixture.disablePageReloads`TextBox_mask`
  .page(url(__dirname, '../../container.html'));

test('"!" character should not be accepted if mask restricts it (T1156419)', async (t) => {
  const textBox = new TextBox('#textBox');
  const { input } = textBox;

  await t
    .typeText(input, '!', { caretPos: 0 })
    .expect(input.value).eql('_');
}).before(async () => {
  await appendElementTo('#container', 'div', 'textBox', { });

  return createWidget('dxTextBox', {
    mask: '9',
  }, '#textBox');
});

test('clear button should work if input has not been blurred (T1193735)', async (t) => {
  const textBox = new TextBox('#textBox');
  const { input } = textBox;

  await t
    .typeText(input, '42', { caretPos: 0 })
    .click('#textBox .dx-clear-button-area')
    .expect(input.value).eql('___');
}).before(async () => {
  await appendElementTo('#container', 'div', 'textBox', { });

  return createWidget('dxTextBox', {
    mask: '999',
    showClearButton: true,
  }, '#textBox');
});
