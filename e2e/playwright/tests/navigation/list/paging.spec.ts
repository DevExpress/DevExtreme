import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import { isMaterial } from '../../../helpers/themeUtils';
import List from '../../../models/list';

const generateData = (count: number): { id: number }[] => Array.from(
  { length: count },
  (_, i) => ({ id: i + 1 }),
);

const createPagedList = (
  page: Page,
  store: object[],
  height: number,
): Promise<void> => createWidget(page, 'dxList', {
  dataSource: {
    store,
    paginate: true,
    pageSize: 2,
  },
  height,
  width: 200,
  pageLoadMode: 'scrollBottom',
  valueExpr: 'id',
  displayExpr: 'id',
});

test.describe('List', () => {
  test('Should initiate load next pages if items on the first pages are invisible', async ({ page, theme }) => {
    await createPagedList(page, generateData(12).map((data) => ({
      ...data,
      visible: data.id > 8,
    })), 100);

    const list = new List(page, '#container');

    await expect(list.items).toHaveCount(isMaterial(theme) ? 10 : 12);
    await expect(list.visibleItems).toHaveCount(isMaterial(theme) ? 2 : 4);

    await testScreenshot(page, 'List loading with first items invisible.png', { element: '#container' });
  });

  test('Should initiate load next page if all items in the current load are invisible, pageLoadMode: scrollBottom (T1092746)', async ({ page, theme }) => {
    await createPagedList(page, generateData(12).map((data) => ({
      ...data,
      visible: data.id <= 4 || data.id > 8,
    })), 100);

    const list = new List(page, '#container');

    await list.scrollTo(100);

    await expect(list.items).toHaveCount(isMaterial(theme) ? 4 : 10);
    await expect(list.visibleItems).toHaveCount(isMaterial(theme) ? 4 : 6);

    await testScreenshot(page, 'List loading with middle items invisible.png', { element: '#container' });
  });

  test('Should initiate load next page if some items in the current load are invisible, pageLoadMode: scrollBottom', async ({ page, theme }) => {
    await createPagedList(page, generateData(12).map((data) => ({
      ...data,
      visible: data.id <= 4 || data.id === 8 || data.id === 11,
    })), 100);

    const list = new List(page, '#container');

    await list.scrollTo(100);

    await expect(list.items).toHaveCount(isMaterial(theme) ? 4 : 12);
    await expect(list.visibleItems).toHaveCount(isMaterial(theme) ? 4 : 6);

    await testScreenshot(page, 'List loading with part items invisible on loaded page.png', { element: '#container' });
  });

  test('Should initiate load next page if all items on next pages are invisible', async ({ page, theme }) => {
    await createPagedList(page, generateData(12).map((data) => ({
      ...data,
      visible: data.id <= 4,
    })), 100);

    const list = new List(page, '#container');

    await list.scrollTo(100);

    await expect(list.items).toHaveCount(isMaterial(theme) ? 4 : 12);
    await expect(list.visibleItems).toHaveCount(4);

    await testScreenshot(page, 'List loading with last items invisible.png', { element: '#container' });
  });

  test('Should not initiate load next page if not reach the bottom when pullRefreshEnabled is true', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: {
        store: generateData(12),
        paginate: true,
        pageSize: 2,
      },
      pullRefreshEnabled: true,
      height: 130,
      width: 200,
      pageLoadMode: 'scrollBottom',
      valueExpr: 'id',
      displayExpr: 'id',
    });

    const list = new List(page, '#container');

    await list.scrollTo(1);

    await expect(list.items).toHaveCount(4);
  });

  test('Should initiate load next page on select last item by keyboard', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: {
        store: generateData(12),
        paginate: true,
        pageSize: 3,
      },
      pullRefreshEnabled: true,
      height: 160,
      width: 200,
      pageLoadMode: 'scrollBottom',
      valueExpr: 'id',
      displayExpr: 'id',
    });

    const list = new List(page, '#container');

    await list.focus();

    await expect(list.items).toHaveCount(6);

    for (let i = 0; i < 5; i += 1) {
      await page.keyboard.press('ArrowDown');
    }

    await expect(list.items).toHaveCount(9);
  });
});
