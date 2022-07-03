import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import Autocomplete from '../../../model/autocomplete';
import createWidget from '../../../helpers/createWidget';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';

fixture`Autocomplete_placeholder`
  .page(url(__dirname, '../../container.html'))
  .beforeEach(async (t) => {
    await t.resizeWindow(200, 200);
  })
  .afterEach(async (t) => {
    await restoreBrowserSize(t);
  });

test('The placeholder is visible after changing of items option when value is not choosen', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const autocomplete = new Autocomplete('#container');

  await autocomplete.option('items', [1, 2, 3]);

  await t
    .expect(await takeScreenshot('Autocomplete_placeholder_after_items_change_if_value_is_not_choosen.png'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxAutocomplete', {
  placeholder: 'Choose a value',
}, true));
