import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import { getThemeName } from '../../../helpers/themeUtils';

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

  test('Details view, focused row actions button', async ({ page, theme }) => {
    test.skip(getThemeName(theme) !== 'fluent-next', 'fluent-next only');

    await createWidget(page, 'dxFileManager', {
      fileSystemProvider: [
        {
          name: 'Documents',
          isDirectory: true,
          dateModified: '2024-01-15T10:00:00Z',
        },
        {
          name: 'report.txt',
          isDirectory: false,
          size: 2048,
          dateModified: '2024-01-16T10:00:00Z',
        },
        {
          name: 'photo.png',
          isDirectory: false,
          size: 10240,
          dateModified: '2024-01-17T10:00:00Z',
        },
      ],
      height: 450,
    });

    await page.locator('.dx-filemanager-details .dx-data-row').nth(1).click();
    await page.mouse.move(0, 0);

    await testScreenshot(
      page,
      'details view focused row actions button.png',
      { element: '#container' },
    );
  });
});
