import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('HeaderFilter.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('popup with list', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { A: 'A_0', B: 'B_0', C: 'C_0' },
        { A: 'A_1', B: 'B_1', C: 'C_1' },
        { A: 'A_2', B: 'B_2', C: 'C_2' },
      ],
      columns: ['A', 'B', 'C'],
      headerFilter: { visible: true },
      height: 600,
    });

    await page.locator('.dx-header-filter-icon').first().click();

    await testScreenshot(page, 'card-view_header-filter_popup-with-list.png', {
      element: page.locator('#container'),
    });
  });

  test('popup with search', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { A: 'A_0', B: 'B_0', C: 'C_0' },
        { A: 'A_1', B: 'B_1', C: 'C_1' },
        { A: 'A_2', B: 'B_2', C: 'C_2' },
      ],
      columns: ['A', 'B', 'C'],
      headerFilter: { visible: true, search: { enabled: true } },
      height: 600,
    });

    await page.locator('.dx-header-filter-icon').first().click();

    await testScreenshot(page, 'card-view_header-filter_popup-with-search.png', {
      element: page.locator('#container'),
    });
  });

  test('popup with tree', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { A: '2024-01-01', B: 'B_0', C: 'C_0' },
        { A: '2024-01-01', B: 'B_1', C: 'C_1' },
        { A: '2024-01-01', B: 'B_2', C: 'C_2' },
        { A: '2025-01-01', B: 'B_3', C: 'C_3' },
        { A: '2025-01-01', B: 'B_4', C: 'C_4' },
        { A: '2026-01-01', B: 'B_5', C: 'C_5' },
      ],
      columns: [
        { dataField: 'A', dataType: 'date' },
        'B',
        'C',
      ],
      headerFilter: { visible: true },
      height: 600,
    });

    await page.locator('.dx-header-filter-icon').first().click();

    await testScreenshot(page, 'card-view_header-filter_popup-with-tree.png', {
      element: page.locator('#container'),
    });
  });
});
