import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Autocomplete from '../../../models/autocomplete';

test.describe('Autocomplete_placeholder', () => {
  test('Placeholder is visible after items option change when value is not chosen (T1099804)', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'autocomplete');
    await setStyleAttribute(page, '#container', 'box-sizing: border-box; width: 300px; height: 100px; padding: 8px;');
    await createWidget(page, 'dxAutocomplete', {
      width: '100%',
      placeholder: 'Choose a value',
    }, '#autocomplete');

    const autocomplete = new Autocomplete(page, '#autocomplete');

    await autocomplete.option('items', [1, 2, 3]);

    await testScreenshot(page, 'Autocomplete placeholder if value is not choosen.png', { element: '#container' });
  });
});
