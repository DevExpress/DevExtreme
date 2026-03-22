import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('FileUploader - file list visibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const TEST_FILE = './images/test-image-1.png';

  [true, false].forEach((showFileList) => {
    test(`FileUploader with showFileList: ${showFileList} - after file selected`, async ({ page }) => {
    await createWidget(page, 'dxFileUploader', { showFileList });

      const fileUploader = page.locator('#container');

      await fileUploader.input.setInputFiles([TEST_FILE]);

      await testScreenshot(page, `fileuploader-show-filelist-${showFileList}.png`, {
        element: '#container',
      });

      await clearUpload(fileUploader.input);

    });
  });
});
