import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('CardView - ColumnChooser.A11y.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('column chooser popup should have aria-label attribute', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columnChooser: {
        enabled: true,
      },
      columns: ['Column 1'],
    });

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxCardView('instance');
      instance.showColumnChooser();
    });

    const ariaLabel = await page.locator('.dx-cardview-column-chooser .dx-overlay-content').getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });
});
