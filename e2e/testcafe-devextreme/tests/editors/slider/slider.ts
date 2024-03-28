import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { getFullThemeName, testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`Slider`
  .page(url(__dirname, '../../container.html'));

test('Slider appearance', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'slider-appearance.png', { element: '#container' });

  await testScreenshot(t, takeScreenshot, 'slider-appearance.png', { element: '#container', theme: getFullThemeName().replace('light', 'dark') });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxSlider', {
  tooltip: {
    enabled: true,
    showMode: 'always',
    position: 'bottom',
  },
}));
