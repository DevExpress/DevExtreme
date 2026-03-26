import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, getContainerUrl } from '../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../tests/container.html');

async function createCardViewWithPager(page, config = {}) {
  const dataSource = Array.from({ length: 20 }, (_, i) => ({ text: i.toString(), value: i }));
  return createWidget(page, 'dxCardView', {
    dataSource,
    columns: ['text', 'value'],
    paging: { pageSize: 2, pageIndex: 5 },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [2, 3, 4],
      showInfo: true,
      showNavigationButtons: true,
    },
    ...config,
  });
}

test.describe('CardView - Pager', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Page index interaction', async ({ page }) => {
    await createCardViewWithPager(page);

    const pagerInfo = page.locator('.dx-info');
    await expect(pagerInfo).toHaveText('Page 6 of 10 (20 items)');

    await page.locator('.dx-page').filter({ hasText: '7' }).click();
    await expect(pagerInfo).toHaveText('Page 7 of 10 (20 items)');

    await page.locator('.dx-prev-button').click();
    await expect(pagerInfo).toHaveText('Page 6 of 10 (20 items)');
  });

  [true, false].forEach((remoteOperation) => {
    test.skip(`Runtime filterValue change updates paging when remoteOperations = ${remoteOperation}`, async ({ page }) => {
      await createCardViewWithPager(page, { remoteOperations: remoteOperation });

      await page.evaluate(() => {
        ($('#container') as any).dxCardView('instance').option('filterValue', [
          ['value', '=', '1'],
          'or', ['value', '=', '2'],
          'or', ['value', '=', '3'],
          'or', ['value', '=', '4'],
        ]);
      });

      await testScreenshot(page, `filter-value-edit-paging-update-remoteOperations-${remoteOperation}.png`, {
        element: page.locator('#container'),
      });
    });
  });

  test('Paging after resetting filter', async ({ page }) => {
    await createCardViewWithPager(page, { filterPanel: { visible: true } });

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('filterValue', ['text', '=', '0']);
    });

    const pager = page.locator('.dx-pagination');
    await expect(pager).not.toBeVisible();

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').clearFilter();
    });

    await expect(pager).toBeVisible();
    const pagerInfo = page.locator('.dx-info');
    await expect(pagerInfo).toHaveText('Page 1 of 10 (20 items)');
  });
});
