import { compareScreenshot } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../navigation/helpers/domUtils';

fixture`CheckBox`
  .page(url(__dirname, '../../container.html'));

test('Render', async (t) => {
  await t.expect(await compareScreenshot(t, 'Checkbox_states.png')).ok();
}).before(async () => {
  await setAttribute('#container', 'style', 'width: 300px');

  await appendElementTo('#container', 'div', 'checked', { display: 'block' });
  await createWidget('dxCheckBox', { value: true, text: 'checked' }, false, '#checked');

  await appendElementTo('#container', 'div', 'unchecked', { display: 'block' });
  await createWidget('dxCheckBox', { value: false, text: 'unchecked' }, false, '#unchecked');

  await appendElementTo('#container', 'div', 'indeterminate', { display: 'block' });
  await createWidget('dxCheckBox', { value: undefined, text: 'indeterminate' }, false, '#indeterminate');

  // rtl
  await appendElementTo('#container', 'div', 'checkedRTL', { display: 'block' });
  await createWidget('dxCheckBox', { value: true, text: 'checked', rtlEnabled: true }, false, '#checkedRTL');

  await appendElementTo('#container', 'div', 'uncheckedRTL', { display: 'block' });
  await createWidget('dxCheckBox', { value: false, text: 'unchecked', rtlEnabled: true }, false, '#uncheckedRTL');

  await appendElementTo('#container', 'div', 'indeterminateRTL', { display: 'block' });
  await createWidget('dxCheckBox', { value: undefined, text: 'indeterminate', rtlEnabled: true }, false, '#indeterminateRTL');
});
