import { compareScreenshot } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../navigation/helpers/domUtils';
import { changeTheme } from '../../../helpers/changeTheme';

fixture`CheckBox`
  .page(url(__dirname, '../../container.html'));

const themes = ['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'];

themes.forEach((theme) => {
  [true, false].forEach((isColumnCountStyle) => {
    test(`Render ${!isColumnCountStyle ? 'default' : 'with column-count style on container'}, theme=${theme}`, async (t) => {
      await t.expect(await compareScreenshot(t, `Checkbox_states${isColumnCountStyle ? '_with_column_count_style' : ''},theme=${theme.replace(/\./g, '-')}.png`, '#container')).ok();
    }).before(async () => {
      await changeTheme(theme);

      await setAttribute('#container', 'style', `width: 300px; ${isColumnCountStyle ? 'column-count: 2' : ''}`);

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
    }).after(async () => {
      await changeTheme('generic.light');
    });
  });
});
