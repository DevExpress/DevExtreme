import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxTabs', { dataSource: [{ text: 'John Heart' }, { text: 'Robert Reagan' }], width: 450, height: 250 });
    await a11yCheck(page, {}, '#container');
  });

  test('tabs with disabled item', async ({ page }) => {
    await createWidget(page, 'dxTabs', {
      dataSource: [
        { text: 'Tab 1' },
        { text: 'Tab 2', disabled: true },
        { text: 'Tab 3' },
      ],
      width: 450,
      height: 250,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('tabs with navigation buttons', async ({ page }) => {
    await createWidget(page, 'dxTabs', {
      dataSource: [{ text: 'Tab 1' }, { text: 'Tab 2' }, { text: 'Tab 3' }, { text: 'Tab 4' }],
      width: 200,
      height: 250,
      showNavButtons: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('tabs with focused item', async ({ page }) => {
    await createWidget(page, 'dxTabs', {
      dataSource: [{ text: 'Tab 1' }, { text: 'Tab 2' }, { text: 'Tab 3' }],
      width: 450,
      height: 250,
    });
    await page.keyboard.press('Tab');
    await a11yCheck(page, {}, '#container');
  });

  test('tabs without navigation buttons', async ({ page }) => {
    await createWidget(page, 'dxTabs', {
      dataSource: [{ text: 'Tab 1' }, { text: 'Tab 2' }, { text: 'Tab 3' }],
      width: 450,
      height: 250,
      showNavButtons: false,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('tabs with icons', async ({ page }) => {
    await createWidget(page, 'dxTabs', {
      dataSource: [{ text: 'Info', icon: 'info' }, { text: 'Settings', icon: 'preferences' }],
      width: 450,
      height: 250,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('tabs with orientation vertical', async ({ page }) => {
    await createWidget(page, 'dxTabs', {
      dataSource: [{ text: 'Tab 1' }, { text: 'Tab 2' }, { text: 'Tab 3' }],
      width: 200,
      height: 250,
      orientation: 'vertical',
    });
    await a11yCheck(page, {}, '#container');
  });

  test('tabs disabled', async ({ page }) => {
    await createWidget(page, 'dxTabs', {
      dataSource: [{ text: 'Tab 1' }, { text: 'Tab 2' }],
      width: 450,
      height: 250,
      disabled: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('tabs with selectedIndex 1', async ({ page }) => {
    await createWidget(page, 'dxTabs', {
      dataSource: [{ text: 'Tab 1' }, { text: 'Tab 2' }, { text: 'Tab 3' }],
      width: 450,
      height: 250,
      selectedIndex: 1,
    });
    await a11yCheck(page, {}, '#container');
  });
});
