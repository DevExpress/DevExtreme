import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const data = [
  { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
  { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
  { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
  { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
];

test.describe('CardView - Sorting API Themes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Sort index API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: data,
      height: 500,
      columns: [
        { dataField: 'id' },
        { dataField: 'title', sortOrder: 'desc', sortIndex: 1 },
        { dataField: 'name', sortOrder: 'asc', sortIndex: 0 },
        { dataField: 'lastName' },
      ],
    });

    await testScreenshot(page, 'cardview_sort_index_api.png', {
      element: page.locator('#container'),
    });
  });

  test('ShowSortIndexes API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: data,
      height: 500,
      sorting: { showSortIndexes: false },
      columns: [
        { dataField: 'id' },
        { dataField: 'title', sortOrder: 'desc', sortIndex: 1 },
        { dataField: 'name', sortOrder: 'asc', sortIndex: 0 },
        { dataField: 'lastName' },
      ],
    });

    await testScreenshot(page, 'cardview_show_sort_indexes_api.png', {
      element: page.locator('#container'),
    });
  });

  test('AllowSorting API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: data,
      height: 500,
      sorting: { showSortIndexes: false },
      columns: [
        { dataField: 'id' },
        { dataField: 'title', sortOrder: 'desc', sortIndex: 1, allowSorting: false },
        { dataField: 'name', sortOrder: 'asc', sortIndex: 0 },
        { dataField: 'lastName' },
      ],
    });

    const titleHeader = page.locator('.dx-cardview-headers .dx-cardview-header-item').nth(1);
    await titleHeader.click();

    await testScreenshot(page, 'cardview_allow_sorting_api.png', {
      element: page.locator('#container'),
    });
  });

  test('CalculateSortValue API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: data,
      height: 500,
      sorting: { showSortIndexes: false },
      columns: [
        { dataField: 'id' },
        {
          dataField: 'title',
          sortOrder: 'asc',
          calculateSortValue: 'name',
        },
        { dataField: 'name' },
        { dataField: 'lastName' },
      ],
    });

    await testScreenshot(page, 'cardview_calculate_sort_value_is_filed_api.png', {
      element: page.locator('#container'),
    });
  });

  test('SortingMethod API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: data,
      height: 500,
      sorting: { showSortIndexes: false },
      columns: [
        { dataField: 'id' },
        {
          dataField: 'title',
          sortOrder: 'asc',
          sortingMethod(value1, value2) {
            if (value1 === 'Mr.' && value2 !== 'Mr.') return 1;
            if (value1 !== 'Mr.' && value2 === 'Mr.') return -1;
            return value1.localeCompare(value2);
          },
        },
        { dataField: 'name' },
        { dataField: 'lastName' },
      ],
    });

    await testScreenshot(page, 'cardview_sorting_method_api.png', {
      element: page.locator('#container'),
    });
  });

  test('Default render', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: data,
      height: 500,
      columns: [
        { dataField: 'id' },
        { dataField: 'title', sortOrder: 'desc' },
        { dataField: 'name' },
        { dataField: 'lastName' },
      ],
    });

    await testScreenshot(page, 'cardview_headers_default_render.png', {
      element: page.locator('#container'),
    });
  });
});
