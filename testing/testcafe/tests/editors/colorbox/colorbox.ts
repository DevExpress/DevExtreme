import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { getThemePostfix } from '../../../helpers/getPostfix';

fixture`Colorbox`
  .page(url(__dirname, '../../container.html'));

test('Colorbox should display full placeholder', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot(`colorbox-with-placeholder${getThemePostfix()}.png`, '#container'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxColorBox', { width: 300, placeholder: 'I am a very long placeholder' }));
