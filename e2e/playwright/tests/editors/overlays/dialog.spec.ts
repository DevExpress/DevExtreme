import { test } from '../../../fixtures';
import { waitForOverlayAnimations } from '../../../helpers/animation';
import { testScreenshot } from '../../../helpers/screenshots';

test.describe('Dialog', () => {
  ['alert', 'confirm', 'custom'].forEach((dialogType) => {
    test(`Dialog appearance (${dialogType})`, async ({ page }) => {
      await page.evaluate((type) => {
        const { dialog } = (window as any).DevExpress.ui;

        if (type === 'custom') {
          dialog.custom({ title: 'custom', messageHtml: 'message', buttons: [{ text: 'Custom button' }] }).show();
        } else {
          dialog[type](type);
        }
      }, dialogType);

      await waitForOverlayAnimations(page);

      await testScreenshot(page, `Dialog appearance (${dialogType}).png`);
    });
  });
});
