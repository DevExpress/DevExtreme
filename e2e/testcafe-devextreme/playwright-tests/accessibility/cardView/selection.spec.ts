import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - CardView selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('single mode', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1, A: 'A_0' }, { id: 2, A: 'A_1' }],
      keyExpr: 'id',
      columns: ['A'],
      selection: { mode: 'single' },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('multiple mode', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1, A: 'A_0' }, { id: 2, A: 'A_1' }],
      keyExpr: 'id',
      columns: ['A'],
      selection: { mode: 'multiple', showCheckBoxesMode: 'always' },
    });
    await a11yCheck(page, {}, '#container');
  });
});
