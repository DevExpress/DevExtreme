import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import Pagination from '../../../models/pagination';

test.describe('Pagination Base Properties', () => {
  test('Pagination visible property', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      itemCount: 50,
      visible: false,
    });

    const pagination = new Pagination(page, '#container');

    await pagination.expectClass('dx-state-invisible');
  });

  test('PageSize selector test', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      itemCount: 50,
      pageIndex: 2,
      pageSize: 8,
      allowedPageSizes: [2, 4, 8],
    });

    const pagination = new Pagination(page, '#container');

    await pagination.getPageSize(1).click();

    await expect.poll(() => pagination.option('pageCount')).toBe(13);
  });

  test('PageIndex test', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      itemCount: 50,
      pageIndex: 1,
      pageSize: 5,
    });

    const pagination = new Pagination(page, '#container');

    await expect.poll(() => pagination.option('pageIndex')).toBe(1);

    await pagination.getNavPage('5').click();

    await expect.poll(() => pagination.option('pageIndex')).toBe(5);
  });

  test('PageIndex correction test', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      itemCount: 50,
      pageIndex: 10,
      pageSize: 5,
    });

    const pagination = new Pagination(page, '#container');

    await expect.poll(() => pagination.option('pageIndex')).toBe(10);

    await pagination.getPageSize(1).click();

    await expect.poll(() => pagination.option('pageIndex')).toBe(5);
  });
});
