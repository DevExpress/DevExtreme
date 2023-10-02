import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';

fixture`Slider`
  .page(url(__dirname, '../../container.html'));

test('Slider screenshot', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('slider.png', 'html'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxSlider', {
  tooltip: {
    enabled: true,
    showMode: 'always',
    position: 'bottom',
  },
}));
