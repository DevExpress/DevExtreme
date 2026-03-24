import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('HeaderFilter.Remote.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('remote header filter should load grouped data', async ({ page }) => {
    const groupedData = [
      { key: 'Group A', items: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }] },
      { key: 'Group B', items: [{ id: 3, name: 'Item 3' }] },
    ];

    await page.route('**/api/header-filter**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(groupedData),
      });
    });

    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, name: 'Item 1', category: 'Group A' },
        { id: 2, name: 'Item 2', category: 'Group A' },
        { id: 3, name: 'Item 3', category: 'Group B' },
      ],
      keyExpr: 'id',
      headerFilter: {
        visible: true,
      },
      columns: [
        { dataField: 'name' },
        {
          dataField: 'category',
          headerFilter: {
            dataSource: {
              load() {
                return groupedData;
              },
            },
          },
        },
      ],
    });

    const headerFilterIcon = page.locator('.dx-header-filter').first();
    await headerFilterIcon.click();

    const headerFilterPopup = page.locator('.dx-header-filter-menu');
    await expect(headerFilterPopup).toBeVisible();

    const listItems = headerFilterPopup.locator('.dx-list-item');
    const count = await listItems.count();
    expect(count).toBeGreaterThan(0);
  });
});
