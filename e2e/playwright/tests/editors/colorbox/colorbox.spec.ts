import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import ColorBox from '../../../models/colorBox';

test.describe('Colorbox', () => {
  test('Colorbox should display full placeholder', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'colorBox');
    await setStyleAttribute(page, '#container', 'box-sizing: border-box; width: 300px; height: 100px; padding: 8px;');
    await createWidget(page, 'dxColorBox', {
      width: '100%',
      placeholder: 'I am a very long placeholder',
    }, '#colorBox');

    await testScreenshot(page, 'Colorbox with placeholder.png', { element: '#container' });
  });

  ['#00ffff', 'rgb(0,255,255)', 'rgba(0,255,255,1)', 'aqua'].forEach((inputText) => {
    ['Enter', 'Tab'].forEach((key) => {
      test(`input value=${inputText} should be formatted to rgba after apply on ${key.toLowerCase()} key press`, async ({ page }) => {
        await createWidget(page, 'dxColorBox', {
          editAlphaChannel: true,
        }, '#container');

        const colorBox = new ColorBox(page, '#container');
        const expectedValue = 'rgba(0, 255, 255, 1)';

        await colorBox.input.click();
        await colorBox.input.pressSequentially(inputText);
        await page.keyboard.press(key);

        await expect.poll(() => colorBox.option('text')).toBe(expectedValue);
        await expect.poll(() => colorBox.option('value')).toBe(expectedValue);
      });
    });
  });
});
