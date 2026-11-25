import { test, expect } from '@playwright/test';
import { describeManualTest } from '../../../utils/visual-tests/playwright/manual-test';

declare global {
  interface Window {
    originalCreateObjectURL: (obj: Blob | MediaSource) => string;
    testedValue?: string;
  }
}

describeManualTest('Charts', 'ExportCustomMarkup', { width: 900, height: 600 }, () => {
  test('Export', async ({ page }) => {
    await page.evaluate(() => {
      window.originalCreateObjectURL = URL.createObjectURL;
      window.testedValue = '';

      // @ts-expect-error the stub returns a rejected promise instead of a URL
      URL.createObjectURL = (blob: Blob) => {
        window.testedValue = blob.type;

        return Promise.reject();
      };
    });

    await page.locator('#export,.dx-button[icon=export]').first().click();

    await expect
      .poll(() => page.evaluate(() => window.testedValue), { message: 'File was created for download' })
      .toBe('image/png');

    await page.evaluate(() => {
      URL.createObjectURL = window.originalCreateObjectURL;
      delete window.testedValue;
    });
  });
});
