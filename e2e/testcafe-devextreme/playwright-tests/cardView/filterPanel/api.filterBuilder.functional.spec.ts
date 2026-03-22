import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('CardView - FilterBuilder API', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('filterBuilder.height API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
        { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
        { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
        { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
      ],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      filterPanel: { visible: true },
      filterBuilder: { height: 500 },
    });

    await page.locator('.dx-cardview-filter-panel .dx-icon-filter').click();
    await page.waitForSelector('.dx-filterbuilder-popup');

    const fbHeight = await page.locator('.dx-filterbuilder').evaluate(el => el.clientHeight);
    expect(fbHeight).toBe(500);

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('filterBuilder.height', 700);
    });

    const newHeight = await page.locator('.dx-filterbuilder').evaluate(el => el.clientHeight);
    expect(newHeight).toBe(700);
  });

  test('filterBuilder.hint API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
        { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
        { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
        { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
      ],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      filterPanel: { visible: true },
      filterBuilder: { hint: 'Test' },
    });

    await page.locator('.dx-cardview-filter-panel .dx-icon-filter').click();
    await page.waitForSelector('.dx-filterbuilder-popup');

    const hint = await page.locator('.dx-filterbuilder').getAttribute('title');
    expect(hint).toBe('Test');

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('filterBuilder.hint', 'Test2');
    });

    const newHint = await page.locator('.dx-filterbuilder').getAttribute('title');
    expect(newHint).toBe('Test2');
  });
});
