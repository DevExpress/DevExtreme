import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';

test.describe('Form', () => {
  test('GroupItem', async ({ page }) => {
    await createWidget(page, 'dxForm', () => ({
      items: [
        {
          itemType: 'group',
          items: ['item1'],
          captionTemplate: () => $('<i class="dx-icon dx-icon-user"></i><span>Custom caption template</span>'),
        },
      ],
    }));

    await testScreenshot(page, 'Group caption template.png', { element: '#container' });
  });

  test('TabbedItem', async ({ page }) => {
    await createWidget(page, 'dxForm', {
      width: 500,
      items: [
        {
          itemType: 'tabbed',
          tabPanelOptions: { deferRendering: false },
          tabs: [
            {
              title: 'tab1',
              items: ['item1'],
            },
          ],
        },
      ],
    });

    await testScreenshot(page, 'TabbedItem.png', { element: '#container' });
  });
});
