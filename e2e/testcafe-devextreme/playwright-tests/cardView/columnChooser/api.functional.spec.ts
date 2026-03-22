import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('CardView - ColumnChooser.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('public method showColumnChooser', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: ['Column 1'],
      columnChooser: {
        enabled: true,
      },
    });

    const columnChooser = page.locator('.dx-cardview-column-chooser');
    await expect(columnChooser).not.toBeVisible();

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').showColumnChooser();
    });
    await expect(columnChooser).toBeVisible();
  });

  test('public method hideColumnChooser', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: ['Column 1'],
      columnChooser: {
        enabled: true,
      },
    });

    await page.locator('.dx-cardview-column-chooser-button').click();
    const columnChooser = page.locator('.dx-cardview-column-chooser');
    await expect(columnChooser).toBeVisible();

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').hideColumnChooser();
    });
    await expect(columnChooser).not.toBeVisible();
  });
});
