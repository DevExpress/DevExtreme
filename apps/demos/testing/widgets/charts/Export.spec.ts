import { test, expect } from '@playwright/test';
import { describeManualTest } from '../../../utils/visual-tests/playwright/manual-test';

declare global {
  interface Window {
    testedValue: string;
  }
}

describeManualTest('Charts', 'ExportCustomMarkup', { width: 900, height: 600 }, () => {
  test('Export', async ({ page }) => {
    await page.evaluate(() => {
      window.testedValue = '';

      // @ts-expect-error the stub returns a rejected promise instead of a URL, so nothing is downloaded
      URL.createObjectURL = (blob: Blob) => {
        window.testedValue = blob.type;

        const rejected = Promise.reject();
        // Handled, so that it is not an uncaught error in the page.
        rejected.catch(() => {});

        return rejected;
      };
    });

    await page.locator('#export,.dx-button[icon=export]').first().click();

    await expect
      .poll(() => page.evaluate(() => window.testedValue), { message: 'File was created for download' })
      .toBe('image/png');
  });
});
