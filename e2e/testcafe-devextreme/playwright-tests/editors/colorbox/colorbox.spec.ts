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

        const input = page.locator('#container .dx-texteditor-input');
        const expectedValue = 'rgba(0, 255, 255, 1)';

        await input.click();
        await input.fill(inputText);
        await page.keyboard.press(key === 'enter' ? 'Enter' : 'Tab');

        const text = await page.evaluate(() => ($('#container') as any).dxColorBox('instance').option('text'));
        const value = await page.evaluate(() => ($('#container') as any).dxColorBox('instance').option('value'));
        expect(text).toBe(expectedValue);
        expect(value).toBe(expectedValue);

    });
    });
  });
});
