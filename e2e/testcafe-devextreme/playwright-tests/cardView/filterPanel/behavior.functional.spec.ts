import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('CardView - FilterPanel Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('FilterIcon opens popup by click', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
      ],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      filterPanel: { visible: true },
    });

    const popup = page.locator('.dx-filterbuilder-popup');
    await expect(popup).not.toBeVisible();

    await page.locator('.dx-cardview-filter-panel .dx-icon-filter').click();
    await expect(popup).toBeVisible();
  });

  test('FilterText opens popup by click', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
      ],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      filterPanel: { visible: true },
    });

    const popup = page.locator('.dx-filterbuilder-popup');
    await expect(popup).not.toBeVisible();

    await page.locator('.dx-cardview-filter-panel .dx-cardview-filter-panel-text').click();
    await expect(popup).toBeVisible();
  });

  test('ClearFilter button clears filter by click', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
        { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
        { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
        { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
      ],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      filterPanel: { visible: true },
      filterValue: ['title', '=', 'Mr.'],
    });

    await page.locator('.dx-cardview-filter-panel .dx-cardview-filter-panel-clear-filter').click();

    const filterValue = await page.evaluate(() => {
      return ($('#container') as any).dxCardView('instance').option('filterValue');
    });
    expect(filterValue).toBeNull();
  });
});
