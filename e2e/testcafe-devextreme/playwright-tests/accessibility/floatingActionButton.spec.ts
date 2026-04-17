import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - floatingActionButton', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxSpeedDialAction', { label: 'label', icon: 'save' });
    await a11yCheck(page, {}, '#container');
  });

  test('floatingActionButton without label', async ({ page }) => {
    await createWidget(page, 'dxSpeedDialAction', { label: '', icon: 'save' });
    await a11yCheck(page, {}, '#container');
  });

  test('floatingActionButton without icon', async ({ page }) => {
    await createWidget(page, 'dxSpeedDialAction', { label: 'label' });
    await a11yCheck(page, {}, '#container');
  });

  test('floatingActionButton without label and icon', async ({ page }) => {
    await createWidget(page, 'dxSpeedDialAction', { label: '' });
    await a11yCheck(page, {}, '#container');
  });

  test('floatingActionButton with index', async ({ page }) => {
    await createWidget(page, 'dxSpeedDialAction', { label: 'Action 1', icon: 'save', index: 1 });
    await a11yCheck(page, {}, '#container');
  });

  test('floatingActionButton disabled', async ({ page }) => {
    await createWidget(page, 'dxSpeedDialAction', { label: 'Disabled', icon: 'trash', disabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('floatingActionButton with different icon', async ({ page }) => {
    await createWidget(page, 'dxSpeedDialAction', { label: 'Add', icon: 'add' });
    await a11yCheck(page, {}, '#container');
  });
});
