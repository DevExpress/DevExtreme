import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const DROPZONE_EXTERNAL_ID = 'dropzone-external';
const DROPZONE_ACTIVE_CLASS = 'dropzone-active';

describeManualTest('FileUploader', 'CustomDropzone', { width: 900, height: 600 }, () => {
  const triggerDragEnter = async (
    page: Page,
    dropZoneSelector: string,
    items: { type: string }[],
  ): Promise<void> => {
    await page.locator(dropZoneSelector).evaluate((dropZone, dragItems) => {
      const rect = dropZone.getBoundingClientRect();
      const event = new DragEvent('dragenter', {
        bubbles: true,
        cancelable: true,
        clientX: rect.left,
        clientY: rect.top,
      });

      Object.defineProperty(event, 'dataTransfer', {
        value: {
          items: dragItems,
          types: ['Files'],
        },
      });

      dropZone.dispatchEvent(event);
    }, items);
  };

  test('dropzone-active class is added to the dropzone element when single valid file is dragged over it', async ({ page }) => {
    await triggerDragEnter(page, `#${DROPZONE_EXTERNAL_ID}`, [{ type: 'image/png' }]);

    await expect(page.locator(`#${DROPZONE_EXTERNAL_ID}`)).toContainClass(DROPZONE_ACTIVE_CLASS);
  });

  test('dropzone-active class is not added to the dropzone element when an invalid file format is dragged', async ({ page }) => {
    await triggerDragEnter(page, `#${DROPZONE_EXTERNAL_ID}`, [{ type: 'image/xlsx' }]);

    await expect(page.locator(`#${DROPZONE_EXTERNAL_ID}`)).not.toContainClass(DROPZONE_ACTIVE_CLASS);
  });

  test('dropzone-active class is not added to the dropzone element when multiple items are dragged', async ({ page }) => {
    await triggerDragEnter(page, `#${DROPZONE_EXTERNAL_ID}`, [
      { type: 'image/png' },
      { type: 'image/png' },
    ]);

    await expect(page.locator(`#${DROPZONE_EXTERNAL_ID}`)).not.toContainClass(DROPZONE_ACTIVE_CLASS);
  });

  test('custom dropzone user interface appearance when dropzone-active is applied', async ({ page }) => {
    await triggerDragEnter(page, `#${DROPZONE_EXTERNAL_ID}`, [{ type: 'image/png' }]);

    await testScreenshot(page, 'custom_dropzone_valid_file.png');
  });
});
