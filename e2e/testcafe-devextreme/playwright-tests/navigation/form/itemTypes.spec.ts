import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('GroupItem', async ({ page }) => {
    await createWidget(page, 'dxForm', {
    items: [
      {
        itemType: 'group',
        items: ['item1'],
        captionTemplate: () => $('<i class="dx-icon dx-icon-user"></i><span>Custom caption template</span>'),
      },
    ],
  });

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
