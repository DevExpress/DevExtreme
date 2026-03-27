import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - CardView editing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const baseData = [
    { id: 1, name: 'Item 1', value: 100 },
    { id: 2, name: 'Item 2', value: 200 },
    { id: 3, name: 'Item 3', value: 300 },
  ];

  test('default render', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: ['name', 'value'],
      dataSource: baseData,
      keyExpr: 'id',
      editing: { allowUpdating: true, allowDeleting: true, allowAdding: true },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('add card popup', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: ['name', 'value'],
      dataSource: baseData,
      keyExpr: 'id',
      editing: { allowUpdating: true, allowDeleting: true, allowAdding: true },
    });
    await page.click('.dx-cardview-add-button, .dx-toolbar .dx-button[aria-label="Add"], .dx-addrow-button');
    await page.waitForTimeout(300);
    await a11yCheck(page, {}, '#container');
  });

  test('edit card popup', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: ['name', 'value'],
      dataSource: baseData,
      keyExpr: 'id',
      editing: { allowUpdating: true, allowDeleting: true, allowAdding: true },
    });
    await page.click('.dx-cardview-edit-button, .dx-card .dx-button[aria-label="Edit"]');
    await page.waitForTimeout(300);
    await a11yCheck(page, {}, '#container');
  });
});
