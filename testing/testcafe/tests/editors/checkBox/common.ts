import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget, { cleanContainer } from '../../../helpers/createWidget';
import {
  appendElementTo, deleteStylesheetRule, insertStylesheetRule, setAttribute,
} from '../../navigation/helpers/domUtils';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';

fixture.disablePageReloads`CheckBox`
  .page(url(__dirname, '../../container.html'));

[false, true].forEach((isColumnCountStyle) => {
  test(`Render ${!isColumnCountStyle ? 'default' : 'with column-count style on container'}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await takeScreenshotInTheme(t, takeScreenshot, `Checkbox states${isColumnCountStyle ? ' with column count style' : ''}.png`, '#container', true);

    await deleteStylesheetRule(0);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setAttribute('#container', 'style', `padding: 5px; width: 300px; height: 200px; ${isColumnCountStyle ? 'column-count: 2' : ''}`);

    await insertStylesheetRule('.dx-checkbox { display: block; }', 0);

    await appendElementTo('#container', 'div', 'checked');
    await createWidget('dxCheckBox', { value: true, text: 'checked' }, false, '#checked');

    await appendElementTo('#container', 'div', 'unchecked');
    await createWidget('dxCheckBox', { value: false, text: 'unchecked' }, false, '#unchecked');

    await appendElementTo('#container', 'div', 'indeterminate');
    await createWidget('dxCheckBox', { value: undefined, text: 'indeterminate' }, false, '#indeterminate');

    // rtl
    await appendElementTo('#container', 'div', 'checkedRTL');
    await createWidget('dxCheckBox', { value: true, text: 'checked', rtlEnabled: true }, false, '#checkedRTL');

    await appendElementTo('#container', 'div', 'uncheckedRTL');
    await createWidget('dxCheckBox', { value: false, text: 'unchecked', rtlEnabled: true }, false, '#uncheckedRTL');

    await appendElementTo('#container', 'div', 'indeterminateRTL');
    await createWidget('dxCheckBox', { value: undefined, text: 'indeterminate', rtlEnabled: true }, false, '#indeterminateRTL');
  }).after(async () => {
    await cleanContainer();
  });
});
