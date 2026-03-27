import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - actionSheet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxActionSheet', { dataSource: [{ text: 'Call' }, { text: 'Send message' }, { text: 'Edit' }] });
    await a11yCheck(page, {}, '#container');
  });

  test('action sheet with title', async ({ page }) => {
    await createWidget(page, 'dxActionSheet', {
      dataSource: [{ text: 'Call' }, { text: 'Send message' }],
      title: 'Actions',
      showTitle: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('action sheet without cancel button', async ({ page }) => {
    await createWidget(page, 'dxActionSheet', {
      dataSource: [{ text: 'Call' }, { text: 'Send message' }],
      showCancelButton: false,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('empty action sheet', async ({ page }) => {
    await createWidget(page, 'dxActionSheet', { dataSource: [] });
    await a11yCheck(page, {}, '#container');
  });

  test('action sheet with cancelText', async ({ page }) => {
    await createWidget(page, 'dxActionSheet', { dataSource: [{ text: 'Call' }, { text: 'Send message' }], showCancelButton: true, cancelText: 'Cancel' });
    await a11yCheck(page, {}, '#container');
  });

  test('action sheet empty with title', async ({ page }) => {
    await createWidget(page, 'dxActionSheet', { dataSource: [], title: 'title', showTitle: true });
    await a11yCheck(page, {}, '#container');
  });

  test('action sheet with disabled item', async ({ page }) => {
    await createWidget(page, 'dxActionSheet', {
      dataSource: [{ text: 'Call' }, { text: 'Delete', disabled: true }],
      title: 'Actions',
      showTitle: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('action sheet with single item', async ({ page }) => {
    await createWidget(page, 'dxActionSheet', { dataSource: [{ text: 'Confirm' }], showCancelButton: true });
    await a11yCheck(page, {}, '#container');
  });

  test('action sheet without cancel and with title', async ({ page }) => {
    await createWidget(page, 'dxActionSheet', {
      dataSource: [{ text: 'Call' }, { text: 'Send message' }],
      showCancelButton: false,
      showTitle: true,
      title: 'Choose action',
    });
    await a11yCheck(page, {}, '#container');
  });
});
