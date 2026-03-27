import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - drawer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxDrawer', { height: 400 });
    await a11yCheck(page, {}, '#container');
  });

  test('drawer opened with slide reveal mode', async ({ page }) => {
    await createWidget(page, 'dxDrawer', {
      height: 400,
      opened: true,
      revealMode: 'slide',
      template: () => {
        const $drawerContent = (window as any).$('<div>').width(200).css('height', '100%');
        return $drawerContent;
      },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('drawer opened with expand reveal mode', async ({ page }) => {
    await createWidget(page, 'dxDrawer', {
      height: 400,
      opened: true,
      revealMode: 'expand',
      template: () => {
        const $drawerContent = (window as any).$('<div>').width(200).css('height', '100%');
        return $drawerContent;
      },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('disabled drawer', async ({ page }) => {
    await createWidget(page, 'dxDrawer', { height: 400, disabled: true });
    await a11yCheck(page, {}, '#container');
  });
});
