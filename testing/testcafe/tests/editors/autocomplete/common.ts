import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import Autocomplete from '../../../model/autocomplete';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import { appendElementTo, setAttribute } from '../../navigation/helpers/domUtils';

fixture.disablePageReloads`Autocomplete_placeholder`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

test('Placeholder is visible after items option change when value is not chosen (T1099804)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const autocomplete = new Autocomplete('#autocomplete');
  await t.debug();
  await autocomplete.option('items', [1, 2, 3]);

  await takeScreenshotInTheme(t, takeScreenshot, 'Autocomplete placeholder if value is not choosen.png', '#container');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'autocomplete');
  await setAttribute('#container', 'style', 'box-sizing: border-box; width: 300px; height: 100px; padding: 8px;');

  return createWidget('dxAutocomplete', {
    width: '100%',
    placeholder: 'Choose a value',
  }, true, '#autocomplete');
});
