import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - CardView sorting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const sortingData = [
    { id: 1, title: 'Mrs.', name: 'Nancy', lastName: 'Davolio' },
    { id: 2, title: 'Dr.', name: 'Andrew', lastName: 'Fuller' },
    { id: 3, title: 'Ms.', name: 'Janet', lastName: 'Leverling' },
    { id: 4, title: 'Mrs.', name: 'Margaret', lastName: 'Peacock' },
    { id: 5, title: 'Mr.', name: 'Steven', lastName: 'Buchanan' },
  ];

  test('default render', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: sortingData,
      height: 500,
      columns: [
        { dataField: 'id' },
        { dataField: 'title', sortOrder: 'desc' },
        { dataField: 'name' },
        { dataField: 'lastName' },
      ],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('multiple sorting', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: sortingData,
      height: 500,
      columns: [
        { dataField: 'id' },
        { dataField: 'title', sortOrder: 'desc' },
        { dataField: 'name', sortOrder: 'asc' },
        { dataField: 'lastName' },
      ],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('sort index API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: sortingData,
      height: 500,
      columns: [
        { dataField: 'id' },
        { dataField: 'title', sortOrder: 'desc', sortIndex: 1 },
        { dataField: 'name', sortOrder: 'asc', sortIndex: 0 },
        { dataField: 'lastName' },
      ],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('showSortIndexes false', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: sortingData,
      height: 500,
      sorting: { showSortIndexes: false },
      columns: [
        { dataField: 'id' },
        { dataField: 'title', sortOrder: 'desc', sortIndex: 1 },
        { dataField: 'name', sortOrder: 'asc', sortIndex: 0 },
        { dataField: 'lastName' },
      ],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('allowSorting false on column', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: sortingData,
      height: 500,
      sorting: { showSortIndexes: false },
      columns: [
        { dataField: 'id' },
        { dataField: 'title', sortOrder: 'desc', sortIndex: 1, allowSorting: false },
        { dataField: 'name', sortOrder: 'asc', sortIndex: 0 },
        { dataField: 'lastName' },
      ],
    });
    await a11yCheck(page, {}, '#container');
  });
});
