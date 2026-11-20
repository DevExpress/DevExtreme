import { expect, test } from '../../../fixtures';
import { testScreenshot } from '../../../helpers/screenshots';

test.describe('Dialog', () => {
  [
    'alert',
    'confirm',
    'custom',
  ].forEach((dialogType) => {
    test(`Dialog appearance (${dialogType})`, async ({ page }) => {
      const dialogArgs = dialogType === 'custom'
        ? { title: 'custom', messageHtml: 'message', buttons: [{ text: 'Custom button' }] }
        : dialogType;

      await page.evaluate(({ type, args }) => {
        const dialogFunction = (window as any).DevExpress.ui.dialog[type];

        if (type === 'custom') {
          dialogFunction(args).show();
        } else {
          dialogFunction(args);
        }
      }, { type: dialogType, args: dialogArgs });

      await expect(page.locator('.dx-dialog-button').first()).toBeFocused();

      await testScreenshot(page, `Dialog appearance (${dialogType}).png`);
    });
  });
});
