import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const DATA_SOURCE = [
  { id: 0, label: 'A', value: 350 },
  { id: 1, parentId: 0, label: 'B', value: 1200 },
  { id: 2, parentId: 0, label: 'C', value: 750 },
];

test.describe('Accessibility - TreeList status', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('rows expanded', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
      dataSource: DATA_SOURCE,
      rootValue: -1,
      keyExpr: 'id',
      parentIdExpr: 'parentId',
      autoExpandAll: true,
      columns: ['label', 'value'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('rows collapsed', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
      dataSource: DATA_SOURCE,
      rootValue: -1,
      keyExpr: 'id',
      parentIdExpr: 'parentId',
      autoExpandAll: false,
      columns: ['label', 'value'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('with selection mode multiple', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
      dataSource: DATA_SOURCE,
      rootValue: -1,
      keyExpr: 'id',
      parentIdExpr: 'parentId',
      autoExpandAll: true,
      selection: { mode: 'multiple' },
      columns: ['label', 'value'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('with paging enabled', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
      dataSource: DATA_SOURCE,
      rootValue: -1,
      keyExpr: 'id',
      parentIdExpr: 'parentId',
      autoExpandAll: true,
      paging: { enabled: true, pageSize: 2 },
      columns: ['label', 'value'],
    });
    await a11yCheck(page, {}, '#container');
  });
});
