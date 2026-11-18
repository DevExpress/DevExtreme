import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';

test.describe('Slider', () => {
  test('Slider appearance', async ({ page }) => {
    await createWidget(page, 'dxSlider', {
      tooltip: {
        enabled: true,
        showMode: 'always',
        position: 'bottom',
      },
    });

    await testScreenshot(page, 'slider-appearance.png', { element: '#container' });
  });
});
