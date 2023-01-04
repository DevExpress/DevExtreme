import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { screenshotTestFn } from '../../../helpers/themeUtils';
import { appendElementTo, setStyleAttribute } from '../../../helpers/domUtils';

fixture.disablePageReloads`Colorbox`
  .page(url(__dirname, '../../container.html'));

test('Colorbox should display full placeholder', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await screenshotTestFn(t, takeScreenshot, 'Colorbox with placeholder.png', '#container');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'colorBox');
  await setStyleAttribute(Selector('#container'), 'box-sizing: border-box; width: 300px; height: 100px; padding: 8px;');

  return createWidget('dxColorBox', {
    width: '100%',
    placeholder: 'I am a very long placeholder',
  }, true, '#colorBox');
});
