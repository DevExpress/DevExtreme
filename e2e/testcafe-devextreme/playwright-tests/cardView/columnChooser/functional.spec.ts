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

  test('column chooser in select mode should work after multiple hide/show actions', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
      ],
      columns: ['a', 'b', 'c'],
      columnChooser: {
        enabled: true,
        mode: 'select',
      },
    });

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').showColumnChooser();
    });

    const columnChooser = page.locator('.dx-cardview-column-chooser');
    const checkboxes = columnChooser.locator('.dx-checkbox');

    await checkboxes.nth(0).click();
    await expect(checkboxes).toHaveCount(3);

    await checkboxes.nth(0).click();
    await expect(checkboxes).toHaveCount(3);

    await checkboxes.nth(0).click();
    await checkboxes.nth(0).click();
  });

  test('column chooser in dragAndDrop mode should work after multiple hide/show actions', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
      ],
      columns: ['a', 'b', 'c'],
      columnChooser: {
        enabled: true,
        mode: 'dragAndDrop',
      },
    });

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').showColumnChooser();
    });

    const headerItems = page.locator('.dx-cardview-headers .dx-cardview-header-item');
    await expect(headerItems).toHaveCount(3);
  });

  test('ColumnChooser should receive and render custom texts', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).DevExpress.localization.loadMessages({
        en: {
          'dxDataGrid-columnChooserTitle': 'customTitle',
          'dxDataGrid-columnChooserEmptyText': 'customEmptyText',
        },
      });
    });

    await createWidget(page, 'dxCardView', {
      dataSource: [],
      keyExpr: 'ID',
      cardsPerRow: 'auto',
      cardMinWidth: 300,
      columnChooser: {
        enabled: true,
        mode: 'dragAndDrop',
        height: '340px',
      },
      columns: [],
    });

    await page.locator('.dx-cardview-column-chooser-button').click();

    const columnChooser = page.locator('.dx-cardview-column-chooser');
    const title = columnChooser.locator('.dx-popup-title');
    const emptyMessage = columnChooser.locator('.dx-empty-message');

    await expect(title).toHaveText('customTitle');
    await expect(emptyMessage).toHaveText('customEmptyText');
  });
});
