import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('CardView - SearchPanel API', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('searchPanel.visible API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' }],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      searchPanel: { visible: true },
    });

    const searchBox = page.locator('.dx-cardview-search');
    await expect(searchBox).toBeVisible();

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('searchPanel.visible', false);
    });
    await expect(searchBox).not.toBeVisible();

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('searchPanel.visible', true);
    });
    await expect(searchBox).toBeVisible();
  });

  test('searchPanel.text API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' }],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      searchPanel: { visible: true, text: 'rt' },
    });

    const input = page.locator('.dx-cardview-search .dx-texteditor-input');
    await expect(input).toHaveValue('rt');

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('searchPanel.text', '');
    });
    await expect(input).toHaveValue('');
  });
});
