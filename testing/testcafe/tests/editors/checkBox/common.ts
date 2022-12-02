import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../navigation/helpers/domUtils';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';

fixture`CheckBox`
  .page(url(__dirname, '../../container.html'));

[false, true].forEach((isColumnCountStyle) => {
  test(`Render ${!isColumnCountStyle ? 'default' : 'with column-count style on container'}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await takeScreenshotInTheme(t, takeScreenshot, `Checkbox states${isColumnCountStyle ? ' with column count style' : ''}.png`, '#container', true);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setAttribute('#container', 'style', `padding: 5px; width: 300px; height: 200px; ${isColumnCountStyle ? 'column-count: 2' : ''}`);

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
});
