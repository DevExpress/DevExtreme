import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - CardView search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const searchData = [
    { id: 1, firstName: 'Darin', lastName: 'Heritege', email: 'dheritege0@jugem.jp', gender: 'Male' },
    { id: 2, firstName: 'Aeriel', lastName: 'Giggs', email: 'agiggs1@hubpages.com', gender: 'Female' },
    { id: 3, firstName: 'Theo', lastName: 'Aleksidze', email: 'taleksidze2@patch.com', gender: 'Female' },
    { id: 4, firstName: 'Dalli', lastName: 'Ashwood', email: 'dashwood3@buzzfeed.com', gender: 'Male' },
    { id: 5, firstName: 'Paule', lastName: 'Pidgeley', email: 'ppidgeley4@upenn.edu', gender: 'Female' },
  ];

  test('search accessibility check', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ A: 'A_0' }, { A: 'A_1' }],
      columns: ['A'],
      searchPanel: { visible: true, text: 'A_0' },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('search with visible panel and no text', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: searchData,
      columns: ['id', 'firstName', 'lastName', 'email', 'gender'],
      searchPanel: { visible: true },
      height: 600,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('highlighted search text', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: searchData,
      columns: ['id', 'firstName', 'lastName', 'email', 'gender'],
      searchPanel: { visible: true, text: 'da' },
      height: 600,
    });
    await a11yCheck(page, {}, '#container');
  });
});
