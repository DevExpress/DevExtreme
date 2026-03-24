import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - CardView sortable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('sortable accessibility check', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1, A: 'A_0' }, { id: 2, A: 'A_1' }, { id: 3, A: 'A_2' }],
      keyExpr: 'id',
      columns: ['A'],
      rowDragging: { allowReordering: true },
    });
    await a11yCheck(page, {}, '#container');
  });
});
