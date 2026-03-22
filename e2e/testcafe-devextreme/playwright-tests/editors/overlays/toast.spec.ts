import { test, expect } from '@playwright/test';
import { testScreenshot, setClassAttribute, insertStylesheetRulesToPage } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Toast', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const types = ['info', 'warning', 'error', 'success'];
  const STACK_CONTAINER_SELECTOR = '.dx-toast-stack';

  const showToast = ClientFunction(
    (type) => {
      (window as any).DevExpress.ui.notify(
        {
          message: `Toast ${type}`,
          type,
          displayTime: 35000000,
          animation: {
            show: {
              type: 'fade', duration: 0,
            },
            hide: { type: 'fade', duration: 0 },
          },
        },
        {
          position: 'top center',
          direction: 'down-push',
        },

    },

  const hideAllToasts = async () => page.evaluate(() => {
    (window as any).DevExpress.ui.hideToasts();
  });

  test('Toasts', async ({ page }) => {

    await Promise.all(types.map((type) => showToast(type)));

    await insertStylesheetRulesToPage(page, `${STACK_CONTAINER_SELECTOR} { padding: 20px; }`);
    await setClassAttribute(page, Selector(STACK_CONTAINER_SELECTOR), `dx-theme-${(process.env.theme ?? 'fluent.blue.light')}-typography`);

    await testScreenshot(page, 'Toasts.png', { element: STACK_CONTAINER_SELECTOR });

    });
});
