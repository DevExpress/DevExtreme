import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('SelectBox placeholder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Placeholder is visible after items option change when value is not chosen (T1099804)', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'selectBox');
    await setStyleAttribute(page, '#container', 'box-sizing: border-box; width: 300px; height: 100px; padding: 8px;');

    await createWidget(page, 'dxSelectBox', {
      width: '100%',
      placeholder: 'Choose a value',
    }, '#selectBox');

    await page.evaluate(() => {
      ($('#selectBox') as any).dxSelectBox('instance').option('items', [1, 2, 3]);
    });

    await testScreenshot(page, 'SelectBox placeholder after items change if value is not choosen.png', { element: '#container' });
  });

  test.skip('Pages should be loaded consistently after closing the dropdown popup and filtering the data (T1274576)', async ({ page }) => {
    // skipped: requires complex CustomStore, list scrolling, and ClientFunction patterns
  });
});
