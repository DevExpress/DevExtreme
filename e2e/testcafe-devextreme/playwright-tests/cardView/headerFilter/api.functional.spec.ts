import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('HeaderFilter.API.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('headerFilter.visible API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ A: 'A_0' }, { A: 'A_1' }],
      columns: ['A'],
      headerFilter: { visible: false },
      height: 600,
    });

    const filterIcon = page.locator('.dx-header-filter-icon');
    await expect(filterIcon).not.toBeVisible();

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('headerFilter.visible', true);
    });

    await expect(filterIcon.first()).toBeVisible();
  });

  test('clearFilter API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
        { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
        { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
        { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
      ],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      headerFilter: { visible: true },
    });

    const cards = page.locator('.dx-cardview-card');
    await expect(cards).toHaveCount(4);

    await page.locator('.dx-header-filter-icon').first().click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');
    await page.locator('.dx-list-item').first().click();
    await page.locator('.dx-popup-wrapper.dx-header-filter-menu .dx-button-ok').click();
    await expect(cards).toHaveCount(1);

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').clearFilter();
    });
    await expect(cards).toHaveCount(4);
  });

  test('getCombinedFilter API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
        { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
        { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
        { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
      ],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      headerFilter: { visible: true },
      remoteOperations: true,
    });

    const cards = page.locator('.dx-cardview-card');
    await expect(cards).toHaveCount(4);

    await page.locator('.dx-header-filter-icon').first().click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');
    await page.locator('.dx-list-item').first().click();
    await page.locator('.dx-popup-wrapper.dx-header-filter-menu .dx-button-ok').click();
    await expect(cards).toHaveCount(1);

    const combinedFilter = await page.evaluate(() => {
      return ($('#container') as any).dxCardView('instance').getCombinedFilter();
    });
    expect(combinedFilter).toEqual(['id', '=', 1]);
  });
});
