import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const baseData = [
  { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
  { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
  { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
  { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
];

const baseColumns = [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }];

test.describe.skip('CardView - FilterPanel Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('filterEnabled checkbox switches the filter by keyboard', async ({ page }) => {
    await page.evaluate(() => {
      const el = document.createElement('button');
      el.id = 'other-btn';
      document.body.appendChild(el);
    });

    await createWidget(page, 'dxCardView', {
      dataSource: baseData,
      columns: baseColumns,
      filterPanel: { visible: true, filterEnabled: false },
      filterValue: ['title', '=', 'Mr.'],
    });

    const cards = page.locator('.dx-cardview-card');
    await expect(cards).toHaveCount(4);

    await page.locator('#other-btn').click();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Space');
    await expect(cards).toHaveCount(3);

    await page.locator('#other-btn').click();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Space');
    await expect(cards).toHaveCount(4);
  });

  test('filterEnabled checkbox switches the filter by click', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: baseData,
      columns: baseColumns,
      filterPanel: { visible: true, filterEnabled: false },
      filterValue: ['title', '=', 'Mr.'],
    });

    const cards = page.locator('.dx-cardview-card');
    await expect(cards).toHaveCount(4);

    const checkbox = page.locator('.dx-datagrid-filter-panel .dx-checkbox');
    await checkbox.click();
    await expect(cards).toHaveCount(3);

    await checkbox.click();
    await expect(cards).toHaveCount(4);
  });

  test('FilterIcon opens popup by click', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' }],
      columns: baseColumns,
      filterPanel: { visible: true },
    });

    const popup = page.locator('.dx-popup-wrapper:has(.dx-filterbuilder)');
    await expect(popup).not.toBeVisible();

    await page.locator('.dx-datagrid-filter-panel .dx-icon-filter').click();
    await expect(popup).toBeVisible();
  });

  test('FilterText opens popup by click', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' }],
      columns: baseColumns,
      filterPanel: { visible: true },
    });

    const popup = page.locator('.dx-popup-wrapper:has(.dx-filterbuilder)');
    await expect(popup).not.toBeVisible();

    await page.locator('.dx-datagrid-filter-panel .dx-datagrid-filter-panel-text').click();
    await expect(popup).toBeVisible();
  });

  test('FilterIcon opens popup by keyboard', async ({ page }) => {
    await page.evaluate(() => {
      const el = document.createElement('button');
      el.id = 'other-btn';
      document.body.appendChild(el);
    });

    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' }],
      columns: baseColumns,
      filterPanel: { visible: true },
    });

    const popup = page.locator('.dx-popup-wrapper:has(.dx-filterbuilder)');
    await expect(popup).not.toBeVisible();

    await page.locator('#other-btn').click();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Enter');
    await expect(popup).toBeVisible();
  });

  test('FilterText opens popup by click by keyboard', async ({ page }) => {
    await page.evaluate(() => {
      const el = document.createElement('button');
      el.id = 'other-btn';
      document.body.appendChild(el);
    });

    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' }],
      columns: baseColumns,
      filterPanel: { visible: true },
    });

    const popup = page.locator('.dx-popup-wrapper:has(.dx-filterbuilder)');
    await expect(popup).not.toBeVisible();

    await page.locator('#other-btn').click();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Enter');
    await expect(popup).toBeVisible();
  });

  test('ClearFilter button clears filter by keyboard', async ({ page }) => {
    await page.evaluate(() => {
      const el = document.createElement('button');
      el.id = 'other-btn';
      document.body.appendChild(el);
    });

    await createWidget(page, 'dxCardView', {
      dataSource: baseData,
      columns: baseColumns,
      filterPanel: { visible: true },
      filterValue: ['title', '=', 'Mr.'],
    });

    await page.locator('#other-btn').click();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Enter');

    const filterValue = await page.evaluate(() => {
      return ($('#container') as any).dxCardView('instance').option('filterValue');
    });
    expect(filterValue).toBeNull();
  });

  test('ClearFilter button clears filter by click', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: baseData,
      columns: baseColumns,
      filterPanel: { visible: true },
      filterValue: ['title', '=', 'Mr.'],
    });

    await page.locator('.dx-datagrid-filter-panel .dx-datagrid-filter-panel-clear-filter').click();

    const filterValue = await page.evaluate(() => {
      return ($('#container') as any).dxCardView('instance').option('filterValue');
    });
    expect(filterValue).toBeNull();
  });

  test('Focus returns to FilterIcon after FilterPopup is closed', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: baseData,
      columns: baseColumns,
      filterPanel: { visible: true },
    });

    await page.locator('.dx-datagrid-filter-panel .dx-icon-filter').click();
    const popup = page.locator('.dx-popup-wrapper:has(.dx-filterbuilder)');
    await expect(popup).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(popup).not.toBeVisible();

    const filterIcon = page.locator('.dx-datagrid-filter-panel .dx-icon-filter');
    await expect(filterIcon).toBeFocused();
  });
});
