import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('CardView - Search.A11y.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Search field should have aria-label attribute', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' }],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      searchPanel: { visible: true },
    });

    const ariaLabel = await page.locator('.dx-cardview-search .dx-texteditor-input').getAttribute('aria-label');
    expect(ariaLabel).toBe('Search in the card view');
  });
});
