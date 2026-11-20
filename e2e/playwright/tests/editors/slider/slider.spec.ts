import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { setClassAttribute } from '../../../helpers/domUtils';
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

  [
    { name: 'default', handleClass: '' },
    { name: 'hover', handleClass: 'dx-state-hover' },
    { name: 'focused', handleClass: 'dx-state-focused' },
  ].forEach(({ name, handleClass }) => {
    test(`Slider invalid, ${name}`, async ({ page }) => {
      await createWidget(page, 'dxSlider', { value: 40, isValid: false });

      if (handleClass) {
        await setClassAttribute(page, '#container .dx-slider-handle', handleClass);
      }

      await testScreenshot(page, `slider-invalid-${name}.png`, { element: '#container' });
    });
  });

  test('RangeSlider invalid, start hover, end focused', async ({ page }) => {
    await createWidget(page, 'dxRangeSlider', { start: 20, end: 80, isValid: false });

    await setClassAttribute(page, '#container .dx-rangeslider-start-handle', 'dx-state-hover');
    await setClassAttribute(page, '#container .dx-rangeslider-end-handle', 'dx-state-focused');

    await testScreenshot(page, 'rangeslider-invalid-states.png', { element: '#container' });
  });
});
