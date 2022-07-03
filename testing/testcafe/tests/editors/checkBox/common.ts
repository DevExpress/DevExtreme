import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import { appendElementTo } from '../../navigation/helpers/domUtils';

fixture`CheckBox`
  .page(url(__dirname, '../../container.html'));

test('Render', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('Checkbox_states.png'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.resizeWindow(300, 400);

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
}).after(async (t) => {
  await restoreBrowserSize(t);
});
