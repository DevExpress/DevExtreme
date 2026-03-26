import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('CardView - FilterPanel API', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('filterPanel.visible API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
      ],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      filterPanel: { visible: false },
      filterValue: ['title', '=', 'Mr.'],
    });

    const filterPanel = page.locator('.dx-datagrid-filter-panel');
    await expect(filterPanel).not.toBeVisible();

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('filterPanel.visible', true);
    });

    await expect(filterPanel).toBeVisible();
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
      filterPanel: { visible: true },
      filterValue: ['title', '=', 'Mr.'],
    });

    const cards = page.locator('.dx-cardview-card');
    await expect(cards).toHaveCount(3);

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').clearFilter();
    });

    await expect(cards).toHaveCount(4);
  });
});
