import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('CardView - SearchPanel Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Search panel should filter cards', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
        { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
        { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
        { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
      ],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      searchPanel: { visible: true },
    });

    const cards = page.locator('.dx-cardview-card');
    await expect(cards).toHaveCount(4);

    const input = page.locator('.dx-cardview-search-panel .dx-texteditor-input');
    await input.fill('rt');
    await expect(cards).toHaveCount(2);

    await input.fill('');
    await expect(cards).toHaveCount(4);
  });
});
