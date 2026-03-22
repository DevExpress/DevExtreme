import { test, expect } from '@playwright/test';
import { testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const DX_DIALOG_CLASS = 'dx-dialog';

  [
    'alert',
    'confirm',
    'custom',
  ].forEach((dialogType) => {
    test(`Dialog appearance (${dialogType})`, async ({ page }) => {

      const dialogArgs = dialogType === 'custom'
        ? { title: 'custom', messageHtml: 'message', buttons: [{ text: 'Custom button' }] }
        : dialogType;

      await page.evaluate(() => {
        const dialogFunction = (window as any).DevExpress.ui.dialog[dialogType];

        if (dialogType === 'custom') {
          dialogFunction(dialogArgs).show();
        } else {
          dialogFunction(dialogArgs);
        }
      });


      await testScreenshot(page, `Dialog appearance (${dialogType}).png`);

      await page.evaluate(() => {
        $(`.${DX_DIALOG_CLASS}`).remove();
      });

    });
  });
});
