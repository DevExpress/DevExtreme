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

test.describe('CardView - Sorting Behavior - Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Change sorting by header click in single mode', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: data,
      sorting: { mode: 'single' },
      columns: [{ dataField: 'title' }, { dataField: 'name' }],
    });

    const titleHeader = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await titleHeader.click();

    const sortOrder = await page.evaluate(() => {
      return ($('#container') as any).dxCardView('instance').columnOption('title', 'sortOrder');
    });
    expect(sortOrder).toBe('asc');
  });

  test('Sorting should work with computed columns', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
      keyExpr: 'id',
      columns: [{
        caption: 'Computed',
        allowSorting: true,
        calculateFieldValue: ({ id }) => `str_${id}`,
      }],
    });

    const headerItem = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await headerItem.click();

    const firstValue = await page.locator('.dx-cardview-card').first().locator('.dx-cardview-field-value').textContent();
    expect(firstValue).toBe('str_0');

    await headerItem.click();

    const newFirstValue = await page.locator('.dx-cardview-card').first().locator('.dx-cardview-field-value').textContent();
    expect(newFirstValue).toBe('str_3');
  });

  test('Change sorting via context menu', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: data,
      sorting: { mode: 'single' },
      columns: [{ dataField: 'title' }, { dataField: 'name' }],
    });

    const titleHeader = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await titleHeader.click({ button: 'right' });
    await page.locator('.dx-context-menu .dx-menu-item').nth(0).click();

    const sortOrder = await page.evaluate(() => {
      return ($('#container') as any).dxCardView('instance').columnOption('title', 'sortOrder');
    });
    expect(sortOrder).toBe('asc');
  });
});
