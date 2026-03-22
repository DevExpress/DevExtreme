import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('CardView - FilterBuilderPopup API', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('filterBuilderPopup.height API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
      ],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      filterPanel: { visible: true },
      filterBuilderPopup: { height: 500 },
    });

    await page.locator('.dx-cardview-filter-panel .dx-icon-filter').click();
    await page.waitForSelector('.dx-filterbuilder-popup');

    const contentHeight = await page.locator('.dx-filterbuilder-popup .dx-overlay-content').evaluate(el => el.offsetHeight);
    expect(contentHeight).toBe(500);
  });

  test('filterBuilderPopup.title API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
      ],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      filterPanel: { visible: true },
      filterBuilderPopup: { title: 'Test' },
    });

    await page.locator('.dx-cardview-filter-panel .dx-icon-filter').click();
    await page.waitForSelector('.dx-filterbuilder-popup');

    const titleText = await page.locator('.dx-filterbuilder-popup .dx-toolbar').innerText();
    expect(titleText).toBe('Test');
  });
});
