import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import Autocomplete from '../../../model/autocomplete';
import createWidget from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';
import { appendElementTo, setStyleAttribute } from '../../../helpers/domUtils';

fixture.disablePageReloads`Autocomplete_placeholder`
  .page(url(__dirname, '../../container.html'));

test('Placeholder is visible after items option change when value is not chosen (T1099804)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const autocomplete = new Autocomplete('#autocomplete');

  await autocomplete.option('items', [1, 2, 3]);

  await testScreenshot(t, takeScreenshot, 'Autocomplete placeholder if value is not choosen.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'autocomplete');
  await setStyleAttribute(Selector('#container'), 'box-sizing: border-box; width: 300px; height: 100px; padding: 8px;');

  return createWidget('dxAutocomplete', {
    width: '100%',
    placeholder: 'Choose a value',
  }, '#autocomplete');
});
