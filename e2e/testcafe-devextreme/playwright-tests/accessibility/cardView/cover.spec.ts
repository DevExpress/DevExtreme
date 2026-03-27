import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - CardView cover', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const coverData = [
    {
      ID: 1, FirstName: 'John', LastName: 'Heart', Position: 'CEO',
    },
    {
      ID: 2, FirstName: 'Olivia', LastName: 'Peyton', Position: 'Sales Assistant',
    },
    {
      ID: 3, FirstName: 'Robert', LastName: 'Reagan', Position: 'CMO',
    },
  ];

  test('default render', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      width: 1000,
      height: 600,
      columns: ['FirstName', 'LastName'],
      dataSource: coverData,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('with cardCover and altExpr', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      width: 1000,
      height: 600,
      columns: ['FirstName', 'Position'],
      cardCover: {
        imageExpr: () => undefined,
        altExpr: 'FirstName',
      },
      dataSource: coverData,
    });
    await a11yCheck(page, {}, '#container');
  });
});
