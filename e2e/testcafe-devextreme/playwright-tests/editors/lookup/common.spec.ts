import { test } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe.skip('Lookup', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 300, height: 400 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Lookup appearance', async ({ page }) => {
    await setStyleAttribute(page, '#container', 'display: flex; gap: 20px; padding: 8px; width: fit-content;');

    const configs = [
      { id: 'lookup-default', options: { items: ['item1', 'item2'] } },
      { id: 'lookup-disabled', options: { items: ['item1', 'item2'], disabled: true } },
      { id: 'lookup-with-value', options: { items: ['item1', 'item2'], value: 'item1' } },
    ];

    for (const config of configs) {
      await appendElementTo(page, '#container', 'div', config.id);
      await createWidget(page, 'dxLookup', {
        width: 200,
        ...config.options,
      }, `#${config.id}`);
    }

    await testScreenshot(page, 'Lookup appearance.png', { element: '#container' });
  });
});
