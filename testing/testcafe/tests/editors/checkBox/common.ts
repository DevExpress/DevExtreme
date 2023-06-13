import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import {
  appendElementTo,
  insertStylesheetRulesToPage, setStyleAttribute,
} from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/themeUtils';

const CHECKBOX_CLASS = 'dx-checkbox';

fixture.disablePageReloads`CheckBox`
  .page(url(__dirname, '../../container.html'));

[false, true].forEach((isColumnCountStyle) => {
  test(`Render ${!isColumnCountStyle ? 'default' : 'with column-count style on container'}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Checkbox states${isColumnCountStyle ? ' with column count style' : ''}.png`, { element: '#container', shouldTestInCompact: true });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setStyleAttribute(Selector('#container'), `padding: 5px; width: 300px; height: 200px; ${isColumnCountStyle ? 'column-count: 2' : ''}`);

    await insertStylesheetRulesToPage(`.${CHECKBOX_CLASS} { display: block; }`);

    await appendElementTo('#container', 'div', 'checked');
    await createWidget('dxCheckBox', { value: true, text: 'checked' }, '#checked');

    await appendElementTo('#container', 'div', 'unchecked');
    await createWidget('dxCheckBox', { value: false, text: 'unchecked' }, '#unchecked');

    await appendElementTo('#container', 'div', 'indeterminate');
    await createWidget('dxCheckBox', { value: undefined, text: 'indeterminate' }, '#indeterminate');

    // rtl
    await appendElementTo('#container', 'div', 'checkedRTL');
    await createWidget('dxCheckBox', { value: true, text: 'checked', rtlEnabled: true }, '#checkedRTL');

    await appendElementTo('#container', 'div', 'uncheckedRTL');
    await createWidget('dxCheckBox', { value: false, text: 'unchecked', rtlEnabled: true }, '#uncheckedRTL');

    await appendElementTo('#container', 'div', 'indeterminateRTL');
    await createWidget('dxCheckBox', { value: undefined, text: 'indeterminate', rtlEnabled: true }, '#indeterminateRTL');

    // scaled container(T1165339)
    await appendElementTo('#container', 'div', 'scaled', { transform: 'scale(0.7)' });
    await createWidget('dxCheckBox', { value: true, text: 'scaled container' }, '#scaled');
  });
});
