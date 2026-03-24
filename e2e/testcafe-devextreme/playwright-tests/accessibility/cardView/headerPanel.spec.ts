import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - CardView headerPanel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('default render', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ A: 'A_0', B: 'B_0' }],
      columns: ['A', 'B'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('with header filter', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ A: 'A_0', B: 'B_0' }],
      columns: ['A', 'B'],
      headerFilter: { visible: true },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('with sorting', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ A: 'A_0', B: 'B_0' }],
      columns: [{ dataField: 'A', sortOrder: 'asc' }, 'B'],
      sorting: { mode: 'single' },
    });
    await a11yCheck(page, {}, '#container');
  });
});
