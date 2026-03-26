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

    await page.locator('.dx-datagrid-filter-panel .dx-icon-filter').click();
    await page.waitForSelector('.dx-popup-normal:has(.dx-filterbuilder)');

    const contentHeight = await page.locator('.dx-popup-normal:has(.dx-filterbuilder)').evaluate(el => el.offsetHeight);
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

    await page.locator('.dx-datagrid-filter-panel .dx-icon-filter').click();
    await page.waitForSelector('.dx-popup-normal:has(.dx-filterbuilder)');

    const titleText = await page.locator('.dx-popup-normal:has(.dx-filterbuilder) .dx-popup-title.dx-toolbar').innerText();
    expect(titleText).toBe('Test');
  });
});
