import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - CardView headerFilter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('header filter accessibility check', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { A: 'A_0', B: 'B_0' },
        { A: 'A_1', B: 'B_1' },
      ],
      columns: ['A', 'B'],
      headerFilter: { visible: true },
      height: 600,
    });
    await a11yCheck(page, {}, '#container');
  });
});
