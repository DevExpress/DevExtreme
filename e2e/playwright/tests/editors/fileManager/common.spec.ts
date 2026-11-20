import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';

test.describe('FileManager', () => {
  test('Custom DropDown width for Material and Fluent themes', async ({ page }) => {
    await createWidget(page, 'dxFileManager', {
      name: 'fileManager',
      fileSystemProvider: [],
      height: 450,
    });

    await page.locator('.dx-filemanager-toolbar-viewmode-item').click();

    await testScreenshot(page, 'drop down width.png', { element: '#container' });
  });
});
