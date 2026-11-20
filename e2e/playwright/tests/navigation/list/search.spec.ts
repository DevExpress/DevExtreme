import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';

test.describe('Search', () => {
  test('List with search bar appearance', async ({ page }) => {
    await setAttribute(page, '#container', 'style', 'display: flex; gap: 40px; padding: 8px; width: fit-content;');

    const dataSource = Array.from({ length: 8 }, (_, i) => `Item_${i + 1}`);
    const selectionModes = ['none', 'single', 'multiple', 'all'];

    for (const mode of selectionModes) {
      await appendElementTo(page, '#container', 'div', `list-${mode}`);
    }

    for (const mode of selectionModes) {
      await createWidget(page, 'dxList', {
        dataSource,
        height: 400,
        width: 200,
        searchEnabled: true,
        showSelectionControls: true,
        selectionMode: mode,
      }, `#list-${mode}`);
    }

    await testScreenshot(page, 'List with search.png', { element: '#container' });
  });
});
