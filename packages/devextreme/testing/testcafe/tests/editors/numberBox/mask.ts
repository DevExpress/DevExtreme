/* eslint-disable no-restricted-syntax */
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import {
  appendElementTo,
} from '../../../helpers/domUtils';
import { clearTestPage } from '../../../helpers/clearPage';
import NumberBox from '../../../model/numberBox';

fixture.disablePageReloads`NumberBox_Mask`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => clearTestPage());

test('pressing "." should clear previous value (T1199553)', async (t) => {
  const textBox = new NumberBox('#numberBox');
  const { input } = textBox;

  await t
    .click('#numberBox')
    .pressKey('end shift+left shift+left shift+left shift+left shift+left shift+left shift+left shift+left .')
    .expect(input.value)
    .eql('0.00');
}).before(async () => {
  await appendElementTo('#container', 'div', 'numberBox', { });
  await createWidget('dxNumberBox', {
    format: '#0.00',
    value: 14500,
  }, '#numberBox');
});
