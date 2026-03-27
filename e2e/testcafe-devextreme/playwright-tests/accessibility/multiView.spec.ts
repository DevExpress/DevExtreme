import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - multiView', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxMultiView', { dataSource: ['Item_1', 'Item_2', 'Item_3'], height: 300, focusStateEnabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('empty multi view', async ({ page }) => {
    await createWidget(page, 'dxMultiView', { dataSource: [], height: 300, noDataText: 'no data text' });
    await a11yCheck(page, {}, '#container');
  });

  test('multi view with loop enabled', async ({ page }) => {
    await createWidget(page, 'dxMultiView', { dataSource: ['Item_1', 'Item_2', 'Item_3'], height: 300, loop: true });
    await a11yCheck(page, {}, '#container');
  });

  test('multi view with loop disabled', async ({ page }) => {
    await createWidget(page, 'dxMultiView', { dataSource: ['Item_1', 'Item_2', 'Item_3'], height: 300, loop: false });
    await a11yCheck(page, {}, '#container');
  });

  test('multi view empty with loop enabled', async ({ page }) => {
    await createWidget(page, 'dxMultiView', { dataSource: [], height: 300, loop: true, noDataText: 'no data text', focusStateEnabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('multi view with selectedIndex set', async ({ page }) => {
    await createWidget(page, 'dxMultiView', { dataSource: ['Item_1', 'Item_2', 'Item_3'], height: 300, selectedIndex: 1 });
    await a11yCheck(page, {}, '#container');
  });

  test('multi view with swipe disabled', async ({ page }) => {
    await createWidget(page, 'dxMultiView', { dataSource: ['Item_1', 'Item_2', 'Item_3'], height: 300, swipeEnabled: false });
    await a11yCheck(page, {}, '#container');
  });

  test('multi view with single item', async ({ page }) => {
    await createWidget(page, 'dxMultiView', { dataSource: ['Only Item'], height: 300 });
    await a11yCheck(page, {}, '#container');
  });

  test('multi view with deferRendering false', async ({ page }) => {
    await createWidget(page, 'dxMultiView', { dataSource: ['Item_1', 'Item_2', 'Item_3'], height: 300, deferRendering: false });
    await a11yCheck(page, {}, '#container');
  });
});
