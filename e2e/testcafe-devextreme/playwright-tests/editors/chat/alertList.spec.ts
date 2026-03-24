import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('ChatAlertList', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Alertlist appearance', async ({ page }) => {
    await page.evaluate(() => {
      const fixedDate = new Date(2024, 0, 15, 10, 30, 0);
      (window as any)._originalDate = Date;
      const OrigDate = Date;
      (window as any).Date = class extends OrigDate {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(fixedDate.getTime());
          } else {
            super(...args);
          }
        }

        static now() { return fixedDate.getTime(); }
      };
    });

    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
      alerts: [
        { id: 1, message: 'Something went wrong' },
        { id: 2, message: 'Network error occurred' },
      ],
    });

    await testScreenshot(page, 'Chat alertlist appearance.png', { element: '#container' });

    await page.evaluate(() => {
      if ((window as any)._originalDate) {
        (window as any).Date = (window as any)._originalDate;
      }
    });
  });
});
