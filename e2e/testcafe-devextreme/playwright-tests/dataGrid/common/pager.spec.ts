import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Pager', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  async function createDataGridWithPager(page: any): Promise<any> {
    const dataSource = Array.from({ length: 100 }, (_, room) => ({ name: 'Alex', phone: '555555', room }));
    return createWidget(page, 'dxDataGrid', {
      dataSource,
      columns: ['name', 'phone', 'room'],
      paging: {
        pageSize: 5,
        pageIndex: 5,
      },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [5, 10, 20],
        showInfo: true,
        showNavigationButtons: true,
      },
    });
  }
  );

  test('Full size pager', async ({ page }) => {
    await createDataGridWithPager();

      const pager = page.locator('.dx-pager');
    await page.setViewportSize({ width: 900, height: 600 });
    expect(await pager.locator('.dx-page-size').nth(0).evaluate(el => el.classList.contains('dx-selection')));
    await t.ok('page size 5 selected');
    expect(await pager.locator('.dx-page').filter({hasText: '6'}).evaluate(el => el.classList.contains('dx-selection')));
    await t.ok('page 6 selected');
    expect(await pager.locator('.dx-info').textContent);
    await t.eql('Page 6 of 20 (100 items)');
    expect(await page.locator('.dx-data-row').nth(29).locator('td').nth(2).textContent());
    await t.eql('29');
    // set page sige to 10
    await (pager.locator('.dx-page-size').nth(1).element).click();
    expect(await page.locator('.dx-data-row').nth(10 * 6 - 1).locator('td').nth(2).textContent());
    await t.eql('59');
    // set page index 7
    await (pager.locator('.dx-page').filter({hasText: '7'}).element).click();
    expect(await page.locator('.dx-data-row').nth(10 * 7 - 1).locator('td').nth(2).textContent());
    await t.eql('69');
    expect(await pager.locator('.dx-info').textContent);
    await t.eql('Page 7 of 10 (100 items)');
    // navigate to prev page (6)
    await (pager.locator('.dx-navigate-button.dx-prev-button').element).click();
    expect(await pager.locator('.dx-info').textContent);
    await t.eql('Page 6 of 10 (100 items)');
    // navigate to next page (7)
    await (pager.locator('.dx-navigate-button.dx-next-button').element).click();
    expect(await pager.locator('.dx-info').textContent);
    await t.eql('Page 7 of 10 (100 items)');

    await testScreenshot(page, 'pager-full-allpages.png');
  });
});
