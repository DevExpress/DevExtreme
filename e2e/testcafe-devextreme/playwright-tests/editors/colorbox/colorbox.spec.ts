import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Colorbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

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
    ['enter', 'tab'].forEach((key) => {
      test(`input value=${inputText} should be formatted to rgba after apply on ${key} key press`, async ({ page }) => {
    await createWidget(page, 'dxColorBox', {
        editAlphaChannel: true,
      }, '#container');

        const colorBox = page.locator('#container');
        const expectedValue = 'rgba(0, 255, 255, 1)';

        await page.click(colorBox.input);

        await page.typeText(colorBox.input, inputText)
          .pressKey(key)
          .expect(colorBox.option('text'))
          .eql(expectedValue)
          .expect(colorBox.option('value'))
          .eql(expectedValue);

    });
    });
  });
});
