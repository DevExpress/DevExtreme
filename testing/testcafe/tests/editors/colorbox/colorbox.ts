import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';

fixture`Colorbox`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

test('Colorbox should display full placeholder', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshotInTheme(t, takeScreenshot, 'Colorbox with placeholder.png', '#container');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxColorBox', { width: 300, placeholder: 'I am a very long placeholder' }));
